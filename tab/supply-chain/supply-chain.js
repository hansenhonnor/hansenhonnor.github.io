/* ==========================================================================
   tab/supply-chain/supply-chain.js — 6 case studies (Supply Chain tab).

   Add a project here, not in core/. Each object needs: id, no, domain,
   name, company, url, tabs, views, tags, title, oneliner, star, metrics.
   Set `interactive: 'cluster' | 'flow'` to use a registered demo instead
   of the standard dashboard; add `photos: [...]` to get a carousel.
   Views are functions, so core helpers (T, esc, kpi, head, ...) resolve
   at render time. Order here = order in the tab and the floating TOC.
   ========================================================================== */

PRODUCTS.push(
  {
    id: 'factoryflow', no: '01', domain: 'supply', name: 'Factory Flow',
    company: 'stealth',
    url: 'factoryflow.app / ops loop',
    interactive: 'flow',
    tabs: [], views: {},
    tags: {
      en: ['FATP operations', 'CM data integration', 'Data lake', 'ML / OR pipeline', 'Anomaly detection', 'Capacity planning', 'Cross-functional escalation', 'Closed-loop feedback'],
      zh: ['FATP 整机组装', '乙方数据接入', '数据湖', 'ML / 运筹管道', '异常检测', '产能规划', '跨职能升级', '闭环反馈']
    },
    title: { en: 'One closed loop, from factory noise to a decision.', zh: '把工厂里的杂乱数据，收成一条能闭环的决策链路。' },
    oneliner: { en: 'A closed-loop operations data pipeline for managing contract manufacturers at FATP sites.', zh: '面向 FATP 整机组装厂的乙方运营数据闭环链路。' },
    star: {
      s: { en: 'A brand owner assembles phones and laptops at CM (contract manufacturer) FATP (Final Assembly, Test & Pack) plants. On-site OPMs (Operations Program Managers) run daily I/O operations, quality control, new-line ramp-ups and delivery targets, and also own short- and long-term capacity plans, escalation, resource planning, work-hour management and safety. The data behind all of it sat in a dozen CM systems plus several internal team trackers; the manual patchwork did get the day-to-day work done, but nobody could see the whole picture.', zh: '甲方在 CM（合同制造商）的 FATP（整机组装、测试与包装）工厂生产手机与笔记本。驻厂 OPM（运营项目经理）既要负责日常投料产出、质量管控、新厂区爬坡和交付达成，也要制定短长期产能计划、作为升级联系人协调资源规划、行政、工时与安全。支撑这些工作的数据散落在乙方十几个系统和甲方多个团队台账里；手工拼表虽然能应付日常，却没人看得见全貌。' },
      t: { en: 'Replace the ad-hoc spreadsheet-and-email routine with a governed pipeline — not because it was broken, but because it did not scale: make external CM data and internal cross-team data comparable, and raise operating efficiency at the CM.', zh: '把靠表格和邮件维持的做法换成有治理的数据链路——不是因为它跑不动，而是因为它长不大：让乙方数据与甲方内部跨团队数据可比、可管，并借此提升甲方在乙方的运营效率。' },
      a: { en: 'Aligned CM MES / ERP / test feeds and internal team data into one standardized lake with shared definitions, common part and order codes, and a traceable record of where every field came from. A scenario-based tool layer routes heavy work to Python/SQL pipelines (machine learning and operations research) and quick questions to Excel/Tableau (statistics). Senior OPM domain knowledge gates every stage — definitions, anomaly thresholds, root-cause logic and recovery options. Insights turn into a cross-functional recovery plan and schedule optimization, and the resulting CM system write-backs flow straight back into ingestion.', zh: '把乙方 MES / ERP / 测试数据和甲方内部团队数据按统一口径、统一编码（料号、工单号）汇成标准化数据湖，每个字段从哪来都能查到；按场景分流——重活走 Python/SQL 管道（机器学习与运筹优化），临时问题走 Excel/Tableau（统计）。资深 OPM 的经验贯穿每个阶段：指标定义、异常阈值、根因逻辑与恢复选项。洞察经跨职能沟通落成恢复计划与排程优化，执行产生的乙方系统回写再回流到接入层。' },
      r: { en: 'The loop closes: daily reporting went from hours of joining files to a same-day view, anomalies surface while a line can still recover, and OPMs spend their time on capacity, escalation and delivery instead of reconciling spreadsheets.', zh: '闭环跑通：日报从几小时拼表变成当日可见，异常在产线还来得及调整时被发现，OPM 的精力从对表转回产能、升级协调与交付本身。' }
    },
    metrics: [
      { v: '4', unit: { en: ' stages', zh: ' 个阶段' }, label: { en: 'closed-loop data pipeline', zh: '闭环数据链路' } },
      { v: '12', unit: { en: '+', zh: '+' }, label: { en: 'CM & internal sources aligned', zh: '乙方与内部数据源对齐' } },
      { v: '1', unit: { en: ' lake', zh: ' 个' }, label: { en: 'standardized data lake', zh: '标准化数据湖' } }
    ]
  },
  {
    id: 'simipart', no: '02', domain: 'supply', name: 'Simi-Part',
    company: 'apple',
    url: 'simipart.app / similarity graph',
    interactive: 'cluster',
    tabs: [], views: {},
    tags: {
      en: ['Self-supervised ML', 'Part embeddings', 'ANN clustering', 'BOM cost variance', 'Supplier negotiation', 'Consumer electronics'],
      zh: ['自监督学习', '料件向量', '近邻聚类', 'BOM 成本差异', '供应商谈判', '消费电子']
    },
    title: { en: 'The same part. Three price tags. One negotiation.', zh: '同一个料件，三个报价，一次谈判。' },
    oneliner: { en: 'A similarity engine for small mechanical parts across phones, laptops and tablets.', zh: '面向手机、笔记本与平板小部件跨品类比对的相似度引擎。' },
    star: {
      s: { en: 'A phone, a laptop and a tablet each carry thousands of small parts — metal stampings, CNC brackets, die-cut gaskets, MIM buttons (volume / power side keys), fasteners, rubber and plastic. The same M1.6 screw appeared under four part numbers, quoted by three suppliers, and nobody could see it across programs.', zh: '手机、笔记本、平板里各有数千颗小部件：金属冲压件、数控加工支架、模切垫片、金属注射成形按键（音量键 / 电源键）、紧固件、橡胶与塑料件。同一颗 M1.6 螺丝挂在四个料号下、由三家供应商分别报价，跨项目根本没人看得出来。' },
      t: { en: 'Find parts that are functionally the same across product lines, quantify how much their prices differ, and turn that into a negotiation list.', zh: '找出跨产品线实质相同的料件，量化价格差，把结果变成一张可执行的谈判清单。' },
      a: { en: 'Encoded geometry, process, material, tolerance and finish into part embeddings with self-supervised contrastive learning, then used approximate nearest-neighbour search and density clustering to group look-alikes. Matched each cluster to ERP prices and suppliers; engineers confirmed substitutability before anything reached sourcing.', zh: '用自监督对比学习把几何、工艺、材质、公差与表面处理编码成料件向量，再用近邻检索和密度聚类把相似件聚成组；逐簇对齐 ERP 价格与供应商，由工程确认可替代性后才交给采购。' },
      r: { en: 'Mapped 2,260 small parts across three device lines, surfaced 1,860 similar pairs and 214 with a price gap above 18%; the first negotiation round cut 6.2% of the addressable spend.', zh: '覆盖三条产品线 2,260 颗小部件，找出 1,860 组相似料件，其中 214 组价差超过 18%；首轮谈判让可议价采购额下降 6.2%。' }
    },
    metrics: [
      { v: '2,260', unit: { en: '', zh: '' }, label: { en: 'parts in similarity corpus', zh: '相似料件语料规模' } },
      { v: '1,860', unit: { en: '', zh: '' }, label: { en: 'similar pairs found', zh: '相似料件组' } },
      { v: '214', unit: { en: '', zh: '' }, label: { en: 'pairs with >18% price gap', zh: '价差超 18% 的组' } },
      { v: '6.2%', unit: { en: '', zh: '' }, label: { en: 'addressable spend saved', zh: '可议价采购额下降' } }
    ]
  },
  {
    id: 'supplylens', no: '03', domain: 'supply', name: 'SupplyLens',
    company: 'stealth',
    url: 'supplylens.app / overview',
    photos: PHOTO_SET,
    tags: { en: ['BOM risk', 'Tier-2 visibility', 'Consumer electronics', 'Supplier graph', 'Early warning', 'ERP integration'], zh: ['BOM 风险', '二三级可视', '消费电子', '供应商图谱', '缺料预警', 'ERP 集成'] },
    title: { en: 'Know a shortage six weeks before the line stops.', zh: '在停线前六周，就知道哪一颗料会缺。' },
    oneliner: { en: 'A risk-intelligence platform for BOM-level supply visibility.', zh: '面向 BOM 级供应可视化的风险预警平台。' },
    star: {
      s: { en: 'A flagship device pulls 1,800+ parts from 240 suppliers across four tiers; risk lived in spreadsheets and weekly calls.', zh: '一台旗舰机型涉及 1,800+ 颗物料、240 家供应商、四级供应层级；风险信息散落在表格和周会纪要里，没人能看全。' },
      t: { en: 'Surface a tier-2 disruption early enough to protect the SMT line, and show exactly which BOM lines are exposed.', zh: '在二、三级供应商的波动传导到 SMT 产线之前识别风险，并说清究竟哪些 BOM 行会受影响。' },
      a: { en: 'Built a BOM-level risk graph over ERP, supplier portals and logistics feeds. Every alert carries affected SKUs, an exposure window and a recommended action.', zh: '把 ERP、供应商门户与物流数据汇成 BOM 级风险图谱；每条预警都附带受影响的 SKU、风险窗口与处置建议。' },
      r: { en: 'Warnings arrive six weeks earlier; line-stop events fell 42% across 1,842 monitored BOM lines.', zh: '预警提前 6 周；1,842 条 BOM 行纳入监控后，停线事件下降 42%。' }
    },
    metrics: [
      { v: '6', unit: { en: 'wks', zh: '周' }, label: { en: 'earlier shortage warning', zh: '缺料预警提前量' } },
      { v: '42%', unit: { en: '', zh: '' }, label: { en: 'fewer line-stop events', zh: '停线事件减少' } },
      { v: '1,842', unit: { en: '', zh: '' }, label: { en: 'BOM lines monitored', zh: 'BOM 行纳入监控' } },
      { v: '240', unit: { en: '', zh: '' }, label: { en: 'suppliers in risk graph', zh: '供应商纳入风险图谱' } }
    ],
    tabs: [{ id: 'radar', label: { en: 'Risk Radar', zh: '风险雷达' } }, { id: 'bom', label: { en: 'BOM Coverage', zh: '齐套视图' } }],
    views: {
      radar: () => `
        <div class="ui-kpis">${kpi(T('Open alerts', '未关闭预警'), '14', 'blue', T('−6 wk', '周 −6'))}${kpi(T('BOM lines', 'BOM 行数'), '1,842')}${kpi(T('Supplier coverage', '供应商覆盖'), '96.4%', 'green')}</div>
        <div class="ui-panel">
          ${head(T('Exposure by component', '按物料查看风险敞口'), T('AI ranked', 'AI 排序'), 'blue')}
          <table class="ui-table"><thead><tr><th>${T('Component', '物料')}</th><th>${T('Supplier', '供应商')}</th><th>Tier</th><th>${T('Risk', '风险')}</th><th>ETA</th><th>SKU</th></tr></thead><tbody>
            <tr><td class="mono">PMIC-A21</td><td>Vancore Semi</td><td>T2</td><td><span class="pill high">HIGH</span></td><td>+18d</td><td>6</td></tr>
            <tr><td class="mono">LPDDR5X-8G</td><td>Mirae Memory</td><td>T1</td><td><span class="pill mid">MID</span></td><td>+9d</td><td>3</td></tr>
            <tr><td class="mono">OLED Driver</td><td>Sora Display</td><td>T3</td><td><span class="pill high">HIGH</span></td><td>+24d</td><td>4</td></tr>
            <tr><td class="mono">USB-C 3.2</td><td>Jincheng Conn.</td><td>T2</td><td><span class="pill low">LOW</span></td><td>+2d</td><td>2</td></tr>
            <tr><td class="mono">BT Antenna</td><td>Hexa RF</td><td>T2</td><td><span class="pill mid">MID</span></td><td>+7d</td><td>1</td></tr>
          </tbody></table>
        </div>
        <p class="ui-note"><b>${T('AI summary · ', 'AI 摘要 · ')}</b>${T('2 high-risk parts share one tier-3 substrate vendor. Alternate part AV-7 covers 4 of 6 exposed SKUs for 11 days.', '两颗高风险物料共用同一家三级基板供应商；替代料 AV-7 可覆盖 6 个受影响 SKU 中的 4 个，缓冲 11 天。')}</p>`,
      bom: () => `
        <div class="ui-panel">
          ${head(T('BOM coverage by program', '各项目齐套率'), T('Week 46', '第 46 周'), 'green')}
          <div class="ui-bars">${barRow(T('Flagship phone', '旗舰手机'), '98%', 98)}${barRow(T('Tablet', '平板'), '94%', 94, 'cyan')}${barRow(T('Wearables', '穿戴'), '87%', 87, 'green')}${barRow(T('Accessories', '配件'), '99%', 99)}</div>
        </div>
        <div class="ui-panel">
          ${head(T('Projected coverage · next 8 weeks', '未来 8 周齐套率预测'), T('with action', '含干预'), 'blue')}
          ${lineChart([88, 86, 84, 82, 79, 83, 90, 95], [88, 84, 79, 74, 68, 66, 64, 63], { target: 92 })}
          ${legend([[C.blue, T('With mitigation', '采取干预')], [C.baseline, T('Baseline', '基线')], [C.mint, T('Target 92%', '目标 92%')]])}
        </div>`
    }
  },
  {
    id: 'yieldpilot', no: '04', domain: 'supply', name: 'YieldPilot',
    company: 'na',
    url: 'yieldpilot.app / line-04',
    tags: { en: ['SMT yield', 'Root cause', 'MES data', 'AOI / SPI / ICT', 'Defect pareto'], zh: ['SMT 良率', '根因归因', 'MES 数据', 'AOI / SPI / ICT', '缺陷帕累托'] },
    title: { en: 'Every defect should explain itself.', zh: '每一个缺陷，都该能说清来由。' },
    oneliner: { en: 'A yield-analytics product for SMT manufacturing lines.', zh: '面向 SMT 产线的良率分析产品。' },
    star: {
      s: { en: 'Twelve SMT lines, 3.2M units a quarter, and AOI / SPI / ICT data in three separate MES modules. Engineers spent ~5h a day joining CSVs.', zh: '12 条 SMT 产线、每季度 320 万台产量，AOI / SPI / ICT 数据分散在三个 MES 模块；工程师每天约 5 小时在拼 CSV。' },
      t: { en: 'Cut yield-dip detection from eight hours to minutes, and explain why something failed — not just what failed.', zh: '把良率下滑的发现时间从 8 小时压到分钟级，并且回答「为什么」，而不只是「哪里坏了」。' },
      a: { en: 'A unified defect taxonomy plus a causal model mapping defect → station → parameter window. Top three causes ship with suggested deltas and a one-click A/B run ticket into MES.', zh: '统一缺陷分类 + 因果模型，把「缺陷 → 工位 → 参数窗口」串起来；前三大原因附上建议调整量，并可一键下发 A/B 试跑工单到 MES。' },
      r: { en: '+2.8pt first-pass yield, root cause in 18 minutes instead of 5 hours, and 31% less scrap.', zh: '一次通过率 +2.8pt，归因从 5 小时缩到 18 分钟，报废减少 31%。' }
    },
    metrics: [
      { v: '+2.8', unit: { en: 'pt FPY', zh: 'pt' }, label: { en: 'first-pass yield gain', zh: '一次通过率提升' } },
      { v: '18', unit: { en: 'min', zh: '分钟' }, label: { en: 'root-cause time (from 5h)', zh: '归因耗时（原 5 小时）' } },
      { v: '31%', unit: { en: '', zh: '' }, label: { en: 'less scrap', zh: '报废减少' } }
    ],
    tabs: [{ id: 'trend', label: { en: 'Yield Trend', zh: '良率趋势' } }, { id: 'cause', label: { en: 'Root Cause', zh: '根因分析' } }],
    views: {
      trend: () => `
        <div class="ui-kpis">${kpi('FPY', '96.8%', 'green', '+2.8pt')}${kpi('DPPM', '412', 'blue', '−31%')}${kpi(T('Lines live', '在线产线'), '12')}</div>
        <div class="ui-panel">
          ${head(T('FPY · last 14 shifts', '近 14 个班次 FPY'), T('Line 04', '04 线'), 'blue')}
          ${lineChart([52, 58, 55, 63, 61, 68, 72, 70, 76, 74, 81, 86, 84, 92], null, { target: 88 })}
          ${legend([[C.blue, 'FPY'], [C.mint, T('Target 98%', '目标 98%')]])}
        </div>
        <div class="ui-panel">
          ${head(T('Station breakdown', '分工位表现'), T('24h', '24 小时'), 'green')}
          <table class="ui-table"><thead><tr><th>${T('Station', '工位')}</th><th>FPY</th><th>Δ</th><th>${T('Status', '状态')}</th></tr></thead><tbody>
            <tr><td>SPI-02</td><td class="mono">99.1%</td><td>+0.3</td><td><span class="pill low">OK</span></td></tr>
            <tr><td>Reflow-04</td><td class="mono">95.2%</td><td>−1.8</td><td><span class="pill high">WATCH</span></td></tr>
            <tr><td>AOI-04</td><td class="mono">96.8%</td><td>−0.6</td><td><span class="pill mid">WATCH</span></td></tr>
          </tbody></table>
        </div>`,
      cause: () => `
        <div class="ui-panel">
          ${head(T('Defect pareto · last 24h', '近 24 小时缺陷帕累托'), T('1,284 events', '1,284 条'), 'amber')}
          <div class="ui-bars">${barRow(T('Solder bridge', '连锡'), '38%', 38)}${barRow(T('Insufficient solder', '少锡'), '24%', 24, 'cyan')}${barRow(T('Component offset', '偏位'), '17%', 17, 'green')}${barRow(T('Tombstone', '立碑'), '12%', 12)}${barRow(T('Other', '其他'), '9%', 9, 'cyan')}</div>
        </div>
        <div class="ui-panel">
          ${head(T('Likely causes', '可能原因（Top 3）'), T('causal model v3', '因果模型 v3'), 'blue')}
          <div class="ui-cards">
            <div class="ui-card"><span class="rank">#01</span><strong>${T('Stencil wipe interval', '钢网擦拭间隔')}</strong><p>${T('8 → 5 panels per wipe', '由 8 片/次 调整为 5 片/次')}</p><span class="conf">${T('91% confidence', '置信度 91%')}</span></div>
            <div class="ui-card"><span class="rank">#02</span><strong>${T('Reflow Zone 3 peak', '回流焊 3 区峰值')}</strong><p>${T('235°C → 231°C on Line 04', '04 线由 235°C 降至 231°C')}</p><span class="conf">${T('84% confidence', '置信度 84%')}</span></div>
            <div class="ui-card"><span class="rank">#03</span><strong>${T('Paste lot B-227', '锡膏批次 B-227')}</strong><p>${T('Hold lot & retest viscosity', '冻结批次并复测黏度')}</p><span class="conf">${T('76% confidence', '置信度 76%')}</span></div>
          </div>
          <p class="ui-note"><b>${T('Next step · ', '下一步 · ')}</b>${T('One-click A/B run ticket → MES · engineer approval required before any parameter change.', '一键创建 A/B 试跑工单 → MES · 参数变更前需工程师确认。')}</p>
        </div>`
    }
  },
  {
    id: 'scheduleai', no: '05', domain: 'supply', name: 'Schedule AI',
    company: 'stealth',
    url: 'schedule.ai / plant-cluster',
    tags: { en: ['Multi-plant', 'Re-planning', 'Constraint solver', 'ECN changeover', 'Order priority', 'Capacity planning'], zh: ['多工厂', '动态重排', '约束求解', 'ECN 换线', '订单优先级', '产能规划'] },
    title: { en: 'A schedule that rewrites itself when reality changes.', zh: '现实一变，排程自己重写。' },
    oneliner: { en: 'A scheduling framework for multi-plant consumer-electronics production.', zh: '面向消费电子多工厂的智能排程框架。' },
    star: {
      s: { en: 'Three plants, 600+ open orders, a changeover matrix, tooling constraints and three customer priority tiers — held together by one planner and a spreadsheet.', zh: '三地工厂、600+ 在制订单、换线矩阵、工装约束、三级客户优先级 —— 全靠一位计划员和一张表格维系。' },
      t: { en: 'Rebuild a two-week plan in minutes after any ECN or late material, with the trade-offs visible before anyone commits.', zh: '任何 ECN 或来料延误之后，几分钟内重排两周计划，且提交前就能看清不同方案的取舍。' },
      a: { en: 'A constraint-based agent proposes three valid re-plans scored on on-time delivery, changeover cost and line load. The planner keeps the final call, with a full audit trail.', zh: '基于约束求解的智能体给出 3 个可行重排方案，按准时交付、换线成本、线体负载打分；最终决定权留给计划员，并留完整审计轨迹。' },
      r: { en: '90 seconds to a valid re-plan, 96.4% on-time delivery, and 27% less changeover time.', zh: '90 秒产出可行重排方案，准时交付率 96.4%，换线工时减少 27%。' }
    },
    metrics: [
      { v: '90', unit: { en: 'sec', zh: '秒' }, label: { en: 'to a valid re-plan', zh: '产出可行重排方案' } },
      { v: '96.4%', unit: { en: '', zh: '' }, label: { en: 'on-time delivery', zh: '订单准时交付率' } },
      { v: '27%', unit: { en: '', zh: '' }, label: { en: 'less changeover time', zh: '换线工时减少' } },
      { v: '600+', unit: { en: '', zh: '' }, label: { en: 'open orders in plan', zh: '在管开放订单' } }
    ],
    tabs: [{ id: 'schedule', label: { en: 'Live Schedule', zh: '实时排程' } }, { id: 'whatif', label: { en: 'What-if', zh: '情景推演' } }],
    views: {
      schedule: () => `
        <div class="ui-kpis">${kpi(T('On-time', '准时率'), '96.4%', 'green')}${kpi(T('Open orders', '在制订单'), '612')}${kpi(T('Last re-plan', '上次重排'), '90s', 'blue')}</div>
        <div class="ui-panel">
          ${head(T('Week 46 · plant cluster', '第 46 周 · 工厂集群'), T('2 conflicts fixed', '2 处冲突已消解'), 'green')}
          <div class="ui-gantt">
            <div class="g-row"><div class="g-name">${T('Line A1 · phone', 'A1 线 · 手机')}</div><div class="g-track"><div class="g-block" style="left:2%;width:34%"></div><div class="g-block g3" style="left:40%;width:26%"></div><div class="g-block g2" style="left:70%;width:22%"></div></div></div>
            <div class="g-row"><div class="g-name">${T('Line A2 · phone', 'A2 线 · 手机')}</div><div class="g-track"><div class="g-block g2" style="left:0;width:28%"></div><div class="g-block" style="left:32%;width:38%"></div><div class="g-block g4" style="left:74%;width:20%"></div></div></div>
            <div class="g-row"><div class="g-name">${T('Line B1 · tablet', 'B1 线 · 平板')}</div><div class="g-track"><div class="g-block g3" style="left:6%;width:30%"></div><div class="g-block g4" style="left:40%;width:24%"></div><div class="g-block" style="left:68%;width:28%"></div></div></div>
            <div class="g-row"><div class="g-name">${T('Line C1 · NPI', 'C1 线 · NPI')}</div><div class="g-track"><div class="g-block g4" style="left:12%;width:44%"></div><div class="g-block g3" style="left:60%;width:32%"></div></div></div>
            <div class="g-row"><div class="g-name">${T('Line D2 · wearable', 'D2 线 · 穿戴')}</div><div class="g-track"><div class="g-block" style="left:0;width:22%"></div><div class="g-block g2" style="left:26%;width:36%"></div><div class="g-block g3" style="left:66%;width:30%"></div></div></div>
          </div>
          <div class="g-axis"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div>
        </div>
        <p class="ui-note"><b>${T('Pending · ', '待确认 · ')}</b>${T('One priority-tier trade-off needs planner approval before commit. Every change is reversible.', '1 处客户优先级取舍需计划员确认后提交；所有变更均可回滚。')}</p>`,
      whatif: () => `
        <div class="ui-panel">
          ${head(T('Scenario: OLED driver +24h late', '情景：OLED 驱动料延误 24 小时'), T('simulating…', '推演中…'), 'amber')}
          <div class="ui-cards">
            <div class="ui-card"><span class="rank">PLAN A</span><strong>${T('Keep priority order', '保持优先级不变')}</strong><p>${T('On-time 91.2% · changeover 14h · load 78%', '准时 91.2% · 换线 14h · 负载 78%')}</p><span class="conf">${T('Lowest disruption', '扰动最小')}</span></div>
            <div class="ui-card"><span class="rank">PLAN B</span><strong>${T('Swap tablet program', '对调平板项目')}</strong><p>${T('On-time 96.4% · changeover 11h · load 86%', '准时 96.4% · 换线 11h · 负载 86%')}</p><span class="conf">${T('Recommended', '推荐')}</span></div>
            <div class="ui-card"><span class="rank">PLAN C</span><strong>${T('Split the lot', '拆单分批')}</strong><p>${T('On-time 94.8% · changeover 19h · load 92%', '准时 94.8% · 换线 19h · 负载 92%')}</p><span class="conf">${T('Highest cost', '成本最高')}</span></div>
          </div>
        </div>
        <div class="ui-panel">
          ${head(T('Trade-off comparison', '方案取舍对比'), T('3 valid plans', '3 个可行方案'), 'blue')}
          <div class="ui-bars">${barRow(T('A · on-time delivery', 'A · 准时交付'), '91.2%', 91, 'cyan')}${barRow(T('B · on-time delivery', 'B · 准时交付'), '96.4%', 96)}${barRow(T('C · on-time delivery', 'C · 准时交付'), '94.8%', 95, 'green')}</div>
          <div class="ui-steps" style="margin-top:11px">
            <div class="ui-step done"><strong>${T('Detect', '感知')}</strong><span>ECN / ETA</span></div><span class="ui-step-arrow">→</span>
            <div class="ui-step done"><strong>${T('Simulate', '推演')}</strong><span>90s</span></div><span class="ui-step-arrow">→</span>
            <div class="ui-step now"><strong>${T('Compare', '对比')}</strong><span>3 plans</span></div><span class="ui-step-arrow">→</span>
            <div class="ui-step"><strong>${T('Approve', '确认')}</strong><span>Human</span></div>
          </div>
        </div>`
    }
  },
  {
    id: 'qualitytrace', no: '06', domain: 'supply', name: 'QualityTrace',
    company: 'stealth',
    url: 'qualitytrace.app / serial-lookup',
    tags: { en: ['Serial genealogy', 'CAPA', 'Traceability', 'Reflow curve'], zh: ['序列号谱系', 'CAPA', '全链路追溯', '回流焊曲线'] },
    title: { en: 'From one serial number, back to the exact reflow curve.', zh: '从一个序列号，追到当时那条回流焊曲线。' },
    oneliner: { en: 'A traceability platform for serial-level quality and corrective actions.', zh: '面向序列号级质量追溯与问题闭环的平台。' },
    star: {
      s: { en: 'Returns were traced across six handoff systems. A batch recall took three days of manual lookup and often ended with "supplier issue".', zh: '退货追溯要跨越 6 套交接系统；一次批次召回需要 3 天人工翻查，且常常止于一句「供应商问题」。' },
      t: { en: 'Give any serial number a single thread back to the exact process event — then close the loop with a corrective action.', zh: '让任意序列号都能一路追到具体工艺事件，并用纠正措施完成闭环。' },
      a: { en: 'A genealogy graph over every handoff (serial → PCB lot → paste batch → oven profile → shift → shipment), AI common-denominator summaries, and auto-routed CAPA tasks with on-line verification.', zh: '把每一次交接都记入谱系图谱，AI 给出共性因子摘要，自动生成 CAPA 任务派发到人，并回到产线验证。' },
      r: { en: 'Full trace in 4 minutes instead of 3 days, 98.6% genealogy coverage, and 23 CAPA cycles closed.', zh: '全链路追溯从 3 天缩到 4 分钟，谱系覆盖率 98.6%，完成 23 个 CAPA 闭环。' }
    },
    metrics: [
      { v: '4', unit: { en: 'min', zh: '分钟' }, label: { en: 'full trace (from 3 days)', zh: '全链路追溯（原 3 天）' } },
      { v: '98.6%', unit: { en: '', zh: '' }, label: { en: 'genealogy coverage', zh: '谱系覆盖率' } }
    ],
    tabs: [{ id: 'trace', label: { en: 'Trace Chain', zh: '追溯链路' } }, { id: 'loop', label: { en: 'Closed Loop', zh: '纠正闭环' } }],
    views: {
      trace: () => `
        <div class="ui-panel">
          ${head(T('Serial F7X2••••91', '序列号 F7X2••••91'), T('98.6% coverage', '覆盖率 98.6%'), 'green')}
          <div class="ui-timeline">
            <div class="tl-item ok"><div class="tl-head"><strong>${T('Shipment → retail return', '出货 → 零售退货')}</strong><span>W46 · D+38</span></div><p>${T('RMA-20841 · intermittent power loss · Region EU-2', 'RMA-20841 · 间歇性掉电 · EU-2 区域')}</p></div>
            <div class="tl-item ok"><div class="tl-head"><strong>${T('Final assembly · Line A1', '总装 · A1 线')}</strong><span>W41 · Shift B</span></div><p>${T('Torque log, operator ID and ESD record linked', '扭矩日志、操作员 ID 与静电记录已关联')}</p></div>
            <div class="tl-item ok"><div class="tl-head"><strong>${T('Reflow profile · Oven 04', '回流焊曲线 · 4 号炉')}</strong><span>W41 · 14:22</span></div><p>${T('Zone 3 peak 235.4°C · +1.4°C above window', '3 区峰值 235.4°C · 超窗口 +1.4°C')}</p></div>
            <div class="tl-item ok"><div class="tl-head"><strong>${T('Solder paste lot B-227', '锡膏批次 B-227')}</strong><span>W40</span></div><p>${T('Viscosity retest flagged · shared by 3 of 4 RMA units', '黏度复测异常 · 4 台退货中 3 台共用此批次')}</p></div>
            <div class="tl-item ok"><div class="tl-head"><strong>${T('PCB lot P-8813', 'PCB 批次 P-8813')}</strong><span>W39</span></div><p>${T('Tier-2 substrate · Vancore Semi', '二级基板 · Vancore Semi')}</p></div>
          </div>
        </div>
        <p class="ui-note"><b>${T('AI finding · ', 'AI 结论 · ')}</b>${T('Common denominator: paste lot B-227 combined with a +1.4°C oven excursion. 3 of 4 RMA units share both events.', '共性因子：锡膏批次 B-227 叠加炉温 +1.4°C 偏移；4 台退货中 3 台同时命中这两个事件。')}</p>`,
      loop: () => `
        <div class="ui-kpis">${kpi(T('Trace time', '追溯耗时'), '4 min', 'green', T('−3d', '−3 天'))}${kpi(T('CAPA closed', 'CAPA 已闭环'), '23')}${kpi(T('Open actions', '进行中'), '2', 'blue')}</div>
        <div class="ui-panel">
          ${head(T('Corrective actions', '纠正措施'), T('auto-routed', '自动派发'), 'blue')}
          <table class="ui-table"><thead><tr><th>ID</th><th>${T('Owner', '负责人')}</th><th>${T('Action', '动作')}</th><th>${T('Status', '状态')}</th></tr></thead><tbody>
            <tr><td class="mono">CAPA-118</td><td>Process Eng.</td><td>${T('Oven 04 recalibration', '4 号炉校验')}</td><td><span class="pill low">DONE</span></td></tr>
            <tr><td class="mono">CAPA-119</td><td>SQE</td><td>${T('Hold paste lot B-227', '冻结锡膏批次 B-227')}</td><td><span class="pill low">DONE</span></td></tr>
            <tr><td class="mono">CAPA-120</td><td>Mfg. Eng.</td><td>${T('Add SPC alarm on Zone 3', '3 区增加 SPC 告警')}</td><td><span class="pill info">IN PROGRESS</span></td></tr>
            <tr><td class="mono">CAPA-121</td><td>Quality</td><td>${T('Verify next 3 lots', '后续 3 批验证')}</td><td><span class="pill mid">PENDING</span></td></tr>
          </tbody></table>
        </div>
        <div class="ui-panel"><div class="ui-steps">
          <div class="ui-step done"><strong>${T('Detect', '发现')}</strong><span>RMA</span></div><span class="ui-step-arrow">→</span>
          <div class="ui-step done"><strong>${T('Trace', '追溯')}</strong><span>4 min</span></div><span class="ui-step-arrow">→</span>
          <div class="ui-step done"><strong>${T('Attribute', '归因')}</strong><span>91%</span></div><span class="ui-step-arrow">→</span>
          <div class="ui-step now"><strong>CAPA</strong><span>4 tasks</span></div><span class="ui-step-arrow">→</span>
          <div class="ui-step"><strong>${T('Verify', '验证')}</strong><span>On line</span></div>
        </div></div>`
    }
  }
);
