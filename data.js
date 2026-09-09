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
  // Set to true when you're ready to show the PROJECTS list below.
  showProjects: false,
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

// Newest first. `when` is free text.
const TIMELINE = [
  { when: "2026", title: "PCIe / DMA research", where: "Independent", desc: "Custom FPGA firmware, memory-access tooling, and driver work on Windows." },
  { when: "2025", title: "Reverse engineering & drivers", where: "Independent", desc: "Kernel-mode development, hypervisor experiments, and game-client analysis." },
  { when: "2024", title: "Started building tools", where: "", desc: "Python and C++ utilities, automation, and the first hardware projects." },
];

// Writeups. `url` can be a page in this repo (e.g. "posts/dma-notes.html") or external.
const BLOG = [
  { date: "2026-09-01", title: "Notes on getting a DMA card recognised", summary: "What actually mattered: firmware IDs, link training, and the driver side.", url: "" },
  { date: "2026-07-14", title: "A tiny hypervisor, and what it taught me", summary: "Building hv-drop from scratch and the debugging that came with it.", url: "" },
];

// Projects appear in this order. Hidden until SITE.showProjects is true. Each needs at least title + description.
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
