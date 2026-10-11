/* Analytics with an owner and agent exclusion.
   Visit any page with ?noble=1 to set the exclusion flag (localStorage "noble_exclude").
   Visit with ?noble=0 to clear it. With the flag set, no analytics request fires.
   Bots that report navigator.webdriver are also excluded.
   Events: see docs/analytics.md. */
(function () {
  var C = window.NOBLE_CONFIG || {};
  var KEY = "noble_exclude";
  var excluded = false;
  try {
    var q = new URLSearchParams(location.search).get("noble");
    if (q === "1") localStorage.setItem(KEY, "1");
    if (q === "0") localStorage.removeItem(KEY);
    excluded = localStorage.getItem(KEY) === "1";
  } catch (e) { excluded = false; }
  if (navigator.webdriver) excluded = true;
  window.NOBLE_EXCLUDED = excluded;

  function counter(name) {
    if (excluded || !C.COUNTER_NAMESPACE) return;
    try {
      var url = "https://abacus.jasoncameron.dev/hit/" + encodeURIComponent(C.COUNTER_NAMESPACE) + "/" + encodeURIComponent(name);
      fetch(url, { mode: "cors", keepalive: true }).catch(function () {});
    } catch (e) {}
  }
  function goat(name) {
    if (excluded || !C.GOATCOUNTER_CODE || !window.goatcounter || !window.goatcounter.count) return;
    window.goatcounter.count({ path: "event-" + name, title: name, event: true });
  }
  /* track(name): named event, sent to every enabled backend. */
  window.track = function (name) { counter(name); goat(name); };

  if (excluded) {
    if (document.documentElement) document.documentElement.setAttribute("data-noble-excluded", "1");
    return;
  }
  if (C.GOATCOUNTER_CODE) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", "https://" + C.GOATCOUNTER_CODE + ".goatcounter.com/count");
    document.head.appendChild(s);
  }
  /* Qualified visitor: once per browser per day. Page view: once per browser per day per page. */
  function once(name) {
    var k = "noble_seen_" + name + "_" + new Date().toISOString().slice(0, 10);
    try { if (localStorage.getItem(k)) return; localStorage.setItem(k, "1"); } catch (e) {}
    counter(name);
  }
  var page = (document.body && document.body.getAttribute("data-page")) || "other";
  once("visitor");
  once("view_" + page);
  /* visit_src_<channel>: first qualified visit that carries ?src=<channel>, once per browser and channel. */
  try {
    var src = (new URLSearchParams(location.search).get("src") || "").toLowerCase();
    var SK = "noble_src_" + src;
    if (/^[a-z0-9_-]{1,32}$/.test(src) && !localStorage.getItem(SK)) {
      localStorage.setItem(SK, new Date().toISOString().slice(0, 10));
      window.track("visit_src_" + src);
    }
  } catch (e) {}
})();
