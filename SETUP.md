# GitHub setup — done

Everything below is already applied. This file is a receipt.

- **HTTPS enforced** on Pages.
- **Pages source: GitHub Actions.** Every push to `main` runs
  `.github/workflows/pages.yml`, which rebuilds `room.bundle.js`
  and publishes the site.
- **Branch protection on `main`:** force pushes blocked, branch
  deletion blocked, linear history required, and **signed commits
  required**.
- **Commit signing on this PC:** an ed25519 key was generated at
  `~/.ssh/id_ed25519` and git signs every commit and tag with it.
  `git log --show-signature` confirms locally; the GitHub REST API
  reports the last few commits as `"verified": true`.
- **SSH signing key registered on GitHub** (id 1166592, title
  "This PC"). Any commit not signed by this key is rejected by the
  server, so pushes now only work from this PC.

## After the first CI deploy

Once you see a green run under Actions, you can stop tracking the
built bundle so the two of you aren't fighting over `room.bundle.js`:

```bash
git -C E:/portfolio rm --cached room.bundle.js
echo room.bundle.js >> E:/portfolio/.gitignore
git -C E:/portfolio add .gitignore
git -C E:/portfolio commit -m "Stop tracking built bundle; CI rebuilds on push"
git -C E:/portfolio push
```
