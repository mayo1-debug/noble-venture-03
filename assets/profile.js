/* Security profile: the questions a visitor answers once.
   Everything runs in the browser. The profile is kept in localStorage on this device only. */
(function () {
  var YN = [
    ["yes", "Yes"],
    ["partly", "Partly"],
    ["no", "No"],
    ["na", "Does not apply"]
  ];

  var SECTIONS = [
    {
      title: "Your company",
      fields: [
        { id: "company", type: "text", label: "Company name", ph: "Acme Web Studio" },
        { id: "website", type: "text", label: "Website", ph: "acme.example" },
        { id: "contact", type: "text", label: "Security contact email", ph: "security@acme.example" },
        { id: "owner", type: "text", label: "Person responsible for security (name or role)", ph: "Jane Doe, Managing Director" },
        { id: "size", type: "select", label: "People with access to client systems or data", opts: [["1", "Just me"], ["2-5", "2 to 5"], ["6-25", "6 to 25"], ["26+", "More than 25"]] },
        { id: "kind", type: "select", label: "What you sell", opts: [["agency", "Agency or studio services"], ["freelance", "Freelance or consulting services"], ["software", "A software product (SaaS or app)"], ["mixed", "Services and a product"]] }
      ]
    },
    {
      title: "Data and hosting",
      fields: [
        { id: "data", type: "select", label: "Most sensitive client data you hold", opts: [["contact", "Only business contact details"], ["business", "Client business data (documents, code, content)"], ["personal", "Personal data of your client's customers or staff"], ["special", "Sensitive personal data (health, financial, ID documents)"]] },
        { id: "hosting", type: "text", label: "Where your systems and data are hosted", ph: "AWS eu-central-1, Google Workspace, GitHub" },
        { id: "region", type: "select", label: "Region where client data is stored", opts: [["eu", "European Union"], ["us", "United States"], ["eu-us", "EU and US"], ["other", "Other or mixed"]] }
      ]
    },
    {
      title: "Controls you have today",
      note: "Answer what is true today. Partly means some systems or people, not all.",
      fields: [
        { id: "mfa", type: "yn", label: "Multi-factor login (MFA) on email, code hosting, cloud consoles and admin panels" },
        { id: "pwmanager", type: "yn", label: "A password manager for all staff, no shared passwords in chats or documents" },
        { id: "laptops", type: "yn", label: "Full-disk encryption and screen lock on every work laptop" },
        { id: "updates", type: "yn", label: "Automatic operating system and browser updates on work devices" },
        { id: "mdm", type: "yn", label: "Work laptops managed centrally (MDM), so encryption, screen lock and updates are enforced and a lost device can be locked or wiped remotely" },
        { id: "tls", type: "yn", label: "Encryption in transit (HTTPS or TLS) on every service you run" },
        { id: "rest", type: "yn", label: "Encryption at rest for stored client data (provider default counts)" },
        { id: "backups", type: "yn", label: "Automatic backups of client data and systems" },
        { id: "restore", type: "yn", label: "A restore from backup tested in the last 12 months" },
        { id: "leaver", type: "yn", label: "Access removed within 1 working day when someone leaves" },
        { id: "review", type: "yn", label: "Access rights reviewed at least every 6 months" },
        { id: "sso", type: "yn", label: "Single sign-on (SSO) with MFA through one identity provider for your main business apps" },
        { id: "logs", type: "yn", label: "Login and admin activity logs switched on in your main systems and kept for at least 90 days" },
        { id: "patching", type: "yn", label: "Dependencies and servers patched on a schedule, with alerts for known vulnerabilities" },
        { id: "codereview", type: "yn", label: "Code reviewed by a second person or automated checks before it goes live" },
        { id: "changes", type: "yn", label: "Every change to production tracked in a ticket or pull request, and possible to roll back" },
        { id: "incident", type: "yn", label: "A written incident response plan with a named contact" },
        { id: "notify", type: "yn", label: "Commitment to tell affected clients about a breach within 72 hours" },
        { id: "dataclass", type: "yn", label: "Client data handled by sensitivity class (confidential, internal, public), with stricter rules for confidential data" },
        { id: "vendors", type: "yn", label: "A current list of the vendors (subprocessors) that touch client data" },
        { id: "aipolicy", type: "yn", label: "Written rules for AI tools: which are approved for client data (business plans that do not train on your data) and what may be entered" },
        { id: "training", type: "yn", label: "Security awareness training (phishing, passwords) at least once a year" },
        { id: "screening", type: "yn", label: "Reference and identity checks before new staff get access to client data" },
        { id: "policies", type: "yn", label: "Written security policies that staff have read" },
        { id: "pentest", type: "yn", label: "An external penetration test in the last 12 months" },
        { id: "insurance", type: "yn", label: "Cyber insurance" }
      ]
    },
    {
      title: "Certifications and plans",
      fields: [
        { id: "cert", type: "select", label: "Security certification", opts: [["none", "None"], ["soc2", "SOC 2 report"], ["iso", "ISO 27001 certificate"], ["both", "SOC 2 and ISO 27001"], ["other", "Other (Cyber Essentials, TISAX, ...)"]] },
        { id: "target", type: "text", label: "Target date to close open gaps", ph: "31 March 2027" }
      ]
    }
  ];

  var KEY = "sak_profile";

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  function save(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function render(container, onChange) {
    var p = load();
    var html = "";
    SECTIONS.forEach(function (sec, si) {
      html += '<fieldset class="sec"><legend>' + (si + 1) + ". " + esc(sec.title) + "</legend>";
      if (sec.note) html += '<p class="hint">' + esc(sec.note) + "</p>";
      sec.fields.forEach(function (f) {
        var v = p[f.id] || "";
        if (f.type === "text") {
          html += '<label class="row"><span>' + esc(f.label) + '</span><input type="text" name="' + f.id + '" value="' + esc(v) + '" placeholder="' + esc(f.ph || "") + '"></label>';
        } else if (f.type === "select") {
          html += '<label class="row"><span>' + esc(f.label) + '</span><select name="' + f.id + '">';
          f.opts.forEach(function (o) {
            html += '<option value="' + o[0] + '"' + (v === o[0] ? " selected" : "") + ">" + esc(o[1]) + "</option>";
          });
          html += "</select></label>";
        } else {
          html += '<div class="row yn" role="radiogroup" aria-label="' + esc(f.label) + '"><span>' + esc(f.label) + '</span><span class="opts">';
          YN.forEach(function (o) {
            html += '<label><input type="radio" name="' + f.id + '" value="' + o[0] + '"' + (v === o[0] ? " checked" : "") + "> " + o[1] + "</label>";
          });
          html += "</span></div>";
        }
      });
      html += "</fieldset>";
    });
    container.innerHTML = html;
    container.addEventListener("input", function () {
      var np = read(container);
      save(np);
      if (onChange) onChange(np);
    });
    container.addEventListener("change", function () {
      var np = read(container);
      save(np);
      if (onChange) onChange(np);
    });
  }

  function read(container) {
    var p = {};
    SECTIONS.forEach(function (sec) {
      sec.fields.forEach(function (f) {
        if (f.type === "yn") {
          var c = container.querySelector('input[name="' + f.id + '"]:checked');
          p[f.id] = c ? c.value : "";
        } else {
          var el = container.querySelector('[name="' + f.id + '"]');
          p[f.id] = el ? el.value.trim() : "";
        }
      });
    });
    return p;
  }

  /* Values with safe fallbacks for text output. */
  function ctx(p) {
    var today = new Date();
    var next = new Date(today.getTime());
    next.setFullYear(next.getFullYear() + 1);
    function fmt(d) { return d.toISOString().slice(0, 10); }
    return {
      company: p.company || "[Company name]",
      website: p.website || "[website]",
      contact: p.contact || "[security contact email]",
      owner: p.owner || "[person responsible for security]",
      hosting: p.hosting || "[hosting providers]",
      target: p.target || "[target date]",
      date: fmt(today),
      review: fmt(next),
      region: { eu: "the European Union", us: "the United States", "eu-us": "the European Union and the United States", other: "[regions]" }[p.region] || "[regions]"
    };
  }

  function fill(text, c) {
    return text.replace(/\{(\w+)\}/g, function (m, k) { return c[k] != null ? c[k] : m; });
  }

  var answered = function (p) {
    var n = 0, t = 0;
    SECTIONS.forEach(function (s) { s.fields.forEach(function (f) { if (f.type === "yn") { t++; if (p[f.id]) n++; } }); });
    return { done: n, total: t };
  };

  window.SAK = window.SAK || {};
  window.SAK.profile = { SECTIONS: SECTIONS, load: load, save: save, render: render, read: read, ctx: ctx, fill: fill, esc: esc, answered: answered };
})();
