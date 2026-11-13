/* ==========================================================================
   tab/me/me.js — the "Me" tab as a self-contained module.

   Decoupling: this file never reaches into core/app.js internals. It registers a tab object
   on window.PortfolioTabs; the shell only knows that registry. Adding another
   tab later = drop in one more file + one <script> tag, no shell edits.

   Plain script (no ES module / no fetch) so the site still works from file://.
   The shell passes LANG into mount()/refresh()/tocItems(). Four sections are
   switched from the floating TOC: Teams, Travel, Time and Talent. TOC labels,
   taglines and the three Talent cards are bilingual. Time hobby captions,
   map tooltips, travel journals and the lightbox stay English in both modes.
   Talent ZH copy is deliberately plain-spoken: no literal translations, no
   dashes, and a concrete project case under each claim.

   TRAVEL[] is a list of travel journals, not single photos: each stop has one
   date / place / note and `photos[]` with one or more images. Stops with >1
   photo get a blue count badge on the map card and a thumbnail filmstrip in
   the lightbox. The 05 / 07 counter counts JOURNALS, not photos.

   Text nodes carry data-me-text; refresh() swaps only their innerHTML, so a
   language switch never rebuilds the Time marquee (no animation restart).
   ========================================================================== */
(function () {
  'use strict';

  var MAP = window.ME_MAP;
  if (!MAP) return;
  var W = MAP.width, H = MAP.height;

  /* ──────────────────────────────────────────────────────────────
     1. EDITABLE CONTENT — change anything here, nothing else.
     `side: 'right' | 'left'` flips the horizontal line for a city.
     `lane` is the preferred line length: 0 = far end, 1 = mid, 2 = near.
     `logos[]` may hold any number of entries = multiple chapters on one line.
     `label: 'up' | 'down'` places the city name above / below its dot.
     City dots ALWAYS sit on the real coordinates. `resolveConflicts()`
     staggers crowded cities left/right, or on the same side at different
     distances (different line lengths), so logo tiles never overlap.
     ────────────────────────────────────────────────────────────── */
  var LOGOS = {
    bytedance: 'assets/logos/bytedance.png',
    huawei:    'assets/logos/huawei.jpg',
    apple:     'assets/logos/apple.png',
    alibaba:   'assets/logos/alibaba.png',
    microsoft: 'assets/logos/microsoft.jpg',
    tencent:   'assets/logos/tencent.jpg',
    wechat:    'assets/logos/wechat.jpg',
    abc:       'assets/logos/abc.jpg',
    hku:       'assets/logos/hku.png',
    stealth:   'assets/logos/stealth.jpg'
  };

  var TEAMS = [
    { city: 'Beijing', lon: 116.4074, lat: 39.9042, side: 'right', lane: 0, label: 'up',
      logos: [
        { k: 'microsoft', company: 'Microsoft', team: 'Research Asia', notes: ["L, thx for the late-night whiteboard sessions; learned a lot from you.", "R, your calm under chaos set the tone for the whole program."]}
      ] },
    { city: 'Shanghai', lon: 121.4737, lat: 31.2304, side: 'right', lane: 0, label: 'up',
      logos: [
        { k: 'apple',   company: 'Apple',           team: 'APO Shanghai', notes: ["WinniQ, love ur laugh and the way u manage the team; thx for ur trust", "AlexZ, impressed by how u lead a group of 'Backstreet Boys'; respect!", "KarlD, my mentor, miss the chats we have on the subway after work", "TigerA, thx for sending me a welcome email on my onboarding day", "AlexD, my neighbor, rigorous & eco-minded (reusable bags, fantastic)", "StellaP, like the sister I never had, always remember ur kindness & beauty", "DavidL, like the brother I never had, always remember ur 'Friends' T-shirt", "ClarkX, seriously, u really need to teach me how to keep fit and handsome", "LeoW, GSM pro, and a talented designer (white envelope, warm & beautiful)", "LilyL, from BPR, miss our requirement battles, glad we didn't fight, LOL"]},
        { k: 'stealth', company: 'Stealth Startup', team: 'Early product team', notes: ["J, three people, one whiteboard, and the first version shipped anyway."]}
      ] },
    { city: 'Suzhou', lon: 120.5853, lat: 31.2989, side: 'left', lane: 0, label: 'up',
      logos: [
        { k: 'apple', company: 'Apple', team: 'APO Suzhou', notes: ["AndyX, u r the 1st person I met there, thx for ur 1st treat meal", "RainyW, u r the 2nd person I met there, gosh, u look like 22", "JesseJ, u r funny, tiny, sunny, and lovely; man! u r truly a humor master", "BillH, love ur startup story; miss playing ping-pong with u, such a tie", "HelenZ, last but not least, thx for ur encouragement; ur smile is a cure"]}
      ] },
    { city: 'Hangzhou', lon: 120.1551, lat: 30.2741, side: 'left', lane: 0, label: 'down',
      logos: [
        { k: 'abc', company: 'ABC', team: 'Tech Products Department, Data Analysis Department', notes: ["Y, your 'ship it, then fix it' instinct still saves me time."]},
        { k: 'alibaba', company: 'Alibaba', team: 'Ant Group', notes: ["Y, your 'ship it, then fix it' instinct still saves me time."]}
      ] },
    { city: 'Guangzhou', lon: 113.2644, lat: 23.1291, side: 'left', lane: 0, label: 'up',
      logos: [
        { k: 'tencent', company: 'Tencent', team: 'WeChat Group', notes: []},
        { k: 'wechat', company: 'WeChat', team: 'Open Platform Department', notes: ["K, sharpest reviews in the room; thx for always pushing back."]}
      ] },
    { city: 'Shenzhen', lon: 114.0579, lat: 22.5431, side: 'right', lane: 0, label: 'down',
      logos: [
        { k: 'apple',  company: 'Apple',   team: 'APO Shenzhen',   notes: ["AngelY, always amused by your stories and jokes, LMAO", "BenW, u would buy me a beer when I travel to shenzhen, right?", "JeraldC, always being energetic, love that spirit, awesome", "RexB, ur philosophy on social & work has inspired me since day one", "Richard, only talked to u a few times, but u r a gentleman, I feel that"]},
        { k: 'huawei', company: 'Huawei',  team: 'Finance Group',  notes: ["D, you made a chaotic ramp look boring - in the best way."]}
      ] },
    { city: 'Hong Kong', lon: 114.1694, lat: 22.3193, side: 'left', lane: 1, label: 'down',
      logos: [
        { k: 'stealth', company: 'Stealth Startup', team: 'HK marketplace', notes: ["P, two desks and one whiteboard; a good run."]},
        { k: 'hku', company: 'HKU', team: 'Department of Computer Science', notes: []}
      ] }
  ];

  /* pin = [lon, lat] on the map; card = [x, y] in the 1100x650 viewBox.
     `photos[]` = every image shot at this stop (1..n). The first one is the
     map cover; the rest only appear in the lightbox filmstrip. `place` is
     free text (nothing parses it); the current convention is
     "spot · city · province/region", e.g. Qingshan Lake · Hangzhou · Zhejiang.
     Rewrite any entry to "Qingshan Lake · Zhejiang" later if you prefer. */
  var PH = 'assets/photos/';
  var QS = [1,2,3,4,5,6,7].map(function (i) {
    return PH + 'qingshan-' + String(i).padStart(2, '0') + '.webp';
  });

  var TRAVEL = [
    { photos: [PH+'field-03.jpg', PH+'field-02.jpg', PH+'field-07.jpg'],
      date: 'August 2024',   place: 'Kanas · Altay · Xinjiang',
      note: 'Clouds moved fast. Nothing else did.',              pin: [87.04, 48.72],  card: [72, 112],    tilt: -1.6 },
    { photos: [PH+'field-02.jpg'],
      date: 'July 2024',     place: 'Qinghai Lake · Haibei · Qinghai',
      note: 'The water was calm enough to keep the whole skyline.', pin: [100.2, 36.9], card: [296, 52],    tilt: 1.4 },
    { photos: [PH+'field-01.jpg', PH+'field-06.jpg', PH+'field-05.jpg'],
      date: 'October 2025',  place: 'Dali Old Town · Dali · Yunnan',
      note: 'Rooftops, a river, and an afternoon with nowhere to be.', pin: [100.23, 25.6], card: [586, 48], tilt: -1.2 },
    { photos: [PH+'field-04.jpg'],
      date: 'May 2025',      place: 'Jiuzhaigou · Ngawa · Sichuan',
      note: 'Seen from a train window, somewhere between two tunnels.', pin: [103.9, 33.3], card: [890, 62], tilt: 1.6 },
    /* The test set: 7 images from one stop (Qingshan Lake, Hangzhou). */
    { photos: QS,
      date: 'June 2025',     place: 'Qingshan Lake · Hangzhou · Zhejiang',
      note: 'A sika deer picking its way through a flooded cypress forest. I stood there longer than I meant to.',
      pin: [119.83, 30.23], card: [1010, 232],  tilt: -1.4 },
    { photos: [PH+'field-06.jpg', PH+'field-05.jpg'],
      date: 'June 2025',     place: 'Qiandao Lake · Hangzhou · Zhejiang',
      note: 'The kind of view that makes you put the laptop away.', pin: [118.9, 29.6], card: [1012, 452], tilt: 1.2 },
    { photos: [PH+'field-07.jpg'],
      date: 'January 2026',  place: 'Harbin Station · Harbin · Heilongjiang',
      note: 'Cold platform, red trains, and a sky that refused to settle.', pin: [126.63, 45.75], card: [118, 578], tilt: -1.6 }
  ];

  var LB_SUFFIX = 'Travel Journals';   // 05 / 07 Travel Journals

  /* ── Bilingual copy for the four sections ───────────────────────────
     `**...**` becomes <strong> and `[label](#product-id)` becomes a new-tab link after escaping, so the copy stays safe.
     Tagline keys are 'tagline.' + section id; hobby keys 'hobby.N';
     Talent keys are 'talent.N.title' / 'talent.N.body' / 'talent.N.case'
     (a point of view, then a concrete project case).                    */
  var TEXT = {
    en: {
      'tagline.teams':  'Cities I lived in, and teams I walked with along the way.',
      'tagline.travel': 'Finding Beauty in the Mundane',
      'tagline.time':  'Hobbies, and my time spent on them.',
      'tagline.talent': 'Not born a talent; my talents were trained by hard projects.',
      'hobby.0': 'Reading',            'hobby.1': 'Picnic with Friends',
      'hobby.2': 'Play Ping-Pong',    'hobby.3': 'Hiking with Friends',
      'hobby.4': 'Film Photography',  'hobby.5': 'Coffee & Notes',
      'hobby.6': 'Weekend Drives',    'hobby.7': 'Slow Mornings',
      'talent.0.title':  'Solving the problems worth solving',
      'talent.0.body':  'Hard problems are uncomfortable by nature, but in the AI era easy tasks are the first to be replaced. As the projects piled up, I started volunteering for the difficult ones that were critical to the team. I try to understand them, break them down and close them one by one, so the business can actually move.',
      'talent.0.case': 'On [Simi-Part](#simipart) there were no labels for 2,260 small parts, and a screw in a phone looked nothing like the same screw in a laptop on paper. I encoded geometry, process and material into part embeddings, then grouped look alikes with nearest neighbour search. One M1.6 screw turned up under four part numbers with three different quotes, which became a negotiation list.',
      'talent.1.title': 'Business first, AI second',
      'talent.1.body': "I come from a technical background, but I have never treated the business as someone else's job. AI/ML skills are my strengths, and they are **enablers, not outcomes**. I put **business first**, learn how it actually works, and use AI only on the few steps where it matters, so the organisation grows with AI rather than being replaced by it.",
      'talent.1.case': '[Factory Flow](#factoryflow) started with a plain problem. CM data lived in too many systems and internal teams kept their own sheets. Before any model, I aligned part and order codes, recorded where every field came from, and built one shared data lake. Only then did anomaly detection and recovery plans mean anything, and the on site OPM team could run the FATP floor from a single view.',
      'talent.2.title': 'Getting stakeholders to the same table',
      'talent.2.body': 'Most of my projects cut across teams and companies, with internal and external stakeholders who define success differently. Before any negotiation I work out what the project is worth to each of them, make the compromises explicit, and balance the needs instead of pushing just one side.',
      'talent.2.case': 'On [CreditPulse](#creditpulse), a higher AUC meant little if policy, compliance and branch teams would not act on it. I sat with risk modelling, lending policy, compliance and branch managers. Model accuracy called for more features, compliance needed a reason code on every decline and repricing, and branches wanted fewer manual reviews. I wrote down what each side would gain and give up, then agreed on fairness checks per segment, reason codes and a human review threshold. Only after that did default probability, top factors and pricing bands become a plan all four sides could sign off.',
    },
    zh: {
      'tagline.teams':  '生活过的城市，同行过的团队。',
      'tagline.travel': '在寻常日子里，看见美。',
      'tagline.time':  '爱好，和我为之付出的时间。',
      'tagline.talent': '不是天生有才；本事都是在项目里历练出来的。',
      /* Hobby captions stay English in both modes: only the tagline is translated. */
      'hobby.0': 'Reading',            'hobby.1': 'Picnic with Friends',
      'hobby.2': 'Play Ping-Pong',    'hobby.3': 'Hiking with Friends',
      'hobby.4': 'Film Photography',  'hobby.5': 'Coffee & Notes',
      'hobby.6': 'Weekend Drives',    'hobby.7': 'Slow Mornings',
      'talent.0.title':  '敢啃值得啃的难题',
      'talent.0.body':  '做难事很折磨人，但在 AI 时代，只会做简单任务的人最先被替代。项目越做越多，我开始主动接那些棘手、对团队又真正要紧的事：先想明白，再拆开，逐个解决，最后推动业务往前走。',
      'talent.0.case':  '做 [Simi-Part](#simipart) 时，2,260 个小部件没有任何标注，手机上的一颗螺丝和笔记本里的同一颗，在台账上完全是两回事。我把几何、工艺和材质编码成料件向量，再用近邻检索把长得像的归到一起。同一颗 M1.6 螺丝挂在四个不同的料号下，报价来自三家供应商，最后整理成一张可以直接去谈的清单。',
      'talent.1.title': '业务在前，AI 在后',
      'talent.1.body':  '我是技术出身，但从不觉得业务是别人的事。AI/ML 是我的长项，但它们是**手段，不是结果**。我始终秉持**业务优先**的理念，先把业务琢磨透，再用 AI 改进真正值得改的环节，让团队借着 AI 把业务做大，而不是被 AI 取代。',
      'talent.1.case':  '[Factory Flow](#factoryflow) 的起点其实很平常：CM 工厂的数据散在多个系统里，内部各团队还各有一套表格。做模型之前，我先统一料号与工单号、写清每个字段从哪来、把数据汇到一处，之后异常识别和恢复计划才真正派得上用场，驻厂 OPM 也终于能在一个页面里管住整条 FATP 产线。',
      'talent.2.title': '把多方拉到同一张桌上',
      'talent.2.body':  '我经手的项目大多横跨团队和公司，内外部利益相关者对「做成」各有各的定义。每次谈判或合作前，我先想清楚这件事对每一方各有什么价值，再把取舍摊开讲清楚，平衡多方需求，而不是只顾一头。',
      'talent.2.case':  '做 [CreditPulse](#creditpulse) 时，AUC 再高，如果信贷政策、合规和分行不买账，模型也落不了地。我要同时跟风控建模、信贷政策、合规和分行客户经理对齐：模型想多加特征，合规要求每笔拒绝与重定价都能给出理由码，分行不希望人工复核挤占客户沟通时间。我把各方的取舍逐条写清，最后定下按客群校验公平性、每笔输出理由码、超过阈值转人工复核，违约概率、主要因子和定价分档这才成了四方都愿意签字的方案。'
    }
  };
  var SECTION_LABELS = {
    teams:  { en: 'Teams',  zh: '团队' },
    travel: { en: 'Travel', zh: '旅途' },
    time:   { en: 'Time',   zh: '爱好' },
    talent: { en: 'Talent', zh: '才能' }
  };
  var SECTION_IDS = ['teams', 'travel', 'time', 'talent'];

  /* Time: two counter-moving marquees. Photos are reused from the travel set;
     captions are deliberately unrelated (placeholder hobbies). */
  var HOBBIES = [
    { key: 'hobby.0', img: 'assets/photos/field-02.jpg' },
    { key: 'hobby.1', img: 'assets/photos/qingshan-01.webp' },
    { key: 'hobby.2', img: 'assets/photos/field-03.jpg' },
    { key: 'hobby.3', img: 'assets/photos/qingshan-03.webp' },
    { key: 'hobby.4', img: 'assets/photos/field-01.jpg' },
    { key: 'hobby.5', img: 'assets/photos/qingshan-05.webp' },
    { key: 'hobby.6', img: 'assets/photos/field-06.jpg' },
    { key: 'hobby.7', img: 'assets/photos/qingshan-07.webp' }
  ];
  /* Talent: three photo-backed cards. The images are byte-identical copies
     of the uploaded originals; fading + blur happen in CSS, not in the file. */
  var TALENTS = [
    { img: 'assets/photos/talent-01.png' },
    { img: 'assets/photos/talent-02.png' },
    { img: 'assets/photos/talent-03.png' }
  ];

  /* This module declares its own images; the shared prewarmer drains them
     after window.load. Rank 3 = Time / Talent, rank 4 = travel journal photos. */
  if (window.PortfolioWarm) {
    window.PortfolioWarm.add(Object.keys(LOGOS).map(function (k) { return LOGOS[k]; }), 1);
    window.PortfolioWarm.add(HOBBIES.map(function (h) { return h.img; }), 3);
    window.PortfolioWarm.add(TALENTS.map(function (t) { return t.img; }), 3);
    window.PortfolioWarm.add(TRAVEL.reduce(function (a, j) { return a.concat(j.photos); }, []), 4);
  }
  /* Compact coordinate / location glyph used in Teams tooltips. */
  var ICON_PIN = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
    '<path d="M8 1.6a4.6 4.6 0 0 0-4.6 4.6c0 3.3 4.6 8.2 4.6 8.2s4.6-4.9 4.6-8.2A4.6 4.6 0 0 0 8 1.6Z" ' +
    'stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<circle cx="8" cy="6.2" r="1.6" fill="currentColor"/></svg>';
  /* ──────────────────────────────────────────────────────────────
     2. Module state
     ────────────────────────────────────────────────────────────── */
  var state = { root: null, section: 'teams', lang: 'en', lightbox: -1,
                lbPhoto: 0, lbHover: false, mounted: false, lastFocus: null };
  var lbTimer = null, lbManualUntil = 0;
  var LB_MS = 3000;
  var keyHandler = null;

  /* esc() is shared with the shell (core/app.js). One implementation only. */
  var pos = function (x, y) {
    return 'left:' + (x / W * 100).toFixed(4) + '%;top:' + (y / H * 100).toFixed(4) + '%';
  };
  var n = function (v) { return (Math.round(v * 10) / 10).toString(); };

  /* Escape first, then allow only **bold** and [label](#product-id) —
     the latter links to a project card in a fresh tab (index.html#id). */
  function rich(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(#([A-Za-z0-9_-]+)\)/g,
               '<a class="me-plink" href="index.html#$2" target="_blank" rel="noopener">$1</a>');
  }
  function txt(key) { return rich(TEXT[state.lang][key] || ''); }
  function applyTexts() {
    if (!state.root) return;
    Array.prototype.forEach.call(state.root.querySelectorAll('[data-me-text]'), function (el) {
      el.innerHTML = rich(TEXT[state.lang][el.getAttribute('data-me-text')] || '');
    });
  }

  /* ──────────────────────────────────────────────────────────────
     3. Map builders
     ────────────────────────────────────────────────────────────── */
  var LAND_CACHE = null;
  function landPaths() {
    if (LAND_CACHE === null) {
      LAND_CACHE = MAP.provinces.map(function (p) {
        return '<path class="me-land" d="' + p.d + '"/>';
      }).join('');
    }
    return LAND_CACHE;
  }

  /* Shared geometry constants, all in the 1100 x 650 viewBox. */
  var LOGO_STEP = 52;                                   // gap between logos on one line
  var EDGE = { right: [1028, 800, 620], left: [132, 380, 560] };
  var MIN_LINE_GAP = 46;    // two logos on the same side need this much vertical room
  var LABEL_GAP = 40;       // city labels stack by at least this much
  var LABEL_X_NEAR = 90;    // labels this close horizontally are considered colliding

  /* Generic de-collision: never move a city dot off its real coordinate.
     Instead (a) put crowded cities on opposite sides, or (b) keep them on
     the same side but give them different line lengths / end positions. */
  function resolveConflicts(items) {
    ['left', 'right'].forEach(function (side) {
      var group = items.filter(function (it) { return it.side === side; })
                       .sort(function (a, b) { return a.y - b.y; });
      var used = [];
      group.forEach(function (it) {
        var lane = it.lane || 0;
        while (used.some(function (q) {
          return Math.abs(q.y - it.y) < MIN_LINE_GAP && q.lane === lane;
        })) lane++;
        if (lane >= EDGE[side].length) {
          var other = side === 'left' ? 'right' : 'left';
          var free = !items.some(function (q) {
            return q !== it && q.side === other && Math.abs(q.y - it.y) < MIN_LINE_GAP;
          });
          if (free) { it.side = other; lane = 0; }
          else lane = EDGE[side].length - 1;
        }
        it.lane = lane;
        used.push(it);
      });
    });

    // City labels: stack vertically when markers share an x neighbourhood.
    var ordered = items.slice().sort(function (a, b) { return a.labelY - b.labelY; });
    for (var i = 1; i < ordered.length; i++) {
      var prev = ordered[i - 1], cur = ordered[i];
      if (Math.abs(cur.x - prev.x) < LABEL_X_NEAR && cur.labelY - prev.labelY < LABEL_GAP) {
        cur.labelY = prev.labelY + LABEL_GAP;
      }
    }
    return items;
  }

  function careerItems() {
    return resolveConflicts(TEAMS.map(function (c) {
      var p = MAP.project(c.lon, c.lat);   // true lon/lat, no manual nudge
      return {
        city: c.city, side: c.side, lane: c.lane || 0, logos: c.logos,
        x: p[0], y: p[1],
        labelY: p[1] + (c.label === 'up' ? -21 : 21)
      };
    }));
  }

  function teamsGeometry() {
    var lines = '', dots = '', overlay = '';
    careerItems().forEach(function (c) {
      var endX = EDGE[c.side][c.lane];
      lines += '<path class="me-line" d="M' + n(c.x) + ',' + n(c.y) +
               ' L' + n(endX) + ',' + n(c.y) + '"/>';
      dots += '<circle class="me-dot" cx="' + n(c.x) + '" cy="' + n(c.y) + '" r="5.4"/>' +
              '<circle class="me-dot-core" cx="' + n(c.x) + '" cy="' + n(c.y) + '" r="1.9"/>';
      overlay += '<div class="me-city" style="' + pos(c.x, c.labelY) + '">' + esc(c.city) + '</div>';

      c.logos.forEach(function (lg, i) {
        var lx = c.side === 'right'
          ? endX - 28 - (c.logos.length - 1 - i) * LOGO_STEP
          : endX + 28 + i * LOGO_STEP;
        var src = LOGOS[lg.k] || '';
        // pos(lx, c.y) + CSS translate(-50%,-100%) => tile bottom RESTS on the line.
        overlay += '<div class="me-logo side-' + c.side + '" tabindex="0" role="img" aria-label="' + esc(lg.company + ' — ' + lg.team) + '" style="' + pos(lx, c.y) + '">' +
                     '<img src="' + src + '" alt="' + esc(lg.company) + '">' +
                     '<span class="me-logo-tip">' +
                       '<span class="me-logo-tip-head"><b>' + esc(lg.company) + '</b>' +
                         '<span class="me-logo-tip-city">' + ICON_PIN + esc(c.city.toUpperCase()) + '</span></span>' +
                       '<span class="me-logo-tip-team">' + esc(lg.team) + '</span>' +
                       '<span class="me-logo-tip-notes">' +
                         (lg.notes || []).map(function (t) {
                           return '<span class="me-logo-tip-note">' + esc(t) + '</span>';
                         }).join('') +
                       '</span></span>' +
                   '</div>';
      });
    });
    return { svg: lines + dots, overlay: overlay };
  }

  function travelGeometry() {
    var lines = '', dots = '', overlay = '';
    TRAVEL.forEach(function (L, i) {
      var p = MAP.project(L.pin[0], L.pin[1]);
      lines += '<path class="me-line-travel" d="M' + n(L.card[0]) + ',' + n(L.card[1]) +
               ' L' + n(p[0]) + ',' + n(p[1]) + '"/>';
      dots += '<circle class="me-dot" cx="' + n(p[0]) + '" cy="' + n(p[1]) + '" r="5.4"/>' +
              '<circle class="me-dot-core" cx="' + n(p[0]) + '" cy="' + n(p[1]) + '" r="1.9"/>';
      var many = L.photos.length > 1;
      overlay += '<button type="button" class="me-photo' + (many ? ' has-count' : '') + '" data-index="' + i + '" ' +
                 'aria-label="Open journal: ' + esc(L.place) + ', ' + esc(L.date) +
                   ', ' + L.photos.length + ' photo' + (many ? 's' : '') + '" ' +
                 'style="' + pos(L.card[0], L.card[1]) + ';--tilt:' + L.tilt + 'deg">' +
                 '<img src="' + L.photos[0] + '" alt="' + esc(L.place) + '" loading="lazy">' +
                 (many ? '<span class="me-photo-count" aria-hidden="true">' + L.photos.length + '</span>' : '') +
                 '</button>';
    });
    return { svg: lines + dots, overlay: overlay };
  }

  /* ── Time: two counter-moving marquees ──────────────────────────────
     Row 1: photo on top, caption below, drifts RIGHT.
     Row 2: caption on top, photo below, drifts LEFT.
     Each list is duplicated; translating exactly -50% of the doubled row
     makes the loop seamless (item margin, not flex gap, keeps the math exact).
     Both ends are faded + blurred by CSS masks on the viewport.            */
  function timeRow(list, reverse, titleFirst) {
    var cells = list.concat(list).map(function (h) {
      var img = '<div class="me-time-img"><img src="' + h.img + '" alt=""></div>';
      var cap = '<span class="me-time-title" data-me-text="' + h.key + '">' + txt(h.key) + '</span>';
      return '<div class="me-time-item">' + (titleFirst ? cap + img : img + cap) + '</div>';
    }).join('');
    return '<div class="me-time-viewport"><div class="me-time-row' +
           (reverse ? ' is-reverse' : '') + '">' + cells + '</div></div>';
  }
  function timeHTML() {
    return '<div class="me-time-stage">' +
             timeRow(HOBBIES, false, false) +
             timeRow(HOBBIES.slice().reverse(), true, true) +
           '</div>';
  }

  /* ── Talent: draw.io-style isometric icons, same language as Factory Flow.
     Kept inside this module (no app.js dependency). Each card owns its own
     colour: bright top / main left / dark right + a soft tinted tile.       */
  function talentHTML() {
    return '<div class="me-talent-grid">' + TALENTS.map(function (t, i) {
      return '<article class="me-talent-card">' +
               '<img class="me-talent-photo" src="' + t.img + '" alt="" aria-hidden="true">' +
               '<div class="me-talent-copy">' +
                 '<h3 class="me-talent-title" data-me-text="talent.' + i + '.title">' + txt('talent.' + i + '.title') + '</h3>' +
                 '<p class="me-talent-body" data-me-text="talent.' + i + '.body">' + txt('talent.' + i + '.body') + '</p>' +
                 '<p class="me-talent-body me-talent-case" data-me-text="talent.' + i + '.case">' + txt('talent.' + i + '.case') + '</p>' +
               '</div>' +
             '</article>';
    }).join('') + '</div>';
  }

  function legend(section) {
    if (section === 'teams')
      return '<div class="me-legend"><div><i class="dot"></i>City</div><div><i class="rule"></i>Chapter</div></div>';
    if (section === 'travel')
      return '<div class="me-legend"><div><i class="dot"></i>Stop</div><div><i class="rule"></i>Route</div></div>';
    return '';   // Time / Talent have no map legend
  }
  function sectionAria(id) {
    return id === 'teams' ? 'Teams map' : id === 'travel' ? 'Travel map'
         : id === 'time' ? 'Time and hobbies' : 'Talents and strengths';
  }

  function stageHTML() {
    var s = state.section;
    if (s === 'time') return timeHTML();
    if (s === 'talent') return talentHTML();
    var isTeams = s === 'teams';
    var g = isTeams ? teamsGeometry() : travelGeometry();
    return '<div class="me-map-scroll">' +
             '<div class="me-map" id="me-map">' +
               '<svg class="me-map-svg" viewBox="' + MAP.viewBox + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
                 '<g class="me-land-group">' + landPaths() + '</g>' +
                 '<g class="me-links">' + g.svg + '</g>' +
               '</svg>' +
               '<div class="me-overlay">' + g.overlay + '</div>' +
             '</div>' +
           '</div>' +
           legend(s);
  }

  function shellHTML() {
    return '<div class="me-inner">' +
             '<p class="me-caption" data-me-text="tagline.' + state.section + '">' + txt('tagline.' + state.section) + '</p>' +
             '<div class="me-stage" id="me-stage" role="tabpanel" aria-label="' + sectionAria(state.section) + '">' + stageHTML() + '</div>' +
           '</div>';
  }

  /* ──────────────────────────────────────────────────────────────
     4. Lightbox — one journal at a time, with a filmstrip of its photos.
        The 05 / 07 counter counts JOURNALS; the filmstrip counts PHOTOS
        inside the current journal (and is hidden for single-photo stops).
     ────────────────────────────────────────────────────────────── */
  var ICON_CLOSE = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
  var ICON_PREV  = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_NEXT  = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* Four L-shaped corners OUTSIDE the thumbnail, same language as the work
     carousel. No direction arrows beside the strip — those felt heavy here. */
  var CORNERS = ['tl','tr','bl','br'].map(function (k) {
    return '<i class="me-cn me-cn-' + k + '"></i>';
  }).join('');

  function filmHTML(L) {
    if (L.photos.length < 2) return '';   // single-photo stops have no strip
    return L.photos.map(function (src, k) {
      return '<button type="button" class="me-lb-thumb' + (k === 0 ? ' is-current' : '') + '" ' +
               'data-photo="' + k + '" aria-label="View photo ' + (k + 1) + ' of ' + L.photos.length + '">' +
               '<img src="' + src + '" alt="" loading="lazy">' + CORNERS +
             '</button>';
    }).join('');
  }

  function indexText(i) {
    return String(i + 1).padStart(2, '0') + ' / ' +
           String(TRAVEL.length).padStart(2, '0') + ' ' + LB_SUFFIX;
  }

  function lightboxHTML(i) {
    var L = TRAVEL[i], many = L.photos.length > 1;
    return '<div class="me-lightbox" id="me-lightbox" role="presentation">' +
             '<div class="me-lb-panel" role="dialog" aria-modal="true" aria-label="Journal: ' + esc(L.place) + ', ' + esc(L.date) + '">' +
               '<button type="button" class="me-lb-close" data-lb-close aria-label="Close">' + ICON_CLOSE + '</button>' +
               '<div class="me-lb-stage" id="me-lb-stage">' +
                 '<img class="me-lb-bg" src="' + L.photos[0] + '" alt="" aria-hidden="true">' +
                 '<img class="me-lb-photo" src="' + L.photos[0] + '" alt="' + esc(L.place) + '">' +
                 '<div class="me-lb-film" id="me-lb-film"' + (many ? '' : ' hidden') + '>' + filmHTML(L) + '</div>' +
               '</div>' +
               '<div class="me-lb-info">' +
                 '<p class="me-lb-date">' + esc(L.date) + '</p>' +
                 '<p class="me-lb-place">' + esc(L.place) + '</p>' +
                 '<div class="me-lb-rule"></div>' +
                 '<p class="me-lb-note">' + esc(L.note) + '</p>' +
                 '<div class="me-lb-bottom">' +
                   '<span class="me-lb-index">' + indexText(i) + '</span>' +
                   '<span class="me-lb-nav">' +
                     '<button type="button" data-lb-nav="-1" aria-label="Previous journal">' + ICON_PREV + '</button>' +
                     '<button type="button" data-lb-nav="1" aria-label="Next journal">' + ICON_NEXT + '</button>' +
                   '</span>' +
                 '</div>' +
               '</div>' +
             '</div>' +
           '</div>';
  }

  /* Scroll the strip so the current thumbnail sits in the middle — the same
     "click one, it centres" behaviour as the project carousel. */
  function centerFilm() {
    var film = state.root && state.root.querySelector('#me-lb-film');
    if (!film || film.hidden) return;
    var cur = film.querySelector('.me-lb-thumb.is-current');
    if (!cur) return;
    var fr = film.getBoundingClientRect(), cr = cur.getBoundingClientRect();
    var delta = (cr.left + cr.width / 2) - (fr.left + fr.width / 2);
    if (Math.abs(delta) > 1) film.scrollBy({ left: delta, behavior: 'smooth' });
  }

  function showLbPhoto(k) {
    var lb = state.root && state.root.querySelector('#me-lightbox');
    if (!lb || state.lightbox < 0) return;
    var L = TRAVEL[state.lightbox];
    k = (k + L.photos.length) % L.photos.length;
    state.lbPhoto = k;
    var src = L.photos[k];
    var photo = lb.querySelector('.me-lb-photo');
    var bg = lb.querySelector('.me-lb-bg');
    if (photo) { photo.src = src; photo.alt = L.place; }
    if (bg) bg.src = src;
    lb.querySelectorAll('.me-lb-thumb').forEach(function (t) {
      t.classList.toggle('is-current', Number(t.dataset.photo) === k);
    });
    centerFilm();
  }

  function lbTick() {
    if (state.lightbox < 0 || state.lbHover || document.hidden) return;
    var L = TRAVEL[state.lightbox];
    if (L.photos.length < 2 || Date.now() < lbManualUntil) return;
    showLbPhoto(state.lbPhoto + 1);        // wraps back to the first photo
  }
  function startLbTimer() { stopLbTimer(); lbTimer = setInterval(lbTick, LB_MS); }
  function stopLbTimer() { if (lbTimer) { clearInterval(lbTimer); lbTimer = null; } }
  function pauseLb() { state.lbHover = true; }
  function resumeLb() {
    state.lbHover = false;
    // Never shorten the 3s grace period granted by a manual thumbnail click.
    lbManualUntil = Math.max(lbManualUntil, Date.now() + 800);
  }

  function openLightbox(i, trigger) {
    closeLightbox(true);
    state.lightbox = i;
    state.lbPhoto = 0;
    state.lbHover = false;
    lbManualUntil = 0;
    state.lastFocus = trigger || null;
    state.root.insertAdjacentHTML('beforeend', lightboxHTML(i));
    document.body.style.overflow = 'hidden';
    var stage = state.root.querySelector('#me-lb-stage');
    if (stage) {
      stage.addEventListener('mouseenter', pauseLb);
      stage.addEventListener('mouseleave', resumeLb);
    }
    startLbTimer();
    centerFilm();
    var close = state.root.querySelector('[data-lb-close]');
    if (close) close.focus();
  }
  function closeLightbox(silent) {
    stopLbTimer();
    state.lbHover = false;
    state.lbPhoto = 0;
    var lb = state.root && state.root.querySelector('#me-lightbox');
    if (!lb) return;
    lb.remove();   // also drops the stage's mouseenter/leave listeners
    state.lightbox = -1;
    document.body.style.overflow = '';
    if (!silent && state.lastFocus && document.contains(state.lastFocus)) state.lastFocus.focus();
  }
  /* Repaint in place: the backdrop, panel and fade-in animation stay alive, so
     switching journals never tears down the mask for a frame (no flash). Only
     the filmstrip's children are rebuilt; focus stays on the nav button. */
  function paintLightbox(i) {
    var L = TRAVEL[i];
    var lb = state.root && state.root.querySelector('#me-lightbox');
    if (!lb) return;
    state.lbPhoto = 0;
    lbManualUntil = 0;
    var film = lb.querySelector('#me-lb-film');
    if (film) {
      film.innerHTML = filmHTML(L);
      film.hidden = L.photos.length < 2;
      film.scrollLeft = 0;
    }
    var photo = lb.querySelector('.me-lb-photo');
    var bg = lb.querySelector('.me-lb-bg');
    if (photo) { photo.src = L.photos[0]; photo.alt = L.place; }
    if (bg) bg.src = L.photos[0];
    var set = function (sel, value) {
      var el = lb.querySelector(sel);
      if (el) el.textContent = value;
    };
    set('.me-lb-date', L.date);
    set('.me-lb-place', L.place);
    set('.me-lb-note', L.note);
    set('.me-lb-index', indexText(i));
    var panel = lb.querySelector('.me-lb-panel');
    if (panel) panel.setAttribute('aria-label', 'Journal: ' + L.place + ', ' + L.date);
    centerFilm();
  }
  function stepLightbox(d) {
    if (state.lightbox < 0) return;
    var next = (state.lightbox + d + TRAVEL.length) % TRAVEL.length;
    state.lightbox = next;
    paintLightbox(next);
  }

  /* ──────────────────────────────────────────────────────────────
     5. Events (delegated, removable on unmount)
     ────────────────────────────────────────────────────────────── */
  function onClick(e) {
    var lbClose = e.target.closest('[data-lb-close]');
    if (lbClose) { closeLightbox(); return; }
    var lbNav = e.target.closest('[data-lb-nav]');
    if (lbNav) { stepLightbox(Number(lbNav.dataset.lbNav)); return; }

    /* A thumbnail click selects a photo INSIDE this journal; it does not
       change the 05 / 07 journal counter. Manual click pauses autoplay. */
    var thumb = e.target.closest('.me-lb-thumb[data-photo]');
    if (thumb) {
      lbManualUntil = Date.now() + LB_MS;
      showLbPhoto(Number(thumb.dataset.photo));
      return;
    }

    var photo = e.target.closest('.me-photo[data-index]');
    if (photo) { openLightbox(Number(photo.dataset.index), photo); return; }

    if (e.target.classList && e.target.classList.contains('me-lightbox')) { closeLightbox(); return; }
  }

  function onKeyDown(e) {
    if (state.lightbox < 0) return;
    if (e.key === 'Escape') { closeLightbox(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); stepLightbox(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); stepLightbox(1); }
    else if (e.key === 'Tab') {
      var panel = state.root.querySelector('.me-lb-panel');
      if (!panel) return;
      var f = Array.prototype.slice.call(panel.querySelectorAll('button'));
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function setSection(id) {
    if (SECTION_IDS.indexOf(id) < 0) return;
    closeLightbox(true);
    state.section = id;
    var cap = state.root.querySelector('.me-caption');
    if (cap) cap.setAttribute('data-me-text', 'tagline.' + id);
    var stage = state.root.querySelector('#me-stage');
    if (stage) {
      stage.innerHTML = stageHTML();
      stage.setAttribute('aria-label', sectionAria(id));
    }
    applyTexts();   // one pass covers the caption and the newly built stage
    // Decoupled notification: the shell listens and re-highlights the TOC.
    document.dispatchEvent(new CustomEvent('portfolio:toc-sync'));
  }

  /* Mobile tooltips are wider than the proportionally fitted map. Pin each
     box inside the viewport so a logo near either edge cannot push it off
     screen; the notes themselves wrap (see me.css) so no text is hidden.
     Desktop keeps the original side-aligned, single-line layout.           */
  function clampTip(logo) {
    var tip = logo && logo.querySelector('.me-logo-tip');
    if (!tip) return;
    if (window.innerWidth > 860) {
      tip.style.removeProperty('left');
      tip.style.removeProperty('right');
      return;
    }
    var lr = logo.getBoundingClientRect();
    var w = Math.min(window.innerWidth * .92, 430);
    var pad = 12;
    var left = lr.left + lr.width / 2 - w / 2;
    left = Math.max(pad, Math.min(left, window.innerWidth - pad - w));
    // Parent transform is translate-only on mobile, so logo-local px are exact.
    tip.style.left = (left - lr.left) + 'px';
    tip.style.right = 'auto';
  }
  function tipHandler(e) {
    var t = e.target;
    var logo = t && t.closest ? t.closest('.me-logo') : null;
    if (logo) clampTip(logo);
  }
  function tipResizeHandler() {
    if (!state.root) return;
    var tips = state.root.querySelectorAll('.me-logo-tip');
    for (var i = 0; i < tips.length; i++) {
      tips[i].style.removeProperty('left');
      tips[i].style.removeProperty('right');
    }
  }

  /* ──────────────────────────────────────────────────────────────
     6. Public tab interface consumed by app.js
     ────────────────────────────────────────────────────────────── */
  function mount(root, lang) {
    state.root = root;
    state.lang = lang === 'zh' ? 'zh' : 'en';
    root.innerHTML = shellHTML();
    root.addEventListener('click', onClick);
    root.addEventListener('mouseover', tipHandler);
    root.addEventListener('focusin', tipHandler);
    window.addEventListener('resize', tipResizeHandler);
    keyHandler = onKeyDown;
    document.addEventListener('keydown', keyHandler);
    state.mounted = true;
  }
  function unmount() {
    closeLightbox(true);
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
    if (state.root) {
      state.root.removeEventListener('click', onClick);
      state.root.removeEventListener('mouseover', tipHandler);
      state.root.removeEventListener('focusin', tipHandler);
      state.root.innerHTML = '';
    }
    window.removeEventListener('resize', tipResizeHandler);
    document.body.style.overflow = '';
    state.mounted = false;
    state.lastFocus = null;
    // Re-entering Me always starts at Teams, just like a fresh page load.
    // Without this, a previous Travel view would silently persist across tabs.
    state.section = 'teams';
    state.lightbox = -1;
  }
  function refresh(lang) {
    if (!state.mounted || !state.root) return;
    if (lang) state.lang = lang === 'zh' ? 'zh' : 'en';
    // Text-only swap: the Time marquee keeps its animation clock, an open
    // travel lightbox keeps its mask, and no DOM is rebuilt (no flash).
    applyTexts();
  }

  window.PortfolioTabs = window.PortfolioTabs || [];
  window.PortfolioTabs.push({
    id: 'me',
    label: { en: 'Me', zh: '我' },
    count: null,
    mount: mount,
    unmount: unmount,
    refresh: refresh,
    isMounted: function () { return state.mounted; },
    // The floating TOC stays visible everywhere; a module supplies its own items.
    tocItems: function (lang) {
      var l = lang === 'zh' ? 'zh' : 'en';
      return SECTION_IDS.map(function (id) {
        return { id: id, label: SECTION_LABELS[id][l] };
      });
    },
    activeTocId: function () { return state.section; },
    onTocClick: function (id) { setSection(id); }
  });
})();
