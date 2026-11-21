/* ==========================================================================
   tab/finance/finance.js — 3 case studies (Finance tab).

   Add a project here, not in core/. Each object needs: id, no, domain,
   name, company, url, tabs, views, tags, title, oneliner, star, metrics.
   Set `interactive: 'cluster' | 'flow'` to use a registered demo instead
   of the standard dashboard; add `photos: [...]` to get a carousel.
   Views are functions, so core helpers (T, esc, kpi, head, ...) resolve
   at render time. Order here = order in the tab and the floating TOC.
   ========================================================================== */

/* Treasury Link — two inline diagrams (borrowing the Simi-Part / Factory Flow
   language: marching-ants dashes + SMIL data packets + a pulsing hub, but as
   static SVG inside standard views, no PortfolioDemos registration needed).
   Colours follow the site palette (#2b54b8 blue lane, greens, amber audit). */
function lfMeshSVG() {
  const gw = LANG === 'zh' ? ['定制', '网关'] : ['Custom', 'gateway'];
  return `<svg class="lf-svg" viewBox="0 0 640 330" preserveAspectRatio="xMidYMid meet" role="img"
      aria-label="${esc(T('From one shared public API to a tenant-aware gateway with segregated lanes', '从共享公开 API 到租户网关，各行其道'))}">
    <text x="8" y="16" class="lf-dim">${esc(T('BEFORE · shared pipe, coupled changes', '之前 · 共享管道，改动互相牵连'))}</text>
    <rect x="8" y="26" width="84" height="30" rx="7" class="lf-old"/>
    <text x="50" y="45" text-anchor="middle">${esc(T('Subsidiary A', '子公司 A'))}</text>
    <rect x="8" y="64" width="84" height="30" rx="7" class="lf-old"/>
    <text x="50" y="83" text-anchor="middle">${esc(T('Subsidiary B', '子公司 B'))}</text>
    <rect x="190" y="45" width="104" height="34" rx="8" class="lf-old"/>
    <text x="242" y="66" text-anchor="middle">${esc(T('Public API', '公开 API'))}</text>
    <rect x="430" y="45" width="118" height="34" rx="8" class="lf-old"/>
    <text x="489" y="66" text-anchor="middle">${esc(T('Shared tables', '共享表'))}</text>
    <path d="M 92 41 L 186 55" fill="none" stroke="#b8bdc6" stroke-width="1.3" stroke-dasharray="4 5"/>
    <path d="M 92 79 L 186 69" fill="none" stroke="#b8bdc6" stroke-width="1.3" stroke-dasharray="4 5"/>
    <path d="M 294 62 H 426" fill="none" stroke="#b8bdc6" stroke-width="1.3" stroke-dasharray="4 5"/>
    <path d="M 186 50.5 L 192 55.5 L 186 60.5 Z" fill="#b8bdc6"/>
    <path d="M 186 64.5 L 192 69.5 L 186 74.5 Z" fill="#b8bdc6"/>
    <path d="M 426 57.5 L 432 62.5 L 426 67.5 Z" fill="#b8bdc6"/>
    <text x="430" y="94" class="lf-warn">${esc(T('one schema · every change couples back', '一套表结构 · 改动全组连坐'))}</text>
    <line x1="8" y1="108" x2="632" y2="108" stroke="#e8e8ed" stroke-width="1" stroke-dasharray="5 6"/>
    <text x="8" y="130" class="lf-dim">${esc(T('AFTER · one gateway, own lanes', '之后 · 一个网关，各行其道'))}</text>
    <circle cx="76" cy="232" r="44" fill="#fff" stroke="#2b54b8" stroke-width="1.6"/>
    <circle cx="76" cy="232" r="44" fill="none" stroke="#2b54b8" stroke-width="1.5" opacity=".45">
      <animate attributeName="r" values="44;62" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".45;0" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="76" cy="232" r="44" fill="none" stroke="#3b8ad9" stroke-width="1.3" opacity=".3">
      <animate attributeName="r" values="44;62" dur="3s" begin="-1.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".3;0" dur="3s" begin="-1.5s" repeatCount="indefinite"/>
    </circle>
    <text x="76" y="227" text-anchor="middle">${esc(gw[0])}</text>
    <text x="76" y="245" text-anchor="middle">${esc(gw[1])}</text>
    <text x="76" y="300" text-anchor="middle" class="lf-dim">${esc(T('tenant-id routing', '租户路由'))}</text>
    <path d="M 116 208 C 160 170 170 170 214 170" fill="none" stroke="#2b54b8" stroke-width="2" stroke-dasharray="7 7" stroke-linecap="round" opacity=".65" class="lf-ants"/>
    <path d="M 354 170 H 474" fill="none" stroke="#2b54b8" stroke-width="2" stroke-dasharray="7 7" stroke-linecap="round" opacity=".65" class="lf-ants"/>
    <path d="M 116 256 C 160 294 170 294 214 294" fill="none" stroke="#3f9e7d" stroke-width="2" stroke-dasharray="7 7" stroke-linecap="round" opacity=".65" class="lf-ants"/>
    <path d="M 354 294 H 474" fill="none" stroke="#3f9e7d" stroke-width="2" stroke-dasharray="7 7" stroke-linecap="round" opacity=".65" class="lf-ants"/>
    <path d="M 208 165.5 L 214 170 L 208 174.5 Z" fill="#2b54b8"/>
    <path d="M 468 165.5 L 474 170 L 468 174.5 Z" fill="#2b54b8"/>
    <path d="M 208 289.5 L 214 294 L 208 298.5 Z" fill="#3f9e7d"/>
    <path d="M 468 289.5 L 474 294 L 468 298.5 Z" fill="#3f9e7d"/>
    <g><circle r="6" fill="#fff"/><circle r="3.4" fill="#2b54b8"/>
      <animateMotion dur="3.2s" begin="0s" repeatCount="indefinite" path="M 116 208 C 160 170 170 170 214 170"/></g>
    <g><circle r="6" fill="#fff"/><circle r="3.4" fill="#2b54b8"/>
      <animateMotion dur="2.6s" begin="-0.9s" repeatCount="indefinite" path="M 354 170 H 474"/></g>
    <g><circle r="6" fill="#fff"/><circle r="3.4" fill="#3f9e7d"/>
      <animateMotion dur="3.2s" begin="-1.6s" repeatCount="indefinite" path="M 116 256 C 160 294 170 294 214 294"/></g>
    <g><circle r="6" fill="#fff"/><circle r="3.4" fill="#3f9e7d"/>
      <animateMotion dur="2.6s" begin="-2.2s" repeatCount="indefinite" path="M 354 294 H 474"/></g>
    <rect x="214" y="146" width="140" height="48" rx="9" fill="#eef3fb" stroke="rgba(43,84,184,.30)" stroke-width="1.3"/>
    <text x="284" y="167" text-anchor="middle">${esc(T('svc · Subsidiary A', '服务 · 子公司 A'))}</text>
    <text x="284" y="183" text-anchor="middle" class="lf-dim">${esc(T('custom treasury rules', '定制资金规则'))}</text>
    <rect x="474" y="146" width="126" height="48" rx="9" fill="#eef3fb" stroke="rgba(43,84,184,.30)" stroke-width="1.3"/>
    <text x="537" y="167" text-anchor="middle">${esc(T('shard · ledger A', '分片 · 账本 A'))}</text>
    <text x="537" y="183" text-anchor="middle" class="lf-dim">${esc(T('own schema', '独立表结构'))}</text>
    <rect x="214" y="270" width="140" height="48" rx="9" fill="#eef8f3" stroke="rgba(63,158,125,.35)" stroke-width="1.3"/>
    <text x="284" y="291" text-anchor="middle">${esc(T('svc · Subsidiary B', '服务 · 子公司 B'))}</text>
    <text x="284" y="307" text-anchor="middle" class="lf-dim">${esc(T('custom treasury rules', '定制资金规则'))}</text>
    <rect x="474" y="270" width="126" height="48" rx="9" fill="#eef8f3" stroke="rgba(63,158,125,.35)" stroke-width="1.3"/>
    <text x="537" y="291" text-anchor="middle">${esc(T('shard · ledger B', '分片 · 账本 B'))}</text>
    <text x="537" y="307" text-anchor="middle" class="lf-dim">${esc(T('own schema', '独立表结构'))}</text>
    <rect x="390" y="146" width="44" height="17" rx="8.5" fill="#eaf2fc"/>
    <text x="412" y="158.5" text-anchor="middle" class="lf-badge" fill="#2b54b8">Avro</text>
    <rect x="390" y="270" width="44" height="17" rx="8.5" fill="#ebf7f1"/>
    <text x="412" y="282.5" text-anchor="middle" class="lf-badge" fill="#2f8068">Avro</text>
  </svg>`;
}
function lfGateSVG() {
  const st = LANG === 'zh'
    ? [['提交', '每次合入'], ['静态扫描', '编码规范'], ['CVE 与注入', '安全扫雷'], ['热点重写', '性能与内存'], ['上线门禁', '通过']]
    : [['Commit', 'every merge'], ['Static scan', 'coding rules'], ['CVE & SQLi', 'security sweep'], ['Refactor', 'perf & memory'], ['Release gate', 'passed']];
  const fills = [
    'class="lf-white"',
    'fill="#eef3fb" stroke="rgba(43,84,184,.30)"',
    'fill="#fbf4e9" stroke="rgba(205,162,98,.45)"',
    'fill="#edf8fb" stroke="rgba(69,180,210,.45)"',
    'fill="#eef8f3" stroke="rgba(63,158,125,.55)"'
  ];
  const xs = [6, 140, 274, 408, 542];
  const boxes = st.map((s, i) => `
    <rect x="${xs[i]}" y="30" width="96" height="46" rx="9" ${fills[i]} stroke-width="1.3"/>
    <text x="${xs[i] + 48}" y="57" text-anchor="middle">${esc(s[0])}</text>
    <text x="${xs[i] + 48}" y="90" text-anchor="middle" class="${i === 4 ? 'lf-ok' : 'lf-dim'}">${esc(s[1])}</text>`).join('');
  const links = [104, 238, 372, 506].map((x, i) => `
    <path d="M ${x} 53 H ${x + 32}" fill="none" stroke="#2b54b8" stroke-width="1.8" stroke-dasharray="7 7" stroke-linecap="round" opacity=".55" class="lf-ants"/>
    <path d="M ${x + 26} 48.5 L ${x + 33} 53 L ${x + 26} 57.5 Z" fill="#2b54b8" opacity=".8"/>
    <g><circle r="5" fill="#fff"/><circle r="3" fill="#2b54b8"/>
      <animateMotion dur="1.6s" begin="-${(i * 0.4).toFixed(2)}s" repeatCount="indefinite" path="M ${x} 53 H ${x + 32}"/></g>`).join('');
  return `<svg class="lf-svg" viewBox="0 0 640 148" preserveAspectRatio="xMidYMid meet" role="img"
      aria-label="${esc(T('Pre-launch audit pipeline with a fail-and-rescan loop', '上线前审计流水线，含未通过回扫'))}">
    ${links}
    <path d="M 590 78 V 120 H 188 V 84" fill="none" stroke="#b8bdc6" stroke-width="1.3" stroke-dasharray="5 6" opacity=".9"/>
    <path d="M 183 87 L 188 79 L 193 87 Z" fill="#b8bdc6"/>
    <g><circle r="4.5" fill="#fff"/><circle r="2.6" fill="#b8bdc6"/>
      <animateMotion dur="4.6s" begin="-1s" repeatCount="indefinite" path="M 590 78 V 120 H 188 V 84"/></g>
    <text x="389" y="138" text-anchor="middle" class="lf-dim">${esc(T('not passed → fix, rescan, keep history', '未通过 → 修复重扫，全程留痕'))}</text>
    ${boxes}
    <rect x="542" y="30" width="96" height="46" rx="9" fill="none" stroke="#77c7a6" stroke-width="3" opacity=".5">
      <animate attributeName="opacity" values=".55;.08;.55" dur="2.4s" repeatCount="indefinite"/>
    </rect>
  </svg>`;
}

PRODUCTS.push(
  {
    id: 'creditpulse', no: '10', domain: 'finance', name: 'Credit Pulse',
    company: 'abc',
    url: 'creditpulse.bank / application-8841',
    tags: { en: ['Credit Risk', 'Default PD', 'Survival Model', 'Explainability', 'Repayment Behaviour', 'Early Warning'], zh: ['信用风险', '违约概率', '生存模型', '可解释性', '还款行为', '早期预警'] },
    title: { en: 'Know which loan will struggle — early enough to help.', zh: '提前看出哪笔贷款可能还不上，才来得及帮一把。' },
    oneliner: { en: 'A machine-learning risk product for loan default prediction.', zh: '面向信贷违约预测的机器学习风控产品。' },
    star: {
      s: { en: 'Scorecards saw only the application form. Repayment behaviour never entered the model, and delinquency surfaced after the first missed payment.', zh: '评分卡只看申请表；贷后还款行为进不了模型，不良往往在首次逾期之后才暴露。' },
      t: { en: 'Give lending an explainable default probability at origination, refreshed throughout the life of the loan.', zh: '在贷前给出可解释的违约概率，并在贷款全周期内持续刷新。' },
      a: { en: 'Combined application, repayment-sequence and macro features in a survival model; shipped PD, top factors and pricing bands with fairness constraints, reason codes on every decline, and human review above a threshold.', zh: '把申请、还款时序与宏观变量并入生存模型；输出 PD、主要因子与定价分档，加公平性约束、拒绝必附理由码，超阈值转人工复核。' },
      r: { en: 'AUC 0.86, 23% lower NPL rate, and early warning 45 days before the first missed payment.', zh: 'AUC 0.86，不良率下降 23%，提前 45 天预警首次逾期。' }
    },
    metrics: [
      { v: '0.86', unit: { en: 'AUC', zh: 'AUC' }, label: { en: 'model discrimination', zh: '模型区分度' } },
      { v: '−23%', unit: { en: '', zh: '' }, label: { en: 'NPL rate', zh: '不良率下降' } },
      { v: '45', unit: { en: 'days', zh: '天' }, label: { en: 'earlier warning', zh: '预警提前量' } }
    ],
    tabs: [{ id: 'applicant', label: { en: 'Applicant', zh: '单笔申请' } }, { id: 'portfolio', label: { en: 'Portfolio', zh: '组合视图' } }],
    views: {
      applicant: () => `
        <div class="ui-kpis">${kpi('AUC', '0.86')}${kpi(T('NPL', '不良率'), '−23%', 'green')}${kpi(T('Early Warning', '提前预警'), '45d', 'blue')}</div>
        <div class="ui-panel">
          ${head(T('Application #8841 · personal loan', '申请 #8841 · 个人贷款'), T('scored', '已评分'), 'blue')}
          <div class="ui-score"><strong>2.7%</strong><span>${T('12-month probability of default', '未来 12 个月违约概率')}</span><span class="ui-decision">${T('REFER', '转人工')}</span></div>
          <table class="ui-table" style="margin-top:10px"><thead><tr><th>${T('Field', '字段')}</th><th>${T('Value', '取值')}</th><th>${T('Recommended', '建议')}</th></tr></thead><tbody>
            <tr><td>${T('Requested', '申请额度')}</td><td class="mono">HK$ 180,000</td><td class="mono">HK$ 120,000</td></tr>
            <tr><td>${T('Tenor', '期限')}</td><td class="mono">36 mo</td><td class="mono">24 mo</td></tr>
            <tr><td>${T('Risk band', '风险分档')}</td><td>B2</td><td>${T('Band B · price +1.2pt', 'B 档 · 定价 +1.2pt')}</td></tr>
          </tbody></table>
        </div>
        <div class="ui-panel">
          ${head(T('Top factors', '主要影响因子'), T('reason codes', '理由码'), 'amber')}
          <div class="ui-bars">${barRow(T('Debt-to-income ratio', '负债收入比'), '+0.9pt', 72)}${barRow(T('Repayment volatility', '还款波动'), '+0.6pt', 52, 'cyan')}${barRow(T('Employer tenure', '在职时长'), '−0.4pt', 33, 'green')}${barRow(T('Utilisation trend', '额度使用率趋势'), '+0.3pt', 26)}</div>
          <p class="ui-note"><b>${T('Compliance · ', '合规 · ')}</b>${T('Decline and repricing both require a reason code; fairness constraints checked per segment at every release.', '拒绝与重定价均需理由码；每次发版按客群校验公平性约束。')}</p>
        </div>`,
      portfolio: () => `
        <div class="ui-panel">
          ${head(T('Rolling default rate · 12 months', '滚动违约率 · 12 个月'), T('with intervention', '含早期干预'), 'blue')}
          ${lineChart([24, 28, 33, 39, 44, 48, 52, 55, 57, 58, 60, 61], [24, 30, 38, 47, 56, 64, 70, 75, 79, 82, 84, 86], { target: 45 })}
          ${legend([[C.blue, T('With early warning', '含预警干预')], [C.baseline, T('Baseline', '基线')], [C.mint, T('Threshold', '阈值')]])}
        </div>
        <div class="ui-panel">
          ${head(T('Risk bands & actions', '风险分档与动作'), T('Q4 book', 'Q4 存量'), 'green')}
          <table class="ui-table"><thead><tr><th>${T('Band', '分档')}</th><th>${T('Share', '占比')}</th><th>${T('Avg PD', '平均 PD')}</th><th>${T('Action', '动作')}</th></tr></thead><tbody>
            <tr><td>A</td><td class="mono">52%</td><td class="mono">0.4%</td><td><span class="pill low">${T('Auto approve', '自动通过')}</span></td></tr>
            <tr><td>B</td><td class="mono">31%</td><td class="mono">2.1%</td><td><span class="pill info">${T('Price by band', '分档定价')}</span></td></tr>
            <tr><td>C</td><td class="mono">13%</td><td class="mono">7.8%</td><td><span class="pill mid">${T('Early outreach', '提前触达')}</span></td></tr>
            <tr><td>D</td><td class="mono">4%</td><td class="mono">21.3%</td><td><span class="pill high">${T('Human Review', '人工复核')}</span></td></tr>
          </tbody></table>
        </div>`
    }
  },
  {
    id: 'treasurylink', no: '11', domain: 'finance', name: 'Treasury Link',
    company: 'huawei',
    url: 'treasurylink.corp / service-mesh',
    tags: { en: ['Fintech Infrastructure', 'Microservices', 'API Integration', 'Data Segregation', 'Database Sharding', 'Security Hardening', 'Performance Tuning'], zh: ['金融基础设施', '微服务', 'API 集成', '数据隔离', '数据库分片', '安全加固', '性能优化'] },
    title: { en: 'One group standard. Each subsidiary keeps its own ledger.', zh: '集团一套标准，子公司各记各的账。' },
    oneliner: { en: 'Internal financial infrastructure — custom interfaces and a hardened core for subsidiary treasury systems.', zh: '企业内部金融基础设施——为子公司资金系统定制的接口层与加固后的核心。' },
    star: {
      s: { en: 'Subsidiaries plugged into group finance through a single public API — same payloads, shared tables, one release train. Subsidiary treasury teams had no room for their own payment and funding logic, and every small change rippled through the whole group. At the same time the platform was approaching launch while years of legacy code still fell short of the new coding-compliance bar.', zh: '各子公司通过同一套集团公开 API 接入财务系统——同样的报文、共享的表、同一趟发版列车。子公司资金团队想要自己的付款与资金逻辑却无处安放，任何小改动都会牵动全集团。与此同时平台上线在即，多年沉淀的历史代码仍达不到新的编码合规标准。' },
      t: { en: 'Give every subsidiary data segregation and custom functionality without breaking the group standard — and bring the platform to a launch-ready level of security and maintainability.', zh: '在不打破集团标准的前提下，让每家子公司做到数据隔离、功能可定制；并把平台的安全性与可维护性提升到可上线水平。' },
      a: { en: 'Refactored the monolithic interfaces into microservices: behind one tenant-aware gateway, each subsidiary runs its own service with its own schema and custom endpoints. Cut transmission cost by moving payloads from JSON to Avro and split the hottest ledger tables with database sharding. In parallel, ran security sweeps that closed CVEs and SQL-injection flaws, rewrote inefficient hotspots, and pushed coding-compliance checks into CI.', zh: '把单体接口重构为微服务：在一个带租户识别的网关后面，每家子公司运行自己的服务，用独立的表结构并按需定制接口。报文从 JSON 切换为 Avro 压缩传输开销，最热的账本表做数据库分片。并行推进安全扫雷：修复 CVE 与 SQL 注入缺陷、重写低效热点代码，并把编码合规检查搬进 CI。' },
      r: { en: '10+ group APIs extended with subsidiary-specific versions while the public standard stayed intact; data processing efficiency up 37%. The pre-launch audit closed 300+ issues and memory usage dropped 14%.', zh: '在不改动集团标准的前提下，为 10+ 个 API 扩展了子公司定制版本，数据处理效率提升 37%；上线前审计累计关闭 300+ 问题，内存占用下降 14%。' }
    },
    metrics: [
      { v: '10+', unit: { en: '', zh: '' }, label: { en: 'group APIs extended', zh: '集团 API 定制扩展' } },
      { v: '+37%', unit: { en: '', zh: '' }, label: { en: 'data processing efficiency', zh: '数据处理效率提升' } },
      { v: '300+', unit: { en: '', zh: '' }, label: { en: 'issues closed pre-launch', zh: '上线前关闭问题' } },
      { v: '−14%', unit: { en: '', zh: '' }, label: { en: 'memory usage', zh: '内存占用下降' } }
    ],
    tabs: [{ id: 'custom', label: { en: 'Custom APIs', zh: '定制接口' } }, { id: 'harden', label: { en: 'Hardening', zh: '可靠性加固' } }],
    views: {
      custom: () => `
        <div class="ui-kpis">${kpi(T('APIs extended', '定制 API'), '10+', 'blue')}${kpi(T('Processing efficiency', '处理效率'), '+37%', 'green')}${kpi(T('Wire format', '传输编码'), 'Avro')}</div>
        <div class="ui-panel">
          ${head(T('From one shared pipe to segregated lanes', '从一条共享管道，到各行其道'), T('data segregation', '数据隔离'), 'green')}
          ${lfMeshSVG()}
          <p class="ui-note"><b>${T('Segregation rule · ', '隔离规则 · ')}</b>${T('Every call carries a tenant id: the payment instructions of Subsidiary A never surface in a query from B — isolation happens at the storage layer, not in an application-level filter.', '每次调用都带租户标识：子公司 A 的付款指令不会出现在 B 的查询里——隔离发生在存储层，而不是应用层过滤。')}</p>
        </div>
        <div class="ui-panel">
          ${head(T('Extended group APIs', '集团 API 的定制扩展'), T('10+ live', '10+ 已上线'), 'blue')}
          <table class="ui-table"><thead><tr><th>API</th><th>${T('Carries', '承载内容')}</th><th>${T('Interface change', '接口改动')}</th><th>${T('State', '状态')}</th></tr></thead><tbody>
            <tr><td class="mono">treasury.balance.pull</td><td>${T('Intraday treasury balances', '当日资金余额')}</td><td>JSON → Avro</td><td><span class="pill low">LIVE</span></td></tr>
            <tr><td class="mono">payment.status.push</td><td>${T('Payment status callbacks', '付款状态回调')}</td><td>${T('shared → per tenant', '共享 → 按租户')}</td><td><span class="pill low">LIVE</span></td></tr>
            <tr><td class="mono">fx.rate.query</td><td>${T('FX rates by treasury book', '按资金池查询汇率')}</td><td>${T('+ tenant book scope', '新增资金池维度')}</td><td><span class="pill low">LIVE</span></td></tr>
            <tr><td class="mono">ledger.journal.post</td><td>${T('Journal entries, batched', '记账凭证（批量）')}</td><td>${T('sharded writes', '分片写入')}</td><td><span class="pill low">LIVE</span></td></tr>
            <tr><td class="mono">bank.statement.sync</td><td>${T('End-of-day bank statements', '银行日结单')}</td><td>${T('routed by tenant id', '按租户路由')}</td><td><span class="pill low">LIVE</span></td></tr>
          </tbody></table>
          <p class="ui-note"><b>${T('Contract rule · ', '契约规则 · ')}</b>${T('Custom endpoints only extend the public API — same versioning, same auth, never a fork; the group standard stays the default path.', '定制接口只做扩展、不改公开 API 契约——同一套版本与鉴权体系，绝不 fork；集团标准仍是默认路径。')}</p>
        </div>`,
      harden: () => `
        <div class="ui-kpis">${kpi(T('Issues closed', '关闭问题'), '300+', 'green')}${kpi(T('Memory usage', '内存占用'), '−14%', 'blue')}${kpi(T('Open CVEs', '未闭环 CVE'), '0')}</div>
        <div class="ui-panel">
          ${head(T('Pre-launch audit pipeline', '上线前审计流水线'), T('rescans on every merge', '每次合入自动重扫'), 'blue')}
          ${lfGateSVG()}
        </div>
        <div class="ui-panel">
          ${head(T('What the 300+ were', '300+ 问题的构成'), T('323 closed', '323 项已关闭'), 'amber')}
          <div class="ui-bars">${barRow(T('Coding-compliance violations', '编码规范违规'), '132', 100)}${barRow(T('Performance hotspots', '性能热点'), '86', 65, 'cyan')}${barRow(T('Known CVEs', '已知 CVE'), '64', 48, 'green')}${barRow(T('SQL-injection flaws', 'SQL 注入缺陷'), '41', 31, 'mint')}</div>
        </div>
        <div class="ui-panel">
          ${head(T('Peak heap on the same workload', '同负载下的堆内存峰值'), T('indexed · 12 sprints', '指数化 · 12 个迭代'), 'green')}
          ${lineChart([100, 99, 98, 97, 96, 94, 93, 92, 90, 89, 87, 86], null, { target: 86 })}
          ${legend([[C.blue, T('Peak heap, indexed', '堆峰值（指数化）')], [C.mint, T('Post-refactor level', '重构后水位')]])}
          <p class="ui-note"><b>${T('Guardrail · ', '护栏 · ')}</b>${T('Scan rules run inside CI: a new CVE signature or injection pattern fails the build — compliance is enforced before launch, not discovered after it.', '扫描规则已进 CI：新增 CVE 特征或注入写法会让构建直接失败——合规在上线前守住，而不是上线后补救。')}</p>
        </div>`
    }
  },
  {
    id: 'sentinel', no: '12', domain: 'finance', name: 'Sentinel',
    company: 'na',
    url: 'sentinel.bank / live-scoring',
    tags: { en: ['Fraud ML', 'Risk Decisioning', 'Real-Time Scoring', 'Graph Features', 'Reason Codes', 'Human Review'], zh: ['欺诈检测', '风险决策', '实时评分', '图谱特征', '决策理由码', '人工复核'] },
    title: { en: 'Catch the transfer before the customer finishes the sentence.', zh: '在客户察觉之前，先拦下这笔转账。' },
    oneliner: { en: 'A real-time machine-learning system for bank transfer fraud detection.', zh: '面向银行转账欺诈检测的实时机器学习系统。' },
    star: {
      s: { en: 'A rules engine flagged roughly one in nine transfers. Analysts drowned in reviews while account-takeover fraud still slipped through.', zh: '规则引擎大约每 9 笔就拦 1 笔；复核队列积压，账户接管类欺诈却仍然漏过。' },
      t: { en: 'Decide every transfer in under 100ms with a reason a human can check — and without adding review headcount.', zh: '每笔转账在 100ms 内给出附带可核验理由的判定，且不增加复核人力。' },
      a: { en: 'Built a feature platform (device, behavioural graph, velocity) over a GBDT + graph model, a three-way decision band (pass / review / block), reason codes, and analyst feedback fed back as labels.', zh: '搭建设备、行为图谱与频次特征平台，接入 GBDT + 图模型；设计「放行 / 复核 / 拦截」三级决策与理由码，并把分析师反馈回流成标签。' },
      r: { en: '94.2% fraud recall, 61% fewer false positives, and 68ms p95 decision latency.', zh: '欺诈召回率 94.2%，误报减少 61%，p95 决策延迟 68ms。' }
    },
    metrics: [
      { v: '94.2%', unit: { en: '', zh: '' }, label: { en: 'fraud recall', zh: '欺诈召回率' } },
      { v: '−61%', unit: { en: '', zh: '' }, label: { en: 'false positives', zh: '误报减少' } },
      { v: '68', unit: { en: 'ms p95', zh: 'ms p95' }, label: { en: 'decision latency', zh: '决策延迟' } },
      { v: '3', unit: { en: '', zh: '' }, label: { en: 'decision bands', zh: '决策分档' } }
    ],
    tabs: [{ id: 'stream', label: { en: 'Live Scoring', zh: '实时判定' } }, { id: 'model', label: { en: 'Model & Review', zh: '模型与复核' } }],
    views: {
      stream: () => `
        <div class="ui-kpis">${kpi(T('Recall', '召回率'), '94.2%', 'green')}${kpi(T('False positives', '误报'), '−61%', 'blue')}${kpi('p95', '68ms')}</div>
        <div class="ui-panel">
          ${head(T('Transfer stream · last 60s', '近 60 秒转账流'), T('live', '实时'), 'green')}
          <table class="ui-table"><thead><tr><th>${T('Time', '时间')}</th><th>${T('Amount', '金额')}</th><th>${T('Region', '地区')}</th><th>${T('Score', '风险分')}</th><th>${T('Decision', '判定')}</th><th>${T('Reason code', '理由码')}</th></tr></thead><tbody>
            <tr><td class="mono">14:22:08</td><td class="mono">HK$ 48,200</td><td>HK</td><td class="mono">0.94</td><td><span class="pill high">BLOCK</span></td><td>R-07 ${T('device swap', '设备突变')}</td></tr>
            <tr><td class="mono">14:22:11</td><td class="mono">HK$ 1,240</td><td>HK</td><td class="mono">0.11</td><td><span class="pill low">PASS</span></td><td>—</td></tr>
            <tr><td class="mono">14:22:19</td><td class="mono">HK$ 9,800</td><td>SG</td><td class="mono">0.63</td><td><span class="pill mid">REVIEW</span></td><td>R-12 ${T('velocity', '频次突增')}</td></tr>
            <tr><td class="mono">14:22:34</td><td class="mono">HK$ 320</td><td>HK</td><td class="mono">0.04</td><td><span class="pill low">PASS</span></td><td>—</td></tr>
            <tr><td class="mono">14:22:51</td><td class="mono">HK$ 76,500</td><td>UK</td><td class="mono">0.88</td><td><span class="pill high">BLOCK</span></td><td>R-03 ${T('graph link', '图谱关联')}</td></tr>
          </tbody></table>
        </div>
        <p class="ui-note"><b>${T('Guardrail · ', '护栏 · ')}</b>${T('Every block carries a human-readable reason code; customers can appeal within the same session.', '每次拦截都会附上清晰可读的理由码；用户可在同一会话内申诉。')}</p>`,
      model: () => `
        <div class="ui-panel">
          ${head(T('Recall vs. review load · 8 weeks', '召回率与复核量 · 8 周'), T('champion vs rules', '模型 vs 规则'), 'blue')}
          ${lineChart([54, 61, 68, 74, 80, 85, 90, 94], [38, 39, 41, 40, 42, 43, 44, 45], { target: 90 })}
          ${legend([[C.blue, T('ML recall', '模型召回')], [C.baseline, T('Rules baseline', '规则基线')], [C.mint, T('Target', '目标')]])}
        </div>
        <div class="ui-panel">
          ${head(T('Top contributing features', '主要贡献特征'), T('SHAP, 30d', 'SHAP / 30 天'), 'green')}
          <div class="ui-bars">${barRow(T('Device graph distance', '设备图谱距离'), '0.31', 88)}${barRow(T('Transfer velocity 5m', '5 分钟转账频次'), '0.24', 69, 'cyan')}${barRow(T('Session keystroke', '会话击键节奏'), '0.18', 52, 'green')}${barRow(T('Beneficiary age', '收款账户账龄'), '0.12', 34)}${barRow(T('Geo deviation', '地理位置偏移'), '0.09', 26, 'cyan')}</div>
          <p class="ui-note"><b>${T('Eval · ', '评测 · ')}</b>${T('Offline set built from 14 months of confirmed cases; drift alert fires when feature distribution shifts >2σ.', '离线评测集取自 14 个月已确认案例；特征分布偏移超过 2σ 触发漂移告警。')}</p>
        </div>`
    }
  }
);
