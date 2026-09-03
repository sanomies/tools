# Onu Sano · Toimetaja

Arvamus (opinion) article images at 1920×1080: a photo — or a Kollaažer grid of
photos — with Hägustaja's blur rings for faces that must stay anonymous and the
two graphics from the Figma "Delfi Arvamus" frame on top, the **quote bubble**
and the **author's face in a ring**, all movable and scalable.

It is Kollaažer and Hägustaja folded into one: the board is Kollaažer's (every
grid template, white seams, cover-fit photos you pan, zoom, rotate and swap
between cells), the blur rings are Hägustaja's (blur or mosaic, feathered edge,
side handles to stretch into an oval), the elements float on it like
Hägustaja's circles (drag, corner handle, per-element toolbar), and the face is
centred automatically with the Newsletter tool's Circler detector. Default
format: a collage (the first grid, two columns).

## Using it

- **Format** — two chips: *Üks pilt* (one full-bleed 16:9 photo) and *Kollaaž*
  (the default). Picking *Kollaaž* switches to the last grid used and unfolds the
  gallery of all ten Kollaažer grids (the seams are always white); *Üks pilt*
  folds it away again. Photos stay in their slots when you switch back and
  forth.
- **Photos** — click an empty cell, or upload / drop / paste. The first file goes
  to the target (or selected) cell, the rest spill into the empty cells in
  numbering order. Drag to pan, wheel to zoom (anchored on the cursor), rotate
  from the cell toolbar or `r`, double-click or *Täida lahter* to reset. Drag a
  photo across into another cell to swap the two.
- **Elements** — click *Tsitaat*, *Nägu* or *Hägu* in the sidebar, or drag one straight
  onto the board where you want it. Drag to move; resize
  with the corner handle, the wheel or `+`/`-`; arrows nudge, `Delete` removes
  (the element shrinks and fades out). The face ring
  opens the file picker straight away; a photo can also be dropped onto a ring,
  or pasted while the ring is selected.
- **Blur ring (Hägu)** — an ellipse that blurs or pixelates the photo under it,
  with a soft edge that bleeds a little past the outline. Corner handle scales,
  the side handles stretch it into an oval, the toolbar switches blur / mosaic
  and sets the strength (*Tugevus*). New rings copy the last ring's settings.
  Rings sit between the photos and the graphics, so a quote or face ring on top
  stays crisp.
- **Face photo** — the ring frames the detected face at a sensible zoom. The
  wheel over the ring (or the *Foto* slider) tightens or loosens the crop,
  ⌥-drag reframes it, double-click snaps back to the face. If no face is found
  the hint says so and the crop falls back to the centre.
- **Per-element toolbar** — the face ring gets photo, badge toggle (hides the
  small quote mark on the ring), *Foto* zoom and remove; the blur ring type and
  strength and remove; the quote just remove.
- **Download** — `onusano-toimetaja-<format>-1920x1080.png`. Empty cells and
  empty rings export plain white; the grey upload placeholders are editor-only.

## How the graphics are drawn

Both elements are the Figma vectors drawn natively on the canvas (`QUOTE`,
`BADGE`, `FACE` at the top of the script), so they stay sharp at any size and
their shadows scale with them. Measured off the 1920×1080 frame: the bubble is a
386 px circle with a tail, the face a 500 px disc with a 14 px outside white
stroke, the badge 29 % of the face diameter sitting up-right on the ring.
Element sprites are cached per look, so dragging only re-blits.

The preview canvas is rendered at the screen's device resolution (board
coordinates stay 1920×1080; a scale transform does the rest) and sprites are
blitted on whole device pixels, so the vectors look as sharp on screen as in the
export. The export itself is a 1920×1080 PNG — the vectors are rasterised at that
size, which is the format the article image needs.

## Face detection

pico.js + the vendored `facefinder` cascade, exactly as in
`newsletter/` (see its README for the measurements behind the two-pass
detection and the `DROP` / `ZOOM_MIN` / `ZOOM_MAX` corrections). ~130–150 ms per
photo, fully offline.

| Constant | Default | What it does |
| --- | --- | --- |
| `PHOTO_MAX` | `4000` | long edge kept per cell photo |
| `GAP` | `5` | seam width between cells, board px |
| `CELL_MAX_ZOOM` | `8` | how far a cell photo can be zoomed in |
| `SOURCE_MAX` | `2000` | long edge kept per face photo |
| `DETECT_MAX` | `640` | long edge used for detection |
| `CONFIRM_MIN` | `60` | face confirmation threshold |
| `DEFAULTS` | Figma positions | where new elements land, as board fractions |
| `MIN_SIZE_F` / `MAX_SIZE_F` | `0.08` / `1.5` | element size range, × board height |
| `BLUR_R` | 9 % of the short edge | default blur ring radius |

`window.__toimetaja` exposes the state (`els`, `slots`, selection), `addElement`,
`routeFiles`, `setTemplate` and `exportPNG` for debugging from the console.
