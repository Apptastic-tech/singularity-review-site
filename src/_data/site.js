// Global site settings. Override the public URL with SITE_URL at build time if the domain changes.
export default {
  title: "Singularity Review",
  tagline: "AI news for people living through the singularity",
  description:
    "Catching every AI headline is impossible. Singularity Review cuts to what matters, every day, in clear narrative prose.",
  url: (process.env.SITE_URL || "https://singularity-review.web.app").replace(/\/$/, ""),
  language: "en",
  defaultAuthor: "Singularity Review",
  defaultImage: "/images/brand/cover.jpg",
  defaultImageAlt: "Singularity Review: electric violet light on a dark cosmic field",
  facebook: "https://www.facebook.com/profile.php?id=61595278645448",
  instagram: "https://www.instagram.com/singularityreview/",
  year: new Date().getFullYear(),
};
