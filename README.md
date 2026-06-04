# my-learnings

A static site hosted on GitHub Pages — a running notebook of notes and interactive visualizations.

**Live site:** `https://<your-github-username>.github.io/<repo-name>/` (after enabling Pages — see below).

## Structure

```
.
├── index.html             # Home page (renders the posts + viz grid)
├── about.html             # About page
├── 404.html               # Custom 404 page
├── posts/                 # Notes (one .html file per post)
│   ├── welcome.html       # Sample first post
│   └── _template.html     # Copy this to start a new post
├── visualizations/        # Self-contained interactive HTML pages
│   ├── ansible-visual-primer.html
│   ├── l40s-gpu-internals.html
│   ├── nim-triton-gpu-sharing.html
│   └── VISUALIZATION_STYLE_GUIDE.md   # Spec for deep-dive technical viz (GPU/systems style)
├── assets/
│   ├── css/
│   │   ├── base.css       # Shared layout, nav, cards, dark theme
│   │   ├── components.css # Interactive widgets: btn, pill, stage, tab, fleet, drift-vm, log
│   │   └── post.css       # Article reading styles
│   ├── js/
│   │   └── posts.js       # Content manifest + home-page renderer
│   └── img/               # Static images (empty for now)
├── SITE_STYLE_GUIDE.md    # Shared visual language for ALL pages — read first
├── .nojekyll              # Disables GitHub's Jekyll processing
├── .gitignore
└── README.md
```

## Local preview

No build step. Just open `index.html` in a browser, or run a tiny local server so relative paths behave like they will in production:

```bash
# Python (built-in)
python3 -m http.server 8080
# then visit http://localhost:8080

# Or with Node
npx serve .
```

## Publishing to GitHub Pages

1. Create a new repository on GitHub (e.g. `my-learnings`).
2. From this folder, initialize and push:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment**
   - **Source:** Deploy from a branch
   - **Branch:** `main` / `/ (root)`
   - Save. The site will be live at `https://<username>.github.io/<repo-name>/` within a minute or two.

> Tip: For a root user site at `https://<username>.github.io/`, name the repo exactly `<username>.github.io` instead of `my-learnings`.

## Adding a new note

1. Copy `posts/_template.html` to `posts/<your-slug>.html`.
2. Replace the title, date, subtitle, tags, and body content.
3. Open `assets/js/posts.js` and add a new entry to the `posts` array:
   ```js
   {
     title: "Your post title",
     slug: "your-slug.html",
     date: "2026-05-12",
     summary: "One-line description for the home grid.",
     tags: ["systems"]
   }
   ```
4. Commit and push — GitHub Pages redeploys automatically.

## Adding a new visualization

1. Drop a self-contained HTML file into `visualizations/`. Use `visualizations/ansible-visual-primer.html` as the skeleton — header, hero, section rhythm, footer.
2. Link `assets/css/base.css` and (if using interactive widgets) `assets/css/components.css`.
3. Add a matching entry to the `visualizations` array in `assets/js/posts.js`.

## Design system — read before building

The site has **two style guides**, layered:

- **[`SITE_STYLE_GUIDE.md`](SITE_STYLE_GUIDE.md)** — required reading. Defines the shared visual language (palette, typography, header, footer, cards, buttons, stages, tabs, fleet cells) used on every page. The reference implementation is `visualizations/ansible-visual-primer.html`.

- **[`visualizations/VISUALIZATION_STYLE_GUIDE.md`](visualizations/VISUALIZATION_STYLE_GUIDE.md)** — additional reading for deep-dive technical visualizations (animated cell grids of real GPU SMs, matrix sweeps, particle canvases, scheduler timelines). Used in `l40s-gpu-internals.html` and `nim-triton-gpu-sharing.html`. Layers on top of the site guide.

For most learning pages — interactive simulators, tabbed use cases, comparison demos — `SITE_STYLE_GUIDE.md` alone is enough.

## Conventions

- All paths are relative — no leading `/` — so the site works at any subpath.
- Pages in subfolders (`posts/`, `visualizations/`) reference CSS with `../assets/...`.
- The `.nojekyll` file ensures GitHub Pages serves files exactly as-is (no Liquid templating, no folders named with leading `_` being skipped).
- Files prefixed with `_` (like `_template.html`) are just a convention to mark them as not-for-publication. They will still be served by GitHub Pages, so don't link to them from anywhere public.
