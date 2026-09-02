# Onu Sano · DIY

A simple launcher (hub) for the Onu Sano in-house tools. The root `index.html`
lists every tool by name in a minimal centered list — hovering (or keyboard-
focusing) a name enlarges it, shows its one-line description under the
list, and floats a small 16:9 screenshot of the tool alongside the
cursor; clicking opens that tool with a page-slide transition (incoming
tool slides in from the right, reverses on Back).

## Structure

```
index.html              → the launcher (Onu Sano® DIY)
assets/
  transition.css        → shared page transition (View Transitions API)
  transition.js         → shared transition direction (reverse on Back)
  icons/                → tool icons (80×80 tiles; shown by the description)
  previews/             → tool screenshots (960×540 JPEG; the hover card)
  onu-sano-face.svg, bg-texture.jpg, icon-1024x1024px.png
as-video-editor/        → each tool lives in its own folder, served as-is
podcast/
geenius-social/
toimetaja/              → Toimetaja: photo/collage + blur rings + quote bubble & face ring (replaces Kollaažer and Hägustaja; has its own README)
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
     name: "My tool",                        // shown on the list
     desc: "Üherealine eestikeelne kirjeldus.", // shown under the list on hover
     href: "my-tool/",                       // path from the root
     icon: "assets/icons/my-tool.svg",       // 80×80 tile, shown by the description
     shot: "assets/previews/my-tool.jpg",    // 16:9 shot, shown by the cursor
   },
   ```

   The list grows automatically.

4. **Shoot the preview** — see below.

## Tool screenshots

The card that follows the cursor shows a stored image, not a live page, so
it needs re-shooting whenever a tool's look changes. With the local server
running, capture at 16:9 and downscale:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --hide-scrollbars --window-size=1440,810 \
  --virtual-time-budget=8000 --screenshot=/tmp/shot.png \
  http://localhost:8000/my-tool/

sips -Z 960 --setProperty format jpeg --setProperty formatOptions 82 \
  /tmp/shot.png --out assets/previews/my-tool.jpg
```

Headless Chrome writes the PNG and then may not exit on its own — kill it
once the file appears.

## Local preview

Cross-document View Transitions only run over http(s), not `file://`:

```
python3 -m http.server 8000
```

then open <http://localhost:8000> in Chrome/Safari. Browsers without View
Transitions (e.g. Firefox) just navigate with no animation.
