# GitHub setup

## Already done (automated from this PC)

- **HTTPS enforced** on Pages.
- **Pages source switched to GitHub Actions.** Every push to `main`
  runs `.github/workflows/pages.yml`, which rebuilds
  `room.bundle.js` and publishes the site.
- **Branch protection on `main`:** force pushes blocked, branch
  deletion blocked, linear history required.
- **Commit signing on this PC:** an ed25519 key was generated at
  `~/.ssh/id_ed25519` and git is set to sign every commit and tag
  with it. `git log --show-signature` confirms the last commits.

## Two web-UI steps left (30 seconds total)

The GitHub REST API refuses to add SSH keys to your account without
scopes that the token in your credential manager doesn't have, so
these two need the web UI.

### 1. Register this PC's key as a Signing Key

- https://github.com/settings/ssh/new
- Key type: **Signing Key**
- Title: **This PC**
- Paste:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILJcjMhKQ4TsFLNpJGBjJxRS9YC2OrYWUPujiT9Q68vK snorkledubs-DBRRJHS-7EL751A-20260909
```

- Save.

Optionally add the same key again as an **Authentication Key**, then
switch the remote to SSH so pushes also need this key:

```bash
git -C E:/portfolio remote set-url origin git@github.com:snorkledubs/snorkledubs.github.io.git
```

### 2. Require signed commits on `main`

- https://github.com/snorkledubs/snorkledubs.github.io/settings/branches
- Edit the existing `main` rule (or add a new one)
- Enable **Require signed commits**
- Save.

Only do this **after** step 1 — if the key isn't on file yet, your
next push will be rejected because GitHub can't verify the signature.

## After the first CI deploy

Once you see a green run under Actions, you can stop tracking the
built bundle so the two of us aren't fighting over `room.bundle.js`:

```bash
git -C E:/portfolio rm --cached room.bundle.js
echo room.bundle.js >> E:/portfolio/.gitignore
git -C E:/portfolio add .gitignore
git -C E:/portfolio commit -m "Stop tracking built bundle; CI rebuilds on push"
git -C E:/portfolio push
```
