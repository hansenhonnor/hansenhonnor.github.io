/* ==========================================================================
   tab/tech/tech.js — 2 case studies (Tech tab).

   Add a project here, not in core/. Each object needs: id, no, domain,
   name, company, url, tabs, views, tags, title, oneliner, star, metrics.
   Set `interactive: 'cluster' | 'flow'` to use a registered demo instead
   of the standard dashboard; add `photos: [...]` to get a carousel.
   Views are functions, so core helpers (T, esc, kpi, head, ...) resolve
   at render time. Order here = order in the tab and the floating TOC.
   ========================================================================== */

PRODUCTS.push(
  {
    id: 'donut', no: '07', domain: 'tech', name: 'Donut',
    company: ['tencent', 'wechat'],
    url: 'donut.dev / build-4821',
    photos: PHOTO_SET,
    tags: { en: ['Mini program', 'Cross-platform', 'Compiler', 'iOS / Android', 'Native bridge'], zh: ['小程序', '多端编译', '编译层', 'iOS / Android', '原生桥接'] },
    title: { en: 'One mini program. Two native apps. No rewrite.', zh: '一个小程序，两个原生包，不用重写。' },
    oneliner: { en: 'A cross-platform framework for turning mini programs into native iOS and Android apps.', zh: '把小程序编译为 iOS 与 Android 原生应用的多端框架。' },
    star: {
      s: { en: 'Every consumer feature shipped twice — once as a WeChat mini program, once as native iOS/Android — with two teams and two release trains.', zh: '每个消费端功能都要做两遍：小程序一遍，iOS / Android 原生一遍；两个团队、两条发版节奏。' },
      t: { en: 'Compile an existing mini program into store-ready apps with minimal rewrite, without giving up native capabilities.', zh: '让现有小程序以最小改造产出可上架的原生包，同时保留调用原生能力的空间。' },
      a: { en: 'Designed a DSL → IR compile layer, a JS ↔ Native runtime bridge, a component parity matrix with documented fallbacks, plus a CLI and a 42-screen compatibility eval suite.', zh: '设计 DSL → 中间 IR 的编译层、JS ↔ Native 运行时桥、带兜底说明的组件对齐表，并配套 CLI 与 42 屏兼容性评测集。' },
      r: { en: '87% code reuse, first successful build in 3 days, and 96% UI parity across both platforms.', zh: '代码复用率 87%，3 天跑通首个构建，双端 UI 一致性 96%。' }
    },
    metrics: [
      { v: '87%', unit: { en: '', zh: '' }, label: { en: 'code reuse', zh: '代码复用率' } },
      { v: '3', unit: { en: 'days', zh: '天' }, label: { en: 'to first native build', zh: '跑通首个原生构建' } },
      { v: '96%', unit: { en: '', zh: '' }, label: { en: 'UI parity, 42 screens', zh: '42 屏 UI 一致性' } }
    ],
    tabs: [{ id: 'pipeline', label: { en: 'Build Pipeline', zh: '构建流水线' } }, { id: 'parity', label: { en: 'Component Parity', zh: '组件对齐' } }],
    views: {
      pipeline: () => `
        <div class="ui-kpis">${kpi(T('Code reuse', '代码复用'), '87%', 'green')}${kpi(T('Build time', '构建耗时'), '2m 14s', 'blue')}${kpi(T('Screens passed', '通过评测'), '42/42')}</div>
        <div class="ui-panel">
          ${head(T('Compile pipeline · build #4821', '编译流水线 · 构建 #4821'), T('passed', '通过'), 'green')}
          <div class="ui-steps">
            <div class="ui-step done"><strong>${T('Mini program', '小程序')}</strong><span>WXML / WXSS</span></div><span class="ui-step-arrow">→</span>
            <div class="ui-step done"><strong>${T('Parser', '解析')}</strong><span>DSL</span></div><span class="ui-step-arrow">→</span>
            <div class="ui-step done"><strong>IR</strong><span>${T('shared AST', '共享 AST')}</span></div><span class="ui-step-arrow">→</span>
            <div class="ui-step now"><strong>iOS / Android</strong><span>UIKit / Compose</span></div>
          </div>
        </div>
        <div class="ui-panel">
          ${head(T('Build log', '构建日志'), T('v2.4.0', 'v2.4.0'), 'neutral')}
          <table class="ui-table"><thead><tr><th>${T('Stage', '阶段')}</th><th>${T('Input', '输入')}</th><th>${T('Output', '输出')}</th><th>${T('Time', '耗时')}</th><th>${T('Status', '状态')}</th></tr></thead><tbody>
            <tr><td>${T('Parse', '解析')}</td><td>186 files</td><td>DSL tree</td><td>18s</td><td><span class="pill low">OK</span></td></tr>
            <tr><td>${T('Lower to IR', '降级为 IR')}</td><td>DSL tree</td><td>2,410 nodes</td><td>34s</td><td><span class="pill low">OK</span></td></tr>
            <tr><td>${T('Bridge map', '桥接映射')}</td><td>14 APIs</td><td>14 modules</td><td>22s</td><td><span class="pill low">OK</span></td></tr>
            <tr><td>${T('Emit', '生成')}</td><td>IR</td><td>2 targets</td><td>60s</td><td><span class="pill info">RUNNING</span></td></tr>
          </tbody></table>
        </div>
        <p class="ui-note"><b>${T('Design note · ', '设计说明 · ')}</b>${T('Platform-specific calls are lowered into bridge modules with an explicit fallback contract, so unsupported APIs fail at build time, not in review.', '平台专属调用会降级成带兜底契约的桥接模块；不支持的 API 在构建期就报错，而不是等到审核。')}</p>`,
      parity: () => `
        <div class="ui-panel">
          ${head(T('Component parity matrix', '组件对齐表'), T('42 screens', '42 屏'), 'blue')}
          <table class="ui-table"><thead><tr><th>${T('Component', '组件')}</th><th>${T('Mini program', '小程序')}</th><th>iOS</th><th>Android</th><th>${T('State', '状态')}</th></tr></thead><tbody>
            <tr><td>Navigation</td><td>nav-bar</td><td>UINav</td><td>NavHost</td><td><span class="pill low">100%</span></td></tr>
            <tr><td>List</td><td>scroll-view</td><td>UITableView</td><td>LazyColumn</td><td><span class="pill low">98%</span></td></tr>
            <tr><td>Form / input</td><td>input</td><td>UITextField</td><td>TextField</td><td><span class="pill low">96%</span></td></tr>
            <tr><td>Media</td><td>video</td><td>AVPlayer</td><td>ExoPlayer</td><td><span class="pill mid">91%</span></td></tr>
            <tr><td>Map</td><td>map</td><td>MKMapView</td><td>Compose Map</td><td><span class="pill mid">87%</span></td></tr>
          </tbody></table>
        </div>
        <div class="ui-panel">
          ${head(T('Parity by component family', '各组件族对齐率'), T('eval suite', '评测集'), 'green')}
          <div class="ui-bars">${barRow('Navigation', '100%', 100, 'green')}${barRow('List', '98%', 98)}${barRow('Form', '96%', 96, 'cyan')}${barRow('Media', '91%', 91)}${barRow('Map', '87%', 87, 'cyan')}</div>
          <p class="ui-note"><b>${T('Gap · ', '缺口 · ')}</b>${T('Map gestures need a native shim; documented fallback ships as a static snapshot with a link out.', '地图手势需原生 shim；兜底方案是静态快照 + 外链，已写入对齐表。')}</p>
        </div>`
    }
  },
  {
    id: 'researchwiki', no: '08', domain: 'tech', name: 'Research Wiki',
    company: 'microsoft',
    url: 'research.wiki / ask',
    tags: { en: ['Research ops', 'Cited Q&A', 'Knowledge base', 'Permissions', 'Version control', 'Cross-group search'], zh: ['科研协作', '带引用问答', '知识库', '权限隔离', '版本管理', '跨组检索'] },
    title: { en: 'Every answer should point back to the source.', zh: '每一句回答，都应该能指回原文。' },
    oneliner: { en: 'A knowledge-base product for research groups and their source materials.', zh: '面向研究院、统一管理各研究组研究材料的知识库产品。' },
    star: {
      s: { en: 'Six research groups kept papers, slides, lab notes and READMEs across drives, wikis and local folders. A plain chatbot produced confident answers nobody could verify.', zh: '六个研究组的论文、幻灯片、实验记录与代码说明散落在网盘、Wiki 和本地文件夹里；直接用聊天机器人问答，回答听着笃定，却无法核验。' },
      t: { en: 'Make cross-group material findable in one place, with every claim traceable to an original document and clear permission boundaries.', zh: '让跨组材料在一个入口可检索，每条结论都能追溯到原始文档，并且权限边界清晰。' },
      a: { en: 'Built one ingest pipeline with group / project / date metadata and versioning, hybrid BM25 + vector retrieval with rerank, citation-enforced answers, an explicit "not found" fallback, and a golden eval set from researcher feedback.', zh: '统一接入管线并附加「研究组 / 项目 / 日期 / 材料类型」元数据与版本；BM25 + 向量混合检索加 rerank；回答强制带引用、查不到就明确说查不到；把研究员反馈沉淀成评测集。' },
      r: { en: '91% of answers fully citation-backed, cross-group material reuse up 3.1×, and new-member onboarding from 3 weeks to 6 days.', zh: '91% 的回答完整可溯源，跨组材料复用提升 3.1 倍，新人上手从 3 周缩到 6 天。' }
    },
    metrics: [
      { v: '91%', unit: { en: '', zh: '' }, label: { en: 'answers fully cited', zh: '回答完整可溯源' } },
      { v: '3.1×', unit: { en: '', zh: '' }, label: { en: 'cross-group reuse', zh: '跨组材料复用' } },
      { v: '6', unit: { en: 'days', zh: '天' }, label: { en: 'onboarding (from 3 wks)', zh: '新人上手（原 3 周）' } },
      { v: '6', unit: { en: '', zh: '' }, label: { en: 'research groups connected', zh: '接入研究组' } }
    ],
    tabs: [{ id: 'ask', label: { en: 'Ask', zh: '问答' } }, { id: 'sources', label: { en: 'Sources', zh: '材料库' } }],
    views: {
      ask: () => `
        <div class="ui-kpis">${kpi(T('Citation coverage', '引用覆盖率'), '91%', 'green')}${kpi(T('Indexed docs', '已入库文档'), '12,480')}${kpi(T('Research groups', '研究组'), '6')}</div>
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
