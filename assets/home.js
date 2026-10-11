/* Home page: free Security Overview builder and sample answers. */
(function () {
  var P = window.SAK.profile, O = window.SAK.overview, K = window.SAK.kit, E = P.esc;
  var form = document.getElementById("profile");
  var ta = document.getElementById("overview");
  var started = false, used = false;
  /* Sample questions shown on the home page, looked up by text so reordering the library cannot change them. */
  var SAMPLE_QS = [
    "Is multi-factor authentication (MFA) enforced for all users?",
    "Are backups tested?",
    "Do you hold any security certifications (SOC 2, ISO 27001)?"
  ].map(function (q) {
    for (var i = 0; i < window.SAK.answers.length; i++) if (window.SAK.answers[i].q === q) return i;
    return -1;
  }).filter(function (i) { return i >= 0; });

  function t(name) { if (window.track) window.track(name); }

  function update(p) {
    ta.value = O.text(p);
    document.getElementById("gaps").innerHTML = O.gapsHtml(p);
    var a = P.answered(p);
    document.getElementById("progress").textContent = a.done + " of " + a.total + " controls answered.";
    var c = K.ctx(p), h = "";
    SAMPLE_QS.forEach(function (i) {
      var q = window.SAK.answers[i], r = K.answer(q, p, c);
      h += '<div class="qa s-' + r.s + '"><p class="q">' + E(q.q) + '</p><p class="a">' + E(r.text) + "</p></div>";
    });
    document.getElementById("samples").innerHTML = h;
  }

  P.render(form, function (p) {
    if (!started) { started = true; t("tool_start"); }
    update(p);
  });
  update(P.load());

  function usedOnce() { if (!used) { used = true; t("tool_use"); } }

  document.getElementById("copy-ov").onclick = function () { K.copy(ta.value, this); usedOnce(); };
  document.getElementById("dl-ov").onclick = function () {
    var p = P.load(), slug = (p.company || "company").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    K.download(slug + "-security-overview.txt", ta.value);
    usedOnce();
  };
  document.getElementById("print-ov").onclick = function () {
    usedOnce();
    var w = window.open("", "_blank");
    if (!w) return;
    w.document.write("<!doctype html><title>Security Overview</title><pre style=\"font:14px/1.6 Arial,sans-serif;white-space:pre-wrap;max-width:760px;margin:2em auto\">" + E(ta.value) + "</pre>");
    w.document.close();
    w.focus();
    w.print();
  };
})();
