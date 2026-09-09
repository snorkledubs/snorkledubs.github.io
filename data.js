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

// ============================================================
//  THE HOUSE (house.html). Rooms are grids of 16px tiles.
//  Objects are placed by tile (x, y). `open` decides what an
//  object shows when the visitor interacts with it:
//    "about" | "skills" | "timeline" | "blog" | "contact"
//    "project:<n>"  -> PROJECTS[n], with its walkthrough if it has one
//  Objects without `open` are decoration. `solid: false` lets the
//  player walk over it (rugs). Exits link room edges to other rooms.
// ============================================================
const HOUSE = {
  start: "hall",
  rooms: [
    {
      id: "hall", name: "Entrance hall", w: 18, h: 11, floor: "wood", wall: "cream",
      exits: { right: "study" },
      objects: [
        { sprite: "door",     x: 8,  y: 0 },
        { sprite: "frame",    x: 3,  y: 1, label: "About me",  open: "about" },
        { sprite: "window",   x: 12, y: 0 },
        { sprite: "mailbox",  x: 1,  y: 7, label: "Contact",   open: "contact" },
        { sprite: "rug",      x: 6,  y: 5, solid: false },
        { sprite: "plant",    x: 15, y: 8 },
        { sprite: "clock",    x: 6,  y: 1, label: "Timeline",  open: "timeline" },
      ],
    },
    {
      id: "study", name: "Study", w: 18, h: 11, floor: "carpet", wall: "blue",
      exits: { left: "hall", right: "workshop" },
      objects: [
        { sprite: "bookshelf", x: 2,  y: 0, label: "Writeups", open: "blog" },
        { sprite: "bookshelf", x: 4,  y: 0, label: "Writeups", open: "blog" },
        { sprite: "window",    x: 9,  y: 0 },
        { sprite: "desk",      x: 12, y: 2, label: "Skills",   open: "skills" },
        { sprite: "rug",       x: 6,  y: 6, solid: false },
        { sprite: "plant",     x: 16, y: 8 },
        { sprite: "lamp",      x: 15, y: 2 },
      ],
    },
    {
      id: "workshop", name: "Workshop", w: 18, h: 11, floor: "concrete", wall: "grey",
      exits: { left: "study" },
      objects: [
        { sprite: "window",   x: 4,  y: 0 },
        { sprite: "bench",    x: 8,  y: 1, label: "Coming soon", open: "soon" },
        { sprite: "toolbox",  x: 2,  y: 8 },
        { sprite: "crate",    x: 15, y: 7 },
        { sprite: "crate",    x: 15, y: 5 },
        { sprite: "plant",    x: 1,  y: 3 },
      ],
    },
  ],
};

// ============================================================
//  THE ROOM (index.html). Each TV on the desk is one section.
//  Text on the screens comes from the sections above, plus these.
// ============================================================
const EDUCATION = [
  { title: "[Degree or course]", where: "[School]", when: "[Years]", desc: "Relevant coursework, thesis, or awards. Delete this entry if you'd rather not list any." },
];

const HOBBIES = `
Games, hardware, and taking things apart to see why they work.
Edit this in <code>data.js</code>, three lines max.
`;

// What Azal says when a TV is opened. {name} is replaced with the avatar name.
const DIALOGUE = {
  intro: [
    "Hey. I'm {name}. Don't worry about the straps, they're for your own good.",
    "Everything I've made is on those screens. Look at one and click.",
  ],
  about:      ["I'm {name}.", "I write systems code and poke at hardware. This room is where I keep the stuff I've made.", "Look around. Each screen is one thing."],
  skills:     ["These are the languages I actually use, not the ones I skimmed a tutorial on."],
  projects:   ["The good stuff. Some finished, some still humming in the background."],
  experience: ["Where I've been and what I broke, then fixed."],
  education:  ["Paper says I studied. Code says I learned."],
  hobbies:    ["When the compiler's quiet."],
  contact:    ["Chair's yours to leave whenever. Say hi first."],
  pills:      "yeahhh i might have a problem but its how things get done around here",
};
