# UX reference

The information architecture and interaction patterns supplied for ux-news.com informed the redesign. No visuals, text, code, or assets were copied. The implementation, brand assets, editorial imagery, and visual system are original.

## Adopted patterns

- One sticky header unit hides on scroll down and reappears on scroll up.
- A mobile burger opens a dismissible navigation panel, while desktop navigation stays inline.
- A horizontally scrollable pill bar lists All and each category, with the current section filled.
- A single-column feed uses large whole-card links with a photograph, section and date, headline, and a three-line excerpt.
- Cards align to the center using proximity scroll snapping and a small image zoom on hover.
- Homepage pagination renders ten stories per page. An IntersectionObserver sentinel progressively fetches the next page and appends its cards. A real Load more link supports disabled JavaScript, unavailable observers, and loading failures.
- A vertical social stack floats at the bottom right on desktop.
- Articles follow the sequence: category link, title, excerpt, byline, hero and optional caption, reading body, topics, follow links, and Read next using the same large feed cards.
- A minimal centered footer contains About, RSS, social icons, and copyright.

## Deliberate changes

Cards and photographs are substantially larger than the reference. On mobile, cards use 8px gutters, a tall 4:5 photograph (capped at 68svh so the headline stays in view), and 32px headlines. On desktop the feed column reaches 760px with 4:3 photographs at full card width and 44px headlines. Card height follows the content, so there is no empty space below the excerpt.

The design uses warm paper text on near-black ink, singularity amber, Newsreader reading typography, and Inter Tight controls. No purple. All tap targets are at least 48x48px except the explicitly 44px category chips. The top bar remains 56px on mobile. Body text is 19px or larger, and its desktop measure is limited to 65ch.

Fonts are self-hosted. Responsive images are built automatically, the first hero receives a responsive preload and high fetch priority, and later images load lazily. Navigation, loading, and hover motion respect reduced-motion preferences. Floating social controls do not cover mobile stories.

There are no ads, ad feeds, analytics, trackers, newsletters, portals, search controls, theme toggles, external font CDNs, or third-party scripts.
