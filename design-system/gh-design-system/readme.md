# GH Personal Brand — design system

A general-purpose system for one personal brand (content creator "GH"): one set of tokens and components meant to work across website, app, social content, and pitch decks. Modern and technical: blue-led, high-contrast, with crisp hairline borders, glow and a mono voice. Orange calls out the one thing that matters on a screen; a light "surface" carries most content, with an "on-ground" brand-blue mode for marketing moments.

**Source material**: this system was built from an uploaded folder (`gh-brand-system.zip`) containing `styles.css`, `theme.json`, and a set of foundation/component specimen HTML pages written by the brand owner. No Figma file, codebase, or slide deck was attached — everything below is derived from that one CSS system, which is treated as ground truth. There are no separate "products" (app vs. website) defined in the source, so no UI kit was built — the system is the generic component set itself, meant to be dropped into whatever surface comes next.

## How this is layered

1. **Foundations** (`tokens/`, cards under "Colors", "Type", "Iconography", "Spacing", "Layout", "Elevation", "Motion", "Image", "Brand", "Dark mode" in the Design System tab) — the tokens themselves.
2. **Components** (`components/`) — built from those tokens, reusable in any medium.
3. **`theme.json`** (in `uploads/gh-brand-system/`, kept as source reference) — the same tokens as plain JSON for non-CSS tooling.

Components never invent their own colors, fonts, spacing, radius, shadow, or motion values — they only reference the CSS custom properties in `styles.css`. Retune the look by editing tokens once; every component follows.

## How to use this

- Link `styles.css` and take every value from its variables; mount components from the compiled bundle.
- Default page context is a **light surface** (`--color-surface`, dark text). Wrap a section in `.on-ground` for the near-black field instead (hero, deck slide, promo banner).
- Icons are inline SVG built to the `.icon` classes.
- Anything animated should use the `--duration-*` / easing tokens, never a raw `ms` or bezier value.

## Content fundamentals

Source copy (in the specimen files) is Indonesian, casual, and second-person ("kamu" not "Anda") — e.g. helper text like *"Tulis nama kamu"*, button labels like *"Kirim"*, *"Hubungi"*. Tone is informal and direct, closer to talking to a friend than a corporate voice — contractions, no exclamation-mark enthusiasm, no emoji in UI copy. Content examples throughout (table rows, empty states) reference the brand owner's actual workflow: scheduling and publishing Instagram/TikTok content ("Konten IG #1", "Draft", "Published"). This is a **personal creator brand**, not a company — copy should read like one person talking about their own content pipeline, not an institutional "we".

No emoji are used anywhere in the source components or copy.

## Visual foundations

- **Color**: Two grounds — `--color-ground` (#0b0f1a, near-black, marketing canvases) and `--color-surface` (#ffffff, everyday content). **Primary is the brand blue** (`--color-primary`: primary buttons, links, active states, focus ring, progress). Orange `--color-accent` (#ff914d) is the highlight: one phrase, one control or one number per screen — never the default action color. `--color-accent-2` (#af67de) is a secondary accent. `--color-danger` / `--color-success` cover validation. Full 100–900 ramps exist for accent, accent-2 and `brand` (blue).
- **Type**: Poppins for headings and body, system mono (`--font-mono`) as the second voice for labels, overlines, tags, table headers, code, keys and numbers. **Case is dynamic**: `h1`–`h6` and `.display-1/2/3` (64/44/30px, extrabold) are mixed-case by default because all-caps is hard to read at length. Add `.is-upper` to a container (or set `--case-display` / `--case-label`) to switch display text and mono labels to uppercase for glance-read canvases like social posts and deck titles. Headline tracking is tight (-0.02em).
- **Spacing**: one 8-step scale (`--space-1` 8px → `--space-8` 96px) drives every gap, margin, and padding at every screen size — no separate mobile/desktop scale.
- **Backgrounds**: Flat color is the default. Tech touches are opt-in: `.bg-grid` and `.bg-dots` (faint patterns for hero areas), `--gradient-accent` (orange, one highlight at a time, e.g. `.text-gradient-accent`). The blue→purple `--gradient-brand` stays reserved for the logo mark. Photography is full-color; a translucent `--color-ground` (near-black) tint (~55%) is the standard text-over-photo overlay.
- **Animation**: Durations fast 100ms / base 160ms / slow 240ms; easings standard (`cubic-bezier(.2,.8,.2,1)`, a sharp ease-out), decelerate for entering, accelerate for exiting. Still no bounce or spring.
- **Hover / press states**: Primary steps one shade darker and gains a soft blue glow (`--glow-primary`); the orange `btn-accent` uses `--glow-accent`. Press goes one shade darker plus a 1px downward translate. `.card-glow` / `.card-glow-accent` add a border glow on hover. No opacity-based hover states.
- **Borders & shadows**: Hairline 1px borders in low-alpha ink, plus a faint top-edge highlight (`--highlight-inset`) on cards and primary buttons. Shadows are tighter, navy-tinted, four steps (`sm`→`xl`) mapped to depth: static card → hover/popover → dropdown/toast → modal. Never skip a step.
- **Corner radius**: `--radius-sm` 8px (buttons, inputs, tags), `--radius-md` 12px (cards, modals), `--radius-lg` 20px (large containers), `--radius-full` (pills, avatars, the logo badge).
- **Cards**: white surface, 1px low-alpha border, `--shadow-sm` at rest; `.card-interactive` rises to `--shadow-md` and lifts 2px on hover.
- **Layout**: mobile-first — plain rules apply from 0 up, `min-width` media queries override upward. One built-in breakpoint (768px, stacks the 12-column grid to full width); anything else is per-page. Max content width 1200px (`.container`), with `-sm`/`-md`/`-lg` variants for narrower content.
- **Transparency/blur**: Used for floating chrome only: `.surface-glass` (`--glass-bg` + `--glass-blur`) on the navbar, dropdown menu and modal backdrop. Do not use glass on content cards.
- **Dark mode**: The tech showcase context. `.dark` is a deep blue-black (`#0b0f1a`, alt `#121826`, raised `#1a2234`), toggled explicitly via class, never from OS preference. Depth comes from border brightness and tint, not shadow. Primary lifts to `#4a6fe0` and link/active text to `--color-primary-text`; alert and tag pastels become translucent tints. Orange, radius, spacing, motion and type never change. Light remains the default.

## Iconography

Stroke-based icons, 2px stroke weight, round caps/joins — explicitly built to be Lucide-compatible, but stored as **inline SVG** (not a font or a CDN dependency) so no icon library needs to load. Color always inherits via `currentColor`. Sized in four steps (`--icon-sm` 16px → `--icon-xl` 32px) that match the type scale; icons next to text use `sm`/`md`, never larger than the text beside them. No emoji, no unicode glyphs as icons, no PNG icon assets — everything is hand-drawn inline SVG in this stroke style. The core set copied into this system: arrow-right, check, close, chevron-right, search, menu, mail, user, calendar, external-link, plus, star.

## Video and reels

- **Every GH video pins a brand footer at the very bottom for its full duration**, on every scene, below the corner brackets, lifted 46px off the bottom edge. Render it once at the video root, outside the scene transitions, so it never slides or fades with a scene.
- **Left:** the GH logo (circular badge). 64px on 1080-wide portrait, 52px on landscape. Minimum 24px.
- **Right:** the TikTok and Instagram glyphs, then the handle `@ganjar_hadiatna`. Text is small (26px at 1080 wide) and regular weight (400). Icons 30px, same colour as the text.
- **Position:** the footer is lifted 46px from the bottom edge (`--video-footer-offset-bottom`) with 46px side padding (`--video-footer-padding-x`). Both are px at 1080 wide; scale them by `width / 1080` on other sizes.
- **Bar:** transparent, with no fill or border. 128px tall portrait / 96px landscape. The text and icons are white with `mix-blend-mode: difference`, so they read white on dark scenes and near-black on light ones. Keep the logo outside the blended element. Put the blend on the same element as its opacity, never on a parent that has opacity below 1.
- **The closing CTA stays in the last scene's content**, as its own element. Do not put the logo in the CTA.
- **Safe area (reels):** keep key content 200px from the top, 280px from the bottom and 80px from the sides. The footer sits in the bottom zone that platforms may cover, so never put essential text there.
- **Backgrounds:** near-black `.on-ground` by default for tech content, with the grid or dot field, soft glows and corner brackets. Alternate with light surface scenes for rhythm.
- **Case:** display text is mixed-case by default; opt into uppercase with `.is-upper`.
- Tokens: `tokens/video.css`. CSS helper: `.video-footer`.

## Logo

The "GH" mark (`assets/gh-logo.png`) sits on a fixed blue→purple gradient circle (`.badge`), never on its own. Clear space ≥0.5× the mark's own height on all sides. Minimum size 24px digital / 12mm print — below that the G+H monogram stops reading. Never desaturate the gradient, stretch it into a non-circle, swap the background color, or rotate it.

## Fonts

Poppins is self-hosted from `fonts/` (18 weight/italic files, `tokens/fonts.css`). `--font-mono` uses the system monospace stack (`ui-monospace, "SF Mono", "Courier New", monospace`) — no dedicated mono webfont, by request. It is used for labels, tags, table headers, code and numbers.

## Components

| Component | File | What it is |
| --- | --- | --- |
| Button | `components/button/Button.jsx` | primary (blue) / accent (orange highlight) / secondary / outline / ghost, all states |
| Field | `components/form/Field.jsx` | label + helper/error wrapper |
| Input | `components/form/Input.jsx` | single-line text field |
| Textarea | `components/form/Textarea.jsx` | multi-line field |
| Checkbox | `components/form/Checkbox.jsx` | labeled checkbox |
| Radio | `components/form/Radio.jsx` | labeled radio |
| Card | `components/card/Card.jsx` | content card, static or interactive |
| Tag | `components/tag/Tag.jsx` | label/chip, 5 variants |
| Navbar | `components/navbar/Navbar.jsx` | site/app header, light or on-ground |
| Modal | `components/modal/Modal.jsx` | dialog overlay |
| Dropdown | `components/dropdown/Dropdown.jsx` | click-to-open menu |
| Tabs | `components/tabs/Tabs.jsx` | underline tab switcher |
| Alert | `components/feedback/Alert.jsx` | inline banner, 4 variants |
| Toast | `components/feedback/Toast.jsx` | fixed-position transient message |
| Tooltip | `components/feedback/Tooltip.jsx` | hover bubble |
| Table | `components/table/Table.jsx` | data table |
| Progress | `components/progress/Progress.jsx` | determinate bar |
| Spinner | `components/progress/Spinner.jsx` | indeterminate loader |
| Breadcrumb | `components/wayfinding/Breadcrumb.jsx` | path trail |
| Pagination | `components/wayfinding/Pagination.jsx` | numbered page items |
| Avatar | `components/avatar/Avatar.jsx` | user initials/photo, 3 sizes |
| EmptyState | `components/empty-state/EmptyState.jsx` | zero-data placeholder |
| Badge | `components/brand/Badge.jsx` | the "GH" brand mark |

**Intentional additions** (not their own file in the uploaded source, broken out here because the source styles.css already defines their CSS classes):
- `Badge` — the `.badge` class was demonstrated only inline inside `navbar.html` and `logo.html`; broken into its own reusable component since it's the logo wrapper, used across navbar, footer, and deck title slides.
- `Field` — the source `form.html` shows label/helper/error markup inline per input; wrapped as its own component so every form control gets consistent label/helper/error behavior without repeating markup.

## Do

- One accent, one job: orange for emphasis/primary action, purple for focus rings only.
- Default to the light surface; reach for `.on-ground` deliberately.
- Step elevation up gradually with UI depth.
- Use fast duration for small hover feedback, slow for modals/dropdowns opening.

## Don't

- Don't hand-pick a hex, font, px, shadow, or duration outside the tokens.
- Don't use `.display-*` for ordinary UI headings, or `h1`–`h6` for a glance-read banner headline.
- Don't recolor, stretch, rotate, or desaturate the "GH" badge.
- Don't grayscale photos.
- `.on-ground` and `.dark` are both near-black now. `.on-ground` is the marketing field (hero, deck, reels) and does not change the surface tokens; `.dark` re-themes a whole app. Don't nest them.

## Files

```
styles.css              imports-only entry point
tokens/                  colors, typography, spacing, radius-shadow, motion, grid, icons, components, fonts (all @import'd from styles.css)
components/              23 components across 15 directories (see table above)
assets/gh-logo.png       the brand mark file
foundations/             *.card.html specimen cards for the Design System tab (Colors, Type, Iconography, Spacing, Layout, Elevation, Motion, Image, Brand, Dark mode)
thumbnail.html           homepage tile
SKILL.md                 Claude Code / Agent Skills-compatible entry point
uploads/gh-brand-system/ original uploaded source (styles.css, theme.json, foundation & component specimen HTML) — kept for reference
```


## Tech layer (CSS only)

`.kbd`, `.code-block`, `.stat-card` (`.stat-label` / `.stat-value` / `.stat-delta`), `.surface-glass`, `.bg-grid`, `.bg-dots`, `.card-glow`. They have no JSX wrappers yet; use the class names directly.
