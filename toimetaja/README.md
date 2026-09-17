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
  starts empty: the upload button in its middle (or the camera in its toolbar)
  opens the picker, or a photo is dropped onto the ring, dragged in from the pool,
  or pasted while the ring is selected. A ring
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
- **Face photo** — the ring frames the detected face at a sensible zoom; the
  wheel over the ring tightens or loosens the crop. Dragging the ring moves the
  ring; to move or scale the *photo inside it*, double-click the ring or press the
  crop button in its toolbar. That is **reframe mode**: the rest of the board
  fades, the whole photo shows through at the ring's scale (the ring is a window
  onto it), the ring's outline goes dashed and its own handle is put away, and the
  photo gets the Podcast tool's selection chrome — an accent box with eight square
  handles. Drag the photo to slide it under the ring; drag a corner or edge handle
  to scale it, aspect locked, the opposite corner or edge staying put (⌥ scales
  about the centre); the wheel zooms, arrows nudge, `+`/`-` zoom; the crosshair
  button snaps back to the auto-frame. The photo can't be made smaller than the
  ring (the ring is always filled) nor tighter than 1.3 face widths, and it stops
  at its own edges. Double-click, Enter, Esc, the crop button again or a click
  anywhere off the photo ends the mode; so does selecting anything else. ⌥-drag
  is the shortcut: it slides the photo without entering the mode, and inside the
  mode it moves the ring instead. If no face is found the crop falls back to the
  centre and the ring opens in reframe mode straight away, with the hint saying
  so.
- **Per-element toolbar** — the face ring gets photo, badge toggle (hides the
  small quote mark on the ring), the reframe switch, recentre and remove; the
  blur ring type and strength and remove; the quote just remove.
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
detection and the `DROP` correction). ~130–150 ms per photo, fully offline.

The crop's zoom (`photo.zoom`, 0–100) runs from the photo's short edge (0) to
`ZOOM_MIN` face widths (100), geometrically; the wheel steps it, a handle drag in
reframe mode sets it from the box size. Circler's auto-frame — a window
`ZOOM_AUTO` faces wide, shrunk rather than slid when the face is near an edge —
only picks the starting zoom (`zoom0`, what the crosshair button returns to); the
range itself is never capped by it. Without a face the tight end is
`FACELESS_TIGHT` of the short edge.

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
| `ZOOM_MIN` / `ZOOM_AUTO` | `1.3` / `2.35` | tightest crop and the auto-frame, in face widths |
| `FACELESS_TIGHT` | `0.25` | tightest crop without a face, fraction of the short edge |
| `DEFAULTS` | Figma positions | where new elements land, as board fractions |
| `MIN_SIZE_F` / `MAX_SIZE_F` | `0.08` / `1.5` | element size range, × board height |
| `BLUR_R` | 9 % of the short edge | default blur ring radius |

`window.__toimetaja` exposes the state (`els`, `slots`, `pool`, selection,
`reframe`), `addElement`, `routeFiles`, `addToPool`, `setTemplate`, `setReframe`
and `exportPNG` for debugging from the console.
