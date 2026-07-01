# Onu Sano · Tööriistad

A simple launcher (hub) for the Onu Sano in-house tools. The root `index.html`
lists every tool as a card; clicking one opens that tool with a page-slide
transition (incoming tool slides in from the right, reverses on Back).

## Structure

```
index.html              → the launcher (Onu Sano® Tööriistad)
assets/
  transition.css        → shared page transition (View Transitions API)
  transition.js         → shared transition direction (reverse on Back)
  icons/                → tool card icons (80×80 tiles)
  onu-sano-face.svg, bg-texture.jpg, icon-1024x1024px.png
as-video-editor/        → each tool lives in its own folder, served as-is
podcast/
geenius-social/
```

Served as a static site (e.g. GitHub Pages). All links are relative, so it
works both locally and under a project path like `…github.io/tools/`.

## Adding a new tool

1. **Drop the tool** into its own folder at the repo root, e.g. `my-tool/`,
   with its `index.html` and `assets/`.

2. **Give it the shared slide transition** — add these two lines inside the
   tool's `<head>` (note the `../` — tools are one level below the root):

   ```html
   <link rel="stylesheet" href="../assets/transition.css">
   <script src="../assets/transition.js"></script>
   ```

   > ⚠️ If a tool is re-exported/overwritten later, these two lines get wiped —
   > just add them back. Without them the tool won't animate.

   That's all a tool needs: `transition.js` automatically finds the tool's
   layout regions and animates each in from its nearest edge (left/right/top/
   bottom, or a "pop"/zoom for centred ones like a canvas), 0.1s apart — and
   leaving reverses it exactly. No per-tool setup. Optional overrides:
   - Put `data-vt="left|right|top|bottom|pop"` on a region to force its
     direction instead of the measured one.
   - Put `data-vt-manual` on `<html>` to opt a tool out of auto-choreography and
     drive the entrance yourself.

3. **List it on the launcher** — append one entry to the `TOOLS` array in the
   root `index.html`:

   ```js
   {
     name: "My tool",                        // card title
     desc: "Üherealine eestikeelne kirjeldus.", // Estonian one-liner
     href: "my-tool/index.html",             // path from the root
     icon: "assets/icons/my-tool.svg",       // 80×80 tile icon
   },
   ```

   Add the icon to `assets/icons/`. The grid re-flows automatically and the
   dashed "Tuleb veel" tile stays last.

## Local preview

Cross-document View Transitions only run over http(s), not `file://`:

```
python3 -m http.server 8000
```

then open <http://localhost:8000> in Chrome/Safari. Browsers without View
Transitions (e.g. Firefox) just navigate with no animation.
