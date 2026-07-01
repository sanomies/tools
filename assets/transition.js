/* ─────────────────────────────────────────────────────────────
   Onu Sano · Tööriistad — shared page transition behaviour
   Pairs with transition.css.

   On every tool page, both when ENTERING (pagereveal) and LEAVING (pageswap),
   we find the tool's layout regions, measure where each sits, and name it
   auto-<dir>-<i>. transition.css then animates each region from/to its nearest
   edge (left/right/top/bottom, or a centred "pop"/zoom), 0.1s apart. Because
   the same names are used both ways, leaving is the exact reverse of entering.

   Forward vs. back needs no detection: a tool's regions are the NEW snapshot on
   the way in and the OLD snapshot on the way out, and transition.css keys the
   entrance off ::view-transition-new(...) and the exit off ::…-old(...).

   Skips: the launcher (has #toolGrid — it names its own pieces) and any page
   with `data-vt-manual` on <html>. Override a region with
   `data-vt="left|right|top|bottom|pop"`.
   ───────────────────────────────────────────────────────────── */
(function () {
  var MAX = 8; // regions animated individually; must match transition.css

  function isTool() {
    return !document.getElementById("toolGrid") &&
           !document.documentElement.hasAttribute("data-vt-manual");
  }

  function regionsOf(el) {
    var out = [];
    for (var i = 0; i < el.children.length; i++) {
      var c = el.children[i], t = c.tagName;
      if (t === "SCRIPT" || t === "STYLE" || t === "LINK" || t === "TEMPLATE" || t === "NOSCRIPT") continue;
      var cs = getComputedStyle(c);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;
      var r = c.getBoundingClientRect();
      if (r.width < 28 || r.height < 28) continue;
      out.push({ el: c, rect: r });
    }
    return out;
  }

  /* Descend into big multi-child containers so we reach the real panels/regions
     rather than one page-filling wrapper. */
  function collect(el, depth, out) {
    var kids = regionsOf(el), vpArea = innerWidth * innerHeight;
    for (var i = 0; i < kids.length && out.length < MAX; i++) {
      var k = kids[i], area = k.rect.width * k.rect.height;
      if (depth < 2 && regionsOf(k.el).length >= 2 && area > vpArea * 0.16) {
        collect(k.el, depth + 1, out);
      } else {
        out.push(k);
      }
    }
  }

  function direction(rect) {
    var vw = innerWidth, vh = innerHeight;
    var wide = rect.width > vw * 0.45, tall = rect.height > vh * 0.45;
    if (wide && tall) return "pop";                              // dominant region (a canvas) → zoom
    if (wide && !tall) return (rect.top + rect.height / 2) < vh / 2 ? "top" : "bottom"; // horizontal strip
    if (tall && !wide) return (rect.left + rect.width / 2) < vw / 2 ? "left" : "right"; // vertical column
    var l = rect.left, r = vw - rect.right, t = rect.top, b = vh - rect.bottom;
    var m = Math.min(l, r, t, b);
    if (m > Math.min(vw, vh) * 0.12) return "pop";               // small & central
    if (m === l) return "left";
    if (m === r) return "right";
    if (m === t) return "top";
    return "bottom";
  }

  function nameRegions() {
    var regions = [];
    collect(document.body, 0, regions);
    // The biggest region (the canvas / main stage) always zooms from the center,
    // so it never sweeps across — and overlaps — the surrounding panels.
    var maxArea = -1, canvasIdx = -1;
    regions.forEach(function (k, i) {
      var a = k.rect.width * k.rect.height;
      if (a > maxArea) { maxArea = a; canvasIdx = i; }
    });
    regions.forEach(function (k, i) {
      var forced = k.el.getAttribute && k.el.getAttribute("data-vt");
      var dir = forced || (i === canvasIdx ? "pop" : direction(k.rect));
      k.el.style.viewTransitionName = "auto-" + dir + "-" + i;
    });
    return regions;
  }

  function handle(e) {
    if (!e.viewTransition || !isTool()) return;
    try {
      var regions = nameRegions();
      var clear = function () {
        regions.forEach(function (k) { k.el.style.viewTransitionName = ""; });
      };
      if (e.viewTransition.finished && e.viewTransition.finished.finally) {
        e.viewTransition.finished.finally(clear);
      } else {
        setTimeout(clear, 1600);
      }
    } catch (_) {}
  }

  window.addEventListener("pagereveal", handle); // entering a tool → regions assemble in
  window.addEventListener("pageswap", handle);   // leaving a tool  → regions disassemble out
})();
