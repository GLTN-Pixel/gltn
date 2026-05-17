'use strict';

(() => {
  const DATA = window.WIKI_DATA || {};
  const SITE = DATA.SITE || {};
  const ASSETS = DATA.ASSETS || {};
  const UI = DATA.UI || {};
  const TYPES = DATA.TYPES || [];
  const FORMS = DATA.FORMS || [];
  const SECTIONS = DATA.SECTIONS || [];
  const ENTRIES = DATA.ENTRIES || [];
  const INFO_CARDS = DATA.INFO_CARDS || [];

  const initialSearchParams = new URLSearchParams(window.location.search);

  const state = {
    type: 'all',
    form: 'all',
    query: '',
    editorMode: initialSearchParams.get('editor') === '1',
    lastFocus: null,
    activeModal: null
  };

  const refs = {
    body: document.body,
    metaDescription: document.querySelector('meta[name="description"]'),
    skipLink: document.querySelector('#skip-link'),
    heroEyebrow: document.querySelector('#hero-eyebrow'),
    heroTrack: document.querySelector('#hero-track'),
    siteTitle: document.querySelector('#site-title'),
    siteSubtitle: document.querySelector('#site-subtitle'),
    workshopLink: document.querySelector('#workshop-link'),
    filterBarNode: document.querySelector('#filter-bar'),
    typeDropdownBtn: document.querySelector('#type-dropdown-btn'),
    formDropdownBtn: document.querySelector('#form-dropdown-btn'),
    typeDropdownLabel: document.querySelector('#type-dropdown-label'),
    formDropdownLabel: document.querySelector('#form-dropdown-label'),
    typeDropdownPanel: document.querySelector('#type-dropdown-panel'),
    formDropdownPanel: document.querySelector('#form-dropdown-panel'),
    filterSheetOverlay: document.querySelector('#filter-sheet-overlay'),
    clearFiltersBtn: document.querySelector('#clear-filters-btn'),
    searchLabelText: document.querySelector('#search-label-text'),
    searchInput: document.querySelector('#search-input'),
    searchClearBtn: document.querySelector('#search-clear-btn'),
    resultsStatus: document.querySelector('#results-status'),
    editorStatus: document.querySelector('#editor-status'),
    sectionsRoot: document.querySelector('#sections-root'),
    bgBloodHero: document.querySelector('#bg-blood-hero'),
    bgBloodSection1: document.querySelector('#bg-blood-section-1'),
    bgBloodSection2: document.querySelector('#bg-blood-section-2'),
    bgBloodFooter: document.querySelector('#bg-blood-footer'),
    infoHeading: document.querySelector('#info-heading'),
    infoSubtitle: document.querySelector('#info-subtitle'),
    infoCardsRoot: document.querySelector('#info-cards-root'),
    footerSiteTitle: document.querySelector('#footer-site-title'),
    footerLinksTitle: document.querySelector('#footer-links-title'),
    footerDonationTitle: document.querySelector('#footer-donation-title'),
    feedbackLabel: document.querySelector('#feedback-label'),
    feedbackQQ: document.querySelector('#feedback-qq'),
    footerWorkshop: document.querySelector('#footer-workshop'),
    copyrightText: document.querySelector('#copyright-text'),
    donationQr: document.querySelector('#donation-qr'),
    donationQrFallback: document.querySelector('#donation-qr-fallback'),
    modal: document.querySelector('#modal'),
    modalContent: document.querySelector('.modal__content'),
    modalCloseBtn: document.querySelector('#modal-close-btn'),
    modalBody: document.querySelector('#modal-body'),
    modalCacheTip: document.querySelector('#modal-cache-tip'),
    liveRegion: document.querySelector('#live-region')
  };

  const entryMap = new Map(ENTRIES.map((entry) => [entry.id, entry]));
  const typeMap = new Map(TYPES.map((type) => [type.id, type]));
  const formMap = new Map(FORMS.map((form) => [form.id, form]));
  const infoCardMap = new Map(INFO_CARDS.map((card) => [card.id, card]));
  const typeIconAvailability = new Map();

  const PLACEHOLDER_PATTERN = /(占位|placeholder|待补|todo|tbd)/i;
  const BLOOD_VARIANTS = ['splatter', 'streak', 'drip', 'smear', 'handprint', 'gash'];
  const BLOOD_POSITIONS_COMPACT = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-edge'];
  const BLOOD_POSITIONS_CHARACTER = ['bottom-left', 'bottom-right', 'top-edge'];
  const TYPE_ICON_FALLBACKS = UI.typeIconFallbacks || {
    all: '全',
    character: '角',
    weapon: '武',
    equipment: '装',
    item: '物',
    building: '建',
    summon: '召',
    mechanic: '机'
  };
  const BLOOD_SVG = {
    splatter: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><ellipse cx="50" cy="50" rx="14" ry="11" transform="rotate(-15 50 50)"/><circle cx="68" cy="42" r="4"/><circle cx="32" cy="58" r="3.5"/><circle cx="76" cy="58" r="2.5"/><circle cx="42" cy="32" r="3"/><circle cx="60" cy="72" r="2"/><circle cx="24" cy="44" r="1.8"/><circle cx="82" cy="48" r="1.5"/><circle cx="55" cy="22" r="1.2"/><ellipse cx="38" cy="68" rx="3" ry="1.5" transform="rotate(40 38 68)"/></g></svg>`,
    streak: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path d="M 10 30 Q 40 35, 75 55 Q 82 60, 88 68" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill="none"/><circle cx="88" cy="70" r="4"/><circle cx="80" cy="75" r="2.5"/><circle cx="92" cy="76" r="2"/><circle cx="14" cy="28" r="2.5"/><ellipse cx="50" cy="44" rx="4" ry="1.8" transform="rotate(20 50 44)"/><circle cx="68" cy="52" r="2"/></g></svg>`,
    drip: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path d="M 22 0 L 22 38 Q 22 44, 25 44 Q 28 44, 28 38 L 28 0 Z"/><circle cx="25" cy="46" r="3.5"/><path d="M 50 0 L 50 58 Q 50 65, 53 65 Q 56 65, 56 58 L 56 0 Z"/><circle cx="53" cy="68" r="4.5"/><path d="M 78 0 L 78 28 Q 78 33, 80 33 Q 82 33, 82 28 L 82 0 Z"/><circle cx="80" cy="36" r="2.5"/><circle cx="40" cy="24" r="1.5"/><circle cx="68" cy="40" r="1.5"/></g></svg>`,
    smear: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><ellipse cx="50" cy="50" rx="32" ry="14" transform="rotate(-20 50 50)" opacity="0.85"/><ellipse cx="62" cy="46" rx="22" ry="8" transform="rotate(-25 62 46)" opacity="0.7"/><ellipse cx="38" cy="56" rx="18" ry="6" transform="rotate(-15 38 56)" opacity="0.75"/><circle cx="80" cy="38" r="2.5"/><circle cx="22" cy="64" r="2"/><ellipse cx="72" cy="42" rx="4" ry="1.5" transform="rotate(-30 72 42)"/></g></svg>`,
    handprint: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><ellipse cx="50" cy="62" rx="22" ry="18" transform="rotate(-8 50 62)"/><path d="M 68 58 Q 72 50, 75 42 Q 76 38, 73 38 Q 70 40, 67 48 Q 65 54, 68 58 Z"/><path d="M 60 48 Q 62 32, 64 18 Q 65 12, 61 12 Q 58 14, 56 30 Q 55 42, 60 48 Z"/><path d="M 50 44 Q 50 28, 50 14 Q 50 8, 47 8 Q 44 10, 44 26 Q 44 38, 50 44 Z"/><path d="M 40 46 Q 38 32, 35 22 Q 33 16, 30 18 Q 29 22, 32 34 Q 34 42, 40 46 Z"/><path d="M 32 52 Q 28 44, 22 38 Q 18 36, 17 40 Q 18 44, 24 50 Q 28 54, 32 52 Z"/><circle cx="42" cy="82" r="2.5"/><circle cx="55" cy="84" r="2"/><circle cx="62" cy="80" r="1.5"/></g></svg>`,
    gash: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path d="M 12 52 Q 25 36, 50 32 Q 75 28, 88 42 Q 75 50, 50 50 Q 25 50, 12 52 Z"/><path d="M 18 48 Q 35 40, 50 39 Q 70 38, 84 44" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.6"/><ellipse cx="48" cy="58" rx="6" ry="3" opacity="0.85"/><path d="M 50 60 Q 52 68, 53 74 Q 54 78, 51 78 Q 48 76, 48 70 Q 48 64, 50 60 Z"/><circle cx="44" cy="80" r="2.5"/><circle cx="56" cy="82" r="2"/><ellipse cx="36" cy="62" rx="3" ry="1.5" transform="rotate(15 36 62)" opacity="0.7"/><ellipse cx="62" cy="58" rx="3.5" ry="1.5" transform="rotate(-10 62 58)" opacity="0.7"/><circle cx="30" cy="68" r="1.5" opacity="0.6"/><circle cx="68" cy="64" r="1.5" opacity="0.6"/></g></svg>`
  };

  let openDropdown = null;

  function text(key, fallback = '') {
    const value = UI[key];
    return typeof value === 'string' ? value : fallback;
  }

  function template(value, replacements = {}) {
    return String(value || '').replace(/\{([^}]+)\}/g, (match, token) => {
      const key = token.trim();
      return replacements[key] === undefined ? '' : String(replacements[key]);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (textContent !== undefined) {
      element.textContent = textContent;
    }
    return element;
  }

  function stringHasValue(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function stripHtml(value) {
    return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function isPlaceholderText(value) {
    return PLACEHOLDER_PATTERN.test(stripHtml(value));
  }

  function isExternalAsset(path) {
    return /^https?:\/\//i.test(String(path || ''));
  }

  function toCssUrl(path) {
    return `url("${String(path || '').replace(/"/g, '\\"')}")`;
  }

  function applyBackground(element, path) {
    if (!element || !stringHasValue(path)) {
      return;
    }
    element.style.backgroundImage = toCssUrl(path);
  }

  function getTypeMeta(typeId) {
    return typeMap.get(typeId) || { id: typeId, name: typeId, icon: '' };
  }

  function getEntryTypes(entry) {
    if (Array.isArray(entry?.type)) {
      return entry.type.filter((typeId) => stringHasValue(typeId));
    }
    return stringHasValue(entry?.type) ? [entry.type.trim()] : [];
  }

  function getPrimaryTypeId(entry) {
    return getEntryTypes(entry)[0] || 'item';
  }

  function entryHasType(entry, typeId) {
    return getEntryTypes(entry).includes(typeId);
  }

  function isCharacterEntry(entry) {
    return entryHasType(entry, 'character');
  }

  function getFormMeta(formId) {
    return formMap.get(formId) || { id: formId, name: formId, color: null };
  }

  function hashToIndex(seed, length) {
    let hash = 2166136261;
    const source = String(seed);
    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash >>> 0) % length;
  }

  function bindImageFallback(image, wrapper, fallbackLabel) {
    if (!image || !wrapper) {
      return;
    }

    const fallback = wrapper.querySelector('[data-fallback-label]');
    if (fallback && stringHasValue(fallbackLabel)) {
      fallback.textContent = fallbackLabel;
    }

    const src = image.getAttribute('src');
    if (!stringHasValue(src)) {
      wrapper.classList.add('is-missing');
      return;
    }

    image.addEventListener('error', () => {
      wrapper.classList.add('is-missing');
    }, { once: true });

    image.addEventListener('load', () => {
      wrapper.classList.remove('is-missing');
    }, { once: true });
  }

  function getTextWithFallback(value, fallback) {
    const resolved = String(value || '').trim();
    if (!resolved) {
      return fallback;
    }
    if (!state.editorMode && isPlaceholderText(resolved)) {
      return fallback;
    }
    return resolved;
  }

  function uniqueAssetPaths(values) {
    const seen = new Set();
    return values.reduce((result, value) => {
      const path = String(value || '').trim();
      if (!path || seen.has(path)) {
        return result;
      }
      seen.add(path);
      result.push(path);
      return result;
    }, []);
  }

  function getEntryGalleryImages(entry) {
    const gallery = Array.isArray(entry.gallery) ? entry.gallery : [];
    const seededImages = isCharacterEntry(entry)
      ? [entry.splash, ...gallery]
      : [entry.icon, ...gallery];
    return uniqueAssetPaths(seededImages);
  }

  function renderTextDetail(value, fallback) {
    const resolved = String(value || '').trim();
    if (!resolved || (!state.editorMode && isPlaceholderText(resolved))) {
      return `<span class="empty-copy">${escapeHtml(fallback)}</span>`;
    }
    return parseEntryRefs(resolved);
  }

  function renderTrustedHtmlDetail(value, fallback) {
    const resolved = String(value || '').trim();
    if (!resolved || (!state.editorMode && isPlaceholderText(resolved))) {
      return `<p class="modal-empty-block">${escapeHtml(fallback)}</p>`;
    }
    return parseTrustedHtmlRefs(resolved);
  }

  function formatStatValue(value) {
    return value === undefined || value === null || value === '' ? '—' : value;
  }

  function getSearchFields(entry) {
    return [
      entry.name,
      entry.title,
      entry.short,
      stripHtml(entry.detail),
      entry.quote,
      ...(entry.tags || []),
      ...(entry.aliases || []),
      ...(entry.searchTerms || [])
    ];
  }

  function getVisibleEntries() {
    const query = state.query.trim().toLowerCase();
    return ENTRIES.filter((entry) => {
      const matchType = state.type === 'all' || entryHasType(entry, state.type);
      const matchForm = state.form === 'all' || entry.form === state.form;
      const matchQuery = !query || getSearchFields(entry).some((field) => String(field || '').toLowerCase().includes(query));
      return matchType && matchForm && matchQuery;
    });
  }

  function getActiveFilterTokens() {
    const tokens = [];
    if (state.type !== 'all') {
      tokens.push(template(text('filterTokenType', '类型：{value}'), { value: getTypeMeta(state.type).name }));
    }
    if (state.form !== 'all') {
      tokens.push(template(text('filterTokenForm', '形态：{value}'), { value: getFormMeta(state.form).name }));
    }
    if (state.query.trim()) {
      tokens.push(template(text('filterTokenSearch', '搜索：“{value}”'), { value: state.query.trim() }));
    }
    return tokens;
  }

  function hasActiveFilters() {
    return getActiveFilterTokens().length > 0;
  }

  function getRequiredAssets(entry) {
    if (isCharacterEntry(entry)) {
      return [
        { key: 'portrait', label: text('assetFallbackPortrait', '{name} 立绘待提供') },
        { key: 'splash', label: text('assetFallbackSplash', '{name} 横幅待提供') }
      ];
    }
    return [{ key: 'icon', label: text('assetFallbackIcon', '{name} 图标待提供') }];
  }

  function getEntryIssues(entry) {
    const issues = [];
    const missingAssets = getRequiredAssets(entry).filter((asset) => !stringHasValue(entry[asset.key]));
    if (missingAssets.length) {
      issues.push(text('missingImageIssueLabel', '缺图'));
    }

    const textFields = [
      entry.title,
      entry.short,
      entry.detail,
      entry.quote,
      ...(entry.pros || []),
      ...(entry.cons || []),
      ...(entry.abilities || []).map((ability) => ability?.desc)
    ];
    if (textFields.some((field) => isPlaceholderText(field))) {
      issues.push(text('placeholderIssueLabel', '待补文案'));
    }
    return issues;
  }

  function getEditorIssueCount() {
    return ENTRIES.filter((entry) => getEntryIssues(entry).length).length;
  }

  function getModalHash() {
    if (!state.activeModal) {
      return '';
    }
    return `${state.activeModal.kind}:${state.activeModal.id}`;
  }

  function buildUrl() {
    const params = new URLSearchParams();
    if (state.type !== 'all') {
      params.set('type', state.type);
    }
    if (state.form !== 'all') {
      params.set('form', state.form);
    }
    if (state.query.trim()) {
      params.set('q', state.query.trim());
    }
    if (state.editorMode) {
      params.set('editor', '1');
    }

    const search = params.toString();
    const hash = getModalHash();
    return `${window.location.pathname}${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}`;
  }

  function syncUrl(options = {}) {
    const { push = false } = options;
    const method = push ? 'pushState' : 'replaceState';
    window.history[method]({}, '', buildUrl());
  }

  function parseRouteState() {
    const params = new URLSearchParams(window.location.search);
    const nextType = params.get('type');
    const nextForm = params.get('form');
    const nextQuery = params.get('q') || '';
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    let modal = null;

    if (hash.startsWith('entry:')) {
      const id = hash.slice('entry:'.length);
      if (entryMap.has(id)) {
        modal = { kind: 'entry', id };
      }
    } else if (hash.startsWith('info:')) {
      const id = hash.slice('info:'.length);
      if (infoCardMap.has(id)) {
        modal = { kind: 'info', id };
      }
    }

    return {
      type: typeMap.has(nextType) ? nextType : 'all',
      form: formMap.has(nextForm) ? nextForm : 'all',
      query: nextQuery,
      editorMode: params.get('editor') === '1',
      modal
    };
  }

  function announce(message) {
    if (!refs.liveRegion) {
      return;
    }
    refs.liveRegion.textContent = '';
    window.setTimeout(() => {
      refs.liveRegion.textContent = message;
    }, 20);
  }

  function resetFilters(options = {}) {
    const { sync = true } = options;
    state.type = 'all';
    state.form = 'all';
    state.query = '';
    refs.searchInput.value = '';
    renderDropdownPanels();
    updateDropdownLabels();
    renderSections();
    if (sync) {
      syncUrl();
    }
  }

  function updateSearchUi() {
    refs.searchClearBtn.hidden = !state.query.trim();
    refs.clearFiltersBtn.hidden = !hasActiveFilters();
  }

  function updateResultsStatus(visibleEntries) {
    const details = getActiveFilterTokens();
    const detailText = details.length ? ` · ${details.join(' · ')}` : '';
    refs.resultsStatus.textContent = template(text('resultsStatusTemplate', '当前显示 {visible} / {total} 个条目{details}'), {
      visible: visibleEntries.length,
      total: ENTRIES.length,
      details: detailText
    });
  }

  function updateEditorStatus() {
    refs.body.classList.toggle('is-editor-mode', state.editorMode);
    if (!state.editorMode) {
      refs.editorStatus.hidden = true;
      refs.editorStatus.textContent = '';
      return;
    }

    const count = getEditorIssueCount();
    refs.editorStatus.hidden = false;
    refs.editorStatus.textContent = count
      ? template(text('editorStatusIssues', '编辑模式已开启：{count} 个条目仍有缺图或占位文案，建议运行 {command}'), {
          count,
          command: 'node scripts/validate-data.mjs'
        })
      : text('editorStatusClean', '编辑模式已开启：当前条目没有检测到缺图或占位文案。');
  }

  function getAssetFallbackLabel(entry, kind) {
    const templates = {
      portrait: text('assetFallbackPortrait', '{name} 立绘待提供'),
      splash: text('assetFallbackSplash', '{name} 横幅待提供'),
      icon: text('assetFallbackIcon', '{name} 图标待提供')
    };
    return template(templates[kind] || templates.icon, { name: entry.name || text('pendingEntryNameFallback', '条目待命名') });
  }

  function getBloodConfig(entry) {
    if (entry.bloodOverride) {
      const override = entry.bloodOverride;
      const variant = BLOOD_VARIANTS.includes(override.variant) ? override.variant : null;
      if (variant) {
        const positions = isCharacterEntry(entry) ? BLOOD_POSITIONS_CHARACTER : BLOOD_POSITIONS_COMPACT;
        const position = override.position && positions.includes(override.position)
          ? override.position
          : positions[hashToIndex(`${entry.id}:p`, positions.length)];
        const rotation = typeof override.rotation === 'number'
          ? override.rotation
          : hashToIndex(`${entry.id}:r`, 360);
        let finalPosition = position;
        if (variant === 'drip') {
          finalPosition = 'top-edge';
        } else if (finalPosition === 'top-edge') {
          finalPosition = 'top-left';
        }
        return { variant, position: finalPosition, rotation };
      }
    }

    const positions = isCharacterEntry(entry) ? BLOOD_POSITIONS_CHARACTER : BLOOD_POSITIONS_COMPACT;
    const variant = BLOOD_VARIANTS[hashToIndex(`${entry.id}:v`, BLOOD_VARIANTS.length)];
    const rotation = hashToIndex(`${entry.id}:r`, 360);
    let position = positions[hashToIndex(`${entry.id}:p`, positions.length)];
    if (variant === 'drip') {
      position = 'top-edge';
    } else if (position === 'top-edge') {
      position = 'top-left';
    }
    return { variant, position, rotation };
  }

  function createBloodStain(entry) {
    const config = getBloodConfig(entry);
    const stain = createElement('span', `blood-stain blood-stain--${config.variant} blood-stain--${config.position}`);
    stain.setAttribute('aria-hidden', 'true');
    stain.style.setProperty('--blood-rotation', `${config.rotation}deg`);
    stain.innerHTML = BLOOD_SVG[config.variant];
    return stain;
  }

  function createFormSign(entry, variant) {
    const signPath = ASSETS.signs?.[entry.form];
    if (!stringHasValue(signPath)) {
      return null;
    }
    const sign = createElement('span', `entry-form-sign entry-form-sign--${variant}`);
    sign.setAttribute('aria-hidden', 'true');
    sign.style.backgroundImage = toCssUrl(signPath);
    return sign;
  }

  async function primeTypeIcons() {
    const iconPaths = [...new Set(TYPES.map((type) => type.icon).filter(Boolean))];
    await Promise.all(iconPaths.map(async (iconPath) => {
      try {
        const response = await fetch(iconPath, { method: 'HEAD' });
        typeIconAvailability.set(iconPath, response.ok);
      } catch (error) {
        typeIconAvailability.set(iconPath, false);
      }
    }));
  }

  function createTypeIcon(type) {
    if (type.icon && typeIconAvailability.get(type.icon) !== false) {
      const icon = document.createElement('img');
      icon.className = 'entry-card__type-icon';
      icon.alt = type.name;
      icon.src = type.icon;
      icon.addEventListener('error', () => icon.remove(), { once: true });
      return icon;
    }

    const fallback = createElement('span', 'entry-card__type-fallback', TYPE_ICON_FALLBACKS[type.id] || type.name.slice(0, 1));
    fallback.setAttribute('aria-hidden', 'true');
    return fallback;
  }

  function formatAbilityType(type) {
    return type === 'active' ? '主动' : '被动';
  }

  function parseEntryRefs(detail) {
    return escapeHtml(detail).replace(/\{\{([^}]+)\}\}/g, (match, rawId) => {
      const id = rawId.trim();
      const entry = entryMap.get(id);
      if (!entry) {
        return `<span class="unknown-ref">未知引用：${escapeHtml(id)}</span>`;
      }
      return `<a class="keyword-link" href="#entry:${escapeHtml(id)}" data-entry-ref="${escapeHtml(id)}">${escapeHtml(entry.name)}</a>`;
    });
  }

  function parseTrustedHtmlRefs(html) {
    return String(html).replace(/\{\{([^}]+)\}\}/g, (match, rawId) => {
      const id = rawId.trim();
      const entry = entryMap.get(id);
      if (!entry) {
        return `<span class="unknown-ref">未知引用：${escapeHtml(id)}</span>`;
      }
      return `<a class="keyword-link" href="#entry:${escapeHtml(id)}" data-entry-ref="${escapeHtml(id)}">${escapeHtml(entry.name)}</a>`;
    });
  }

  function isDamageStat(label) {
    const source = String(label).toLowerCase();
    const keywords = ['伤害', '攻击', '暴击', 'damage', 'atk'];
    return keywords.some((keyword) => source.includes(keyword));
  }

  function renderHeroMedia() {
    refs.heroTrack.replaceChildren();
    const items = Array.isArray(ASSETS.heroCovers)
      ? ASSETS.heroCovers.filter((coverPath) => stringHasValue(coverPath))
      : [];
    const visibleItems = items.length ? items : [''];
    const slideCount = visibleItems.length;
    const slideWidth = 100 / slideCount;
    const cycleShift = ((slideCount - 1) / slideCount) * 100;
    const duration = Math.max(slideCount * 3.5, 28);

    refs.heroTrack.style.width = `${slideCount * 100}%`;
    refs.heroTrack.style.setProperty('--hero-cycle-shift', `${cycleShift}%`);
    refs.heroTrack.style.transform = 'translateX(0)';
    refs.heroTrack.style.animation = slideCount > 1
      ? `hero-scroll-dynamic ${duration}s steps(${slideCount - 1}) infinite`
      : 'none';

    visibleItems.forEach((coverPath) => {
      const slide = createElement('span', 'hero__slide');
      slide.style.flex = `0 0 ${slideWidth}%`;
      if (stringHasValue(coverPath)) {
        slide.style.backgroundImage = toCssUrl(coverPath);
      }
      refs.heroTrack.append(slide);
    });
  }

  function renderSiteMeta() {
    const root = document.documentElement;
    document.title = `${getTextWithFallback(SITE.title, 'Wiki')} ${text('pageTitleSuffix', 'Mod Wiki')}`.trim();
    refs.metaDescription.setAttribute('content', getTextWithFallback(UI.metaDescription, text('pendingSiteInfoFallback', '资料正在整理中。')));
    refs.skipLink.textContent = text('skipLinkLabel', '跳到主要内容');
    refs.heroEyebrow.textContent = text('heroEyebrow', 'Mod Wiki');
    refs.siteTitle.textContent = getTextWithFallback(SITE.title, 'Wiki');
    refs.siteSubtitle.textContent = getTextWithFallback(SITE.subtitle, text('pendingSiteInfoFallback', '资料正在整理中。'));
    refs.workshopLink.href = SITE.workshopUrl || '#';
    refs.workshopLink.textContent = text('workshopLabel', 'Steam 创意工坊');
    refs.filterBarNode.setAttribute('aria-label', text('filterBarAriaLabel', '类型、形态与搜索'));
    refs.searchLabelText.textContent = text('searchLabel', '搜索条目');
    refs.searchInput.setAttribute('placeholder', text('searchPlaceholder', '搜索名称、标签、描述…'));
    refs.searchClearBtn.setAttribute('aria-label', text('searchClearLabel', '清空搜索词'));
    refs.clearFiltersBtn.textContent = text('clearFiltersLabel', '清空筛选');
    refs.infoHeading.textContent = text('infoSectionTitle', '说明');
    refs.infoSubtitle.textContent = text('infoSectionSubtitle', '');
    refs.footerSiteTitle.textContent = text('footerSiteTitle', '站名');
    refs.footerLinksTitle.textContent = text('footerLinksTitle', '链接');
    refs.footerDonationTitle.textContent = text('footerDonationTitle', '打赏');
    refs.feedbackLabel.textContent = `${text('footerFeedbackLabel', '反馈群')}：`;
    refs.feedbackQQ.textContent = getTextWithFallback(SITE.feedbackQQ, text('pendingFeedbackFallback', '待补充'));
    refs.footerWorkshop.href = SITE.workshopUrl || '#';
    refs.footerWorkshop.textContent = text('footerWorkshopLabel', 'Steam 创意工坊');
    refs.copyrightText.textContent = getTextWithFallback(SITE.copyright, text('pendingCopyrightFallback', '内容版权信息待补充'));
    refs.donationQr.src = ASSETS.donationQr || '';
    refs.donationQr.alt = text('donationQrAlt', '二维码');
    refs.donationQrFallback.textContent = text('donationQrFallback', '二维码待提供');
    refs.modalCloseBtn.setAttribute('aria-label', text('modalCloseLabel', '关闭弹窗'));
    refs.modalCacheTip.textContent = text('modalCacheTip', '');
    root.style.setProperty('--asset-armor-texture', stringHasValue(ASSETS.textures?.armor) ? toCssUrl(ASSETS.textures.armor) : 'none');
    root.style.setProperty('--asset-divider-chain', stringHasValue(ASSETS.textures?.dividerChain) ? toCssUrl(ASSETS.textures.dividerChain) : 'none');
    root.style.setProperty('--asset-info-bg', stringHasValue(ASSETS.textures?.infoBackground) ? toCssUrl(ASSETS.textures.infoBackground) : 'none');
    root.style.setProperty('--asset-footer-bg', stringHasValue(ASSETS.textures?.footerBackground) ? toCssUrl(ASSETS.textures.footerBackground) : 'none');
    root.style.setProperty('--asset-modal-parchment', stringHasValue(ASSETS.textures?.modalParchment) ? toCssUrl(ASSETS.textures.modalParchment) : 'none');

    renderHeroMedia();
    applyBackground(refs.bgBloodHero, ASSETS.backgroundBlood?.hero);
    applyBackground(refs.bgBloodSection1, ASSETS.backgroundBlood?.section1);
    applyBackground(refs.bgBloodSection2, ASSETS.backgroundBlood?.section2);
    applyBackground(refs.bgBloodFooter, ASSETS.backgroundBlood?.footer);
    bindImageFallback(refs.donationQr, refs.donationQr.closest('.qr-frame'), text('assetFallbackDonationQr', '赞赏二维码待提供'));
  }

  function updateDropdownLabels() {
    const currentType = getTypeMeta(state.type);
    const currentForm = getFormMeta(state.form);
    refs.typeDropdownLabel.textContent = state.type === 'all'
      ? text('typeDefaultLabel', '类型')
      : `${text('typeDefaultLabel', '类型')} · ${currentType.name}`;
    refs.formDropdownLabel.textContent = state.form === 'all'
      ? text('formDefaultLabel', '形态')
      : `${text('formDefaultLabel', '形态')} · ${currentForm.name}`;
  }

  function createSheetHeader(title) {
    const header = createElement('div', 'filter-sheet__header');
    const heading = createElement('h3', 'filter-sheet__title', title);
    const close = createElement('button', 'filter-sheet__close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', text('closeSheetLabel', '关闭筛选面板'));
    close.addEventListener('click', closeDropdown);
    header.append(heading, close);
    return header;
  }

  function renderDropdownPanels() {
    refs.typeDropdownPanel.replaceChildren();
    refs.formDropdownPanel.replaceChildren();

    refs.typeDropdownPanel.append(createSheetHeader(text('typeSheetTitle', '选择类型')));
    TYPES.forEach((type) => {
      const option = createElement(
        'button',
        `filter-dropdown-option${state.type === type.id ? ' filter-dropdown-option--active' : ''}`,
        type.name
      );
      option.type = 'button';
      option.dataset.typeId = type.id;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', String(state.type === type.id));
      option.addEventListener('click', () => {
        state.type = type.id;
        closeDropdown();
        updateDropdownLabels();
        renderDropdownPanels();
        renderSections();
        syncUrl();
      });
      refs.typeDropdownPanel.append(option);
    });

    refs.formDropdownPanel.append(createSheetHeader(text('formSheetTitle', '选择形态')));
    FORMS.forEach((form) => {
      const option = createElement(
        'button',
        `filter-dropdown-option${state.form === form.id ? ' filter-dropdown-option--active' : ''}`,
        form.name
      );
      option.type = 'button';
      option.dataset.formId = form.id;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', String(state.form === form.id));
      option.style.setProperty('--form-color', form.color || 'var(--text-faint)');
      option.addEventListener('click', () => {
        state.form = form.id;
        closeDropdown();
        updateDropdownLabels();
        renderDropdownPanels();
        renderSections();
        syncUrl();
      });
      refs.formDropdownPanel.append(option);
    });
  }

  function openDropdownPanel(which) {
    closeDropdown();
    const panel = which === 'type' ? refs.typeDropdownPanel : refs.formDropdownPanel;
    const button = which === 'type' ? refs.typeDropdownBtn : refs.formDropdownBtn;
    panel.hidden = false;
    button.setAttribute('aria-expanded', 'true');

    if (window.matchMedia('(max-width: 600px)').matches) {
      refs.filterSheetOverlay.hidden = false;
    } else {
      const buttonRect = button.getBoundingClientRect();
      const barRect = refs.filterBarNode.getBoundingClientRect();
      panel.style.left = `${buttonRect.left - barRect.left}px`;
    }

    openDropdown = which;
    window.setTimeout(() => {
      panel.querySelector('[role="option"]')?.focus();
    }, 20);
  }

  function closeDropdown() {
    if (!openDropdown) {
      return;
    }

    const panel = openDropdown === 'type' ? refs.typeDropdownPanel : refs.formDropdownPanel;
    const button = openDropdown === 'type' ? refs.typeDropdownBtn : refs.formDropdownBtn;
    panel.hidden = true;
    panel.style.left = '';
    button.setAttribute('aria-expanded', 'false');
    refs.filterSheetOverlay.hidden = true;
    openDropdown = null;
  }

  function toggleDropdown(which) {
    if (openDropdown === which) {
      closeDropdown();
      return;
    }
    openDropdownPanel(which);
  }

  function syncDropdownLayout() {
    if (!openDropdown) {
      return;
    }
    if (window.matchMedia('(max-width: 600px)').matches) {
      refs.filterSheetOverlay.hidden = false;
      return;
    }

    const panel = openDropdown === 'type' ? refs.typeDropdownPanel : refs.formDropdownPanel;
    const button = openDropdown === 'type' ? refs.typeDropdownBtn : refs.formDropdownBtn;
    const buttonRect = button.getBoundingClientRect();
    const barRect = refs.filterBarNode.getBoundingClientRect();
    panel.style.left = `${buttonRect.left - barRect.left}px`;
    refs.filterSheetOverlay.hidden = true;
  }

  function createEmptyState() {
    const section = createElement('section', 'empty-state');
    const title = createElement('h2', 'empty-state__title', text('emptyResultsTitle', '没有找到匹配的内容'));
    const copy = createElement(
      'p',
      'empty-state__copy',
      hasActiveFilters()
        ? text('emptyResultsWithFilters', '换一个关键词，或者清空筛选条件再试试。')
        : text('emptyResultsWithoutContent', '当前还没有可展示的条目。')
    );

    const metaText = hasActiveFilters()
      ? template(text('emptyResultsMetaWithFilters', '当前条件：{filters}'), { filters: getActiveFilterTokens().join(' · ') })
      : text('emptyResultsMetaWithoutContent', '请先在 js/data.js 中补充内容。');
    const meta = createElement('p', 'empty-state__meta', metaText);

    section.append(title, copy, meta);

    if (hasActiveFilters()) {
      const actions = createElement('div', 'empty-state__actions');
      const button = createElement('button', 'empty-state__button', text('emptyResetLabel', '清空筛选'));
      button.type = 'button';
      button.dataset.resetFilters = 'true';
      actions.append(button);
      section.append(actions);
    }

    return section;
  }

  function renderSections() {
    const visibleEntries = getVisibleEntries();
    refs.sectionsRoot.replaceChildren();
    let renderedSections = 0;

    SECTIONS.forEach((section) => {
      const items = visibleEntries.filter((entry) => getEntryTypes(entry).some((typeId) => section.types.includes(typeId)));
      if (!items.length) {
        return;
      }

      if (renderedSections > 0) {
        const divider = createElement('div', 'section-divider');
        divider.setAttribute('aria-hidden', 'true');
        refs.sectionsRoot.append(divider);
      }

      refs.sectionsRoot.append(createSectionElement(section, items));
      renderedSections += 1;
    });

    if (!refs.sectionsRoot.children.length) {
      refs.sectionsRoot.append(createEmptyState());
    }

    updateResultsStatus(visibleEntries);
    updateSearchUi();
    updateEditorStatus();
  }

  function createSectionElement(section, items) {
    const element = createElement('section', 'entry-section');
    element.dataset.sectionId = section.id;
    if (section.types.length === 1 && section.types[0] === 'character') {
      element.classList.add('entry-section--characters');
    }

    element.innerHTML = `
      <header class="entry-section__header">
        <h2 class="entry-section__title">${escapeHtml(getTextWithFallback(section.title, text('pendingSectionTitleFallback', '分区标题待补充')))}</h2>
        <p class="entry-section__subtitle">${escapeHtml(getTextWithFallback(section.subtitle, text('pendingSectionSubtitleFallback', '分区说明待补充')))}</p>
      </header>
      <div class="entry-section__grid"></div>
    `;

    const grid = element.querySelector('.entry-section__grid');
    items.forEach((entry) => {
      grid.append(createCardElement(entry));
    });

    return element;
  }

  function createEditorNote(issues) {
    if (!state.editorMode || !issues.length) {
      return null;
    }
    return createElement('span', 'entry-status-note', issues.join(' · '));
  }

  function createCardElement(entry) {
    return isCharacterEntry(entry) ? createCharacterCard(entry) : createCompactCard(entry);
  }

  function createCharacterCard(entry) {
    const form = getFormMeta(entry.form);
    const type = getTypeMeta(getPrimaryTypeId(entry));
    const issues = getEntryIssues(entry);

    const card = createElement('button', 'character-card');
    card.type = 'button';
    card.dataset.entryId = entry.id;
    card.setAttribute('aria-label', template(text('ariaOpenEntryFull', '查看 {name} 完整资料'), {
      name: getTextWithFallback(entry.name, text('pendingCharacterNameFallback', '角色待命名'))
    }));
    if (issues.length) {
      card.classList.add('character-card--draft');
    }
    if (form.color) {
      card.style.setProperty('--form-color', form.color);
    }

    const portrait = createElement('span', 'character-card__portrait');
    const portraitImage = document.createElement('img');
    portraitImage.className = 'character-card__portrait-image';
    portraitImage.src = entry.portrait || '';
    portraitImage.alt = template(text('assetFallbackPortrait', '{name} 立绘待提供'), { name: entry.name || '' });
    const portraitFallback = createElement('span', 'character-card__portrait-fallback', getAssetFallbackLabel(entry, 'portrait'));
    portraitFallback.dataset.fallbackLabel = 'true';
    bindImageFallback(portraitImage, portrait, getAssetFallbackLabel(entry, 'portrait'));

    const badge = createElement('span', 'entry-card__badge character-card__badge', form.name);
    const typeIcon = createTypeIcon(type);
    const overlay = createElement('span', 'character-card__name-overlay');
    const name = createElement('h3', 'character-card__name', getTextWithFallback(entry.name, text('pendingCharacterNameFallback', '角色待命名')));
    const title = createElement('span', 'character-card__title', getTextWithFallback(entry.title, text('pendingCharacterTitleFallback', '称号待补充')));
    const formSign = createFormSign(entry, 'character');

    overlay.append(name, title);
    portrait.append(portraitImage, portraitFallback, badge, typeIcon, createBloodStain(entry));
    if (formSign) {
      portrait.append(formSign);
    }
    portrait.append(overlay);

    const info = createElement('span', 'character-card__info');
    const short = createElement('span', 'character-card__short', getTextWithFallback(entry.short, text('pendingShortFallback', '简介待补充')));
    const miniStats = createElement('span', 'character-card__mini-stats');
    miniStats.append(
      createMiniStat('血', formatStatValue(entry.baseStats?.health)),
      createMiniStat('饥', formatStatValue(entry.baseStats?.hunger)),
      createMiniStat('智', formatStatValue(entry.baseStats?.sanity))
    );

    info.append(short, miniStats);
    const note = createEditorNote(issues);
    if (note) {
      info.append(note);
    }

    card.append(portrait, info);
    return card;
  }

  function createMiniStat(label, value) {
    const stat = createElement('span', 'character-card__mini-stat');
    stat.append(
      createElement('span', 'character-card__mini-stat-label', label),
      createElement('span', 'character-card__mini-stat-value', value)
    );
    return stat;
  }

  function createCompactCard(entry) {
    const form = getFormMeta(entry.form);
    const type = getTypeMeta(getPrimaryTypeId(entry));
    const issues = getEntryIssues(entry);

    const card = createElement('button', 'entry-card entry-card--compact');
    card.type = 'button';
    card.dataset.entryId = entry.id;
    card.setAttribute('aria-label', template(text('ariaOpenEntryDetail', '查看 {name} 详情'), {
      name: getTextWithFallback(entry.name, text('pendingEntryNameFallback', '条目待命名'))
    }));
    if (issues.length) {
      card.classList.add('entry-card--draft');
    }
    if (form.color) {
      card.style.setProperty('--form-color', form.color);
    }

    const badge = createElement('span', 'entry-card__badge', form.name);
    const typeIcon = createTypeIcon(type);
    const iconWrap = createElement('div', 'entry-card__icon');
    const icon = document.createElement('img');
    icon.src = entry.icon || '';
    icon.alt = template(text('assetFallbackIcon', '{name} 图标待提供'), { name: entry.name || '' });
    const fallback = createElement('span', 'item-card__fallback', getAssetFallbackLabel(entry, 'icon'));
    fallback.dataset.fallbackLabel = 'true';
    bindImageFallback(icon, iconWrap, getAssetFallbackLabel(entry, 'icon'));
    iconWrap.append(icon, fallback);

    const name = createElement('h3', 'entry-card__name', getTextWithFallback(entry.name, text('pendingEntryNameFallback', '条目待命名')));
    const short = createElement('p', 'entry-card__short', getTextWithFallback(entry.short, text('pendingDescriptionFallback', '说明待补充')));
    const formSign = createFormSign(entry, 'compact');

    card.append(badge, typeIcon, createBloodStain(entry));
    if (formSign) {
      card.append(formSign);
    }
    card.append(iconWrap, name, short);

    const note = createEditorNote(issues);
    if (note) {
      card.append(note);
    }

    return card;
  }

  function renderInfoCards() {
    refs.infoCardsRoot.replaceChildren();
    INFO_CARDS.forEach((card) => {
      refs.infoCardsRoot.append(createInfoCard(card));
    });
  }

  function createInfoCard(cardData) {
    const card = createElement('article', 'info-card');
    const head = createElement('div', 'info-card__head');
    const iconWrap = createElement('div', 'info-card__icon');
    const icon = document.createElement('img');
    icon.src = cardData.icon || '';
    icon.alt = `${getTextWithFallback(cardData.title, text('pendingInfoTitleFallback', '信息卡'))} 图标`;
    const fallbackLabel = `${getTextWithFallback(cardData.title, text('pendingInfoTitleFallback', '信息卡'))} 图标待提供`;
    const fallback = createElement('span', 'icon-fallback', fallbackLabel);
    fallback.dataset.fallbackLabel = 'true';
    bindImageFallback(icon, iconWrap, fallbackLabel);
    iconWrap.append(icon, fallback);

    const title = createElement('h3', 'info-card__title', getTextWithFallback(cardData.title, text('pendingInfoTitleFallback', '信息卡')));
    const summary = createElement('p', 'info-card__summary', getTextWithFallback(cardData.summary, text('pendingDescriptionFallback', '说明待补充')));
    const button = createElement('button', 'info-card__button', text('infoCardButtonLabel', '查看详解 →'));
    button.type = 'button';
    button.dataset.infoId = cardData.id;
    button.setAttribute('aria-label', template(text('ariaOpenInfoDetail', '查看 {title} 详情'), {
      title: getTextWithFallback(cardData.title, text('pendingInfoTitleFallback', '信息卡'))
    }));

    head.append(iconWrap, title);
    card.append(head, summary, button);

    if (state.editorMode && (isPlaceholderText(cardData.summary) || isPlaceholderText(cardData.detail))) {
      card.append(createElement('span', 'entry-status-note', text('placeholderIssueLabel', '待补文案')));
    }

    return card;
  }

  function renderModalActions() {
    return `
      <div class="modal__actions">
        <button class="modal__copy-link" type="button" data-copy-link>${escapeHtml(text('copyLinkLabel', '复制链接'))}</button>
      </div>
    `;
  }

  function renderTagList(tags) {
    if (!tags || !tags.length) {
      if (!state.editorMode) {
        return '';
      }
      return `<p class="modal-empty-block">${escapeHtml(text('pendingTagsFallback', '标签待补充'))}</p>`;
    }

    return `
      <ul class="tag-list">
        ${tags.map((tag) => `<li class="tag-list__item">${escapeHtml(tag)}</li>`).join('')}
      </ul>
    `;
  }

  function renderStatsTable(stats) {
    if (!stats || !stats.length) {
      return state.editorMode ? `<p class="modal-empty-block">${escapeHtml(text('pendingStatsFallback', '暂无数值信息'))}</p>` : '';
    }

    return `
      <h3 class="modal__section-title">${escapeHtml(text('modalStatsTitle', '数值'))}</h3>
      <table class="stats-table">
        <tbody>
          ${stats.map((stat) => `
            <tr class="${isDamageStat(stat.label) ? 'is-damage' : ''}">
              <th>${escapeHtml(stat.label)}</th>
              <td>${escapeHtml(formatStatValue(stat.value))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function renderEntryGallery(images, options = {}) {
    const { variant = 'item', altBase = '', fallbackLabel = '' } = options;
    const slideList = (images.length ? images : ['']).map((imagePath, index) => {
      const alt = images.length > 1 ? `${altBase} ${index + 1}` : altBase;
      return `
        <figure class="entry-gallery__slide" data-gallery-slide data-fallback-label="${escapeHtml(fallbackLabel)}">
          <img src="${escapeHtml(imagePath || '')}" alt="${escapeHtml(alt)}">
          <span class="entry-gallery__fallback">${escapeHtml(fallbackLabel)}</span>
        </figure>
      `;
    }).join('');

    const controls = images.length > 1 ? `
      <button class="entry-gallery__nav entry-gallery__nav--prev" type="button" data-gallery-prev aria-label="${escapeHtml(text('galleryPrevLabel', '上一张'))}">‹</button>
      <button class="entry-gallery__nav entry-gallery__nav--next" type="button" data-gallery-next aria-label="${escapeHtml(text('galleryNextLabel', '下一张'))}">›</button>
    ` : '';

    const dots = images.length > 1 ? `
      <div class="entry-gallery__dots">
        ${images.map((_, index) => `
          <button
            class="entry-gallery__dot${index === 0 ? ' is-active' : ''}"
            type="button"
            data-gallery-dot="${index}"
            aria-label="${escapeHtml(template(text('galleryDotLabel', '查看第 {index} 张图片'), { index: index + 1 }))}"
            aria-pressed="${index === 0 ? 'true' : 'false'}"></button>
        `).join('')}
      </div>
    ` : '';

    return `
      <div class="entry-gallery entry-gallery--${variant}" data-gallery>
        <div class="entry-gallery__viewport">
          <div class="entry-gallery__track" data-gallery-track>
            ${slideList}
          </div>
          ${controls}
        </div>
        ${dots}
      </div>
    `;
  }

  function initializeModalGalleries() {
    refs.modalBody.querySelectorAll('[data-gallery]').forEach((gallery) => {
      const track = gallery.querySelector('[data-gallery-track]');
      const slides = [...gallery.querySelectorAll('[data-gallery-slide]')];
      const dots = [...gallery.querySelectorAll('[data-gallery-dot]')];
      const prev = gallery.querySelector('[data-gallery-prev]');
      const next = gallery.querySelector('[data-gallery-next]');

      slides.forEach((slide) => {
        const image = slide.querySelector('img');
        bindImageFallback(image, slide, slide.dataset.fallbackLabel || '');
      });

      if (!track || !slides.length) {
        return;
      }

      let index = 0;
      const sync = () => {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, dotIndex) => {
          const active = dotIndex === index;
          dot.classList.toggle('is-active', active);
          dot.setAttribute('aria-pressed', String(active));
        });
      };

      const goTo = (nextIndex) => {
        index = (nextIndex + slides.length) % slides.length;
        sync();
      };

      prev?.addEventListener('click', () => goTo(index - 1));
      next?.addEventListener('click', () => goTo(index + 1));
      dots.forEach((dot, dotIndex) => {
        dot.addEventListener('click', () => goTo(dotIndex));
      });

      sync();
    });
  }

  function renderItemModal(entry) {
    const form = getFormMeta(entry.form);
    const galleryImages = getEntryGalleryImages(entry);
    const galleryMarkup = galleryImages.length > 1
      ? `
        <section class="modal-item__gallery">
          <h3 class="modal__section-title">${escapeHtml(text('modalGalleryTitle', '图片'))}</h3>
          ${renderEntryGallery(galleryImages, {
            variant: 'item',
            altBase: `${entry.name || ''} 图片`,
            fallbackLabel: getAssetFallbackLabel(entry, 'icon')
          })}
        </section>
      `
      : '';

    refs.modalBody.innerHTML = `
      <article class="modal-item">
        ${renderModalActions()}
        <div class="modal-item__head modal__header">
          <div class="modal-item__icon">
            <img src="${escapeHtml(entry.icon || '')}" alt="${escapeHtml(entry.name || '')} 图标">
            <span class="item-card__fallback" data-fallback-label="true">${escapeHtml(getAssetFallbackLabel(entry, 'icon'))}</span>
          </div>
          <div>
            <h2 class="modal__title" id="modal-title">${escapeHtml(getTextWithFallback(entry.name, text('pendingEntryNameFallback', '条目待命名')))}</h2>
            <p class="modal__subtitle">${escapeHtml(getTextWithFallback(entry.title, text('pendingEntryTitleFallback', '说明待补充')))}</p>
            <span class="modal__badge"${form.color ? ` style="--form-color:${escapeHtml(form.color)}"` : ''}>${escapeHtml(form.name)}</span>
          </div>
        </div>
        ${galleryMarkup}
        ${renderTagList(entry.tags)}
        <h3 class="modal__section-title">${escapeHtml(text('modalDescriptionTitle', '说明'))}</h3>
        <p class="modal-detail">${renderTextDetail(entry.detail, text('pendingDescriptionFallback', '说明待补充'))}</p>
        ${renderStatsTable(entry.stats)}
        ${renderRelatedHtml(entry.related, text('modalRelatedTitle', '相关条目'), 'modal__section-title related-title')}
      </article>
    `;

    const modalIcon = refs.modalBody.querySelector('.modal-item__icon');
    const modalImage = refs.modalBody.querySelector('.modal-item__icon img');
    bindImageFallback(modalImage, modalIcon, getAssetFallbackLabel(entry, 'icon'));
    initializeModalGalleries();
  }

  function renderCharacterModal(entry) {
    const form = getFormMeta(entry.form);
    const galleryImages = getEntryGalleryImages(entry);
    const abilities = entry.abilities && entry.abilities.length
      ? entry.abilities.map((ability) => `
          <article class="char-modal__ability">
            <header>
              <span class="char-modal__ability-name">${escapeHtml(getTextWithFallback(ability.name, text('pendingAbilityNameFallback', '技能名待补充')))}</span>
              <span class="char-modal__ability-type">[${escapeHtml(formatAbilityType(ability.type))}]</span>
            </header>
            <p class="char-modal__ability-desc">${renderTextDetail(ability.desc, text('pendingAbilityDescFallback', '技能描述待补充'))}</p>
          </article>
        `).join('')
      : `<p class="char-modal__empty">${escapeHtml(text('pendingAbilitiesFallback', '暂无特殊能力说明'))}</p>`;

    refs.modalBody.innerHTML = `
      <article class="char-modal"${form.color ? ` style="--form-color:${escapeHtml(form.color)}"` : ''}>
        <header class="char-modal__splash">
          <img class="char-modal__splash-image" src="${escapeHtml(entry.splash || '')}" alt="${escapeHtml(entry.name || '')} 角色横幅">
          <span class="char-modal__splash-fallback" data-fallback-label="true">${escapeHtml(getAssetFallbackLabel(entry, 'splash'))}</span>
          <div class="char-modal__splash-overlay">
            ${renderModalActions()}
            <span class="char-modal__category-badge">${escapeHtml(form.name)}</span>
            <h2 class="char-modal__name" id="modal-title">${escapeHtml(getTextWithFallback(entry.name, text('pendingCharacterNameFallback', '角色待命名')))}</h2>
            <p class="char-modal__title">${escapeHtml(getTextWithFallback(entry.title, text('pendingCharacterTitleFallback', '称号待补充')))}</p>
            <blockquote class="char-modal__quote">“${escapeHtml(getTextWithFallback(entry.quote, text('pendingQuoteFallback', '角色台词待补充')))}”</blockquote>
          </div>
        </header>
        <div class="char-modal__stats-bar">
          ${renderCharacterStat('health', '❤', '生命', formatStatValue(entry.baseStats?.health))}
          ${renderCharacterStat('hunger', '◐', '饥饿', formatStatValue(entry.baseStats?.hunger))}
          ${renderCharacterStat('sanity', '✦', '精神', formatStatValue(entry.baseStats?.sanity))}
        </div>
        <div class="char-modal__pros-cons">
          <section class="char-modal__pros">
            <h3 class="char-modal__sub-heading char-modal__sub-heading--pro">${escapeHtml(text('modalProsTitle', '优势'))}</h3>
            ${renderCharacterList(entry.pros, text('pendingProsFallback', '优势待补充'))}
          </section>
          <section class="char-modal__cons">
            <h3 class="char-modal__sub-heading char-modal__sub-heading--con">${escapeHtml(text('modalConsTitle', '劣势'))}</h3>
            ${renderCharacterList(entry.cons, text('pendingConsFallback', '劣势待补充'))}
          </section>
        </div>
        <section class="char-modal__abilities">
          <h3 class="char-modal__sub-heading">${escapeHtml(text('modalAbilitiesTitle', '特殊能力'))}</h3>
          ${abilities}
        </section>
        <section class="char-modal__lore">
          <h3 class="char-modal__sub-heading">${escapeHtml(text('modalLoreTitle', '故事背景'))}</h3>
          <div class="char-modal__lore-content">${renderTrustedHtmlDetail(entry.detail, text('pendingLoreFallback', '背景说明待补充'))}</div>
        </section>
        ${renderRelatedHtml(entry.related, text('modalLinkedTitle', '关联条目'), 'char-modal__sub-heading char-modal__related-title')}
      </article>
    `;

    const splash = refs.modalBody.querySelector('.char-modal__splash');
    const splashImage = refs.modalBody.querySelector('.char-modal__splash-image');
    const splashFallback = refs.modalBody.querySelector('.char-modal__splash-fallback');
    const splashOverlay = refs.modalBody.querySelector('.char-modal__splash-overlay');
    if (splash && splashOverlay) {
      splashOverlay.insertAdjacentHTML('beforebegin', renderEntryGallery(galleryImages, {
        variant: 'hero',
        altBase: `${entry.name || ''} 角色图`,
        fallbackLabel: getAssetFallbackLabel(entry, 'splash')
      }));
      splashImage?.remove();
      splashFallback?.remove();
    } else {
      bindImageFallback(splashImage, splash, getAssetFallbackLabel(entry, 'splash'));
    }
    initializeModalGalleries();
  }

  function renderCharacterStat(kind, icon, label, value) {
    return `
      <div class="char-modal__stat char-modal__stat--${kind}">
        <span class="char-modal__stat-icon">${escapeHtml(icon)}</span>
        <span class="char-modal__stat-label">${escapeHtml(label)}</span>
        <span class="char-modal__stat-value">${escapeHtml(value)}</span>
      </div>
    `;
  }

  function renderCharacterList(items, fallback) {
    if (!items || !items.length) {
      return `<p class="char-modal__empty">${escapeHtml(fallback)}</p>`;
    }

    return `
      <ul class="char-modal__list">
        ${items.map((item) => `<li>${escapeHtml(getTextWithFallback(item, fallback))}</li>`).join('')}
      </ul>
    `;
  }

  function renderRelatedHtml(relatedIds, title, titleClass) {
    const relatedEntries = (relatedIds || []).map((id) => entryMap.get(id)).filter(Boolean);
    if (!relatedEntries.length) {
      if (!state.editorMode) {
        return '';
      }
      return `
        <section class="modal-related-section">
          <h3 class="${titleClass}">${escapeHtml(title)}</h3>
          <p class="modal-empty-block">${escapeHtml(text('pendingRelatedFallback', '暂无关联条目'))}</p>
        </section>
      `;
    }

    return `
      <section class="modal-related-section">
        <h3 class="${titleClass}">${escapeHtml(title)}</h3>
        <div class="modal-related">
          ${relatedEntries.map((entry) => `
            <button class="modal-related__button" type="button" data-entry-ref="${escapeHtml(entry.id)}">${escapeHtml(entry.name)}</button>
          `).join('')}
        </div>
      </section>
    `;
  }

  function renderInfoModal(cardData) {
    refs.modalBody.innerHTML = `
      <article class="modal-info">
        ${renderModalActions()}
        <p class="modal-info__title">${escapeHtml(getTextWithFallback(cardData.title, text('pendingInfoTitleFallback', '信息卡')))}</p>
        <h2 class="modal-info__heading" id="modal-title">${escapeHtml(getTextWithFallback(cardData.heading, text('pendingEntryTitleFallback', '标题待补充')))}</h2>
        <div class="modal-info__detail">${renderTrustedHtmlDetail(cardData.detail, text('pendingDetailFallback', '详细说明待补充'))}</div>
      </article>
    `;
  }

  function openEntryModal(entryId, options = {}) {
    const { sync = true, rememberFocus = true } = options;
    const entry = entryMap.get(entryId);
    if (!entry) {
      return;
    }

    if (rememberFocus) {
      state.lastFocus = document.activeElement;
    }

    state.activeModal = { kind: 'entry', id: entryId };
    refs.modalContent.classList.toggle('modal__content--character', isCharacterEntry(entry));
    if (isCharacterEntry(entry)) {
      renderCharacterModal(entry);
    } else {
      renderItemModal(entry);
    }
    openModal();
    if (sync) {
      syncUrl({ push: true });
    }
  }

  function openInfoModal(infoId, options = {}) {
    const { sync = true, rememberFocus = true } = options;
    const card = infoCardMap.get(infoId);
    if (!card) {
      return;
    }

    if (rememberFocus) {
      state.lastFocus = document.activeElement;
    }

    state.activeModal = { kind: 'info', id: infoId };
    refs.modalContent.classList.remove('modal__content--character');
    renderInfoModal(card);
    openModal();
    if (sync) {
      syncUrl({ push: true });
    }
  }

  function openModal() {
    refs.modal.hidden = false;
    document.body.classList.add('modal-open');
    refs.modalContent.focus();
  }

  function closeModal(options = {}) {
    const { sync = true, restoreFocus = true } = options;
    refs.modal.hidden = true;
    refs.modalContent.classList.remove('modal__content--character');
    refs.modalBody.replaceChildren();
    document.body.classList.remove('modal-open');
    state.activeModal = null;

    if (restoreFocus && state.lastFocus && typeof state.lastFocus.focus === 'function') {
      state.lastFocus.focus();
    }

    if (sync) {
      syncUrl({ push: true });
    }
  }

  function rerenderActiveModal() {
    if (!state.activeModal || refs.modal.hidden) {
      return;
    }
    if (state.activeModal.kind === 'entry') {
      openEntryModal(state.activeModal.id, { sync: false, rememberFocus: false });
      return;
    }
    openInfoModal(state.activeModal.id, { sync: false, rememberFocus: false });
  }

  function trapModalFocus(event) {
    if (refs.modal.hidden || event.key !== 'Tab') {
      return;
    }

    const focusable = refs.modalContent.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) {
      event.preventDefault();
      refs.modalContent.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function copyActiveLink() {
    const url = `${window.location.origin}${buildUrl()}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.append(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      announce(text('copiedLinkMessage', '条目链接已复制'));
    } catch (error) {
      announce(text('copyLinkFailedMessage', '复制失败，请手动复制地址栏链接'));
    }
  }

  function syncFromLocation() {
    const route = parseRouteState();
    const modalChanged = JSON.stringify(route.modal) !== JSON.stringify(state.activeModal);
    const filterChanged = route.type !== state.type || route.form !== state.form || route.query !== state.query;
    const editorChanged = route.editorMode !== state.editorMode;

    state.type = route.type;
    state.form = route.form;
    state.query = route.query;
    state.editorMode = route.editorMode;
    refs.searchInput.value = state.query;

    if (filterChanged || editorChanged) {
      renderDropdownPanels();
      updateDropdownLabels();
      renderSections();
      renderInfoCards();
      rerenderActiveModal();
    }

    if (modalChanged) {
      if (!route.modal && !refs.modal.hidden) {
        closeModal({ sync: false, restoreFocus: false });
      } else if (route.modal?.kind === 'entry') {
        openEntryModal(route.modal.id, { sync: false, rememberFocus: false });
      } else if (route.modal?.kind === 'info') {
        openInfoModal(route.modal.id, { sync: false, rememberFocus: false });
      }
    }
  }

  function handleCardActivation(event) {
    const reset = event.target.closest('[data-reset-filters]');
    if (reset) {
      resetFilters();
      return;
    }

    const card = event.target.closest('[data-entry-id]');
    if (card) {
      openEntryModal(card.dataset.entryId);
    }
  }

  function bindEvents() {
    refs.typeDropdownBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleDropdown('type');
    });

    refs.formDropdownBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleDropdown('form');
    });

    refs.typeDropdownPanel.addEventListener('click', (event) => event.stopPropagation());
    refs.formDropdownPanel.addEventListener('click', (event) => event.stopPropagation());
    refs.filterSheetOverlay.addEventListener('click', closeDropdown);

    refs.searchInput.addEventListener('input', (event) => {
      state.query = event.target.value;
      renderSections();
      syncUrl();
    });

    refs.searchClearBtn.addEventListener('click', () => {
      state.query = '';
      refs.searchInput.value = '';
      refs.searchInput.focus();
      renderSections();
      syncUrl();
    });

    refs.clearFiltersBtn.addEventListener('click', () => {
      resetFilters();
    });

    refs.sectionsRoot.addEventListener('click', handleCardActivation);

    refs.infoCardsRoot.addEventListener('click', (event) => {
      const button = event.target.closest('[data-info-id]');
      if (button) {
        openInfoModal(button.dataset.infoId);
      }
    });

    refs.modal.addEventListener('click', (event) => {
      const closeTarget = event.target.closest('[data-close-modal]');
      const entryRef = event.target.closest('[data-entry-ref]');
      const copyButton = event.target.closest('[data-copy-link]');

      if (closeTarget) {
        closeModal();
        return;
      }
      if (copyButton) {
        copyActiveLink();
        return;
      }
      if (entryRef) {
        event.preventDefault();
        openEntryModal(entryRef.dataset.entryRef);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && openDropdown) {
        event.stopPropagation();
        closeDropdown();
        return;
      }
      if (event.key === 'Escape' && !refs.modal.hidden) {
        closeModal();
      }
      trapModalFocus(event);
    });

    document.addEventListener('click', () => {
      if (openDropdown) {
        closeDropdown();
      }
    });

    window.addEventListener('resize', syncDropdownLayout);
    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener('hashchange', syncFromLocation);
  }

  async function init() {
    renderSiteMeta();
    await primeTypeIcons();
    renderDropdownPanels();
    updateDropdownLabels();
    renderSections();
    renderInfoCards();
    bindEvents();
    syncFromLocation();
  }

  init();
})();
