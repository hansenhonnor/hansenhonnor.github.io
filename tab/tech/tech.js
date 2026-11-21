/* ==========================================================================
   tab/tech/tech.js — 3 case studies (Tech tab).

   Add a project here, not in core/. Each object needs: id, no, domain,
   name, company, url, tabs, views, tags, title, oneliner, star, metrics.
   Set `interactive: 'cluster' | 'flow'` to use a registered demo instead
   of the standard dashboard; add `photos: [...]` to get a carousel.
   Views are functions, so core helpers (T, esc, kpi, head, ...) resolve
   at render time. Order here = order in the tab and the floating TOC.
   ========================================================================== */

/* Portfolio Pipeline — one inline animated diagram (same trick as Treasury
   Link's lf* helpers in finance.js: borrow the Factory Flow language —
   marching-ants dashes, SMIL data packets, pulsing output, flow-card style
   tint boxes with accent bars — but as a static SVG inside a standard view,
   no PortfolioDemos registration, no load-order change). Input sources are
   drawn as recognizable format icons (see ppFmtIcon below). Styles: tech.css,
   .pp- prefix. */
/* Format "logo" glyphs — hand-drawn original SVG (no trademark image). One
   visual family, Office file-icon convention: same-size rounded badge + a
   white mark, all colours pulled to the same muted value so PDF no longer
   burns brighter than Word/PPT/Excel, then lifted one shade (owner note:
   the row read too dark) — hue families kept, white marks stay legible.
   Docs = letter marks (PDF / W / P / X); media = pictograms (play /
   waveform / twin bubbles); 8th slot is a dashed "+" tile = "more formats".
   Inline styles on glyph text because .pp-svg text CSS would otherwise
   override fill/font-size presentation attributes. */
function ppFmtIcon(kind) {
  switch (kind) {
    case 'pdf':   // brick-red PDF sheet badge — the universal PDF file mark
      return `<rect x="3" y="3" width="18" height="18" rx="4.5" fill="#C05B50"/>
        <text x="12" y="14.4" text-anchor="middle" style="fill:#fff;font-size:6.6px;font-weight:800;letter-spacing:.2px">PDF</text>`;
    case 'word':  // Office blue + W
      return `<rect x="3" y="3" width="18" height="18" rx="4.5" fill="#3E6FB0"/>
        <text x="12" y="16.7" text-anchor="middle" style="fill:#fff;font-size:12.5px;font-weight:800">W</text>`;
    case 'ppt':   // Office orange-red + P
      return `<rect x="3" y="3" width="18" height="18" rx="4.5" fill="#D4573A"/>
        <text x="12" y="16.7" text-anchor="middle" style="fill:#fff;font-size:12.5px;font-weight:800">P</text>`;
    case 'excel': // Office green + X
      return `<rect x="3" y="3" width="18" height="18" rx="4.5" fill="#2F9058"/>
        <text x="12" y="16.7" text-anchor="middle" style="fill:#fff;font-size:12.5px;font-weight:800">X</text>`;
    case 'video': // muted gold badge + white play — reads "media" at a glance
      return `<rect x="3" y="3" width="18" height="18" rx="4.5" fill="#D19D4F"/>
        <path d="M9.6 7.4 L9.6 16.6 L17.2 12 Z" fill="#fff"/>`;
    case 'audio': // deep teal badge + white waveform
      return `<rect x="3" y="3" width="18" height="18" rx="4.5" fill="#4FA895"/>
        <g fill="#fff"><rect x="6.2" y="9.6" width="1.8" height="4.8" rx=".9"/>
          <rect x="9.4" y="7" width="1.8" height="10" rx=".9"/>
          <rect x="12.6" y="5.6" width="1.8" height="12.8" rx=".9"/>
          <rect x="15.8" y="8.6" width="1.8" height="6.8" rx=".9"/></g>`;
    case 'chat':  // twin bubbles in a lighter blue — shape and value both
                  // differ from Word's navy badge
      return `<path d="M2.6 5.4A2.4 2.4 0 0 1 5 3h8a2.4 2.4 0 0 1 2.4 2.4v5A2.4 2.4 0 0 1 13 12.8H7.6L4.2 15.3v-2.5H5A2.4 2.4 0 0 1 2.6 10.4v-5Z" fill="#6E93E0"/>
        <path d="M12.4 12.4a1.9 1.9 0 0 1 1.9-1.9h4.2a1.9 1.9 0 0 1 1.9 1.9v3.3a1.9 1.9 0 0 1-1.9 1.9h-.7v2l-2.8-2h-.7a1.9 1.9 0 0 1-1.9-1.9v-3.3Z" fill="#A3B9EA"/>`;
    case 'more':  // dashed placeholder = the format list keeps growing
      return `<rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="#c9ccd2" stroke-width="1.3" stroke-dasharray="3.2 2.6"/>
        <path d="M12 8.6v6.8M8.6 12h6.8" stroke="#b8bdc6" stroke-width="1.6" stroke-linecap="round"/>`;
  }
}
function ppPipeSVG() {
  const docs = [
    { kind: 'pdf',   label: T('PDF document', 'PDF 文档') },
    { kind: 'word',  label: T('Word file', 'Word 文档') },
    { kind: 'ppt',   label: T('Slides', 'PPT 演示') },
    { kind: 'excel', label: T('Excel spreadsheet', 'Excel 表格') },
    { kind: 'video', label: T('Video', '视频') },
    { kind: 'audio', label: T('Audio', '音频') },
    { kind: 'chat',  label: T('Chat log', '聊天记录') },
    { kind: 'more',  label: T('More formats', '更多格式') }
  ];
  const stages = [
    { ttl: T('Python parser', 'Python 解析'),        sub: T('extracts raw text', '抽取原文'),       color: '#2b54b8', wash: '#eef3fb', stroke: 'rgba(43,84,184,.30)',  badge: null },
    { ttl: 'Azure Functions',                         sub: T('serverless glue', '无服务器编排'),     color: '#45b4d2', wash: '#edf8fb', stroke: 'rgba(69,180,210,.45)', badge: 'serverless' },
    { ttl: 'Azure OpenAI',                            sub: T('CO-STAR extraction', 'CO-STAR 抽取'), color: '#cda262', wash: '#fbf4e9', stroke: 'rgba(205,162,98,.45)', badge: 'CO-STAR' },
    { ttl: T('GPT fine-tuned', 'GPT 微调'),           sub: T('text correction', '文本纠偏'),         color: '#3f9e7d', wash: '#eef8f3', stroke: 'rgba(63,158,125,.35)', badge: 'fine-tuned' }
  ];
  /* Two rows: three stages up top, GPT correction + output box below. The
     viewBox shrinks 640→560 wide, so every tile and glyph renders ~20%
     larger at panel width. Sub-labels live inside the boxes now, keeping the
     row gap clear for the OpenAI→GPT drop lane. The feed caption no longer
     crosses the top: it sits under the dashed frame as two short lines
     (.pp-cap), and the whole drawing rides 60u higher — viewBox 312→252 —
     so no dead band is left above the stage badges. */
  const xs = [120, 272, 424], W = 116, BY = 62, BY2 = 176, BH = 60, CY = 92, CY2 = 206;
  const bus = '#9aa3b0';
  const tiles = docs.map((d, i) => {
    const x = i < 4 ? 8 : 52, y = 22 + (i % 4) * 36;
    return `<g class="pp-tile"><title>${esc(d.label)}</title>
      <rect x="${x}" y="${y}" width="38" height="32" rx="9" fill="#f5f5f7"/>
      <g transform="translate(${x + 3.4},${y + 0.4}) scale(1.3)">${ppFmtIcon(d.kind)}</g></g>`;
  }).join('');
  const packets = ['#C05B50', '#3E6FB0', '#D4573A', '#2F9058', '#D19D4F', '#4FA895', '#6E93E0']
    .map((c, i) => `<g><circle r="4.6" fill="#fff"/><circle r="2.4" fill="${c}"/>
      <animateMotion dur="2.4s" begin="-${(i * 0.34).toFixed(2)}s" repeatCount="indefinite" path="M 96 92 H 120"/></g>`)
    .join('');
  const feed = `<rect x="2" y="16" width="94" height="152" rx="12" fill="none" stroke="${bus}" stroke-width="1.2" stroke-dasharray="4 5" opacity=".55"/>
    <path d="M 96 92 H 118" fill="none" stroke="${bus}" stroke-width="1.8" stroke-dasharray="7 7" stroke-linecap="round" opacity=".65" class="pp-ants"/>
    <path d="M 113 87.5 L 120 92 L 113 96.5 Z" fill="${bus}" opacity=".85"/>
    ${packets}`;
  const box = (s, x, y) => `
    <rect x="${x}" y="${y}" width="${W}" height="${BH}" rx="10" fill="${s.wash}" stroke="${s.stroke}" stroke-width="1.3"/>
    <rect x="${x}" y="${y}" width="5" height="${BH}" rx="2.5" fill="${s.color}" opacity=".8"/>
    <text x="${x + 58}" y="${y + 27}" text-anchor="middle" class="pp-ttl">${esc(s.ttl)}</text>
    <text x="${x + 58}" y="${y + 47}" text-anchor="middle" class="pp-dim">${esc(s.sub)}</text>${
      s.badge ? `<rect x="${x + 26}" y="${y - 12}" width="64" height="16" rx="8" fill="#fff" stroke="${s.stroke}" stroke-width="1.1"/>
      <text x="${x + 58}" y="${y - 0.8}" text-anchor="middle" class="pp-badge" fill="${s.color}">${s.badge}</text>` : ''}`;
  const boxes = box(stages[0], xs[0], BY) + box(stages[1], xs[1], BY) + box(stages[2], xs[2], BY) + box(stages[3], xs[2], BY2);
  const links = [0, 1].map(i => {
    const x1 = xs[i] + W, x2 = xs[i + 1], c = stages[i + 1].color;
    return `<path d="M ${x1} ${CY} H ${x2}" fill="none" stroke="${c}" stroke-width="1.9" stroke-dasharray="7 7" stroke-linecap="round" opacity=".6" class="pp-ants"/>
      <path d="M ${x2 - 7} ${CY - 4.5} L ${x2} ${CY} L ${x2 - 7} ${CY + 4.5} Z" fill="${c}" opacity=".85"/>
      <g><circle r="5.5" fill="#fff"/><circle r="3" fill="${c}"/>
        <animateMotion dur="1.7s" begin="-${(i * 0.55).toFixed(2)}s" repeatCount="indefinite" path="M ${x1} ${CY} H ${x2}"/></g>`;
  }).join('');
  /* OpenAI → GPT wraps around the right edge; the corrected stream then runs
     left along the second row into the output box (a U through the row). */
  const drop = 'M 540 92 Q 550 92 550 102 V 196 Q 550 206 540 206';
  const gC = stages[3].color;
  const outC = '#2f8068';
  return `<svg class="pp-svg" viewBox="0 0 560 252" preserveAspectRatio="xMidYMid meet" role="img"
      aria-label="${esc(T('Pipeline: PDF, Word, slide, spreadsheet, video, audio and chat records flow through a Python parser, Azure Functions, Azure OpenAI with CO-STAR prompts and a fine-tuned GPT into structured records', '管线：PDF、Word、幻灯片、表格、视频、音频与聊天记录，经 Python 解析、Azure Functions、Azure OpenAI（CO-STAR 提示词）与微调 GPT，流成结构化记录'))}">
    <text x="4" y="184" class="pp-cap">${esc(T('unstructured office', '非结构化的办公'))}<tspan x="4" dy="14">${esc(T('& meeting records', '与会议记录'))}</tspan></text>
    ${feed}
    ${tiles}
    ${links}
    ${boxes}
    <path d="${drop}" fill="none" stroke="${gC}" stroke-width="1.9" stroke-dasharray="7 7" stroke-linecap="round" opacity=".6" class="pp-ants"/>
    <path d="M 546 201.5 L 540 206 L 546 210.5 Z" fill="${gC}" opacity=".85"/>
    <g><circle r="5.5" fill="#fff"/><circle r="3" fill="${gC}"/>
      <animateMotion dur="2.4s" begin="-0.6s" repeatCount="indefinite" path="${drop}"/></g>
    <path d="M 424 206 H 368" fill="none" stroke="${outC}" stroke-width="1.9" stroke-dasharray="7 7" stroke-linecap="round" opacity=".6" class="pp-ants"/>
    <path d="M 371 201.5 L 364 206 L 371 210.5 Z" fill="${outC}" opacity=".85"/>
    <g><circle r="5.5" fill="#fff"/><circle r="3" fill="${outC}"/>
      <animateMotion dur="1.5s" begin="-0.4s" repeatCount="indefinite" path="M 424 206 H 364"/></g>
    <rect x="120" y="176" width="244" height="60" rx="10" fill="#eef8f3" stroke="rgba(63,158,125,.55)" stroke-width="1.4"/>
    <rect x="120" y="176" width="244" height="60" rx="10" fill="none" stroke="#77c7a6" stroke-width="3" opacity=".45">
      <animate attributeName="opacity" values=".5;.08;.5" dur="2.6s" repeatCount="indefinite"/>
    </rect>
    <rect x="136" y="194" width="24" height="24" rx="4" fill="none" stroke="${outC}" stroke-width="1.4"/>
    <path d="M 136 202 H 160 M 136 210 H 160" stroke="${outC}" stroke-width="1.1" opacity=".7"/>
    <text x="172" y="202">${esc(T('Structured records', '结构化记录'))}</text>
    <text x="172" y="218" class="pp-dim">${esc(T('JSON · one row per record', 'JSON · 每条记录一行'))}</text>
  </svg>`;
}


/* Real Donut Multi-End screenshots (assets/photos/project/Donut/). File-name
   prefix = carousel order; `photosFirst` below puts them before the demo
   slide. 1-miniapp-landing.png is the 2026-11-19 replacement shot (owner
   upload "111.png", 1998x2504): repacked losslessly by recompressing the
   original IDAT with zlib9 — pixel md5 identical, eXIf/iTXt metadata
   stripped, sRGB kept, 955K -> 585K (budget ≤600K), zero sharpness loss. */
const DONUT_PHOTOS = [
  'assets/photos/project/Donut/1-miniapp-landing.png',
  'assets/photos/project/Donut/2-miniapp-intro.png'
];

/* Real Research Wiki screenshots (assets/photos/project/Research-Wiki/).
   1-1803.png = original 1-1803.jpg with dataset counts privacy-blurred —
   all 12 occurrences of "Project/SubProject/Person + number" and the
   number in "N projects" (hero line, purple AD chip, Composition rows,
   browse & All-Nodes filter chips, All Datasets header). Event/Group/
   Theme/All/node/edge counts intentionally kept. Pure-stdlib pixel edit,
   lossless PNG: zero pixels changed outside the 12 feathered boxes.
   2-1804.png = original 2-1804.jpg with graph node labels privacy-blurred
   (first word of each label kept sharp; "BillG Review 20260210" fully
   blurred — the first word itself names a person). Same pixel pipeline:
   every pixel outside the 8 label boxes is unchanged (verified), no JPEG
   re-encode anywhere. */
const RESEARCHWIKI_PHOTOS = [
  'assets/photos/project/Research-Wiki/1-1803.png',
  'assets/photos/project/Research-Wiki/2-1804.png'
];

PRODUCTS.push(
  {
    id: 'donut', no: '07', domain: 'tech', name: 'Donut Multi-End',
    company: ['tencent', 'wechat'],
    url: 'dev.weixin.qq.com / miniapp',
    photos: DONUT_PHOTOS,
    photosFirst: true,
    tags: { en: ['Mini Program Runtime', 'Cross-Platform', 'Multi-End Framework', 'Skyline Rendering', 'iOS / Android / HarmonyOS', 'Conditional Compile', 'Native Plugins'], zh: ['小程序 Runtime', '跨平台', '多端框架', 'Skyline 渲染', '苹果 / 安卓 / 鸿蒙', '条件编译', '原生插件'] },
    title: { en: 'Develop once. Apps for every end. Less team load, less cost.', zh: '一次开发，多端应用，团队减负，省时省钱。' },
    oneliner: { en: 'A multi-end framework that compiles mini programs into apps close to native iOS and Android apps.', zh: '把小程序编译为接近 iOS 与 Android 原生应用的多端框架。' },
    star: {
      s: { en: 'Mini programs had already proven demand inside WeChat, but owning an App meant a second native team, a second codebase and a second release train; the cross-platform options then either wrapped H5 in a shell (visibly laggy) or demanded a full rewrite (visibly costly).', zh: '小程序已在微信内验证了需求，但做自有 App 意味着第二支原生团队、第二套代码、第二条发版线；当时的跨端方案不是 H5 套壳（卡顿肉眼可见），就是全量重写（成本肉眼可见）。' },
      t: { en: 'As technical product manager, define what “compile a mini program into a near-native app” has to mean: users must not feel a second-class app, and existing mini-program teams must not have to become mobile teams.', zh: '作为技术产品经理，定义「小程序编译成接近原生的 App」的达标线：用户不能感到低人一等，存量小程序团队也不必变成移动开发团队。' },
      a: { en: 'Product side: sequenced the zero-to-store path — upgrade an existing mini program, conditional compilation, three-end debugging, signing and packaging (APK / IPA / HAP), internal-test distribution, store submission — and designed the unified identity service (WeChat / phone / Apple login with account linking). Tech side: drove the runtime-reuse architecture (shared logic layer; Skyline rendering for native-grade gestures and animation), the component and API adaptation matrix, CLI / CI packaging, and a native-plugin contract covering push, ads and privacy dialogs.', zh: '产品侧：梳理「存量小程序到上架」全路径——项目升级、条件编译、三端调试、签名打包（APK / IPA / HAP）、内测分发、应用市场上架；并设计统一的身份管理服务（微信 / 手机号 / Apple 登录与账号关联）。技术侧：推动 Runtime 复用架构（共享逻辑层，Skyline 渲染支撑原生级手势与动画）、组件与 API 适配矩阵、CLI / CI 自动打包，以及覆盖推送、广告、隐私合规弹窗的原生插件契约。' },
      r: { en: 'Pilot merchants shipped iOS, Android and HarmonyOS builds from their existing mini program in about two weeks with ~90% of code untouched; one runtime now carries the same product inside WeChat and on the app stores.', zh: '首批商家基于存量小程序约两周产出苹果、安卓、鸿蒙三端包，约 90% 代码零改动；一套 Runtime 如今同时承载微信内与商店里的同一产品。' }
    },
    metrics: [
      { v: '90%', unit: { en: '', zh: '' }, label: { en: 'existing code shared, untouched', zh: '存量代码直接复用' } },
      { v: '2', unit: { en: 'weeks', zh: '周' }, label: { en: 'from mini program to 3 stores', zh: '存量小程序到三端上架' } },
      { v: '1', unit: { en: 'team', zh: '支队伍' }, label: { en: 'covers all three platforms', zh: '覆盖全部三端' } },
      { v: '95%', unit: { en: '', zh: '' }, label: { en: 'wx APIs natively adapted', zh: 'wx API 原生适配' } }
    ],
    tabs: [{ id: 'ship', label: { en: 'Ship Journey', zh: '上架旅程' } }, { id: 'runtime', label: { en: 'Runtime & APIs', zh: 'Runtime 与 API' } }],
    views: {
      ship: () => `
        <div class="ui-kpis">${kpi(T('Code shared untouched', '存量代码复用'), '90%', 'green')}${kpi(T('Mini program → 3 stores', '小程序到三端上架'), '2w', 'blue')}${kpi(T('wx APIs adapted', 'wx API 适配'), '95%')}</div>
        <div class="ui-panel">
          ${head(T('Merchant journey · mini program to apps', '商家旅程 · 从存量小程序到三端 App'), T('guided', '全程向导'), 'green')}
          <div class="ui-timeline">
            <div class="tl-item ok"><div class="tl-head"><strong>${T('Upgrade the existing mini program', '升级存量小程序')}</strong><span>D0</span></div><p>${T('add project.miniapp.json + base SDK — business code untouched', '新增 project.miniapp.json 与基础 SDK——业务代码零改动')}</p></div>
            <div class="tl-item ok"><div class="tl-head"><strong>${T('Conditional compilation', '条件编译')}</strong><span>D1</span></div><p>${T('incompatible API calls named at compile time (#elif iOS / ANDROID / OHOS)', '不兼容 API 在编译期逐一点名（#elif iOS / ANDROID / OHOS）')}</p></div>
            <div class="tl-item ok"><div class="tl-head"><strong>${T('Skyline switch', '切换 Skyline 渲染')}</strong><span>D2</span></div><p>${T('native-grade gestures and worklet animation, verified on mid-range devices', '原生级手势与 worklet 动画，中端机型实测')}</p></div>
            <div class="tl-item"><div class="tl-head"><strong>${T('Sign & package APK / IPA / HAP', '签名与打包 APK / IPA / HAP')}</strong><span>D3</span></div><p>${T('certificates, package names, Bundle IDs and Universal Links all wizard-driven', '证书、包名、Bundle ID、Universal Link 全部向导化')}</p></div>
            <div class="tl-item"><div class="tl-head"><strong>${T('Internal test, then stores', '内测分发，随后上架')}</strong><span>D5</span></div><p>${T('one-click invite testing; WeChat Pay and share-to-WeChat arrive with the SDK', '一键邀请内测；微信支付、分享到微信随 SDK 自带')}</p></div>
          </div>
        </div>
        <div class="ui-panel">
          ${head(T('One identity across ends', '多端同一账号'), T('identity service', '身份管理服务'), 'blue')}
          <div class="ui-filters"><span class="on">${T('WeChat login', '微信登录')}</span><span>${T('phone one-tap', '手机号一键登录')}</span><span>${T('Apple / Huawei / Google', 'Apple / 华为 / Google')}</span><span>${T('account linking', '账号关联')}</span></div>
          <p class="ui-note"><b>${T('Product rule · ', '产品规则 · ')}</b>${T('any login method on any end resolves to one account; mini-program login stays compatible — no forced migration for existing users.', '任一端的任一登录方式都归一到同一账号；小程序登录保持兼容，存量用户不做强制迁移。')}</p>
        </div>`,
      runtime: () => `
        <div class="ui-panel">
          ${head(T('Build & runtime path', '构建与运行路径'), T('one codebase', '同一份代码'), 'blue')}
          <div class="ui-steps">
            <div class="ui-step done"><strong>${T('Mini program', '小程序源码')}</strong><span>WXML / WXSS / JS</span></div><span class="ui-step-arrow">→</span>
            <div class="ui-step done"><strong>${T('Base SDK', '基础 SDK')}</strong><span>${T('shared logic layer', '共享逻辑层')}</span></div><span class="ui-step-arrow">→</span>
            <div class="ui-step now"><strong>Skyline</strong><span>${T('native render', '原生渲染')}</span></div><span class="ui-step-arrow">→</span>
            <div class="ui-step"><strong>APK / IPA / HAP</strong><span>${T('iOS · Android · HarmonyOS', '苹果 · 安卓 · 鸿蒙')}</span></div>
          </div>
        </div>
        <div class="ui-panel">
          ${head(T('API adaptation matrix', 'API 适配矩阵'), T('95% native', '95% 原生适配'), 'green')}
          <table class="ui-table"><thead><tr><th>${T('Capability', '能力')}</th><th>${T('Inside WeChat', '微信内')}</th><th>${T('In the app', 'App 内')}</th><th>${T('State', '状态')}</th></tr></thead><tbody>
            <tr><td>wx.login</td><td>${T('WeChat session', '微信会话')}</td><td>${T('WeChat App login · phone one-tap fallback', '微信 App 登录 · 手机号一键登录兜底')}</td><td><span class="pill low">OK</span></td></tr>
            <tr><td>${T('Payment', '支付')}</td><td>${T('WeChat Pay', '微信支付')}</td><td>${T('WeChat Pay via OpenSDK · IAP / Google Play Billing', 'OpenSDK 微信支付 · IAP / Google Play 内购')}</td><td><span class="pill low">OK</span></td></tr>
            <tr><td>wx.chooseMedia</td><td>${T('WeChat picker', '微信选择器')}</td><td>${T('system picker + permission wrapper', '系统选择器 + 权限封装')}</td><td><span class="pill low">OK</span></td></tr>
            <tr><td>${T('Map', '地图')}</td><td>${T('map component', 'map 组件')}</td><td>${T('native Tencent Map · gesture shim', '腾讯地图原生组件 · 手势 shim')}</td><td><span class="pill mid">NOTED</span></td></tr>
            <tr><td>${T('Push', '消息推送')}</td><td>${T('subscription messages', '订阅消息')}</td><td>${T('extension SDK · vendor channels', '扩展 SDK · 厂商通道')}</td><td><span class="pill info">OPT-IN</span></td></tr>
          </tbody></table>
        </div>
        <div class="ui-panel">
          ${head(T('Extension SDK & native plugins', '扩展 SDK 与原生插件'), T('opt-in', '按需接入'), 'neutral')}
          <div class="ui-bars">${barRow(T('Location services', '位置服务'), '98%', 98)}${barRow(T('TRTC live / RTC', '直播与实时音视频'), '94%', 94, 'cyan')}${barRow(T('Ads (YLH)', '广告（优量汇）'), '90%', 90)}${barRow(T('Push channels', '推送通道'), '86%', 86, 'green')}</div>
          <p class="ui-note"><b>${T('Design note · ', '设计说明 · ')}</b>${T('Platform-specific calls go through conditional compilation and the plugin contract, so an unsupported API fails at build time — not in store review.', '平台专属调用一律走条件编译与插件契约；不支持的 API 在构建期报错，而不是等到应用商店审核。')}</p>
        </div>`
    }
  },
  {
    id: 'portfoliopipeline', no: '08', domain: 'tech', name: 'Portfolio Pipeline',
    company: 'microsoft',
    url: 'msra.internal / ai-pipeline',
    tags: { en: ['LLM Automation', 'LLM Pipeline', 'Azure OpenAI', 'Serverless Orchestration', 'Prompt Engineering', 'GPT Fine-Tuning', 'Document Parsing', 'Unstructured Data'], zh: ['LLM 自动化', 'LLM 管线', 'Azure OpenAI', '无服务器编排', '提示词工程', 'GPT 微调', '文档解析', '非结构化数据'] },
    title: { en: 'Every messy record can become queryable data.', zh: '再乱的记录，也能变成可查询的数据。' },
    oneliner: { en: 'An enterprise AI pipeline that turns unstructured office and meeting records into structured operational data.', zh: '把非结构化的办公与会议记录变成结构化运营数据的企业 AI 管线。' },
    star: {
      s: { en: 'Meeting minutes, review notes and office documents were the raw material of research operations — PDF, Word, Excel, slides, recordings, chat logs, pasted text. Turning them into structured operational data meant manual retyping: slow, lossy, and formatted differently in every team.', zh: '会议纪要、评审记录与办公文档是科研运营的原材料——PDF、Word、Excel、幻灯片、录音、聊天记录、随手粘贴的文本。把它们变成结构化运营数据靠人工誊录：慢、有损，每个团队的格式还不一样。' },
      t: { en: 'Build an automation pipeline that structures this operational data — generic across office formats, with no hand curation in the loop.', zh: '建一条把运营数据自动结构化的管线——对各类办公格式通用，全程不靠人工整理。' },
      a: { en: 'With the NLP and engineering teams: wrote Python scripts to parse raw records; orchestrated Azure OpenAI on Azure Functions so extraction runs serverlessly as files arrive; engineered CO-STAR prompts so every extraction task pins down context, objective, style, tone, audience and response format; fine-tuned a GPT model for text correction — the domain terms, names and speech-to-text noise a generic model kept mangling.', zh: '与 NLP、工程团队协作：写 Python 脚本解析原始记录；用 Azure Functions 编排 Azure OpenAI，文件一到、抽取即以无服务器方式运行；设计 CO-STAR 提示词，让每个抽取任务都锁定上下文、目标、风格、语气、受众与输出格式；微调 GPT 做文本纠偏——专治通用模型屡出错的专业术语、人名与语音转写噪声。' },
      r: { en: 'About 80% of the processing now runs unattended, and time per record fell to roughly one third of the original.', zh: '约 80% 的处理量实现自动化，单条记录耗时降到原来的约三分之一。' }
    },
    metrics: [
      { v: '~80%', unit: { en: '', zh: '' }, label: { en: 'processing automated', zh: '处理自动化率' } },
      { v: '~1/3', unit: { en: '', zh: '' }, label: { en: 'time per record', zh: '单条记录耗时' } },
      { v: '3', unit: { en: 'teams', zh: '支团队' }, label: { en: 'cross-team project', zh: '跨团队项目' } }
    ],
    tabs: [{ id: 'pipeline', label: { en: 'Pipeline', zh: '管线' } }, { id: 'inside', label: { en: 'Under the Hood', zh: '技术内核' } }],
    views: {
      pipeline: () => `
        <div class="ui-kpis">${kpi(T('Automated', '自动化'), '~80%', 'green')}${kpi(T('Time per record', '单条耗时'), '~1/3', 'blue')}${kpi(T('Runtime', '运行形态'), 'Serverless')}</div>
        <div class="ui-panel">
          ${head(T('From raw records to structured data', '从原始记录到结构化数据'), T('one pipeline', '一条管线'), 'blue')}
          ${ppPipeSVG()}
          <p class="ui-note"><b>${T('Collaboration · ', '协作 · ')}</b>${T('Built with the NLP team (evaluation, prompts) and the engineering team (platform, deployment); my lines were parsing, orchestration, prompt engineering and the correction fine-tune.', '与 NLP 团队（评测、提示词）和工程团队（平台、部署）共建；我负责的环节是解析、编排、提示词工程与纠偏微调。')}</p>
        </div>
        <div class="ui-panel">
          ${head(T('Time per record · indexed', '单条记录耗时 · 指数化'), T('manual = 3', '人工 = 3'), 'amber')}
          <div class="ui-bars">${barRow(T('Manual curation', '人工整编'), '3×', 100)}${barRow(T('With the pipeline', '接入管线后'), '≈1×', 33, 'green')}</div>
          <p class="ui-note"><b>${T('As reported · ', '实际口径 · ')}</b>${T('~80% of the steps run unattended and a record takes about a third of the original time — the rest of the work stays where people are faster: judgment, not typing.', '约 80% 的步骤无人值守，单条耗时约为原来的三分之一——剩下的交给人：该判断的地方，而不是敲字的地方。')}</p>
        </div>`,
      inside: () => `
        <div class="ui-panel">
          ${head(T('CO-STAR prompt anatomy', 'CO-STAR 提示词结构'), T('every extraction task', '每个抽取任务'), 'blue')}
          <table class="ui-table"><thead><tr><th>${T('Element', '要素')}</th><th>${T('Pins down', '锁定什么')}</th><th>${T('In this pipeline', '本管线中的落点')}</th></tr></thead><tbody>
            <tr><td class="mono"><b>C</b> · Context</td><td>${T('ground truth given to the model', '交给模型的背景事实')}</td><td>${T('research-ops meeting corpus · internal only', '科研运营会议语料 · 仅限内部')}</td></tr>
            <tr><td class="mono"><b>O</b> · Objective</td><td>${T('what one pass must return', '单次抽取必须返回什么')}</td><td>${T('decisions · owners · dates · action items', '决策 · 负责人 · 日期 · 行动项')}</td></tr>
            <tr><td class="mono"><b>S</b> · Style</td><td>${T('how the text is written', '文本怎么写')}</td><td>${T('archive-grade neutral prose', '资料存档级的中性行文')}</td></tr>
            <tr><td class="mono"><b>T</b> · Tone</td><td>${T('how it sounds', '语气')}</td><td>${T('factual — no hedging, no invented certainty', '只陈述事实——不含糊，也不装确定')}</td></tr>
            <tr><td class="mono"><b>A</b> · Audience</td><td>${T('who reads it next', '下游读者')}</td><td>${T('program managers & the search index', '项目经理与检索索引')}</td></tr>
            <tr><td class="mono"><b>R</b> · Response</td><td>${T('the exact output shape', '输出格式')}</td><td>${T('strict JSON schema · one row per record', '严格 JSON 结构 · 每条记录一行')}</td></tr>
          </tbody></table>
        </div>
        <div class="ui-panel">
          ${head(T('Fine-tuned text correction', '微调 GPT · 文本纠偏'), T('3 failure classes', '3 类通病'), 'green')}
          <table class="ui-table"><thead><tr><th>${T('Raw record', '原始记录')}</th><th>${T('After the fine-tuned pass', '纠偏之后')}</th><th>${T('Issue', '问题类型')}</th></tr></thead><tbody>
            <tr><td class="mono">the N L P group reviewed teamx</td><td class="mono">the NLP group reviewed Team X</td><td><span class="pill mid">${T('token &amp; casing', '切词与大小写')}</span></td></tr>
            <tr><td class="mono">meeting at ten thirty in R M two fourteen</td><td class="mono">meeting at 10:30 in RM 214</td><td><span class="pill info">${T('spoken-form normalization', '口述格式归一')}</span></td></tr>
            <tr><td class="mono">fine tunning pipeline with AZ function</td><td class="mono">fine-tuning pipeline with Azure Functions</td><td><span class="pill low">${T('typos &amp; abbreviations', '拼写与缩写')}</span></td></tr>
          </tbody></table>
        </div>
        <div class="ui-panel">
          ${head(T('Azure Functions orchestration', 'Azure Functions 编排'), T('scales to zero', '闲时缩到零'), 'neutral')}
          <table class="ui-table"><thead><tr><th>${T('Trigger', '触发器')}</th><th>${T('Runs', '跑什么')}</th><th>${T('Note', '说明')}</th></tr></thead><tbody>
            <tr><td class="mono">blob created</td><td>${T('parser · fires per uploaded file', '解析器 · 文件上传即触发')}</td><td><span class="pill low">LIVE</span></td></tr>
            <tr><td class="mono">timer · 15 min</td><td>${T('batch correction queue', '纠偏批处理队列')}</td><td><span class="pill info">${T('drains overnight backlog', '夜间积压照跑')}</span></td></tr>
            <tr><td class="mono">queue depth</td><td>${T('extraction workers', '抽取工作进程')}</td><td><span class="pill info">${T('scale out → zero', '自动扩容 → 归零')}</span></td></tr>
            <tr><td class="mono">dead-letter queue</td><td>${T('failed records → human review', '失败件 → 转人工')}</td><td><span class="pill mid">${T('never silent', '绝不静默')}</span></td></tr>
          </tbody></table>
          <p class="ui-note"><b>${T('Sample data · ', '样例数据 · ')}</b>${T('the prompt structure and trigger design mirror the shipped pipeline; the correction rows above are illustrative.', '提示词结构与触发器设计取自实际管线；上表纠偏示例为示意数据。')}</p>
        </div>`
    }
  },
  {
    id: 'researchwiki', no: '09', domain: 'tech', name: 'Research Wiki',
    company: 'microsoft',
    url: 'research.wiki / ask',
    photos: RESEARCHWIKI_PHOTOS,
    photosFirst: true,
    tags: { en: ['LLM Wiki', 'RAG', 'Hybrid Search', 'Knowledge Graph', 'Research Ops', 'Cited Q&A', 'Knowledge Base', 'Permissions', 'Cross-Group Search'], zh: ['LLM Wiki', 'RAG', '混合检索', '知识图谱', '科研协作', '带引用问答', '知识库', '权限隔离', '跨组检索'] },
    title: { en: 'Every answer should point back to the source.', zh: '每一句回答，都应该能指回原文。' },
    oneliner: { en: 'A knowledge-base product for research groups and their source materials.', zh: '面向研究院、统一管理各研究组研究材料的知识库产品。' },
    star: {
      s: { en: 'Twenty-two research groups kept papers, slides, lab notes and READMEs across drives, wikis and local folders. A plain chatbot produced confident answers nobody could verify.', zh: '二十二个研究组的论文、幻灯片、实验记录与代码说明散落在网盘、Wiki 和本地文件夹里；直接用聊天机器人问答，回答听着笃定，却无法核验。' },
      t: { en: 'Make cross-group material findable in one place, with every claim traceable to an original document and clear permission boundaries.', zh: '让跨组材料在一个入口可检索，每条结论都能追溯到原始文档，并且权限边界清晰。' },
      a: { en: 'Built one ingest pipeline with group / project / date metadata and versioning, hybrid BM25 + vector retrieval with rerank, citation-enforced answers, an explicit "not found" fallback, and a golden eval set from researcher feedback.', zh: '统一接入管线并附加「研究组 / 项目 / 日期 / 材料类型」元数据与版本；BM25 + 向量混合检索加 rerank；回答强制带引用、查不到就明确说查不到；把研究员反馈沉淀成评测集。' },
      r: { en: '91% of answers fully citation-backed, cross-group material reuse up 3.1×, and new-member onboarding from 3 weeks to 6 days.', zh: '91% 的回答完整可溯源，跨组材料复用提升 3.1 倍，新人上手从 3 周缩到 6 天。' }
    },
    metrics: [
      { v: '91%', unit: { en: '', zh: '' }, label: { en: 'answers fully cited', zh: '回答完整可溯源' } },
      { v: '3.1×', unit: { en: '', zh: '' }, label: { en: 'cross-group reuse', zh: '跨组材料复用' } },
      { v: '6', unit: { en: 'days', zh: '天' }, label: { en: 'onboarding (from 3 wks)', zh: '新人上手（原 3 周）' } },
      { v: '22', unit: { en: '', zh: '' }, label: { en: 'research groups connected', zh: '接入研究组' } }
    ],
    tabs: [{ id: 'ask', label: { en: 'Ask', zh: '问答' } }, { id: 'sources', label: { en: 'Sources', zh: '材料库' } }],
    views: {
      ask: () => `
        <div class="ui-kpis">${kpi(T('Citation coverage', '引用覆盖率'), '91%', 'green')}${kpi(T('Indexed docs', '已入库文档'), '12,480')}${kpi(T('Research groups', '研究组'), '22')}</div>
        <div class="ui-panel">
          ${head(T('Ask across groups', '跨组提问'), T('grounded', '有据可查'), 'blue')}
          <div class="qa-q">${T('What did the materials group conclude about thermal drift in the Q2 prototypes?', '材料组对 Q2 原型的热漂移得出了什么结论？')}</div>
          <div class="qa-a">
            ${T('The Q2 prototypes showed a 0.8°C drift after 400 thermal cycles, attributed to the adhesive layer', 'Q2 原型在 400 次热循环后出现 0.8°C 漂移，原因指向粘接层')}<span class="qa-cite">[M-204]</span>${T('; the same effect was reproduced by the systems group under a different fixture', '；系统组在另一套夹具下复现了同一现象')}<span class="qa-cite">[S-118]</span>${T('. Recommended mitigation was not validated before the group review.', '。建议的缓解方案在组会前尚未完成验证。')}
          </div>
        </div>
        <div class="ui-panel">
          ${head(T('Retrieved sources', '检索到的来源'), T('3 of 12,480', '12,480 中 3 条'), 'neutral')}
          <table class="ui-table"><thead><tr><th>ID</th><th>${T('Group', '研究组')}</th><th>${T('Document', '文档')}</th><th>${T('Date', '日期')}</th><th>${T('Relevance', '相关度')}</th></tr></thead><tbody>
            <tr><td class="mono">M-204</td><td>${T('Materials', '材料')}</td><td>${T('Q2 thermal cycle report', 'Q2 热循环报告')}</td><td>2026-05</td><td><span class="pill low">0.94</span></td></tr>
            <tr><td class="mono">S-118</td><td>${T('Systems', '系统')}</td><td>${T('Fixture reproducibility note', '夹具复现性记录')}</td><td>2026-06</td><td><span class="pill info">0.87</span></td></tr>
            <tr><td class="mono">M-211</td><td>${T('Materials', '材料')}</td><td>${T('Adhesive spec v3', '粘接剂规格 v3')}</td><td>2026-04</td><td><span class="pill neutral">0.71</span></td></tr>
          </tbody></table>
        </div>
        <p class="ui-note"><b>${T('Guardrail · ', '护栏 · ')}</b>${T('If retrieval confidence is below threshold, the system replies "not found in indexed material" instead of generating an answer.', '检索置信度低于阈值时，系统回答「未在已入库材料中找到」，而不是编造答案。')}</p>`,
      sources: () => `
        <div class="ui-panel">
          ${head(T('Indexed material by group', '各研究组入库材料'), T('12,480 docs', '12,480 份'), 'green')}
          <div class="ui-bars">${barRow(T('Materials', '材料组'), '3,210', 88)}${barRow(T('Systems', '系统组'), '2,860', 79, 'cyan')}${barRow(T('Algorithms', '算法组'), '2,540', 70)}${barRow(T('Devices', '器件组'), '2,180', 60, 'green')}${barRow(T('Ops / lab notes', '实验记录'), '1,690', 47, 'cyan')}</div>
        </div>
        <div class="ui-panel">
          ${head(T('Ingest & access policy', '接入与权限策略'), T('versioned', '带版本'), 'blue')}
          <table class="ui-table"><thead><tr><th>${T('Type', '类型')}</th><th>${T('Metadata', '元数据')}</th><th>${T('Access', '可见范围')}</th><th>${T('State', '状态')}</th></tr></thead><tbody>
            <tr><td>${T('Paper / PDF', '论文')}</td><td>${T('group · project · DOI', '组别 · 项目 · DOI')}</td><td>${T('All groups', '全组可见')}</td><td><span class="pill low">LIVE</span></td></tr>
            <tr><td>${T('Lab notebook', '实验记录')}</td><td>${T('author · date · run ID', '作者 · 日期 · 批次')}</td><td>${T('Owner group', '仅本组')}</td><td><span class="pill low">LIVE</span></td></tr>
            <tr><td>${T('Slide / review', '汇报材料')}</td><td>${T('meeting · version', '会议 · 版本')}</td><td>${T('Owner group', '仅本组')}</td><td><span class="pill mid">DRAFT</span></td></tr>
            <tr><td>${T('Code README', '代码说明')}</td><td>${T('repo · commit', '仓库 · 提交')}</td><td>${T('All groups', '全组可见')}</td><td><span class="pill info">SYNCING</span></td></tr>
          </tbody></table>
        </div>
        <p class="ui-note"><b>${T('Eval · ', '评测 · ')}</b>${T('A golden set of 240 real researcher questions is re-run on every retrieval change; a stale document version never outranks the current one.', '240 条真实研究员问题构成评测集，每次检索改动都重跑；过期版本不会排在现版本之前。')}</p>`
    }
  }
);

/* Declare own carousel imagery for the shared prewarmer (warm.js), same
   registry contract as core/, tab/me and tab/e-commerce: rank 2. */
if (window.PortfolioWarm) { window.PortfolioWarm.add(DONUT_PHOTOS, 2); window.PortfolioWarm.add(RESEARCHWIKI_PHOTOS, 2); }
