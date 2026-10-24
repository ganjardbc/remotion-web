# GH Personal Brand — design system

A general-purpose system: one set of tokens and components meant to work
across website, app, social content, and pitch decks. Bold, high-contrast,
rounded. Orange calls out the one thing that matters on a screen; a light
"surface" carries most content, with an "on-ground" brand-blue mode for
marketing moments.

## How this is layered

1. **Foundations** (`foundations/`) — the tokens themselves: color, type, icons, spacing/padding, grid/breakpoints, elevation, motion, image treatment, logo usage. Reference material, not something you use directly in a page.
2. **Components** (`components/`) — built from those tokens, reusable in any medium: buttons, forms, cards, tags, navbar, modal, dropdown, tabs, alerts/toasts/tooltips, tables, progress, breadcrumb/pagination, avatar, empty states.
3. **`theme.json`** — every token above in plain JSON, for anything that isn't reading CSS directly: a Figma plugin, another AI agent, a build script that generates platform-specific tokens.

The rule that keeps this coherent: **components never invent their own colors, fonts, spacing, radius, shadow, or motion values** — they only reference the tokens in `styles.css`. Retune the look by editing tokens once; every component follows.

## How to use this

- Link the one stylesheet — `<link rel="stylesheet" href="styles.css">` — and take every value from its variables.
- Default page context is a **light surface** (`--color-surface`, dark text). Wrap a section in `.on-ground` for the brand-blue field instead (hero, deck slide, promo banner); components inside adapt automatically.
- Build page layout with `.container` (+ `.container-sm/md/lg` for narrower content) and the 12-column `.grid` + `.col-*` utilities — see `foundations/grid.html`.
- Icons are inline SVG built to the `.icon` classes — copy what you need from `foundations/icons.html`.
- Anything animated (hover, modal open, dropdown) should use the `--duration-*` / `--easing-*` tokens from `foundations/motion.html`, never a raw `ms` or bezier value.

## Color

Two grounds: `--color-ground` (brand blue, for marketing moments) and `--color-surface` (white, the default for everyday content). One accent for emphasis (`--color-accent`, orange), one for focus rings (`--color-accent-2`, purple). `--color-danger`/`--color-success` cover validation and confirmation states. Full detail and ramps in `foundations/color.html`.

## Dark mode

A third context — `.on-ground` is the brand-blue *marketing* field, `.dark` is a neutral near-black *interface* mode for an app or site's dark theme. Toggle it with a `dark` class on `<html>` or `<body>` (from a theme switcher — it's not automatic from OS preference). Because every generic component only ever reads `var(--color-surface-*)`, most of them re-theme for free; `.dark` only needs to override a handful of tokens plus a few genuinely dark-mode-specific adjustments (elevation via tint instead of shadow, link/outline contrast stepped to `accent-400`, alert/tag backgrounds swapped to translucent tints). See `foundations/dark-mode.html` for a live toggle demo and the full list of what changes vs. what stays identical.

## Type

Poppins throughout, two independent scales — `h1`–`h6` for real content, `.display-1/2/3` for glance-read headlines. Full scale in `foundations/type.html`.

## Icons

Stroke-based, Lucide-compatible, sized via `.icon-sm` through `.icon-xl`, colored via `currentColor`. Core set and usage in `foundations/icons.html`.

## Spacing, grid & elevation

One spacing scale (`--space-1`–`8`) drives every gap/margin/padding — see the real padding values used inside components in `foundations/layout.html`. Page-level layout uses `foundations/grid.html` (breakpoints, `.container`, 12-column grid). Shadow depth follows four steps explained in `foundations/elevation.html` — go up one step per layer of the UI (static card → hover/popover → dropdown/toast → modal).

## Motion

Three durations, three easings — never hand-write a transition value. See `foundations/motion.html` for what to reach for and when.

## Image & logo

`foundations/image.html` covers crop ratios (1:1 avatar, 4:5 post, 16:9 hero), radius per context, and the tinted-overlay pattern for text-over-photo. `foundations/logo.html` covers clear space, minimum size, and explicit misuse examples for the "GH" mark.

## Components

| Class | What it is |
| --- | --- |
| `.btn` + variants | Button, full states |
| `.field`/`.input`/`.textarea`/`.select`, `.checkbox`, `.radio` | Form controls |
| `.card`, `.tag` | Content card, label/chip |
| `.navbar` | Site/app header |
| `.modal-backdrop`/`.modal` | Dialog overlay |
| `.dropdown`/`.dropdown-menu`/`.dropdown-item` | Dropdown menu |
| `.tabs`/`.tab`/`.tab-panel` | Tabs |
| `.alert`, `.toast`, `.tooltip` | Feedback — inline, floating, and on-hover |
| `.table` | Data table |
| `.progress`/`.progress-bar`, `.spinner` | Progress & loading |
| `.breadcrumb`, `.pagination`/`.page-item` | Wayfinding |
| `.avatar` (+ sizes) | Generic user avatar — initials or photo, not the brand mark |
| `.empty-state` | Empty/zero-data state |
| `.badge` | The "GH" brand mark |
| `.icon` | Inline SVG icon |
| `.on-ground` | Context wrapper for the brand-blue field |

## Do

- One accent, one job: orange for emphasis/primary action, purple for focus rings only.
- Default to the light surface; reach for `.on-ground` deliberately.
- Step elevation up gradually with UI depth — don't jump from `--shadow-sm` straight to `--shadow-xl`.
- Use `--duration-fast` for small hover feedback, `--duration-slow` for modals/dropdowns opening.
- In `.dark`, let elevation come from `--color-surface-alt` tint rather than a shadow.

## Don't

- Don't hand-pick a hex, font, px, shadow, or duration outside the tokens.
- Don't use `.display-*` for ordinary UI headings, or `h1`–`h6` for a glance-read banner headline.
- Don't recolor, stretch, rotate, or desaturate the "GH" badge — see `foundations/logo.html` for explicit don'ts.
- Don't grayscale photos — this brand keeps full color; only crop ratio and radius are standardized.
- Don't confuse `.on-ground` (brand-blue marketing field) with `.dark` (neutral app dark mode) — they're different contexts for different jobs.

## Files

```
styles.css                    the only stylesheet — tokens + every component class
theme.json                    the same tokens as plain JSON, for non-CSS tooling
readme.md                     this guide
foundations/
  color.html                  ground vs. surface roles, accent ramps, semantic colors
  type.html                   h1–h6 scale + the display-1/2/3 scale
  icons.html                  icon sizes, core set, usage in buttons/tags
  layout.html                 spacing scale + real padding on actual components
  grid.html                   breakpoints, container widths, 12-column grid
  elevation.html               shadow scale and when to step up
  motion.html                  duration/easing tokens and when to use each
  image.html                   crop ratios, radius per context, overlay pattern
  logo.html                    clear space, minimum size, misuse examples
  dark-mode.html                live toggle demo — what changes vs. stays identical
components/
  button.html, form.html, card.html, tag.html, navbar.html
  modal.html, dropdown.html, tabs.html
  feedback.html                alert, toast, tooltip
  table.html, progress.html
  wayfinding.html               breadcrumb, pagination
  avatar.html, empty-state.html
assets/
  gh-logo.png                  the brand mark file
```
