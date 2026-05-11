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
│   └── gpu-multimodel-viz.html
├── assets/
│   ├── css/
│   │   ├── base.css       # Shared layout, nav, cards, dark theme
│   │   └── post.css       # Article reading styles
│   ├── js/
│   │   └── posts.js       # Content manifest + home-page renderer
│   └── img/               # Static images (empty for now)
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

1. Drop a self-contained HTML file into `visualizations/`.
2. Add a matching entry to the `visualizations` array in `assets/js/posts.js`.

## Conventions

- All paths are relative — no leading `/` — so the site works at any subpath.
- Pages in subfolders (`posts/`, `visualizations/`) reference CSS with `../assets/...`.
- The `.nojekyll` file ensures GitHub Pages serves files exactly as-is (no Liquid templating, no folders named with leading `_` being skipped).
- Files prefixed with `_` (like `_template.html`) are just a convention to mark them as not-for-publication. They will still be served by GitHub Pages, so don't link to them from anywhere public.
