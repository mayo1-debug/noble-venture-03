/* PayPal Smart Buttons checkout. Reads every PayPal value from config.js.
   The PayPal secret never enters this site. Delivery after capture is client-side (MVP).
   The buyer ticks the consent box, then presses the own order button (Section 312j(3) BGB,
   from noble-order.js). Only that click loads the PayPal SDK. After capture the order
   confirmation file is offered before the kit opens (Section 312f BGB). */
(function () {
  var C = window.NOBLE_CONFIG || {};
  var box = document.getElementById("paypal-buttons");
  var status = document.getElementById("checkout-status");
  if (!box) return;
  function t(name) { if (window.track) window.track(name); }
  function say(msg) { status.hidden = !msg; status.textContent = msg || ""; }

  var consent = document.getElementById("consent");
  if (consent) consent.addEventListener("change", function () { consent.closest("label").classList.remove("attention"); });

  if (!C.PAYPAL_CLIENT_ID) {
    say("Checkout is being set up. Please check back soon.");
    return;
  }
  if (C.PAYPAL_ENV !== "live") {
    say("Test mode: payments use the PayPal sandbox and no real money is charged.");
  }

  var PRODUCT = "Security Answer Kit (digital, instant access)", loaded = false, order = null;
  function load() {
  loaded = true;
  var s = document.createElement("script");
  s.src = "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(C.PAYPAL_CLIENT_ID) +
    "&currency=" + encodeURIComponent(C.CURRENCY || "EUR") + "&intent=capture&components=buttons";
  s.setAttribute("data-namespace", "paypal");
  s.onerror = function () { loaded = false; say("PayPal could not load. Check your connection or ad blocker, then press the order button again."); t("paypal_blocked"); if (order) order.button.hidden = false; };
  s.onload = function () {
    window.paypal.Buttons({
      style: { layout: "vertical", label: "buynow" },
      onClick: function (data, actions) {
        if (!document.getElementById("consent").checked) {
          say("Please tick the box above to confirm instant delivery, then try again.");
          var cb = document.getElementById("consent");
          cb.closest("label").classList.add("attention");
          cb.focus();
          return actions.reject();
        }
        document.getElementById("consent").closest("label").classList.remove("attention");
        say(C.PAYPAL_ENV !== "live" ? "Test mode: payments use the PayPal sandbox and no real money is charged." : "");
        t("checkout_start");
        return actions.resolve();
      },
      createOrder: function (data, actions) {
        var inv = (document.getElementById("vatid").value || "").trim().slice(0, 120);
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [{
            description: PRODUCT,
            custom_id: inv || undefined,
            amount: { currency_code: C.CURRENCY || "EUR", value: C.PRICE || "49.00" }
          }],
          application_context: { shipping_preference: "NO_SHIPPING", brand_name: "Security Answer Kit" }
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (d) {
          if (d && d.status === "COMPLETED") {
            try { localStorage.setItem("sak_unlock", JSON.stringify({ order: d.id, at: new Date().toISOString() })); } catch (e) {}
            t(C.PAYPAL_ENV === "live" ? "payment_complete" : "payment_complete_sandbox");
            var th = document.getElementById("thanks");
            th.hidden = false;
            th.innerHTML = "<p><strong>Payment received. Thank you.</strong> Your order ID is <code>" + d.id + "</code>. Keep it: it unlocks the kit on another device, and support needs it if anything is missing.</p><p><a class=\"btn\" href=\"kit/?thanks=1\">Open your kit</a></p>";
            say("");
            return window.NobleOrder.confirm({
              lang: "en", business: "Security Answer Kit", product: PRODUCT, price: C.PRICE || "49.00", currency: C.CURRENCY || "EUR",
              orderId: d.id, consentText: consent.closest("label").textContent.trim(), email: C.SUPPORT_EMAIL || "",
              termsUrl: "legal/terms.html", withdrawalUrl: "legal/refund.html", withdrawUrl: "legal/withdraw.html", mount: th
            }).catch(function () {}).then(function () { th.scrollIntoView({ behavior: "smooth", block: "start" }); });
          } else {
            say("The payment was not completed (status: " + (d && d.status) + "). You were not charged for the kit. Please try again.");
            t("checkout_error");
          }
        });
      },
      onCancel: function () { say("Payment cancelled. Nothing was charged."); t("checkout_cancel"); },
      onError: function (err) { say("Something went wrong with PayPal. Nothing was charged. Please try again."); t("checkout_error"); if (window.console) console.warn(err); }
    }).render("#paypal-buttons");
  };
  document.head.appendChild(s);
  }

  order = window.NobleOrder.gate({
    consent: consent, paypal: box, lang: "en", price: C.PRICE || "49.00", currency: C.CURRENCY || "EUR",
    onOrder: function () { if (!loaded) load(); }
  });
})();
