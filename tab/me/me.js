/* ==========================================================================
   tab/me/me.js — the "Me" tab as a self-contained module.

   Decoupling: this file never reaches into core/app.js internals. It registers a tab object
   on window.PortfolioTabs; the shell only knows that registry. Adding another
   tab later = drop in one more file + one <script> tag, no shell edits.

   Plain script (no ES module / no fetch) so the site still works from file://.
   The shell passes LANG into mount()/refresh()/tocItems(). Six sections are
   switched from the floating TOC: Teams, Travel, Talent, Time, Tags and Text.
   TOC labels, taglines and the three Talent cards are bilingual. Time hobby
   captions, map tooltips, travel journals, the lightbox and the whole Tags
   section (word cloud + project previews) stay English in both modes — in
   Tags only the tagline is translated. Text keeps the reader screen (the
   iPad) English — it is the cited article's own page; the reel, takeaway
   notes and tags around it are bilingual.
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
     `labelDX` / `labelDY` nudge just the label (viewBox units) AFTER the
     auto-stacking, to dodge dots or tighten spacing near crowded cities.
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
        { k: 'microsoft', company: 'Microsoft', team: 'Research Asia', notes: ["Sister Clare, hope I still try new things and push myself at ur age", "Teacher J-Lei, ur thinking is always so clear, still pays off", "Boss X-Yan, every chat with u lights up a dozen new ideas", "Mate Yichi, such a joy shipping that project with u", "Buddy Xinjie, hope all is good in the US, go get that PhD soon", "Jin & Lincong, thx for letting me host the Tech Talk, unforgettable", "Josie, thx for helping me on day one and on my last day"]}
      ] },
    { city: 'Shanghai', lon: 121.4737, lat: 31.2304, side: 'right', lane: 0, label: 'up', labelDX: 36,
      logos: [
        { k: 'apple',   company: 'Apple',           team: 'APO Shanghai', notes: ["WinniQ, love ur laugh and the way u manage the team; thx for ur trust", "AlexZ, impressed by how u lead a group of 'Backstreet Boys'; respect!", "KarlD, my mentor, miss the chats we have on the subway after work", "TigerA, thx for sending me a welcome email on my onboarding day", "AlexD, my neighbor, rigorous & eco-minded (reusable bags, fantastic)", "StellaP, like the sister I never had, always remember ur kindness & beauty", "DavidL, like the brother I never had, always remember ur 'Friends' T-shirt", "ClarkX, seriously, u really need to teach me how to keep fit and handsome", "LeoW, GSM pro, and a talented designer (white envelope, warm & beautiful)", "LilyL, from BPR, miss our requirement battles, glad we didn't fight, LOL"]},
        { k: 'stealth', company: 'Stealth Startup', team: 'Early product team', notes: ["Derek, u made me Head of Everything after my first week", "Vivian, ur wireframes were chaos but they worked, every time", "Kevin, 2am deploys with u and one bag of instant noodles", "Alan, u ran support, sales and QA as one person; still don't know how", "Grace, thx for the 3pm tea; it kept the whole floor alive", "Ray, ur demo-day pitch sold our v0.1 to real users; mind blown"]}
      ] },
    { city: 'Suzhou', lon: 120.5853, lat: 31.2989, side: 'left', lane: 0, label: 'up',
      logos: [
        { k: 'apple', company: 'Apple', team: 'APO Suzhou', notes: ["AndyX, u r the 1st person I met there, thx for ur 1st treat meal", "RainyW, u r the 2nd person I met there, gosh, u look like 22", "JesseJ, u r funny, tiny, sunny, and lovely; man! u r truly a humor master", "BillH, love ur startup story; miss playing ping-pong with u, such a tie", "HelenZ, last but not least, thx for ur encouragement; ur smile is a cure"]}
      ] },
    { city: 'Hangzhou', lon: 120.1551, lat: 30.2741, side: 'left', lane: 0, label: 'down', labelDY: -14,
      logos: [
        { k: 'abc', company: 'Agricultural Bank of China', team: 'Tech Products Department, Data Analysis Department', notes: ["Tech Product Dept., our team dinners were the best times", "Data Analysis Dept., miss joking with u all in the office", "Shiyin, Bin, Yiyi, Huiyu, thx for letting me into the 176 Club, LOL"]},
        { k: 'alibaba', company: 'Alibaba', team: 'Ant Group', notes: ["Lin-Lang, thx for ur encouragement; u live life to the fullest", "Zhi-Du, ur sharing always sticks with me", "Teacher Bian, u said I'd do big things one day; thx"]}
      ] },
    { city: 'Guangzhou', lon: 113.2644, lat: 23.1291, side: 'left', lane: 0, label: 'up',
      logos: [
        { k: 'tencent', company: 'Tencent', team: 'WeChat Group', notes: ["Fellow HKU alumni, hope we get to grab dinner again"]},
        { k: 'wechat', company: 'WeChat', team: 'Open Platform Department', notes: ["Tunny, ur career path gave me so many ideas about my own", "Melody, strict mentor, better student; thx for not going easy", "Yunying, always remember ur kindness", "Nana, u love Eason's songs, ur taste is fantastic", "Annly, that blue jacket of urs was so cool", "Robin, thx for ur blueberries, they tasted really good", "Head, that big head really does hold a lot of wisdom"]}
      ] },
    { city: 'Shenzhen', lon: 114.0579, lat: 22.5431, side: 'right', lane: 0, label: 'down', labelDX: 36,
      logos: [
        { k: 'apple',  company: 'Apple',   team: 'APO Shenzhen',   notes: ["AngelY, always amused by your stories and jokes, LMAO", "BenW, u would buy me a beer when I travel to shenzhen, right?", "JeraldC, always being energetic, love that spirit, awesome", "RexB, ur philosophy on social & work has inspired me since day one", "Richard, only talked to u a few times, but u r a gentleman, I feel that"]},
        { k: 'huawei', company: 'Huawei',  team: 'Finance Group',  notes: ["Lin-Na, no airs at all; please eat ur meals on time, LOL", "Zeng-Tian, u always lift up everyone around u", "Yong-Hong, our workaholic; hope u stay till retirement, LOL", "Ge-Liang, u r as precious as the panda in ur hometown", "Fei-Hong, hope u fly even farther, just like ur name"]}
      ] },
    { city: 'Hong Kong', lon: 114.1694, lat: 22.3193, side: 'left', lane: 1, label: 'down', labelDY: -16,
      logos: [
        { k: 'stealth', company: 'Stealth Startup', team: 'HK marketplace', notes: ["Samantha, our very first seller; u still email me, and I love that", "Terence, every call with u was a class on how HK traders really talk", "Becky, our ops queen; 200 listings and zero drama, still amazed", "Oscar, u tested our checkout on ur own lunch break, seriously", "Ryan, ur PR reviews were brutal and fair; I got better fast", "Elaine, u left before launch and we still owe u dinner"]},
        { k: 'hku', company: 'HKU', team: 'Department of Computer Science', notes: ["Tony Tao, my brother in the top bunk, go get that PhD soon", "Jordan Liu, always helping out, always making us laugh", "Sophia & Irene & Vincent, group projects with u were fun and fast", "Capstone teammates, a tough project and a great time", "Prof. John, thx for guiding my final year project", "Prof. Amy, always remember ur classes, so much fun", "Prof. Paul, red envelopes at New Year; u really love ur students", "Prof. Ben, ur supply chain class still pays off every day"]}
      ] }
  ];

  /* pin = [lon, lat] on the map; card = [x, y] in the 1100x650 viewBox.
     `photos[]` = every image shot at this stop (1..n). The first one is the
     map cover; the rest only appear in the lightbox filmstrip. `place` is
     free text (nothing parses it); the current convention is
     "spot · city · province/region", e.g. West Lake · Hangzhou · Zhejiang.
     Photos live in assets/photos/travel/<folder>/ — one kebab-case folder
     per stop. The file whose name starts with `*` is the cover and must be
     listed first; the rest follow in name order (names start with the date).
     Name format: red-note sets are `date_seq.ext` — the 24-hex Xiaohongshu
     note id was stripped from every filename in v39.41 (privacy); ISO-timestamp
     sets keep their original names. Note ids still live in git history and in
     already-published Pages builds; the rename only protects future visitors.
     Hangzhou's two stops are pinned a little apart (real gap ~0.4° would
     merge their dots at this map scale). All photos are EXIF/XMP-free.
     `date` is the journal headline, free text. Discipline: a month inside
     2018–2026; it must match what the frames show (no winter label on a
     summer frame); mainland stops skip the 2020–2022 control years, Hong Kong
     being the exception; only the Jiangsu/Zhejiang/Shanghai stops may span
     months ('May – Jun 2023', 'May – Nov 2024', en dash with spaces); every
     other stop gets one month, taken from the cover photo across trips. */
  var TP = 'assets/photos/travel/';
  function tp (dir, names) {
    return names.map(function (f) { return TP + dir + '/' + f; });
  }

  var TRAVEL = [
    { photos: tp('hong-kong-victoria-park',
        ['*20260128_5.jpg', '20260128_13.jpg',
         '20260128_17.jpg', '20260128_6.jpg',
         '20260908_3.jpg', '20260908_8.jpg',
         '20260921_12.jpg', '20260921_3.jpg',
         '20260926_5.jpg']),
      date: 'Jan 2023',        place: 'Victoria Park · Causeway Bay · Hong Kong',
      note: "Causeway Bay's living room: joggers at dawn, neon after dark.",
      pin: [114.187, 22.287], card: [850, 580], tilt: 1.2 },
    { photos: tp('hangzhou-qingshan-lake',
        ['*2026-06-02T07-36-27-243Z-2.png', '2026-05-31T15-16-52-816Z-7.png',
         '2026-05-31T15-54-39-705Z-1.png', '2026-05-31T15-54-39-972Z-5.png',
         '2026-05-31T15-54-40-079Z-6.png', '2026-06-02T07-36-27-264Z-5.png',
         '2026-06-02T07-36-27-278Z-6.png']),
      date: 'May – Jun 2023',  place: 'Qingshan Lake · Hangzhou · Zhejiang',
      note: 'A sika deer standing in a pond of duckweed, completely unbothered.',
      pin: [119.73, 30.27], card: [108, 322], tilt: -1.2 },
    { photos: tp('hangzhou-west-lake',
        ['*2026-11-16T08-34-26-844Z-4.jpg', '2026-05-22T00-23-23-495Z-4.png',
         '2026-05-22T00-23-23-535Z-6.png', '2026-11-09T05-11-43-659Z-2.png',
         '2026-11-09T05-11-45-102Z-4.png', '2026-11-16T08-34-26-836Z-3.png',
         '2026-11-16T08-34-26-868Z-5.jpg', '2026-11-16T08-34-26-876Z-6.png']),
      date: 'May – Nov 2024',  place: 'West Lake · Hangzhou · Zhejiang',
      note: 'I keep going back. It keeps changing.',
      pin: [120.30, 30.20], card: [890, 62], tilt: 1.6 },
    { photos: tp('xiamen-botanical-garden',
        ['*20260707_1.jpg', '20260423_3.jpg',
         '20260627_2.jpg', '20260627_4.jpg',
         '20260627_9.jpg', '20260707_10.jpg',
         '20260707_11.jpg', '20260707_12.jpg',
         '20260707_5.jpg', '20260805_3.jpg',
         '20260805_4.jpg', '20260805_5.jpg',
         '20261009_6.jpg', '20261010_1.jpg',
         '20261010_17.jpg', '20261010_18.jpg',
         '20261010_7.jpg', '20261029_3.jpg',
         '20261029_4.jpg']),
      date: 'Jul 2024',        place: 'Xiamen Botanical Garden · Xiamen · Fujian',
      note: 'Succulents the size of trees, and hill fog that never fully lifted.',
      pin: [118.096, 24.487], card: [1012, 452], tilt: -1.4 },
    { photos: tp('beijing-national-botanical-garden',
        ['*20261003_8.jpg', '20260226_4.jpg',
         '20260226_5.jpg', '20260821_16.jpg',
         '20260821_5.jpg', '20261003_13.jpg',
         '20261023_10.jpg', '20261023_12.jpg',
         '20261023_13.jpg', '20261023_4.jpg',
         '20261111_2.jpg', '20261111_7.jpg']),
      date: 'Oct 2024',        place: 'National Botanical Garden · Haidian · Beijing',
      note: 'Pines up top, ginkgo turning gold behind them, city noise somewhere past the hill.',
      pin: [116.20, 39.99], card: [586, 48], tilt: 1.3 },
    { photos: tp('xinjiang-sayram-lake',
        ['*20260624_3.jpg', '20250715_2.jpg',
         '20250715_3.jpg', '20260624_2.jpg',
         '20260703_10.jpg', '20260703_12.jpg',
         '20260709_2.jpg', '20260709_5.jpg',
         '20260821_1.jpg', '20260829_1.jpg',
         '20260829_13.jpg', '20260829_7.jpg']),
      date: 'Jun 2025',        place: 'Sayram Lake · Bortala · Xinjiang',
      note: 'Blue so deep it looks edited. Spruce, wind, and a shoreline you cannot walk around.',
      pin: [81.15, 44.60], card: [178, 80], tilt: -1.4 },
    { photos: tp('guangzhou-botanical-garden',
        ['*20261115_2.jpg', '20260928_10.jpg',
         '20260928_2.jpg', '20260928_5.jpg',
         '20260929_6.jpg', '20261104_6.jpg',
         '20261104_7.jpg', '20261107_6.jpg',
         '20261107_7.jpg', '20261115_15.jpg',
         '20261115_16.jpg', '20261115_4.jpg',
         '20261115_9.jpg']),
      date: 'Nov 2025',        place: 'South China National Botanical Garden · Guangzhou · Guangdong',
      note: 'Ten thousand plants under one big humid sky. The greenhouse was a mercy.',
      pin: [113.552, 23.188], card: [178, 578], tilt: 1.4 },
    { photos: tp('shanghai-century-park',
        ['*20261025_3.jpg', '20260926_3.jpg',
         '20261022_13.jpg', '20261022_2.jpg',
         '20261022_4.jpg', '20261022_8.jpg',
         '20261022_9.jpg', '20261025_10.jpg',
         '20261025_13.jpg', '20261025_8.jpg',
         '20261111_2.jpg', '20261111_3.jpg']),
      date: 'Sep – Nov 2026',  place: 'Century Park · Pudong · Shanghai',
      note: "The one green page in the middle of Pudong's glass towers.",
      pin: [121.556, 31.221], card: [1010, 232], tilt: -1.6 }
  ];

  var LB_SUFFIX = 'Travel Journals';   // 03 / 08 Travel Journals

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
      'tagline.tags':  'Every tag here is a problem I actually closed.',
      'tagline.text':  'These texts are my input; practice is where they end up.',
      'text.take':  'Takeaway',
      'text.tags':  'Tags',
      'text.reel':  'Article reel',
      'hobby.0': 'Outdoor Picnic',         'hobby.1': 'Forest Tennis',
      'hobby.2': 'Weekend Hiking',         'hobby.3': 'Feeling Alive',
      'hobby.4': 'Boating with Friends',   'hobby.5': 'Tennis Practice',
      'hobby.6': 'Cycling with Friends',   'hobby.7': 'Film Photography',
      'hobby.8': 'Hiking with Friends',    'hobby.9': 'Watching the Sunset',
      'hobby.10': 'Weekend Drives',        'hobby.11': 'Forest Jogging',
      'talent.0.title':  'Solving the problems worth solving',
      'talent.0.body':  'Hard problems are uncomfortable by nature, but in the AI era easy tasks are the first to be replaced. As the projects piled up, I started volunteering for the difficult ones that were critical to the team. I try to understand them, break them down and close them one by one, so the business can actually move.',
      'talent.0.case': 'On [Simi-Part](#simipart) there were no labels for 2,260 small parts, and a screw in a phone looked nothing like the same screw in a laptop on paper. I encoded geometry, process and material into part embeddings, then grouped look alikes with nearest neighbour search. One M1.6 screw turned up under four part numbers with three different quotes, which became a negotiation list.',
      'talent.1.title': 'Business first, AI second',
      'talent.1.body': "I come from a technical background, but I have never treated the business as someone else's job. AI/ML skills are my strengths, and they are **enablers, not outcomes**. I put **business first**, learn how it actually works, and use AI only on the few steps where it matters, so the organisation grows with AI rather than being replaced by it.",
      'talent.1.case': '[Factory Flow](#factoryflow) started with a plain problem. CM data lived in too many systems and internal teams kept their own sheets. Before any model, I aligned part and order codes, recorded where every field came from, and built one shared data lake. Only then did anomaly detection and recovery plans mean anything, and the on site OPM team could run the FATP floor from a single view.',
      'talent.2.title': 'Getting stakeholders to the same table',
      'talent.2.body': 'Most of my projects cut across teams and companies, with internal and external stakeholders who define success differently. Before any negotiation I work out what the project is worth to each of them, make the compromises explicit, and balance the needs instead of pushing just one side.',
      'talent.2.case': 'On [Credit Pulse](#creditpulse), a higher AUC meant little if policy, compliance and branch teams would not act on it. I sat with risk modelling, lending policy, compliance and branch managers. Model accuracy called for more features, compliance needed a reason code on every decline and repricing, and branches wanted fewer manual reviews. I wrote down what each side would gain and give up, then agreed on fairness checks per segment, reason codes and a human review threshold. Only after that did default probability, top factors and pricing bands become a plan all four sides could sign off.',
    },
    zh: {
      'tagline.teams':  '生活过的城市，同行过的团队。',
      'tagline.travel': '在寻常日子里，看见美。',
      'tagline.time':  '爱好，和我为之付出的时间。',
      'tagline.talent': '不是天生有才；本事都是在项目里历练出来的。',
      'tagline.tags':  '每一个标签背后，都是一个被我解决的问题。',
      'tagline.text':  '这些文章是我的输入，实践是它们的去处。',
      'text.take':  '要点摘录',
      'text.tags':  '关键词',
      'text.reel':  '文章轮盘',
      /* Hobby captions stay English in both modes: only the tagline is translated. */
      'hobby.0': 'Outdoor Picnic',         'hobby.1': 'Forest Tennis',
      'hobby.2': 'Weekend Hiking',         'hobby.3': 'Feeling Alive',
      'hobby.4': 'Boating with Friends',   'hobby.5': 'Tennis Practice',
      'hobby.6': 'Cycling with Friends',   'hobby.7': 'Film Photography',
      'hobby.8': 'Hiking with Friends',    'hobby.9': 'Watching the Sunset',
      'hobby.10': 'Weekend Drives',        'hobby.11': 'Forest Jogging',
      'talent.0.title':  '敢啃值得啃的难题',
      'talent.0.body':  '做难事很折磨人，但在 AI 时代，只会做简单任务的人最先被替代。项目越做越多，我开始主动接那些棘手、对团队又真正要紧的事：先想明白，再拆开，逐个解决，最后推动业务往前走。',
      'talent.0.case':  '做 [Simi-Part](#simipart) 时，2,260 个小部件没有任何标注，手机上的一颗螺丝和笔记本里的同一颗，在台账上完全是两回事。我把几何、工艺和材质编码成料件向量，再用近邻检索把长得像的归到一起。同一颗 M1.6 螺丝挂在四个不同的料号下，报价来自三家供应商，最后整理成一张可以直接去谈的清单。',
      'talent.1.title': '业务在前，AI 在后',
      'talent.1.body':  '我是技术出身，但从不觉得业务是别人的事。AI/ML 是我的长项，但它们是**手段，不是结果**。我始终秉持**业务优先**的理念，先把业务琢磨透，再用 AI 改进真正值得改的环节，让团队借着 AI 把业务做大，而不是被 AI 取代。',
      'talent.1.case':  '[Factory Flow](#factoryflow) 的起点其实很平常：CM 工厂的数据散在多个系统里，内部各团队还各有一套表格。做模型之前，我先统一料号与工单号、写清每个字段从哪来、把数据汇到一处，之后异常识别和恢复计划才真正派得上用场，驻厂 OPM 也终于能在一个页面里管住整条 FATP 产线。',
      'talent.2.title': '把多方拉到同一张桌上',
      'talent.2.body':  '我经手的项目大多横跨团队和公司，内外部利益相关者对「做成」各有各的定义。每次谈判或合作前，我先想清楚这件事对每一方各有什么价值，再把取舍摊开讲清楚，平衡多方需求，而不是只顾一头。',
      'talent.2.case':  '做 [Credit Pulse](#creditpulse) 时，AUC 再高，如果信贷政策、合规和分行不买账，模型也落不了地。我要同时跟风控建模、信贷政策、合规和分行客户经理对齐：模型想多加特征，合规要求每笔拒绝与重定价都能给出理由码，分行不希望人工复核挤占客户沟通时间。我把各方的取舍逐条写清，最后定下按客群校验公平性、每笔输出理由码、超过阈值转人工复核，违约概率、主要因子和定价分档这才成了四方都愿意签字的方案。'
    }
  };
  var SECTION_LABELS = {
    teams:  { en: 'Teams',  zh: '团队' },
    travel: { en: 'Travel', zh: '旅途' },
    time:   { en: 'Time',   zh: '爱好' },
    talent: { en: 'Talent', zh: '本领' },
    tags:   { en: 'Tags',   zh: '标签' },
    text:   { en: 'Text',   zh: '文章' }
  };
  var SECTION_IDS = ['teams', 'travel', 'talent', 'time', 'tags', 'text'];

  /* Time: two counter-moving marquees (row 2 is row 1 reversed).
     Real photos live in assets/photos/time/; every file name is a plain,
     literal caption of the moment and is reused verbatim under the tile,
     so a caption can never drift away from its picture. */
  var HOBBIES = [
    { key: 'hobby.0',  img: 'assets/photos/time/outdoor-picnic.jpg' },
    { key: 'hobby.1',  img: 'assets/photos/time/forest-tennis.jpg' },
    { key: 'hobby.2',  img: 'assets/photos/time/weekend-hiking.jpg' },
    { key: 'hobby.3',  img: 'assets/photos/time/feeling-alive.jpg' },
    { key: 'hobby.4',  img: 'assets/photos/time/boating-with-friends.jpg' },
    { key: 'hobby.5',  img: 'assets/photos/time/tennis-practice.jpg' },
    { key: 'hobby.6',  img: 'assets/photos/time/cycling-with-friends.jpg' },
    { key: 'hobby.7',  img: 'assets/photos/time/film-photography.jpg' },
    { key: 'hobby.8',  img: 'assets/photos/time/hiking-with-friends.jpg' },
    { key: 'hobby.9',  img: 'assets/photos/time/watching-the-sunset.jpg' },
    { key: 'hobby.10', img: 'assets/photos/time/weekend-drives.jpg' },
    { key: 'hobby.11', img: 'assets/photos/time/forest-jogging.jpg' }
  ];
  /* Talent: three photo-backed cards. The images are byte-identical copies
     of the uploaded originals; fading + blur happen in CSS, not in the file. */
  var TALENTS = [
    { img: 'assets/photos/talent-01.png' },
    { img: 'assets/photos/talent-02.png' },
    { img: 'assets/photos/talent-03.png' }
  ];

  /* Text: the reading reel. Each entry is a REFERENCE to a real article
     (published 2024 or later) — never a copy: the iPad screen shows a short
     English digest (deck + quote + my summary) and links out to the source.
     Fields: t/tzh  title (drum shows tzh in Chinese mode; the screen always
     shows the English t, it is the citation itself) · src/host/url  source
     chip, host shown on the read-out link, and the original URL ·
     d/dz  display date (en/zh; year-only where the exact month could not be
     verified — refine when curating) · quote  short verbatim line used as a
     pull-quote, '' for none · lead  deck sentence · body  digest paragraphs
     (English, they live inside the article frame) · note{en,zh}  TAKEAWAY
     notes — my own golden-line / key-point notes, translated · tags{en,zh}
     keyword chips, translated. Reel order = array order, newest first.
     Sources: McKinsey / BCG / Deloitte / WEF / HBR / MIT SMR / arXiv. */
  var TEXTS = [
    { t: 'Design Your Supply Chain as a Portfolio of Options',
      tzh: '把供应链设计成一份期权组合',
      src: 'Harvard Business Review', host: 'hbr.org', url: 'https://hbr.org/2026/11/design-your-supply-chain-as-a-portfolio-of-options',
      d: 'Nov 2026', dz: '2026年11月',
      quote: 'You need to be able to defer investments, quit unfavorable positions, expand in promising regions, and shift operations as policies evolve.',
      lead: 'Treats supply chain design as a portfolio of real options once tariff and policy swings make single long bets dangerous.',
      body: ['Deferred capital commitments, regional dual-sourcing and pre-agreed exit rights turn the network into a set of living contracts instead of one fixed build-out.',
             'The frame pairs naturally with digital visibility: an option you cannot see, you cannot exercise.',
             'Tariff whiplash and policy drift are the backdrop — the article is written for networks that can no longer afford one-shot, fifteen-year build decisions.',
             'Exercise discipline is the missing muscle: options only pay when someone owns the trigger, the budget and the review cadence.',
             'The economics are option pricing, renamed: what you spend to keep choices open is a premium, judged against the loss it prevents — not against a fixed ROI.',
             'Implementation leans on live network data — landed cost, lead time, supplier exposure — because every option in the portfolio needs a trigger someone can actually monitor.',
             'The article\'s quiet audience is the CFO: every option discussed carries a price tag — dual-sourcing premiums, idle capacity, pre-negotiated exit fees — which is exactly what makes the argument fundable.',
             'Review cadence matters as much as the options themselves: policy moves in election cycles, so an option book revisited once a year is already stale when it lands.',
             'What the article deliberately avoids: forecasting. Scenarios stay probability-weighted inputs to option sizing, never the plan itself.',
             'For digital teams the implication is concrete — the telemetry that prices each option (exposure, lead time, switching cost) is the same telemetry a control-tower project builds anyway.'],
      note: { en: ['An option you cannot price is an option you will not buy — visibility first, flexibility second.',
                   'Flexibility is a portfolio: defer, quit, expand, shift — four verbs, not one grand plan.',
                   'Buy options where lead time is long: the premium buys the one quarter you could not otherwise get.',
                   'Ownerless options get abandoned — a trigger without a named owner is just a slide.'],
              zh: ['看不明值的期权没人敢买——先有可视性，再谈柔性。',
                   '柔性是一个组合：推迟、退出、扩张、迁移，四个动作，而不是一张大计划。',
                   '长交期的地方才值得买期权：权利金买的是本来根本拿不到的那一个季度。',
                   '没有归属的期权最后都会被放弃——只有触发器没有 owner，就只是一页 PPT。'] },
      tags: { en: ['Supply Chain Strategy', 'Scenario Planning', 'Resilience', 'Real Options', 'Tariff Strategy', 'Sourcing Flexibility', 'Capacity Planning'],
              zh: ['供应链战略', '情景规划', '韧性', '实物期权', '关税策略', '采购柔性', '产能规划'] },
      glance: ['HBR strategy article · Nov 2026', 'Network design under policy volatility', 'Real-option economics applied to supply chains'],
      readfor: 'the four-option vocabulary — defer, quit, expand, shift — and the discipline of naming triggers and owners.' },
    { t: 'Industrial Agentic AI: LLM-Driven New-Generation Agents for Smart Manufacturing',
      tzh: '工业智能体 AI：LLM 驱动的新一代智能制造智能体',
      src: 'arXiv', host: 'arxiv.org', url: 'https://arxiv.org/abs/2610.26941',
      d: 'Oct 2026', dz: '2026年10月',
      quote: 'Dynamic environments, complex physical constraints, and stringent reliability requirements hinder the direct deployment of general-purpose agents in smart manufacturing.',
      lead: 'A systematic survey of LLM-driven industrial agents: five deployment challenges, one taxonomy, a four-layer architecture for closed-loop execution.',
      body: ['General-purpose agents cannot simply be dropped onto a factory floor; the paper argues a dedicated industrial stack is needed where constraints and reliability drive the design.',
             'It maps representative applications across the industrial lifecycle and grades capability from assist up to autonomous.',
             'Five deployment challenges — grounding, constraints, reliability, latency and safety — anchor the survey and double as an evaluation checklist.',
             'Its four-layer stack (foundation models, agent framework, industrial tools, execution loop) maps cleanly onto real MES/PLM integration paths.',
             'Tool use and memory get treated as first-class industrial problems: agents call MES/PLM/CMMS functions inside permission envelopes, not free-form APIs.',
             'Open problems close the survey: simulation-to-reality transfer, multi-agent coordination on the line, and certification of autonomous decisions.',
             'Safety appears structurally rather than as a closing chapter: guardrails, rollback paths and human release points sit inside the architecture itself, not on a deployment checklist.',
             'For practitioners the implicit conclusion is workable: research is converging on architecture while still diverging on evaluation — compare vendors by stack layer, not benchmark claim.',
             'Evaluation stays unglued from chat scores: the surveyed benchmarks lean on task completion under constraints, not fluency.',
             'For buyers the takeaway is blunt — ask vendors which layer of the stack they actually cover; most decks claim four and ship one.'],
      note: { en: ['The gap between a demo agent and a floor agent is physical constraints and reliability, not model size.',
                   'Capability levels beat the old debate: stop arguing full autonomy vs useless, climb the ladder instead.',
                   'Use the five challenges as a procurement checklist before any agent pilot signs off.',
                   'Taxonomy matters less than the loop: agents earn their keep in closed-loop execution, not in chat.'],
              zh: ['演示智能体和产线智能体的差距，在物理约束与可靠性，不在模型参数量。',
                   '能力分级取代了老争论：别再说全自动或没用，逐级往上走。',
                   '任何智能体试点立项前，先拿五大挑战当采购清单过一遍。',
                   '分类学不重要，闭环才重要：智能体的价值在闭环执行，不在聊天。'] },
      tags: { en: ['Agentic AI', 'LLM Agents', 'Smart Manufacturing', 'Survey', 'Grounding', 'Reliability', 'Closed-Loop Execution'],
              zh: ['智能体 AI', 'LLM 智能体', '智能制造', '综述', '语义落地', '可靠性', '闭环执行'] },
      glance: ['Academic survey · arXiv, Oct 2026', 'LLM-driven agents across the industrial lifecycle', 'Challenge taxonomy + four-layer architecture'],
      readfor: 'the five deployment challenges — a ready-made pilot checklist.' },
    { t: 'Intent-Driven Smart Manufacturing Integrating Knowledge Graphs and Large Language Models',
      tzh: '意图驱动的智能制造：知识图谱 × 大语言模型',
      src: 'arXiv', host: 'arxiv.org', url: 'https://arxiv.org/abs/2602.12419',
      d: 'Feb 2026', dz: '2026年2月',
      quote: 'These models are semantically mapped to a Neo4j-based knowledge graph grounded in the ISA-95 standard, ensuring operational alignment with manufacturing processes, resources, and constraints.',
      lead: 'A fine-tuned LLM turns natural-language intent into structured requirement models, then grounds them on an ISA-95 knowledge graph.',
      body: ['The split of labor is the point: language goes to the model, shop-floor semantics go to the graph, and a JSON schema is the contract between them.',
             'Once the output is structured, fine-tuning beats zero- and few-shot baselines by a wide margin (89.33% exact match).',
             'ISA-95 gives the graph its shop-floor vocabulary — process, resource, constraint — so requirements land on things the plant actually has.',
             'Evaluation compares zero-shot, few-shot and fine-tuned runs; the structured-output gap widens exactly where naive prompting collapses.',
             'A request like "reroute after supplier Y outage" is compiled into entities and constraints the graph checks against reality before anything executes.',
             'Failure modes shift from hallucinated prose to unmet constraints — exactly the kind of error a plant can route, log and fix.',
             'Graph maintenance is the honest cost: the reported accuracy assumes a curated ISA-95 graph, and the update discipline behind it is the real operational burden of the whole pattern.',
             'The recipe transfers even without Neo4j — constrain the schema, fine-tune on templated outputs, and let the ontology absorb the ambiguity the model cannot.',
             'The dataset construction is as interesting as the model: requirement statements were templated from real ISA-95 entities, keeping supervision in-distribution.',
             'It is a small, clear instance of the pattern this reel keeps circling — generative on top, deterministic underneath.'],
      note: { en: ['The LLM drafts, the graph checks — schema-constrained output on a standards-backed ontology is the reliable pairing.',
                   'A JSON requirement model you can validate beats fluent prose you cannot.',
                   'Grounding is a schema problem before it is a model problem — write the contract first.',
                   'Fine-tuning pays off the day your output has to be parsed, not admired.'],
              zh: ['LLM 负责起草，图谱负责校验：模式约束的输出 + 标准本体，才是靠谱组合。',
                   '可校验的 JSON 需求模型，胜过漂亮但没法验证的长文。',
                   '落地先是模式（schema）问题，再才是模型问题——先把合同写出来。',
                   '当输出必须被机器解析而不是被人欣赏时，微调就开始回本了。'] },
      tags: { en: ['Knowledge Graph', 'LLM Fine-Tuning', 'ISA-95', 'Intent-Driven', 'Neo4j', 'Schema Contract', 'Requirement Modeling'],
              zh: ['知识图谱', 'LLM 微调', 'ISA-95 标准', '意图驱动', 'Neo4j', '模式契约', '需求建模'] },
      glance: ['Technical paper · arXiv, Feb 2026', 'Fine-tuned LLM + Neo4j graph on ISA-95', '89.33% exact-match structured requirement extraction'],
      readfor: 'the JSON-schema contract between model and graph — the part you can reuse on Monday.' },
    { t: 'Digital Twin AI: Opportunities and Challenges from Large Language Models to World Models',
      tzh: '数字孪生 AI：从大语言模型到世界模型',
      src: 'arXiv', host: 'arxiv.org', url: 'https://arxiv.org/abs/2601.01321',
      d: 'Jan 2026', dz: '2026年1月',
      quote: '',
      lead: 'A four-stage framework — model, mirror, intervene, autonomously manage — mapping exactly where AI enters the digital-twin lifecycle.',
      body: ['Autonomy is the frontier where LLMs, foundation models and agents show up; most factories still live in the modeling and mirroring stages.',
             'With generative and world models, twins turn proactive: reasoning, communicating, and generating scenarios instead of replaying dashboards.',
             'The four stages give buyers a way to ask vendors a sharper question than "is this a twin?" — namely: which stage, honestly?',
             'World models are framed as the next leap: twins that simulate consequences before the plant pays for them.',
             'Data plumbing decides the stage you can actually reach: streaming quality gates mirror, mirror quality gates intervention — no matter how good the models are.',
             'Twin maturity ties to concrete AI capabilities: retrieval over twin state, generative scenario building, agentic control under human release.',
             'Most plants stall at mirror: the dashboard replays state, but nobody can yet say what the twin would change — which is precisely the intervene question the framework turns on.',
             'Read alongside the agent surveys above, a timeline emerges: the twin becomes the grounded world-model layer that agents eventually act through.',
             'Intervene is where ROI concentrates: what-if simulation and closed-loop adjustment reuse the same mirror, so early data decisions compound.',
             'Autonomy remains mostly research — the paper is candid that agent-managed lines are demonstrations, not operations.'],
      note: { en: ['Most "digital twins" on the market stop at model + mirror — value and difficulty both sit in intervene + autonomy.',
                   'Plan the twin roadmap together with the AI maturity curve, or the twin becomes an expensive 3D dashboard.',
                   'Ask "which stage?" — most vendor twins cannot pass mirror, and real value starts at intervene.',
                   'A twin that cannot intervene is a BI dashboard with physics.'],
              zh: ['市面上多数数字孪生止步于建模与映射——价值与难度都集中在干预和自治两段。',
                   '孪生路线图要和 AI 成熟度一起规划，否则孪生沦为昂贵的三维大屏。',
                   '先问「到哪一级了」——多数供应商的孪生连映射都过不了，而真价值从干预开始。',
                   '不能干预的孪生，只是一个带物理引擎的 BI 大屏。'] },
      tags: { en: ['Digital Twin', 'World Models', 'LLM', 'Smart Factory', 'Simulation', 'Predictive Maintenance', 'Four-Stage Framework'],
              zh: ['数字孪生', '世界模型', 'LLM', '智能工厂', '仿真', '预测性维护', '四阶段框架'] },
      glance: ['Survey paper · arXiv, Jan 2026', 'Model → mirror → intervene → autonomously manage', 'World models framed as the next twin leap'],
      readfor: 'the four-stage ladder — then locate your own twin honestly on it.' },
    { t: 'Powering supply chain with agentic AI',
      tzh: '用智能体 AI 驱动供应链',
      src: 'McKinsey & Company', host: 'mckinsey.com', url: 'https://www.mckinsey.com/capabilities/operations/our-insights/powering-supply-chain-with-agentic-ai',
      d: '2025', dz: '2025年',
      quote: 'Agentic AI in supply chain can help companies move from isolated use cases to coordinated execution across people, processes, and technology.',
      lead: 'How agentic AI moves supply chains past scattered point-solution pilots into coordinated end-to-end execution.',
      body: ['Value appears when agents cross functional borders — planning, sourcing and logistics acting as one loop — not when another copilot is added.',
             'The practical emphasis sits on data foundations and human oversight around anything that writes back to systems.',
             'The orchestration layer gets the detail: shared context, memory and guardrails that let agents hand work to each other without a human in every loop.',
             'Governance is treated as plumbing rather than policy — approval tiers and audit trails designed alongside the agents, not bolted on.',
             'Use cases ladder from sensing (demand and risk signals) to deciding (replanning, re-quoting) to acting (PO changes, rerouting) — with the human release point moving up as trust grows.',
             'The enabler list reads like a platform backlog: shared supplier/item masters, event streaming, agent identity, per-agent audit logs.',
             'The oversight model is deliberately conservative — agents draft, humans release the write-back — the reverse of most vendor pitches, and closer to what audits actually permit.',
             'Its soft spot is sequencing: nearly every function gets equal attention, while real programs need one first domain, usually planning, where the data already lives.',
             'It flags organizational debt as the real limiter: agents pointed at broken master data just automate the mess faster.',
             'A rough maturity picture emerges: sensing agents ship today, deciding agents pilot, acting agents stay gated behind auditors.'],
      note: { en: ['Point solutions stack cost; coordinated execution stacks value.',
                   'An agent story in supply chain is a governance story first: who approves, who rolls back, who owns the outcome.',
                   'Design the handoffs, not the headcount: agent value shows up in the seams between functions.',
                   'Guardrails are features: every autonomous write-back needs a rollback path before it needs a KPI.'],
              zh: ['点状方案堆的是成本，协同执行堆的才是价值。',
                   '供应链上的智能体，先得讲治理：谁审批、谁回滚、结果归谁。',
                   '设计的是交接，不是编制：智能体的价值出现在职能之间的缝隙里。',
                   '护栏是功能不是合规：每次自动写回，先有回滚路径，再谈 KPI。'] },
      tags: { en: ['Agentic AI', 'Supply Chain Execution', 'Digitalization', 'Governance', 'Orchestration', 'Human Oversight', 'Data Foundation'],
              zh: ['智能体 AI', '供应链执行', '数字化', '治理', '智能体编排', '人类监督', '数据底座'] },
      glance: ['McKinsey insight · 2025', 'End-to-end supply-chain execution with agents', 'Orchestration, data foundation, human oversight'],
      readfor: 'the line between stacked point solutions and coordinated execution.' },
    { t: 'Unlocking the Value Potential of AI',
      tzh: '释放 AI 的价值潜力',
      src: 'BCG Executive Perspectives', host: 'bcg.com', url: 'https://www.bcg.com/assets/2025/executive-perspectives-unlocking-the-value-of-ai-in-manufacturing-30june.pdf',
      d: 'Jun 2025', dz: '2025年6月',
      quote: '',
      lead: "BCG's manufacturing edition on turning AI potential into real profit through widespread implementation, with agents doing much of the work.",
      body: ['2025 framed as the year AI moves from pilots to the profit line, with manufacturing as prime territory for that shift.',
             "Written as answers to leaders' questions: where to invest first, how to sequence, how to measure the payoff.",
             'Agents doing much of the execution work reframes the operating model: fewer copilots, more supervised workflows that run end to end.',
             'The measurement advice is blunt — define the P&L line each deployment moves, or call it research.',
             'It warns against pilot purgatory: dozens of approved experiments, no scaled P&L — the fix is portfolio discipline with two or three bets that carry whole workflows.',
             'Talent reframing comes up again and again: fewer hand-built integrations, more orchestration of agent fleets supervised by domain operators.',
             'The manufacturing chapter leans on measurability: yield, downtime and OEE give AI\'s contribution a baseline the CFO can audit within a quarter, not a fiscal year.',
             'Its portfolio advice echoes what this reel keeps seeing: two or three scaled workflows beat a showroom of pilots on learning speed and P&L alike.',
             'Sequencing advice: one value stream end to end, then replicate — breadth arrives through copies, not parallel pilots.',
             'Governance is treated as speed, not brakes: clear ownership is what lets a deployment move without being re-litigated.'],
      note: { en: ['Pilot-to-profit is the whole argument — budgets now follow deployed workflows, not experiments.',
                   'Manufacturing sits where AI pays best: dense workflows and baselines you can actually measure.',
                   'Deployed workflow is the unit of account now — pilots are marketing, workflows are bookings.',
                   'Sequence beats breadth: one end-to-end workflow outscores ten point solutions on any honest dashboard.'],
              zh: ['从试点到利润就是全部命题——预算开始跟着已部署的流程走，不再跟着实验走。',
                   '制造业恰好在 AI 回报最厚的位置：流程密、基线清楚、算得出来。',
                   '现在算账的单位是「已部署的流程」——试点是市场费用，流程才是收入。',
                   '纵深胜过铺摊子：一条端到端流程，胜过十个点状方案。'] },
      tags: { en: ['Manufacturing AI', 'AI ROI', 'Agentic AI', 'Implementation', 'Pilot to Profit', 'Operating Model', 'Value Measurement'],
              zh: ['制造业 AI', 'AI 投资回报', '智能体 AI', '落地', '从试点到利润', '运营模式', '价值度量'] },
      glance: ['BCG executive perspectives PDF · Jun 2025', '2025: pilots move to the profit line', 'Agents take much of the execution work'],
      readfor: 'the P&L-line test every AI deployment should be asked to pass.' },
    { t: 'The agentic supply chain in manufacturing',
      tzh: '制造业中的智能体供应链',
      src: 'Deloitte Insights', host: 'deloitte.com', url: 'https://www.deloitte.com/us/en/insights/industry/manufacturing-industrial-products/agentic-supply-chain-artificial-intelligence-manufacturing.html',
      d: '2025', dz: '2025年',
      quote: 'Agentic AI — systems that can reason, plan, and act with autonomy — can offer manufacturers transformative solutions for building more resilient, responsive supply chains.',
      lead: '"Resilient by design": reasoning, planning agents as the tool for manufacturers that must absorb shocks continuously.',
      body: ['Resilience is reframed from a stock-buffer question into a decision-speed question, and adoption data already shows it accelerating.',
             'The paper pairs risk management with new sources of value — cost defense alone undersells what agents do.',
             'Shocks are treated as the steady state: the goal shifts from avoiding disruption to absorbing it continuously, faster than competitors can react.',
             'Maturity data shows most manufacturers still in assist-and-augment territory, with autonomy gated by trust and auditability.',
             'A reference architecture appears: an event-level data spine, an agent runtime with guardrails, and decision workflows that keep humans on exceptions and approvals.',
             'The economics argument: value compounds as agents share context — one disruption signal feeds sourcing, planning and customer comms at the same time.',
             'The maturity data is careful with the word autonomy: most deployments stay human-released, with the agent owning the analysis rather than the commit.',
             'The resilience argument quietly indicts the safety-stock mindset — buffer inventory is capital frozen against yesterday\'s risk profile.',
             'The shock classes — supplier failure, logistics chokepoint, demand whipsaw, geopolitical step — each map to the agent decisions they most need.',
             'Implementation stays unglamorous: event instrumentation first; agents over batch data just decide on stale inputs faster.'],
      note: { en: ['Resilience has moved from "how much stock" to "how fast we decide" — exactly agent territory.',
                   'Reason, plan, act: an agent that only does the first one is a dashboard with better copy.',
                   'Resilience budgets are moving from warehouses into decision loops — same money, different asset.',
                   'Trust is the gating item: auditability, not model quality, decides when autonomy ships.'],
              zh: ['韧性从「备多少库存」变成「决策多快」——这正是智能体的地盘。',
                   '会推理、会规划、会行动：只做第一件的智能体，只是文案更好看的大屏。',
                   '韧性的预算正从仓库挪进决策回路——同样的钱，买不同的资产。',
                   '卡脖子的是信任：决定自治何时上线的是可审计性，不是模型指标。'] },
      tags: { en: ['Agentic AI', 'Supply Chain Risk', 'Manufacturing', 'Resilience', 'Decision Speed', 'Shock Absorption', 'Agentic Maturity'],
              zh: ['智能体 AI', '供应链风险', '制造业', '韧性', '决策速度', '冲击吸收', '智能体成熟度'] },
      glance: ['Deloitte Insights article · 2025', 'Resilient by design framing', 'Backed by adoption maturity data'],
      readfor: 'the reframe: resilience as decision speed, not stock depth.' },
    { t: 'Physical AI: Powering the New Age of Industrial Operations',
      tzh: '物理 AI：开启工业运营新时代',
      src: 'World Economic Forum', host: 'weforum.org', url: 'https://reports.weforum.org/docs/WEF_Physical_AI_Powering_the_New_Age_of_Industrial_Operations_2025.pdf',
      d: '2025', dz: '2025年',
      quote: 'The paper explores how physical AI is reshaping operations, enabling new forms of human-machine collaboration and unlocking productivity at scale.',
      lead: 'WEF on physical AI — models embodied in robots and industrial systems — powering the next industrial operating age.',
      body: ['Built on running manufacturer use cases and transformation journeys rather than lab demos, with robotics makers and academic experts in the room.',
             'The differentiator is embodiment: models acting through machines under hard safety constraints.',
             'Physical AI stacks perception, planning and control onto embodied machines, so the constraint moves from "can the model reason" to "can the line tolerate it".',
             'Case studies point to flexible automation as the early ROI — cells that re-task in hours instead of quarters.',
             'Foundation models meet the shop floor through a stack of sim-to-real training, fleet learning and staged autonomy, with safety cases gating each release.',
             'The workforce framing avoids the replacement narrative: operators supervise fleets of semi-autonomous machines, and maintenance becomes the scarce skill.',
             'Fleet learning is the compounding mechanism: a fix proven on one cell becomes every cell\'s lesson overnight, and that is where the operating leverage actually hides.',
             'The honest limit inside the report: running cases cluster around pick, place and inspect — fine-manipulation autonomy remains laboratory territory.',
             'Cost curves matter: camera-plus-model stacks dropped automation\'s entry price below where the business case used to stall.',
             'Interoperability is the quiet enabler — machines still speak industrial protocols, and the AI layer has to meet them there.'],
      note: { en: ['The moat in physical AI is the physical half: embodiment, safety certification, maintenance — software teams keep underestimating it.',
                   'Reads as a workbench, not a forecast: every claim sits on a factory that is actually running it.',
                   'Flexible automation is the ROI story: re-tasking time is a number the CFO can feel.',
                   'Safety cases are the new integration effort — schedule certification like a go-live, not paperwork after.'],
              zh: ['物理 AI 的护城河在物理那半边：具身、安全认证、维护——软件团队总在低估这块。',
                   '这份报告是工作台不是预言：每个判断都压在一条真跑着的工厂用例上。',
                   '柔性自动化才是早期 ROI：换型时间是个 CFO 有感知的数字。',
                   '安全论证就是新的集成工程——认证要像上线一样排期，不能事后补文档。'] },
      tags: { en: ['Physical AI', 'Robotics', 'Industrial Operations', 'Human-Machine Collaboration', 'Embodied AI', 'Flexible Automation', 'Safety Certification'],
              zh: ['物理 AI', '机器人', '工业运营', '人机协作', '具身智能', '柔性自动化', '安全认证'] },
      glance: ['WEF report PDF · 2025', 'Physical AI — models embodied in machines', 'Live manufacturer use cases + expert panel'],
      readfor: 'the embodiment constraint: what the line can tolerate, not just what the model can do.' },
    { t: 'Delivering the agentic supply chain',
      tzh: '落地智能体供应链',
      src: 'McKinsey Operations Blog', host: 'mckinsey.com', url: 'https://www.mckinsey.com/capabilities/operations/our-insights/operations-blog/delivering-the-agentic-supply-chain',
      d: '2025', dz: '2025年',
      quote: 'From planning to execution, agentic AI could close the stubborn technology gaps that impede supply chain performance.',
      lead: 'A delivery view of the agentic supply chain: closing the stubborn technology gaps between planning and execution.',
      body: ['Names the gaps out loud — disconnected systems, and the missing action layer between insight and the transactional core — and puts agents as connective tissue.',
             '"Delivering" is the operative word: architecture and operating model, not another capability demo.',
             'The action layer between insight and the ERP/MES core gets the most airtime — the part most AI roadmaps quietly skip.',
             'Operating-model notes: domain-owned agent squads, a central platform team, and a shared catalog of tools and permissions.',
             'The suggested sequence is pragmatic: unify event data, wrap three to five transactional actions as permissioned tools, then let domain agents orchestrate them.',
             'KPIs belong at the seams — planning-to-execution cycle time, touchless exception rate — not model benchmarks.',
             'Blog honesty included: most early agent programs stall not on models but on access — systems of record without usable write APIs.',
             'The piece names the new roles along the way: agent product owners, integration stewards, and the exception desk itself.',
             'The integration budget tells the truth: the blog\'s own framing puts most of the cost below the agent layer — in APIs, identity and event plumbing.',
             'Set against the WEF physical-AI report, the same stack shows at both ends: agents need permissioned tools upstream, machines need safety cases downstream.'],
      note: { en: ['The last mile of supply chain AI is the write-back: an insight with no action path dies in a ticket queue.',
                   'Every agentic deployment is also an integration project — plan the boring half early.',
                   'Count the write-backs: a supply-chain AI roadmap without an action layer is a reporting roadmap.',
                   'The agent catalog is the new API governance — tools and permissions before headcount.'],
              zh: ['供应链 AI 的最后一公里是写回：没有执行路径的洞察，会死在工单队列里。',
                   '每个智能体项目同时也是集成项目——先把无趣的那一半规划好。',
                   '数一数写回动作：没有执行层的供应链 AI 路线图，其实是报表路线图。',
                   '智能体工具目录就是新的 API 治理——先管工具和权限，再谈人数。'] },
      tags: { en: ['Agentic AI', 'Systems Integration', 'Planning & Execution', 'Digital Supply Chain', 'Action Layer', 'ERP/MES Integration', 'Operating Model'],
              zh: ['智能体 AI', '系统集成', '计划与执行', '数字供应链', '执行层', 'ERP/MES 集成', '运营模式'] },
      glance: ['McKinsey operations blog · 2025', 'The action layer between insight and transactional core', 'Architecture + operating model, not a demo'],
      readfor: 'the write-back problem — the last mile of supply-chain AI.' },
    { t: 'Smart Manufacturing Is Driving Advantage but Needs Focused Investment',
      tzh: '智能制造已见优势，投入与落地仍须聚焦',
      src: 'Deloitte survey (press release)', host: 'prnewswire.com', url: 'https://www.prnewswire.com/news-releases/deloitte-survey-reveals-smart-manufacturing-is-driving-advantage-but-needs-focused-investment-and-implementation-302443462.html',
      d: '2025', dz: '2025年',
      quote: 'Respondents report up to 20% improvement in production output, 20% in employee productivity and 15% in unlocked capacity.',
      lead: "Deloitte's smart-manufacturing survey (600 manufacturers, fielded Aug–Sep 2024): the gains are real, the implementation focus is not.",
      body: ['Years of smart-manufacturing investment now show up in output, productivity and unlocked capacity — while the same respondents still stall on implementation bottlenecks.',
             'Gains concentrate where investment is focused instead of spread thin across sites.',
             'The gap between leaders and laggards reads as organizational, not technological: focused programs with clear owners pull ahead on every metric.',
             'Data readiness and workforce — not algorithm choice — dominate the "why we stalled" answers.',
             'Unlocked capacity (15%) is the quiet headline: throughput without new buildings — a capital-light answer to demand swings.',
             'The advice is concentration: pick a handful of lighthouse lines, instrument them honestly, then replicate — the survey data rewards exactly that pattern.',
             'Employee productivity, at plus twenty percent, is the underrated number: operator tooling, not robots, drove much of the early gain in the sample.',
             'The survey\'s own limitation is informative — self-reported gains concentrate where a measurement culture already exists, which is the same variable as focus.',
             'Investment discipline beats tool diversity: leaders standardize a small platform and go deep, while laggards collect point tools.',
             'The Aug–Sep 2024 fielding window matters when reading it — expect the agentic layer to widen these gaps since.'],
      note: { en: ['Adoption stopped being the differentiator; concentration of investment is — spread-thin factories trail on every metric.',
                   'The numbers are useful precisely because they are not uniform: the spread says execution, not tech choice, explains the gap.',
                   'Read the bottleneck list as a hiring plan: data engineering and skilled operators, not yet more data scientists.',
                   'Benchmark numbers age; the discipline of measuring them does not.'],
              zh: ['采用本身已不是分水岭，投入的集中度才是——摊大饼的工厂每项指标都落后。',
                   '这组数字的价值恰恰在参差不齐——解释差距的是执行，不是技术选型。',
                   '把瓶颈清单读成用人计划：缺的是数据工程和现场技工，不是再多几位科学家。',
                   '基准数字会过期，但度量这件事本身的纪律不会。'] },
      tags: { en: ['Smart Manufacturing', 'Industry 4.0', 'Benchmarking', 'Investment Focus', 'Capability Benchmark', 'Workforce', 'Implementation Bottlenecks'],
              zh: ['智能制造', '工业 4.0', '基准调研', '聚焦投入', '能力基准', '人才队伍', '落地瓶颈'] },
      glance: ['Survey press release · 600 manufacturers', '+20% output, +20% productivity, +15% unlocked capacity', 'Gains concentrate where focus is'],
      readfor: 'what the spread between leaders and laggards says about execution.' },
    { t: 'When Generative AI Meets Product Development',
      tzh: '当生成式 AI 遇上产品开发',
      src: 'MIT Sloan Management Review', host: 'sloanreview.mit.edu', url: 'https://sloanreview.mit.edu/article/when-generative-ai-meets-product-development/',
      d: 'Fall 2024', dz: '2024年·秋季刊',
      quote: 'From ideation to user testing, large language models are allowing companies to explore more ideas and iterate faster.',
      lead: 'How LLMs reshape product development: wider idea search and faster iteration, from ideation through user testing.',
      body: ['Research with product teams shows LLMs raise the number of live alternatives explored before the team converges on one.',
             'The shift is cultural too: engineers and designers move from authoring first drafts to reviewing drafts.',
             'Teams report the bottleneck moving from idea generation to evaluation — curation quality decides whether breadth becomes better products.',
             'IP handling and verification of technical claims stay the human loop through ideation and user testing.',
             'Field evidence puts the biggest time savings after the idea phase: test design, synthesis and documentation get compressed end to end.',
             'Teams that win formalize the review loop — rubrics, provenance checks, engineering gates — so AI breadth does not become downstream rework.',
             'The quiet warning inside the study: breadth without curation inflates the pipeline without improving the hit rate — evaluation capacity becomes the new headcount question.',
             'Documentation is the sleeper gain: specs, test plans and research summaries compress hardest because they are, at bottom, text-shaped work.',
             'User testing bends too: synthetic pre-testing screens more concepts before real users ever get scheduled.',
             'The human skill that rises is question-setting — prompts as specifications of what good must satisfy.'],
      note: { en: ['The real gain is breadth before convergence — more live hypotheses at the same headcount.',
                   'Reviewing beats authoring: once drafts are cheap, judgment is the scarce skill on the team.',
                   'When generation gets free, evaluation becomes the process — build the gates before you scale the breadth.',
                   'Faster iteration is a workflow investment, not a license purchase.'],
              zh: ['真正的收益在收敛前的广度——同样的编制，养得起的假设更多了。',
                   '审稿取代起稿：初稿变便宜之后，团队最稀缺的能力是判断力。',
                   '生成趋近免费之后，评审就成了流程本身——先建闸口，再放量。',
                   '迭代提速是流程投资，不是买几张许可证。'] },
      tags: { en: ['Generative AI', 'Product Development', 'LLM', 'Innovation Process', 'Idea Evaluation', 'Design Workflow', 'IP Governance'],
              zh: ['生成式 AI', '产品开发', 'LLM', '创新流程', '想法评审', '设计工作流', '知识产权治理'] },
      glance: ['MIT SMR article · Fall 2024', 'More live ideas before convergence', 'Teams shift from authoring to reviewing drafts'],
      readfor: 'the workflow consequence: evaluation becomes the bottleneck.' },
    { t: 'Gen AI in production',
      tzh: '生产中的生成式 AI',
      src: 'McKinsey Operations Blog', host: 'mckinsey.com', url: 'https://www.mckinsey.com/capabilities/operations/our-insights/operations-blog/harnessing-generative-ai-in-manufacturing-and-supply-chains',
      d: 'Mar 2024', dz: '2024年3月',
      quote: 'In manufacturing and supply chain alone, it could reduce expenses by up to half a trillion dollars.',
      lead: 'An early operating-model read on gen AI in manufacturing and supply chains — use cases, economics, and where to actually start.',
      body: ['Opens with the money: a half-trillion-dollar annual cost potential in manufacturing and supply chain alone.',
             'Advises starting from concrete production use cases rather than horizontal chat experiments — the use-case list reads like an ops backlog.',
             'The figure is cited per year, spanning manufacturing and supply chain end to end — cost first; the revenue stories came later.',
             'Early adopters pick narrow, high-frequency work — instructions, quality notes, sourcing documents — over horizontal chatbots.',
             'Where the money sits: engineering documentation, supplier communication, maintenance knowledge lookup — high-frequency text work already budgeted inside operations.',
             'Named early risks: hallucination in technical answers, IP leakage through prompts, and the governance layer most plants did not have in 2024.',
             'Read two years on, the 2024 use-case list works as a seed catalog — most of the agentic deployments above it started as one of those documents done faster.',
             'The cost framing aged well: the half-trillion number moved boards, and the start-narrow advice spared ops teams the horizontal-chatbot detour.',
             'Why manufacturing was ready: decades of ERP discipline left cleaner data to point models at than most back offices ever had.',
             'The piece doubles as a history marker — read it next to the 2025–2026 entries above to watch pilots become platforms in twenty-four months.'],
      note: { en: ["Gen AI entered the 2024 factory floor through cost lines, not brand demos — and that is why it stuck.",
                   "The reel's starting point: first see the half trillion, then find your line's share of the denominator.",
                   'Frequency beats glamour: the 2024 wins were boring documents done faster, day after day.',
                   'The denominator is the strategy — your line\'s share of that half trillion is your business case.'],
              zh: ['生成式 AI 在 2024 年是从成本科目走进车间的，不是从品牌演示——所以它留了下来。',
                   '这组文章的起点：先看见那半万亿美元，再去找自己那条产线在分母里的位置。',
                   '频次碾压光环：2024 年的赢面，是把无聊的文档每天做快一点。',
                   '分母即战略——那半万亿里属于你产线的份额，才是你的商业论证。'] },
      tags: { en: ['Generative AI', 'Manufacturing Operations', 'Cost Reduction', 'Supply Chain', 'Use-Case Backlog', 'Work Instructions', 'Cost Potential'],
              zh: ['生成式 AI', '制造运营', '降本', '供应链', '用例清单', '作业指导书', '成本潜力'] } }
  ];

  /* This module declares its own images; the shared prewarmer drains them
     after window.load. Rank 3 = Time / Talent, rank 4 = travel journal photos.
     The iPad frame only appears in the Text reel, so it warms last of rank 3. */
  if (window.PortfolioWarm) {
    window.PortfolioWarm.add(Object.keys(LOGOS).map(function (k) { return LOGOS[k]; }), 1);
    window.PortfolioWarm.add(HOBBIES.map(function (h) { return h.img; }), 3);
    window.PortfolioWarm.add(TALENTS.map(function (t) { return t.img; }), 3);
    window.PortfolioWarm.add(['tab/me/iPad - Silver - Portrait.png'], 3);
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
                lbPhoto: 0, lbHover: false, mounted: false, lastFocus: null,
                tagSel: null,
                /* Text reel: sel = centre article, pos = live wheel position
                   (fractional), target = snapped stop of the current spin. */
                textSel: 0, textPos: 0, textTarget: 0 };
  var lbTimer = null, lbManualUntil = 0;
  var LB_MS = 3000;
  var keyHandler = null;
  /* "Carousel rail" reel: all 12 rows always fill the rail from its top edge
     to its bottom edge — every row stays visible, clickable, and flush with
     the iPad frame. The drum feeling travels as a wave centred on the active
     row: tilt (rotateX), depth (translateZ) and a small vertical bump follow
     the selection, so spinning re-curves the surface like a cylinder turning
     under the finger. */
  var TEXT_TILT_DEG = 45;            // max row tilt at the rail edges
  var TEXT_DEPTH = 70;               // px a rail-edge row recedes by
  var TEXT_BUMP = 0.12;              // wave amplitude, in slots
  var TEXT_DRAG_SENS = 1.4;          // >1 = drag less sensitive than 1:1

  /* Text reel interaction state (listeners live on stage nodes and die with
     the rebuilt stage, so nothing extra needs removing on section change). */
  var textDrag = null;             // { y0, p0, moved } while a pointer drags
  var textJustDragged = false;     // swallow the click that ends a drag
  var textLastWheel = 0;           // wheel ratchet throttle timestamp

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
        labelY: p[1] + (c.label === 'up' ? -21 : 21),
        labelDX: c.labelDX || 0, labelDY: c.labelDY || 0
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
      overlay += '<div class="me-city" style="' + pos(c.x + c.labelDX, c.labelY + c.labelDY) + '">' + esc(c.city) + '</div>';

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

  /* ── Text: an article reel (left) spinning an iPad reader (centre) ─
     The left column is a carousel rail: all 12 rows stay laid out top to
     bottom (every row clickable, the column flush with the iPad frame);
     tilt, depth and a small bump wave around the active row, so scrolling
     and clicking feel like turning a cylinder. Wheel ratchets ±1, dragging
     follows the pointer (damped by TEXT_DRAG_SENS); clicking anywhere on a
     row's Y-strip (or pressing ↑ ↓) selects that row — clicks map by
     coordinate because 3D-transformed rows defeat native hit testing — and
     whatever is active is what
     the iPad and the TAKEAWAY/TAGS side show. The reel reads the TEXTS
     references; the screen digests them and
     links out — the site never ships article copies.
     Screen text is English in both modes (it is the cited article's own
     page); everything around it follows LANG. */
  function textTitle(a) { return state.lang === 'zh' ? a.tzh : a.t; }
  function textDate(a)  { return state.lang === 'zh' ? a.dz : a.d; }

  function rowInnerHTML(a, i) {
    /* No jump link inside the row — the iPad screen below the digest already
       carries the only route to the source; the reel stays pure navigation. */
    return '<span class="me-text-no">' + String(i + 1).padStart(2, '0') + '</span>' +
           '<span class="me-text-t">' + esc(textTitle(a)) + '</span>' +
           '<span class="me-text-date">' + esc(textDate(a)) + '</span>';
  }
  function textRowsHTML() {
    return TEXTS.map(function (a, i) {
      return '<div class="me-text-row' + (i === state.textSel ? ' is-active' : '') + '" ' +
             'data-i="' + i + '" role="option" aria-selected="' + (i === state.textSel) + '">' +
             rowInnerHTML(a, i) + '</div>';
    }).join('');
  }

  /* The iPad screen: a referenced digest, never a copy — quote + deck +
     my summary, ending in a link to the source. English in both modes. */
  function readerHTML() {
    var a = TEXTS[state.textSel];
    return '<div class="me-text-doc">' +
             '<p class="me-text-meta"><span class="me-text-src">' + esc(a.src) + '</span>' +
               '<span>' + esc(a.d) + '</span></p>' +
             '<h3 class="me-text-title">' + esc(a.t) + '</h3>' +
             (a.quote ? '<blockquote class="me-text-quote">“' + esc(a.quote) + '”</blockquote>' : '') +
             '<p class="me-text-lead">' + esc(a.lead) + '</p>' +
             a.body.map(function (p) { return '<p class="me-text-para">' + esc(p) + '</p>'; }).join('') +
             (a.glance ? '<p class="me-text-h4">At a glance</p><ul class="me-text-glance">' +
               a.glance.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
             (a.readfor ? '<p class="me-text-readfor"><span>Read it for:</span> ' + esc(a.readfor) + '</p>' : '') +
             '<p class="me-text-note">Referenced summary — the full article stays at its source.</p>' +
           '</div>' +
           '<div class="me-text-act">' +
             '<a class="me-text-open" href="' + a.url + '" target="_blank" rel="noopener">Read the original at ' +
             esc(a.host) + '<i aria-hidden="true"> ↗</i></a>' +
           '</div>';
  }
  function sideHTML() {
    var a = TEXTS[state.textSel];
    var lang = state.lang === 'zh' ? 'zh' : 'en';
    var notes = a.note[lang].map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('');
    var chips = a.tags[lang].map(function (x) { return '<span class="me-text-chip">' + esc(x) + '</span>'; }).join('');
    /* Fixed split of the side rail: TAKEAWAY owns the top 2/3, TAGS the
       bottom 1/3; each block scrolls inside itself so the column height
       never changes with the article. */
    return '<div class="me-text-take">' +
             '<p class="me-text-eyebrow">' + txt('text.take') + '</p>' +
             '<ul class="me-text-notes">' + notes + '</ul>' +
           '</div>' +
           '<div class="me-text-tagbox">' +
             '<p class="me-text-eyebrow">' + txt('text.tags') + '</p>' +
             '<div class="me-text-chips">' + chips + '</div>' +
           '</div>';
  }

  function textHTML() {
    return '<div class="me-text-stage">' +
             '<div class="me-text-left">' +
               '<div class="me-text-rail" id="me-text-rail" tabindex="0" role="listbox" ' +
                 'aria-label="' + esc(TEXT[state.lang]['text.reel']) + '">' +
                 '<div class="me-text-drum" id="me-text-drum">' + textRowsHTML() + '</div>' +
               '</div>' +
             '</div>' +
             '<div class="me-text-ipad">' +
               '<div class="me-text-frame" aria-hidden="true"></div>' +
               '<div class="me-text-reader" id="me-text-reader" aria-live="polite">' + readerHTML() + '</div>' +
             '</div>' +
             '<aside class="me-text-side" id="me-text-side">' + sideHTML() + '</aside>' +
           '</div>';
  }

  /* Layout unit of the reel; read live so a resize repaints correctly.
     Row height itself lives in CSS (--row-h on .me-text-drum); JS measures
     the first row instead of reading the custom property, because a custom
     property whose value is a calc() string never resolves through
     getComputedStyle. */
  function textRowGeom() {
    var rail = state.root && state.root.querySelector('#me-text-rail');
    var H = rail && rail.clientHeight ? rail.clientHeight : 600;
    var row = rail && rail.querySelector('.me-text-row');
    var rowH = row && row.offsetHeight ? row.offsetHeight : 46;
    var n = Math.max(2, TEXTS.length);
    return { slot: (H - rowH) / (n - 1 + TEXT_BUMP * 2) };
  }
  /* Re-paint for a (possibly fractional) position p: rows hold their slots,
     the tilt/depth/bump wave follows p, and the row at round(p) carries
     .is-active — during a drag that swap is the live feedback. */
  function paintTextRows() {
    var drum = state.root && state.root.querySelector('#me-text-drum');
    if (!drum) return;
    var g = textRowGeom(), rows = drum.children, n = rows.length;
    var half = (n - 1) / 2;
    for (var i = 0; i < n; i++) {
      var u = i - state.textPos;
      var af = Math.min(Math.abs(u) / half, 1);        // 0 at selection → 1 far
      rows[i].classList.toggle('is-active', i === state.textSel);
      rows[i].setAttribute('aria-selected', i === state.textSel ? 'true' : 'false');
      var tilt = TEXT_TILT_DEG * Math.sin(af * Math.PI / 2) * (u < 0 ? -1 : 1);
      rows[i].style.transform =
        'translateY(' + ((i - half) * g.slot + TEXT_BUMP * g.slot * Math.tanh(u / 1.4)).toFixed(1) + 'px) ' +
        'translateZ(' + (-TEXT_DEPTH * af * af).toFixed(1) + 'px) ' +
        'rotateX(' + (-tilt).toFixed(1) + 'deg)';
      rows[i].style.opacity = (1 - .4 * af * af).toFixed(2);
    }
  }
  /* Stop the spin on article i: swap the row labels (date ⇄ original link),
     repaint the reader and the takeaway/tags side. Cheap: 12 rows exist,
     only the two touched rows and the two panels re-render. */
  function setTextIndex(i) {
    if (i === state.textSel) return;
    var drum = state.root && state.root.querySelector('#me-text-drum');
    var prev = state.textSel;
    state.textSel = i;
    if (drum) {
      if (drum.children[prev]) drum.children[prev].innerHTML = rowInnerHTML(TEXTS[prev], prev);
      if (drum.children[i])   drum.children[i].innerHTML   = rowInnerHTML(TEXTS[i], i);
    }
    var reader = state.root && state.root.querySelector('#me-text-reader');
    if (reader) { reader.innerHTML = readerHTML(); reader.scrollTop = 0; }
    var side = state.root && state.root.querySelector('#me-text-side');
    if (side) side.innerHTML = sideHTML();
  }
  function spinTo(i) {
    i = Math.max(0, Math.min(TEXTS.length - 1, i));
    state.textTarget = i;
    state.textPos = i;              // CSS transition on .me-text-row animates it
    setTextIndex(i);
    paintTextRows();
  }

  /* Wheel ratchet: one step per event, throttled so fast wheels stay legible.
     Deliberately preventDefaults: inside the reel the wheel belongs to the
     reel (the page still scrolls anywhere else, including the iPad screen). */
  function onTextWheel(e) {
    e.preventDefault();
    var now = Date.now();
    if (now - textLastWheel < 120) return;
    textLastWheel = now;
    var dir = e.deltaY > 0 ? 1 : -1;
    spinTo(state.textTarget + dir);
  }
  /* Drag: the wave follows the pointer (transition off) a bit slower than
     1:1 — pitch = slot×TEXT_DRAG_SENS makes it feel weighty, not twitchy —
     rows swap selection live, and the selection snaps to a row on release.
     Rubber band outside 01/12 so a pull past the ends reads as blocked,
     not broken.
     IMPORTANT: pointer capture is only taken once a drag actually starts —
     capturing on pointerdown would retarget the follow-up click onto the
     rail and silently kill "click a row to spin to it". */
  function onTextDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    textDrag = { y0: e.clientY, p0: state.textPos, moved: false, id: e.pointerId };
  }
  function onTextMove(e) {
    if (!textDrag) return;
    var dy = e.clientY - textDrag.y0;
    if (!textDrag.moved && Math.abs(dy) > 5) {
      textDrag.moved = true;
      try { e.currentTarget.setPointerCapture(textDrag.id); } catch (err) {}
      e.currentTarget.classList.add('is-dragging');   // no card transition while dragged
    }
    if (!textDrag.moved) return;
    var pitch = textRowGeom().slot * TEXT_DRAG_SENS;
    var p = textDrag.p0 - dy / pitch;                 // drag up → next article
    var max = TEXTS.length - 1;
    if (p < 0) p *= .35;
    if (p > max) p = max + (p - max) * .35;
    state.textPos = p;
    setTextIndex(Math.round(Math.max(0, Math.min(max, p))));  // live swap follows the drum
    paintTextRows();
  }
  function onTextUp() {
    if (!textDrag) return;
    textJustDragged = textDrag.moved;
    textDrag = null;
    var rail = state.root && state.root.querySelector('#me-text-rail');
    if (rail) rail.classList.remove('is-dragging');
    spinTo(Math.round(Math.max(0, Math.min(TEXTS.length - 1, state.textPos))));
  }
  function onTextKey(e) {
    var step = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
    if (step) spinTo(state.textTarget + step);
    else if (e.key === 'Home') spinTo(0);
    else if (e.key === 'End') spinTo(TEXTS.length - 1);
    else return;
    e.preventDefault();
  }
  function initTextStage() {
    var rail = state.root && state.root.querySelector('#me-text-rail');
    if (!rail) return;
    rail.addEventListener('wheel', onTextWheel, { passive: false });
    rail.addEventListener('pointerdown', onTextDown);
    rail.addEventListener('pointermove', onTextMove);
    rail.addEventListener('pointermove', textHover);
    rail.addEventListener('pointerleave', textLeave);
    rail.addEventListener('pointerup', onTextUp);
    rail.addEventListener('pointercancel', onTextUp);
    rail.addEventListener('keydown', onTextKey);
    paintTextRows();   // needs laid-out nodes; runs right after innerHTML
    /* The wave unit comes from the rail's measured height, which is only
       real after layout — repaint once more on the first animation frame. */
    if (window.requestAnimationFrame) window.requestAnimationFrame(paintTextRows);
  }


  /* ── Tags: word cloud over the products' own tags ─────────────────
     Reference, never copy: the cloud reads the shared PRODUCTS registry
     at build time, so every chip keeps exactly one source of truth — edit
     a tag in any tab/<domain>/*.js and the cloud follows on reload. The
     only list owned here is TAG_DERIVED, curated summary words: each
     counts EVERY project tag that contains it as a whole word (LLM →
     LLM Automation + LLM Pipeline + LLM Wiki) and absorbs an identical
     standalone tag (C2C) instead of duplicating it.
     Bigger + darker = more project tags behind the word. Colour fades
     from the site blue #2b54b8 (highest frequency) towards a capped
     light blend, so frequency-1 words stay legible on white.
     The whole section — words and previews alike — is English in both
     languages (only the tagline translates), so a language switch never
     has to rebuild it; tag data can also never drift per language.   */
  var TAG_DERIVED = ['LLM', 'Data', 'Risk', 'Search', 'Graph', 'ML',
                     'Manufacturing', 'Planning', 'C2C'];
  var TAGS_CACHE = null;
  var TAG_BASE_RGB = [43, 84, 184];

  function tagTokens(t) { return t.split(/[^A-Za-z0-9]+/).filter(Boolean); }

  function tagIndex() {
    if (TAGS_CACHE) return TAGS_CACHE;
    var map = {};
    function entry(text) {
      if (!map[text]) map[text] = { text: text, tags: 0, pids: {} };
      return map[text];
    }
    var productTags = function (p) { return (p.tags && p.tags.en) || []; };
    PRODUCTS.forEach(function (p) {                       // verbatim tags
      productTags(p).forEach(function (t) {
        var e = entry(t);
        e.tags++;
        e.pids[p.id] = [t];
      });
    });
    TAG_DERIVED.forEach(function (w) {                    // summary words
      var e = entry(w);                                   // may merge with the tag itself
      PRODUCTS.forEach(function (p) {
        productTags(p).forEach(function (t) {
          if (t === w) return;                            // already counted verbatim
          if (tagTokens(t).indexOf(w) >= 0) {
            e.tags++;
            e.pids[p.id] = (e.pids[p.id] || []).concat([t]);
          }
        });
      });
    });
    var list = Object.keys(map).map(function (k) {
      var e = map[k];
      e.projects = PRODUCTS.filter(function (p) { return e.pids[p.id]; });
      return e;
    });
    var maxF = list.reduce(function (m, e) { return Math.max(m, e.tags); }, 1);
    list.forEach(function (e) {
      var r = maxF > 1 ? (maxF - e.tags) / (maxF - 1) : 0;   // 0 = hottest
      var blend = 0.35 * r;                                   // cap the light end
      e.color = 'rgb(' + TAG_BASE_RGB.map(function (v) {
        return Math.round(v + (255 - v) * blend);
      }).join(',') + ')';
      e.fs = (0.82 + 1.05 * Math.sqrt((e.tags - 1) / Math.max(1, maxF - 1))).toFixed(2);
      e.bold = e.tags >= 4 ? ';--fw:700' : '';
    });
    list.sort(function (a, b) { return b.tags - a.tags || a.text.localeCompare(b.text); });
    TAGS_CACHE = list;
    return list;
  }

  function tagCountLabel(e) {
    return e.text + ' · ' + e.tags + (e.tags > 1 ? ' tags · ' : ' tag · ') +
           e.projects.length + (e.projects.length > 1 ? ' projects' : ' project');
  }

  function tagsHTML() {
    /* Placement happens AFTER the HTML is in the DOM (layoutTags):
       frequency order = placement order, so the hottest word sits at the
       centre and everything else packs outward into a near-rectangle. */
    var cloud = '<div class="me-tags-cloud">' + tagIndex().map(function (e) {
      var sel = state.tagSel === e.text;
      return '<button type="button" class="me-tag' + (sel ? ' is-selected' : '') + '" ' +
             'data-tag="' + esc(e.text) + '" aria-pressed="' + sel + '" ' +
             'title="' + esc(tagCountLabel(e)) + '" ' +
             'style="--fs:' + e.fs + 'rem;--tcol:' + e.color + e.bold + '">' +
             esc(e.text) + '</button>';
    }).join('') + '</div>';
    return '<div class="me-tags-stage">' + cloud +
           '<div class="me-tags-detail' + (state.tagSel ? '' : ' is-idle') + '" id="me-tags-detail">' +
           tagDetailHTML() + '</div></div>';
  }

  /* Centre-out placement in a NEAR-RECTANGLE: words are measured in the
     browser (real fonts, real --tagscale), then absolutely placed at the
     first free grid cell nearest the centre, where "nearest" is scored by
     growing RECTANGLES (aspect ≈ the cloud's estimated bounding box), not
     circles. The hottest word sits dead centre; everything else packs into
     the same rectangular front, so the cloud fills a compact rectangle
     instead of a round spiral — same centring, far less wasted space.
     x stays clamped inside the padded stage — narrow screens grow TALLER,
     never wider, so the cloud can never force a horizontal scrollbar.
     On ≤820px cloud width the right edge leaves room for the floating TOC
     rail. Deterministic per width. */
  function layoutTags() {
    var cloudEl = state.root && state.root.querySelector('.me-tags-cloud');
    if (!cloudEl) return;
    var W = cloudEl.clientWidth;
    if (!W) return;
    // .me-inner is calc(100% - 40px) at ≤860px → cloud W ≤ 820 means narrow.
    // (Trust the laid-out width, not window.innerWidth: embedded webviews
    // can report an innerWidth that disagrees with the CSS media state.)
    var narrow = W <= 820;
    var padL = 8, padR = narrow ? 44 : 8;
    var GAP = 5, STEP = 5;
    var btns = Array.prototype.slice.call(cloudEl.querySelectorAll('.me-tag'));
    if (!btns.length) return;
    var dims = btns.map(function (b) {
      return { w: b.offsetWidth, h: b.offsetHeight };   // measured in place
    });
    var UW = Math.max(W - padL - padR, 120);
    var cx = padL + UW / 2;
    /* Estimated rectangle height = total chip area (each inflated by the
       collision gap) × slack for ragged packing edges. It only sets the
       search-front aspect and the vertical extent; the real bbox follows. */
    var area = dims.reduce(function (s, d) { return s + (d.w + 2 * GAP) * (d.h + 2 * GAP); }, 0);
    var H0 = Math.max(200, (area * 1.18) / UW);
    var f = H0 / UW;                     // fronts grow as rectangles of aspect UW:H0
    var cy = 4 + H0 / 2;
    var cells = [];
    for (var y = cy - H0; y <= cy + H0 * 1.6; y += STEP)
      for (var x = padL; x <= W - padR; x += STEP)
        cells.push([Math.max(Math.abs(x - cx), Math.abs(y - cy) / f),
                    (x - cx) * (x - cx) + (y - cy) * (y - cy), x, y]);
    cells.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    var boxes = [];
    var maxBottom = 0, startIdx = 0;
    function fits(b) {
      for (var i = 0; i < boxes.length; i++) {
        var q = boxes[i];
        if (b.x < q.x + q.w + GAP && b.x + b.w + GAP > q.x &&
            b.y < q.y + q.h + GAP && b.y + b.h + GAP > q.y) return false;
      }
      return true;
    }
    btns.forEach(function (b, n) {
      var w = dims[n].w, h = dims[n].h, placed = false;
      for (var i = startIdx; i < cells.length; i++) {
        var box = { x: cells[i][2] - w / 2, y: cells[i][3] - h / 2, w: w, h: h };
        if (box.x < padL || box.x + w > W - padR) continue;   // never wider
        if (!fits(box)) continue;
        boxes.push(box);
        b.style.left = cells[i][2].toFixed(1) + 'px';
        b.style.top = cells[i][3].toFixed(1) + 'px';
        b.style.visibility = 'visible';
        // allow the next (smaller) words to still reach inner gaps nearby
        startIdx = Math.max(0, i - 600);
        placed = true; break;
      }
      if (!placed) {                                       // last resort: below
        var y2 = (maxBottom || cy) + h + GAP;
        boxes.push({ x: cx - w / 2, y: y2 - h / 2, w: w, h: h });
        b.style.left = cx.toFixed(1) + 'px';
        b.style.top = y2.toFixed(1) + 'px';
        b.style.visibility = 'visible';
      }
      var last = boxes[boxes.length - 1];
      maxBottom = Math.max(maxBottom, last.y + last.h / 2);
    });
    /* The search box is centred on cy, so cells may run above the
       container. Shift the whole cloud down so its topmost chip sits at
       y=4, then size the container to the real content. */
    var minY = boxes.reduce(function (m, q) { return Math.min(m, q.y); }, Infinity);
    var shift = 4 - Math.min(0, minY);
    if (shift) btns.forEach(function (b) {
      b.style.top = (parseFloat(b.style.top) + shift).toFixed(1) + 'px';
    });
    cloudEl.style.height = Math.ceil(maxBottom + shift + 8) + 'px';
  }
  var tagsResizeRAF = null;
  /* Shared resize tick: Tags re-packs its cloud; the Text reel repaints its
     rows (the drum radius --text-r changes with the CSS breakpoints). */
  function tagsResizeHandler() {
    if (tagsResizeRAF) cancelAnimationFrame(tagsResizeRAF);
    tagsResizeRAF = requestAnimationFrame(function () {
      tagsResizeRAF = null;
      if (!state.mounted) return;
      if (state.section === 'tags') layoutTags();
      else if (state.section === 'text') paintTextRows();
    });
  }

  /* One card per matched project; multiple projects = multiple cards.
     Cards link to index.html#id in a new tab — the same deep-link the
     Talent cases use; the module never touches core state. */
  function tagDetailHTML() {
    if (!state.tagSel) return '';   // idle = the whole detail box is hidden (see .is-idle)
    var e = null;
    tagIndex().forEach(function (x) { if (x.text === state.tagSel) e = x; });
    if (!e || !e.projects.length) return '';
    var cards = e.projects.map(function (p) {
      var dom = DOMAINS.filter(function (d) { return d.id === p.domain; })[0];
      return '<a class="me-tag-card" href="index.html#' + p.id + '" target="_blank" rel="noopener">' +
               '<span class="me-tag-card-top"><span class="me-tag-card-no">' + esc(p.no) + '</span>' +
                 '<strong>' + esc(p.name) + '</strong>' + companyBadge(p.company) + '</span>' +
               '<span class="me-tag-card-domain">' + esc(dom ? dom.name.en : p.domain) + '</span>' +
               '<span class="me-tag-card-oneliner">' + esc(p.oneliner.en) + '</span>' +
               '<span class="me-tag-card-via">' + esc(e.pids[p.id].join(' · ')) + '</span>' +
               '<span class="me-tag-card-open">Open project ↗</span>' +
             '</a>';
    }).join('');
    /* No summary/caption row above the cards: the selected chip is itself
       the highlight (and its count lives in the chip's title), and clicking
       the same chip again clears the selection — a duplicate header + Clear
       button only added noise. */
    return '<div class="me-tag-cards">' + cards + '</div>';
  }

  /* Repaint chips + detail only; the caption and the rest of the stage
     stay untouched, so a click never restarts other animations. */
  function paintTags() {
    if (!state.root) return;
    state.root.querySelectorAll('.me-tag[data-tag]').forEach(function (b) {
      var on = b.getAttribute('data-tag') === state.tagSel;
      b.classList.toggle('is-selected', on);
      b.setAttribute('aria-pressed', String(on));
    });
    var detail = state.root.querySelector('#me-tags-detail');
    if (detail) {
      detail.innerHTML = tagDetailHTML();
      detail.classList.toggle('is-idle', !state.tagSel);
    }
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
         : id === 'time' ? 'Time and hobbies' : id === 'tags' ? 'Tags word cloud'
         : id === 'text' ? 'Article reel'
         : 'Talents and strengths';
  }

  function stageHTML() {
    var s = state.section;
    if (s === 'time') return timeHTML();
    if (s === 'talent') return talentHTML();
    if (s === 'tags') return tagsHTML();
    if (s === 'text') return textHTML();
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
  /* Row visually nearest to a viewport Y — the coordinate-based fallback
     that makes every article clickable even when 3D transforms defeat the
     browser's own hit testing (see onClick). Rows never overlap in Y, so
     nearest-centre is unambiguous. */
  function textRowFromY(y) {
    var rail = state.root && state.root.querySelector('#me-text-rail');
    if (!rail) return null;
    var rows = rail.querySelectorAll('.me-text-row');
    var best = null, bestD = Infinity;
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i].getBoundingClientRect();
      var c = r.top + r.height / 2;
      var d = Math.abs(y - c);
      if (d < bestD) { bestD = d; best = rows[i]; }
    }
    return best;
  }
  /* Mouse hover feedback follows the same Y mapping (:hover never lands on
     the transformed rows), so the reel previews the row a click selects. */
  function textHover(e) {
    if (textDrag || e.pointerType !== 'mouse') return;
    var hit = textRowFromY(e.clientY);
    var rail = state.root && state.root.querySelector('#me-text-rail');
    if (!rail) return;
    var rows = rail.querySelectorAll('.me-text-row');
    for (var i = 0; i < rows.length; i++) rows[i].classList.toggle('is-hover', rows[i] === hit);
  }
  function textLeave() {
    var rail = state.root && state.root.querySelector('#me-text-rail');
    if (!rail) return;
    var rows = rail.querySelectorAll('.me-text-row');
    for (var i = 0; i < rows.length; i++) rows[i].classList.remove('is-hover');
  }
  function onClick(e) {
    /* Text reel: the pointerup that ends a real drag must not count as a
       click on whatever row happened to sit under the cursor. */
    if (textJustDragged) { textJustDragged = false; return; }
    var tRow = e.target.closest('.me-text-row');
    /* 3D-transformed rows can fall through the engine's hit test
       (translateZ + rotateX leaves the pointer landing on the drum), so a
       bare-rail click maps its Y to the visually nearest row — clicking
       any article's strip selects it, no sliding required. */
    if (!tRow && e.target.closest('#me-text-rail')) tRow = textRowFromY(e.clientY);
    if (tRow) {
      if (e.target.closest('a')) return;        // original-text link on the active row
      spinTo(Number(tRow.getAttribute('data-i')));
      return;
    }

    /* Tags: click selects a word and paints its project previews below the
       cloud; clicking the same word again clears the selection. */
    var tagBtn = e.target.closest('.me-tag[data-tag]');
    if (tagBtn) {
      var word = tagBtn.getAttribute('data-tag');
      state.tagSel = state.tagSel === word ? null : word;
      paintTags();
      /* The preview sits below a tall cloud and often lands off-screen —
         ease it into view (nearest = scroll the minimum needed). */
      if (state.tagSel) {
        var det = state.root.querySelector('#me-tags-detail');
        if (det && det.scrollIntoView) {
          var rm = window.matchMedia &&
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          try { det.scrollIntoView({ block: 'nearest', behavior: rm ? 'auto' : 'smooth' }); }
          catch (err) { det.scrollIntoView(false); }
        }
      }
      return;
    }

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
      if (id === 'tags') layoutTags();   // centre-out placement needs live px metrics
      if (id === 'text') initTextStage();// reel rows need live px metrics too
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
    window.addEventListener('resize', tagsResizeHandler);
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
    window.removeEventListener('resize', tagsResizeHandler);
    if (tagsResizeRAF) { cancelAnimationFrame(tagsResizeRAF); tagsResizeRAF = null; }
    document.body.style.overflow = '';
    state.mounted = false;
    state.lastFocus = null;
    // Re-entering Me always starts at Teams, just like a fresh page load.
    // Without this, a previous Travel view would silently persist across tabs.
    state.section = 'teams';
    state.lightbox = -1;
    state.tagSel = null;
    state.textSel = 0;
    state.textPos = 0;
    state.textTarget = 0;
    textDrag = null;
    textJustDragged = false;
  }
  function refresh(lang) {
    if (!state.mounted || !state.root) return;
    if (lang) state.lang = lang === 'zh' ? 'zh' : 'en';
    // Text-only swap: the Time marquee keeps its animation clock, an open
    // travel lightbox keeps its mask, and no DOM is rebuilt (no flash).
    applyTexts();
    /* The Text stage also carries language outside the static TEXT map
       (reel titles/dates, takeaway notes, tag chips) — rebuild it in place;
       the reel keeps its selection and position. */
    if (state.section === 'text') {
      var stage = state.root.querySelector('#me-stage');
      if (stage) { stage.innerHTML = stageHTML(); initTextStage(); }
    }
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
 ,
      glance: ['McKinsey operations blog · Mar 2024', 'Up to $0.5T annual cost potential in manufacturing + supply chain', 'Start narrow: concrete production use cases'],
      readfor: 'it is where this reel\'s money conversation begins.' });
})();
