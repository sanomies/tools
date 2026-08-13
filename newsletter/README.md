# Onu Sano · Newsletter

One page, two tools — **Uudiskiri** on top, **Circler** below — both running
entirely in the browser. No upload, no server, no network.

**Open `index.html`.** That's the whole thing: double-click it and it runs
straight off disk (`file://`). Serving it over HTTP works too, but nothing
requires it — there is not a single external request, so it behaves identically
offline.

---

## Circler — face-centred circular crops

Drop in photos, get **175 × 175 px circular PNGs** with the face centred.

At rest the tool is **just the dropzone**: a full-width delfi-lightgray well
with 8px rounded corners and a dashed outline, the white circular upload button
from Kollaažer's empty cells (Figma 814:1055), and a label. Drag a file over it
and it escalates to the sister tools' drop treatment — `3px dashed var(--ink)`
over a 4% ink wash.

The preview circle only appears once something is loaded, and then sits beside
the dropzone at matching height, so you can keep adding images. Remove them all
and it collapses back to the dropzone alone.

- **Upload / drop** one image or many; every drop adds to what's already loaded
- **Filmstrip** holds every image — click to select, `←`/`→` to step through,
  hover for the ✕ to remove one
- **Zoom** slider (right = tighter) works **per image**
- **Drag** the circle to nudge the framing; **double-click** to snap back to the face
- **Download** gives a PNG for a single image, or a ZIP of all of them

The preview is shown at **240 px and drawn straight from the source** at 2×
density, so you judge the face at its own resolution rather than squinting at an
upscaled 175 px export. It is therefore *not* 1:1 with the file you get — the
export is still exactly 175 × 175, from the same crop.

A red ring on a thumbnail means no face was found there, so the ones worth
checking are obvious at a glance. There is no success message: a found face
needs no announcement, and the line under the preview only appears when
something actually needs attention.

Outputs are named `<original-name>-circle-175x175.png`; the ZIP is
`onusano-circles-175x175.zip`. Duplicate names inside the ZIP get numbered
rather than overwriting each other.

### The smart bit

Face detection is [pico.js](https://github.com/tehnokv/picojs) (MIT) running the
vendored `facefinder` cascade — ~240 KB of decision trees, no WASM, no model
download, ~60–110 ms per photo. The detected face is placed at the exact centre
of the circle.

Two corrections sit on top of the raw detector, both measured against Apple
Vision's face boxes over a test set of portraits:

- pico's detection window sits high on the head, so the centre is dropped by
  **12%** of the window height.
- The window runs wider than the face, so the crop side is a multiple of the
  window rather than of the face itself (`ZOOM_MIN`/`ZOOM_MAX`).

When the ideal crop would overhang an edge, Circler **shrinks** the square
rather than sliding it, so the face stays centred. It only slides as a last
resort, for faces hard against the edge — and never invents pixels. A
consequence worth knowing: for a face near an edge the crop becomes
edge-limited, and past that point the zoom slider stops having an effect.

Verified end-to-end in headless Chrome: re-running an independent detector
(Apple Vision) over the exported crops puts every face within ~2% of dead
centre, and the face stays at offset (0, 0) from the circle's centre across the
entire zoom range.

### Known limits

`facefinder` is an **upright, front-facing** cascade. It reliably handles
headshots and portraits — including moderately tilted heads — but it will miss
faces in **profile** / strong three-quarter views, and **small or heavily
angled** faces in busy group shots.

On a miss the tool falls back to a centred square crop, says so in red under the
preview, and rings that thumbnail — so you always know which you got, and you
can drag to fix the framing yourself. If you want profile and group shots handled
automatically, swap the detector for MediaPipe BlazeFace (Apache-2.0); it's a
drop-in replacement for `detectFace()`, at the cost of ~2 MB of WASM and losing
`file://` support.

HEIC files can't be decoded by browsers — convert to JPEG first.

---

## Uudiskiri — Delfi newsletter banner

Type the issue number, get the banner with `NR {number} ({year})` burned into
the bottom-right corner. The year comes from the system clock.

- Non-digits are stripped as you type, so what's in the field is what gets drawn
- Export is at the banner's **native 600 × 120**, independent of display size
- Downloads as `uudiskiri-nr-{number}.png`

The label is **bold 16px Inter**, white, with a half-pixel dark offset behind it
for legibility — 16 px in from the right, 13 px up from the bottom, matching the
banners already sent out. Inter is self-hosted here and awaited via
`document.fonts.load()` before the first paint; the original Framer component
named Inter but never loaded it, so it silently rendered in system-ui.

To use different artwork, replace `assets/banner.png` — the canvas takes its
size from whatever image you drop in.

---

## Files

```
index.html               the page (both tools)
assets/pico.js           face detector, MIT, vendored unmodified
assets/facefinder.js     the cascade, base64-wrapped so it loads without fetch()
assets/banner.png        newsletter artwork, 600 × 120
assets/*.woff2           Google Sans Flex (UI) + Inter (baked into banners)
assets/*.png, *.svg      shared Onu Sano brand assets
```

The ZIP is written by hand (store method + CRC-32, ~60 lines) rather than
pulling in a library, which keeps the page dependency-free and offline.

`window.__circler` and `window.__banner` are exposed for debugging from the
console.

## Tuning

Constants at the top of each script block in `index.html`:

| Constant | Default | What it does |
| --- | --- | --- |
| `OUT` | `175` | export size in px |
| `PREVIEW` | `240` | on-screen preview size **and** dropzone height |
| `PREVIEW_SCALE` | `2` | preview backing store multiplier (retina detail) |
| `THUMB` | `52` | filmstrip thumbnail size (rendered at 2×) |
| `SOURCE_MAX` | `2000` | long edge held in memory per image |
| `DETECT_MAX` | `640` | long edge used for detection; accuracy plateaus above this |
| `MIN_FACE_FRAC` | `0.06` | smallest face to look for, as a share of the short edge |
| `QUALITY` | `50.0` | pico score threshold; below ~30 it starts inventing faces |
| `DROP` | `0.12` | downward centre correction |
| `ZOOM_MIN` / `ZOOM_MAX` | `1.3` / `3.4` | crop side as a multiple of the detection window |
| `PAD_RIGHT` / `PAD_BOTTOM` | `16` / `13` | banner label inset, in banner pixels |

Changing `OUT` is all it takes to move to another export size, and `PREVIEW`
resizes the dropzone and preview circle together — both are pushed into CSS
variables on boot, so the layout follows the script.
