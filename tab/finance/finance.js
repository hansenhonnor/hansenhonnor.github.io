/* ==========================================================================
   tab/finance/finance.js — 2 case studies (Finance tab).

   Add a project here, not in core/. Each object needs: id, no, domain,
   name, company, url, tabs, views, tags, title, oneliner, star, metrics.
   Set `interactive: 'cluster' | 'flow'` to use a registered demo instead
   of the standard dashboard; add `photos: [...]` to get a carousel.
   Views are functions, so core helpers (T, esc, kpi, head, ...) resolve
   at render time. Order here = order in the tab and the floating TOC.
   ========================================================================== */

PRODUCTS.push(
  {
    id: 'sentinel', no: '09', domain: 'finance', name: 'Sentinel',
    company: 'na',
    url: 'sentinel.bank / live-scoring',
    photos: PHOTO_SET,
    tags: { en: ['Fraud ML', 'Real-time scoring', 'Graph features', 'Reason codes', 'Human review'], zh: ['欺诈检测', '实时评分', '图谱特征', '决策理由码', '人工复核'] },
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
  },
  {
    id: 'creditpulse', no: '10', domain: 'finance', name: 'CreditPulse',
    company: 'abc',
    url: 'creditpulse.bank / application-8841',
    tags: { en: ['Default PD', 'Survival model', 'Explainability', 'Repayment behaviour', 'Early warning'], zh: ['违约概率', '生存模型', '可解释性', '还款行为', '早期预警'] },
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
        <div class="ui-kpis">${kpi('AUC', '0.86')}${kpi(T('NPL', '不良率'), '−23%', 'green')}${kpi(T('Early warning', '提前预警'), '45d', 'blue')}</div>
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
            <tr><td>D</td><td class="mono">4%</td><td class="mono">21.3%</td><td><span class="pill high">${T('Human review', '人工复核')}</span></td></tr>
          </tbody></table>
        </div>`
    }
  }
);
