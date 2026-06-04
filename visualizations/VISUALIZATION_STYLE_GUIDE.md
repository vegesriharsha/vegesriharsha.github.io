# Visualization Style Guide for Technical Learning Documents

This document specifies the design system, structure, and animation patterns used in `l40s-gpu-internals.html`. Other Claude sessions should follow this guide when producing new learning visualizations so the body of work stays visually consistent.

The reference implementation lives in this repository. Read this spec **and** open the reference file before producing a new visualization — the file is the source of truth for anything ambiguous here.

---

## 1. When to use this style

Use this style for **technical learning documents** that benefit from interactive exploration: deep dives into how a system works, conceptual explainers that build from primitive to composite, architecture walkthroughs, and reference material a small audience will return to.

Do **not** use this style for: short Q&A responses, simple charts, single-purpose dashboards, or anything that fits in a normal artifact. The style is heavy — a 70–100 KB self-contained HTML file with multiple animations — and is overkill for one-off questions.

The format is a **single self-contained HTML file**. No build step, no external JS dependencies, only Google Fonts as a remote resource. The file must work by double-clicking it locally and must work when hosted on GitHub Pages.

---

## 2. Visual identity

### Color palette

Define these CSS variables at the top of `:root`. Do not deviate.

```css
:root {
  --bg: #050810;       /* page background */
  --surface: #0a0f1e;  /* alternating section background */
  --panel: #0d1428;    /* card/panel background */
  --panel2: #111a30;   /* nested panel */
  --border: #1a2540;
  --border2: #243050;
  --text: #c8d8f0;
  --dim: #5a7090;

  /* Accent colors — semantic */
  --acc1: #00d4ff;  /* cyan      → primary, "current", hardware */
  --acc2: #a855f7;  /* violet    → secondary, software, tensor */
  --acc3: #10b981;  /* emerald   → success, "good" state */
  --acc4: #f59e0b;  /* amber     → output, result, "answer" */
  --acc5: #ef4444;  /* red       → warning, "bad" state */
  --acc6: #ec4899;  /* pink      → gradient endpoint */
}
```

When categorizing items in a series (e.g. four models, four pipeline stages), use `--acc1`, `--acc2`, `--acc3`, `--acc4` in that order. Reserve `--acc5` for warnings and `--acc6` only for gradients.

### Typography

Two fonts, loaded from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700&family=Syne:wght@400;700;800&display=swap" rel="stylesheet">
```

- **JetBrains Mono** — body text, code, labels, numbers in tables. Default for `body`.
- **Syne** — display headings, large numbers, section titles. Used sparingly for visual punctuation.

Body text is `font-size: 12px` with `line-height: 1.8`. Labels and table cells are `10–11px`. Tiny annotations are `9px`. Never go below 9px.

### Section rhythm

Sections alternate background between `var(--bg)` (default) and `var(--surface)` (style="background:var(--surface)") to create visible separation when scrolling. Always alternate — never two same-background sections in a row.

```html
<section id="s00">                                           <!-- bg -->
<section id="s01" style="background:var(--surface)">         <!-- surface -->
<section id="s02">                                           <!-- bg -->
<section id="s03" style="background:var(--surface)">         <!-- surface -->
```

Section padding is `28px 40px` on desktop, drops to `24px 20px` under 700px width.

### Section label convention

Every section starts with a `.sec-label` block: a numbered label in dim text with a horizontal rule extending to the right.

```html
<div class="sec-label">03 — Inside the Tensor Core · Tile Math &amp; Throughput</div>
```

The label is `text-transform: uppercase`, `letter-spacing: 0.2em`, `font-size: 10px`, `color: var(--dim)`. The horizontal rule is created via `::after { content: ''; flex: 1; height: 1px; background: var(--border); }`.

### Header

The page header is a flex row with a left-side logo block and right-side badge cluster. The logo uses Syne; the top line is uppercase tracked-out subtitle, the main line is bold display text with the last word(s) in `--acc1` color.

```html
<header>
  <div class="logo">
    <div class="logo-top">CONTEXT · SUB-CONTEXT · METADATA</div>
    <div class="logo-main">Main Title <span>Accent Word</span></div>
  </div>
  <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
    <span class="badge">Key Fact 1</span>
    <span class="badge" style="border-color:var(--acc2);color:var(--acc2)">Key Fact 2</span>
  </div>
</header>
```

### Table of contents

Below the header, a flex-wrap row of small button-styled anchor links. Smooth scroll enabled via `html { scroll-behavior: smooth; }`.

---

## 3. Document structure & flow

The reference document has **11 sections** that zoom in and back out through a topic. This pacing works well — adopt it for new learning documents.

### Recommended flow

1. **§00 — Primitive concept.** Define the smallest unit. (e.g. "What is an SM?")
2. **§01 — A common confusion.** Disambiguate two things people conflate. (e.g. "SM vs Kernel")
3. **§02 — Composition.** How smaller pieces combine into the unit. (e.g. "CUDA Cores vs Tensor Cores inside an SM")
4. **§03 — Deep dive.** Zoom further into one of the composed pieces. (e.g. "Inside the Tensor Core")
5. **§04 — Adjacent system.** Switch to a related layer. (e.g. "VRAM Layout")
6. **§05–§07 — Build up to the system.** Each section adds one more concept.
7. **§08 — Synthesis layer.** Show how multiple layers interact. (e.g. "The Two Layers")
8. **§09 — Live system.** A complete, animated end-to-end view.
9. **§10 — Edge cases / gotchas.** The "why this is harder than it looks" section.

Each section should answer a question the previous section opened. **§02 saying "Tensor Cores do matrix math 8× faster"** naturally leads to **§03 asking "what does one Tensor Core actually do?"**. Always link forward.

### Section anatomy

A typical section has:

1. **Section label** (`.sec-label`)
2. **Section heading** (`<h3 class="section-h">`) — Syne font, asks or states the core question
3. **Lead paragraph(s)** (`<p class="lead">`) — sets up the visualization
4. **Visualization** — see §4 below
5. **Sub-headings** (`<h4>`) — Syne font, prefixed with `▸ ` arrow
6. **Annotation block** (`.annotation`) — the takeaway, in dim text with a cyan left border

### Two-column layout

When pairing explanatory text with a visualization, use `.two-col` (grid `1fr 1fr` collapsing to `1fr` under 900px). The text goes left, the visualization goes right.

---

## 4. Visualization patterns

The reference document uses 9 distinct visualization patterns. Reuse these where they fit; only invent new ones when none apply.

### 4.1 Animated cell grid (most common)

A CSS grid of small cells, each cell a `div` styled by class. Cells light up based on state via classList toggles every 200–400ms via `setInterval`.

**Use for:** showing utilization, parallelism, individual workers (SMs, CUDA cores, threads, queue slots).

**Pattern:**
```html
<div class="sm-grid" id="smGrid"></div>
```
```js
function buildSMs(){
  const g = document.getElementById('smGrid');
  for(let i=0; i<COUNT; i++){
    const b = document.createElement('div');
    b.className = 'sm-block';
    b.id = 'sm-'+i;
    g.appendChild(b);
  }
}
setInterval(() => {
  const flips = Math.floor(Math.random()*5)+2;
  for(let f=0; f<flips; f++){
    const idx = Math.floor(Math.random()*COUNT);
    const b = document.getElementById('sm-'+idx);
    b.classList.toggle('fire');
  }
}, 280);
```

**Critical:** the active CSS class should add `box-shadow` for glow. Idle state is `var(--panel)` with `var(--border)` border.

### 4.2 Stacked horizontal bar (proportional breakdown)

A horizontal flex container of segments, each width set to `${pct}%`, each filled with the segment's color.

**Use for:** VRAM breakdown, time budget, anything showing what fraction of a fixed total each component takes.

Each segment shows its label and value if it's wide enough (`pct > 5`); too-small segments stay unlabeled but tooltipped via `title`. The "free" segment uses a hatched stripe pattern: `repeating-linear-gradient(45deg, ...)`.

### 4.3 Timeline grid (scheduler visualization)

A grid of slot cells per row, where each row is one entity (model, queue, stream). A pre-defined `schedule` array marks which entity gets each time slot. An interval ticker fills cells left-to-right.

**Use for:** time-slicing, scheduling, round-robin, any "who gets the resource when" story.

```js
const schedule = [0,0,0,1,1,2,0,0,3,...];  // which entity at each tick
let tlTick = 0;
setInterval(() => {
  const slot = tlTick % SLOTS;
  const mi = schedule[tlTick % schedule.length];
  // light up cell[mi][slot], clear others in that column
  tlTick++;
}, 130);
```

### 4.4 Canvas-based flow diagram (multi-stage pipeline)

A `<canvas>` element with manual `requestAnimationFrame` rendering. Static infrastructure (boxes, connectors, labels) is drawn each frame; animated particles (dots representing requests/tokens) move through stages.

**Use for:** request flow through a system, data moving through a pipeline, queue dynamics.

**Pattern:**
- Each frame: clear canvas, draw static layout, update particle states, draw particles.
- Particles have a `stage` field (`'arrive' | 'frontend' | 'scheduler' | 'compute' | ...`) and easing-based interpolation between target points.
- Use `easeOut(t) { return 1 - Math.pow(1-t, 2); }` for smooth motion.
- Particles are colored circles with `shadowBlur` glow matching their color.
- Always handle DPR (`window.devicePixelRatio`) for crisp rendering on Retina.
- Include "Pause", "Reset", and at least one "Burst" or interaction button.

### 4.5 Cards row (categorical comparison)

Three to four side-by-side cards, each with a left-border accent stripe in a distinct color, a small badge in the top-left, and bold heading + body content.

**Use for:** "three ways to think about X", "four scenarios", any small enumeration where each item needs ~3 lines of explanation.

```html
<div class="three-levels">
  <div class="level-card level-1">
    <div class="level-badge">LEVEL 1</div>
    <div class="level-title">...</div>
    <div class="level-formula">...</div>
    <div class="level-note">...</div>
  </div>
  <!-- repeat for level-2, level-3 -->
</div>
```

Collapse to `grid-template-columns: 1fr` under 900px.

### 4.6 Matrix grid (data structure visualization)

A CSS grid with fixed-size cells (`4px × 4px` or `6px × 6px`) representing a matrix or 2D structure. Cells get class-based highlighting (`hot-row`, `hot-col`, `hot-out`) to animate row/column sweeps.

**Use for:** matrix operations, attention patterns, tile/block structures, any 2D data with dimensions ≤ ~50 per side.

```css
.matrix-grid.grid-a { grid-template-columns: repeat(32, 4px); grid-template-rows: repeat(16, 4px); }
.mcell.hot-row { background: var(--acc1) !important; box-shadow: 0 0 3px var(--acc1); }
```

The animation pattern: tick counter walks through every output cell; for each output cell, light up the corresponding input row + input column + that specific output cell. ~350ms per tick gives the eye time to register the dot-product pattern.

### 4.7 Layer/zone block (stacked architectural diagram)

Vertically stacked blocks representing layers of a system (e.g. "software" on top, "hardware" on bottom), each with a corner stamp tag, a title, and a row of sub-component boxes inside.

**Use for:** showing two or three logical layers that interact, where each layer has distinct responsibilities.

Each layer block has `border: 1px solid var(--sw)` or `var(--hw)` to color-code by layer. The connector between layers is a small `<div class="layer-arrow">▼ orchestrates ▼</div>` row.

### 4.8 Comparison scenarios (side-by-side outcomes)

Three vertical "scenario" cards stacked side-by-side, each showing the same data structure under different conditions. Each scenario has a colored border indicating quality (green = best, amber = warning, etc).

**Use for:** "config A vs config B vs config C" comparisons, before/after, optimization tradeoffs.

Each scenario contains a small stack of horizontal `.vram-block` rows showing labeled values, then a final `.vram-total` row with the aggregate. A small italic note at the bottom summarizes the tradeoff.

### 4.9 Flow chain (linear stages with arrows)

A horizontal row of `.flow-node` boxes connected by `→` arrows, with a traveling highlight that pulses through the stages.

**Use for:** showing a single request's path through stages, or a linear sequence of steps.

```html
<div class="flow-row">
  <div class="flow-node" id="fn0"><div class="flow-node-title">Step 1</div><div class="flow-node-sub">Detail</div></div>
  <div class="flow-arrow" id="fa0">→</div>
  <!-- ... -->
</div>
```

```js
let plStep = 0;
setInterval(() => {
  for(let i=0; i<NODES; i++){
    document.getElementById('fn'+i).classList.toggle('lit', i === plStep);
    if(i < NODES-1) document.getElementById('fa'+i).classList.toggle('lit', i === plStep);
  }
  plStep = (plStep+1) % NODES;
}, 600);
```

---

## 5. Animation principles

All animations follow these rules.

### Timing

- **Cell flicker** (busy/idle worker grids): 200–400ms intervals, flip 2–5 cells per tick.
- **Scheduler timeline**: 100–150ms per slot advance.
- **Pipeline highlights**: 600–800ms per stage.
- **Particle motion**: 300–700ms per stage transition, using `easeOut` curve.
- **Matrix sweeps**: 300–500ms per output cell.

Slower than 200ms feels sluggish; faster than 100ms makes individual events imperceptible.

### Always provide controls

Any animation longer-running than 5 seconds gets a **Pause** button. Most also get a **Reset** button. Canvas-based animations should get an interaction button (Burst, Step, Speed, etc).

```html
<div class="controls">
  <button class="btn active" id="btnPlay" onclick="toggle()">⏸ Pause</button>
  <button class="btn" onclick="reset()">↺ Reset</button>
</div>
```

The Pause button is `.active` when running (shows ⏸); becomes inactive (shows ▶) when paused.

### Animation should illustrate, not entertain

Each animation must teach something. A grid of cells randomly flickering is acceptable only if it represents real parallel work; pure decoration is not. The matrix sweep teaches dot-product structure. The timeline teaches time-slicing. If an animation doesn't reveal a concept, replace it with a static diagram.

### Hot states must be visually obvious

Active/hot cells need both **color change** AND **box-shadow glow**. Color alone is too subtle when one cell among 142 lights up. Use `box-shadow: 0 0 8px <color>` minimum.

---

## 6. Annotation blocks

Every section ends with at least one `.annotation` block — the takeaway that the visualization teaches. Use them generously; they're how the reader internalizes the lesson.

```html
<div class="annotation">
  <strong>Key insight headline:</strong>
  <br>Body text in normal weight, with <em>cyan emphasis</em> on key terms and <strong>white emphasis</strong> on important nouns.
  <br><br><strong>Second point:</strong> Continue building on the first.
</div>
```

The block has a 3px cyan left border, dim text color, and white-text `<strong>` highlights. Use `<em>` for cyan-colored inline emphasis (note: CSS overrides italic to non-italic in this style — em is purely a color tag here).

For complex annotations with multiple sub-points, use `<br>•` bullets inline rather than nested `<ul>` lists. The annotation should read as a thoughtful follow-up paragraph, not a checklist.

---

## 7. Code & math display

For inline code, use `<code style="color:var(--acc1);background:var(--panel);padding:2px 6px;border-radius:2px">`. There is no reusable `code {}` style — apply inline.

For mathematical/numeric breakdowns like FLOP calculations, use `.flop-breakdown`: a dashed-border box centered with the numbers in Syne font, large amber for the final result, regular cyan for intermediate values.

Avoid using KaTeX or MathJax — they're an external dependency and overkill. Plain HTML with `<span class="num">` accent spans handles every math display the reference document needs.

---

## 8. Responsive behavior

The document must work down to 380px wide (mobile). Add these media queries at minimum:

```css
@media (max-width: 700px) {
  section { padding: 24px 20px; }
  header { padding: 20px; }
  .toc { padding: 14px 20px; }
}
@media (max-width: 800px) { /* Triton grid, dup-row, etc */ }
@media (max-width: 900px) { /* two-col, three-levels collapse to 1fr */ }
@media (max-width: 1100px) { /* scenario rows */ }
```

Canvas elements should resize on window resize. Wide elements (the tile-sweep grid, kernel canvas) get `overflow-x: auto` on a wrapper and scroll horizontally rather than shrinking to illegibility.

---

## 9. JavaScript organization

All JS lives in a single `<script>` block at the end of `<body>`. No modules, no bundling.

### Boot pattern

```js
function boot(){
  buildSection00();
  buildSection01();
  buildSection02();
  // ...
  startAnimation00();
  requestAnimationFrame(mainLoop);
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
window.addEventListener('resize', () => {
  resizeCanvas00();
  resizeCanvas01();
});
```

### Naming

- `build*` — DOM construction functions (called once)
- `start*` — Begin animation loops
- `toggle*` — Pause/resume an animation
- `reset*` — Clear state and stop
- `*Loop` — `requestAnimationFrame`-driven render loops
- `draw*Static`, `update*`, `draw*` — Split canvas rendering into clear phases

### Per-section state

Each section's state lives in module-scope variables prefixed with the section concept. Avoid a single global state object — the linear file structure means per-section variables stay readable.

### Error tolerance

All `getElementById` calls should be followed by null checks before use:

```js
const el = document.getElementById('mySection');
if(!el) return;
```

This protects sections that haven't loaded yet from breaking the rest of the boot.

---

## 10. Validation before delivery

Before presenting any new visualization, run these checks:

1. **JS syntax**: Save the JS portion to a file and run `node --check file.js`. Must return clean.
2. **All referenced IDs exist**: Every `getElementById('foo')` must have a matching `id="foo"` in the HTML, OR be a dynamically-created ID like `sm-${i}`.
3. **TOC matches section IDs**: Every `<a href="#sNN">` must have a matching `<section id="sNN">`.
4. **Section labels match numbers**: `<div class="sec-label">NN — Title</div>` numbering matches section ID numbering.
5. **Background alternation**: No two consecutive sections share the same background (bg→surface→bg→surface→...).
6. **Tag balance**: HTML `<div>`, `<section>`, `<p>` open/close counts match.
7. **All animations have Pause buttons** if they run >5 seconds.
8. **Text doesn't overflow boxes**: For fixed-width canvas labels especially, calculate `text_width = chars × 5.4` (for 9px monospace) and verify it fits.
9. **Mobile width**: View at 380px effective width — nothing should overflow horizontally except elements wrapped in `overflow-x: auto` containers.
10. **Hard-refresh test**: Tell the user to hard-refresh after re-downloading — browsers aggressively cache local HTML files.

---

## 11. Reference file

The canonical example is `l40s-gpu-internals.html` in this repository. When in doubt about styling, animation timing, color choice, or layout, **read the reference file** rather than guessing. It is the source of truth.

Specifically these sections demonstrate each pattern:

| Pattern | Reference section |
|---|---|
| Animated cell grid | §00 (SM partitions), §06 (SM grid) |
| Stacked horizontal bar | §04 (VRAM layout) |
| Timeline grid | §05 (time-slicing) |
| Canvas flow diagram | §01 (kernels), §09 (Triton) |
| Cards row | §03 (three throughput levels) |
| Matrix grid | §03 (MMA tile) |
| Layer/zone block | §08 (Triton vs hardware) |
| Comparison scenarios | §10 (VRAM duplication) |
| Flow chain | §07 (request path) |

---

## 12. File handling for users

Generated files go to `/mnt/user-data/outputs/`. After creation, always call `present_files` so the user can download. Mention that:

1. The file is fully self-contained — works by double-clicking locally.
2. Hosts cleanly on GitHub Pages with no build step. Save as `index.html` (or whatever filename) and push.
3. After re-downloading an updated version, the user must **hard-refresh** their browser (Ctrl+Shift+R / Cmd+Shift+R) to bypass cache. Cache issues are the most common "the new section isn't showing" complaint.

---

## 13. When in doubt

- **Animation feels distracting?** Slow it down or remove it. Static is fine if there's nothing meaningful moving.
- **Too much information per section?** Split into two sections. Each section should teach one concept.
- **Visualization doesn't fit a pattern in §4?** Default to a canvas with `requestAnimationFrame` — it's the most flexible.
- **Color choice ambiguous?** Use `--acc1` for the "current/active/primary" thing, `--acc2` for its counterpart, `--acc4` for the "result/answer".
- **Section feels short?** Add a real example with concrete numbers from the user's domain. The reference document does this with Nemotron 30B QKV projections — concrete numbers are far more memorable than abstract math.
- **Section feels long?** Move the deeper math into an annotation block at the end. Keep the visualization tight.

The goal is documents the user returns to. Optimize for the third re-read, not the first scroll.
