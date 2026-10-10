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
| `--signal` | `#F2A93B` | Links, current navigation, section labels, focus rings |
| `--signal-ink` | `#1A1205` | Text on amber backgrounds |
| `--ember` | `#E2603A` | Rare hover underline details |

## Typography

Newsreader Variable provides headlines and reading text, with Georgia and serif fallbacks and `font-optical-sizing: auto`. Headlines use weight 600. Body text is 19px on mobile with 1.65 line height, rising to 21px on larger screens and a maximum measure of 65ch. Card titles are 32px on mobile and 44px on desktop.

Inter Tight Variable provides UI, metadata, chips, navigation, and labels, with system-ui fallbacks. Section labels use restrained uppercase tracking. Fonts are copied from the installed Fontsource packages to `/fonts/`, with `font-display: swap`. Only the normal Newsreader WOFF2 is preloaded. Italic Newsreader and normal Inter Tight load as needed.

## Wordmark and imagery

`src/images/brand/wordmark.svg` pairs a thin amber orbit and off-center dot with tracked SINGULARITY and italic Review. The SVG uses portable sans and serif fallbacks, so its external-image rendering does not depend on font downloads. The mobile header centers it within a 72px masthead; the desktop masthead places it above the inline four-link navigation. Scroll condensation uses transforms within fixed header dimensions, preserving the story layout. `src/favicon.svg` uses the mark alone. Run `node scripts/prepare-brand.mjs` to regenerate the 180x180 Apple touch icon with sharp. Supply a background image as its argument to also regenerate the 1200x630 default social image with the wordmark and tagline overlay.

Article photographs show physical settings for the stories: infrastructure, knowledge, and governance. The feed crops them 4:5 on mobile (capped at 68svh) and 4:3 from 640px upward. Article heroes retain their intrinsic ratio. Original JPG URLs remain available for social sharing and RSS.

## Spacing and interaction

- Feed width: up to 760px. Mobile gutters: 8px per side.
- Card radius: 20px, with a 1px border. No elevation or decorative glows.
- Cards: height follows content. The photograph dominates: 4:5 on mobile (max 68svh), 4:3 at full card width from 640px, feed column up to 760px.
- Card padding: 20px to 24px on mobile, 28px to 32px on desktop. Space between cards: 28px to 40px.
- Mobile masthead: 72px, with a 48px menu toggle. The open menu fills the viewport below it. Desktop masthead: 64px above a 54px navigation row, which remains visible when condensed.
- Buttons, burger, social icons, navigation and footer links: at least 48x48px. Category chips and topic labels: at least 44px tall, with category links at least 48px wide.
- Visible amber focus rings. Menu keyboard focus is contained while open; Escape closes and restores focus. Background regions become inert while the menu is open.
- Proximity scroll snapping frames feed cards. Motion explains navigation state or gently enlarges photographs on hover. Reduced motion disables transitions, zoom, and snapping.
- Social buttons float only from 960px upward. Mobile keeps them in the menu and footer, plus the article follow section.

## Navigation and sections

The four primary destinations are Singularity headline news, Featured author articles, What is singularity, and Who we are. Amber text and an underline mark the current desktop destination. The full-height mobile menu uses large Newsreader type, ruled rows, an amber current marker, secondary social links and a quiet publication tagline. Focus is contained while the menu is open; body position and scroll offset are restored on close.

Category chips no longer appear in the header. Categories remain available from article kickers and the footer Topics list. Social links and RSS remain secondary menu and footer controls.

A ruled author shelf sits between the homepage section introduction and the headline feed. Landscape thumbnails, smaller essay titles and amber initials distinguish it from the large headline cards. The archive uses the same shelf above all featured articles. Multiple slides have 44px previous and next buttons plus a visible pause/play control. Native horizontal scrolling provides touch browsing. Auto-advance runs every five seconds only while the shelf has room to scroll and is idle; reduced motion disables it entirely.

The explainer follows a reading column before widening into a two-column expert directory on larger screens. Expert portraits use supplied positioning, initials fill missing portraits, stance labels remain textual, and photo credits link to attribution, source and licence pages.
