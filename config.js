/* Single switch for payments and analytics. Nothing else in the site may hard-code these values.
   PayPal client IDs are public by design. The PayPal secret never goes in this repo. */
window.NOBLE_CONFIG = {
  PAYPAL_ENV: "live",          // "sandbox" or "live"
  PAYPAL_CLIENT_ID_SANDBOX: "sb", // PayPal's documented public test client id
  PAYPAL_CLIENT_ID_LIVE: "BAATHyWOzpdh0unmjeb7uu-84aM0mQWCr_65O14OLTVVSeBWqr9B1CuaN9Aa2b3AleP0Kb6oKt2NfWq-3M",    // owner pastes the Live client id here (see noble/PING.md)
  CURRENCY: "EUR",
  PRICE: "49.00",                // kit price in CURRENCY, no VAT charged (Section 19 UStG)
  GOATCOUNTER_CODE: "",           // e.g. "noblekit" for noblekit.goatcounter.com. Empty means GoatCounter is off.
  COUNTER_NAMESPACE: "noble-venture-03", // account-free event counter (abacus.jasoncameron.dev). Empty means off.
  SUPPORT_EMAIL: "support.toolkits.desk@gmail.com"               // owner sets a support address (see noble/PING.md). Empty shows the fallback contact.
};
window.NOBLE_CONFIG.PAYPAL_CLIENT_ID =
  window.NOBLE_CONFIG.PAYPAL_ENV === "live"
    ? window.NOBLE_CONFIG.PAYPAL_CLIENT_ID_LIVE
    : window.NOBLE_CONFIG.PAYPAL_CLIENT_ID_SANDBOX;
