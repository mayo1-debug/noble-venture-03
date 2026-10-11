/* Kit page: unlock check, tabs, rendering.
   MVP delivery is client-side: the unlock lives in localStorage. Server-verified delivery is a ticket (noble/tickets.jsonl). */
(function () {
  var P = window.SAK.profile, O = window.SAK.overview, K = window.SAK.kit, C = window.NOBLE_CONFIG || {};
  var UKEY = "sak_unlock";

  function getUnlock() { try { return JSON.parse(localStorage.getItem(UKEY) || "null"); } catch (e) { return null; } }
  function setUnlock(order) { try { localStorage.setItem(UKEY, JSON.stringify({ order: order, at: new Date().toISOString() })); } catch (e) {} }

  document.querySelectorAll(".support-contact").forEach(function (el) {
    if (C.SUPPORT_EMAIL) { el.innerHTML = '<a href="mailto:' + P.esc(C.SUPPORT_EMAIL) + '">' + P.esc(C.SUPPORT_EMAIL) + "</a>"; }
    else { el.innerHTML = 'the address on the <a href="../legal/imprint.html">imprint page</a>'; }
  });

  var u = getUnlock();
  if (!u) {
    document.getElementById("locked").hidden = false;
    document.getElementById("order-go").onclick = function () {
      var v = document.getElementById("order-in").value.trim().toUpperCase();
      var msg = document.getElementById("order-msg");
      if (!/^[A-Z0-9]{17}$/.test(v)) { msg.textContent = "That does not look like a PayPal order ID (17 letters and digits). Check your PayPal receipt, or contact support."; return; }
      setUnlock(v);
      location.reload();
    };
    return;
  }

  document.getElementById("unlocked").hidden = false;
  document.getElementById("order-id").textContent = u.order;
  var q = new URLSearchParams(location.search);
  if (q.get("thanks") === "1") {
    var th = document.getElementById("thanks");
    th.hidden = false;
    th.innerHTML = "<strong>Payment received. Thank you.</strong> Your order ID is <code>" + P.esc(u.order) + "</code>. Keep it: it unlocks the kit on another device. Fill in your profile below and everything updates.";
  }

  var form = document.getElementById("profile");
  function renderAll(p) {
    K.renderAnswers(document.getElementById("answers"), p);
    K.renderPolicies(document.getElementById("policies"), p);
    K.renderEmails(document.getElementById("emails"), p);
    document.getElementById("gaps").innerHTML = O.gapsHtml(p);
    document.getElementById("overview").value = O.text(p);
  }
  P.render(form, renderAll);
  var p0 = P.load();
  if (!p0.company) document.getElementById("profile-box").open = true;
  renderAll(p0);

  document.querySelectorAll(".tabs button").forEach(function (b) {
    b.onclick = function () {
      var tab = b.getAttribute("data-tab");
      document.querySelectorAll(".tabs button").forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
      document.querySelectorAll("[data-panel]").forEach(function (pn) { pn.hidden = pn.getAttribute("data-panel") !== tab; });
    };
  });
  document.getElementById("csv").onclick = function () {
    var p = P.load(), slug = (p.company || "company").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    K.download(slug + "-security-answers.csv", K.answersCsv(p), "text/csv;charset=utf-8");
    if (window.track) window.track("kit_download");
  };
  document.getElementById("print-ans").onclick = function () { window.print(); };
  document.getElementById("copy-ov").onclick = function () { K.copy(document.getElementById("overview").value, this); };
})();
