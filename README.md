# Portfolio

A first-person PS1-style room. You're strapped into a chair facing a desk of
CRT TVs; each TV is one section. Click a TV to open it while the avatar talks.
Built on three.js (loaded from unpkg), no build step. Push to GitHub and it's
a public website.

| File | What it is |
|---|---|
| `index.html` | The room. Scene, avatar, customizer, dialogue. |
| `data.js` | **All your content.** The only file you need to edit. |
| `classic.html` | Plain scrolling version of the same content, linked as "Plain". |
| `prototypes/` | Earlier ideas (8-bit house, rolling cube). Kept for parts. |
| `assets/fonts/` | Press Start 2P and VT323, served locally. |

The room needs a local server to run (browsers block ES modules on `file://`):

```bash
python -m http.server 8765
```

then open http://localhost:8765/.

## Edit your content

Everything you'd ever change lives in **`data.js`**:

| Section    | What it controls                                              |
|------------|---------------------------------------------------------------|
| `SITE`     | Name, role, tagline, email, social links, accent color, avatar |
| `ABOUT`    | The About paragraph (HTML allowed)                            |
| `SKILLS`   | Grouped skill tags                                            |
| `PROJECTS` | Project cards. Hidden until `SITE.showProjects` is true       |
| `TIMELINE` | Experience entries, shown on the WORK screen                  |
| `EDUCATION`| Shown on the SCHOOL screen                                    |
| `HOBBIES`  | Shown on the OFF HOURS screen                                 |
| `BLOG`     | Writeups, shown on the plain page                             |
| `DIALOGUE` | What the avatar says for each screen. `{name}` = avatar name  |

A project entry:

```js
{
  title: "My Project",
  description: "One or two sentences about what it does.",
  tags: ["C++", "Hardware"],        // powers the filter buttons
  image: "assets/myproject.png",    // optional screenshot, or ""
  repo: "https://github.com/you/myproject",   // optional
  demo: "",                         // optional live link
  featured: true,                   // optional, highlights the card
}
```

Drop screenshots and your avatar into `assets/`.

Colors, fonts and spacing are CSS variables at the top of `styles.css`.
The accent color can also be set from `data.js` via `SITE.accent`.

## Publish on GitHub Pages (free, public URL)

1. Create a new **public** repo on GitHub. Name it `<your-username>.github.io`
   to get the URL `https://<your-username>.github.io/`. Any other name works
   too and gives `https://<your-username>.github.io/<repo-name>/`.
2. Push this folder:

   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)` → Save**.
4. Wait a minute. Your site is live. Every future `git push` updates it.

## Keeping your projects safe

This site is the index. The projects themselves should each live in their own
GitHub repo so nothing is lost if this machine dies. For each project folder:

```bash
cd "E:\some-project"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then paste that repo URL into the project's `repo` field in `data.js`.
Repos can be private and still be linked from here. Only you will be able to
open them, but the link is preserved.

Large binaries, build outputs and secrets should not go in git. Use a
`.gitignore` per project.
