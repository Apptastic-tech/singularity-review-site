// Inline SVG path data for share buttons. Brand marks come from simple-icons (CC0); the rest are drawn here.
import { siFacebook, siX, siThreads, siWhatsapp, siTelegram, siReddit } from "simple-icons";

const brand = (icon) => `<path fill="currentColor" d="${icon.path}"/>`;

export default {
  facebook: brand(siFacebook),
  x: brand(siX),
  threads: brand(siThreads),
  whatsapp: brand(siWhatsapp),
  telegram: brand(siTelegram),
  reddit: brand(siReddit),
  linkedin:
    '<path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>',
  email:
    '<rect x="2.5" y="4.5" width="19" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m3.5 6 8.5 7 8.5-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
  link:
    '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4l-1.1 1.1M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1.1-1.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  share:
    '<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  heart:
    '<path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.7 4 7.3 4c2 0 3.6 1.1 4.7 2.7C13.1 5.1 14.7 4 16.7 4c3.6 0 5.7 3.6 4.5 7.1-1.7 4.8-9.2 9.4-9.2 9.4z" fill="currentColor"/>',
};
