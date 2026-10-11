/* Free tool: builds a one-page Security Overview and a gap list from the profile. */
(function () {
  var P = window.SAK.profile;

  /* For each control: area, the statement when true, and the fix step when not. */
  var CONTROLS = {
    mfa: { area: "Access", yes: "Multi-factor authentication is required on email, code hosting, cloud consoles and admin panels.", fix: "Turn on MFA for every account in email, code hosting, cloud consoles and admin panels. Use an authenticator app or security key, not SMS, where possible." },
    pwmanager: { area: "Access", yes: "All staff use a password manager. Passwords are not shared in chat or documents.", fix: "Roll out a password manager for everyone and move shared logins into shared vaults." },
    leaver: { area: "Access", yes: "Access is removed within 1 working day when someone leaves.", fix: "Write a leaver checklist (email, code hosting, cloud, password manager, client systems) and run it on the last working day." },
    review: { area: "Access", yes: "Access rights are reviewed at least every 6 months.", fix: "Put a review in the calendar every 6 months. List who has admin access to each system and remove what is not needed." },
    laptops: { area: "Devices", yes: "Every work laptop has full-disk encryption and an automatic screen lock.", fix: "Switch on FileVault (macOS) or BitLocker (Windows) and a screen lock of 5 minutes or less on every work laptop." },
    updates: { area: "Devices", yes: "Operating system and browser updates install automatically on work devices.", fix: "Switch on automatic updates for the operating system and browsers on every work device." },
    tls: { area: "Encryption", yes: "All services use encryption in transit (HTTPS or TLS).", fix: "Force HTTPS on every site and API and turn off plain HTTP and old TLS versions." },
    rest: { area: "Encryption", yes: "Stored client data is encrypted at rest.", fix: "Check that disks, databases and storage buckets use encryption at rest. Most cloud providers can switch this on in settings." },
    backups: { area: "Resilience", yes: "Client data and systems are backed up automatically.", fix: "Set up automatic daily backups for databases and file stores, kept in a separate account or region." },
    restore: { area: "Resilience", yes: "A restore from backup was tested in the last 12 months.", fix: "Restore one backup to a test environment, time it, and write down the result. Repeat once a year." },
    logs: { area: "Monitoring", yes: "Login and admin activity logs are switched on in the main systems and kept for at least 90 days.", fix: "Switch on audit logs in your email suite, code hosting and cloud accounts, and keep them for at least 90 days." },
    patching: { area: "Monitoring", yes: "Dependencies and servers are patched on a schedule, with alerts for known vulnerabilities.", fix: "Switch on dependency alerts (for example Dependabot or Renovate) and set a monthly patch day for servers." },
    codereview: { area: "Development", yes: "Code is reviewed by a second person or by automated checks before release.", fix: "Protect the main branch and require a review or passing checks before merge." },
    incident: { area: "Incidents", yes: "A written incident response plan exists, with a named contact.", fix: "Write a one-page incident plan: who decides, who to call, how to contain, how to tell clients." },
    notify: { area: "Incidents", yes: "Affected clients are told about a personal data breach within 72 hours.", fix: "Commit in writing to notify affected clients within 72 hours, and add it to your incident plan and contracts." },
    vendors: { area: "Vendors", yes: "A current list of vendors (subprocessors) that touch client data is kept.", fix: "List every tool and vendor that stores or processes client data, with its location and purpose." },
    training: { area: "People", yes: "Staff complete security awareness training at least once a year.", fix: "Run a 1-hour session once a year on phishing, passwords and reporting incidents, and keep an attendance list." },
    policies: { area: "People", yes: "Written security policies exist and staff have read them.", fix: "Write short policies (information security, access, acceptable use, incidents, backups) and have every person confirm they read them." },
    mdm: { area: "Devices", yes: "Work laptops are centrally managed, so encryption, screen lock and updates are enforced and a lost device can be locked or wiped remotely.", fix: "Enroll work laptops in a device management tool (for example the one included in Google Workspace or Microsoft 365 business plans) and enforce encryption, screen lock and updates." },
    sso: { area: "Access", yes: "Staff sign in to the main business apps through one identity provider with MFA.", fix: "Connect your main apps to one identity provider (for example Google Workspace or Microsoft Entra ID) so access is granted and removed in one place." },
    changes: { area: "Development", yes: "Every change to production is tracked in a ticket or pull request and can be rolled back.", fix: "Make every production change go through a ticket or pull request, and keep version history so a change can be reverted." },
    dataclass: { area: "Data", yes: "Client data is handled by sensitivity class, with stricter rules for confidential data.", fix: "Write three classes (confidential, internal, public) and the handling rule for each. Treat all client data as confidential." },
    aipolicy: { area: "AI tools", yes: "Written rules say which AI tools are approved for client data and what may be entered.", fix: "Write one page of AI rules: approved tools on business plans that do not train on your data, what may never be entered, and human review of outputs." },
    screening: { area: "People", yes: "References and identity are checked before new staff get access to client data.", fix: "Check references and identity before giving a new person access to client data, and keep a short record." },
    pentest: { area: "Assurance", yes: "An external penetration test was done in the last 12 months.", fix: "Optional for small firms. If clients ask, budget for a scoped external test of the main application." },
    insurance: { area: "Assurance", yes: "The company holds cyber insurance.", fix: "Optional. Ask your business insurer for a cyber policy quote if clients require it." }
  };

  var CERT = {
    none: "{company} does not hold a security certification today. This overview describes the controls in place instead.",
    soc2: "{company} holds a SOC 2 report, available under NDA on request.",
    iso: "{company} holds an ISO 27001 certificate, available on request.",
    both: "{company} holds a SOC 2 report and an ISO 27001 certificate, available on request.",
    other: "{company} holds a security certification, details on request."
  };
  var DATA = {
    contact: "{company} holds only business contact details of client staff.",
    business: "{company} holds client business data such as documents, code and content.",
    personal: "{company} processes personal data of client customers or staff on behalf of clients.",
    special: "{company} processes sensitive personal data (such as health, financial or identity data) on behalf of clients."
  };
  var SIZE = { "1": "one person", "2-5": "2 to 5 people", "6-25": "6 to 25 people", "26+": "more than 25 people" };

  function build(p) {
    var c = P.ctx(p);
    var f = function (t) { return P.fill(t, c); };
    var inPlace = {}, partial = [], gaps = [];
    Object.keys(CONTROLS).forEach(function (k) {
      var v = p[k];
      if (v === "yes") { (inPlace[CONTROLS[k].area] = inPlace[CONTROLS[k].area] || []).push(CONTROLS[k].yes); }
      else if (v === "partly") { partial.push({ k: k, c: CONTROLS[k] }); gaps.push({ k: k, c: CONTROLS[k], level: "partly" }); }
      else if (v === "no") { gaps.push({ k: k, c: CONTROLS[k], level: "no" }); }
    });
    return { c: c, f: f, inPlace: inPlace, partial: partial, gaps: gaps };
  }

  function overviewText(p) {
    var b = build(p), c = b.c, f = b.f, out = [];
    out.push("SECURITY OVERVIEW: " + c.company);
    out.push("Date: " + c.date + " | Contact: " + c.contact + " | Responsible: " + c.owner);
    out.push("");
    out.push("About");
    out.push(f("{company} ({website}) is a team of " + (SIZE[p.size] || "[team size]") + ". Systems and data are hosted on {hosting}. Client data is stored in {region}."));
    out.push(f(DATA[p.data] || DATA.business));
    out.push(f(CERT[p.cert] || CERT.none));
    out.push("");
    out.push("Controls in place");
    Object.keys(b.inPlace).forEach(function (area) {
      b.inPlace[area].forEach(function (s) { out.push("- " + area + ": " + s); });
    });
    if (b.partial.length) {
      out.push("");
      out.push("Controls in progress (target " + c.target + ")");
      b.partial.forEach(function (x) { out.push("- " + x.c.area + ": " + x.c.yes.replace(/\.$/, "") + " (partly in place today)."); });
    }
    out.push("");
    out.push(f("Questions about this overview: {contact}. Policies and further details are available on request."));
    return out.join("\n");
  }

  function gapsHtml(p) {
    var b = build(p), E = P.esc;
    if (!b.gaps.length) return '<p class="ok">No open gaps in your answers. Unanswered questions are not counted.</p>';
    var h = "<ol class=\"gaps\">";
    b.gaps.forEach(function (g) {
      h += "<li><strong>" + E(g.c.area) + ":</strong> " + E(g.c.yes) + " <em>(" + (g.level === "no" ? "missing" : "partly") + ")</em><br><span class=\"fix\">Fix: " + E(g.c.fix) + "</span></li>";
    });
    return h + "</ol>";
  }

  window.SAK.overview = { CONTROLS: CONTROLS, build: build, text: overviewText, gapsHtml: gapsHtml };
})();
