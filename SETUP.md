# One-time GitHub setup

Do these once, in the web UI, to lock editing to this PC and to hand
build + deploy to GitHub Actions.

## 1. Register this PC as the only allowed signer

The signing key already exists on this machine at
`~/.ssh/id_ed25519.pub`. Its full contents:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILJcjMhKQ4TsFLNpJGBjJxRS9YC2OrYWUPujiT9Q68vK snorkledubs-DBRRJHS-7EL751A-20260909
```

Add it as a **Signing Key** on GitHub:

- https://github.com/settings/ssh/new
- Key type: **Signing Key**
- Title: "This PC"
- Paste the line above, save.

Optionally add the same key again as an **Authentication Key** and switch
the git remote to SSH so pushes also need this key:

```bash
git -C E:/portfolio remote set-url origin git@github.com:snorkledubs/snorkledubs.github.io.git
```

## 2. Require every commit on main to be signed

- https://github.com/snorkledubs/snorkledubs.github.io/settings/rules/new
- Rule type: **Branch ruleset**
- Target: `main`
- Enforcement: **Active**
- Enable **Require signed commits**
- (Recommended) Enable **Restrict pushes** and set the bypass list to
  yourself only.
- Save.

After this, any commit not signed by the ed25519 key above is rejected
by the server, even from another PC using your GitHub password.

## 3. Move deploys to GitHub Actions

- https://github.com/snorkledubs/snorkledubs.github.io/settings/pages
- Source: **GitHub Actions**
- Save.

Now every push to `main` runs `.github/workflows/pages.yml`, which
rebuilds `room.bundle.js` from source and publishes the site.

After the first successful Actions run, you can stop tracking the
committed bundle:

```bash
git -C E:/portfolio rm --cached room.bundle.js
echo room.bundle.js >> E:/portfolio/.gitignore
git -C E:/portfolio add .gitignore
git -C E:/portfolio commit -m "Stop tracking built bundle; CI rebuilds on push"
git -C E:/portfolio push
```

## 4. Force HTTPS

Same page — https://github.com/snorkledubs/snorkledubs.github.io/settings/pages
— enable **Enforce HTTPS**.
