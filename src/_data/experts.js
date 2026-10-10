// Experts shown on /what-is-singularity/. Photos are self-hosted copies of Wikimedia Commons files (see credit).
// Schema: { slug, name, role, stanceType: "proponent" | "skeptic" | "pioneer", stance, photo, photoAlt, photoPosition,
//           credit: { author, authorUrl, license, licenseUrl, sourceUrl }, works: [{ title, year, url }] }
// photo may be null when no freely licensed portrait exists; templates then omit the portrait.
export default [
  {
    slug: "john-von-neumann",
    name: "John von Neumann",
    role: "Mathematician and computing pioneer (1903 to 1957)",
    stanceType: "pioneer",
    stance:
      "The first recorded use of \"singularity\" in this sense. Stanislaw Ulam's 1958 tribute recalls a conversation in which von Neumann described accelerating technological progress as approaching an essential singularity in human history, beyond which affairs as we know them could not continue.",
    photo: "/images/experts/john-von-neumann.jpg",
    photoAlt: "Black and white ID-style portrait of John von Neumann in a suit and tie",
    credit: {
      author: "Los Alamos National Laboratory",
      authorUrl: "",
      license: "Attribution (LANL)",
      licenseUrl: "https://commons.wikimedia.org/wiki/Template:Attribution",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:JohnvonNeumann-LosAlamos.gif",
    },
    works: [
      { title: "Ulam, \"Tribute to John von Neumann\" (Bulletin of the AMS)", year: 1958, url: "https://www.ams.org/journals/bull/1958-64-03/S0002-9904-1958-10189-5/" },
      { title: "First Draft of a Report on the EDVAC", year: 1945, url: "https://en.wikipedia.org/wiki/First_Draft_of_a_Report_on_the_EDVAC" },
      { title: "The Computer and the Brain", year: 1958, url: "https://en.wikipedia.org/wiki/The_Computer_and_the_Brain" },
    ],
  },
  {
    slug: "i-j-good",
    name: "I. J. Good",
    role: "Mathematician and Bletchley Park codebreaker (1916 to 2009)",
    stanceType: "pioneer",
    stance:
      "Coined the \"intelligence explosion\". In 1965 he argued that a machine able to surpass human intellect could design still better machines, so the first such machine could be the last invention humanity needs to make, provided it stays under our control.",
    photo: null,
    photoAlt: "",
    credit: null,
    works: [
      { title: "Speculations Concerning the First Ultraintelligent Machine (Advances in Computers, vol. 6)", year: 1965, url: "https://doi.org/10.1016/S0065-2458(08)60418-0" },
      { title: "I. J. Good on Wikipedia", year: null, url: "https://en.wikipedia.org/wiki/I._J._Good" },
    ],
  },
  {
    slug: "vernor-vinge",
    name: "Vernor Vinge",
    role: "Mathematician, computer scientist and science fiction author (1944 to 2024)",
    stanceType: "pioneer",
    stance:
      "Gave the idea its modern name. His 1993 NASA symposium essay opens: \"Within thirty years, we will have the technological means to create superhuman intelligence. Shortly after, the human era will be ended.\"",
    photo: "/images/experts/vernor-vinge.jpg",
    photoAlt: "Vernor Vinge, smiling, with a grey beard and glasses",
    credit: {
      author: "Raul654",
      authorUrl: "https://commons.wikimedia.org/wiki/User:Raul654",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Vernor_Vinge_(cropped).jpg",
    },
    works: [
      { title: "The Coming Technological Singularity", year: 1993, url: "https://edoras.sdsu.edu/~vinge/misc/singularity.html" },
      { title: "A Fire Upon the Deep", year: 1992, url: "https://en.wikipedia.org/wiki/A_Fire_Upon_the_Deep" },
    ],
  },
  {
    slug: "ray-kurzweil",
    name: "Ray Kurzweil",
    role: "Inventor, futurist and author",
    stanceType: "proponent",
    stance:
      "The idea's best known champion. He predicts human-level AI by 2029 and a singularity around 2045, when people merge with the intelligence they have created and capability grows by orders of magnitude.",
    photo: "/images/experts/ray-kurzweil.jpg",
    photoAlt: "Ray Kurzweil speaking on stage at SXSW in 2017",
    photoPosition: "60% 30%",
    credit: {
      author: "nrkbeta",
      authorUrl: "https://www.flickr.com/people/nrkbeta/",
      license: "CC BY-SA 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Ray_Kurzweil_@_SXSW_2017_(32594766664).jpg",
    },
    works: [
      { title: "The Age of Spiritual Machines", year: 1999, url: "https://en.wikipedia.org/wiki/The_Age_of_Spiritual_Machines" },
      { title: "The Singularity Is Near", year: 2005, url: "https://en.wikipedia.org/wiki/The_Singularity_Is_Near" },
      { title: "The Singularity Is Nearer", year: 2024, url: "https://en.wikipedia.org/wiki/The_Singularity_Is_Nearer" },
    ],
  },
  {
    slug: "nick-bostrom",
    name: "Nick Bostrom",
    role: "Philosopher, founding director of Oxford's Future of Humanity Institute (2005 to 2024)",
    stanceType: "proponent",
    stance:
      "Takes superintelligence seriously as a possibility this century and argues that controlling it, the alignment problem, may be the most important challenge humanity faces before it arrives.",
    photo: "/images/experts/nick-bostrom.jpg",
    photoAlt: "Portrait of Nick Bostrom in a dark jacket",
    credit: {
      author: "Future of Humanity Institute",
      authorUrl: "",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Prof_Nick_Bostrom_324-1.jpg",
    },
    works: [
      { title: "Superintelligence: Paths, Dangers, Strategies", year: 2014, url: "https://en.wikipedia.org/wiki/Superintelligence:_Paths,_Dangers,_Strategies" },
      { title: "Deep Utopia: Life and Meaning in a Solved World", year: 2024, url: "https://nickbostrom.com/deep-utopia/" },
    ],
  },
  {
    slug: "gary-marcus",
    name: "Gary Marcus",
    role: "Cognitive scientist, professor emeritus at New York University",
    stanceType: "skeptic",
    stance:
      "A prominent critic of the hype. He argues that today's deep learning and large language models lack reliable reasoning and understanding, so claims of imminent superintelligence are premature.",
    photo: "/images/experts/gary-marcus.jpg",
    photoAlt: "Gary Marcus speaking at Web Summit 2022",
    credit: {
      author: "Web Summit",
      authorUrl: "https://www.flickr.com/people/websummit/",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Gary_Marcus_at_Web_Summit_2022.jpeg",
    },
    works: [
      { title: "Kluge: The Haphazard Construction of the Human Mind", year: 2008, url: "https://en.wikipedia.org/wiki/Kluge:_The_Haphazard_Construction_of_the_Human_Mind" },
      { title: "Rebooting AI (with Ernest Davis)", year: 2019, url: "https://www.penguinrandomhouse.com/books/603982/rebooting-ai-by-gary-marcus-and-ernest-davis/" },
    ],
  },
  {
    slug: "steven-pinker",
    name: "Steven Pinker",
    role: "Cognitive psychologist, Harvard University",
    stanceType: "skeptic",
    stance:
      "Rejects the premise outright. Asked by IEEE Spectrum in 2008, he said: \"There is not the slightest reason to believe in a coming singularity.\"",
    photo: "/images/experts/steven-pinker.jpg",
    photoAlt: "Steven Pinker, with long grey curly hair, in 2023",
    credit: {
      author: "Christopher Michel",
      authorUrl: "https://commons.wikimedia.org/wiki/User:Cmichel67",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Steven_Pinker_in_2023.jpg",
    },
    works: [
      { title: "IEEE Spectrum: Tech Luminaries Address Singularity", year: 2008, url: "https://spectrum.ieee.org/tech-luminaries-address-singularity" },
      { title: "How the Mind Works", year: 1997, url: "https://en.wikipedia.org/wiki/How_the_Mind_Works" },
      { title: "Enlightenment Now", year: 2018, url: "https://en.wikipedia.org/wiki/Enlightenment_Now" },
    ],
  },
];
