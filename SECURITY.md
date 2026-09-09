# Security

This is a personal static site. There is no backend, no database, no
form that reaches a server. Pages are served from GitHub over HTTPS
with a strict Content Security Policy: scripts, styles, and fonts
load only from this origin, no inline script, no third-party
connections, no analytics.

## Reporting

If you spot something that reflects a real security issue — an XSS
in the room, a way to reach code the CSP shouldn't allow, a
credential leak in the repo — email **snorkledubs@gmail.com**.
Please include a proof of concept and a description.

## What this repo does not need reports for

- Missing headers that don't matter for a static site (HSTS is set
  by GitHub Pages, referrer-policy is `no-referrer`).
- The dev vendor/ directory being served. Nothing loads from it;
  it exists so the bundle can be rebuilt from source.

## Signing

Every commit on `main` is signed with the ed25519 key that lives
only on the author's PC. GitHub enforces this via branch
protection: any commit not verified against the registered signing
key is rejected on push.
