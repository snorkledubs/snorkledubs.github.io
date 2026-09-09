// Renders data.js into the page. You should not need to edit this file.
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));

  // ---- Theme ----
  const root = document.documentElement;
  const saved = (() => { try { return localStorage.getItem("theme"); } catch { return null; } })();
  if (saved) root.setAttribute("data-theme", saved);
  else if (window.matchMedia("(prefers-color-scheme: light)").matches) root.setAttribute("data-theme", "light");
  $("theme-toggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
  });
  if (SITE.accent) root.style.setProperty("--accent", SITE.accent);

  // ---- Hero / meta ----
  document.title = `${SITE.name} — ${SITE.role}`;
  $("nav-brand").textContent = SITE.name;
  $("hero-role").textContent = SITE.role;
  $("hero-name").textContent = SITE.name;
  $("hero-tagline").textContent = SITE.tagline;
  if (SITE.avatar) { const a = $("avatar"); a.src = SITE.avatar; a.alt = SITE.name; a.hidden = false; }

  const social = $("social");
  const linkLabels = { github: "GitHub", linkedin: "LinkedIn", twitter: "Twitter / X", resume: "Resume" };
  Object.entries(SITE.links || {}).forEach(([key, url]) => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener";
    a.textContent = linkLabels[key] || key;
    social.appendChild(a);
  });
  if (SITE.email) {
    const a = document.createElement("a");
    a.href = `mailto:${SITE.email}`; a.textContent = "Email";
    social.appendChild(a);
  }

  // ---- About ----
  $("about-text").innerHTML = ABOUT; // trusted: your own content from data.js

  // ---- Projects ----
  const grid = $("projects-grid");
  const filters = $("filters");
  const allTags = [...new Set(PROJECTS.flatMap((p) => p.tags || []))].sort();

  function card(p) {
    const el = document.createElement("article");
    el.className = "card reveal" + (p.featured ? " featured" : "");
    el.dataset.tags = (p.tags || []).join("|");
    const img = p.image
      ? `<img class="card-img" src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`
      : `<div class="card-img placeholder">${esc((p.title || "?").trim()[0].toUpperCase())}</div>`;
    const links = [
      p.repo && `<a href="${esc(p.repo)}" target="_blank" rel="noopener">Code &rarr;</a>`,
      p.demo && `<a href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo &rarr;</a>`,
    ].filter(Boolean).join("");
    el.innerHTML = `
      ${img}
      <div class="card-body">
        <h3 class="card-title">${p.featured ? '<span class="star" title="Featured">&#9733;</span>' : ""}${esc(p.title)}</h3>
        <p class="card-desc">${esc(p.description)}</p>
        <div class="tags">${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        ${links ? `<div class="card-links">${links}</div>` : ""}
      </div>`;
    return el;
  }
  PROJECTS.forEach((p) => grid.appendChild(card(p)));

  function setFilter(tag) {
    filters.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("active", b.dataset.tag === tag));
    let shown = 0;
    grid.querySelectorAll(".card").forEach((c) => {
      const match = tag === "*" || c.dataset.tags.split("|").includes(tag);
      c.classList.toggle("hidden", !match);
      if (match) shown++;
    });
    let empty = grid.querySelector(".empty");
    if (!shown && !empty) { empty = document.createElement("p"); empty.className = "empty"; empty.textContent = "Nothing here yet."; grid.appendChild(empty); }
    if (shown && empty) empty.remove();
  }
  if (allTags.length) {
    ["*", ...allTags].forEach((t) => {
      const b = document.createElement("button");
      b.className = "filter-btn"; b.dataset.tag = t; b.textContent = t === "*" ? "All" : t;
      b.addEventListener("click", () => setFilter(t));
      filters.appendChild(b);
    });
    setFilter("*");
  }

  // ---- Skills ----
  const skills = $("skills");
  (SKILLS || []).forEach((g) => {
    const d = document.createElement("div");
    d.className = "skill-group reveal";
    d.innerHTML = `<h3>${esc(g.group)}</h3><ul>${g.items.map((i) => `<li class="tag">${esc(i)}</li>`).join("")}</ul>`;
    skills.appendChild(d);
  });

  // ---- Contact / footer ----
  const contact = $("contact-btn");
  if (SITE.email) contact.href = `mailto:${SITE.email}`; else contact.hidden = true;
  $("footer-text").textContent = `© ${new Date().getFullYear()} ${SITE.name}${SITE.location ? " · " + SITE.location : ""}`;

  // ---- Scroll reveal ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
