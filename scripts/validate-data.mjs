import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const dataFile = path.join(projectRoot, 'js', 'data.js');
const strictPlaceholders = process.argv.includes('--strict-placeholders');

const PLACEHOLDER_PATTERN = /(占位|placeholder|待补|todo|tbd)/i;
const LOCAL_ASSET_EXTENSIONS = /\.(png|jpe?g|webp|gif|svg|avif)$/i;
const TEXT_LIMITS = {
  siteTitle: 32,
  siteSubtitle: 120,
  entryName: 24,
  entryTitle: 40,
  entryShort: 72,
  tag: 16,
  infoTitle: 18,
  infoSummary: 96
};

function loadData() {
  const source = fs.readFileSync(dataFile, 'utf8');
  const sandbox = {
    window: {},
    console: { log() {}, warn() {}, error() {} }
  };

  vm.runInNewContext(
    `${source}\nthis.__EXPORTED__ = window.WIKI_DATA || { SITE, TYPES, FORMS, SECTIONS, ENTRIES, INFO_CARDS };`,
    sandbox,
    { filename: dataFile }
  );

  return sandbox.__EXPORTED__;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isExternalAsset(value) {
  return /^https?:\/\//i.test(String(value || ''));
}

function isLocalAsset(value) {
  return isNonEmptyString(value) && !isExternalAsset(value);
}

function checkFileExists(relativePath) {
  const fullPath = path.resolve(projectRoot, relativePath);
  return fs.existsSync(fullPath);
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function hasPlaceholder(value) {
  return PLACEHOLDER_PATTERN.test(stripHtml(value));
}

function extractRefs(value) {
  const refs = [];
  const pattern = /\{\{([^}]+)\}\}/g;
  const text = String(value || '');
  let match = pattern.exec(text);
  while (match) {
    refs.push(match[1].trim());
    match = pattern.exec(text);
  }
  return refs;
}

function pushLengthWarning(warnings, label, value, limit) {
  if (isNonEmptyString(value) && value.trim().length > limit) {
    warnings.push(`${label} 长度为 ${value.trim().length}，建议不超过 ${limit}`);
  }
}

function createReporter() {
  const errors = [];
  const warnings = [];
  return {
    errors,
    warnings,
    error(message) {
      errors.push(message);
    },
    warn(message) {
      warnings.push(message);
    }
  };
}

function validateCollectionIds(collection, label, reporter, idKey = 'id') {
  const seen = new Map();
  collection.forEach((item, index) => {
    const id = item?.[idKey];
    if (!isNonEmptyString(id)) {
      reporter.error(`${label}[${index}] 缺少有效的 ${idKey}`);
      return;
    }
    if (seen.has(id)) {
      reporter.error(`${label} 存在重复 ${idKey}: "${id}"`);
      return;
    }
    seen.set(id, true);
  });
}

function validateAssetField(ownerLabel, fieldLabel, fieldValue, reporter, required = true) {
  if (!isNonEmptyString(fieldValue)) {
    if (required) {
      reporter.error(`${ownerLabel} 缺少 ${fieldLabel}`);
    } else {
      reporter.warn(`${ownerLabel} 未填写 ${fieldLabel}`);
    }
    return;
  }

  if (isLocalAsset(fieldValue) && !LOCAL_ASSET_EXTENSIONS.test(fieldValue)) {
    reporter.warn(`${ownerLabel} 的 ${fieldLabel} 不是常见图片格式: ${fieldValue}`);
  }

  if (isLocalAsset(fieldValue) && !checkFileExists(fieldValue)) {
    reporter.error(`${ownerLabel} 的 ${fieldLabel} 文件不存在: ${fieldValue}`);
  }
}

function validateSite(site, reporter) {
  if (!site || typeof site !== 'object') {
    reporter.error('SITE 必须是对象');
    return;
  }

  ['title', 'subtitle', 'workshopUrl', 'feedbackQQ', 'copyright'].forEach((key) => {
    if (!isNonEmptyString(site[key])) {
      reporter.warn(`SITE.${key} 为空`);
    }
  });

  pushLengthWarning(reporter.warnings, 'SITE.title', site.title, TEXT_LIMITS.siteTitle);
  pushLengthWarning(reporter.warnings, 'SITE.subtitle', site.subtitle, TEXT_LIMITS.siteSubtitle);

  if (hasPlaceholder(site.title)) {
    reporter.warn('SITE.title 仍包含占位文案');
  }
  if (hasPlaceholder(site.subtitle)) {
    reporter.warn('SITE.subtitle 仍包含占位文案');
  }
}

function validateSections(sections, validTypes, reporter) {
  validateCollectionIds(sections, 'SECTIONS', reporter);
  sections.forEach((section, index) => {
    const label = `SECTIONS[${index}](${section.id || 'unknown'})`;
    if (!Array.isArray(section.types) || !section.types.length) {
      reporter.error(`${label} 必须包含至少一个 types`);
      return;
    }
    section.types.forEach((typeId) => {
      if (!validTypes.has(typeId)) {
        reporter.error(`${label} 引用了未知 type: "${typeId}"`);
      }
    });
    pushLengthWarning(reporter.warnings, `${label}.title`, section.title, TEXT_LIMITS.entryTitle);
    pushLengthWarning(reporter.warnings, `${label}.subtitle`, section.subtitle, TEXT_LIMITS.siteSubtitle);
  });
}

function validateInfoCards(cards, reporter) {
  validateCollectionIds(cards, 'INFO_CARDS', reporter);
  cards.forEach((card, index) => {
    const label = `INFO_CARDS[${index}](${card.id || 'unknown'})`;
    ['title', 'heading', 'summary', 'detail', 'icon'].forEach((field) => {
      if (!isNonEmptyString(card[field])) {
        reporter.error(`${label} 缺少 ${field}`);
      }
    });
    validateAssetField(label, 'icon', card.icon, reporter, true);
    pushLengthWarning(reporter.warnings, `${label}.title`, card.title, TEXT_LIMITS.infoTitle);
    pushLengthWarning(reporter.warnings, `${label}.summary`, stripHtml(card.summary), TEXT_LIMITS.infoSummary);
    if (hasPlaceholder(card.summary) || hasPlaceholder(card.detail)) {
      reporter.warn(`${label} 仍包含占位文案`);
    }
  });
}

function normalizeEntryTypes(entryType) {
  if (Array.isArray(entryType)) {
    return entryType.filter((typeId) => isNonEmptyString(typeId));
  }
  return isNonEmptyString(entryType) ? [entryType] : [];
}

function validateEntries(entries, validTypes, validForms, reporter) {
  validateCollectionIds(entries, 'ENTRIES', reporter);
  const entryIds = new Set(entries.map((entry) => entry.id).filter(Boolean));

  entries.forEach((entry, index) => {
    const label = `ENTRIES[${index}](${entry.id || 'unknown'})`;
    ['id', 'form', 'name'].forEach((field) => {
      if (!isNonEmptyString(entry[field])) {
        reporter.error(`${label} 缺少 ${field}`);
      }
    });

    const entryTypes = normalizeEntryTypes(entry.type);
    if (!entryTypes.length) {
      reporter.error(`${label} missing type`);
    }
    entryTypes.forEach((typeId) => {
      if (!validTypes.has(typeId)) {
        reporter.error(`${label} unknown type: "${typeId}"`);
      }
    });
    entry.type = entryTypes.includes('character') ? 'character' : (entryTypes[0] || '');

    if (!validTypes.has(entry.type)) {
      reporter.error(`${label} 使用了未知 type: "${entry.type}"`);
    }
    if (!validForms.has(entry.form)) {
      reporter.error(`${label} 使用了未知 form: "${entry.form}"`);
    }

    if (!Array.isArray(entry.tags)) {
      reporter.warn(`${label}.tags 建议使用数组`);
    } else {
      entry.tags.forEach((tag, tagIndex) => {
        if (!isNonEmptyString(tag)) {
          reporter.warn(`${label}.tags[${tagIndex}] 为空`);
        } else {
          pushLengthWarning(reporter.warnings, `${label}.tags[${tagIndex}]`, tag, TEXT_LIMITS.tag);
        }
      });
    }

    if (Array.isArray(entry.aliases)) {
      entry.aliases.forEach((alias, aliasIndex) => {
        if (!isNonEmptyString(alias)) {
          reporter.warn(`${label}.aliases[${aliasIndex}] 为空`);
        }
      });
    } else if (entry.aliases !== undefined) {
      reporter.warn(`${label}.aliases 应为字符串数组`);
    }

    if (Array.isArray(entry.searchTerms)) {
      entry.searchTerms.forEach((term, termIndex) => {
        if (!isNonEmptyString(term)) {
          reporter.warn(`${label}.searchTerms[${termIndex}] 为空`);
        }
      });
    } else if (entry.searchTerms !== undefined) {
      reporter.warn(`${label}.searchTerms 应为字符串数组`);
    }

    if (Array.isArray(entry.gallery)) {
      entry.gallery.forEach((assetPath, assetIndex) => {
        validateAssetField(label, `gallery[${assetIndex}]`, assetPath, reporter, false);
      });
    } else if (entry.gallery !== undefined) {
      reporter.error(`${label}.gallery should be an array`);
    }

    pushLengthWarning(reporter.warnings, `${label}.name`, entry.name, TEXT_LIMITS.entryName);
    pushLengthWarning(reporter.warnings, `${label}.title`, entry.title, TEXT_LIMITS.entryTitle);
    pushLengthWarning(reporter.warnings, `${label}.short`, stripHtml(entry.short), TEXT_LIMITS.entryShort);

    if (hasPlaceholder(entry.short) || hasPlaceholder(entry.detail) || hasPlaceholder(entry.title) || hasPlaceholder(entry.quote)) {
      reporter.warn(`${label} 仍包含占位文案`);
    }

    const refsToCheck = [
      ...extractRefs(entry.detail),
      ...(entry.abilities || []).flatMap((ability) => extractRefs(ability?.desc))
    ];

    refsToCheck.forEach((refId) => {
      if (!entryIds.has(refId)) {
        reporter.error(`${label} 引用了不存在的条目: "${refId}"`);
      }
    });

    if (Array.isArray(entry.related)) {
      entry.related.forEach((refId, relatedIndex) => {
        if (!entryIds.has(refId)) {
          reporter.error(`${label}.related[${relatedIndex}] 指向不存在的条目: "${refId}"`);
        }
      });
    } else if (entry.related !== undefined) {
      reporter.error(`${label}.related 应为条目 id 数组`);
    }

    if (entry.type === 'character') {
      validateAssetField(label, 'portrait', entry.portrait, reporter, true);
      validateAssetField(label, 'splash', entry.splash, reporter, true);
      if (!entry.baseStats || typeof entry.baseStats !== 'object') {
        reporter.error(`${label} 缺少 baseStats`);
      } else {
        ['health', 'hunger', 'sanity'].forEach((key) => {
          if (entry.baseStats[key] === undefined || entry.baseStats[key] === null || entry.baseStats[key] === '') {
            reporter.error(`${label}.baseStats.${key} 为空`);
          }
        });
      }
      ['pros', 'cons', 'abilities'].forEach((field) => {
        if (!Array.isArray(entry[field])) {
          reporter.error(`${label}.${field} 应为数组`);
        }
      });
      if (Array.isArray(entry.abilities)) {
        entry.abilities.forEach((ability, abilityIndex) => {
          const abilityLabel = `${label}.abilities[${abilityIndex}]`;
          if (!isNonEmptyString(ability?.name)) {
            reporter.warn(`${abilityLabel}.name 为空`);
          }
          if (!['active', 'passive'].includes(ability?.type)) {
            reporter.warn(`${abilityLabel}.type 建议为 active 或 passive`);
          }
          if (!isNonEmptyString(ability?.desc)) {
            reporter.warn(`${abilityLabel}.desc 为空`);
          }
        });
      }
    } else {
      validateAssetField(label, 'icon', entry.icon, reporter, true);
      if (entry.stats !== undefined && !Array.isArray(entry.stats)) {
        reporter.error(`${label}.stats 应为数组`);
      }
      if (Array.isArray(entry.stats)) {
        entry.stats.forEach((stat, statIndex) => {
          if (!isNonEmptyString(stat?.label) || !isNonEmptyString(String(stat?.value ?? ''))) {
            reporter.warn(`${label}.stats[${statIndex}] 缺少 label 或 value`);
          }
        });
      }
    }
  });
}

function printReport(reporter) {
  const { errors, warnings } = reporter;
  if (!errors.length && !warnings.length) {
    console.log('内容数据校验通过，没有发现错误或警告。');
    return;
  }

  if (errors.length) {
    console.log(`错误 ${errors.length} 项:`);
    errors.forEach((message) => console.log(`  - ${message}`));
  }

  if (warnings.length) {
    console.log(`警告 ${warnings.length} 项:`);
    warnings.forEach((message) => console.log(`  - ${message}`));
  }
}

function main() {
  const reporter = createReporter();
  const data = loadData();

  if (!data || typeof data !== 'object') {
    throw new Error('无法从 js/data.js 读取数据');
  }

  const { SITE, TYPES, FORMS, SECTIONS, ENTRIES, INFO_CARDS } = data;
  validateCollectionIds(TYPES, 'TYPES', reporter);
  validateCollectionIds(FORMS, 'FORMS', reporter);
  TYPES.forEach((type, index) => {
    const label = `TYPES[${index}](${type.id || 'unknown'})`;
    if (!isNonEmptyString(type.name)) {
      reporter.error(`${label} 缺少 name`);
    }
    if (!isNonEmptyString(type.icon)) {
      reporter.warn(`${label} 未填写 icon`);
    } else {
      validateAssetField(label, 'icon', type.icon, reporter, false);
    }
  });
  FORMS.forEach((form, index) => {
    const label = `FORMS[${index}](${form.id || 'unknown'})`;
    if (!isNonEmptyString(form.name)) {
      reporter.error(`${label} 缺少 name`);
    }
  });
  validateSite(SITE, reporter);

  const typeIds = new Set(TYPES.map((item) => item.id));
  const formIds = new Set(FORMS.map((item) => item.id));

  validateSections(SECTIONS, typeIds, reporter);
  validateEntries(ENTRIES, typeIds, formIds, reporter);
  validateInfoCards(INFO_CARDS, reporter);

  if (strictPlaceholders) {
    reporter.warnings
      .filter((message) => message.includes('占位文案'))
      .forEach((message) => reporter.error(`[strict-placeholders] ${message}`));
  }

  printReport(reporter);

  if (reporter.errors.length) {
    process.exitCode = 1;
  }
}

main();
