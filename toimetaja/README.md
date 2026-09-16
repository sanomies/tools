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
- **Photos** — click an empty cell, or upload / drop / paste any number at once.
  The first file goes to the cell you dropped it on or clicked (a single file from
  the upload button goes to the selected cell), the rest spill into the empty
  cells in numbering order — and when the grid runs out of room it grows to the
  grid for that many photos (`BATCH_GRID`: two columns, three columns, 2×2,
  3 + 2), so four photos dropped onto *Üks pilt* come out as a four-photo
  collage. Several files from the upload button or the clipboard only ever add:
  they fill empty cells and never replace the selected photo. Photos already on
  the board keep their cells. A collage holds at most five photos; the hint says
  how many were left out. A single photo onto a full grid still asks which cell
  to replace. Drag to pan, wheel to zoom (anchored on the cursor), rotate from
  the cell toolbar or `r`, double-click or *Täida lahter* to reset. Drag a photo
  across into another cell to swap the two.
- **Pool (Pildipank)** — the outlined strip under the toolbar, as wide as the
  board, parks photos without putting them on the board. Empty, it shows its name
  and a hint; the `+` tile opens the picker, or drop files straight onto the strip.
  Each tile is dragged onto a cell (replacing what is there) or onto a
  face ring, with the same ghost and drop highlight as a desktop drop; a click puts
  it into the selected ring or cell, else the first empty cell. Photos stay in the
  pool after use, dimmed with a tick while they sit in a visible cell or ring, so
  they can be swapped back in; `×` on hover removes one, *Tühjenda* empties the
  pool. The pool keeps only the file handle and a `POOL_THUMB` px thumbnail, so it
  costs almost nothing however many photos it holds; a photo is decoded like any
  picked file when placed. Duplicates (same name, size and date) are skipped.
- **Elements** — click *Tsitaat*, *Nägu* or *Hägu* in the sidebar, or drag one straight
  onto the board where you want it. Drag to move; resize
  with the corner handle, the wheel or `+`/`-`; arrows nudge, `Delete` removes
  (the element shrinks and fades out). A new face ring
  starts empty: its camera button opens the picker, or a photo is dropped onto the
  ring, dragged in from the pool, or pasted while the ring is selected. A ring
  holds one photo: if several files
  land on it, the first becomes the face and the rest go into the cells. The
  upload button with several files always fills the cells, even with a ring
  selected.
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
| `POOL_THUMB` | `160` | pool tile thumbnail edge; the pool holds only thumbnails and file handles |
| `GAP` | `5` | seam width between cells, board px |
| `CELL_MAX_ZOOM` | `8` | how far a cell photo can be zoomed in |
| `MAX_CELLS` / `BATCH_GRID` | `5` / 2-cols · 3-cols · 2x2 · 3-left-2-right | most photos in a collage; the grid a batch grows the board to, by count |
| `SOURCE_MAX` | `2000` | long edge kept per face photo |
| `DETECT_MAX` | `640` | long edge used for detection |
| `CONFIRM_MIN` | `60` | face confirmation threshold |
| `DEFAULTS` | Figma positions | where new elements land, as board fractions |
| `MIN_SIZE_F` / `MAX_SIZE_F` | `0.08` / `1.5` | element size range, × board height |
| `BLUR_R` | 9 % of the short edge | default blur ring radius |

`window.__toimetaja` exposes the state (`els`, `slots`, `pool`, selection),
`addElement`, `routeFiles`, `addToPool`, `setTemplate` and `exportPNG` for
debugging from the console.
