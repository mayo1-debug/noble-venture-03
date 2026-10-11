/* Paid kit page: answer library, policies, email scripts, gap plan. */
(function () {
  var P = window.SAK.profile, O = window.SAK.overview, E = P.esc;
  var SIZE = { "1": "1 person", "2-5": "2 to 5 people", "6-25": "6 to 25 people", "26+": "more than 25 people" };
  var CERT = {
    none: "{company} does not hold SOC 2 or ISO 27001 today. Our controls are described in this questionnaire and in our Security Overview, and our policies are available on request.",
    soc2: "Yes. {company} holds a SOC 2 report, available under NDA on request.",
    iso: "Yes. {company} holds an ISO 27001 certificate, available on request.",
    both: "Yes. {company} holds a SOC 2 report and an ISO 27001 certificate, available on request.",
    other: "{company} holds [name the certification]. A copy is available on request. We do not hold SOC 2 or ISO 27001."
  };
  var DATA = {
    contact: "{company} stores only business contact details of your staff (names, work email addresses, phone numbers) needed to run the engagement.",
    business: "{company} stores client business data needed for the engagement, such as documents, source code, content and project communication.",
    personal: "{company} processes personal data of your customers or staff on your behalf, as agreed in our data processing agreement, plus business data needed for the engagement.",
    special: "{company} processes sensitive personal data (such as health, financial or identity data) on your behalf, as agreed in our data processing agreement. Access is limited to named people."
  };

  function ctx(p) {
    var c = P.ctx(p);
    c.sizeText = SIZE[p.size] || "[number of people]";
    c.certText = P.fill(CERT[p.cert] || CERT.none, c);
    c.dataText = P.fill(DATA[p.data] || DATA.business, c);
    return c;
  }

  function answer(a, p, c) {
    if (a.t) return { s: "info", text: P.fill(a.t, c) };
    var v = p[a.f];
    if (v === "yes") return { s: "yes", text: P.fill(a.y, c) };
    if (v === "partly") return { s: "partly", text: P.fill("Partly. " + a.y + " This is not yet in place for every system or person. Full coverage is planned by {target}.", c) };
    if (v === "no") return { s: "no", text: P.fill(a.n + " Planned by {target}.", c) };
    if (v === "na") return { s: "na", text: "Not applicable. [Add one sentence on why, for example: we do not host client systems.]" };
    return { s: "todo", text: "[Answer the matching question in your profile to fill this in.]" };
  }

  function download(name, text, type) {
    var blob = new Blob([text], { type: type || "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function csvCell(s) { return '"' + String(s).replace(/"/g, '""') + '"'; }

  function mdToHtml(md, title) {
    var lines = md.split("\n"), out = [], inList = false, inTable = false;
    function close() { if (inList) { out.push("</ul>"); inList = false; } if (inTable) { out.push("</table>"); inTable = false; } }
    lines.forEach(function (l) {
      if (/^## /.test(l)) { close(); out.push("<h2>" + E(l.slice(3)) + "</h2>"); }
      else if (/^\|/.test(l)) {
        if (/^\|[-| ]+\|$/.test(l)) return;
        if (!inTable) { close(); out.push("<table border=\"1\" cellpadding=\"4\" cellspacing=\"0\">"); inTable = true; }
        out.push("<tr>" + l.split("|").slice(1, -1).map(function (x) { return "<td>" + E(x.trim()) + "</td>"; }).join("") + "</tr>");
      }
      else if (/^(- |\d+\. )/.test(l)) {
        if (!inList) { close(); out.push("<ul>"); inList = true; }
        out.push("<li>" + E(l.replace(/^(- |\d+\. )/, "")).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") + "</li>");
      }
      else if (l.trim() === "") { close(); }
      else { close(); out.push("<p>" + E(l).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") + "</p>"); }
    });
    close();
    return "<!doctype html><html><head><meta charset=\"utf-8\"><title>" + E(title) + "</title></head><body style=\"font-family:Arial,sans-serif;max-width:800px;margin:2em auto;line-height:1.5\"><h1>" + E(title) + "</h1>" + out.join("\n") + "</body></html>";
  }

  function renderAnswers(el, p) {
    var c = ctx(p), list = window.SAK.answers, h = "", dom = "";
    var counts = { yes: 0, partly: 0, no: 0, na: 0, info: 0, todo: 0 };
    list.forEach(function (a, i) {
      var r = answer(a, p, c);
      counts[r.s]++;
      if (a.d !== dom) { if (dom) h += "</div>"; dom = a.d; h += '<h2 class="dom">' + E(dom) + '</h2><div class="qa-group">'; }
      h += '<div class="qa s-' + r.s + '"><p class="q">' + (i + 1) + ". " + E(a.q) + '</p><p class="a">' + E(r.text) + '</p><button type="button" class="copy small" data-i="' + i + '">Copy answer</button></div>';
    });
    h += "</div>";
    el.innerHTML = '<p class="hint">' + list.length + " questions. In place: " + counts.yes + ", partly: " + counts.partly + ", missing: " + counts.no + ", not applicable: " + counts.na + ", still to answer in your profile: " + counts.todo + ".</p>" + h;
    el.onclick = function (e) {
      var b = e.target.closest("button.copy");
      if (!b) return;
      var r = answer(list[+b.getAttribute("data-i")], P.load(), ctx(P.load()));
      copy(r.text, b);
    };
  }

  function copy(text, btn) {
    var done = function () { var t = btn.textContent; btn.textContent = "Copied"; setTimeout(function () { btn.textContent = t; }, 1200); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
    else { var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); done(); } catch (e) {} ta.remove(); }
  }

  function answersCsv(p) {
    var c = ctx(p), rows = [["#", "Domain", "Question", "Status", "Answer"].map(csvCell).join(",")];
    window.SAK.answers.forEach(function (a, i) {
      var r = answer(a, p, c);
      rows.push([i + 1, a.d, a.q, r.s, r.text].map(csvCell).join(","));
    });
    return "﻿" + rows.join("\r\n");
  }

  function renderPolicies(el, p) {
    var c = ctx(p), h = "";
    window.SAK.policies.forEach(function (pol, i) {
      h += '<details class="doc"><summary>' + E(pol.title) + '</summary><pre>' + E(P.fill(pol.body, c)) + '</pre>' +
        '<p><button type="button" class="small" data-act="md" data-i="' + i + '">Download .md</button> ' +
        '<button type="button" class="small" data-act="html" data-i="' + i + '">Download .html (opens in Word or Google Docs)</button></p></details>';
    });
    el.innerHTML = h;
    el.onclick = function (e) {
      var b = e.target.closest("button[data-act]");
      if (!b) return;
      var pp = P.load(), cc = ctx(pp), pol = window.SAK.policies[+b.getAttribute("data-i")];
      var body = P.fill(pol.body, cc), slug = (pp.company || "company").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      if (b.getAttribute("data-act") === "md") download(slug + "-" + pol.id + ".md", "# " + pol.title + "\n\n" + body);
      else download(slug + "-" + pol.id + ".html", mdToHtml(body, pol.title), "text/html;charset=utf-8");
      if (window.track) window.track("kit_download");
    };
  }

  function renderEmails(el, p) {
    var c = ctx(p), h = "";
    window.SAK.emails.forEach(function (m, i) {
      h += '<div class="email"><h2>' + E(m.title) + '</h2><textarea rows="10" id="em' + i + '">' + E(P.fill(m.body, c)) + '</textarea><button type="button" class="small copy-em" data-i="' + i + '">Copy email</button></div>';
    });
    el.innerHTML = h;
    el.onclick = function (e) {
      var b = e.target.closest("button.copy-em");
      if (b) copy(document.getElementById("em" + b.getAttribute("data-i")).value, b);
    };
  }

  window.SAK.kit = { ctx: ctx, answer: answer, renderAnswers: renderAnswers, renderPolicies: renderPolicies, renderEmails: renderEmails, answersCsv: answersCsv, download: download, mdToHtml: mdToHtml, copy: copy };
})();
