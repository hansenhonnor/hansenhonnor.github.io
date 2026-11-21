/* Factory Flow — L1 closed loop + L2 per-stage deep dive.
   Owns its state, SVG, controls and clocks; core/app.js never references it. */
/* ── 5c. Interactive operations loop (Factory Flow) ───────────
   A closed ring of 4 stages around an OPM "control tower". Dashed arcs
   are marching ants (CSS) and carry moving data packets (SVG animateMotion);
   short spokes show OPM orchestration. Unlike Simi-Part there are no modes —
   the point IS the continuous feedback loop. Clicking a stage chip freezes
   the auto-highlight and dims the others; the flow itself never stops.

   Logic fixes vs. the supplied mermaid (see README):
     1. I3 -.-> S1 (edge to a subgraph) is ambiguous; the feedback now points
        to a concrete ingestion node / the standardized lake.
     2. "CM System Update" is a real-time by-product of Production Execution,
        not a step AFTER on-time delivery; delivery is the measured outcome.
     3. Excel/Tableau + stats produce descriptive variance baselines, not
        predictive patterns; only the Python/SQL (ML/OR) branch predicts.
     4. Senior-OPM domain knowledge gates EVERY stage, not one D -> F edge.
     5. OPM duties (capacity plan, escalation, resource/work-hour/safety) live
        in the hub + STAR rather than as extra flow nodes.                   */
const FLOW_STAGES = [
  {
    color: '#2b54b8', tint: '#eef3fb', icons: ['db', 'docs', 'lake'],
    en: { chip: 'Ingest', title: 'Ingest & Align',
      lines: [['CM', 'feeds'], ['Internal', 'data'], ['Data', 'lake']],
      detail: 'Align shared definitions, common part and order codes, and field-level traceability across CM feeds and internal team data into one standardized lake.' },
    zh: { chip: '接入', title: '接入与对齐',
      lines: [['乙方数据'], ['内部数据'], ['数据湖']],
      detail: '统一口径、统一编码（料号、工单号），让每个字段从哪来都查得到，把乙方数据与甲方内部数据汇入一个标准化数据湖。' }
  },
  {
    color: '#45b4d2', tint: '#edf8fb', icons: ['branch', 'gear', 'chart'],
    en: { chip: 'Process', title: 'Process & Model',
      lines: [['Tool', 'routing'], ['ML / OR', 'runs'], ['Anomaly', '& baseline']],
      detail: 'Scale goes to Python/SQL (machine learning and operations research); agile questions to Excel/Tableau (statistics). Only the machine-learning branch predicts; both feed baselines.' },
    zh: { chip: '处理', title: '处理与建模',
      lines: [['工具分流'], ['ML / 运筹'], ['异常基线']],
      detail: '规模化走 Python/SQL（机器学习与运筹优化），临时问题走 Excel/Tableau（统计）；预测只来自机器学习分支，两者共同产出基线。' }
  },
  {
    color: '#cda262', tint: '#faf5ec', dir: 'left', icons: ['clipboard', 'people', 'magnifier'],
    en: { chip: 'Insight', title: 'Insight & Action',
      lines: [['Recovery', 'plan'], ['Cross-team', 'review'], ['Root', 'cause']],
      detail: 'Root cause and sensitivity analysis → cross-functional agreement → recovery plan and schedule optimization.' },
    zh: { chip: '洞察', title: '洞察与行动',
      lines: [['恢复计划'], ['跨团队'], ['根因分析']],
      detail: '根因与敏感性分析 → 跨职能达成共识 → 恢复计划与排程优化。' }
  },
  {
    color: '#77c7a6', tint: '#eef8f3', icons: ['factory', 'truck', 'refresh'],
    en: { chip: 'Execute', title: 'Execute & Impact',
      lines: [['Production', 'run'], ['On-time', 'delivery'], ['CM', 'write-back']],
      detail: 'Real-time CM write-backs flow back to ingestion; on-time quality delivery is the measured business outcome.' },
    zh: { chip: '执行', title: '执行与结果',
      lines: [['生产执行'], ['按时交付'], ['系统回写']],
      detail: '乙方系统实时回写数据回流接入层；按时按质交付是被度量的业务结果。' }
  }
];
/* ── Level 2: a per-stage deep dive ──────────────────────────────────────
   Clicking any L1 card opens six illustrated steps for that stage. The layout
   is a snake (row 1 left→right, row 2 right→left), so the dashed links stay
   in the gutters and never cross a card. Every colour, icon and label comes
   from the owning stage, so L2 reads as a zoom-in rather than a new theme.  */
const FLOW_L2 = [
  {
    en: { lead: 'From scattered CM feeds to one version of the truth.',
      detail: 'Six steps turn raw contractor data and internal spreadsheets into a governed lake: shared codes, resolved identities and a clear record of where every field came from.' },
    zh: { lead: '把散落的乙方数据，收成一个大家都认的口径。',
      detail: '六步把乙方原始数据与甲方内部表格整理成受治理的数据湖：统一编码、对齐同一实体，并让每个字段的来源都查得到。' },
    nodes: [
      { icon: 'db',        en: ['CM feeds', 'Pull I/O, quality and test records from MES, QMS and WMS.'], zh: ['乙方数据', '从 MES、QMS、WMS 拉取投料产出、质量与测试记录。'] },
      { icon: 'docs',      en: ['Internal data', 'Capacity plans, work-hour sheets and escalation logs from cross-team owners.'], zh: ['甲方内部数据', '汇集产能计划、工时表与升级记录，来自各内部团队。'] },
      { icon: 'layers',    en: ['Schema mapping', 'Shared definitions, common part and order codes, field-level traceability.'], zh: ['口径对齐', '统一定义、料号与工单号，写清每个字段从哪来。'] },
      { icon: 'link',      en: ['Identity resolution', 'One part, one order, one station id across every source system.'], zh: ['实体归一', '同一个料件、工单、站点，在所有系统里只用一个编号。'] },
      { icon: 'shield',    en: ['Access and audit', 'Row-level access for CM and internal teams; every write is logged.'], zh: ['权限与留痕', '按行控制乙方与内部团队的可见范围，每次写入都有记录。'] },
      { icon: 'lake',      en: ['Standardized lake', 'One governed dataset, refreshed continuously for every downstream run.'], zh: ['标准化数据湖', '一处受治理的数据，持续刷新，供下游所有环节使用。'] }
    ]
  },
  {
    en: { lead: 'Route the question before choosing the tool.',
      detail: 'Scale and agility lead to different paths. Only the machine-learning branch forecasts; both branches produce baselines, and senior OPMs set the thresholds that make an anomaly meaningful.' },
    zh: { lead: '先判断问题属于哪一类，再决定用什么工具。',
      detail: '规模化与临时问题走不同路径。预测只来自机器学习分支，两条路径都会产出基线；资深 OPM 定下阈值，异常才真正有业务含义。' },
    nodes: [
      { icon: 'branch',    en: ['Scenario routing', 'Scale goes to scheduled pipelines; one-off questions to agile analysis.'], zh: ['场景分流', '规模化的走定时管道，临时问题走敏捷分析。'] },
      { icon: 'gear',      en: ['Python / SQL', 'Scheduled machine learning and operations research runs on the full corpus.'], zh: ['Python / SQL', '在全量数据上定时跑机器学习与运筹优化。'] },
      { icon: 'chart',     en: ['Excel / Tableau', 'Statistics and variance baselines for quick, local questions.'], zh: ['Excel / Tableau', '用统计与方差基线回答局部、即时的问题。'] },
      { icon: 'people',    en: ['OPM knowledge gates', 'Senior OPMs define thresholds and label what counts as an anomaly.'], zh: ['资深 OPM 校验', '由资深 OPM 定阈值，说清什么才算异常。'] },
      { icon: 'magnifier', en: ['Anomaly detection', 'Deviation from baseline across yield, cycle time and daily I/O.'], zh: ['异常识别', '比对良率、节拍与每日投料产出的基线偏差。'] },
      { icon: 'gauge',     en: ['Predictive patterns', 'Only the ML branch forecasts; both branches write baselines back.'], zh: ['趋势预测', '预测只来自机器学习分支，两条路径都回写基线。'] }
    ]
  },
  {
    en: { lead: 'From a signal to a plan everyone can sign off.',
      detail: 'Root cause and sensitivity work lead to a cross-functional review. The recovery plan carries an owner and a date for each action, and the decision log keeps the trade-offs visible.' },
    zh: { lead: '从一个信号，走到一份各方都愿意签字的方案。',
      detail: '先做根因与敏感性分析，再进跨团队评审。恢复计划里每项动作都有负责人和时间点，决策留痕让取舍始终摆得上台面。' },
    nodes: [
      { icon: 'magnifier', en: ['Root cause', 'Drill from an anomaly to the line, station and shift behind it.'], zh: ['根因分析', '从异常一路下钻到具体的线体、站点与班次。'] },
      { icon: 'gauge',     en: ['Sensitivity', 'Work out which lever actually moves the promised delivery date.'], zh: ['敏感性分析', '找出到底哪个变量才真正影响交付日期。'] },
      { icon: 'people',    en: ['Cross-team review', 'Quality, capacity and finance agree on the same set of numbers.'], zh: ['跨团队评审', '质量、产能与财务在同一组数字上达成共识。'] },
      { icon: 'clipboard', en: ['Recovery plan', 'Sequenced actions, each with one owner and one committed date.'], zh: ['恢复计划', '动作排好先后，每项都有负责人与承诺时间。'] },
      { icon: 'clock',     en: ['Schedule optimization', 'Rebalance the ramp without squeezing planned quality checks.'], zh: ['排程优化', '重排爬坡节奏，但不压缩既定的质量抽检。'] },
      { icon: 'check',     en: ['Decision log', 'Record what was chosen, what was traded off, and who agreed.'], zh: ['决策留痕', '记下选了什么、让了什么、由谁拍板。'] }
    ]
  },
  {
    en: { lead: 'Execution writes back; delivery is the measured outcome.',
      detail: 'CM systems write back in real time while work orders run. On-time quality delivery stays the business result, and the refreshed data re-enters ingestion to start the next cycle.' },
    zh: { lead: '生产在跑，数据在回流；交付才是被度量的结果。',
      detail: '工单执行的同时，乙方系统实时回写。按时按质交付是业务结果，更新后的数据重新进入接入层，开启下一轮闭环。' },
    nodes: [
      { icon: 'factory',   en: ['Production execution', 'Work orders released against the agreed schedule and capacity plan.'], zh: ['生产执行', '按谈定的排程与产能计划下发工单。'] },
      { icon: 'refresh',   en: ['CM write-back', 'Real-time I/O and test results flow straight back to ingestion.'], zh: ['系统回写', '实时投料产出与测试结果直接回流接入层。'] },
      { icon: 'shield',    en: ['Quality gate', 'On-line checks stay inside the plan, not after a rushed ramp.'], zh: ['质量关口', '在线抽检留在计划里，不放到赶产之后。'] },
      { icon: 'truck',     en: ['On-time delivery', 'Correct quantity and quality, safely, on the promised date.'], zh: ['按时交付', '数量与质量都对，安全地按承诺日期交付。'] },
      { icon: 'gauge',     en: ['Ops efficiency', 'OPM runs the floor from one view instead of ten parallel sheets.'], zh: ['运营效率', 'OPM 用一个页面管现场，不再对着十份表格。'] },
      { icon: 'link',      en: ['Feedback loop', 'Fresh data re-enters the lake and refreshes every baseline.'], zh: ['反馈闭环', '新数据回到数据湖，刷新每一条基线。'] }
    ]
  }
];

/* Taller 1000x1120 canvas: cards need room for three illustrated nodes each,
   and the caption can wrap to 2–3 lines without touching the lower card. */
const FLOW_BOX = [
  [325, 40, 350, 180], [640, 450, 350, 180],
  [325, 820, 350, 180], [10, 450, 350, 180]
];
/* Symmetric quarter-circle arcs, the v29 language: one Q control point per
   corner of the ring, instead of the v30 S-shaped cubic Béziers. */
const FLOW_ARCS = [
  { d: 'M 675 130 Q 835 130 835 450', head: 'M 827 438 L 835 452 L 843 438 Z' },
  { d: 'M 835 630 Q 835 910 675 910', head: 'M 689 902 L 673 910 L 689 918 Z' },
  { d: 'M 325 910 Q 165 910 165 630', head: 'M 157 644 L 165 628 L 173 644 Z' },
  { d: 'M 165 450 Q 165 130 325 130', head: 'M 311 122 L 327 130 L 311 138 Z' }
];
const FLOW_SPOKES = [
  'M 500 462 L 500 220', 'M 578 540 L 640 540',
  'M 500 618 L 500 820', 'M 422 540 L 360 540'
];

/* Illustrated, isometric-style "clip art" in the spirit of draw.io shape
   libraries — solid shaded volumes, top highlights and a dark side face.
   Each stage now owns its OWN palette derived from its card colour, so the
   artwork matches the card instead of every card sharing one blue gradient. */
function flowPalette(hex, gid) {
  const n = parseInt(hex.slice(1), 16);
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const mix = (target, t) => '#' + rgb.map((v, i) =>
    Math.round(v + (target[i] - v) * t).toString(16).padStart(2, '0')).join('');
  return {
    gid, face: hex,
    top: mix([255, 255, 255], .58),
    soft: mix([255, 255, 255], .78),
    line: mix([255, 255, 255], .42),
    accent: mix([255, 255, 255], .22),
    dark: mix([16, 24, 32], .32)
  };
}
function flowDefs() {
  return `<defs>${FLOW_STAGES.map((s, i) => {
    const p = flowPalette(s.color, `flowIso${i}`);
    return `<linearGradient id="${p.gid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.top}"/><stop offset="55%" stop-color="${p.face}"/><stop offset="100%" stop-color="${p.dark}"/>
    </linearGradient>`;
  }).join('')}</defs>`;
}
function flowArt(p) {
  const isoCube = (x, y, s, p) => `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M16 0 32 8 16 16 0 8Z" fill="${p.top}"/>
  <path d="M0 8 16 16 16 32 0 24Z" fill="url(#${p.gid})"/>
  <path d="M32 8 16 16 16 32 32 24Z" fill="${p.dark}"/></g>`;
  return {
  db: `<ellipse cx="32" cy="48" rx="23" ry="9" fill="${p.dark}"/>
       <path d="M9 16v30c0 5 10.3 9 23 9s23-4 23-9V16" fill="url(#${p.gid})"/>
       <ellipse cx="32" cy="16" rx="23" ry="9" fill="${p.top}"/>
       <path d="M9 28c0 5 10.3 9 23 9s23-4 23-9M9 39c0 5 10.3 9 23 9s23-4 23-9" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/>`,
  docs: `<path d="M8 14h24l10 10v36H8z" fill="${p.dark}" opacity=".28" transform="translate(6,4)"/>
       <path d="M8 14h24l10 10v36H8z" fill="url(#${p.gid})"/>
       <path d="M32 14v10h10" fill="${p.top}"/>
       <path d="M15 32h20M15 39h20M15 46h13" fill="none" stroke="#fff" stroke-width="2.4" opacity=".8" stroke-linecap="round"/>`,
  lake: `<ellipse cx="32" cy="48" rx="25" ry="10" fill="${p.dark}"/>
       <path d="M7 18v28c0 5.5 11.2 10 25 10s25-4.5 25-10V18" fill="url(#${p.gid})"/>
       <ellipse cx="32" cy="18" rx="25" ry="10" fill="${p.top}"/>
       <ellipse cx="32" cy="18" rx="16" ry="6" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/>
       <ellipse cx="32" cy="18" rx="7" ry="2.6" fill="#fff" opacity=".6"/>
       <path d="M7 34c0 5.5 11.2 10 25 10s25-4.5 25-10" fill="none" stroke="#fff" stroke-width="2" opacity=".4"/>`,
  branch: `<path d="M18 32c10 0 10-14 20-14M18 34c10 0 10 14 20 14" fill="none" stroke="${p.line}" stroke-width="4" stroke-linecap="round"/>
       ${isoCube(0, 22, .62, p)}${isoCube(36, 8, .62, p)}${isoCube(36, 38, .62, p)}`,
  gear: `<circle cx="32" cy="32" r="22" fill="none" stroke="${p.line}" stroke-width="9" stroke-dasharray="8 6"/>
       <circle cx="32" cy="32" r="16" fill="url(#${p.gid})"/>
       <circle cx="32" cy="32" r="7" fill="${p.soft}"/>
       <path d="M32 16v6M32 40v6M16 32h6M40 32h6" stroke="#fff" stroke-width="2" opacity=".55"/>`,
  chart: `<path d="M8 54h50" stroke="${p.dark}" stroke-width="2.5"/>
       <path d="M12 34h12v20H12z" fill="url(#${p.gid})"/><path d="M12 34l4-4h12l-4 4z" fill="${p.top}"/><path d="M24 30l4 4v20l-4-4z" fill="${p.dark}"/>
       <path d="M29 24h12v30H29z" fill="url(#${p.gid})"/><path d="M29 24l4-4h12l-4 4z" fill="${p.top}"/><path d="M41 20l4 4v30l-4-4z" fill="${p.dark}"/>
       <path d="M46 38h10v16H46z" fill="url(#${p.gid})"/><path d="M46 38l4-4h10l-4 4z" fill="${p.top}"/><path d="M56 34l4 4v16l-4-4z" fill="${p.dark}"/>
       <path d="M10 32 24 22 38 27 56 12" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round" opacity=".95"/>
       <circle cx="56" cy="12" r="4" fill="#fff"/>`,
  magnifier: `<circle cx="27" cy="26" r="17" fill="${p.soft}" stroke="${p.face}" stroke-width="4"/>
       <circle cx="27" cy="26" r="12" fill="none" stroke="#fff" stroke-width="1.6" opacity=".85"/>
       <path d="M17 30l6-7 5 4 6-9" fill="none" stroke="${p.face}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
       <path d="M39 37l16 16" stroke="${p.dark}" stroke-width="9" stroke-linecap="round"/>
       <path d="M39 37l16 16" stroke="${p.accent}" stroke-width="5" stroke-linecap="round"/>`,
  people: `<circle cx="23" cy="19" r="9" fill="${p.top}"/>
       <path d="M7 52c0-11 7-19 16-19s16 8 16 19z" fill="url(#${p.gid})"/>
       <circle cx="46" cy="24" r="7" fill="${p.soft}"/>
       <path d="M34 52c0-8 5-13 12-13s12 5 12 13z" fill="${p.line}"/>
       <path d="M14 45h18" stroke="#fff" stroke-width="2" opacity=".4"/>`,
  clipboard: `<rect x="10" y="12" width="44" height="50" rx="6" fill="url(#${p.gid})"/>
       <rect x="21" y="7" width="22" height="11" rx="3" fill="${p.dark}"/>
       <path d="M18 32l5 5 9-10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
       <path d="M36 31h12M18 47h30M18 54h20" fill="none" stroke="#fff" stroke-width="2.4" opacity=".75" stroke-linecap="round"/>`,
  factory: `<path d="M6 54V28l12 8V28l12 8V28l12 8v18z" fill="url(#${p.gid})"/>
       <path d="M42 12h9v30h-9z" fill="${p.dark}"/><path d="M42 12l3-5h9l-3 5z" fill="${p.top}"/>
       <path d="M10 44h6v8h-6zM24 44h6v8h-6z" fill="#fff" opacity=".85"/>
       <path d="M6 54h48" stroke="${p.dark}" stroke-width="2.5"/>
       <circle cx="47" cy="5" r="3" fill="${p.soft}" opacity=".85"/><circle cx="53" cy="1" r="2.2" fill="${p.soft}" opacity=".6"/>`,
  truck: `<rect x="3" y="20" width="34" height="23" rx="2" fill="url(#${p.gid})"/>
       <path d="M37 26h11l10 10v7H37z" fill="${p.line}"/><path d="M41 29h7l6 6H41z" fill="${p.soft}"/>
       <circle cx="16" cy="45" r="7" fill="${p.dark}"/><circle cx="16" cy="45" r="3" fill="${p.top}"/>
       <circle cx="47" cy="45" r="7" fill="${p.dark}"/><circle cx="47" cy="45" r="3" fill="${p.top}"/>
       <path d="M7 25h26" stroke="#fff" stroke-width="2" opacity=".55"/>`,
  refresh: `<path d="M16 24C22 10 42 8 50 20" fill="none" stroke="${p.line}" stroke-width="7" stroke-linecap="round"/>
       <path d="M44 14l8 6 2-10" fill="${p.dark}"/>
       <path d="M48 44C42 56 22 58 14 46" fill="none" stroke="${p.line}" stroke-width="7" stroke-linecap="round"/>
       <path d="M20 52l-8-6-2 10" fill="${p.dark}"/>
       <ellipse cx="32" cy="36" rx="11" ry="4" fill="${p.top}"/>
       <path d="M21 36v10c0 2.3 4.9 4 11 4s11-1.7 11-4V36" fill="url(#${p.gid})"/>
       <path d="M21 41c0 2.3 4.9 4 11 4s11-1.7 11-4" fill="none" stroke="#fff" stroke-width="1.5" opacity=".6"/>`,
  /* Six more shapes for the Level 2 deep dive: same shaded-volume language. */
  layers: `<path d="M32 8 58 20 32 32 6 20Z" fill="${p.top}"/>
        <path d="M6 20l26 12 26-12" fill="none" stroke="#fff" stroke-width="1.6" opacity=".55"/>
        <path d="M6 32l26 12 26-12" fill="none" stroke="${p.face}" stroke-width="3"/>
        <path d="M6 44l26 12 26-12" fill="none" stroke="${p.dark}" stroke-width="3"/>
        <path d="M6 32v8l26 12 26-12v-8L32 44Z" fill="url(#${p.gid})" opacity=".9"/>`,
  shield: `<path d="M32 6 54 14v18c0 13-9 21-22 26C19 53 10 45 10 32V14Z" fill="url(#${p.gid})"/>
        <path d="M32 6 54 14v18c0 13-9 21-22 26Z" fill="${p.dark}" opacity=".22"/>
        <path d="M21 32l8 8 15-16" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/>`,
  clock: `<circle cx="32" cy="32" r="25" fill="url(#${p.gid})"/>
        <circle cx="32" cy="32" r="19" fill="${p.soft}" opacity=".92"/>
        <path d="M32 18v15l11 7" fill="none" stroke="${p.face}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="32" cy="32" r="3.4" fill="${p.dark}"/>
        <path d="M32 7v5M57 32h-5M32 57v-5M7 32h5" stroke="${p.line}" stroke-width="2.4" stroke-linecap="round"/>`,
  gauge: `<path d="M8 46a24 24 0 0 1 48 0" fill="none" stroke="${p.line}" stroke-width="8" stroke-linecap="round"/>
        <path d="M8 46a24 24 0 0 1 48 0" fill="none" stroke="url(#${p.gid})" stroke-width="8" stroke-dasharray="42 90" stroke-linecap="round"/>
        <path d="M32 46 46 26" stroke="${p.dark}" stroke-width="3.6" stroke-linecap="round"/>
        <circle cx="32" cy="46" r="5" fill="${p.face}"/><circle cx="32" cy="46" r="2.2" fill="#fff"/>
        <path d="M10 52h44" stroke="${p.dark}" stroke-width="2.4"/>`,
  link: `<rect x="4" y="22" width="24" height="16" rx="8" fill="none" stroke="${p.face}" stroke-width="6"/>
        <rect x="36" y="22" width="24" height="16" rx="8" fill="none" stroke="${p.face}" stroke-width="6"/>
        <path d="M26 30h12" stroke="${p.line}" stroke-width="6" stroke-linecap="round"/>
        <path d="M12 30h10M42 30h10" stroke="#fff" stroke-width="2" opacity=".65"/>
        <circle cx="32" cy="30" r="4.6" fill="url(#${p.gid})"/>`,
  check: `<circle cx="32" cy="32" r="25" fill="url(#${p.gid})"/>
        <circle cx="32" cy="32" r="19" fill="none" stroke="#fff" stroke-width="1.6" opacity=".55"/>
        <path d="M20 32l9 9 16-18" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M32 7v4M57 32h-4M32 57v-4M7 32h4" stroke="${p.top}" stroke-width="2.6" stroke-linecap="round"/>`
};
}
const FLOW_STATE = {};
function flowState(pid) {
  if (!FLOW_STATE[pid]) FLOW_STATE[pid] = { focus: -1, manual: false, level: 1, l2: -1 };
  return FLOW_STATE[pid];
}
function flowCaption(st) {
  if (st.level === 2) return FLOW_L2[st.l2][LANG].detail;
  return st.focus < 0 ? I18N[LANG]['flow.caption'] : FLOW_STAGES[st.focus][LANG].detail;
}
/* Wrap the caption into 2–3 centred lines. CJK is measured per character,
   Latin per word, so both languages break at a natural point. */
function flowWrapUnits() { return window.innerWidth <= 600 ? 58 : 92; }
function flowWrap(text, maxUnits = flowWrapUnits(), maxLines = 3) {
  const cjk = /[\u3400-\u9fff\u3000-\u303f]/;
  const chars = Array.from(text);
  const isCJK = chars.filter(c => cjk.test(c)).length > chars.length * .25;
  const tokens = isCJK ? chars : text.split(/\s+/);
  const units = t => Array.from(t).reduce((n, c) => n + (cjk.test(c) ? 2 : 1), 0);
  const lines = [];
  let cur = '', n = 0;
  for (const t of tokens) {
    const w = units(t) + (isCJK ? 0 : 1);
    if (cur && n + w > maxUnits) { lines.push(cur); cur = t; n = units(t); }
    else { cur += (isCJK || !cur ? '' : ' ') + t; n += w; }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, maxLines);
}
function flowCaptionNodes(st, baseY = 1050) {
  return flowWrap(flowCaption(st)).map((line, i) =>
    `<text x="500" y="${baseY + i * 27}" text-anchor="middle">${esc(line)}</text>`).join('');
}
/* One illustrated node = a transparent rounded outline + a shaded clip-art
   volume + a 1–2 line label. `dir: 'left'` cards read right → left, so their
   inner dashed arrows point left too (bottom card of the clockwise ring). */
function flowNode(s, x, y, i, t, icons) {
  const cx = x + [58, 175, 292][i];
  const tile = `<rect x="${cx - 40}" y="${y + 42}" width="80" height="80" rx="15" fill="none" stroke="none"/>`;
  const art = `<g transform="translate(${cx - 36},${y + 46}) scale(1.125)">${icons[s.icons[i]]}</g>`;
  const lines = t.lines[i].map((ln, k) =>
    `<text class="flow-node-label" x="${cx}" y="${y + 140 + k * 19}" text-anchor="middle">${esc(ln)}</text>`).join('');
  const link = i < 2 ? (() => {
    const x1 = cx + 42, x2 = cx + 75, cy = y + 82;
    const dash = stroke => `<path class="flow-inner-link" fill="none" stroke="${s.color}" stroke-width="2" stroke-dasharray="8 8" stroke-linecap="round" opacity=".7" d="${stroke}"/>`;
    if (s.dir === 'left') {
      return dash(`M ${x2} ${cy} H ${x1 + 8}`) +
        `<path d="M ${x1 + 14} ${cy - 5} L ${x1 + 7} ${cy} L ${x1 + 14} ${cy + 5}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>`;
    }
    return dash(`M ${x1} ${cy} H ${x2 - 8}`) +
      `<path d="M ${x2 - 14} ${cy - 5} L ${x2 - 7} ${cy} L ${x2 - 14} ${cy + 5}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>`;
  })() : '';
  return tile + art + lines + link;
}

function flowL1SVG(st) {
  const defs = flowDefs();
  const arts = FLOW_STAGES.map((s, i) => flowArt(flowPalette(s.color, `flowIso${i}`)));
  const arcs = FLOW_ARCS.map((a, i) => {
    const c = FLOW_STAGES[i].color;
    return `<g class="flow-arc-g" data-arc="${i}">
      <path class="flow-arc-base" d="${a.d}" fill="none" stroke="${c}" stroke-width="1.4" opacity=".14"/>
      <path class="flow-arc" d="${a.d}" fill="none" stroke="${c}" stroke-width="2.2" stroke-dasharray="8 8" stroke-linecap="round" opacity=".72"/>
      <path d="${a.head}" fill="${c}" opacity=".8"/>
      ${[0, -1.8].map(b => `<g class="flow-packet"><circle r="7.5" fill="#fff"/><circle r="4.2" fill="${c}"/><animateMotion dur="3.6s" begin="${b}s" repeatCount="indefinite" path="${a.d}"/></g>`).join('')}
    </g>`;
  }).join('');

  const spokes = FLOW_SPOKES.map((d, i) => `<path d="${d}" fill="none" stroke="#3b8ad9" stroke-width="1.2" stroke-dasharray="4 7" opacity=".28"/>
      <g class="flow-spoke-dot"><circle r="3.4" fill="${FLOW_STAGES[i].color}" opacity=".8"/><animateMotion dur="2.6s" begin="-${(i * .65).toFixed(2)}s" repeatCount="indefinite" path="${d}"/></g>`).join('');

  const cards = FLOW_STAGES.map((s, i) => {
    const [x, y, w, h] = FLOW_BOX[i], t = s[LANG];
    return `<g class="flow-card" data-flow="${i}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${s.tint}" stroke="${s.color}" stroke-opacity=".28" stroke-width="1.4"/>
      <rect x="${x}" y="${y}" width="5" height="${h}" rx="2.5" fill="${s.color}" opacity=".8"/>
      <circle cx="${x + 28}" cy="${y + 30}" r="13" fill="${s.color}"/>
      <text class="flow-num" x="${x + 28}" y="${y + 35}" text-anchor="middle">${i + 1}</text>
      <text class="flow-title" x="${x + 52}" y="${y + 36}">${esc(t.title)}</text>
      ${[0, 1, 2].map(k => flowNode(s, x, y, k, t, arts[i])).join('')}
    </g>`;
  }).join('');

  const hub = `<g class="flow-hub">
      <circle cx="500" cy="540" r="78" fill="#fff" stroke="#2b54b8" stroke-width="1.8"/>
      <circle class="flow-pulse" cx="500" cy="540" r="78" fill="none" stroke="#2b54b8" stroke-width="1.6" opacity=".5">
        <animate attributeName="r" values="78;116" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".45;0" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle class="flow-pulse" cx="500" cy="540" r="78" fill="none" stroke="#3b8ad9" stroke-width="1.4" opacity=".35">
        <animate attributeName="r" values="78;116" dur="3s" begin="-1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".35;0" dur="3s" begin="-1.5s" repeatCount="indefinite"/>
      </circle>
      <text class="flow-hub-2" x="500" y="532" text-anchor="middle">${esc(I18N[LANG]['flow.hub1'])}</text>
      <text class="flow-hub-2" x="500" y="562" text-anchor="middle">${esc(I18N[LANG]['flow.hub2'])}</text>
    </g>`;

  const feedback = `<text class="flow-feedback" x="100" y="330" text-anchor="start">${esc(I18N[LANG]['flow.feedback'])}</text>`;
  const domain = `<g class="flow-domain"><text x="500" y="712" text-anchor="middle">${esc(I18N[LANG]['flow.domain'])}</text></g>`;
  const caption = `<g class="flow-caption">${flowCaptionNodes(st)}</g>`;

  return `<svg class="flow-svg" viewBox="0 0 1000 1120" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(I18N[LANG]['flow.stage'])}">
    ${defs}
    <g class="flow-spokes">${spokes}</g>
    <g class="flow-arcs">${arcs}</g>
    ${feedback}
    <g class="flow-cards">${cards}</g>
    ${hub}
    ${domain}
    ${caption}
  </svg>`;
}

/* ── Level 2 SVG ───────────────────────────────────────────────────────
   Six steps in a snake: row 1 reads left→right, row 2 right→left. Links live
   only in the gutters, so no dashed line ever crosses a card. Each link
   carries a marching-ants stroke, an arrow and a SMIL data packet.          */
const FLOW_L2_BOX = [
  [30, 200], [357, 200], [684, 200],
  [684, 590], [357, 590], [30, 590]
];
const FLOW_L2_W = 286, FLOW_L2_H = 300;
/* Links sit at y + 130, above the description block (y + 146), so a moving
   dash never appears to run through a node's copy. */
const FLOW_L2_LINKS = [
  { d: 'M 316 330 H 357', ax: 351, ay: 330, dir: 'right' },
  { d: 'M 643 330 H 684', ax: 678, ay: 330, dir: 'right' },
  { d: 'M 970 330 H 986 V 720 H 970', ax: 976, ay: 720, dir: 'left' },
  { d: 'M 684 720 H 643', ax: 649, ay: 720, dir: 'left' },
  { d: 'M 357 720 H 316', ax: 322, ay: 720, dir: 'left' }
];
function flowL2Defs(st) {
  const p = flowPalette(FLOW_STAGES[st.l2].color, 'flowIsoL2');
  return `<defs><linearGradient id="flowIsoL2" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${p.top}"/><stop offset="55%" stop-color="${p.face}"/><stop offset="100%" stop-color="${p.dark}"/>
  </linearGradient></defs>`;
}
function flowL2Arrow(x, y, dir, color) {
  const k = dir === 'left' ? -1 : 1;
  return `<path d="M ${x - k * 6} ${y - 5} L ${x + k * 1} ${y} L ${x - k * 6} ${y + 5}" fill="none"
    stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`;
}
function flowL2Links(st) {
  const c = FLOW_STAGES[st.l2].color;
  return FLOW_L2_LINKS.map((l, i) => `<g class="flow-l2-link-g">
      <path class="flow-l2-link" d="${l.d}" fill="none" stroke="${c}" stroke-width="2.2"
            stroke-dasharray="8 8" stroke-linecap="round" opacity=".7"/>
      ${flowL2Arrow(l.ax, l.ay, l.dir, c)}
      <g class="flow-l2-packet"><circle r="6.5" fill="#fff"/><circle r="3.6" fill="${c}"/>
        <animateMotion dur="2.6s" begin="-${(i * .52).toFixed(2)}s" repeatCount="indefinite" path="${l.d}"/></g>
    </g>`).join('');
}
function flowL2Node(st, i) {
  const [x, y] = FLOW_L2_BOX[i], stage = FLOW_STAGES[st.l2];
  const data = FLOW_L2[st.l2], nd = data.nodes[i], label = nd[LANG];
  const art = flowArt(flowPalette(stage.color, 'flowIsoL2'))[nd.icon];
  /* The card's inner width is ~238 viewBox units. Mobile CSS lifts the type
     to 19px, so CJK needs fewer units per line there or it overruns the card. */
  const narrow = window.innerWidth <= 600;
  const descUnits = narrow ? (LANG === 'zh' ? 20 : 23) : 27;
  const desc = flowWrap(label[1], descUnits, 4);
  return `<g class="flow-l2-card" data-flow-node="${i}">
    <rect x="${x}" y="${y}" width="${FLOW_L2_W}" height="${FLOW_L2_H}" rx="16"
          fill="#ffffff" stroke="${stage.color}" stroke-opacity=".24" stroke-width="1.4"/>
    <rect x="${x + 16}" y="${y}" width="60" height="4" rx="2" fill="${stage.color}" opacity=".85"/>
    <circle cx="${x + 34}" cy="${y + 42}" r="16" fill="${stage.color}"/>
    <text class="flow-l2-num" x="${x + 34}" y="${y + 47}" text-anchor="middle">${String(i + 1).padStart(2, '0')}</text>
    <g transform="translate(${x + 192},${y + 8}) scale(1.1)">${art}</g>
    <text class="flow-l2-title" x="${x + 24}" y="${y + 112}">${esc(label[0])}</text>
    ${desc.map((ln, k) => `<text class="flow-l2-desc" x="${x + 24}" y="${y + 148 + k * 25}">${esc(ln)}</text>`).join('')}
    <text class="flow-l2-step" x="${x + 262}" y="${y + 282}" text-anchor="end">${String(i + 1).padStart(2, '0')} / 06</text>
  </g>`;
}
function flowL2SVG(st) {
  const stage = FLOW_STAGES[st.l2], data = FLOW_L2[st.l2], t = data[LANG];
  const c = stage.color;
  const head = `<g class="flow-l2-head">
      <circle cx="70" cy="76" r="24" fill="${c}"/>
      <text class="flow-l2-hnum" x="70" y="82" text-anchor="middle">${String(st.l2 + 1).padStart(2, '0')}</text>
      <text class="flow-l2-htitle" x="112" y="87">${esc(stage[LANG].title)}</text>
      <text class="flow-l2-stage" x="940" y="70" text-anchor="end">${esc(I18N[LANG]['flow.l2.stage'])} ${String(st.l2 + 1).padStart(2, '0')} / 04</text>
      ${flowWrap(t.lead, 96).map((ln, k) => `<text class="flow-l2-lead" x="60" y="${138 + k * 26}">${esc(ln)}</text>`).join('')}
    </g>`;
  const backLoop = `<g class="flow-l2-link-g">
      <path class="flow-l2-link" d="M 30 720 H 14 V 920 H 480" fill="none" stroke="${c}"
            stroke-width="1.8" stroke-dasharray="6 8" stroke-linecap="round" opacity=".45"/>
      ${flowL2Arrow(486, 920, 'right', c)}
      <g class="flow-l2-packet"><circle r="5.5" fill="#fff"/><circle r="3" fill="${c}" opacity=".75"/>
        <animateMotion dur="3.4s" begin="-1.2s" repeatCount="indefinite" path="M 30 720 H 14 V 920 H 480"/></g>
    </g>`;
  /* No foot line: `detail` already states where the stage sits in the loop,
     and the return arc below the cards visualises the next cycle. A third
     repetition only crowded the caption, especially at mobile type sizes. */
  const detailLines = flowWrap(t.detail, LANG === 'zh' ? 64 : 100);
  const caption = `<g class="flow-l2-caption-box">
      <rect x="30" y="956" width="940" height="104" rx="14" fill="${stage.tint}" stroke="${c}" stroke-opacity=".18" stroke-width="1.2"/>
      ${detailLines.map((ln, k) => `<text class="flow-caption-l2" x="500" y="${(1010 - (detailLines.length - 1) * 14) + k * 28}" text-anchor="middle">${esc(ln)}</text>`).join('')}
    </g>`;
  return `<svg class="flow-svg" viewBox="0 0 1000 1120" preserveAspectRatio="xMidYMid meet" role="img"
      aria-label="${esc(stage[LANG].title)} · ${esc(I18N[LANG]['flow.l2.count'])}">
    ${flowL2Defs(st)}
    ${backLoop}
    ${flowL2Links(st)}
    ${head}
    ${data.nodes.map((_, i) => flowL2Node(st, i)).join('')}
    ${caption}
  </svg>`;
}
function flowSVG(st) { return st.level === 2 ? flowL2SVG(st) : flowL1SVG(st); }

function flowControlsHTML(st) {
  const hint = esc(I18N[LANG]['flow.l2.hint']);
  if (st.level === 2) {
    const s = FLOW_STAGES[st.l2];
    return `<div class="flow-controls">
      <button type="button" class="flow-mode flow-back" data-flow-back="1" title="${esc(I18N[LANG]['flow.l2.back'])}">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16 10H4m0 0 5-5m-5 5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>${esc(I18N[LANG]['flow.l2.back'])}</span></button>
      <span class="flow-count">${String(st.l2 + 1).padStart(2, '0')} ${esc(s[LANG].chip)} · ${esc(I18N[LANG]['flow.l2.count'])}</span>
    </div>`;
  }
  const chips = FLOW_STAGES.map((s, i) =>
    `<button type="button" data-flow-stage="${i}" class="${st.focus === i ? 'active' : ''}" aria-pressed="${st.focus === i}" title="${hint}">${String(i + 1).padStart(2, '0')} ${esc(s[LANG].chip)}</button>`).join('');
  return `<div class="flow-controls"><span class="flow-mode" role="group" aria-label="${hint}">${chips}</span><span class="flow-count">${esc(I18N[LANG]['flow.count'])}</span></div>`;
}
function flowL2HintHTML() {
  const txt = esc(I18N[LANG]['flow.l2.hint']);
  const short = esc(I18N[LANG]['flow.l2.hint.short']);
  // The 600px breakpoint already swaps .hint-long / .hint-short for tab hints;
  // reusing it keeps the cue short enough to sit right of the card on mobile,
  // instead of being clamped back over the card.
  return `<button type="button" class="tab-hint flow-l2-hint" data-flow-enter="0" title="${txt}">
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16 10H4m0 0 5-5m-5 5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span class="hint-long">${txt}</span><span class="hint-short">${short}</span></button>`;
}
function flowBrowserHTML(p) {
  const st = flowState(p.id);
  return browserFrame(p, {
    top: flowControlsHTML(st),
    body: `<div class="flow-stage" data-focus="${st.focus}" data-level="${st.level}">${flowSVG(st)}${st.level === 1 ? flowL2HintHTML() : ''}</div>`,
    extra: 'is-flow', sideActive: 3   // db rail icon = data pipeline workbench
  });
}
/* L1 repaints in place so the marching-ants and SMIL packets never flash.
   L2 has a completely different layout, so it is rebuilt only on level
   changes and language switches. */
function renderFlowStage(browser) {
  const st = flowState(browser.dataset.product);
  const stage = browser.querySelector('.flow-stage');
  if (!stage) return;
  stage.dataset.focus = st.focus;
  stage.dataset.level = st.level;
  stage.innerHTML = flowSVG(st) + (st.level === 1 ? flowL2HintHTML() : '');
  positionFlowHint(browser);
}
function paintFlow(browser) {
  const st = flowState(browser.dataset.product);
  const controls = browser.querySelector('.flow-controls');
  if (controls) controls.outerHTML = flowControlsHTML(st);
  if (st.level === 2) { renderFlowStage(browser); return; }
  const stage = browser.querySelector('.flow-stage');
  if (!stage) return;
  stage.dataset.focus = st.focus;
  stage.dataset.level = 1;
  const cap = stage.querySelector('.flow-caption');
  if (cap) cap.innerHTML = flowCaptionNodes(st);
}
function refreshFlowCaptions() {
  document.querySelectorAll('.browser.is-flow').forEach(b => {
    const st = flowState(b.dataset.product);
    if (st.level === 2) { renderFlowStage(b); }
    else {
      const cap = b.querySelector('.flow-caption');
      if (cap) cap.innerHTML = flowCaptionNodes(st);
      const hint = b.querySelector('.flow-l2-hint');
      if (hint) {
        hint.title = I18N[LANG]['flow.l2.hint'];
        const long = hint.querySelector('.hint-long');
        const short = hint.querySelector('.hint-short');
        if (long) long.textContent = I18N[LANG]['flow.l2.hint'];
        if (short) short.textContent = I18N[LANG]['flow.l2.hint.short'];
      }
      const controls = b.querySelector('.flow-controls');
      if (controls) controls.outerHTML = flowControlsHTML(st);
    }
  });
  positionFlowHint();
}
function toggleFlowFocus(browser, i) {
  const st = flowState(browser.dataset.product);
  if (st.level === 2) return;
  if (st.focus === i) { st.focus = -1; st.manual = false; }  // click active → resume auto
  else { st.focus = i; st.manual = true; }                   // manual focus stops auto
  paintFlow(browser);
}
/* Click any L1 card to zoom into its six-step L2 view. */
function enterFlowL2(browser, i) {
  const st = flowState(browser.dataset.product);
  st.level = 2; st.l2 = i; st.manual = true;
  const controls = browser.querySelector('.flow-controls');
  if (controls) controls.outerHTML = flowControlsHTML(st);
  renderFlowStage(browser);
}
function exitFlowL2(browser) {
  const st = flowState(browser.dataset.product);
  st.level = 1; st.l2 = -1; st.focus = -1; st.manual = false;
  const controls = browser.querySelector('.flow-controls');
  if (controls) controls.outerHTML = flowControlsHTML(st);
  renderFlowStage(browser);
}
/* The hint is HTML (so it reuses .tab-hint exactly). It is anchored to the
   FIRST CARD's real screen box: left edge just beyond the card, top near the
   card's upper band. That clears both the card and the y=130 outgoing arc in
   EN and ZH, and survives letterboxing / font-size breakpoints on mobile.
   A second rAF handles the post-layout pass after a language switch. */
function positionFlowHint(root = document) {
  const run = () => root.querySelectorAll('.flow-stage[data-level="1"]').forEach(stage => {
    const hint = stage.querySelector('.flow-l2-hint');
    const card = stage.querySelector('.flow-card[data-flow="0"] > rect');
    if (!hint || !card) return;
    const sr = stage.getBoundingClientRect();
    const cr = card.getBoundingClientRect();
    const gap = window.innerWidth <= 600 ? 12 : 26;
    const hw = hint.getBoundingClientRect().width || 100;
    let left = cr.right - sr.left + gap;
    // Never let the cue spill past the stage (a hard CTM point used to do that).
    left = Math.min(left, sr.width - hw - 6);
    left = Math.max(6, left);
    hint.style.left = left + 'px';
    hint.style.top = (cr.top - sr.top + cr.height * 0.17) + 'px';
  });
  run();
  requestAnimationFrame(run);
}
/* Auto-highlight rotates every 3s while nobody is watching. The dashed
   flow itself is CSS/SMIL and keeps running regardless of the highlight. */
function flowTick() {
  if (document.hidden) return;
  document.querySelectorAll('.browser.is-flow').forEach(browser => {
    const st = flowState(browser.dataset.product);
    if (st.manual || st.level === 2) return;
    const demo = browser.closest('.product-demo');
    if (demo && demo.matches(':hover')) return;
    const box = browser.getBoundingClientRect();
    if (box.bottom <= 0 || box.top >= window.innerHeight) return;
    st.focus = st.focus < 0 ? 0 : (st.focus + 1) % FLOW_STAGES.length;
    paintFlow(browser);
  });
}


/* ── Registration: the shell only sees this object. ───────────────────── */
window.PortfolioDemos.flow = {
  render: flowBrowserHTML,
  onDomainEnter(p) { FLOW_STATE[p.id] = { focus: -1, manual: false, level: 1, l2: -1 }; },
  onClick(e) {
    const chip = e.target.closest('.flow-mode button[data-flow-stage]');
    if (chip) { toggleFlowFocus(chip.closest('.browser'), Number(chip.dataset.flowStage)); return true; }
    const enter = e.target.closest('[data-flow-enter]');
    if (enter) { enterFlowL2(enter.closest('.browser'), Number(enter.dataset.flowEnter)); return true; }
    const back = e.target.closest('[data-flow-back]');
    if (back) { exitFlowL2(back.closest('.browser')); return true; }
    const card = e.target.closest('.flow-card[data-flow]');
    if (card) { enterFlowL2(card.closest('.browser'), Number(card.dataset.flow)); return true; }
    return false;
  },
  onRender: positionFlowHint,
  onResize() { refreshFlowCaptions(); positionFlowHint(); },
  tick: flowTick
};
