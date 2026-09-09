// ============================================================
//  PORTFOLIO CONTENT — this is the only file you need to edit.
//  Save it, refresh the page, done.
// ============================================================

const SITE = {
  name: "Azal",
  role: "Software Developer",
  tagline: "I build tools, drivers, and things that poke at hardware.",
  location: "Earth",
  email: "snorkledubs@gmail.com",
  // Any of these can be removed or left as "".
  links: {
    github: "https://github.com/snorkledubs",
    linkedin: "",
    twitter: "",
    resume: "",            // e.g. "assets/resume.pdf"
  },
  // Accent color for buttons, links, highlights. Any CSS color works.
  accent: "#7c5cff",
  // Photo/avatar. Put a file in assets/ and reference it, or leave "".
  avatar: "",
};

const ABOUT = `
I'm a developer who likes low-level work: reverse engineering, driver
development, hardware interfacing, and automation. This site collects the
projects I'm proud of. Edit this paragraph in <code>data.js</code>.
`;

const SKILLS = [
  { group: "Languages",  items: ["C", "C++", "Python", "JavaScript"] },
  { group: "Systems",    items: ["Windows internals", "Kernel drivers", "PCIe / DMA", "Firmware"] },
  { group: "Tools",      items: ["Ghidra", "Git", "Visual Studio", "WinDbg"] },
];

// Projects appear in this order. Each needs at least title + description.
// Tags power the filter bar. `featured: true` gets a highlighted card.
const PROJECTS = [
  {
    title: "DMA Engine",
    description: "Direct-memory-access research toolkit for reading and writing physical memory over PCIe with a custom FPGA firmware.",
    tags: ["C++", "Hardware", "PCIe"],
    image: "",                       // e.g. "assets/dma.png"
    repo: "https://github.com/snorkledubs/dma-engine",
    demo: "",
    featured: true,
  },
  {
    title: "Proxy Picker",
    description: "Scores and rotates proxies by latency and reliability, with a small dashboard for live status.",
    tags: ["Python", "Networking"],
    image: "",
    repo: "",
    demo: "",
  },
  {
    title: "Firmware Project",
    description: "Custom firmware builds with automated flashing and verification scripts.",
    tags: ["C", "Firmware", "Hardware"],
    image: "",
    repo: "",
    demo: "",
  },
  {
    title: "Overwatch Tooling",
    description: "Game-adjacent utilities: overlays, stat tracking, and configuration helpers.",
    tags: ["C++", "Windows"],
    image: "",
    repo: "",
    demo: "",
  },
];
