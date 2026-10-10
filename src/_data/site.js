// Global site settings. Override the public URL with SITE_URL at build time if the domain changes.
export default {
  title: "Singularity Review",
  description: "AI news, research, and analysis",
  url: (process.env.SITE_URL || "https://singularityreview.com").replace(/\/$/, ""),
  // Firebase default hostnames that should send readers to the canonical domain.
  legacyHosts: ["singularity-review.web.app", "singularity-review.firebaseapp.com"],
  language: "en",
  updated: "2026-10-10T17:45:21.964Z",
  adsense: {
    // Empty client disables every ad slot and the loader in the default build.
    client: "",
    verificationMeta: "",
    preview: process.env.ADSENSE_PREVIEW === "1",
    slots: {
      articleA: "[AdSense ad unit ID]",
      articleB: "[AdSense ad unit ID]",
      homeGrid: "[AdSense ad unit ID]",
    },
  },
  defaultAuthor: "Singularity Review",
  defaultImage: "/images/brand/og-default.jpg",
  defaultImageAlt: "Singularity Review beside a lensed black hole above an observatory and mountain skyline at night",
  facebook: "https://www.facebook.com/profile.php?id=61595278645448",
  instagram: "https://www.instagram.com/singularityreview/",
  year: new Date().getFullYear(),
};
