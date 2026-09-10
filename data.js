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
  showProjects: true,
};

const ABOUT = `
i got into coding as a kid thru watching some dude make a wallhack
for <b>CROSSFIRE</b> — imagine if csgo had a baby with a shitpost,
more so {if thats even possible}. ever since ive been enamored by
the idea of <em>what could</em>...
<br><br>
WHICH LEADS ME INTO hypervisor substrates on amd windows 11, more
kernel driver work, most of it revolving around <b>game hacking →
reverse engineering → emulation</b>.
<br><br>
was really into cryptography for alittle bit but thats something
else entirely.
`;

const SKILLS = [
  { group: "Languages",  items: ["C", "C++", "Python", "JavaScript"] },
  { group: "Systems",    items: ["Windows internals", "Kernel drivers", "PCIe / DMA", "Firmware"] },
  { group: "Tools",      items: ["Ghidra", "Git", "Visual Studio", "WinDbg"] },
];

// Newest first. `when` is free text.
const TIMELINE = [
  { when: "2026", title: "hv-drop", where: "Independent", desc: "Built a bare-metal hypervisor substrate for Windows 11: signed driver, test-signing provisioning, and a one-shot deploy that leaves a fresh box ready to boot into it." },
  { when: "2025", title: "Kernel-mode research", where: "Independent", desc: "Deep-dive into the NT executive: memory manager, object manager, process/thread state, driver dispatch. Wrote a lot of code just to prove I understood the pieces." },
  { when: "2024", title: "Reverse engineering", where: "Independent", desc: "Ghidra, WinDbg, and enough coffee to figure out how other people's code actually works, not just what the docs say." },
];

// Writeups. `url` can be a page in this repo (e.g. "posts/dma-notes.html") or external.
const BLOG = [
  { date: "2026-07-14", title: "hv-drop, and what it taught me", summary: "Building a Windows 11 hypervisor substrate from scratch — the driver, the boot config, and the BSOD I actually wanted.", url: "posts/hv-drop.html" },
];

// Projects appear in this order. Hidden until SITE.showProjects is true. Each needs at least title + description.
// Tags power the filter bar. `featured: true` gets a highlighted card.
const PROJECTS = [
  {
    title: "hv-drop",
    description: "Bare-metal hypervisor substrate for Windows 11. A signed kernel driver installed as a demand-start service, with a one-shot deployment batch that provisions the test-signing cert, boot config, and BSOD-readable crash settings on a fresh box.",
    tags: ["C", "Kernel", "Hypervisor", "Windows"],
    image: "",
    repo: "",
    demo: "",
    featured: true,
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
  {
    title: "self taught mostly",
    where: "the internet + alot of bluescreens",
    when: "ongoing",
    desc: "started poking at game cheats as a kid cus i wanted to see how the seams held together. from there it was windows internals → kernel dev → pcie/dma → re, all picked up by breaking stuff on purpose then breaking it a different way until something clicked. no diploma to show for it, just a lot of dump files and a folder called <code>notes.txt</code> that keeps growing.",
  },
  {
    title: "cryptography detour",
    where: "a rabbit hole",
    when: "for alittle bit",
    desc: "spent a stretch reading papers and hand-rolling primitives just to see if i could. thats something else entirely — but it comes back around every time a binary tries to hide behind something homemade.",
  },
];

const HOBBIES = `
Games where I can push the engine sideways.
Building small boxes that do one weird thing well.
Reading disassembly like other people read novels.
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
  adder: [
    {mood:"chill",    text:"you want an addy?"},
    {mood:"chill",    text:"you sure you dont?"},
    {mood:"lazy",     text:"i haev like alot of em i dont mind"},
    {mood:"chill",    text:"you want one?"},
    {mood:"insistent",text:"come on man just take one"},
    {mood:"smug",     text:"trust me youll love it"},
    {mood:"lazy",     text:"i got extras btw"},
    {mood:"chill",    text:"half a pill? just half"},
    {mood:"sleepy",   text:"you look tired... want an addy?"},
    {mood:"chill",    text:"one before we keep going?"},
    {mood:"smug",     text:"just one, on the house"},
    {mood:"lazy",     text:"i literally have a whole bottle"},
    {mood:"chill",    text:"you sure? theyre right here"},
    {mood:"insistent",text:"come on dont make me eat em alone"},
    {mood:"smug",     text:"you dont wanna focus? bet"},
    {mood:"insistent",text:"trust me you want one"},
    {mood:"chill",    text:"i wont tell anyone"},
    {mood:"sleepy",   text:"at least think about it"},
    {mood:"smug",     text:"you dont know what youre missin"},
    {mood:"lazy",     text:"im just sayin, i got em"},
    {mood:"chill",    text:"you wanna split one?"},
    {mood:"chill",    text:"you want half? half is fine"},
    {mood:"lazy",     text:"no pressure but they work"},
    {mood:"insistent",text:"you sure sure? like sure sure?"},
    {mood:"sleepy",   text:"last chance before i take mine"},
    {mood:"smug",     text:"you look like you skipped breakfast. addy?"},
    {mood:"insistent",text:"one addy wont kill you"},
    {mood:"lazy",     text:"i mean im offerin"},
    {mood:"sleepy",   text:"still no? bet, more for me"},
    {mood:"chill",    text:"okay but the offer stands"},
    {mood:"lazy",     text:"i haev soooo many"},
    {mood:"sleepy",   text:"mmm you sure?"},
    {mood:"smug",     text:"one addy and youll fly through this"},
    {mood:"chill",    text:"hey — addy?"},
    {mood:"insistent",text:"just one. one. thats it"},
    {mood:"lazy",     text:"i dont even count em anymore"},
    {mood:"sleepy",   text:"you dont gotta answer... but yknow"},
    {mood:"smug",     text:"whats one addy between friends"},
    {mood:"chill",    text:"seriously you can have one"},
    {mood:"lazy",     text:"like a full bottle, im not kiddin"},
  ],
};
