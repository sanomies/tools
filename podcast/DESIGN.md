# Design

## Theme

A neutral dark editor "chrome" (borrowed from the in-house *Geenius* banner editor) wrapped
around a fixed 1920×1080 compositing artboard. The chrome is intentionally desaturated and
recessive so the colorful podcast overlays are the only vivid thing on screen. One blue accent
carries selection and the primary action; nothing else competes.

Mood: a quiet, professional production tool — closer to a video editor's panel than a website.

## Color

Dark, near-neutral surfaces in two layers, plus a single saturated accent.

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#1d1d20` | App background / content surface |
| `--panel` | `#18181b` | Sidebar, secondary panel layer (slightly darker than bg) |
| `--border` | `#2a2a2e` | Hairline dividers, panel edges |
| `--surface-control` | `#34343a` | Button / slider-track fill |
| `--surface-control-hover` | `#404048` | Button hover |
| `--accent` | `#5767ff` | Active selection, primary action, focus, guides-adjacent |
| `--accent-hover` | `#4555e0` | Primary button hover |
| `--ink` | `#e8e8ed` | Primary text |
| `--ink-2` | `#c8c8d0` | Secondary text (adjustment labels) |
| `--ink-3` | `#b8b8c0` | Tertiary text (template labels) |
| `--muted` | `#86868b` | Section headers, hints, value readouts, decorative icons |
| `--guide` | `#ff2bbd` | Smart-guide snap lines (transient, high-visibility only) |
| `--canvas` | `#000` | Artboard background (behind the user photo) |

The backdrop behind the canvas + bottom controls is one continuous
`radial-gradient(circle at 50% 30%, #2a2a2e, #1d1d20 70%)` so there is no seam between the
canvas area and the controls.

Contrast: `--muted` clears AA (≥4.5:1) on both `#1d1d20` (~4.6:1) and `#18181b` (~4.9:1).
Keep secondary text at `--muted` or lighter; never go below it for real text.

## Typography

- **Family:** Inter (Google Fonts), with `-apple-system, system-ui` fallback. One family only.
- **Scale (fixed px, product register — no fluid clamps):**
  - Section header / eyebrow: 11px, 600, uppercase, `letter-spacing: 0.7px`, `--muted`.
  - Body / button: 13px, 500.
  - Adjustment label: 12px, 500, `--ink-2`. Value readout: 11px, `tabular-nums`, `--muted`.
  - Template label: 11px, 500, `--ink-3` (→ `#fff` when active).
- `font-variant-numeric: tabular-nums` on numeric readouts so slider values don't jitter.

## Components

Shape language: **pill buttons** (`border-radius: 999px`), **6px-radius cards** (thumbnails),
2px borders for selection states.

- **Button** (`.btn`): `#34343a` fill, `#4a4a4e` border, pill. States: default, hover
  (`#404048`), active (`#2c2c30`), disabled (opacity 0.5). **Primary** variant = accent fill,
  white text. **Icon-toggle** active variant = accent fill. Every interactive control needs a
  visible `:focus-visible` ring in the accent color.
- **Template thumbnail** (`.thumb`): 16:9 overlay-on-black preview, 2px border, 6px radius.
  States: default (`#2f2f33` border), hover (`#5a5a62` + 1px lift), active/selected (accent
  border). It is a single-select control and must be keyboard-operable.
- **Slider** (`.adjust-slider`): 4px `#34343a` track, 14px round accent thumb with a 2px panel
  ring. Snaps to the neutral center (100). Disabled until a photo is loaded.
- **Selection chrome:** 2px accent box with 8 white square resize handles (2px accent border).
  Handles enlarge to 22px on touch.
- **Smart guides:** 1px `--guide` lines, shown only transiently while dragging/resizing.

## Layout

Three-zone app shell, structural (not fluid):

- **Left sidebar** (228px): "Podcastid" header → scrollable template gallery → pinned photo-
  adjustment panel ("Muuda") below.
- **Main column** (`<main>`): canvas area (the scaled artboard, centered) above a bottom bar.
- **Floating overlays on the canvas:** primary export top-right (fixed), logo top-center,
  empty-state hint bottom-center (before first upload only).
- **Bottom bar:** centered upload + fit tools; copyright at right.

Responsive is structural: at ≤768px the shell stacks (sidebar becomes a horizontal template
strip on top, adjustment panel collapses behind a chevron by default), the bottom bar centers,
and touch targets grow to ≥44px. No fluid typography.

## Motion

Minimal and state-serving (150–250ms). Thumbnail border/lift on hover (0.1–0.15s), chevron
rotate on expand (0.2s). No page-load choreography, no decorative motion. All transitions and
transforms collapse to instant under `prefers-reduced-motion: reduce`.

## Export

The download is a manual 2D-canvas composite at exactly 1920×1080: black fill → user photo
drawn with the same `ctx.filter` string as the live CSS `filter` (brightness/contrast/
saturate/grayscale) → overlay layer(s) on top → `toBlob('image/png')`. Preview and export use
the identical filter chain by construction.
