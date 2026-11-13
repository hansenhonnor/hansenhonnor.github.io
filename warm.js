/* ==========================================================================
   warm.js — shared, low-priority image prewarming.

   Each module declares its own assets with PortfolioWarm.add(paths, rank);
   no module needs to know what another module owns. Draining starts only
   after window.load and runs two images per idle slice, so first paint and
   LCP never compete with the prewarm. Users on Save-Data / reduced-data
   keep normal on-demand loading.

   Image() objects are not inserted into the DOM, so no bitmap is decoded;
   only the bytes enter the browser cache. That is what removes the grey
   flash when a tab, a carousel slide or the lightbox is opened later.
   ========================================================================== */
(function () {
  'use strict';
  var BATCH = 2;   // images per idle slice; raise only for local / fast networks
  var queue = [], seen = Object.create(null), hold = [], started = false;

  function add(paths, priority) {
    (paths || []).forEach(function (p) {
      if (!p || seen[p]) return;
      seen[p] = 1;
      queue.push({ src: p, rank: priority || 9 });
    });
  }

  function idle(fn) {
    if (window.requestIdleCallback) window.requestIdleCallback(fn, { timeout: 1500 });
    else setTimeout(fn, 120);
  }

  function warm(src) {
    var im = new Image();
    if ('decoding' in im) im.decoding = 'async';
    hold.push(im);               // keep the loader alive until the bytes are cached
    im.src = src;
  }

  function drain() {
    if (!queue.length) return;
    queue.splice(0, BATCH).forEach(function (x) { warm(x.src); });
    if (queue.length) idle(drain);
  }

  function start() {
    if (started) return;
    started = true;
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if ((conn && conn.saveData) ||
        (window.matchMedia && window.matchMedia('(prefers-reduced-data: reduce)').matches)) return;
    queue.sort(function (a, b) { return a.rank - b.rank; });
    idle(drain);
  }

  window.PortfolioWarm = { add: add };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
