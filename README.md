# Portfolio

A zero-build personal portfolio. Plain HTML, CSS and JS. No dependencies, no
framework, nothing to install. Double-click `index.html` and it works. Push it
to GitHub and it becomes a public website.

## Edit your content

Everything you'd ever change lives in **`data.js`**:

| Section    | What it controls                                              |
|------------|---------------------------------------------------------------|
| `SITE`     | Name, role, tagline, email, social links, accent color, avatar |
| `ABOUT`    | The About paragraph (HTML allowed)                            |
| `SKILLS`   | Grouped skill tags                                            |
| `PROJECTS` | The project cards. Order in the file = order on the page      |

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
