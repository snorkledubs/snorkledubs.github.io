// 8-bit house portfolio. Rooms come from HOUSE in data.js; content from the
// other data.js exports. Everything is drawn on a canvas at 16px tiles and
// scaled up with nearest-neighbour so it stays crisp.
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const T = 16;                 // tile size in logical pixels
  const WALL_ROWS = 2;          // top wall band height in tiles
  const ACCENT = SITE.accent || "#7c5cff";
  document.documentElement.style.setProperty("--accent", ACCENT);

  // ---------------- Palette + sprites ----------------
  const C = {
    K: "#15141f", W: "#f4f4f4", G1: "#c9cdd6", G2: "#8a909e", G3: "#4a4f5c",
    wood: "#b07d46", wood2: "#8a5a2b", wood3: "#5c3a17", cream: "#efe2c0", cream2: "#dccaa0",
    green: "#3fa34d", green2: "#2a7233", red: "#d63b3b", red2: "#9b2626", yellow: "#f2c94c",
    blue: "#3b6fd6", blue2: "#26479c", sky: "#9ad7f5", sky2: "#5fb6e8", screen: "#7de3f4", screen2: "#1b6d80",
    metal: "#a9b0bc", metal2: "#6b727f", accent: ACCENT, pcb: "#2f7a4f", pcb2: "#1e5335",
  };
  // Each sprite: size in tiles, and rects [x, y, w, h, colorKey] in logical px.
  const SPR = {
    door: { w: 2, h: 2, wall: true, r: [[2, 0, 28, 32, "K"], [4, 2, 24, 30, "wood2"], [6, 4, 20, 26, "wood"], [8, 6, 7, 9, "wood2"], [17, 6, 7, 9, "wood2"], [8, 18, 7, 9, "wood2"], [17, 18, 7, 9, "wood2"], [21, 16, 3, 3, "yellow"]] },
    window: { w: 2, h: 2, wall: true, r: [[2, 2, 28, 26, "K"], [4, 4, 24, 22, "sky"], [4, 4, 24, 6, "sky2"], [15, 4, 2, 22, "K"], [4, 14, 24, 2, "K"], [0, 27, 32, 3, "wood2"], [0, 26, 32, 1, "K"], [7, 8, 5, 3, "W"], [20, 18, 6, 3, "W"]] },
    frame: { w: 1, h: 1, wall: true, r: [[1, 1, 14, 14, "K"], [2, 2, 12, 12, "yellow"], [4, 4, 8, 8, "blue"], [6, 6, 4, 3, "#f1c27d"], [6, 9, 4, 3, "accent"]] },
    clock: { w: 1, h: 1, wall: true, r: [[2, 1, 12, 13, "K"], [3, 2, 10, 11, "W"], [7, 4, 2, 5, "K"], [8, 8, 3, 2, "K"], [3, 2, 10, 1, "red"]] },
    mailbox: { w: 1, h: 2, r: [[6, 14, 4, 18, "wood3"], [1, 2, 14, 12, "K"], [2, 3, 12, 10, "blue"], [2, 3, 12, 3, "blue2"], [10, 6, 3, 5, "red"], [4, 7, 5, 2, "W"]] },
    rug: { w: 3, h: 2, flat: true, r: [[0, 0, 48, 32, "red2"], [2, 2, 44, 28, "red"], [5, 5, 38, 22, "red2"], [8, 8, 32, 16, "red"], [20, 12, 8, 8, "yellow"]] },
    plant: { w: 1, h: 2, r: [[3, 20, 10, 12, "K"], [4, 21, 8, 10, "wood2"], [4, 21, 8, 3, "wood"], [6, 12, 4, 9, "green2"], [1, 6, 6, 8, "green"], [9, 4, 6, 9, "green"], [4, 1, 8, 8, "green"], [6, 3, 3, 3, "green2"], [10, 9, 2, 2, "green2"]] },
    bookshelf: { w: 2, h: 3, r: [[0, 0, 32, 48, "K"], [2, 2, 28, 44, "wood2"], [4, 4, 24, 12, "wood3"], [4, 18, 24, 12, "wood3"], [4, 32, 24, 12, "wood3"],
      [5, 6, 4, 10, "red"], [10, 5, 3, 11, "blue"], [14, 7, 5, 9, "green"], [20, 5, 3, 11, "yellow"], [24, 6, 3, 10, "accent"],
      [5, 20, 3, 10, "blue"], [9, 19, 5, 11, "yellow"], [15, 21, 3, 9, "red"], [19, 19, 4, 11, "green"], [24, 20, 3, 10, "W"],
      [5, 34, 5, 10, "accent"], [11, 33, 3, 11, "red"], [15, 35, 4, 9, "blue"], [20, 33, 3, 11, "W"], [24, 34, 4, 10, "green"]] },
    desk: { w: 3, h: 2, r: [[0, 14, 48, 18, "K"], [2, 16, 44, 14, "wood"], [2, 16, 44, 2, "wood2"], [4, 30, 4, 2, "wood3"], [40, 30, 4, 2, "wood3"],
      [14, 0, 20, 15, "K"], [16, 2, 16, 11, "screen2"], [17, 3, 14, 9, "screen"], [18, 4, 8, 1, "W"], [18, 6, 11, 1, "W"], [18, 8, 6, 1, "W"], [22, 13, 4, 3, "K"],
      [8, 20, 14, 5, "G3"], [9, 21, 12, 3, "G1"], [30, 21, 5, 4, "K"], [31, 22, 3, 2, "G1"]] },
    lamp: { w: 1, h: 2, r: [[4, 28, 8, 4, "K"], [7, 10, 2, 18, "metal2"], [2, 2, 12, 9, "K"], [3, 3, 10, 7, "yellow"], [3, 3, 10, 2, "#f7dd7a"]] },
    bench: { w: 4, h: 2, r: [[0, 12, 64, 20, "K"], [2, 14, 60, 12, "metal"], [2, 14, 60, 2, "W"], [4, 26, 6, 6, "metal2"], [54, 26, 6, 6, "metal2"],
      [6, 4, 22, 12, "K"], [7, 5, 20, 10, "pcb"], [9, 7, 5, 4, "K"], [16, 7, 6, 6, "K"], [10, 12, 14, 1, "pcb2"], [24, 6, 2, 2, "yellow"], [24, 9, 2, 2, "red"],
      [36, 6, 3, 10, "K"], [37, 7, 1, 8, "metal"], [44, 8, 12, 4, "K"], [45, 9, 10, 2, "red"], [40, 16, 18, 1, "G3"], [30, 18, 3, 3, "yellow"], [34, 19, 3, 3, "green"], [38, 18, 3, 3, "blue"]] },
    toolbox: { w: 2, h: 1, r: [[2, 4, 28, 12, "K"], [3, 5, 26, 10, "red"], [3, 5, 26, 3, "red2"], [12, 1, 8, 4, "K"], [13, 2, 6, 2, "metal"], [14, 8, 4, 3, "metal"]] },
    crate: { w: 2, h: 2, r: [[0, 0, 32, 32, "K"], [2, 2, 28, 28, "wood"], [2, 2, 28, 3, "wood2"], [2, 27, 28, 3, "wood2"], [2, 2, 3, 28, "wood2"], [27, 2, 3, 28, "wood2"],
      [6, 6, 3, 3, "wood3"], [9, 9, 3, 3, "wood3"], [12, 12, 3, 3, "wood3"], [15, 15, 3, 3, "wood3"], [18, 18, 3, 3, "wood3"], [21, 21, 3, 3, "wood3"],
      [21, 6, 3, 3, "wood3"], [18, 9, 3, 3, "wood3"], [12, 18, 3, 3, "wood3"], [9, 21, 3, 3, "wood3"]] },
  };
  // Player: 12x16 pixel maps. '.' transparent.
  const PAL = { k: "#15141f", s: "#f1c27d", h: "#2b1d0e", p: ACCENT, u: "#2f3a6b", w: "#f4f4f4", d: "#c99a5c" };
  const PLAYER = {
    down: [
      "....hhhh....", "...hhhhhh...", "...hsssshh..", "...hskssks..", "...ssssss...", "....ssds....",
      "...pppppp...", "..pppppppp..", "..spppppps..", "..s.pppp.s..", "....pppp....", "....uuuu....",
      "....uuuu....", "....u..u....", "...kk..kk...", "...kk..kk...",
    ],
    up: [
      "....hhhh....", "...hhhhhh...", "...hhhhhhh..", "...hhhhhh...", "...shhhhs...", "....ssss....",
      "...pppppp...", "..pppppppp..", "..spppppps..", "..s.pppp.s..", "....pppp....", "....uuuu....",
      "....uuuu....", "....u..u....", "...kk..kk...", "...kk..kk...",
    ],
    side: [
      "....hhhh....", "...hhhhhh...", "...hhhsss...", "...hhhsks...", "...hsssss...", "....ssss....",
      "....pppp....", "...pppppp...", "...pppppps..", "...pppppps..", "....pppp....", "....uuuu....",
      "....uuuu....", "....u..u....", "...kk..kk...", "...kk..kk...",
    ],
  };
  // Walk frames: legs swapped by shifting the bottom rows.
  function playerFrame(dir, step) {
    const base = PLAYER[dir === "left" || dir === "right" ? "side" : dir];
    if (!step) return base;
    const f = base.slice();
    f[13] = "....u..u...."; f[14] = "..kk....kk.."; f[15] = "..kk....kk..";
    return f;
  }

  // ---------------- Canvas + rendering ----------------
  const canvas = $("game"), ctx = canvas.getContext("2d");
  const wrap = $("room-wrap"), stage = $("stage"), bubble = $("bubble");
  ctx.imageSmoothingEnabled = false;
  let scale = 3;

  const rooms = Object.fromEntries(HOUSE.rooms.map((r) => [r.id, r]));
  let room = rooms[HOUSE.start] || HOUSE.rooms[0];

  function objRect(o) { const s = SPR[o.sprite]; return { x: o.x * T, y: o.y * T, w: s.w * T, h: s.h * T }; }
  function drawSprite(spr, x, y, flip) {
    spr.r.forEach(([rx, ry, rw, rh, c]) => {
      ctx.fillStyle = C[c] || c;
      ctx.fillRect(x + (flip ? spr.w * T - rx - rw : rx), y + ry, rw, rh);
    });
  }
  function drawPixels(map, x, y, flip) {
    map.forEach((row, py) => {
      for (let px = 0; px < row.length; px++) {
        const ch = row[px]; if (ch === ".") continue;
        ctx.fillStyle = PAL[ch]; ctx.fillRect(x + (flip ? row.length - 1 - px : px), y + py, 1, 1);
      }
    });
  }

  const WALLS = { cream: ["#efe2c0", "#e2d2a8"], blue: ["#6f8fc4", "#5d7cb0"], grey: ["#9aa0aa", "#878d98"] };
  const FLOORS = {
    wood: (W, H) => { for (let y = WALL_ROWS * T; y < H; y += 8) for (let x = 0; x < W; x += 32) { const off = ((y / 8) % 2) * 16; ctx.fillStyle = ((x + y) / 8) % 3 ? C.wood : "#a8763f"; ctx.fillRect(x - off, y, 32, 8); ctx.fillStyle = C.wood3; ctx.fillRect(x - off, y, 1, 8); ctx.fillRect(x - off, y + 7, 32, 1); } },
    carpet: (W, H) => { ctx.fillStyle = "#7a4b6b"; ctx.fillRect(0, WALL_ROWS * T, W, H); ctx.fillStyle = "#6b3f5d"; for (let y = WALL_ROWS * T; y < H; y += 8) for (let x = ((y / 8) % 2) * 4; x < W; x += 8) ctx.fillRect(x, y, 2, 2); },
    concrete: (W, H) => { ctx.fillStyle = "#7d7f86"; ctx.fillRect(0, WALL_ROWS * T, W, H); ctx.fillStyle = "#6e7077"; for (let y = WALL_ROWS * T; y < H; y += T) ctx.fillRect(0, y, W, 1); for (let x = 0; x < W; x += T * 2) ctx.fillRect(x, WALL_ROWS * T, 1, H); },
  };
  function exitRect(side) { // door openings on the room boundary, in logical px
    const W = room.w * T, H = room.h * T, mid = Math.floor(room.h / 2) * T + T;
    if (side === "left") return { x: 0, y: mid, w: 6, h: T * 2 };
    if (side === "right") return { x: W - 6, y: mid, w: 6, h: T * 2 };
    if (side === "top") return { x: Math.floor(room.w / 2) * T - T, y: 0, w: T * 2, h: WALL_ROWS * T };
    if (side === "bottom") return { x: Math.floor(room.w / 2) * T - T, y: H - 6, w: T * 2, h: 6 };
  }

  function render() {
    const W = room.w * T, H = room.h * T;
    const [w1, w2] = WALLS[room.wall] || WALLS.cream;
    ctx.fillStyle = w1; ctx.fillRect(0, 0, W, WALL_ROWS * T);
    ctx.fillStyle = w2; for (let x = 0; x < W; x += 16) ctx.fillRect(x + 6, 0, 4, WALL_ROWS * T);
    ctx.fillStyle = C.K; ctx.fillRect(0, WALL_ROWS * T - 3, W, 3); // baseboard
    (FLOORS[room.floor] || FLOORS.wood)(W, H);
    Object.keys(room.exits || {}).forEach((side) => {
      const e = exitRect(side); ctx.fillStyle = "#0b0b12"; ctx.fillRect(e.x, e.y, e.w, e.h);
      if (side === "left" || side === "right") { ctx.fillStyle = C.wood3; ctx.fillRect(e.x, e.y - 3, e.w, 3); ctx.fillRect(e.x, e.y + e.h, e.w, 3); }
    });
    // depth sort: flat things first, then by bottom edge, player included
    const items = room.objects.map((o) => ({ o, r: objRect(o), flat: SPR[o.sprite].flat }));
    items.push({ player: true, r: { x: P.x, y: P.y, w: 12, h: 16 } });
    items.sort((a, b) => (a.flat ? -1 : b.flat ? 1 : (a.r.y + a.r.h) - (b.r.y + b.r.h)));
    items.forEach((it) => {
      if (it.player) { ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(P.x + 2, P.y + 15, 8, 2); drawPixels(playerFrame(P.dir, P.step), Math.round(P.x), Math.round(P.y), P.dir === "left"); }
      else drawSprite(SPR[it.o.sprite], it.r.x, it.r.y, false);
    });
    // highlight target
    if (target) { const r = objRect(target); ctx.strokeStyle = ACCENT; ctx.lineWidth = 1; ctx.strokeRect(r.x - 1.5, r.y - 1.5, r.w + 3, r.h + 3); }
  }

  function fit() {
    const W = room.w * T, H = room.h * T;
    const availW = stage.clientWidth - 32, availH = stage.clientHeight - 80;
    scale = Math.max(2, Math.min(6, Math.floor(Math.min(availW / W, availH / H))));
    canvas.width = W; canvas.height = H;
    canvas.style.width = W * scale + "px"; canvas.style.height = H * scale + "px";
    ctx.imageSmoothingEnabled = false;
  }

  // ---------------- Player + movement ----------------
  const P = { x: 0, y: 0, dir: "down", step: 0, walkT: 0, speed: 1.35 };
  const keys = new Set();
  const KEYMAP = { w: "up", a: "left", s: "down", d: "right", ArrowUp: "up", ArrowLeft: "left", ArrowDown: "down", ArrowRight: "right" };
  let busy = false, target = null;

  function feet(x, y) { return { x: x + 2, y: y + 10, w: 8, h: 6 }; }
  function hit(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
  function blocked(x, y) {
    const f = feet(x, y), W = room.w * T, H = room.h * T;
    if (f.y < WALL_ROWS * T - 2) { // wall band, unless heading through a top exit
      const e = room.exits?.top && exitRect("top"); if (!(e && f.x >= e.x && f.x + f.w <= e.x + e.w)) return true;
    }
    if (f.x < 0 || f.x + f.w > W || f.y + f.h > H) {
      for (const side of Object.keys(room.exits || {})) { const e = exitRect(side); if (side !== "top" && hit(f, { x: e.x - 8, y: e.y, w: e.w + 16, h: e.h })) return false; }
      return true;
    }
    return room.objects.some((o) => o.solid !== false && !SPR[o.sprite].flat && !SPR[o.sprite].wall && hit(f, objRect(o)));
  }
  function nearestInteractable() {
    const f = feet(P.x, P.y), cx = f.x + f.w / 2, cy = f.y + f.h / 2;
    let best = null, bd = 18;
    room.objects.forEach((o) => {
      if (!o.open) return;
      const r = objRect(o);
      const dx = Math.max(r.x - cx, 0, cx - (r.x + r.w)), dy = Math.max(r.y - cy, 0, cy - (r.y + r.h));
      const d = Math.hypot(dx, dy);
      if (d < bd) { bd = d; best = o; }
    });
    return best;
  }
  function checkExit() {
    const f = feet(P.x, P.y), W = room.w * T, H = room.h * T;
    if (f.x + f.w <= 2 && room.exits?.left) return "left";
    if (f.x >= W - 2 && room.exits?.right) return "right";
    if (f.y + f.h <= 2 && room.exits?.top) return "top";
    if (f.y >= H - 2 && room.exits?.bottom) return "bottom";
    return null;
  }
  function enterRoom(id, from) {
    room = rooms[id]; fit();
    const W = room.w * T, H = room.h * T;
    const opp = { left: "right", right: "left", top: "bottom", bottom: "top" }[from];
    const e = exitRect(opp) || { x: W / 2, y: H / 2, w: 0, h: 0 };
    if (opp === "right") { P.x = W - 12 - 4; P.y = e.y + 8; }
    else if (opp === "left") { P.x = 4; P.y = e.y + 8; }
    else if (opp === "top") { P.x = e.x + 10; P.y = WALL_ROWS * T - 6; }
    else if (opp === "bottom") { P.x = e.x + 10; P.y = H - 20; }
    else { P.x = W / 2 - 6; P.y = H * 0.6; }
    $("room-name").textContent = room.name;
    document.title = `${room.name} · ${SITE.name}`;
  }
  function hop(dir) {
    const dx = dir === "right" ? 1 : dir === "left" ? -1 : 0, dy = dir === "bottom" ? 1 : dir === "top" ? -1 : 0;
    wrap.animate([
      { transform: "translate(0,0) scale(1)", offset: 0 },
      { transform: `translate(${dx * 4}%, ${dy * 4 - 5}%) scale(1.04)`, offset: 0.4, easing: "ease-in" },
      { transform: "translate(0,0) scale(1)", offset: 0.8 },
      { transform: "translate(0, 1%) scale(1.03, .97)", offset: 0.9 },
      { transform: "translate(0,0) scale(1)", offset: 1 },
    ], { duration: 620, easing: "ease-out" });
  }
  function transition(side) {
    busy = true; hop(side);
    setTimeout(() => { enterRoom(room.exits[side], side); }, 250);
    setTimeout(() => { busy = false; }, 620);
  }

  function update() {
    if (!busy && !panelOpen && keys.size) {
      let dx = 0, dy = 0;
      if (keys.has("left")) dx -= 1; if (keys.has("right")) dx += 1;
      if (keys.has("up")) dy -= 1; if (keys.has("down")) dy += 1;
      if (dx && dy) { dx *= 0.7071; dy *= 0.7071; }
      if (dx || dy) {
        P.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
        const nx = P.x + dx * P.speed, ny = P.y + dy * P.speed;
        if (!blocked(nx, P.y)) P.x = nx;
        if (!blocked(P.x, ny)) P.y = ny;
        P.walkT += 1; P.step = Math.floor(P.walkT / 9) % 2;
        const ex = checkExit(); if (ex) transition(ex);
      }
    } else { P.step = 0; }
    target = busy ? null : nearestInteractable();
    updateBubble();
    render();
  }
  function tick() { update(); requestAnimationFrame(tick); }
  function updateBubble() {
    if (!target || panelOpen) { bubble.hidden = true; return; }
    const r = objRect(target);
    bubble.innerHTML = `${esc(target.label || "Look")} <kbd>E</kbd>`;
    bubble.style.left = (r.x + r.w / 2) * scale + "px";
    bubble.style.top = (r.y - 4) * scale + "px";
    bubble.hidden = false;
  }

  // ---------------- Input ----------------
  window.addEventListener("keydown", (e) => {
    if (panelOpen) { if (e.key === "Escape") closePanel(); if (e.key === "ArrowRight") stepSlide(1); if (e.key === "ArrowLeft") stepSlide(-1); return; }
    const d = KEYMAP[e.key];
    if (d) { e.preventDefault(); keys.add(d); }
    if ((e.key === "e" || e.key === "E" || e.key === "Enter" || e.key === " ") && target) { e.preventDefault(); openFor(target); }
  });
  window.addEventListener("keyup", (e) => { const d = KEYMAP[e.key]; if (d) keys.delete(d); });
  window.addEventListener("blur", () => keys.clear());
  document.querySelectorAll("#dpad button").forEach((b) => {
    const k = b.dataset.key;
    if (k === "e") { b.addEventListener("click", () => target && openFor(target)); return; }
    const d = KEYMAP[k];
    const on = (e) => { e.preventDefault(); keys.add(d); }, off = () => keys.delete(d);
    b.addEventListener("pointerdown", on); b.addEventListener("pointerup", off); b.addEventListener("pointerleave", off); b.addEventListener("pointercancel", off);
  });
  function objAt(ev) {
    const rect = canvas.getBoundingClientRect();
    const x = (ev.clientX - rect.left) / scale, y = (ev.clientY - rect.top) / scale;
    return room.objects.find((o) => o.open && hit({ x, y, w: 0.1, h: 0.1 }, objRect(o)));
  }
  canvas.addEventListener("mousemove", (ev) => canvas.classList.toggle("pointing", !!objAt(ev)));
  canvas.addEventListener("click", (ev) => { const o = objAt(ev); if (o) openFor(o); });

  // ---------------- Showcase panel ----------------
  const panel = $("panel");
  let panelOpen = false, slides = [], slideIdx = 0, panelMeta = {};
  const linksHtml = (links) => links.length ? `<div class="links">${links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} &rarr;</a>`).join("")}</div>` : "";
  const social = Object.entries(SITE.links || {}).filter(([, u]) => u).map(([k, u]) => ({ label: k, url: u }));

  function contentFor(key) {
    if (key === "about") return { kicker: "About", title: "Who I am", slides: [{ html: ABOUT }] };
    if (key === "skills") return { kicker: "Skills", title: "What I work with", slides: [{ html: (SKILLS || []).map((g) => `<p><b>${esc(g.group)}</b></p><div class="chips">${g.items.map((i) => `<span>${esc(i)}</span>`).join("")}</div>`).join("") }] };
    if (key === "timeline") return { kicker: "Timeline", title: "Where I've been", slides: [{ html: (typeof TIMELINE !== "undefined" ? TIMELINE : []).map((t) => `<div class="row"><span class="when">${esc(t.when)}</span><span><b>${esc(t.title)}</b>${t.where ? ` · ${esc(t.where)}` : ""}<small>${esc(t.desc || "")}</small></span></div>`).join("") || "<p>Nothing here yet.</p>" }] };
    if (key === "blog") return { kicker: "Writeups", title: "Things I wrote down", slides: [{ html: (typeof BLOG !== "undefined" ? BLOG : []).map((b) => `<div class="row"><span class="when">${esc(b.date)}</span><span>${b.url ? `<a href="${esc(b.url)}"><b>${esc(b.title)}</b></a>` : `<b>${esc(b.title)}</b>`}<small>${esc(b.summary || "")}</small></span></div>`).join("") || "<p>Nothing published yet.</p>" }] };
    if (key === "contact") return { kicker: "Contact", title: "Say hi", slides: [{ html: `<p>${SITE.email ? `Email me at <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>.` : "Find me here:"}</p>${linksHtml(social)}` }] };
    if (key === "soon") return { kicker: "Workshop", title: "Under construction", slides: [{ html: "<p>Projects will show up on this bench once they're ready to be seen. Check back soon.</p>" }] };
    if (key.startsWith("project:")) {
      const p = PROJECTS[+key.split(":")[1]];
      if (!p) return { kicker: "Project", title: "Missing", slides: [{ html: "<p>No such project in data.js.</p>" }] };
      const links = [p.repo && { label: "Code", url: p.repo }, p.demo && { label: "Live", url: p.demo }].filter(Boolean);
      const intro = { html: `${p.image ? `<img src="${esc(p.image)}" alt="">` : ""}<p>${esc(p.description)}</p><div class="chips">${(p.tags || []).map((t) => `<span>${esc(t)}</span>`).join("")}</div>${linksHtml(links)}` };
      const steps = (p.walkthrough || []).map((s) => ({ heading: s.heading, html: `${s.image ? `<img src="${esc(s.image)}" alt="">` : ""}${s.text || ""}` }));
      return { kicker: p.featured ? "Featured project" : "Project", title: p.title, slides: [intro, ...steps] };
    }
    return { kicker: "?", title: key, slides: [{ html: "" }] };
  }
  function openFor(o) {
    const c = contentFor(o.open);
    panelMeta = c; slides = c.slides; slideIdx = 0;
    $("panel-kicker").textContent = c.kicker; renderSlide();
    panel.hidden = false; panelOpen = true; keys.clear();
  }
  function renderSlide() {
    const s = slides[slideIdx];
    $("panel-title").textContent = s.heading || panelMeta.title;
    $("panel-body").innerHTML = s.html;
    const nav = $("panel-nav"); nav.hidden = slides.length < 2;
    $("panel-step").textContent = `${slideIdx + 1} / ${slides.length}`;
    $("panel-prev").disabled = slideIdx === 0; $("panel-next").disabled = slideIdx === slides.length - 1;
  }
  function stepSlide(n) { const i = slideIdx + n; if (i >= 0 && i < slides.length) { slideIdx = i; renderSlide(); } }
  function closePanel() { panel.hidden = true; panelOpen = false; }
  $("panel-close").addEventListener("click", closePanel);
  $("panel-prev").addEventListener("click", () => stepSlide(-1));
  $("panel-next").addEventListener("click", () => stepSlide(1));
  panel.addEventListener("click", (e) => { if (e.target === panel) closePanel(); });

  // ---------------- Init ----------------
  $("brand").textContent = SITE.name;
  enterRoom(room.id, null);
  window.addEventListener("resize", fit);
  requestAnimationFrame(tick);
  // Debug hook for testing without the animation loop.
  window.__house = { update, keys, get P() { return P; }, get room() { return room; }, get target() { return target; }, openFor, closePanel, get panelOpen() { return panelOpen; } };
})();
