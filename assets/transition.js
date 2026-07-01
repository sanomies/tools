/* ─────────────────────────────────────────────────────────────
   Onu Sano · Tööriistad — shared page transition direction
   Pairs with transition.css. Tags Back/Forward traversals so the
   slide reverses. Uses the Navigation API (reliable even on bfcache
   restores, where the performance navigation entry is stale), with a
   fallback to the performance navigation type.
   ───────────────────────────────────────────────────────────── */
(function () {
  window.addEventListener("pagereveal", function (e) {
    if (!e.viewTransition) return;
    var back = false;
    try {
      var a = window.navigation && navigation.activation;
      if (a && a.navigationType === "traverse") {
        back = a.entry.index < (a.from ? a.from.index : -1);
      } else {
        var n = performance.getEntriesByType("navigation")[0];
        back = !!(n && n.type === "back_forward");
      }
    } catch (_) {}
    if (back) e.viewTransition.types.add("back");
  });
})();
