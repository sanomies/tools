/* ─────────────────────────────────────────────────────────────
   Onu Sano · Tööriistad — shared page transition behaviour
   Pairs with transition.css. Two jobs, both on `pagereveal`:

   1. Direction — tag Back/Forward traversals so the slide reverses.
   2. Auto-choreography — on FORWARD entry into a tool, find the tool's
      layout regions, measure where each sits, and let each animate in from
      its nearest edge (left/right/top/bottom, or a pop for centred ones),
      0.1s apart. This makes every tool — including ones added later — enter
      the same way with zero per-tool setup.

   Opt-outs / overrides:
     • The launcher (has #toolGrid) is skipped — it names its own pieces.
     • A tool with `data-vt-manual` on <html> is skipped (it choreographs
       itself; see as-video-editor).
     • Put `data-vt="left|right|top|bottom|pop"` on a region to force its
       direction instead of the measured one.
   ───────────────────────────────────────────────────────────── */
(function () {
  var MAX = 8; // regions animated individually; must match transition.css

  function isBack() {
    try {
      var a = window.navigation && navigation.activation;
      if (a && a.navigationType === "traverse") {
        return a.entry.index < (a.from ? a.from.index : -1);
      }
      var n = performance.getEntriesByType("navigation")[0];
      return !!(n && n.type === "back_forward");
    } catch (_) { return false; }
  }

  function autoEligible() {
    return !document.getElementById("toolGrid") &&                 // not the launcher
           !document.documentElement.hasAttribute("data-vt-manual"); // not self-choreographed
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
      out.push({ el: c, rect: r, children: null });
    }
    return out;
  }

  /* Walk the layout: descend into big multi-child containers so we reach the
     real panels/regions rather than one page-filling wrapper. */
  function collect(el, depth, out) {
    var kids = regionsOf(el), vpArea = innerWidth * innerHeight;
    for (var i = 0; i < kids.length && out.length < MAX; i++) {
      var k = kids[i], area = k.rect.width * k.rect.height;
      var grand = regionsOf(k.el);
      if (depth < 2 && grand.length >= 2 && area > vpArea * 0.16) {
        collect(k.el, depth + 1, out);
      } else {
        out.push(k);
      }
    }
  }

  function direction(rect) {
    var vw = innerWidth, vh = innerHeight;
    var wide = rect.width > vw * 0.5, tall = rect.height > vh * 0.5;
    var cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    if (wide && !tall) return cy < vh / 2 ? "top" : "bottom";     // horizontal strip
    if (tall && !wide) return cx < vw / 2 ? "left" : "right";     // vertical column
    var l = rect.left, r = vw - rect.right, t = rect.top, b = vh - rect.bottom;
    var m = Math.min(l, r, t, b);
    if (m > Math.min(vw, vh) * 0.12) return "pop";                // clearly centred
    if (m === l) return "left";
    if (m === r) return "right";
    if (m === t) return "top";
    return "bottom";
  }

  function choreograph(vt) {
    var regions = [];
    collect(document.body, 0, regions);
    if (!regions.length) return;
    regions.forEach(function (k, i) {
      var forced = k.el.getAttribute && k.el.getAttribute("data-vt");
      var dir = forced || direction(k.rect);
      k.el.style.viewTransitionName = "auto-" + dir + "-" + i;
    });
    // Clear the names once the transition is over, so return trips and repeat
    // visits start clean (and never leave stale names on the live DOM).
    var clear = function () {
      regions.forEach(function (k) { k.el.style.viewTransitionName = ""; });
    };
    if (vt.finished && vt.finished.finally) vt.finished.finally(clear);
    else setTimeout(clear, 1600);
  }

  window.addEventListener("pagereveal", function (e) {
    if (!e.viewTransition) return;
    if (isBack()) { e.viewTransition.types.add("back"); return; }
    if (!autoEligible()) return;
    try {
      e.viewTransition.types.add("tool-enter");
      choreograph(e.viewTransition);
    } catch (_) {}
  });
})();
