/* Simi-Part — L1/L2 similarity graph. Registered on window.PortfolioDemos.
   Owns its state, SVG, controls and clocks; core/app.js never references it. */
/* ── 5a. Interactive similarity graph (Simi-Part) ──────────────
   Two interaction levels:
     L1  all families: 448 drawn dots stand for a 2,260-part corpus;
         "Separate" scatters them, "Aggregate" pulls them into 7 families.
         Any grouped family (or the arrow beside METAL) opens L2.
     L2  one family: its dots scatter / 6 supplier sub-clusters. Entering
         counts as a fresh first view, so it uses the SAME script as L1:
         Separate → forced Aggregate after 1s → 3s hover-gated cycle.
   Coordinates come from a fixed seed, so language / domain re-renders
   never reshuffle the dots; CSS transforms animate layouts in place.      */
const CLUSTER_FAMILIES = [
  { en: 'METAL',    zh: '金属件', color: '#2b54b8', gap: '+31%', parts: 460, vendors: 18, base: 0.018 },
  { en: 'CNC',      zh: '数控加工', color: '#3b8ad9', gap: '+24%', parts: 380, vendors: 22, base: 0.042 },
  { en: 'DIE CUT',  zh: '模切',   color: '#45b4d2', gap: '+19%', parts: 290, vendors: 18, base: 0.011 },
  { en: 'MIM',      zh: '金属注射成形', color: '#62c6b4', gap: '+27%', parts: 240, vendors: 14, base: 0.036 },
  { en: 'FASTENER', zh: '紧固件', color: '#77c7a6', gap: '+43%', parts: 420, vendors: 24, base: 0.009 },
  { en: 'RUBBER',   zh: '橡胶',   color: '#cda262', gap: '+16%', parts: 210, vendors: 16, base: 0.014 },
  { en: 'PLASTIC',  zh: '塑料',   color: '#d8877a', gap: '+22%', parts: 260, vendors: 22, base: 0.013 }
];
const CLUSTER_VENDOR_TOTAL = CLUSTER_FAMILIES.reduce((n, f) => n + f.vendors, 0); // 134
const CLUSTER_W = 1000, CLUSTER_H = 1000;   // doubled canvas: clusters breathe
const CLUSTER_PER = 64;                     // drawn dots per family (448 total)
const SUB_K = [1, 1.33, 1.72];             // $0.018 / $0.024 / $0.031 for METAL
const SUB_CENTERS = [
  { x: 200, y: 330 }, { x: 410, y: 330 }, { x: 620, y: 330 },
  { x: 200, y: 640 }, { x: 410, y: 640 }, { x: 620, y: 640 }
];
const SUB_COUNTS = [11, 11, 11, 11, 10, 10];
const CLUSTER_STATE = {};   // pid -> { family: -1|idx, mode, phase }
const clusterForceAt = {};  // pid -> timestamp of the one-time 1s aggregation
const clusterNextAt = {};   // pid -> timestamp of the next 3s auto toggle

function clusterState(pid) {
  // 'waiting' = L1 has not been reached via the TOC yet.
  if (!CLUSTER_STATE[pid]) CLUSTER_STATE[pid] = { family: -1, mode: 'separate', phase: 'waiting' };
  return CLUSTER_STATE[pid];
}
/* "Current first view" — L1: the side TOC moves onto Simi-Part (from another
   project, another tab, or a reload); L2: entering a family. Both levels then
   run the SAME script: Separate → forced Aggregate after 1s whatever the user
   does → toggle every 3s only while the pointer is OUTSIDE .app-main. */
function armClusterFirstView(pid, family) {
  const st = clusterState(pid);
  st.family = family;
  st.mode = 'separate';
  st.phase = 'initial';
  clusterForceAt[pid] = Date.now() + 1000;
  clusterNextAt[pid] = Infinity;
  const b = document.querySelector(`.browser.is-cluster[data-product="${pid}"]`);
  if (b && b.isConnected) paintCluster(b);
}
function onClusterTocFirstView(pid) {
  if (document.querySelector(`.browser.is-cluster[data-product="${pid}"]`)) armClusterFirstView(pid, -1);
}
function clusterSeed() {
  let x = 20261108;
  return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; };
}
function clusterCenters() {
  /* Symmetric 2-3-2 on a 1000x1000 canvas. The L1 hint now sits ABOVE
     METAL, so the clusters keep their original balanced shape. */
  return [
    { x: 320, y: 210 }, { x: 680, y: 210 },
    { x: 170, y: 500 }, { x: 500, y: 500 }, { x: 830, y: 500 },
    { x: 320, y: 790 }, { x: 680, y: 790 }
  ];
}
function clusterScatter(total, cols, rows, x0, y0, w, h, rnd) {
  const cellW = w / cols, cellH = h / rows;
  const slots = Array.from({ length: cols * rows }, (_, k) => k);
  for (let k = slots.length - 1; k > 0; k--) {
    const q = Math.floor(rnd() * (k + 1));
    const t = slots[k]; slots[k] = slots[q]; slots[q] = t;
  }
  return slots.slice(0, total).map(k => ({
    x: x0 + (k % cols + 0.5) * cellW + (rnd() - 0.5) * cellW * 0.58,
    y: y0 + (Math.floor(k / cols) + 0.5) * cellH + (rnd() - 0.5) * cellH * 0.58
  }));
}
function clusterSpiral(cx, cy, count, radius, rnd, squash = 0.85) {
  const out = [];
  for (let j = 0; j < count; j++) {
    const a = j * 2.399963;                 // golden-angle spiral
    const rad = 9 + Math.sqrt(j / count) * radius;
    out.push({
      x: cx + Math.cos(a) * rad + (rnd() - 0.5) * 9,
      y: cy + Math.sin(a) * rad * squash + (rnd() - 0.5) * 9
    });
  }
  return out;
}
function clusterNode(n, mode) {
  const x = mode === 'aggregate' ? n.ax : n.sx;
  const y = mode === 'aggregate' ? n.ay : n.sy;
  return `<circle class="cluster-node" data-sx="${n.sx.toFixed(1)}" data-sy="${n.sy.toFixed(1)}" data-ax="${n.ax.toFixed(1)}" data-ay="${n.ay.toFixed(1)}" r="${n.r.toFixed(1)}" fill="${n.color}" opacity="${n.op}" style="transform:translate(${x.toFixed(1)}px,${y.toFixed(1)}px)"/>`;
}
function gapPhrase(f) {
  return LANG === 'zh' ? `${I18N[LANG]['cluster.gap']} ${f.gap}`
                       : `${f.gap} ${I18N[LANG]['cluster.gap']}`;
}

function clusterSVG(st) {
  const fams = CLUSTER_FAMILIES, centers = clusterCenters();
  let linkSVG = '', haloSVG = '', labelSVG = '', familySVG = '', nodesSVG = '', extraSVG = '';
  if (st.family < 0) {
    const rnd = clusterSeed();
    const sep = clusterScatter(fams.length * CLUSTER_PER, 28, 16, 35, 25, 930, 950, rnd);
    const agg = centers.map(c => clusterSpiral(c.x, c.y, CLUSTER_PER, 78, rnd));
    const pairs = [[0,1],[0,2],[0,3],[1,3],[1,4],[2,3],[2,5],[3,4],[3,5],[3,6],[4,6],[5,6]];
    linkSVG = pairs.map(([a, b]) =>
      `<line x1="${centers[a].x}" y1="${centers[a].y}" x2="${centers[b].x}" y2="${centers[b].y}"/>`).join('');
    familySVG = fams.map((f, i) => {
      const dots = [];
      for (let j = 0; j < CLUSTER_PER; j++) {
        const k = i * CLUSTER_PER + j;
        dots.push(clusterNode({ sx: sep[k].x, sy: sep[k].y, ax: agg[i][j].x, ay: agg[i][j].y,
          r: 3.2 + rnd() * 2.6, color: f.color, op: 1 }, st.mode));
      }
      return `<g class="cluster-family" data-family="${i}" role="button" tabindex="0" aria-label="${esc(I18N[LANG]['cluster.enter'] + ' ' + (f[LANG] || f.en))}">
        <circle class="cluster-halo" cx="${centers[i].x}" cy="${centers[i].y}" r="92" fill="${f.color}"/>
        <g class="cluster-nodes">${dots.join('')}</g>
        <text class="cluster-label" x="${centers[i].x}" y="${centers[i].y + 105}">${esc(f[LANG] || f.en)}</text>
        <text class="cluster-gap-text" x="${centers[i].x}" y="${centers[i].y + 135}">${esc(gapPhrase(f))}</text>
        <circle class="cluster-hit" cx="${centers[i].x}" cy="${centers[i].y}" r="98" fill="transparent" pointer-events="all"/>
      </g>`;
    }).join('');
  } else {
    /* ── L2: one family, scattered / 6 supplier sub-clusters ── */
    const f = fams[st.family];
    const rnd = clusterSeed();
    const sep = clusterScatter(CLUSTER_PER, 12, 6, 50, 150, 900, 600, rnd);
    const agg = SUB_CENTERS.map((c, i) => clusterSpiral(c.x, c.y, SUB_COUNTS[i], 68, rnd));
    const nodes = [];
    let cursor = 0;
    SUB_CENTERS.forEach((c, i) => {
      for (let j = 0; j < SUB_COUNTS[i]; j++) {
        const pos = agg[i][j];
        nodes.push({ sx: sep[cursor].x, sy: sep[cursor].y, ax: pos.x, ay: pos.y,
          r: 5.0 + rnd() * 3.4, color: f.color, op: 1 });
        cursor++;
      }
    });
    nodesSVG = `<g class="cluster-nodes">${nodes.map(n => clusterNode(n, st.mode)).join('')}</g>`;
    const l2pairs = [[0,1],[1,2],[3,4],[4,5],[0,3],[1,4],[2,5]];
    linkSVG = l2pairs.map(([a, b]) =>
      `<line x1="${SUB_CENTERS[a].x}" y1="${SUB_CENTERS[a].y}" x2="${SUB_CENTERS[b].x}" y2="${SUB_CENTERS[b].y}"/>`).join('');
    haloSVG = SUB_CENTERS.map(c =>
      `<circle class="cluster-halo" cx="${c.x}" cy="${c.y}" r="86" fill="${f.color}"/>`).join('');
    labelSVG = SUB_CENTERS.map((c, i) =>
      `<text class="cluster-sub-label" x="${c.x}" y="${c.y + 108}">${esc('G' + (i + 1))}</text>`).join('');

    /* Top-right sub-cluster: a callout + three lines to three vendor quotes,
       drawn like the horizontal lines in the Teams map. Shown only when the
       L2 view is aggregated (CSS handles the fade). */
    const topRight = agg[2].slice().sort((a, b) => a.y - b.y);
    const picks = [topRight[0], topRight[Math.floor(topRight.length / 2)], topRight[topRight.length - 1]];
    const vendorLines = picks.map((n, i) => {
      const price = '$' + (f.base * SUB_K[i]).toFixed(3);
      const label = `${I18N[LANG]['cluster.vendor']} ${'ABC'[i]} · ${price} ${I18N[LANG]['cluster.unit']}`;
      return `<line x1="${n.x.toFixed(1)}" y1="${n.y.toFixed(1)}" x2="975" y2="${n.y.toFixed(1)}"/>` +
             `<text class="cluster-vendor-label" x="850" y="${(n.y - 16).toFixed(1)}">${esc(label)}</text>`;
    }).join('');
    /* Borderless callout: the two SVG text lines stay here (so their size
       scales with the 1000x1000 viewBox exactly as before). The arrow is an
       HTML overlay built with the SAME markup/classes/CSS as the L1 hint —
       no more bare SVG <path> with a fixed 2px non-scaling stroke.
       Vendor lines inherit the family colour from --family-color. */
    extraSVG = `<g class="cluster-find">
        <text x="545" y="124">${esc(I18N[LANG]['cluster.found1'])}</text>
        <text x="545" y="154">${esc(I18N[LANG]['cluster.found2'])}</text>
      </g>
      <g class="cluster-vendor-lines" style="--family-color:${f.color}">${vendorLines}</g>`;
  }
  return `<svg class="cluster-svg" viewBox="0 0 ${CLUSTER_W} ${CLUSTER_H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(I18N[LANG]['cluster.stage'])}">
    <g class="cluster-links">${linkSVG}</g>
    <g class="cluster-halos">${haloSVG}</g>
    <g class="cluster-families">${familySVG}</g>
    ${nodesSVG}
    <g class="cluster-labels">${labelSVG}</g>
    ${extraSVG}
  </svg>`;
}

/* HTML overlays: the compact L1 hint above METAL, the identical L2 arrow
   (same .tab-hint / .cluster-l1-hint component, just repositioned), and the
   "looks clickable but deliberately does not navigate" chain below all parts. */
function clusterOverlays(st) {
  if (st.family < 0) {
    return `<button type="button" class="tab-hint cluster-l1-hint" data-family="0" title="${esc(I18N[LANG]['cluster.hint'])}" aria-label="${esc(I18N[LANG]['cluster.hint'])}">
      <span>${esc(I18N[LANG]['cluster.hint'])}</span>
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16 10H4m0 0 5-5m-5 5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>`;
  }
  const f = CLUSTER_FAMILIES[st.family];
  const chain = `${gapPhrase(f)} → ${I18N[LANG]['cluster.detail']} → ${I18N[LANG]['cluster.negotiate']}`;
  /* Exactly the L1 arrow markup: same classes, same 20x20 svg, same path and
     stroke-width. Only the outer positioning differs (scoped CSS below). */
  const arrow = `<span class="cluster-find-arrow tab-hint cluster-l1-hint" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none"><path d="M16 10H4m0 0 5-5m-5 5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>`;
  return arrow + `<a href="#" class="cluster-detail-link" data-noop title="${esc(I18N[LANG]['cluster.preview'])}">${esc(chain)}</a>`;
}
function clusterStageHTML(st) {
  return clusterSVG(st) + clusterOverlays(st);
}
function clusterControlsHTML(st) {
  const btn = m => `<button type="button" data-mode="${m}" class="${m === st.mode ? 'active' : ''}" aria-pressed="${m === st.mode}">${esc(I18N[LANG]['cluster.' + m])}</button>`;
  const back = st.family >= 0
    ? `<button type="button" class="cluster-back" data-cluster-back><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>${esc(I18N[LANG]['cluster.back'])}</button>`
    : '';
  const f = st.family >= 0 ? CLUSTER_FAMILIES[st.family] : null;
  const count = !f
    ? `${I18N[LANG]['cluster.count']} · ${CLUSTER_VENDOR_TOTAL} ${I18N[LANG]['cluster.vendorsWord']}`
    : `${f[LANG] || f.en} · ${f.parts} ${I18N[LANG]['cluster.parts']} · ${f.vendors} ${I18N[LANG]['cluster.vendorsWord']}`;
  return `<div class="cluster-controls">${back}<div class="cluster-mode" role="group" aria-label="${esc(I18N[LANG]['cluster.stage'])}">${btn('aggregate')}${btn('separate')}</div><span class="cluster-count">${esc(count)}</span></div>`;
}
function clusterBrowserHTML(p) {
  const st = clusterState(p.id);
  return browserFrame(p, {
    top: clusterControlsHTML(st),
    body: `<div class="cluster-stage" data-mode="${st.mode}" data-view="${st.family < 0 ? 'all' : 'family'}">${clusterStageHTML(st)}</div>`,
    extra: 'is-cluster', sideActive: 2   // 3rd rail icon = workbench, not a dashboard
  });
}
/* Re-paint controls + canvas when the interaction level changes. */
function paintCluster(browser) {
  const st = clusterState(browser.dataset.product);
  const controls = browser.querySelector('.cluster-controls');
  if (controls) controls.outerHTML = clusterControlsHTML(st);
  const stage = browser.querySelector('.cluster-stage');
  if (stage) {
    stage.innerHTML = clusterStageHTML(st);
    stage.dataset.mode = st.mode;
    stage.dataset.view = st.family < 0 ? 'all' : 'family';
    positionClusterArrows(stage.parentElement || stage);
  }
}
function applyClusterMode(browser, mode) {
  if (!browser || (mode !== 'aggregate' && mode !== 'separate')) return;
  const pid = browser.dataset.product, st = clusterState(pid);
  st.mode = mode;
  browser.querySelectorAll('.cluster-mode button').forEach(b => {
    const on = b.dataset.mode === mode;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', String(on));
  });
  const stage = browser.querySelector('.cluster-stage');
  if (stage) stage.dataset.mode = mode;
  browser.querySelectorAll('.cluster-node').forEach(node => {
    const x = mode === 'aggregate' ? node.dataset.ax : node.dataset.sx;
    const y = mode === 'aggregate' ? node.dataset.ay : node.dataset.sy;
    node.style.transform = `translate(${x}px, ${y}px)`;
  });
}
function enterClusterFamily(browser, idx) {
  if (!browser || idx < 0 || idx >= CLUSTER_FAMILIES.length) return;
  armClusterFirstView(browser.dataset.product, idx);   // L2 entry = a new first view
}
function exitClusterFamily(browser) {
  if (!browser) return;
  const pid = browser.dataset.product, st = clusterState(pid);
  st.family = -1;
  st.mode = 'aggregate';
  st.phase = 'running';
  clusterNextAt[pid] = Date.now() + AUTOPLAY_MS;
  paintCluster(browser);
}
/* One shared tick for L1 and L2. Polled at 250ms so the 1s forced switch and
   the 3s cycle land accurately; no per-project timers survive a re-render.
   Phase map: waiting (TOC not on Simi-Part) → initial (1s force pending) →
   running (3s hover-gated toggling). A manual mode click only changes state;
   it does NOT cancel the forced switch or stop the later auto cycle. */
function clusterTick() {
  if (document.hidden) return;
  const now = Date.now();
  document.querySelectorAll('.browser.is-cluster').forEach(browser => {
    const pid = browser.dataset.product, st = clusterState(pid);
    if (st.phase === 'waiting') return;
    if (st.phase === 'initial') {
      if (now >= (clusterForceAt[pid] || 0)) {
        st.phase = 'running';
        applyClusterMode(browser, 'aggregate');   // forced: ignores hover / clicks
        clusterNextAt[pid] = now + AUTOPLAY_MS;
      }
      return;
    }
    const main = browser.querySelector('.app-main');
    const hovered = !!main && main.matches(':hover');
    const box = browser.getBoundingClientRect();
    const offscreen = box.bottom <= 0 || box.top >= window.innerHeight;
    if (hovered || offscreen) { clusterNextAt[pid] = now + AUTOPLAY_MS; return; }
    if (now < (clusterNextAt[pid] || 0)) return;
    applyClusterMode(browser, st.mode === 'aggregate' ? 'separate' : 'aggregate');
    clusterNextAt[pid] = now + AUTOPLAY_MS;
  });
}


/* The L2 arrow is the SAME HTML component as the L1 hint, so it lives in the
   HTML layer rather than the 1000x1000 SVG. Its ORIGINAL position (before the
   component swap) was the arrow centre at viewBox point (620, 214) — i.e. just
   under the left part of the two-line callout, NOT under the text's midpoint.
   Map that fixed SVG point through the real CTM so every letterbox / viewport
   lands on exactly the same spot as before. */
function positionClusterArrows(root = document) {
  root.querySelectorAll('.cluster-stage').forEach(stage => {
    const arrow = stage.querySelector('.cluster-find-arrow');
    const svg = stage.querySelector('svg.cluster-svg');
    if (!arrow || !svg || !svg.getScreenCTM) return;
    const sr = stage.getBoundingClientRect();
    const pt = svg.createSVGPoint();
    pt.x = 620; pt.y = 184;
    const s = pt.matrixTransform(svg.getScreenCTM());
    arrow.style.left = (s.x - sr.left) + 'px';
    arrow.style.top = (s.y - sr.top) + 'px';
  });
}


/* ── Registration: the shell only sees this object. ───────────────────── */
window.PortfolioDemos.cluster = {
  render: clusterBrowserHTML,
  onDomainEnter(p) {
    CLUSTER_STATE[p.id] = { family: -1, mode: 'separate', phase: 'waiting' };
    delete clusterForceAt[p.id];
    delete clusterNextAt[p.id];
  },
  onClick(e) {
    const noop = e.target.closest('.cluster-detail-link[data-noop]');
    if (noop) { e.preventDefault(); return true; }   // looks like a link, goes nowhere
    const family = e.target.closest('.browser.is-cluster [data-family]');
    if (family) { enterClusterFamily(family.closest('.browser'), Number(family.dataset.family)); return true; }
    const back = e.target.closest('[data-cluster-back]');
    if (back) { exitClusterFamily(back.closest('.browser')); return true; }
    const modeBtn = e.target.closest('.cluster-mode button[data-mode]');
    if (modeBtn) { applyClusterMode(modeBtn.closest('.browser'), modeBtn.dataset.mode); return true; }
    return false;
  },
  onKeydown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return false;
    const family = e.target.closest('.browser.is-cluster [data-family]');
    if (!family) return false;
    e.preventDefault();
    enterClusterFamily(family.closest('.browser'), Number(family.dataset.family));
    return true;
  },
  onRender: positionClusterArrows,
  onResize: positionClusterArrows,
  onTocFirstView(id) { if (id === 'simipart') onClusterTocFirstView(id); },
  tickFast: clusterTick
};
