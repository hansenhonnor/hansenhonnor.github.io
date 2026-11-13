/* ==========================================================================
   tab/e-commerce/e-commerce.js — 2 case studies (E-commerce tab).

   Add a project here, not in core/. Each object needs: id, no, domain,
   name, company, url, tabs, views, tags, title, oneliner, star, metrics.
   Set `interactive: 'cluster' | 'flow'` to use a registered demo instead
   of the standard dashboard; add `photos: [...]` to get a carousel.
   Views are functions, so core helpers (T, esc, kpi, head, ...) resolve
   at render time. Order here = order in the tab and the floating TOC.
   ========================================================================== */

PRODUCTS.push(
  {
    id: 'playomt', no: '11', domain: 'commerce', name: 'PlayOMT',
    company: 'stealth',
    url: 'playomt.hk / discover',
    photos: PHOTO_SET,
    tags: { en: ['HK marketplace', 'Kids resale', 'Escrow', 'Size & age band', 'Safety standard', 'Hygiene'], zh: ['香港本地', '儿童二手', '托管交易', '尺码与年龄段', '安全标准', '卫生状况'] },
    title: { en: 'Play one more toy/time.', zh: '再多玩一件，再多玩一会儿。' },
    oneliner: { en: 'A Hong Kong marketplace for second-hand children’s goods.', zh: '面向香港本地儿童二手商品的交易平台。' },
    star: {
      s: { en: "Small Hong Kong homes and fast-growing kids leave children's gear idle within months; parents traded across marketplaces, chat groups and school gates.", zh: '香港住得挤、孩子长得快，儿童用品几个月就闲置；家长只能在二手平台、妈妈群和校门口之间辗转交易，既费时又难放心。' },
      t: { en: 'Make category-specific trust — size, age band, safety standard, hygiene — the default path rather than something buyers have to negotiate.', zh: '把尺码、月龄、安全标准、卫生状况这些关键信息做成默认项，不用买家一遍遍追问。' },
      a: { en: "Category-first listing templates, AI-assisted pricing and photo checks, a custody flow with cleaning, inspection and MTR-station pickup, recall screening against children's product alerts, and two-sided reviews.", zh: '按品类设计的刊登模板、AI 辅助定价与图片检查提示；清洁、质检、港铁站自提的托管履约；接入儿童用品召回校验；双向评价。' },
      r: { en: '38% listing-to-sale, 2.1 days to sell, 44% repeat sellers, and a 0.7% dispute rate.', zh: '刊登成交率 38%，平均 2.1 天卖出，卖家复购率 44%，纠纷率 0.7%。' }
    },
    metrics: [
      { v: '38%', unit: { en: '', zh: '' }, label: { en: 'listing-to-sale', zh: '刊登成交率' } },
      { v: '2.1', unit: { en: 'days', zh: '天' }, label: { en: 'average time to sell', zh: '平均成交时长' } },
      { v: '44%', unit: { en: '', zh: '' }, label: { en: 'repeat sellers', zh: '卖家复购率' } },
      { v: '0.7%', unit: { en: '', zh: '' }, label: { en: 'dispute rate', zh: '纠纷率' } }
    ],
    tabs: [{ id: 'discover', label: { en: 'Discover', zh: '逛一逛' } }, { id: 'trust', label: { en: 'Trust & Trade', zh: '信任与履约' } }],
    views: {
      discover: () => `
        <div class="ui-kpis">${kpi(T('Sell-through', '刊登成交率'), '38%', 'green')}${kpi(T('Time to sell', '成交时长'), '2.1d', 'blue')}${kpi(T('Disputes', '纠纷率'), '0.7%')}</div>
        <div class="ui-panel">
          ${head(T('Near you · Kowloon', '附近 · 九龙'), T('verified', '已质检'), 'green')}
          <div class="ui-filters"><span class="on">${T('All', '全部')}</span><span>${T('0–24m', '0–24 月')}</span><span>${T('Strollers', '推车')}</span><span>${T('Safety checked', '安全已校验')}</span></div>
          <div class="ui-listings">
            <div class="listing"><div class="listing-thumb t1"></div><div class="listing-body"><strong>${T('Stroller · 6–36m', '婴儿推车 · 6–36 月')}</strong><div class="listing-meta">${T('Like new · Mong Kok', '近全新 · 旺角')}</div><div class="listing-price">HK$ 780</div></div></div>
            <div class="listing"><div class="listing-thumb t2"></div><div class="listing-body"><strong>${T('Wooden cot · 0–3y', '木质婴儿床 · 0–3 岁')}</strong><div class="listing-meta">${T('Inspected · Sha Tin', '已质检 · 沙田')}</div><div class="listing-price">HK$ 1,150</div></div></div>
            <div class="listing"><div class="listing-thumb t3"></div><div class="listing-body"><strong>${T('Clothing set · 90cm', '童装套装 · 90cm')}</strong><div class="listing-meta">${T('Cleaned · Tsim Sha Tsui', '已清洁 · 尖沙咀')}</div><div class="listing-price">HK$ 120</div></div></div>
          </div>
          <p class="ui-note"><b>${T('AI assist · ', 'AI 辅助 · ')}</b>${T('Suggested price HK$ 720–840 from 46 comparable sold listings; photo check asks for a safety-label close-up.', '参考 46 条同款成交记录，建议定价 HK$ 720–840；并提示补拍安全标识特写。')}</p>
        </div>`,
      trust: () => `
        <div class="ui-panel">
          ${head(T('Custody flow · order #PO-2088', '托管履约 · 订单 #PO-2088'), T('in transit', '进行中'), 'blue')}
          <div class="ui-timeline">
            <div class="tl-item ok"><div class="tl-head"><strong>${T('Listed with category template', '按品类模板刊登')}</strong><span>D0</span></div><p>${T('Age band, size, safety standard auto-filled', '自动带出月龄、尺码、安全标准')}</p></div>
            <div class="tl-item ok"><div class="tl-head"><strong>${T('Paid & shipped to hub', '付款并寄至中转点')}</strong><span>D1</span></div><p>${T('Funds held in escrow', '款项进入托管')}</p></div>
            <div class="tl-item ok"><div class="tl-head"><strong>${T('Cleaning & inspection', '清洁与质检')}</strong><span>D2</span></div><p>${T('12-point checklist · recall screen passed', '12 项清单 · 召回校验通过')}</p></div>
            <div class="tl-item"><div class="tl-head"><strong>${T('MTR-station pickup', '港铁站自提')}</strong><span>D3</span></div><p>${T('Mong Kok · locker 14', '旺角 · 智能柜 14')}</p></div>
            <div class="tl-item"><div class="tl-head"><strong>${T('Two-sided review', '双向评价')}</strong><span>D4</span></div><p>${T('Escrow released after confirmation', '确认收货后释放托管款')}</p></div>
          </div>
        </div>
        <div class="ui-panel">
          ${head(T('Pickup coverage by region', '各区自提点覆盖'), T('18 stations', '18 个站点'), 'green')}
          <div class="ui-bars">${barRow(T('Kowloon', '九龙'), '8', 80)}${barRow(T('New Territories', '新界'), '7', 70, 'cyan')}${barRow(T('Hong Kong Island', '港岛'), '3', 30, 'green')}</div>
          <p class="ui-note"><b>${T('Trust · ', '信任 · ')}</b>${T("Every listing is screened against children's product recall alerts before it can go live.", '每条刊登在上架前都会过一遍儿童用品召回公告筛查。')}</p>
        </div>`
    }
  },
  {
    id: 'whatswap', no: '12', domain: 'commerce', name: 'WhatSwap',
    company: 'hku',
    url: 'whatswap.edu / listings',
    tags: { en: ['Campus', 'Used electronics', 'Inspection', 'Campus pickup'], zh: ['校园', '二手电子', '验机报告', '校内自提'] },
    title: { en: "Students upgrade fast. Their devices shouldn't disappear into a drawer.", zh: '学生换机快，旧设备不该就此闲置在抽屉里。' },
    oneliner: { en: 'A campus-only marketplace for used consumer electronics.', zh: '面向校园内部的二手电子产品交易平台。' },
    star: {
      s: { en: 'Students buy phones, tablets, laptops and cameras, then upgrade after a term or two. Trades happened in group chats with no price reference, no condition check and awkward meetups.', zh: '学生买手机、平板、笔记本和相机，一两个学期就换新；交易多发生在群聊里，没有价格参照、没有成色核验，面交也尴尬。' },
      t: { en: 'Make a campus-only loop where a buyer can trust the condition of a used device without being an expert.', zh: '做一个仅限校园的闭环，让不懂行的买家也能相信一台二手设备的成色。' },
      a: { en: 'Campus-ID verification, model-specific listing templates with battery health and serial fields, AI price guidance from local sold comps, a 14-point inspection report, and escrow with pickup lockers by dorm / library.', zh: '校园身份认证；按机型生成刊登模板，强制填电池健康度与序列号；用本校成交数据给出 AI 定价建议；14 项验机报告；托管付款 + 宿舍区/图书馆自提柜。' },
      r: { en: '41% listing-to-sale, 1.6 days to sell, 0.9% dispute rate, and 6,400 verified campus users.', zh: '刊登成交率 41%，平均 1.6 天卖出，纠纷率 0.9%，6,400 名校园认证用户。' }
    },
    metrics: [
      { v: '41%', unit: { en: '', zh: '' }, label: { en: 'listing-to-sale', zh: '刊登成交率' } },
      { v: '1.6', unit: { en: 'days', zh: '天' }, label: { en: 'average time to sell', zh: '平均成交时长' } }
    ],
    tabs: [{ id: 'listings', label: { en: 'Listings', zh: '逛逛' } }, { id: 'inspection', label: { en: 'Inspection', zh: '验机报告' } }],
    views: {
      listings: () => `
        <div class="ui-kpis">${kpi(T('Sell-through', '刊登成交率'), '41%', 'green')}${kpi(T('Time to sell', '成交时长'), '1.6d', 'blue')}${kpi(T('Verified users', '认证用户'), '6,400')}</div>
        <div class="ui-panel">
          ${head(T('On campus · near you', '校内 · 附近'), T('campus ID only', '仅限校园认证'), 'green')}
          <div class="ui-filters"><span class="on">${T('All', '全部')}</span><span>${T('Phones', '手机')}</span><span>${T('Laptops', '笔记本')}</span><span>${T('Under HK$ 2,000', 'HK$ 2,000 以下')}</span></div>
          <div class="ui-listings">
            <div class="listing"><div class="listing-thumb t1"></div><div class="listing-body"><strong>${T('Phone · 128GB · 1 yr', '手机 · 128GB · 用 1 年')}</strong><div class="listing-meta">${T('Battery 91% · Lib North', '电池 91% · 北区图书馆')}</div><div class="listing-price">HK$ 1,880</div></div></div>
            <div class="listing"><div class="listing-thumb t2"></div><div class="listing-body"><strong>${T('Tablet · 11" · 2 yrs', '平板 · 11 寸 · 用 2 年')}</strong><div class="listing-meta">${T('Inspected · Dorm C', '已验机 · C 宿舍')}</div><div class="listing-price">HK$ 1,420</div></div></div>
            <div class="listing"><div class="listing-thumb t3"></div><div class="listing-body"><strong>${T('Mirrorless camera', '微单相机')}</strong><div class="listing-meta">${T('Shutter 3.2k · Dorm A', '快门 3.2k · A 宿舍')}</div><div class="listing-price">HK$ 2,350</div></div></div>
          </div>
          <p class="ui-note"><b>${T('AI assist · ', 'AI 辅助 · ')}</b>${T('Priced from 38 campus-only sold comps of the same model and battery band; seller can accept or adjust in one tap.', '参考同机型、同电池档位的 38 条校内成交给出定价；卖家可一键接受或调整。')}</p>
        </div>`,
      inspection: () => `
        <div class="ui-panel">
          ${head(T('Inspection report #IR-3412', '验机报告 #IR-3412'), T('12 / 14 passed', '14 项中 12 项通过'), 'amber')}
          <table class="ui-table"><thead><tr><th>${T('Check', '检测项')}</th><th>${T('Reading', '读数')}</th><th>${T('Reference', '参考区间')}</th><th>${T('Result', '结果')}</th></tr></thead><tbody>
            <tr><td>${T('Battery health', '电池健康度')}</td><td class="mono">91%</td><td>≥ 85%</td><td><span class="pill low">PASS</span></td></tr>
            <tr><td>${T('Screen / dead pixels', '屏幕坏点')}</td><td class="mono">0</td><td>0</td><td><span class="pill low">PASS</span></td></tr>
            <tr><td>${T('Serial match', '序列号一致')}</td><td class="mono">✓</td><td>✓</td><td><span class="pill low">PASS</span></td></tr>
            <tr><td>${T('Repair history', '维修记录')}</td><td class="mono">${T('1 screen swap', '1 次换屏')}</td><td>${T('disclose', '需披露')}</td><td><span class="pill mid">NOTED</span></td></tr>
            <tr><td>${T('Port / speaker', '接口与扬声器')}</td><td class="mono">${T('minor wear', '轻微磨损')}</td><td>${T('cosmetic', '外观项')}</td><td><span class="pill mid">NOTED</span></td></tr>
          </tbody></table>
        </div>
        <div class="ui-panel">
          ${head(T('Local price trend · 8 weeks', '校内价格走势 · 8 周'), T('same model', '同机型'), 'blue')}
          ${lineChart([92, 88, 85, 81, 78, 74, 71, 68], null, { target: 60 })}
          ${legend([[C.blue, T('Campus sold price', '校内成交价')], [C.mint, T('Listing floor', '挂牌下限')]])}
        </div>
        <div class="ui-panel"><div class="ui-steps">
          <div class="ui-step done"><strong>${T('Campus ID', '校园认证')}</strong><span>.edu</span></div><span class="ui-step-arrow">→</span>
          <div class="ui-step done"><strong>${T('List', '刊登')}</strong><span>14 fields</span></div><span class="ui-step-arrow">→</span>
          <div class="ui-step now"><strong>${T('Inspect', '验机')}</strong><span>14 pts</span></div><span class="ui-step-arrow">→</span>
          <div class="ui-step"><strong>${T('Escrow', '托管')}</strong><span>Locker</span></div><span class="ui-step-arrow">→</span>
          <div class="ui-step"><strong>${T('Pickup', '自提')}</strong><span>Dorm</span></div>
        </div></div>`
    }
  }
);
