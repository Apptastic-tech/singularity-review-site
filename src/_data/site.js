// Global site settings. Override the public URL with SITE_URL at build time if the domain changes.
export default {
  title: "Singularity Review",
  tagline: "AI news for people living through the singularity",
  description: "AI news, research, and analysis",
  url: (process.env.SITE_URL || "https://singularityreview.com").replace(/\/$/, ""),
  // Firebase default hostnames that should send readers to the canonical domain.
  legacyHosts: ["singularity-review.web.app", "singularity-review.firebaseapp.com"],
  language: "en",
  defaultAuthor: "Singularity Review",
  defaultImage: "/images/brand/og-default.jpg",
  defaultImageAlt: "Singularity Review wordmark above a quiet observatory under a night sky",
  facebook: "https://www.facebook.com/profile.php?id=61595278645448",
  instagram: "https://www.instagram.com/singularityreview/",
  year: new Date().getFullYear(),
};
