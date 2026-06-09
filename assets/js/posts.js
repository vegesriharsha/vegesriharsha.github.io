/* ============================================================
   Content manifest — single source of truth for the index page.
   To add a new post or visualization:
   1. Create the HTML file in posts/ or visualizations/
   2. Add a new entry below with the correct path
   The newest entries (by date) render first on the home page.
   ============================================================ */

window.SITE_CONTENT = {
  // First series — "Agentic systems at the bank", in logical reading order:
  // build the agent -> deploy it -> give it memory -> secure it -> evaluate it.
  // The home grid sorts by date descending, so dates run newest-first to keep
  // the series in sequence at the top of the Notes column.
  posts: [
    {
      title: "GitLab → GitHub: Org Structure & Access Governance",
      slug: "github-migration-architecture.html",
      date: "2026-06-08",
      summary: "A platform-engineering reference for the GitLab → GitHub move: one org with base-none least privilege, the Identity IQ → Entra → SCIM → Teams access chain, Terraform-enforced policy, and an inner-source model for shared libraries.",
      tags: ["github", "platform-engineering", "access-governance"]
    },
    {
      title: "Agentic Architecture with Spring AI and Embabel",
      slug: "agentic-architecture-spring-ai-embabel.html",
      date: "2026-05-28",
      summary: "Part 1 — Building agents on the JVM: composition over frameworks, hand-wired workflows in Spring AI, and goal-directed planning in Embabel, and the threshold that separates the two.",
      tags: ["agents", "spring-ai", "architecture"]
    },
    {
      title: "Deploying Agents on the OpenShift AI POD",
      slug: "agent-deployment.html",
      date: "2026-05-27",
      summary: "Part 2 — Where agents live on the cluster, how requests flow through them, and an honest answer about whether you actually need Python in the stack.",
      tags: ["agents", "openshift", "deployment"]
    },
    {
      title: "Memory Architecture in Agentic Systems",
      slug: "memory-architecture-agents.html",
      date: "2026-05-26",
      summary: "Part 3 — Production memory for AI agents: working, episodic, semantic, and procedural, across Spring AI agents, batch jobs, and the enterprise platform.",
      tags: ["agents", "memory", "architecture"]
    },
    {
      title: "Identity Management in Agentic Systems",
      slug: "identity-management-agents.html",
      date: "2026-05-25",
      summary: "Part 4 — Extending OAuth 2.0 patterns: user identity, workload identity, and delegated identity, across Spring AI agents, MCP servers, and the broader enterprise.",
      tags: ["agents", "identity", "security"]
    },
    {
      title: "Evaluating the Evaluators — AI Eval Architecture",
      slug: "ai-eval-architecture.html",
      date: "2026-05-24",
      summary: "Part 5 — Choosing an architecture for AI quality at the bank: RAGAs, DeepEval, and Promptfoo as three layers of one stack, with a phased plan and paste-ready POCs.",
      tags: ["agents", "evaluation", "quality"]
    },
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
      title: "SCIM + OIDC identity federation — Entra ID to GitHub EMU",
      slug: "scim-oidc-federation.html",
      date: "2026-05-17",
      summary: "Federating Microsoft Entra ID into GitHub Enterprise Managed Users — SCIM provisioning, OIDC + PKCE, Conditional Access, the revocation gap, FIDO2, and where SAML / WS-Fed sit alongside. Reference layer now; six interactive walkthroughs landing one at a time.",
      tags: ["identity", "oidc", "scim", "security"]
    },
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
      title: "NVIDIA L40S, inside the silicon — SMs, Tensor Cores, and how models share a GPU",
      slug: "l40s-gpu-internals.html",
      date: "2026-05-10",
      summary: "What's a Streaming Multiprocessor? Where does 733 TFLOPS come from? How do multiple models actually share 142 SMs and 48 GB of VRAM? An interactive walk through L40S hardware — SMs, CUDA vs Tensor cores, VRAM layout, time-slicing.",
      tags: ["gpu", "cuda", "hardware"]
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
 