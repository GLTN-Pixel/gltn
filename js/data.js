'use strict';

/**
 * 这个文件是整个站点的统一数据入口。
 *
 * 约定:
 * 1. 所有可展示文本都放在这里。
 * 2. 所有可替换资源路径都放在这里。
 * 3. 页面结构数据、条目数据、信息卡数据也都放在这里。
 * 4. `main.js` 只负责渲染和交互，不再保存业务文案和资源路径。
 */

/**
 * === A. 站点基础信息 SITE ===
 *
 * 标准示例:
 * {
 *   title: "哥布林杀手",
 *   subtitle: "一页式资料站，集中展示角色、物品与机制。",
 *   workshopUrl: "https://steamcommunity.com/sharedfiles/filedetails/?id=1234567890",
 *   feedbackQQ: "123456789",
 *   copyright: "© 2026 哥布林杀手 Mod 制作组"
 * }
 *
 * 示例解释:
 * - `title`: 网站主标题，同时会参与浏览器标题生成。
 * - `subtitle`: 首页主视觉下方副标题。
 * - `workshopUrl`: 首页和页脚的创意工坊链接。
 * - `feedbackQQ`: 页脚反馈联系方式。
 * - `copyright`: 页脚版权说明。
 */
const SITE = {
  title: '哥布林杀手',
  subtitle: '如果世间真的有IF，那么被称作哥杀的男子能否拥有不同的人生？',
  workshopUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3242898567',
  feedbackQQ: 'QQ群：1078587287',
  copyright: '© 2024 哥布林杀手 Mod 制作组（占位）'
};

/**
 * === B. 统一资源调度 ASSETS ===
 *
 * 标准示例:
 * {
 *   heroCovers: ["img/cover1.png", "img/cover2.png"],
 *   backgroundBlood: {
 *     hero: "img/bg/blood-bg-1.png",
 *     section1: "img/bg/blood-bg-2.png",
 *     section2: "img/bg/blood-bg-3.png",
 *     footer: "img/bg/blood-bg-4.png"
 *   },
 *   signs: {
 *     wrath: "img/sign/wrath-sign.png"
 *   },
 *   donationQr: "img/donation-qr.png",
 *   textures: {
 *     armor: "img/bg/armor-texture.png",
 *     dividerChain: "img/bg/divider-chain.png",
 *     infoBackground: "img/bg/info-bg.jpg",
 *     footerBackground: "img/bg/footer-bg.jpg",
 *     modalParchment: "img/bg/modal-parchment.jpg"
 *   }
 * }
 *
 * 示例解释:
 * - `heroCovers`: 首页轮播封面图，按数组顺序展示。
 * - `backgroundBlood`: 页面级背景装饰资源。
 * - `signs`: 卡片装饰图，例如愤怒图案。
 * - `donationQr`: 页脚二维码。
 * - `textures`: 页面公共底纹、信息区背景、弹窗底图等。
 *
 * 额外说明:
 * - 本地资源可写相对路径。
 * - 如果客户使用图床 / CDN，也可以直接写完整 URL。
 */
const ASSETS = {
  heroCovers: [
    'img/cover1.png',
    'img/cover2.png',
    'img/cover3.png',
    'img/cover4.png',
    'img/cover5.png'
  ],
  backgroundBlood: {
    hero: 'img/bg/blood-bg-1.png',
    section1: 'img/bg/blood-bg-2.png',
    section2: 'img/bg/blood-bg-3.png',
    footer: 'img/bg/blood-bg-4.png'
  },
  signs: {
    wrath: 'img/sign/wrath-sign.png',
    lust: 'img/sign/lust-sign.png'
  },
  donationQr: 'img/don/donation-qr.png',
  textures: {
    armor: 'img/bg/armor-texture.png',
    dividerChain: 'img/bg/divider-chain.png',
    infoBackground: 'img/bg/info-bg.jpg',
    footerBackground: 'img/bg/footer-bg.jpg',
    modalParchment: 'img/bg/modal-parchment.jpg'
  }
};

/**
 * === C. 统一界面文案 UI ===
 *
 * 标准示例:
 * {
 *   heroEyebrow: "Don't Starve Together Mod Wiki",
 *   workshopLabel: "Steam 创意工坊",
 *   searchPlaceholder: "搜索名称、标签、描述…",
 *   emptyResultsTitle: "没有找到匹配的内容"
 * }
 *
 * 示例解释:
 * - 这里放的是“页面固定文案”，不是条目内容。
 * - 例如按钮文字、空状态提示、弹窗标题、复制成功提示都应放在这里。
 * - 如果将来客户要换整站文案风格，只改这里即可。
 */
const UI = {
  metaDescription: '哥布林杀手 Don’t Starve Together Mod Wiki（占位）',
  pageTitleSuffix: 'Mod Wiki',
  skipLinkLabel: '跳到主要内容',
  heroEyebrow: 'Don’t Starve Together Mod Wiki',
  workshopLabel: 'Steam 创意工坊',
  filterBarAriaLabel: '类型、形态与搜索',
  typeDefaultLabel: '类型',
  formDefaultLabel: '形态',
  typeSheetTitle: '选择类型',
  formSheetTitle: '选择形态',
  closeSheetLabel: '关闭筛选面板',
  searchLabel: '搜索条目',
  searchPlaceholder: '搜索名称、标签、描述…',
  searchClearLabel: '清空搜索词',
  clearFiltersLabel: '清空筛选',
  resultsStatusTemplate: '当前显示 {visible} / {total} 个条目{details}',
  filterTokenType: '类型：{value}',
  filterTokenForm: '形态：{value}',
  filterTokenSearch: '搜索：“{value}”',
  editorStatusIssues: '编辑模式已开启：{count} 个条目仍有缺图或占位文案，建议运行 {command}',
  editorStatusClean: '编辑模式已开启：当前条目没有检测到缺图或占位文案。',
  infoSectionTitle: '说明',
  infoSectionSubtitle: '模组机制、版本说明与游玩指引',
  footerSiteTitle: '哥布林杀手MOD介绍页',
  footerLinksTitle: '链接',
  footerFeedbackLabel: '反馈群',
  footerWorkshopLabel: 'Steam 创意工坊',
  footerDonationTitle: '打赏',
  donationQrAlt: '打赏二维码（占位）',
  donationQrFallback: '二维码（占位）',
  modalCloseLabel: '关闭弹窗',
  modalCacheTip: '如内容显示异常，请按 CTRL+F5 强制刷新缓存',
  emptyResultsTitle: '没有找到匹配的内容',
  emptyResultsWithFilters: '换一个关键词，或者清空筛选条件再试试。',
  emptyResultsWithoutContent: '当前还没有可展示的条目。',
  emptyResultsMetaWithFilters: '当前条件：{filters}',
  emptyResultsMetaWithoutContent: '请先在 js/data.js 中补充内容。',
  emptyResetLabel: '清空筛选',
  missingImageIssueLabel: '缺图',
  placeholderIssueLabel: '待补文案',
  pendingDataFallback: '待补充',
  pendingSiteInfoFallback: '资料正在整理中。',
  pendingCopyrightFallback: '© 2024 哥布林杀手mod团队 | 所有权利保留',
  pendingFeedbackFallback: '待补充',
  pendingInfoTitleFallback: '信息卡',
  pendingEntryNameFallback: '条目待命名',
  pendingCharacterNameFallback: '角色待命名',
  pendingSectionTitleFallback: '分区标题待补充',
  pendingSectionSubtitleFallback: '分区说明待补充',
  pendingEntryTitleFallback: '说明待补充',
  pendingCharacterTitleFallback: '称号待补充',
  pendingShortFallback: '简介待补充',
  pendingDescriptionFallback: '说明待补充',
  pendingDetailFallback: '先把物品栏的背包，给予铁匠，并学习铁匠的蓝图',
  pendingQuoteFallback: '角色台词待补充',
  pendingLoreFallback: '背景说明待补充',
  pendingAbilityNameFallback: '技能名待补充',
  pendingAbilityDescFallback: '技能描述待补充',
  pendingProsFallback: '优势待补充',
  pendingConsFallback: '劣势待补充',
  pendingTagsFallback: '标签待补充',
  pendingStatsFallback: '暂无数值信息',
  pendingAbilitiesFallback: '暂无特殊能力说明',
  pendingRelatedFallback: '暂无关联条目',
  copyLinkLabel: '复制链接',
  copiedLinkMessage: '条目链接已复制',
  copyLinkFailedMessage: '复制失败，请手动复制地址栏链接',
  modalDescriptionTitle: '说明',
  modalStatsTitle: '数值',
  modalRelatedTitle: '相关条目',
  modalLinkedTitle: '关联条目',
  modalProsTitle: '优势',
  modalConsTitle: '劣势',
  modalAbilitiesTitle: '特殊能力',
  modalLoreTitle: '故事背景',
  infoCardButtonLabel: '查看详解 →',
  ariaOpenEntryFull: '查看 {name} 完整资料',
  ariaOpenEntryDetail: '查看 {name} 详情',
  ariaOpenInfoDetail: '查看 {title} 详情',
  assetFallbackPortrait: '{name} 立绘待提供',
  assetFallbackSplash: '{name} 横幅待提供',
  assetFallbackIcon: '{name} 图标待提供',
  assetFallbackDonationQr: '赞赏二维码待提供',
  typeIconFallbacks: {
    all: '全',
    character: '角',
    weapon: '武',
    equipment: '装',
    item: '物',
    building: '建',
    summon: '召',
    mechanic: '机'
  }
};

/**
 * === D. 内容类型 TYPES ===
 *
 * 标准示例:
 * {
 *   id: "weapon",
 *   name: "武器",
 *   icon: "img/icons/type-weapon.svg"
 * }
 *
 * 示例解释:
 * - `id`: 程序用的稳定标识。
 * - `name`: 页面上看到的类型名。
 * - `icon`: 类型图标路径。
 */
const TYPES = [
  { id: 'all', name: '全部', icon: 'img/icons/type-all.svg' },
  { id: 'character', name: '角色形态', icon: 'img/icons/type-character.svg' },
  { id: 'weapon', name: '武器', icon: 'img/icons/type-weapon.svg' },
  { id: 'equipment', name: '装备', icon: 'img/icons/type-equipment.svg' },
  { id: 'item', name: '物品资源', icon: 'img/icons/type-item.svg' },
  { id: 'building', name: '建筑设施', icon: 'img/icons/type-building.svg' },
  { id: 'summon', name: '召唤生物', icon: 'img/icons/type-summon.svg' },
  { id: 'mechanic', name: '特殊机制', icon: 'img/icons/type-mechanic.svg' }
];

/**
 * === E. 形态 FORMS ===
 *
 * 标准示例:
 * {
 *   id: "wrath",
 *   name: "愤怒",
 *   color: "#a83232"
 * }
 *
 * 示例解释:
 * - `id`: 程序使用的形态 id。
 * - `name`: 页面展示名称。
 * - `color`: 卡片徽章、强调色等 UI 使用的颜色。
 */
const FORMS = [
  { id: 'all', name: '全部', color: null },
  { id: 'common', name: '通用', color: '#9a958a' },
  { id: 'base', name: '哥杀本体', color: '#b5b3aa' },
  { id: 'wrath', name: '愤怒', color: '#a83232' },
  { id: 'greed', name: '贪婪', color: '#c9a44c' },
  { id: 'gluttony', name: '暴食', color: '#6b2939' },
  { id: 'lust', name: '色欲', color: '#a8556b' },
  { id: 'sloth', name: '懒惰', color: '#4a6d6e' }
  // { id: 'pride', name: '傲慢', color: '#b5b3aa' },
  // { id: 'envy', name: '嫉妒', color: '#6b8e3d' }
];

/**
 * === F. 页面分区 SECTIONS ===
 *
 * 标准示例:
 * {
 *   id: "gear",
 *   title: "装备与武器",
 *   subtitle: "点击查看属性与机制",
 *   types: ["weapon", "equipment"]
 * }
 *
 * 示例解释:
 * - `id`: 分区唯一 id。
 * - `title`: 分区主标题。
 * - `subtitle`: 分区副标题。
 * - `types`: 这个分区里要显示哪些 `type`。
 */
const SECTIONS = [
  {
    id: 'characters',
    title: '角色图鉴',
    subtitle: '点击角色卡查看完整资料',
    types: ['character']
  },
  {
    id: 'gear',
    title: '装备与武器',
    subtitle: '点击查看属性与机制',
    types: ['weapon', 'equipment']
  },
  {
    id: 'resources',
    title: '物品与建筑',
    subtitle: '资源、消耗品与固定设施',
    types: ['item', 'building']
  },
  {
    id: 'creatures-mechanics',
    title: '召唤与机制',
    subtitle: '召唤生物、被动技能与特殊规则',
    types: ['summon', 'mechanic']
  }
];

/**
 * === G. 角色条目标准示例 ===
 *
 * {
 *   id: "char-example",
 *   type: "character",
 *   form: "wrath",
 *   name: "愤怒形态",
 *   title: "称号/标题",
 *   tags: ["变身", "近战"],
 *   aliases: ["愤怒哥杀", "Wrath Form"],
 *   searchTerms: ["爆发", "怒气", "dragon wrath"],
 *   portrait: "img/characters/char-example-portrait.png",
 *   splash: "img/characters/char-example-splash.jpg",
 *   quote: "一句角色台词",
 *   short: "卡片上的一句短描述。",
 *   detail: "<p>支持 HTML，也支持 {{item-example}} 这样的条目跳转。</p>",
 *   baseStats: { health: 200, hunger: 200, sanity: 200 },
 *   pros: ["优势 1", "优势 2"],
 *   cons: ["劣势 1"],
 *   abilities: [
 *     { name: "能力名", type: "passive", desc: "能力描述，支持 {{id}} 跳转。" }
 *   ],
 *   related: ["item-example", "weapon-example"]
 * }
 *
 * 示例解释:
 * - `aliases`: 只用于搜索，不直接展示。
 * - `searchTerms`: 扩展搜索词，例如英文、拼音、俗称。
 * - `portrait`: 卡片立绘。
 * - `splash`: 角色弹窗顶部横幅。
 * - `detail`: 角色背景或详细说明。
 * - `related`: 弹窗底部关联条目按钮。
 */

/**
 * === H. 物品 / 机制条目标标准示例 ===
 *
 * {
 *   id: "item-example",
 *   type: "item",
 *   form: "common",
 *   name: "示例物品",
 *   tags: ["材料", "任务道具"],
 *   aliases: ["旧称", "英文名"],
 *   searchTerms: ["craft material"],
 *   icon: "img/items/item-example.png",
 *   short: "卡片上的短描述。",
 *   detail: "详细说明，支持 {{char-example}} 跳转。",
 *   stats: [
 *     { label: "伤害", value: "68" },
 *     { label: "耐久", value: "150" }
 *   ],
 *   related: ["char-example"]
 * }
 *
 * 示例解释:
 * - `icon`: 列表卡片和弹窗头图使用的图标。
 * - `stats`: 数值区块，非数值条目可留空数组。
 * - `related`: 关联的角色、机制、材料等条目。
 */
const ENTRIES = [
  {
    id: 'char-base',
    type: 'character',
    form: 'base',
    name: '哥布林杀手',
    title: '迷茫者',
    tags: ['主角', '近战'],
    aliases: ['基础形态'],
    searchTerms: ['base form', 'goblin slayer'],
    portrait: 'img/characters/benti/char-base-portrait.png',
    splash: 'img/characters/benti/char-base-splash.jpg',
    quote: '哥布林...',
    short: '也许并不是喜好杀戮，只是不知道自己除此以外还能做什么。',
    detail: '曾经有人问他:假如世上存在善良的哥布林，你还要杀害他们吗?他回答说:只有不在人类面前出现的才是好哥布林。如果有一天自己居住的地方忽然被哥布林袭击，它们大摇大摆的闯进来，杀你的朋友，屠戮你的家人，肆意掠夺你的财产。又或者自己的姐姐被哥布林袭击，被侵犯，被当成玩物折磨致死，而你在一旁屏住呼吸亲眼目睹了全过程，你会原谅它们吗?从那时起他选择拿起武器并任由复仇的念头驱使自己，遍寻踪迹，穷追不舍，见敌必杀。',
    baseStats: { health: 150, hunger: 150, sanity: 200 },
    pros: ['面对小生物的时候拥有5点固定减伤（对BOSS不生效）',
    '移动速度受饱食度影响',
    '搓东西手速快'
  ],
    cons: ['无法睡觉'],
    abilities: [ { name: "投掷和拔出", type: "passive", desc: "可以远程投掷指定武器（铁剑和牙签）{{weapon-rookie-sword}},{{item-tooth-pick}}" },
    { name: "神明创造的特殊个体", type: "passive", desc: "如果手持武器受到攻击有25%的机会做出一次反击，反击伤害同平A，反击时受击不会扣血" },
    { name: "屹立不倒(红眼)", type: "passive", desc: "当生命值小于10%时，获得15s无敌时间，期间按照自己已损失的生命值提高自己的攻击力（每损失4%生命提高1%攻击力）攻速略有提升(每损失4%生命提高0.02%攻击速度)，如果击杀目标则按照击杀目标最大生命值的1%回复自身生命，CD1天。若无敌时间结束血量仍小于10%，则攻击倍率降低为50%，移动速度降低为50%（直到血量＞10%才可以解除）。" ,}],
    related: ['item-dragon-blood']
  },
  {
    id: 'char-wrath',
    type: 'character',
    form: 'wrath',
    name: '愤怒',
    title: '溺水者',
    tags: ['变身', '近战'],
    aliases: ['愤怒形态'],
    searchTerms: ['wrath', 'anger'],
    portrait: 'img/characters/fennu/char-wrath-portrait.png',
    splash: 'img/characters/fennu/char-wrath-splash.jpg',
    quote: '我从炼狱中归来，是为了让世间品尝我的愤怒!',
    short: '溺水者，攀草求生',
    detail: '<p>（占位）变身后自带 {{weapon-fang-rib}} 与 {{weapon-fang-spine}}。</p>',
    baseStats: { health: 200, hunger: 200, sanity: 200 },
    pros: ['（占位）'],
    cons: ['（占位）'],
    abilities: [],
    related: ['weapon-fang-rib', 'weapon-fang-spine']
  },
  {
    id: 'char-greed',
    type: 'character',
    form: 'greed',
    name: '贪婪',
    title: '溺水者',
    tags: ['变身', '资源'],
    aliases: ['贪婪形态'],
    searchTerms: ['greed'],
    portrait: 'img/characters/tanlan/char-greed-portrait.png',
    splash: 'img/characters/tanlan/char-greed-splash.jpg',
    quote: '即使世界万物尽归我手,我也不会满足',
    short: '溺水者，攀草求生',
    detail: '<p>（占位）核心货币为 {{item-zhi-coin}}。</p>',
    baseStats: { health: 150, hunger: 200, sanity: 250 },
    pros: ['（占位）'],
    cons: ['（占位）'],
    abilities: [],
    related: ['item-zhi-coin']
  },
  {
    id: 'char-gluttony',
    type: 'character',
    form: 'gluttony',
    name: '暴食',
    title: '溺水者',
    tags: ['变身', '近战'],
    aliases: ['暴食形态'],
    searchTerms: ['gluttony'],
    portrait: 'img/characters/baoshi/char-gluttony-portrait.png',
    splash: 'img/characters/baoshi/char-gluttony-splash.jpg',
    quote: '究竟是何等美味的珍馐，才能满足我的渴望？',
    short: '溺水者，攀草求生',
    detail: '<p>（占位）</p>',
    baseStats: { health: 250, hunger: 300, sanity: 200 },
    pros: ['（占位）'],
    cons: ['（占位）'],
    abilities: [],
    related: []
  },
  {
    id: 'char-lust',
    type: 'character',
    form: 'lust',
    name: '色欲',
    title: '溺水者',
    tags: ['变身', '魅惑'],
    aliases: ['色欲形态'],
    searchTerms: ['lust'],
    portrait: 'img/characters/seyu/char-lust-portrait.png',
    splash: 'img/characters/seyu/char-lust-splash.jpg',
    quote: '哪里都可以，让我们一同前行吧。',
    short: '溺水者，攀草求生',
    detail: '<p>（占位）</p>',
    baseStats: { health: 50, hunger: 50, sanity: 50 },
    pros: ['（占位）'],
    cons: ['（占位）'],
    abilities: [],
    related: ['mech-flesh-curse']
  },
  {
    id: 'char-sloth',
    type: 'character',
    form: 'sloth',
    name: '懒惰',
    title: '溺水者',
    tags: ['变身'],
    aliases: ['懒惰形态'],
    searchTerms: ['sloth'],
    portrait: 'img/characters/landuo/char-sloth-portrait.png',
    splash: 'img/characters/landuo/char-sloth-splash.jpg',
    quote: '这不是懒惰，只是没有事情值得我认真罢了。',
    short: '溺水者，攀草求生',
    detail: '<p>（占位）</p>',
    baseStats: { health: 250, hunger: 300, sanity: 120 },
    pros: ['（占位）'],
    cons: ['（占位）'],
    abilities: [],
    related: []
  },
  {
    id: 'weapon-fang-rib',
    type: 'weapon',
    form: 'wrath',
    name: '邪龙之肋',
    tags: ['枪', '变身自带'],
    aliases: ['愤怒长枪'],
    searchTerms: ['fang rib', 'wrath weapon'],
    icon: 'img/items/xielongzhilei/weapon-fang-rib.png',
    short: '喝彩！为我对世间万物的憎恶喝彩！',
    detail: '技能：地狱之业火在物品栏时右键立刻消耗40%最大生命值，获得持续4s的力场护盾（此力场护盾效果同铥矿头盔）随后每秒损失6点生命值和20点能量直到生命值达到6后或者能量达到200后不再下降。技能持续期间，每次损失生命对周围单位造成30伤害，且持续期间攻击倍率固定为3.0，且暴击率变为30% 暴击伤害提升15%每次暴击回复20生命。{{char-wrath}}',
    stats: [
      { label: '伤害', value: '68' },
      { label: '距离', value: '2' }
    ],
    related: ['char-wrath']
  },
  {
    id: 'weapon-fang-spine',
    type: 'weapon',
    form: 'wrath',
    name: '邪龙之脊',
    tags: ['剑', '变身自带'],
    aliases: ['愤怒长剑'],
    searchTerms: ['fang spine', 'wrath sword'],
    icon: 'img/items/xielongzhiji/weapon-fang-spine.png',
    short: '哀悼！为正在受地狱之火灼烧的我哀悼！',
    detail: '右键技能技能：如梦一般的泡影（消耗25能量，CD8s）可以像哑铃一样抛物线扔出，在落地点造成34点AOE伤害，同时在落点召唤一枚可造成100 AOE伤害的陨石（没有燃烧效果和击飞物品效果，且对哥杀伤害减半）如果哥杀在陨石范围内，则获得持续4s的力场护盾，此力场护盾效果同铥矿头盔增加15%的攻击力和移动速度，并获得额外36攻击力和吸血（每次攻击回5）持续15s。{{char-wrath}}',
    stats: [
      { label: '伤害', value: '68' }
    ],
    related: ['char-wrath']
  },
  {
    id: 'weapon-rookie-sword',
    type: 'weapon',
    form: 'common',
    name: '新手短剑',
    tags: ['近战', '可投掷'],
    aliases: ['新手短剑','初始短剑','初始剑'],
    searchTerms: ['rookie sword'],
    icon: 'img/items/新手短剑/weapon-rookie-sword.png',
    short: '靠近铁匠解锁配方',
    detail: '右键投掷，每次消耗武器25%耐久,命中敌人后会插在敌人身上造成25%减速，玩家可以选择将插在敌人身上的武器拔出(右键怪物或者快捷键R)，消耗武器25%耐久造成怪物1%最大生命值的伤害，这部分伤害会以流血形式扣除。',
    stats: [
      { label: '伤害', value: '68' },
      { label: '耐久', value: '150' }
    ],
    related: []
  },
  {
    id: 'item-tooth-pick',
    type: 'item',
    form: 'common',
    name: '牙签',
    tags: ['远程', '可投掷','后续制作'],
    aliases: ['牙签'],
    searchTerms: ['toothpick'],
    icon: 'img/items/yaqian/item-tooth-pick.png',
    short: '靠近铁匠解锁配方',
    detail: '攻击同原版吹箭，命中敌人后会插在敌人身上造成25%减速，玩家可以选择将插在敌人身上的武器拔出(右键怪物或者快捷键R)，消耗武器25%耐久造成怪物1%最大生命值的伤害，这部分伤害会以流血形式扣除。',
    stats: [
      { label: '伤害', value: '42.5' },
      { label: '消耗2木头', value: '生产4个' }
    ],
    related: []
  },
  {
    id: 'weapon-shadow-axe',
    type: 'weapon',
    form: 'common',
    name: '缠绕不详暗影之力的战斧',
    tags: ['近战', '击杀获得'],
    aliases: ['犀牛斧子','缠绕不详暗影之力的战斧'],
    searchTerms: ['rookie sword'],
    icon: 'img/items/xiniufuzi/weapon-shadow-axe.png',
    short: '击杀犀牛获得',
    detail: '斧子在地上插三天就会消失,击杀远古犀牛获得，无耐久具有多用斧稿功能，且给予3个金锄头可以开启一键3*3功能,伤害68，右键消耗（自动检查物品栏）2个噩梦燃料开启特殊功能分身：（持续15S冷却20S）此时攻击距离为2，若在攻击距离1攻击可造成双倍伤害且分身状态下工作具有双倍效率',
    stats: [
      { label: '伤害', value: '68' },
      { label: '耐久', value: '150' }
    ],
    related: []
  },
  {
    id: 'equip-pursestring-1',
    type: 'equipment',
    form: 'greed',
    name: '钱袋（一级）',
    tags: ['容器', '贪婪专属'],
    aliases: ['一级钱袋'],
    searchTerms: ['purse'],
    icon: 'img/items/钱袋/equip-pursestring-1.png',
    short: '这是我年轻时候用过的钱袋',
    detail: '（占位）只可装 {{item-zhi-coin}} 等。',
    stats: [
      { label: '格子', value: '6' }
    ],
    related: ['item-zhi-coin']
  },
  {
    id: 'equip-pursestring-1',
    type: 'equipment',
    form: 'greed',
    name: '钱袋（二级）',
    tags: ['容器', '贪婪专属'],
    aliases: ['二级钱袋'],
    searchTerms: ['purse'],
    icon: 'img/items/钱袋/equip-pursestring-2.png',
    short: '那时的我小有所成',
    detail: '（占位）只可装 {{item-zhi-coin}} 等。',
    stats: [
      { label: '格子', value: '12' }
    ],
    related: ['item-zhi-coin']
  },
  {
    id: 'equip-rookie-backpack',
    type: 'equipment',
    form: 'common',
    name: '皱巴巴的新手背包',
    tags: ['开局自带'],
    aliases: ['新手背包'],
    searchTerms: ['rookie bag'],
    icon: 'img/items/bao/equip-rookie-backpack.png',
    short: '开局自带',
    detail: '（占位）',
    stats: [],
    related: []
  },
  {
    id: 'equip-rookie-backpack2',
    type: 'equipment',
    form: 'common',
    name: '精细的猪皮背包',
    tags: ['后续制作'],
    aliases: ['猪皮背包'],
    searchTerms: ['rookie bag'],
    icon: 'img/items/bao/equip-rookie-backpack2.png',
    short: '靠近铁匠解锁配方',
    detail: '（占位）',
    stats: [],
    related: []
  },
  {
    id: 'item-dragon-blood',
    type: 'item',
    form: 'common',
    name: '邪龙之血',
    tags: ['变身', '唯一'],
    aliases: ['龙血'],
    searchTerms: ['dragon blood'],
    icon: 'img/items/item-dragon-blood.png',
    short: '（占位）使用后后变身为对应罪的形态。',
    detail: '（占位）龙蝎掉落，每个哥杀只能选择一种。',
    stats: [],
    related: ['char-wrath', 'char-greed', 'char-gluttony', 'char-lust', 'char-sloth']
  },
  {
    id: 'item-zhi-coin',
    type: 'item',
    form: 'greed',
    name: '纸金币',
    tags: ['货币', '贪婪专属'],
    aliases: ['纸币'],
    searchTerms: ['zhi coin'],
    icon: 'img/items/item-zhi-coin.png',
    short: '（占位）贪婪能量满后获得，组成世界的基本要素。',
    detail: '（占位）',
    stats: [],
    related: ['equip-pursestring-1', 'char-greed']
  },
  {
    id: 'build-mailbox',
    type: 'building',
    form: 'common',
    name: '信箱（未上线）',
    tags: ['建筑', '蛋黄酱'],
    aliases: ['邮箱'],
    searchTerms: ['mailbox'],
    icon: 'img/items/build-mailbox.png',
    short: '（占位）',
    detail: '（占位）',
    stats: [],
    related: ['summon-mayo']
  },
  {
    id: 'summon-mayonnaise',
    type: 'summon',
    form: 'common',
    name: '蛋黄酱',
    tags: ['宠物'],
    aliases: ['mayo'],
    searchTerms: ['summon mayonnaise'],
    icon: 'img/items/danhuangjiang/summon-mayonnaise.png',
    short: '召唤：在冰箱中心空出，周围放满8个腐烂物品',
    detail: '召唤：在冰箱中心空出，周围放满8个腐烂物品',
    stats: [
      { label: '生命', value: '600' },
      { label: '饥饿度', value: '600' },
      { label: '饥饿速率', value: '0' },
    ],
    related: ['build-mailbox']
  },
  {
    id: 'mech-stand-tall',
    type: 'mechanic',
    form: 'base',
    name: '屹立不倒',
    tags: ['被动'],
    aliases: ['stand tall'],
    searchTerms: ['invincible passive'],
    icon: 'img/items/mech-stand-tall.png',
    short: '（占位）HP < 10% 时获得 15s 无敌。',
    detail: '（占位）',
    stats: [],
    related: []
  },
  {
    id: 'mech-flesh-curse',
    type: 'mechanic',
    form: 'lust',
    name: '血肉诅咒等级',
    tags: ['色欲核心'],
    aliases: ['诅咒等级'],
    searchTerms: ['flesh curse'],
    icon: 'img/items/mech-flesh-curse.png',
    short: '（占位）色欲的成长系统，共 6 级。',
    detail: '（占位）',
    stats: [],
    related: ['char-lust']
  }
];

/**
 * === I. 信息卡 INFO_CARDS ===
 *
 * 标准示例:
 * {
 *   id: "page-guide",
 *   icon: "img/icons/book.svg",
 *   title: "页面功能",
 *   heading: "怎么使用这个网站？",
 *   summary: "卡片上的一句摘要。",
 *   detail: "<p>弹窗内的详细说明，支持 HTML。</p>"
 * }
 *
 * 示例解释:
 * - `title`: 卡片标题。
 * - `heading`: 打开弹窗后的大标题。
 * - `summary`: 卡片摘要。
 * - `detail`: 富文本正文，支持 HTML。
 */
const INFO_CARDS = [
  {
    id: 'getting-started',
    icon: 'img/icons/sword.svg',
    title: '入门指引',
    heading: '如何开始？',
    summary: '请先把物品栏的背包，给予铁匠，并学习铁匠的蓝图',
    detail: '<p>（占位详细内容，支持 HTML 段落。）</p><ul><li>（占位列表内容）</li></ul><p><strong>（占位强调内容）</strong></p>'
  },
  {
    id: 'page-guide',
    icon: 'img/icons/book.svg',
    title: '页面功能',
    heading: '怎么用这个网站？',
    summary: '（占位 · 介绍筛选、搜索、关键词跳转）',
    detail: '<ul><li>顶部按钮：按类型与形态筛选</li><li>搜索框：实时模糊匹配</li><li>详情中的绿色字：可点击跳转</li></ul>'
  },
  {
    id: 'version',
    icon: 'img/icons/flag.svg',
    title: '版本与反馈',
    heading: '联机测试 & 反馈渠道',
    summary: '（占位 · 当前版本号 + 反馈方式）',
    detail: '<p>当前版本：<strong>（占位）</strong></p><p>反馈群： （占位）</p>'
  },
  {
    id: 'mod-intro',
    icon: 'img/icons/scroll.svg',
    title: '模组简介',
    heading: '哥布林杀手是什么？',
    summary: '（占位 · mod 整体介绍）',
    detail: '<p>（占位 mod 简介内容）</p>'
  }
];

window.WIKI_DATA = Object.freeze({
  SITE,
  ASSETS,
  UI,
  TYPES,
  FORMS,
  SECTIONS,
  ENTRIES,
  INFO_CARDS
});
