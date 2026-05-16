# Site Style Guide — my-learnings

This is the **site-wide** design system. Every page on `my-learnings` — home, about, posts, visualizations, 404 — must follow it so the body of work feels like one site, not a folder of accumulated experiments.

If you're building a heavy interactive deep-dive (the kind with cell grids, matrix sweeps, particle canvases — like `gpu-multimodel-viz.html`), also read `visualizations/VISUALIZATION_STYLE_GUIDE.md`. That guide layers domain-specific patterns on top of this one.

The reference implementation is **`visualizations/ansible-visual-primer.html`**. When in doubt, open that file.

---

## 1. The two CSS files

```
assets/css/base.css         — required on every page
assets/css/components.css   — required only when using interactive widgets
```

Load order, exactly:

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700&family=Syne:wght@400;700;800&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="assets/css/base.css" />
<link rel="stylesheet" href="assets/css/components.css" /> <!-- only if needed -->
<link rel="stylesheet" href="assets/css/post.css" />       <!-- only on /posts/ pages -->
```

From subfolders use `../assets/css/...`.

Do **not** redefine the CSS variables in `:root` on individual pages. The only exception is `404.html`, which inlines a minimal subset because relative paths can't be relied upon.

---

## 2. Color palette

Defined once in `base.css :root`. Always reference by variable, never by hex.

| Token              | Hex        | Use                                          |
|--------------------|------------|----------------------------------------------|
| `--bg`             | `#0c0e13`  | page background                              |
| `--surface`        | `#131623`  | alternating section background               |
| `--panel`          | `#151823`  | card / stage background                      |
| `--panel-2`        | `#1a1e2c`  | nested panel inside a card                   |
| `--panel-3`        | `#07090d`  | code block / log background                  |
| `--text-strong`    | `#f7f8fb`  | h1, h2, h3, primary headings                 |
| `--text`           | `#e7eaf2`  | body                                         |
| `--text-2`         | `#b9c0d3`  | secondary body, card descriptions            |
| `--dim`            | `#8b94ab`  | meta text, labels                            |
| `--dim-2`          | `#6b7488`  | comments, hints                              |
| **`--acc-1`**      | `#7c5cff`  | **primary brand — purple**                   |
| `--acc-2`          | `#5fe0cc`  | secondary — teal, "data flowing"             |
| `--acc-3`          | `#4ade80`  | success / "good"                             |
| `--acc-4`          | `#fbbf24`  | warning / "in progress"                      |
| `--acc-5`          | `#f87171`  | danger / drift / fail                        |
| `--acc-6`          | `#ff8a5b`  | highlight / "changed"                        |

Each accent has a `--acc-N-soft` (10% alpha) for tinted backgrounds.

### Rules

- **`--acc-1` is the brand.** Use it for the primary action, the active nav state, the eyebrow label above each section, the "current/now" thing. Don't substitute another accent for it.
- **Two-color diagrams.** When categorising things, pick `--acc-1` + `--acc-2`. Add a third only if you genuinely have three categories. Never rainbow.
- **Semantic accents stay semantic.** `--acc-3` only means good. `--acc-5` only means bad. `--acc-4` only means in-progress. Don't reuse them as decorative colors.
- **No hardcoded hex** in HTML or CSS outside `base.css`. If you need a tint, use `var(--acc-N-soft)`.

---

## 3. Typography

Three families, each with one job.

| Family            | When                                              |
|-------------------|---------------------------------------------------|
| System sans       | All body text. Set on `body { font-family: var(--font-sans); }`. |
| `Syne`            | Display headings: `.hero h1`, `.section h2`, `.section h3`, `.card-title`, `.post-title`. |
| `JetBrains Mono`  | Code (`<pre>`, `<code>`), labels (`.sec-eyebrow`, `.card-meta`, `.nav`), monospace UI bits. |

**Sizing** — use the existing classes (`h1`, `h2`, `h3`, `.lead`, `.card-title`, `.card-desc`, etc.) rather than inventing font-size values. If you need a custom size, prefer `clamp()` with sensible min/max.

**Weight.** Body 400. UI 500. Headings 700–800 (Syne). Never 600 — it falls between weights for both fonts.

**Line height.** Body 1.55. Reading prose (`.post-body`) 1.8. Headings 1.05–1.25.

**Case.** Sentence case for headings and body. UPPERCASE only for `.sec-eyebrow`, `.card-meta`, `.nav`, `.post-meta` — i.e. the small mono labels. No Title Case anywhere.

---

## 4. Page anatomy — required on every page

Every page has exactly this skeleton:

```html
<header class="site-header">
  <div class="container">
    <a class="logo" href="<root>"><div class="logo-top">my · learnings</div><div class="logo-main">notes <span>&</span> viz</div></a>
    <nav class="nav">
      <a href="<root>">Home</a>
      <a href="<root>#posts">Notes</a>
      <a href="<root>#viz">Visualizations</a>
      <a href="<root>about.html">About</a>
    </nav>
  </div>
</header>

<!-- page content -->

<footer class="site-footer">
  <div class="container">
    <div>© <span id="year"></span> my-learnings · built static · no tracking</div>
    <div><a href="<root>">home</a></div>
  </div>
</footer>

<script>document.getElementById("year").textContent = new Date().getFullYear();</script>
```

Replace `<root>` with `./` from root, `../` from one level deep.

The `.active` class on the matching nav link goes on whichever page you're on.

---

## 5. Section pattern

The standard rhythm. Each `<section class="section">` starts with an eyebrow label, then an h2, then a one-sentence lead, then content.

```html
<section class="section">
  <div class="container">
    <span class="sec-eyebrow">why it exists</span>
    <h2>Three principles that earn it a seat at the bank</h2>
    <p class="lead">Skim these once and the rest of the page will make sense.</p>

    <!-- content -->
  </div>
</section>
```

Older pages use `.sec-label` (numbered "01 · Notes" with a horizontal rule). Both are supported in `base.css` — prefer `.sec-eyebrow` for new work.

**Hero.** First section uses `<section class="hero">` instead of `.section`. The hero h1 gets the gradient text treatment automatically. Keep the hero short — 1–3 sentences and a row of `.pills`.

---

## 6. Component vocabulary

Everything below is defined in `components.css`. Use these classes; do not reinvent them inline.

### Cards

```html
<div class="card">
  <div class="ico"><svg .../></div>          <!-- optional, 36×36 icon -->
  <h3 class="card-title">Title</h3>
  <p>Description, ~2 sentences.</p>
</div>
```

The `.ico` accepts colour variants: `.ico.teal`, `.ico.green`, `.ico.amber`, `.ico.red`, `.ico.coral`. SVG icons go inside — stroke only, `currentColor`, `width="18" height="18"`.

Cards lift on hover by default. Disable with `.card.no-hover`.

### Buttons

```html
<button class="btn">primary action</button>
<button class="btn ghost">secondary</button>
<button class="btn" disabled>not yet</button>
```

One primary `.btn` per stage. Ghosts for resets and secondary actions.

### Pills (chip row)

```html
<div class="pills">
  <span class="pill">primary chip</span>
  <span class="pill teal">data chip</span>
</div>
```

Used in the hero and at the top of use-case sections to summarise. Keep to 3–6 chips per row.

### Stage (interactive demo container)

```html
<div class="stage">
  <div class="stage-toolbar">
    <div class="stage-title">what this demo shows — <code>relevant.thing</code></div>
    <div style="display:flex;gap:8px;">
      <button class="btn ghost">reset</button>
      <button class="btn">run</button>
    </div>
  </div>
  <!-- the demo -->
</div>
```

Every interactive widget lives inside a `.stage`. The toolbar holds title + controls.

### Tabs

```html
<div class="tabs">
  <div class="tab active" data-tab="a">First</div>
  <div class="tab" data-tab="b">Second</div>
</div>
<div class="tab-panel active" data-panel="a">…</div>
<div class="tab-panel" data-panel="b">…</div>
```

Standard show/hide JS. See `ansible-visual-primer.html` for the 12-line implementation.

### Panel pair (side-by-side)

```html
<div class="panel-pair">
  <div class="panel tinted-purple">…</div>
  <div class="panel tinted-teal">…</div>
</div>
```

Tints: `tinted-purple`, `tinted-teal`, `tinted-green`, `tinted-coral`, `tinted-red`. Use semantic tints (coral for "destroying", green for "healed").

### Numbered/badged row (clickable explainer)

```html
<div class="row" data-target="x">
  <span class="badge">SSH</span>
  <div class="body">
    <div class="t">Linux VMs</div>
    <div class="s">RHEL, Ubuntu, Amazon Linux</div>
  </div>
</div>

<div class="detail" id="explainer">Click a row above for details.</div>
```

Wire up with a tiny JS handler that toggles `.active` on the row and updates `.detail`'s innerHTML.

### Fleet of cells (server grids, simulators)

```html
<div class="fleet fleet-5" id="myFleet"></div>
```

Variants: `fleet-5`, `fleet-8`, `fleet-16`, `fleet-20`. Build with JS:

```js
const d = document.createElement('div');
d.className = 'cell';
d.innerHTML = '<div class="label">srv-01</div><div class="state">empty</div>';
fleet.appendChild(d);
```

State classes — apply via `setAttribute` or `classList`:
`cell.checking` (amber), `cell.changing` (coral), `cell.ok` (green), `cell.skip` (faint green), `cell.fail` (red), `cell.drift` (red).

### Stats row (run summary)

```html
<div class="stat-row">
  <div class="stat ok">ok <span class="n">5</span></div>
  <div class="stat changed">changed <span class="n">0</span></div>
  <div class="stat failed">failed <span class="n">0</span></div>
  <div class="stat runs">runs <span class="n">2</span></div>
</div>
```

Variants: `.stat.ok` `.stat.changed` `.stat.failed` `.stat.runs`.

### Log (terminal-style output)

```html
<div class="log" id="myLog">
  <div class="l sk">PLAY [Configure runners] *********************************</div>
  <div class="l ok">ok: [srv-01] => already at desired state</div>
  <div class="l ch">changed: [srv-02] => podman installed</div>
</div>
```

Line classes: `.l.ok` (green), `.l.ch` (coral), `.l.sk` (skip — dim), `.l.fa` (red).

### Drift-style VM card (before/after demos)

```html
<div class="drift-vm" id="myVm">
  <div class="vm-id">vm-id: i-04ac…be21</div>
  <div class="vm-state">healthy</div>
  <div class="vm-detail">schema v3, in service</div>
</div>
```

State classes: `drifted`, `destroying` (with shake), `gone` (faded out), `rebuilding`, `fixing`, `healed`.

### Progress bar

```html
<div class="progress"><div class="bar" id="p"></div></div>
```

Set `bar.style.width = '37%'` from JS.

---

## 7. Layout

| Class         | Purpose                                                |
|---------------|--------------------------------------------------------|
| `.container`  | Centres content at max 1080px, 32px side gutters.      |
| `.grid`       | Auto-fill grid, min 280px columns.                     |
| `.grid-2`     | Strict 2-column.                                        |
| `.grid-3`     | Strict 3-column.                                        |
| `.grid-4`     | Strict 4-column.                                        |
| `.uc-grid`    | 1.2fr / 1fr — explainer + visual side by side. (page-specific to ansible primer; lift to components.css if reused) |

All collapse to single column under 760px.

---

## 8. Animation principles

Mostly imported from the existing `VISUALIZATION_STYLE_GUIDE.md` — these are the abridged rules:

- **Idempotence simulator pattern**: 160–280ms per step. Each cell visibly checks → changes → settles.
- **Patch rolling pattern**: 5% batches with ~200ms per phase (drain, patch, reboot, return). Bar updates sync.
- **Drift recovery**: 800–1800ms per step. Use the shake animation on `destroying`.
- **Pulse (vault rotation)**: 800ms cubic-bezier animation per pulse.
- **Pulses must be earned.** Every animation teaches something. Pure decoration is not allowed.

Buttons control everything. No animation runs on page load without a click — except subtle ones (cert pin pulse). Always provide a `reset` button alongside the primary action.

---

## 9. Code snippets

For learning pages we want **few snippets**, not many. Aim for 3–6 small snippets per page, each making one point.

```html
<pre>
<span class="y">- </span><span class="k">name:</span> <span class="s">Ensure podman is installed</span>
  <span class="k">ansible.builtin.dnf:</span>
    <span class="k">name:</span> podman
    <span class="k">state:</span> <span class="n">present</span>     <span class="c"># declared state — not "run dnf install"</span>
</pre>
```

Token classes: `.k` (key), `.s` (string), `.c` (comment), `.n` (number/literal), `.y` (yaml dash). No syntax-highlighter library — hand-mark the tokens that matter.

For inline `<code>` inside body prose, just use `<code>` — `post.css` and `components.css` style it.

---

## 10. Adding a new page

1. **Note (writing).** Copy `posts/_template.html` → `posts/<slug>.html`. Add an entry to `assets/js/posts.js` `posts: [...]`.
2. **Visualization (interactive).** Copy `visualizations/ansible-visual-primer.html` as a starting skeleton (header, hero, sections, footer). Strip the page-specific widgets you don't need. Add an entry to `assets/js/posts.js` `visualizations: [...]`.

Both show up automatically on the home page sorted by date descending.

---

## 11. Validation checklist before committing a page

- [ ] Includes Google Fonts link, then `base.css`, then (if needed) `components.css` / `post.css` — in that order.
- [ ] Uses the standard `<header class="site-header">` and `<footer class="site-footer">`. The right nav link has `.active`.
- [ ] No hardcoded hex colors outside `base.css` (and the `404.html` inline subset).
- [ ] No font-size values smaller than 11px.
- [ ] No font-weight 600 (only 400, 500, 700, 800).
- [ ] No emojis in the page content. Use SVG icons inside `.ico` containers instead.
- [ ] Hero h1 has the gradient text. (Automatic if you used the existing markup.)
- [ ] Every interactive demo lives in a `.stage` with a `.stage-toolbar` and a primary `.btn` + ghost `.btn.ghost reset`.
- [ ] Every animation can be reset.
- [ ] Page renders correctly at 380px width — no horizontal scroll except inside `<pre>` blocks.
- [ ] Manifest entry added to `assets/js/posts.js` if this page should appear on the home grid.
- [ ] Visited from a fresh incognito window — no cached CSS surprises.

---

## 12. Don't drift

A few patterns explicitly avoided on this site:

- **No SaaS-style gradients** on cards or buttons except the brand purple→darker-purple on `.btn`. No rainbow gradients.
- **No box shadows for depth.** The brand uses a single subtle shadow on `.btn`. Cards don't lift via shadow — they lift via `transform`.
- **No icons inside flowchart boxes.** Text only. (If you want icons, put them in `.card .ico`.)
- **No section backgrounds outside the palette.** Don't slap a custom `background: #0a0a0a` on a section.
- **No external JS libraries** other than the per-page Google Fonts. No React, no Tailwind, no Chart.js for site pages. (The deep-dive viz pages may load specific libs, see `VISUALIZATION_STYLE_GUIDE.md`.)
- **No "click here" CTAs.** Wire the verb into the surrounding sentence: "Open the [Ansible primer](...)".

---

## 13. Relationship to `VISUALIZATION_STYLE_GUIDE.md`

`SITE_STYLE_GUIDE.md` (this file) covers the **shared visual language** — colors, typography, header, footer, cards, buttons, layout — that every page must follow.

`visualizations/VISUALIZATION_STYLE_GUIDE.md` covers the **deep-dive technical visualization** patterns — animated cell grids representing real GPU SMs, matrix sweeps showing dot-product structure, canvas particle flows, scheduler timelines — used in `gpu-multimodel-viz.html` and `nim-triton-gpu-sharing.html`.

Use this guide always. Use the visualization guide additionally when building that style of pixel-level systems explainer.

The Ansible-style learning page (interactive simulators with `.stage` widgets, tabs, fleet cells) sits between the two — covered by this guide alone.

---

## 14. When in doubt

- **Is a colour OK?** Only if it maps to a CSS variable.
- **Is a font-size OK?** Only if it matches an existing class or uses `clamp()` between sizes that exist.
- **Should this be a card or a panel?** Cards are clickable navigation tiles. Panels group related content inside a stage. If a user can click it to go somewhere, it's a card.
- **Should this animation auto-play?** No. (Exception: small, looping, reassuring pulses like cert markers.)
- **Should I add a new component to `components.css`?** Only if it's used on more than one page. Otherwise keep it inline at the top of the page in a small `<style>` block, with a comment saying "lift to components.css if reused."

The goal is a notebook that feels designed, not a folder of one-off pages. Optimise for the third reread, not the first scroll.
