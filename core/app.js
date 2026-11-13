/* ==========================================================================
   core/app.js — shared runtime. Every work tab and the Me tab build on this.

   Cross-module contracts (all on window, all optional):
     PortfolioTabs   tab modules (Me) register { id, label, mount, unmount, ... }
     PortfolioDemos  interactive demos register { render, onClick, onRender, ... }
     PortfolioWarm   low-priority image prewarming (warm.js)

   Core never imports a tab. Tabs append case studies to PRODUCTS and register
   demos; core dispatches through the two registries. Plain <script defer>
   files keep file:// working offline, so the whole site is still one folder.
   ========================================================================== */

window.PortfolioDemos = window.PortfolioDemos || {};
/* Notify every registered interactive demo. Extra args are forwarded. */
function demoHooks(name, ...args) {
  Object.values(window.PortfolioDemos).forEach(d => {
    if (typeof d[name] === 'function') d[name](...args);
  });
}
/* Event delegation: first demo that returns true owns the event. */
function demoHandle(name, e) {
  return Object.values(window.PortfolioDemos).some(d =>
    typeof d[name] === 'function' && d[name](e) === true);
}

/* ==========================================================================
   Selected work — domain switch, STAR case studies, interactive demos, floating TOC
   EN (default) / ZH. All names, interfaces and metrics are illustrative.
   ========================================================================== */

/* ── 1. Shared strings (EN default / ZH) ─────────────────────── */
const I18N = {
  en: {
    'brand.note': 'Evolved @ Apple, Microsoft, Tencent, Huawei | Build @ Tech+Biz',
    'star.s': 'Situation',
    'star.t': 'Task',
    'star.a': 'Action',
    'star.r': 'Result',
    'demo.note': 'Due to project confidentiality, only concept UI and sample data are shown.',
    'demo.updated': 'Updated just now',
    'demo.hint': 'Click here to switch',
    'demo.hint.short': 'Switch',
    'carousel.label': 'Project demos and photos',
    'carousel.photo': 'Photo',
    'carousel.demo': 'Demo',
    'carousel.prev': 'Previous',
    'carousel.next': 'Next',
    'photo.alt': 'sample photo',
    'cluster.aggregate': 'Aggregate',
    'cluster.separate': 'Separate',
    'cluster.count': '2,260 parts · 7 part families',
    'cluster.stage': 'Similar small parts grouped by embedding distance',
    'cluster.gap': 'cost gap',
    'cluster.hint': 'Click to process further',
    'cluster.back': 'All families',
    'cluster.vendor': 'Vendor',
    'cluster.unit': '/ pc',
    'cluster.negotiate': 'negotiation list',
    'cluster.detail': 'detailed comparison list',
    'cluster.preview': 'Preview only · no navigation',
    'cluster.parts': 'parts',
    'cluster.vendorsWord': 'vendors',
    'cluster.found1': 'Highly similar parts with',
    'cluster.found2': 'different costs have been found',
    'cluster.enter': 'Open',
    'flow.count': 'Ops loop · 4 stages · live data flow',
    'flow.caption': 'Feedback loop: CM system write-backs re-enter the standardized data lake',
    'flow.domain': 'Senior OPM know-how · applied at every stage',
    'flow.hub1': 'Factory',
    'flow.hub2': 'Operations',
    'flow.feedback': 'Feedback loop',
    'flow.stage': 'Factory Flow · closed-loop operations data pipeline',
  'flow.l2.hint': 'Click to view more',
  'flow.l2.hint.short': 'More',
  'flow.l2.back': 'Back to loop',
  'flow.l2.count': 'Level 2 · deep dive',
  'flow.l2.stage': 'Stage',
    'footer.slogan.lead': 'Turn technical depth into business outcomes.',
    'footer.note.lead': "Code is cheap now. Understanding the problem, building the data, and letting AI earn its place in the workflow — those are not.",
    'footer.note': 'Across supply chain, tech, finance and e-commerce, the pattern is the same: find the real pain point, map the workflow behind it, and build the data foundation before any model. AI is a tool, not the brief. I use it only where it measurably improves a decision or a process — and when a simpler system does the job better, simpler wins.',
    'footer.contact.before': 'Contact me via ',
    'footer.contact.mid': ' or ',
    'footer.contact.after': ' for job opportunities.',
    'footer.email': 'Email',
    'footer.linkedin': 'LinkedIn',
    'company.withheld': 'Under a confidentiality agreement, the company cannot be shown',
    'company.replace': 'Illustrative attribution · replace before publishing',
    'footer.legal': '© 2020-2030  ·  All metrics, details and sample data above are generalized to respect the confidentiality of previous employers/clients.',
    'footer.ai': "© AI Disclaimer · ~70% of this site's code comes from projects I built before AI era; the rest was AI-assisted, reviewed by me.",
    'doc.title': 'Portfolio of Hansen'
  },
  zh: {
    'brand.note': '在苹果、微软、腾讯、华为成长 · 用技术驱动业务',
    'star.s': '背景',
    'star.t': '任务',
    'star.a': '行动',
    'star.r': '结果',
    'demo.note': '此项目保密，只展示样例界面与数据',
    'demo.updated': '刚刚更新',
    'demo.hint': '点此切换',
    'demo.hint.short': '切换',
    'carousel.label': '项目演示与图片',
    'carousel.photo': '图片',
    'carousel.demo': '演示',
    'carousel.prev': '上一张',
    'carousel.next': '下一张',
    'photo.alt': '示例图片',
    'cluster.aggregate': '聚合',
    'cluster.separate': '分离',
    'cluster.count': '2,260 颗料件 · 7 个部件族',
    'cluster.stage': '按向量距离聚合的相似小部件',
    'cluster.gap': '价差',
    'cluster.hint': '点此进一步处理',
    'cluster.back': '全部部件族',
    'cluster.vendor': '供应商',
    'cluster.unit': '/ 件',
    'cluster.negotiate': '谈判清单',
    'cluster.detail': '详细对比清单',
    'cluster.preview': '仅作预览 · 不跳转',
    'cluster.parts': '颗料件',
    'cluster.vendorsWord': '家供应商',
    'cluster.found1': '发现成本差异显著的',
    'cluster.found2': '高度相似料件',
    'cluster.enter': '展开',
    'flow.count': '运营闭环 · 4 个阶段 · 数据实时流动',
    'flow.caption': '反馈闭环：乙方系统回写的数据重新进入标准化数据湖',
    'flow.domain': '资深 OPM 经验 · 贯穿每个阶段',
    'flow.hub1': '工厂数据',
    'flow.hub2': '运营闭环',
    'flow.feedback': '反馈闭环',
    'flow.stage': 'Factory Flow · 闭环运营数据链路',
  'flow.l2.hint': '点击查看更多',
  'flow.l2.hint.short': '更多',
  'flow.l2.back': '返回闭环',
  'flow.l2.count': '第二层 · 阶段详情',
  'flow.l2.stage': '阶段',
    'footer.slogan.lead': '把技术深度，变成真实的商业结果。',
    'footer.note.lead': '如今写代码很便宜。理解真实需求、打好数据基础、让 AI 配得上它在流程里的位置，这些从来都不便宜。',
    'footer.note': '从供应链、科技、金融到电商，方法始终一致：先挖出真实痛点，理清背后的业务流程，在谈模型之前把数据基础打牢。AI 是工具，不是出发点；只有当它能可衡量地改进某个决策或流程时才用。如果更简单的方案就能解决问题，则从简。',
    'footer.contact.before': '通过',
    'footer.contact.mid': '或',
    'footer.contact.after': '联系我，洽谈工作机会。',
    'footer.email': '邮件',
    'footer.linkedin': '领英',
    'company.withheld': '由于保密协议，无法展示对应公司',
    'company.replace': '示例归属 · 发布前请替换',
    'footer.legal': '© 2020-2030  ·  以上所有指标、细节与示例数据均经泛化处理，以遵守此前雇主与客户的保密约定。',
    'footer.ai': '© AI声明 · 本站约七成代码源自本人在AI时代之前构建的项目；其余为AI辅助生成，并经人工审查。',
    'doc.title': 'Portfolio of Hansen'
  }
};

/* ── 2. Work domains (Me arrives via window.PortfolioTabs) ────── */
const DOMAINS = [
  { id: 'supply',   name: { en: 'Supply Chain', zh: '供应链' } },
  { id: 'tech',     name: { en: 'Tech',         zh: '科技' } },
  { id: 'finance',  name: { en: 'Finance',      zh: '金融' } },
  { id: 'commerce', name: { en: 'E-commerce',   zh: '电商' } }
];

/* ── 2a. Company attribution ──────────────────────────────────
   Logo JPGs are the images supplied by the owner, kept in assets/logos/.
   Illustrative attribution only — swap the files before publishing.
   Projects whose company cannot be named use a plain "NA" mark.          */
const COMPANIES = {
  bytedance: { logo: 'assets/logos/bytedance.png', name: { en: 'ByteDance',       zh: '字节跳动' } },
  huawei:    { logo: 'assets/logos/huawei.jpg',    name: { en: 'Huawei',          zh: '华为' } },
  apple:     { logo: 'assets/logos/apple.png',     name: { en: 'Apple',           zh: '苹果' } },
  alibaba:   { logo: 'assets/logos/alibaba.png', name: { en: 'Alibaba',    zh: '阿里巴巴' } },
  tencent:   { logo: 'assets/logos/tencent.jpg',   name: { en: 'Tencent',     zh: '腾讯' } },
  wechat:    { logo: 'assets/logos/wechat.jpg',    name: { en: 'WeChat',      zh: '微信' } },
  microsoft: { logo: 'assets/logos/microsoft.jpg', name: { en: 'Microsoft',   zh: '微软' } },
  abc:       { logo: 'assets/logos/abc.jpg',       name: { en: 'ABC',         zh: 'ABC' } },
  hku:       { logo: 'assets/logos/hku.png',       name: { en: 'HKU',         zh: '港大' } },
  stealth:   { logo: 'assets/logos/stealth.jpg', name: { en: 'Stealth Startup', zh: '未披露初创' } },
  na:        { mark: 'NA' }
};

function companyBadge(key) {
  // A product may credit several companies: pass an array to show logos side by side.
  if (Array.isArray(key)) {
    const parts = key.map(k => companyBadge(k)).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    return `<span class="company-badge-group">${parts.join('')}</span>`;
  }
  const c = COMPANIES[key];
  if (!c) return '';
  if (c.logo) {
    const hint = I18N[LANG]['company.replace'];
    return `<span class="company-badge"><img class="company-logo" src="${c.logo}" alt="${esc(c.name[LANG])}" title="${esc(c.name[LANG])} · ${esc(hint)}"></span>`;
  }
  const tip = I18N[LANG]['company.withheld'];
  return `<span class="company-badge na" title="${esc(tip)}"><span class="company-mark" data-tip="${esc(tip)}" title="${esc(tip)}">${c.mark}</span></span>`;
}

/* ── 2b. Sidebar icons — a quiet B2B rail (VS Code / mail-client style) ── */
const ICON = {
  avatar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M5.2 20c.4-3.6 3.1-6 6.8-6s6.4 2.4 6.8 6"/></svg>',
  grid:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/></svg>',
  chart:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 19.5h17"/><path d="M4 15l4.5-5 3.5 3 4-6 4 3.5"/></svg>',
  list:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M9 9.5v10"/></svg>',
  db:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6"/><path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/></svg>',
  gear:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17"/><rect x="7.4" y="4.4" width="4.2" height="4.2" rx="1" fill="#f5f5f7"/><rect x="12.4" y="9.9" width="4.2" height="4.2" rx="1" fill="#f5f5f7"/><rect x="7.4" y="15.4" width="4.2" height="4.2" rx="1" fill="#f5f5f7"/></svg>'
};

function sideBar(active = 1) {
  // Dashboards highlight the 2nd (chart) icon; Simi-Part is a workbench
  // operation, so its browser highlights the 3rd (list) icon instead.
  const keys = ['grid', 'chart', 'list', 'db'];
  const buttons = keys.map((k, i) =>
    `<span class="side-btn ${i === active ? 'is-active' : ''}">${ICON[k]}</span>`).join('');
  return `<aside class="app-side" aria-hidden="true">
    <span class="side-avatar">${ICON.avatar}</span>
    ${buttons}
    <span class="side-spacer"></span>
    <span class="side-btn">${ICON.gear}</span>
  </aside>`;
}

/* ── 3. Shared state + UI helpers ────────────────────────────── */
let LANG = 'en';
let ACTIVE_DOMAIN = 'supply';
const ACTIVE_VIEW = {};
const ACTIVE_SLIDE = {};
/* One-time tab guidance. Kept in memory only, so it comes back on reload. */
let HINT_SEEN = false;
function markHintSeen() {
  if (HINT_SEEN) return;
  HINT_SEEN = true;
  // Only the dashboard tab hints. The Simi-Part L1 hint also carries the
  // .tab-hint class for its visual language, but it must survive this.
  document.querySelectorAll('.app-tabs .tab-hint').forEach(el => el.remove());
}
const T = (en, zh) => (LANG === 'zh' ? zh : en);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Muted palette shared by the SVG charts and inline swatches.
   Keep these in sync with the --blue* / --green* variables in styles.css. */
const C = {
  blue: '#2f5bd0',
  blue2: '#3b8ad9',
  blue3: '#45b4d2',
  mint: '#62c6b4',
  baseline: '#a6c4e2',
  grid: '#edf3f8'
};

let chartUid = 0;
function lineChart(a, b, { target = null } = {}) {
  const uid = 'c' + (++chartUid);
  const W = 340, H = 84, P = 5;
  const pts = arr => arr.map((v, i) => [P + i * (W - 2 * P) / (arr.length - 1), H - P - (v / 100) * (H - 2 * P)]);
  const path = arr => pts(arr).map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = arr => path(arr) + ` L${W - P},${H - P} L${P},${H - P} Z`;
  const grid = [0.25, 0.5, 0.75].map(r => `<line x1="${P}" y1="${(H * r).toFixed(1)}" x2="${W - P}" y2="${(H * r).toFixed(1)}" stroke="${C.grid}" stroke-width="1"/>`).join('');
  const ty = H - P - (target / 100) * (H - 2 * P);
  const targetLine = target === null ? '' : `<line x1="${P}" y1="${ty.toFixed(1)}" x2="${W - P}" y2="${ty.toFixed(1)}" stroke="${C.mint}" stroke-width="1" stroke-dasharray="4 4" opacity=".7"/>`;
  return `<svg class="ui-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="trend chart">
    <defs>
      <linearGradient id="${uid}fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${C.blue}" stop-opacity=".13"/><stop offset="100%" stop-color="${C.blue}" stop-opacity="0"/></linearGradient>
      <linearGradient id="${uid}line" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${C.blue}"/><stop offset="60%" stop-color="${C.blue2}"/><stop offset="100%" stop-color="${C.blue3}"/></linearGradient>
    </defs>
    ${grid}${targetLine}
    ${b ? `<path d="${path(b)}" fill="none" stroke="${C.baseline}" stroke-width="2" stroke-dasharray="4 4" stroke-linejoin="round"/>` : ''}
    <path d="${area(a)}" fill="url(#${uid}fill)"/>
    <path d="${path(a)}" fill="none" stroke="url(#${uid}line)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${pts(a).at(-1)[0].toFixed(1)}" cy="${pts(a).at(-1)[1].toFixed(1)}" r="3" fill="#fff" stroke="${C.mint}" stroke-width="2"/>
  </svg>`;
}
function barRow(label, value, width, tone = '') {
  return `<div class="ui-bar-row"><div><div class="ui-bar-label"><span>${label}</span></div><div class="ui-track"><div class="ui-fill ${tone}" style="width:${width}%"></div></div></div><div class="ui-bar-val">${value}</div></div>`;
}
function kpi(label, value, tone = '', delta = '') {
  return `<div class="ui-kpi"><span>${label}</span><strong class="${tone}">${value}${delta ? `<em>${delta}</em>` : ''}</strong></div>`;
}
function head(title, chip, tone = 'blue') {
  return `<div class="ui-panel-head"><strong>${title}</strong>${chip ? `<span class="ui-chip ${tone}">${chip}</span>` : ''}</div>`;
}
function legend(items) {
  return `<div class="ui-legend">${items.map(([color, label]) => `<span><i style="background:${color}"></i>${label}</span>`).join('')}</div>`;
}

/* All seven supplied landscape photos. Shared by every project that has a
   carousel, so the strip is genuinely full of imagery. */
const PHOTO_SET = [
  'assets/photos/field-01.jpg',
  'assets/photos/field-02.jpg',
  'assets/photos/field-03.jpg',
  'assets/photos/field-04.jpg',
  'assets/photos/field-05.jpg',
  'assets/photos/field-06.jpg',
  'assets/photos/field-07.jpg'
];

/* Declare shell-owned assets for the shared low-priority prewarmer (warm.js).
   Rank 1 = visible badges, rank 2 = carousel imagery; Me declares its own. */
if (window.PortfolioWarm) {
  window.PortfolioWarm.add(Object.keys(COMPANIES).map(k => COMPANIES[k].logo).filter(Boolean), 1);
  window.PortfolioWarm.add(PHOTO_SET, 2);
}

/* ── 4. Case-study registry — filled by tab/<domain>/*.js ─────── */
const PRODUCTS = [];   // tab/<domain>/*.js append into this registry

/* ── 5. Shared rendering (tabs, carousel, browser chrome) ─────── */
const domainProducts = id => PRODUCTS.filter(p => p.domain === id);

/* Self-contained tab modules (tab/*.js) register on window.PortfolioTabs.
   The shell only reads that registry — adding a new tab needs no edits here. */
const portfolioTabs = () => window.PortfolioTabs || [];
const findTab = id => portfolioTabs().find(t => t.id === id);
const currentTab = () => findTab(ACTIVE_DOMAIN);
function setTabHost(on) {
  document.getElementById('work').hidden = on;
  document.getElementById('me-view').hidden = !on;
  // The floating TOC stays: module tabs supply their own items via tocItems().
}

function renderDomainTabs() {
  const count = id => PRODUCTS.filter(p => p.domain === id).length;
  const work = DOMAINS.map(d => `
    <button type="button" class="domain-tab ${d.id === ACTIVE_DOMAIN ? 'active' : ''}" data-domain="${d.id}" aria-pressed="${d.id === ACTIVE_DOMAIN}">
      ${esc(d.name[LANG])}<span class="tab-count">${count(d.id)}</span>
    </button>`).join('');
  const tabLabel = t => typeof t.label === 'string'
    ? t.label : (t.label[LANG] || t.label.en || '');
  const extra = portfolioTabs().map(t => `
    <button type="button" class="domain-tab module-tab ${t.id === ACTIVE_DOMAIN ? 'active' : ''}" data-domain="${t.id}" aria-pressed="${t.id === ACTIVE_DOMAIN}">
      ${esc(tabLabel(t))}${t.count != null ? `<span class="tab-count">${esc(t.count)}</span>` : ''}
    </button>`).join('');
  document.getElementById('domain-tabs').innerHTML = work + extra;
}


/* ── 5b. Shared demo carousel ───────────────────────────────────
   One demo = exactly one slide, no matter how many tabs it contains.
   Photos are separate slides. The strip appears only when there is more
   than one slide. Demo thumbnails are abstract colour blocks, not captures. */
function slideList(p) {
  return [
    { kind: 'demo', id: 'demo', label: I18N[LANG]['carousel.demo'] },
    ...(p.photos || []).map((src, i) => ({ kind: 'photo', id: 'photo-' + (i + 1), src, n: i + 1 }))
  ];
}

function thumbArt() {
  return `<span class="thumb-art" aria-hidden="true"><i class="td-side"></i><span class="td-main"><i class="td-title"></i><span class="td-kpis"><i></i><i></i><i></i></span><span class="td-panel"><i class="td-row"></i><i class="td-row"></i><i class="td-row"></i><i class="td-row"></i></span></span></span>`;
}

function thumbHTML(s, current) {
  const label = s.kind === 'demo' ? s.label : `${I18N[LANG]['carousel.photo']} ${s.n}`;
  const art = s.kind === 'demo' ? thumbArt() : `<img class="thumb-photo" src="${s.src}" alt="" loading="lazy">`;
  return `<button type="button" class="thumb ${s.id === current ? 'is-current' : ''}" data-slide="${s.id}" aria-label="${esc(label)}" aria-pressed="${s.id === current}"><span class="thumb-frame">${art}</span><i class="cn cn-tl"></i><i class="cn cn-tr"></i><i class="cn cn-bl"></i><i class="cn cn-br"></i></button>`;
}

/* Shared browser chrome. Both the dashboard demos and the interactive
   similarity graph use it, so colour, rail, dots and foot stay identical. */
function browserFrame(p, { top, body, visible = true, extra = '', sideActive = 1 } = {}) {
  const cls = ['browser', extra, visible ? '' : 'stage-hidden'].filter(Boolean).join(' ');
  return `<div class="${cls}" data-stage="demo" data-product="${p.id}">
            <div class="browser-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="url">${p.url}</span><span class="bar-actions" aria-hidden="true">···</span></div>
            <div class="app">
              ${sideBar(sideActive)}
              <div class="app-main">
                <div class="app-top">${top}</div>
                <div class="app-body">${body}</div>
              </div>
            </div>
            <div class="browser-foot"><span class="foot-note">${I18N[LANG]['demo.note']}</span><span class="foot-right"><span class="live-dot"></span><span>${I18N[LANG]['demo.updated']}</span></span></div>
          </div>`;
}

function browserHTML(p, viewId, visible = true) {
  const tabs = p.tabs.map(t => `<button type="button" data-view="${t.id}" class="${t.id === viewId ? 'active' : ''}">${esc(t.label[LANG])}</button>`).join('');
  const hint = HINT_SEEN ? '' : `<span class="tab-hint" title="${esc(I18N[LANG]['demo.hint'])}"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16 10H4m0 0 5-5m-5 5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="hint-long">${esc(I18N[LANG]['demo.hint'])}</span><span class="hint-short">${esc(I18N[LANG]['demo.hint.short'])}</span></span>`;
  const views = p.tabs.map(t => `<div class="view ${t.id === viewId ? 'active' : ''}" data-view="${t.id}">${p.views[t.id]()}</div>`).join('');
  return browserFrame(p, {
    top: `<div class="app-tabs" role="tablist">${tabs}${hint}</div>`,
    body: views, visible
  });
}

/* A photo slide is a pure image — no browser chrome, no foot note. */
function photoHTML(s, p) {
  return `<div class="photo-frame" data-stage="${s.id}" data-product="${p.id}">
            <img class="photo-img" src="${s.src}" alt="${esc(p.name)} — ${esc(I18N[LANG]['photo.alt'])}" />
          </div>`;
}

function stageHTML(p, slideId) {
  const slides = slideList(p);
  const active = slides.find(x => x.id === slideId) || slides[0];
  const isPhoto = active.kind === 'photo';
  // The browser stays in flow and fixes the stage height; a photo is layered
  // on top with object-fit: contain, so portrait shots are shown in full.
  return browserHTML(p, ACTIVE_VIEW[p.id] || p.tabs[0].id, !isPhoto) + (isPhoto ? photoHTML(active, p) : '');
}

function carouselHTML(p, current) {
  const demo = window.PortfolioDemos[p.interactive];
  if (demo && demo.render) return demo.render(p);
  const slides = slideList(p);
  if (slides.length < 2) return browserHTML(p, ACTIVE_VIEW[p.id] || p.tabs[0].id);
  const arrow = (dir, cls, path, label) => `<button type="button" class="cnav ${cls}" data-dir="${dir}" aria-label="${esc(I18N[LANG][label])}"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="${path}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
  return `<div class="carousel" data-product="${p.id}" aria-label="${esc(I18N[LANG]['carousel.label'])}">
            <div class="carousel-stage">${stageHTML(p, current)}</div>
            <div class="carousel-bar">
              ${arrow(-1, 'prev', 'M12.5 4.5 7 10l5.5 5.5', 'carousel.prev')}
              <div class="carousel-strip" role="group">${slides.map(s => thumbHTML(s, current)).join('')}</div>
              ${arrow(1, 'next', 'M7.5 4.5 13 10l-5.5 5.5', 'carousel.next')}
            </div>
          </div>`;
}

/* Arrow enabled state follows the strip's scroll position. */
function updateCarouselNav(carousel) {
  const strip = carousel.querySelector('.carousel-strip');
  if (!strip) return;
  const max = strip.scrollWidth - strip.clientWidth;
  const prev = carousel.querySelector('.cnav.prev');
  const next = carousel.querySelector('.cnav.next');
  if (prev) prev.disabled = strip.scrollLeft <= 1;
  if (next) next.disabled = strip.scrollLeft >= max - 1;
  carousel.classList.toggle('no-scroll', max <= 1);
}
function updateAllCarouselNav() {
  document.querySelectorAll('.carousel').forEach(updateCarouselNav);
}
/* Re-render (language / domain switch) rebuilds the strip at scrollLeft 0;
   put the preserved active slide back in view without a visible animation. */
function centerAllThumbs() {
  document.querySelectorAll('.carousel').forEach(car =>
    centerThumb(car.querySelector('.carousel-strip'), car.querySelector('.thumb.is-current'), 'auto'));
}

/* Bring the active thumbnail towards the middle of the strip: clicking the
   fifth item, for example, slides the whole strip along so it stays in view. */
function centerThumb(strip, thumb, behavior = 'smooth') {
  if (!strip || !thumb) return;
  const s = strip.getBoundingClientRect();
  const t = thumb.getBoundingClientRect();
  const delta = (t.left + t.width / 2) - (s.left + s.width / 2);
  const max = strip.scrollWidth - strip.clientWidth;
  if (max <= 1 || Math.abs(delta) < 1) return;
  strip.scrollTo({ left: Math.max(0, Math.min(max, strip.scrollLeft + delta)), behavior });
}

function showSlide(carousel, sid, { user = false } = {}) {
  const pid = carousel.dataset.product;
  const product = PRODUCTS.find(p => p.id === pid);
  if (!product || !slideList(product).some(s => s.id === sid)) return;
  ACTIVE_SLIDE[pid] = sid;
  // Only the active stage is in the DOM: one browser + at most one photo.
  const stage = carousel.querySelector('.carousel-stage');
  stage.innerHTML = stageHTML(product, sid);
  wrapTables(stage);
  let active = null;
  carousel.querySelectorAll('.thumb').forEach(t => {
    const on = t.dataset.slide === sid;
    t.classList.toggle('is-current', on);
    t.setAttribute('aria-pressed', String(on));
    if (on) active = t;
  });
  centerThumb(carousel.querySelector('.carousel-strip'), active);
  if (user) autoPauseUntil[pid] = Date.now() + AUTOPLAY_MS;
  requestAnimationFrame(() => { syncTOC(); updateCarouselNav(carousel); });
}

/* Autoplay: every 2s, loop back to the first slide after the last one.
   Paused whenever the pointer is in ANY showcase area, when the tab is
   hidden, for offscreen carousels, and for 2s after a manual click. */
const AUTOPLAY_MS = 3000;
const autoPauseUntil = {};
function autoplayTick() {
  if (document.hidden || document.querySelector('.product-demo:hover')) return;
  const now = Date.now();
  document.querySelectorAll('.carousel').forEach(car => {
    const pid = car.dataset.product;
    if ((autoPauseUntil[pid] || 0) > now) return;
    const box = car.getBoundingClientRect();
    if (box.bottom <= 0 || box.top >= window.innerHeight) return;
    const product = PRODUCTS.find(p => p.id === pid);
    const slides = slideList(product);
    if (slides.length < 2) return;
    const cur = ACTIVE_SLIDE[pid] || slides[0].id;
    const next = slides[(slides.findIndex(s => s.id === cur) + 1) % slides.length];
    showSlide(car, next.id);
  });
}

/* Wrap every demo table in a scroll lane. Applied after each render so the
   rule is global: adding a new table to any product needs no extra work. */
function wrapTables(root = document) {
  root.querySelectorAll('.ui-table').forEach(t => {
    if (t.parentElement && t.parentElement.classList.contains('ui-table-scroll')) return;
    const lane = document.createElement('div');
    lane.className = 'ui-table-scroll';
    t.parentNode.insertBefore(lane, t);
    lane.appendChild(t);
  });
}


function renderProducts() {
  const list = domainProducts(ACTIVE_DOMAIN);
  const container = document.getElementById('products-container');
  container.innerHTML = list.map(p => {
    const slides = slideList(p);
    const activeSlide = ACTIVE_SLIDE[p.id] && slides.some(s => s.id === ACTIVE_SLIDE[p.id]) ? ACTIVE_SLIDE[p.id] : slides[0].id;
    const metrics = p.metrics.map(m => `
      <div class="metric">
        <div class="metric-value">${m.v}${m.unit[LANG] ? `<span class="metric-unit">${m.unit[LANG]}</span>` : ''}</div>
        <div class="metric-label">${esc(m.label[LANG])}</div>
      </div>`).join('');
    const star = ['s', 't', 'a', 'r'].map(k => `
      <div class="star-item">
        <span class="star-key">${I18N[LANG]['star.' + k]}</span>
        <p>${esc(p.star[k][LANG])}</p>
      </div>`).join('');
    const tags = (p.tags[LANG] || []).map(t => `<span class="ui-chip blue">${esc(t)}</span>`).join('');

    return `
      <article class="product reveal" id="${p.id}">
        <div class="product-copy">
          <h3 class="product-name">${p.name}${companyBadge(p.company)}</h3>
          <p class="product-oneliner">${esc(p.oneliner[LANG])}</p>
          <p class="product-tagline">${esc(p.title[LANG])}</p>
          <div class="star">${star}</div>
          <div class="metrics" data-count="${p.metrics.length}">${metrics}</div>
          <div class="product-tags">${tags}</div>
        </div>
        <div class="product-demo">${carouselHTML(p, activeSlide)}</div>
      </article>`;
  }).join('');
  wrapTables(container);
  requestAnimationFrame(() => demoHooks('onRender'));
}

function renderTOC() {
  const tab = currentTab();
  if (tab && tab.tocItems) {
    document.getElementById('toc-list').innerHTML = tab.tocItems(LANG).map(it => `
      <li><a href="#${esc(it.id)}" data-target="${esc(it.id)}"><span class="toc-name">${esc(it.label)}</span></a></li>`).join('');
    return;
  }
  const list = domainProducts(ACTIVE_DOMAIN);
  document.getElementById('toc-list').innerHTML = list.map(p => `
    <li><a href="#${p.id}" data-target="${p.id}"><span class="toc-no">${p.no}</span><span class="toc-name">${p.name}</span></a></li>`).join('');
}

function applyCommonStrings() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = I18N[LANG][el.dataset.i18n];
    if (v !== undefined) el.textContent = v;
  });
  document.title = I18N[LANG]['doc.title'];
  document.documentElement.lang = LANG === 'zh' ? 'zh-CN' : 'en-US';
}

/* ── 6. Reveal on scroll ─────────────────────────────────────── */
let revealIO = null;
function initReveal() {
  const els = [...document.querySelectorAll('.reveal')];
  if (revealIO) revealIO.disconnect();
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  revealIO = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); } });
  }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => revealIO.observe(el));
}

/* ── 6b. The header grows when the note wraps — keep scroll offsets in sync ── */
function syncNavHeight() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  document.documentElement.style.setProperty('--nav-h', Math.round(nav.getBoundingClientRect().height) + 'px');
}

/* ── 7. TOC tracking ────────────────────────────────────────── */
let tocTicking = false;
let lastTocActive = null;
/* "Current first view" means the READER navigated to Simi-Part — scrolling
   (or a TOC jump, which scrolls). Explicit re-syncs after a full re-render,
   a domain switch or a resize must NOT reset an L2 family the user is in. */
function syncTOC(fromScroll) {
  const tab = currentTab();
  if (tab && tab.activeTocId) {
    const id = tab.activeTocId();
    document.querySelectorAll('#toc-list a').forEach(a =>
      a.classList.toggle('active', a.dataset.target === id));
    // Leaving the work area: the next product highlight is a fresh entry.
    lastTocActive = null;
    return;
  }
  const items = [...document.querySelectorAll('#products-container .product')];
  const links = [...document.querySelectorAll('#toc-list a')];
  if (!items.length || !links.length) return;
  const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
  const line = navH + 100;
  let idx = 0;
  items.forEach((el, i) => { if (el.getBoundingClientRect().top <= line) idx = i; });
  links.forEach((a, i) => a.classList.toggle('active', i === idx));
  const activeId = links[idx] ? links[idx].dataset.target : null;
  if (activeId !== lastTocActive) {
    lastTocActive = activeId;
    if (fromScroll) demoHooks('onTocFirstView', activeId);
  }
}
function onScroll() {
  if (tocTicking) return;
  tocTicking = true;
  requestAnimationFrame(() => { syncTOC(true); tocTicking = false; });
}

/* ── 8. Domain / language switching ──────────────────────────── */
function renderAll({ instant = false } = {}) {
  renderDomainTabs();
  // A module tab owns its own DOM; the shell only refreshes it + shared strings.
  const tab = currentTab();
  if (tab) {
    setTabHost(true);
    if (tab.isMounted()) tab.refresh(LANG);
    else tab.mount(document.getElementById('me-view'), LANG);
    renderTOC();
    applyCommonStrings();
    syncNavHeight();
    requestAnimationFrame(syncTOC);
    return;
  }
  renderProducts();
  renderTOC();
  applyCommonStrings();
  syncNavHeight();
  if (instant) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    if (revealIO) revealIO.disconnect();
  } else {
    initReveal();
  }
  requestAnimationFrame(() => { syncTOC(); updateAllCarouselNav(); centerAllThumbs(); demoHooks('onRender'); });
}

function setDomain(id) {
  const targetTab = findTab(id);
  const fromTab = currentTab();
  if (!targetTab && !DOMAINS.some(d => d.id === id)) return;

  if (fromTab && fromTab === targetTab) {
    document.getElementById('me-view').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (fromTab) { fromTab.unmount(); setTabHost(false); }

  if (targetTab) {
    ACTIVE_DOMAIN = id;
    renderAll({ instant: true });
    document.getElementById('me-view').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  ACTIVE_DOMAIN = id;
  // A fresh domain always opens its carousel projects on the first slide.
  domainProducts(id).forEach(p => {
    if (slideList(p).length > 1) {
      delete ACTIVE_SLIDE[p.id];
      autoPauseUntil[p.id] = Date.now() + AUTOPLAY_MS;
    }
    const demo = window.PortfolioDemos[p.interactive];
    if (demo && demo.onDomainEnter) demo.onDomainEnter(p);
  });
  renderAll({ instant: true });
  document.getElementById('work').scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(syncTOC, 500);
}

function setLang(lang) {
  LANG = lang === 'zh' ? 'zh' : 'en';
  document.querySelectorAll('.lang button').forEach(b => {
    const on = b.dataset.lang === LANG;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', String(on));
  });
  // No persistence: every page load starts in English.
  renderAll({ instant: true });
}

/* ── 9. Boot ──────────────────────────────────────────────────
   Deferred until DOMContentLoaded: all <script defer> tab modules have
   appended their products and registered their demos by then. */
function boot() {
  LANG = 'en'; // default language on every load
  document.querySelectorAll('.lang button').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === LANG);
    b.setAttribute('aria-pressed', String(b.dataset.lang === LANG));
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });
  renderAll();

  document.getElementById('domain-tabs').addEventListener('click', e => {
    const btn = e.target.closest('.domain-tab');
    if (btn) setDomain(btn.dataset.domain);
  });
  document.getElementById('products-container').addEventListener('click', e => {
    if (demoHandle('onClick', e)) return;   // interactive demos own their controls
    const nav = e.target.closest('.cnav');
    if (nav) {
      const strip = nav.closest('.carousel-bar').querySelector('.carousel-strip');
      const first = strip.querySelector('.thumb');
      const step = (first ? first.getBoundingClientRect().width : 104) + 10;
      strip.scrollBy({ left: Number(nav.dataset.dir) * step * 2, behavior: 'smooth' });
      return;
    }
    const thumb = e.target.closest('.thumb');
    if (thumb) {
      showSlide(thumb.closest('.carousel'), thumb.dataset.slide, { user: true });
      return;
    }
    const btn = e.target.closest('.app-tabs button');
    if (!btn) return;
    markHintSeen(); // first tab click dismisses the guidance; reload restores it
    const browser = btn.closest('.browser');
    ACTIVE_VIEW[browser.dataset.product] = btn.dataset.view;
    browser.querySelectorAll('.app-tabs button').forEach(b => b.classList.toggle('active', b === btn));
    browser.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.dataset.view === btn.dataset.view));
  });
  document.getElementById('products-container').addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    demoHandle('onKeydown', e);
  });
  document.getElementById('products-container').addEventListener('scroll', e => {
    const strip = e.target.closest('.carousel-strip');
    if (strip) updateCarouselNav(strip.closest('.carousel'));
  }, true);

  document.getElementById('toc-list').addEventListener('click', e => {
    const a = e.target.closest('a[data-target]');
    if (!a) return;
    e.preventDefault();
    const tab = currentTab();
    if (tab && tab.onTocClick) { tab.onTocClick(a.dataset.target); return; }
    document.getElementById(a.dataset.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  // Modules announce a section change; the shell only needs to re-highlight TOC.
  document.addEventListener('portfolio:toc-sync', syncTOC);
  // Brand has no href (keeps the URL clean); JS owns its back-to-top jump,
  // including Enter/Space so keyboard users keep the same affordance.
  const brand = document.querySelector('.brand');
  const brandBack = () => document.getElementById('work').scrollIntoView({ behavior: 'smooth', block: 'start' });
  brand.addEventListener('click', brandBack);
  brand.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); brandBack(); }
  });
  // Deep link: index.html#<product-id> opens the product's domain, then
  // scrolls straight to its card. Generic over PRODUCTS — no tab-specific
  // symbols. Used by the Me/Talent project links (they open a new tab).
  let hashId = '';
  try { hashId = decodeURIComponent((location.hash || '').replace(/^#/, '')); } catch (e) { hashId = ''; }
  const hashP = hashId && PRODUCTS.find(p => p.id === hashId);
  if (hashP) {
    setDomain(hashP.domain);
    requestAnimationFrame(() => {
      document.getElementById(hashId)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }
  setInterval(() => { autoplayTick(); demoHooks('tick'); }, AUTOPLAY_MS);
  setInterval(() => demoHooks('tickFast'), 250);   // fine-grained demo clocks
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    syncTOC(); updateAllCarouselNav(); demoHooks('onResize');
  }, { passive: true });
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => { syncNavHeight(); syncTOC(); }).observe(document.querySelector('.nav'));
  }
}
if (document.readyState === 'complete') boot();
else document.addEventListener('DOMContentLoaded', boot, { once: true });
