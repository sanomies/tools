# Product

## Register

product

## Users

Delfi Meedia editorial and production staff in Estonia who produce cover images for
the *Onu Sano* family of podcasts. They sit down with one job: take a host/guest photo
and turn it into a correct, on-brand 1920×1080 thumbnail for a specific show. They are
not designers and are not in a design tool — they want the framing done in well under a
minute and then back to publishing.

## Product Purpose

A self-hosted replacement for the original Framer "Bänneripigistaja" (banner squeezer),
which was an unmaintainable no-code build. This tool keeps the *real* podcast overlay
templates (14 shows) and the same core flow — drop a photo behind a branded overlay,
frame it, export a pixel-exact 1920×1080 PNG — but as a single maintainable vanilla-JS
file with no external runtime dependencies. Success is a producer making an on-brand
thumbnail for any show, correctly framed, without opening Photoshop or Figma.

## Brand Personality

Utilitarian, quiet, precise. This is editorial production infrastructure, not a marketing
surface. Three words: **calm, exact, invisible.** The chrome should never compete with the
colorful podcast artwork it frames — neutral dark tooling so the show overlays are the only
saturated thing on screen. The interface speaks Estonian, like the people using it.

## Anti-references

- The original Framer "Bänneripigistaja" — opaque, unmaintainable, no source.
- Generic "AI SaaS": gradient-text headings, glassmorphism, identical icon-card grids,
  decorative motion. None of it serves a framing task.
- Any chrome saturated or loud enough to fight the podcast overlays for attention.
- Mixed-language UI (half English, half Estonian) — reads as unfinished.

## Design Principles

1. **The artwork is the hero.** Chrome stays neutral dark; the only saturated color on
   screen (besides the show overlay) is the single accent for the active selection and the
   primary action.
2. **The tool disappears into the task.** Earned familiarity over novelty — standard
   affordances (upload button, drag-to-move, resize handles, sliders) behave exactly as
   expected so nothing needs explaining.
3. **What you see is what you export.** The live preview filter chain is identical to the
   canvas export chain; no surprises in the downloaded file.
4. **One obvious primary action per state.** Upload when empty; export when ready. Secondary
   tools never shout louder than the current primary.
5. **Estonian, end to end.** Every user-facing string is Estonian; consistency is correctness.

## Accessibility & Inclusion

- WCAG 2.1 AA contrast for all text and meaningful UI (≥4.5:1 body, ≥3:1 large/UI).
- Full keyboard operability: every control reachable and activatable by keyboard,
  including template selection, with a visible focus indicator on a dark theme.
- Respect `prefers-reduced-motion` (transitions and transforms reduced to instant/crossfade).
- Touch targets ≥44×44px on touch viewports.
- `lang="et"` and dark `color-scheme` declared so assistive tech and native controls behave.
