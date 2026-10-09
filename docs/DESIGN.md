# Singularity Review design

The site is an observatory for the AI beat. A single procession of documentary photographs and newspaper headlines gives each story room. The amber event-horizon mark anchors this reading experience.

## Palette

Use these exact CSS custom properties. Do not introduce additional brand colors. No purple.

| Property | Hex | Role |
| --- | --- | --- |
| `--ink-0` | `#0B0C0E` | Page background |
| `--ink-1` | `#131518` | Card and surface |
| `--ink-2` | `#1C1F23` | Raised surface, chips, inputs |
| `--line` | `#2A2E33` | Hairlines and borders |
| `--paper` | `#F4F1EA` | Primary text |
| `--muted` | `#A4A29C` | Secondary text and metadata |
| `--faint` | `#6E6C67` | Tertiary decorative detail; avoid small reading text |
| `--signal` | `#F2A93B` | Links, current chips, section labels, focus rings |
| `--signal-ink` | `#1A1205` | Text on amber backgrounds |
| `--ember` | `#E2603A` | Rare hover underline details |

## Typography

Newsreader Variable provides headlines and reading text, with Georgia and serif fallbacks and `font-optical-sizing: auto`. Headlines use weight 600. Body text is 19px on mobile with 1.65 line height, rising to 21px on larger screens and a maximum measure of 65ch. Card titles are 32px on mobile and 44px on desktop.

Inter Tight Variable provides UI, metadata, chips, navigation, and labels, with system-ui fallbacks. Section labels use restrained uppercase tracking. Fonts are copied from the installed Fontsource packages to `/fonts/`, with `font-display: swap`. Only the normal Newsreader WOFF2 is preloaded. Italic Newsreader and normal Inter Tight load as needed.

## Wordmark and imagery

`src/images/brand/wordmark.svg` pairs a thin amber orbit and off-center dot with tracked SINGULARITY and italic Review. The SVG uses portable sans and serif fallbacks, so its external-image rendering does not depend on font downloads. The header renders it at about 22px to 28px tall. `src/favicon.svg` uses the mark alone. Run `node scripts/prepare-brand.mjs` to regenerate the 180x180 Apple touch icon with sharp. Supply a background image as its argument to also regenerate the 1200x630 default social image with the wordmark and tagline overlay.

Article photographs show physical settings for the stories: infrastructure, knowledge, and governance. The feed crops them 4:5 on mobile (capped at 68svh) and 4:3 from 640px upward. Article heroes retain their intrinsic ratio. Original JPG URLs remain available for social sharing and RSS.

## Spacing and interaction

- Feed width: up to 760px. Mobile gutters: 8px per side.
- Card radius: 20px, with a 1px border. No elevation or decorative glows.
- Cards: height follows content. The photograph dominates: 4:5 on mobile (max 68svh), 4:3 at full card width from 640px, feed column up to 760px.
- Card padding: 20px to 24px on mobile, 28px to 32px on desktop. Space between cards: 28px to 40px.
- Mobile top bar: 56px. Its category bar follows it as one sticky unit.
- Buttons, burger, social icons, navigation and footer links: at least 48x48px. Category chips and topic labels: at least 44px tall, with category links at least 48px wide.
- Visible amber focus rings. Menu keyboard focus is contained while open; Escape closes and restores focus. Background regions become inert while the menu is open.
- Proximity scroll snapping frames feed cards. Motion explains navigation state or gently enlarges photographs on hover. Reduced motion disables transitions, zoom, and snapping.
- Social buttons float only from 960px upward. Mobile keeps them in the menu and footer, plus the article follow section.
