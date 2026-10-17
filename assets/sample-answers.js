/* Free sample answers shown on the home page. The full library of 86 answers, the policies and the email scripts
   are not in this site. They are sent by the delivery worker to a verified buyer (see docs/delivery-worker.md).
   Same fields as the paid answers: d = domain, q = question, f = profile field, y = answer in place, n = answer not in place. */
(function () {
  window.SAK = window.SAK || {};
  window.SAK.answers = [
    { d: "Governance", q: "Do you hold any security certifications (SOC 2, ISO 27001)?", t: "{certText}" },
    { d: "Access control", q: "Is multi-factor authentication (MFA) enforced for all users?", f: "mfa", y: "Yes. MFA is required on email, code hosting, cloud consoles and admin panels. Authenticator apps or security keys are used where the service supports them.", n: "Not on every system yet. Enabling MFA on all accounts is our first priority." },
    { d: "Backups and continuity", q: "Are backups tested?", f: "restore", y: "Yes. A restore from backup was tested in the last 12 months, and the test is repeated at least once a year. Results are recorded.", n: "Not yet. A documented restore test is planned." }
  ];
})();
