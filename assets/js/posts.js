/* ============================================================
   Content manifest — single source of truth for the index page.
   To add a new post or visualization:
   1. Create the HTML file in posts/ or visualizations/
   2. Add a new entry below with the correct path
   The newest entries (by date) render first on the home page.
   ============================================================ */

window.SITE_CONTENT = {
  posts: [
    {
      title: "Welcome — what this site is",
      slug: "welcome.html",
      date: "2026-05-10",
      summary: "A running notebook of things I'm learning — systems, ML infrastructure, and the visualizations I build to understand them.",
      tags: ["meta"]
    }
    // Add new posts above this line (newest first).
    // {
    //   title: "Post title",
    //   slug: "post-filename.html",
    //   date: "YYYY-MM-DD",
    //   summary: "One-line description shown on the home grid.",
    //   tags: ["systems", "ml"]
    // },
  ],

  visualizations: [
    {
      title: "L40S GPU & Triton — Multi-Model Serving",
      slug: "gpu-multimodel-viz.html",
      date: "2026-05-10",
      summary: "Interactive architecture diagram for serving multiple models on a single NVIDIA L40S GPU with Triton Inference Server.",
      tags: ["gpu", "triton", "inference"]
    }
    // Add new visualizations above this line.
  ]
};

/* ---------- Render helpers used by index.html ---------- */

(function () {
  function fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric"
    }).toUpperCase();
  }

  function byDateDesc(a, b) {
    return (b.date || "").localeCompare(a.date || "");
  }

  function tagHtml(tags) {
    if (!tags || !tags.length) return "";
    return tags.map(t => `<span class="tag">${t}</span>`).join("");
  }

  function cardHtml(item, kind, folder) {
    const kindLabel = kind === "viz" ? "VISUALIZATION" : "NOTE";
    return `
      <a class="card" href="${folder}/${item.slug}">
        <div class="card-kind ${kind}">${kindLabel}</div>
        <div class="card-title">${item.title}</div>
        <div class="card-desc">${item.summary || ""}</div>
        <div class="card-meta">
          <span>${fmtDate(item.date)}</span>
          ${tagHtml(item.tags)}
        </div>
      </a>
    `;
  }

  function renderInto(id, items, kind, folder) {
    const root = document.getElementById(id);
    if (!root) return;
    if (!items || items.length === 0) {
      root.innerHTML = `<div class="empty">Nothing here yet — add an entry in <code>assets/js/posts.js</code>.</div>`;
      return;
    }
    const sorted = [...items].sort(byDateDesc);
    root.innerHTML = sorted.map(i => cardHtml(i, kind, folder)).join("");
  }

  window.renderSite = function () {
    const c = window.SITE_CONTENT || { posts: [], visualizations: [] };
    renderInto("posts-grid", c.posts, "note", "posts");
    renderInto("viz-grid", c.visualizations, "viz", "visualizations");
  };

  document.addEventListener("DOMContentLoaded", window.renderSite);
})();
