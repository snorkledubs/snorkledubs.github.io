(() => {
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pretty = (u) => u.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const NAMES = { github: 'GitHub', linkedin: 'LinkedIn', twitter: 'Twitter / X', resume: 'Resume' };
  const S = (typeof SITE !== 'undefined') ? SITE : { name: 'Azal', tagline: '', links: {} };

  document.getElementById('name').textContent = S.name || 'Azal';
  document.getElementById('tagline').textContent = S.tagline || '';
  const abt = document.getElementById('about');
  if (typeof ABOUT !== 'undefined') abt.innerHTML = ABOUT;

  const rows = [];
  if (S.email) rows.push(['EMAIL', S.email, 'mailto:' + S.email]);
  for (const [k, u] of Object.entries(S.links || {})) {
    if (!u) continue;
    rows.push([(NAMES[k] || k).toUpperCase(), pretty(u), u]);
  }
  rows.push(['ROOM', 'the strapped-in version', '/']);
  rows.push(['PLAIN', 'plain scrolling page', '/classic.html']);

  const el = document.getElementById('links');
  el.innerHTML = rows.map(([k, v, u]) => {
    const ext = /^https?:\/\//.test(u);
    const rel = ext ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${esc(u)}"${rel}><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></a>`;
  }).join('');
})();
