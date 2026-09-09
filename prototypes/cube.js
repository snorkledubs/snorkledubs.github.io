// Cube portfolio: six faces, one page each. A player walks on the front face;
// leaving an edge rolls the cube so the neighbouring face comes to the front.
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- Build face content from data.js ----------
  // Order: front, right, back, left, top, bottom.
  // Home, About, Skills, Timeline, Blog, Contact. CUBE_FACES in data.js overrides this if defined.
  const socialLinks = Object.entries(SITE.links || {}).filter(([, u]) => u).map(([k, u]) => ({ label: k, url: u }));
  const faces = (typeof CUBE_FACES !== "undefined" && CUBE_FACES.length) ? CUBE_FACES : [
    {
      kicker: SITE.role, title: SITE.name, desc: SITE.tagline, links: socialLinks,
      hint: "Walk off any edge to explore \u2192",
    },
    {
      kicker: "About", title: "Who I am", html: ABOUT,
    },
    {
      kicker: "Skills", title: "What I work with",
      html: (SKILLS || []).map((g) => `<div class="row"><b>${esc(g.group)}</b><span class="chips">${g.items.map((i) => `<i>${esc(i)}</i>`).join("")}</span></div>`).join(""),
    },
    {
      kicker: "Timeline", title: "Where I've been",
      html: (typeof TIMELINE !== "undefined" ? TIMELINE : []).map((t) => `<div class="row"><b class="when">${esc(t.when)}</b><span><strong>${esc(t.title)}</strong>${t.where ? ` <em>\u00b7 ${esc(t.where)}</em>` : ""}<br><small>${esc(t.desc || "")}</small></span></div>`).join(""),
    },
    {
      kicker: "Writeups", title: "Things I wrote down",
      html: (typeof BLOG !== "undefined" ? BLOG : []).map((b) => `<div class="row"><b class="when">${esc(b.date)}</b><span>${b.url ? `<a href="${esc(b.url)}"><strong>${esc(b.title)}</strong></a>` : `<strong>${esc(b.title)}</strong>`}<br><small>${esc(b.summary || "")}</small></span></div>`).join("") || `<p class="face-desc">Nothing published yet.</p>`,
    },
    {
      kicker: "Contact", title: "Say hi", desc: SITE.email ? `Reach me at ${SITE.email}.` : "Links below.",
      links: [SITE.email && { label: "Email", url: `mailto:${SITE.email}` }, ...socialLinks].filter(Boolean),
    },
  ];

  const BASE = [
    "translateZ(HALF)",
    "rotateY(90deg) translateZ(HALF)",
    "rotateY(180deg) translateZ(HALF)",
    "rotateY(-90deg) translateZ(HALF)",
    "rotateX(90deg) translateZ(HALF)",
    "rotateX(-90deg) translateZ(HALF)",
  ];
  const cube = $("cube");
  const stage = $("stage");
  const arena = $("arena");
  const player = $("player");
  const minimap = $("minimap");
  const cubeSize = () => cube.getBoundingClientRect().width;   // nominal cube edge
  const size = () => arena.getBoundingClientRect().width;      // projected front face, used for the player

  const faceEls = faces.map((f, i) => {
    const el = document.createElement("div");
    el.className = "face" + (f.html ? " face-list" : ""); el.dataset.i = i;
    if (f.accent) el.style.setProperty("--face-accent", f.accent);
    el.innerHTML = `
      <div class="face-inner">
        <div class="face-kicker">${esc(f.kicker || "")}</div>
        <h2 class="face-title">${esc(f.title)}</h2>
        ${f.desc ? `<p class="face-desc">${esc(f.desc)}</p>` : ""}
        ${f.html ? `<div class="face-body">${f.html}</div>` : ""}
        ${f.tags?.length ? `<div class="face-tags">${f.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
        ${f.links?.length ? `<div class="face-links">${f.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} &rarr;</a>`).join("")}</div>` : ""}
        ${f.hint ? `<div class="face-hint">${esc(f.hint)}</div>` : ""}
      </div>`;
    cube.appendChild(el);
    const dot = document.createElement("i"); minimap.appendChild(dot);
    return el;
  });
  function layoutFaces() {
    const half = cubeSize() / 2;
    faceEls.forEach((el, i) => { el.style.transform = BASE[i].replace("HALF", half + "px"); });
  }
  layoutFaces();

  // ---------- Rotation state ----------
  // M is the cube's rotation. Pre-multiplying with a screen-space rotation
  // means "roll the cube toward the right" always looks the same regardless
  // of how it is already oriented.
  let M = new DOMMatrix();
  const ROLL = { right: [0, -90], left: [0, 90], up: [-90, 0], down: [90, 0] }; // [rotX, rotY] in degrees
  let busy = false;
  let current = 0;

  function snap(m) { // kill float drift so entries stay exactly 0/±1
    const out = new DOMMatrix();
    ["m11","m12","m13","m21","m22","m23","m31","m32","m33"].forEach((k) => { out[k] = Math.round(m[k]); });
    return out;
  }
  function faceMatrix(i) {
    const t = BASE[i].replace("HALF", "0px");
    return M.multiply(new DOMMatrix(t));
  }
  function frontFace() {
    let best = 0, bz = -2;
    faceEls.forEach((_, i) => {
      const n = faceMatrix(i).transformPoint(new DOMPoint(0, 0, 1, 0));
      if (n.z > bz) { bz = n.z; best = i; }
    });
    return best;
  }
  // Rotate the text so it always reads upright on whichever face is in front.
  function fixOrientation() {
    faceEls.forEach((el, i) => {
      const u = faceMatrix(i).transformPoint(new DOMPoint(0, -1, 0, 0)); // face-local "up"
      const ux = Math.round(u.x) + 0, uy = -Math.round(u.y) + 0;       // +0 clears negative zero
      const angle = Math.round(Math.atan2(ux, uy) * 180 / Math.PI);         // 0 when up is screen-up
      el.querySelector(".face-inner").style.transform = `rotate(${-angle}deg)`;
    });
  }
  function applyMatrix() { cube.style.transform = M.toString(); }

  function updateHud() {
    $("face-label").textContent = `face ${current + 1} / ${faces.length} · ${faces[current].title}`;
    [...minimap.children].forEach((d, i) => { d.classList.toggle("now", i === current); if (i === current) d.classList.add("seen"); });
    document.title = current ? `${faces[current].title} · ${SITE.name}` : `${SITE.name} — ${SITE.role}`;
  }

  function roll(dir) {
    if (busy) return; busy = true;
    const [rx, ry] = ROLL[dir];
    M = snap(new DOMMatrix().rotate(rx, ry, 0).multiply(M));
    applyMatrix();
    hop(dir);
    player.classList.add("flipping");
    current = frontFace();
    updateHud();
    setTimeout(() => {
      fixOrientation();
      placeAtEdge(dir);
      player.classList.remove("flipping");
      busy = false;
    }, 760);
  }
  // Hop: lift toward the direction of travel, roll, land with a squash.
  const hopEl = $("hop");
  function hop(dir) {
    const dx = dir === "right" ? 1 : dir === "left" ? -1 : 0;
    const dy = dir === "down" ? 1 : dir === "up" ? -1 : 0;
    hopEl.animate([
      { transform: "translate(0,0) scale(1)", offset: 0 },
      { transform: `translate(${dx * 7}%, ${dy * 7 - 9}%) scale(1.06)`, offset: 0.42, easing: "ease-in" },
      { transform: "translate(0,0) scale(1)", offset: 0.78 },
      { transform: "translate(0, 1.5%) scale(1.045, 0.955)", offset: 0.87 },
      { transform: "translate(0,0) scale(1)", offset: 1 },
    ], { duration: 780, easing: "ease-out" });
  }
  document.querySelectorAll(".nav").forEach((b) => b.addEventListener("click", () => roll(b.dataset.dir)));

  // ---------- Player ----------
  const P = { x: 0, y: 0, w: 34, h: 34, speed: 4.2 };
  const keys = new Set();
  const KEYMAP = { w: "up", a: "left", s: "down", d: "right", ArrowUp: "up", ArrowLeft: "left", ArrowDown: "down", ArrowRight: "right" };
  function setPos(x, y) { P.x = x; P.y = y; player.style.left = x + "px"; player.style.top = y + "px"; }
  function center() { const s = size(); setPos(s / 2 - P.w / 2, s * 0.72); }
  function placeAtEdge(exitDir) { // arrive on the opposite edge from where we left
    const s = size(), m = 14;
    if (exitDir === "right") setPos(m, P.y);
    if (exitDir === "left")  setPos(s - P.w - m, P.y);
    if (exitDir === "down")  setPos(P.x, m);
    if (exitDir === "up")    setPos(P.x, s - P.h - m);
  }

  window.addEventListener("keydown", (e) => {
    const d = KEYMAP[e.key];
    if (!d) return;
    if (e.target?.closest?.("input, textarea")) return;
    e.preventDefault(); keys.add(d);
  });
  window.addEventListener("keyup", (e) => { const d = KEYMAP[e.key]; if (d) keys.delete(d); });
  window.addEventListener("blur", () => keys.clear());
  document.querySelectorAll("#dpad button").forEach((b) => {
    const d = KEYMAP[b.dataset.key];
    const on = (e) => { e.preventDefault(); keys.add(d); };
    const off = () => keys.delete(d);
    b.addEventListener("pointerdown", on); b.addEventListener("pointerup", off); b.addEventListener("pointerleave", off); b.addEventListener("pointercancel", off);
  });

  function tick() {
    if (!busy && keys.size) {
      let dx = 0, dy = 0;
      if (keys.has("left")) dx -= 1; if (keys.has("right")) dx += 1;
      if (keys.has("up")) dy -= 1; if (keys.has("down")) dy += 1;
      if (dx && dy) { dx *= 0.7071; dy *= 0.7071; }
      const s = size();
      const nx = P.x + dx * P.speed, ny = P.y + dy * P.speed;
      if (nx + P.w / 2 < 0) roll("left");
      else if (nx + P.w / 2 > s) roll("right");
      else if (ny + P.h / 2 < 0) roll("up");
      else if (ny + P.h / 2 > s) roll("down");
      else setPos(nx, ny);
      player.classList.add("walking");
      if (dx) player.style.setProperty("--dir", dx);
    } else player.classList.remove("walking");
    requestAnimationFrame(tick);
  }

  // ---------- Init ----------
  $("brand").textContent = SITE.name;
  if (SITE.accent) document.documentElement.style.setProperty("--accent", SITE.accent);
  applyMatrix(); fixOrientation(); center(); updateHud();
  window.addEventListener("resize", () => { layoutFaces(); center(); });
  requestAnimationFrame(tick);
})();
