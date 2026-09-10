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

- **`room.bundle.js` is no longer tracked.** CI rebuilds it fresh on
  every push and stages it into `_site/`. Repo drops ~600KB per clone.
- **CI stage excludes** `.gitignore`, `.gitattributes`, `README.md`,
  `SETUP.md`, `SECURITY.md` so the deployed site is smaller and cleaner.

## Optional: tighten the auth lock to SSH-only

Right now pushes still work over HTTPS (your GitHub credentials), which
means the *server-side* signed-commits rule is the only thing that
rejects a non-PC push. To also require this PC's SSH key on the auth
side:

1. Add the same public key at https://github.com/settings/ssh/new
   with type **Authentication Key** (title "This PC (auth)"):
   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILJcjMhKQ4TsFLNpJGBjJxRS9YC2OrYWUPujiT9Q68vK snorkledubs-DBRRJHS-7EL751A-20260909
   ```
2. Switch the local remote back to SSH:
   ```bash
   git -C E:/portfolio remote set-url origin git@github.com:snorkledubs/snorkledubs.github.io.git
   ```

After that, both **auth** (needs the SSH key on disk) and **accept**
(needs a signed commit) require this PC. Any other machine is locked
out of pushes.
