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
  ],

  visualizations: [
    {
      title: "Ansible — A Visual Primer for the Bank",
      slug: "ansible-visual-primer.html",
      date: "2026-05-15",
      summary: "Interactive primer on Ansible core concepts — agentless architecture, idempotence, drift response — with banking use cases: GitLab runner tooling, Tripwire FIM, rolling patches, CIS hardening, certificate and keytab rotation.",
      tags: ["ansible", "infra", "banking"]
    },
    {
      title: "NIM + Triton — Multi-Model GPU Sharing",
      slug: "nim-triton-gpu-sharing.html",
      date: "2026-05-10",
      summary: "Deploying two NIM models on one L40S by extracting their TRT-LLM engines into a unified Triton server — Kubernetes failure modes, ensemble pipelines, VRAM debugging, and Spring AI integration.",
      tags: ["nim", "triton", "kubernetes"]
    },
    {
      title: "L40S GPU & Triton — Multi-Model Serving",
      slug: "gpu-multimodel-viz.html",
      date: "2026-05-10",
      summary: "Interactive architecture diagram for serving multiple models on a single NVIDIA L40S GPU with Triton Inference Server.",
      tags: ["gpu", "triton", "inference"]
    }
  ]
};

(function () {
  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toUpperCase();
  }
  function byDateDesc(a, b) { return (b.date || "").localeCompare(a.date || ""); }
  function tagHtml(tags) {
    if (!tags || !tags.length) return "";
    return tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join("");
  }
  function cardHtml(item, kind, folder) {
    var kindLabel = kind === "viz" ? "VISUALIZATION" : "NOTE";
    return '<a class="card" href="' + folder + '/' + item.slug + '">' +
           '<div class="card-kind ' + kind + '">' + kindLabel + '</div>' +
           '<div class="card-title">' + item.title + '</div>' +
           '<div class="card-desc">' + (item.summary || "") + '</div>' +
           '<div class="card-meta"><span>' + fmtDate(item.date) + '</span>' + tagHtml(item.tags) + '</div>' +
           '</a>';
  }
  function renderInto(id, items, kind, folder) {
    var root = document.getElementById(id);
    if (!root) return;
    if (!items || items.length === 0) {
      root.innerHTML = '<div class="empty">Nothing here yet — add an entry in <code>assets/js/posts.js</code>.</div>';
      return;
    }
    var sorted = items.slice().sort(byDateDesc);
    root.innerHTML = sorted.map(function (i) { return cardHtml(i, kind, folder); }).join("");
  }
  window.renderSite = function () {
    var c = window.SITE_CONTENT || { posts: [], visualizations: [] };
    renderInto("posts-grid", c.posts, "note", "posts");
    renderInto("viz-grid", c.visualizations, "viz", "visualizations");
  };
  document.addEventListener("DOMContentLoaded", window.renderSite);
})();
