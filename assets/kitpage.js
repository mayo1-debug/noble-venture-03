/* Kit page: unlock check, tabs, rendering.
   With NOBLE_CONFIG.DELIVERY_URL empty, delivery is client-side: the unlock lives in localStorage and the paid data
   files are loaded by the page. With DELIVERY_URL set, the order ID is checked by the delivery worker (worker/) and the
   paid content (answers, policies, emails) comes back in the response. See docs/delivery-worker.md. */
(function () {
  var P = window.SAK.profile, O = window.SAK.overview, K = window.SAK.kit, C = window.NOBLE_CONFIG || {};
  var UKEY = "sak_unlock";

  function getUnlock() { try { return JSON.parse(localStorage.getItem(UKEY) || "null"); } catch (e) { return null; } }
  function setUnlock(order) { try { localStorage.setItem(UKEY, JSON.stringify({ order: order, at: new Date().toISOString() })); } catch (e) {} }

  document.querySelectorAll(".support-contact").forEach(function (el) {
    if (C.SUPPORT_EMAIL) { el.innerHTML = '<a href="mailto:' + P.esc(C.SUPPORT_EMAIL) + '">' + P.esc(C.SUPPORT_EMAIL) + "</a>"; }
    else { el.innerHTML = 'the address on the <a href="../legal/imprint.html">imprint page</a>'; }
  });

  var DENIED = {
    unknown_order: "PayPal does not know this order ID. Check it against your PayPal receipt.",
    not_completed: "This order is not a completed payment yet. If you just paid, wait a minute and try again.",
    refunded: "This order was refunded, so the kit is no longer unlocked for it.",
    wrong_amount: "This order is not a payment for the kit.",
    wrong_order: "This order is not a payment for the kit.",
    bad_order_id: "That does not look like a PayPal order ID (17 letters and digits). Check your PayPal receipt, or contact support."
  };

  function showLocked(msg) {
    document.getElementById("checking").hidden = true;
    document.getElementById("locked").hidden = false;
    document.getElementById("order-msg").textContent = msg || "";
  }

  function wireLocked() {
    document.getElementById("order-go").onclick = function () {
      var v = document.getElementById("order-in").value.trim().toUpperCase();
      var msg = document.getElementById("order-msg");
      if (!/^[A-Z0-9]{17}$/.test(v)) { msg.textContent = DENIED.bad_order_id; return; }
      setUnlock(v);
      location.reload();
    };
  }

  /* Asks the delivery worker for the paid content. Calls done() once SAK.answers, policies and emails are set. */
  function deliver(order, done) {
    var box = document.getElementById("checking"), msg = document.getElementById("checking-msg"), retry = document.getElementById("retry");
    box.hidden = false; retry.hidden = true;
    msg.textContent = "Checking your PayPal order. This takes a few seconds.";
    function fail(text) {
      msg.textContent = text + " Your order ID is " + order + ". If this keeps happening, contact support with that order ID.";
      retry.hidden = false;
      retry.onclick = function () { deliver(order, done); };
    }
    var ctl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, 20000) : null;
    fetch(C.DELIVERY_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: order }), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.json().then(function (j) { return { status: r.status, j: j }; }, function () { return { status: r.status, j: {} }; }); })
      .then(function (r) {
        if (timer) clearTimeout(timer);
        if (r.status === 200 && r.j && r.j.ok && r.j.answers && r.j.policies && r.j.emails) {
          window.SAK.answers = r.j.answers; window.SAK.policies = r.j.policies; window.SAK.emails = r.j.emails;
          box.hidden = true;
          done();
        } else if (r.status === 400 || r.status === 403) {
          try { localStorage.removeItem(UKEY); } catch (e) {}
          showLocked(DENIED[r.j && r.j.reason] || "This order could not be verified. Contact support with your order ID.");
          wireLocked();
        } else {
          fail("The order check is not available right now. Nothing is lost.");
        }
      })
      .catch(function () { if (timer) clearTimeout(timer); fail("The order check could not be reached. Check your connection."); });
  }

  var u = getUnlock();
  if (!u) {
    document.getElementById("locked").hidden = false;
    wireLocked();
    return;
  }
  if (C.DELIVERY_URL) { deliver(u.order, function () { openKit(u); }); return; }
  if (!window.SAK.answers || !window.SAK.policies || !window.SAK.emails) {
    var cm = document.getElementById("checking-msg");
    document.getElementById("checking").hidden = false;
    cm.textContent = "The kit content is not available on this page right now. Contact support with your order ID " + u.order + ".";
    return;
  }
  openKit(u);

  function openKit(u) {
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
  }
})();
