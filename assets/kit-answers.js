/* Paid kit: answer library.
   Each entry: d = domain, q = question as clients usually phrase it, f = profile field,
   y = answer when the control is in place, n = honest answer when it is not.
   Entries with t instead of y/n use a fixed answer built from text fields.
   "Partly" answers are built from y plus a coverage note. */
(function () {
  var A = [
    // Company and governance
    { d: "Governance", q: "Who is responsible for information security in your organisation?", t: "{owner} is responsible for information security at {company} and can be reached at {contact}." },
    { d: "Governance", q: "How many employees or contractors have access to our data?", t: "{sizeText} at {company} can access client systems or data. Access is limited to people working on the engagement." },
    { d: "Governance", q: "Do you hold any security certifications (SOC 2, ISO 27001)?", t: "{certText}" },
    { d: "Governance", q: "Do you have a documented information security policy?", f: "policies", y: "Yes. {company} has a written information security policy, owned by {owner}, reviewed at least once a year. All staff confirm they have read it.", n: "Not as a formal document yet. Our security practices are described in this questionnaire. A written policy is being finalised." },
    { d: "Governance", q: "Are security policies reviewed and approved at least annually?", f: "policies", y: "Yes. Policies are reviewed at least once a year by {owner}. The next review is due by {review}.", n: "Not yet. Annual review will start once the written policies are in place." },
    { d: "Governance", q: "Do you carry cyber liability insurance?", f: "insurance", y: "Yes. {company} holds cyber insurance. Certificate details are available on request.", n: "No. {company} does not hold dedicated cyber insurance at this time." },

    // People
    { d: "People", q: "Do employees receive security awareness training?", f: "training", y: "Yes. Everyone with access to client data completes security awareness training at least once a year, covering phishing, passwords and incident reporting. Attendance is recorded.", n: "Not on a formal schedule yet. Annual awareness training covering phishing, passwords and incident reporting is being introduced." },
    { d: "People", q: "Do staff sign confidentiality agreements?", t: "Yes. Everyone working for {company} on client work is bound by confidentiality terms in their employment or contractor agreement." },
    { d: "People", q: "What happens to access when an employee or contractor leaves?", f: "leaver", y: "A leaver checklist is run on the last working day. Access to email, code hosting, cloud accounts, the password manager and client systems is removed within 1 working day.", n: "Access is removed manually when someone leaves. A written leaver checklist with a 1-working-day deadline is being introduced." },
    { d: "People", q: "Is there an acceptable use policy for company systems?", f: "policies", y: "Yes. An acceptable use policy covers company devices, accounts, client data and personal use. Staff confirm it when they join.", n: "Not as a separate written policy yet. Acceptable use rules are being written as part of our policy set." },

    // Access control
    { d: "Access control", q: "Is multi-factor authentication (MFA) enforced for all users?", f: "mfa", y: "Yes. MFA is required on email, code hosting, cloud consoles and admin panels. Authenticator apps or security keys are used where the service supports them.", n: "Not on every system yet. Enabling MFA on all accounts is our first priority." },
    { d: "Access control", q: "Is MFA required for remote and administrative access?", f: "mfa", y: "Yes. All administrative and remote access (cloud consoles, servers, admin panels) requires MFA.", n: "Not on every administrative account yet. This is being fixed first." },
    { d: "Access control", q: "How are passwords managed and stored?", f: "pwmanager", y: "All staff use a company password manager. Passwords are unique per service and are never shared in chat, email or documents. Shared logins are kept in shared vaults with access limited by role.", n: "Staff use unique passwords, but a company-wide password manager is not yet in place. It is being rolled out." },
    { d: "Access control", q: "Do you follow the principle of least privilege?", f: "review", y: "Yes. Access is granted per role and per project. Admin rights are limited to the people who need them and are reviewed at least every 6 months.", n: "Access is granted per project, but formal periodic reviews are not yet in place. A 6-monthly review is being introduced." },
    { d: "Access control", q: "How often are user access rights reviewed?", f: "review", y: "At least every 6 months, and whenever someone changes role or leaves. Unneeded access is removed during the review.", n: "Access is reviewed when someone leaves or changes role. A fixed 6-monthly review is being introduced." },
    { d: "Access control", q: "Are shared or generic accounts used?", f: "pwmanager", y: "Personal accounts are used wherever the service supports them. Where a shared login cannot be avoided, it is stored in the password manager with access limited to named people and MFA enabled where possible.", n: "Personal accounts are used where possible. Moving the remaining shared logins into a password manager with named access is in progress." },

    // Devices
    { d: "Devices", q: "Are company laptops and workstations encrypted?", f: "laptops", y: "Yes. Every work laptop uses full-disk encryption (FileVault or BitLocker) and locks automatically after a short idle period.", n: "Not on every device yet. Full-disk encryption on all work laptops is being enforced." },
    { d: "Devices", q: "How do you keep operating systems and software up to date?", f: "updates", y: "Automatic updates are switched on for operating systems and browsers on all work devices. Critical updates are installed within 14 days.", n: "Updates are installed manually. Automatic updates on all work devices are being switched on." },
    { d: "Devices", q: "Do you use anti-malware or endpoint protection?", f: "updates", y: "Work devices run the built-in protection of current operating systems (for example Microsoft Defender or macOS XProtect and Gatekeeper), kept current through automatic updates.", n: "Devices run built-in operating system protection. Automatic updates to keep it current are being enforced." },
    { d: "Devices", q: "What happens if a laptop is lost or stolen?", f: "laptops", y: "The disk is encrypted, so data is not readable. The person reports it at once, passwords and sessions for company accounts are revoked, and the incident process is followed.", n: "The person reports it at once and passwords and sessions are revoked. Full-disk encryption on all laptops is being enforced to protect stored data." },

    // Data protection
    { d: "Data protection", q: "What types of our data will you store or process?", t: "{dataText}" },
    { d: "Data protection", q: "Where is our data stored (country and provider)?", t: "Client data is stored in {region}, using: {hosting}." },
    { d: "Data protection", q: "Is our data logically separated from other customers' data?", t: "Yes. Client data is kept in separate projects, folders, repositories or accounts per client, with access limited to the people working on that client." },
    { d: "Data protection", q: "How do you return or delete our data at the end of the contract?", t: "At the end of the engagement, {company} returns client data on request and deletes it from active systems within 30 days. Backups expire on their normal schedule. Written confirmation of deletion is available on request." },
    { d: "Data protection", q: "Do you use client data for any other purpose, such as training AI models?", t: "No. Client data is used only to deliver the agreed services. It is not sold, shared for marketing, or used to train AI models." },

    // Encryption
    { d: "Encryption", q: "Is data encrypted in transit?", f: "tls", y: "Yes. All services use HTTPS or TLS. Plain HTTP is redirected or disabled.", n: "Most services use HTTPS. Enforcing TLS on every service is being completed." },
    { d: "Encryption", q: "Is data encrypted at rest?", f: "rest", y: "Yes. Stored client data is encrypted at rest, using the encryption of our hosting providers ({hosting}).", n: "Not on every store yet. Encryption at rest is being switched on for all databases and file storage." },
    { d: "Encryption", q: "How are encryption keys managed?", f: "rest", y: "Keys are managed by our hosting providers' key management services ({hosting}). Staff do not handle raw keys. Application secrets are kept in the provider's secret store or the password manager, not in code.", n: "Encryption keys are managed by our hosting providers where encryption is enabled. Secrets are being moved out of code into a secret store." },

    // Backups and continuity
    { d: "Backups and continuity", q: "Do you back up data, and how often?", f: "backups", y: "Yes. Client data and systems are backed up automatically, at least daily, and kept in a separate account or region.", n: "Not automatically for every system yet. Automatic daily backups are being set up." },
    { d: "Backups and continuity", q: "Are backups tested?", f: "restore", y: "Yes. A restore from backup was tested in the last 12 months, and the test is repeated at least once a year. Results are recorded.", n: "Not yet. A documented restore test is planned." },
    { d: "Backups and continuity", q: "Do you have a business continuity or disaster recovery plan?", f: "backups", y: "Yes. The plan covers loss of a system, loss of a laptop, loss of a key person and provider outages. It relies on automatic backups and documented access to critical accounts.", n: "Not as a written plan yet. A short continuity plan covering backups, provider outages and key-person risk is being written." },
    { d: "Backups and continuity", q: "What are your recovery time (RTO) and recovery point (RPO) objectives?", f: "backups", y: "Target RPO is 24 hours (daily backups). Target RTO for client-facing systems is 1 working day. Both are reviewed after each restore test.", n: "Formal RTO and RPO targets are not yet set. They will be defined once automatic backups are in place." },
    { d: "Backups and continuity", q: "What happens if a key person becomes unavailable?", f: "pwmanager", y: "Access to critical accounts is documented and held in the company password manager with emergency access for a second named person, so work can continue.", n: "Emergency access for a second named person is being set up through a company password manager." },

    // Logging and monitoring
    { d: "Logging and monitoring", q: "Do you log access to systems that hold our data?", f: "logs", y: "Yes. Login and admin activity logs are switched on in our main systems (email suite, code hosting, cloud accounts) and kept for at least 90 days.", n: "Not in every system yet. Audit logging is being switched on in all main systems." },
    { d: "Logging and monitoring", q: "How do you detect suspicious activity?", f: "logs", y: "Provider security alerts (suspicious logins, new admin grants, unusual activity) are switched on and go to {contact}. Logs are checked when an alert fires.", n: "Provider security alerts are being switched on and routed to {contact}." },

    // Vulnerability management
    { d: "Vulnerability management", q: "How do you manage vulnerabilities in your software and systems?", f: "patching", y: "Dependency and vulnerability alerts are switched on for our code. Servers and dependencies are patched on a schedule. Critical issues are fixed within 7 days, high within 30 days.", n: "Patches are applied manually. Automated dependency alerts and a fixed patch schedule are being introduced." },
    { d: "Vulnerability management", q: "Have you had an external penetration test?", f: "pentest", y: "Yes. An external penetration test was done in the last 12 months. A summary is available under NDA.", n: "Not in the last 12 months. Given our size, we rely on automated vulnerability alerts and code review. A scoped test can be arranged if required for this engagement." },
    { d: "Vulnerability management", q: "Do you have a way for people to report security issues?", t: "Yes. Security issues can be reported to {contact}. Reports are acknowledged within 2 working days." },

    // Secure development
    { d: "Secure development", q: "Do you follow a secure development process?", f: "codereview", y: "Yes. Code goes through review by a second person or automated checks before release. The main branch is protected. Secrets are not stored in code.", n: "Code is tested before release. Required review or automated checks before merge are being enforced." },
    { d: "Secure development", q: "Is production data used in development or testing?", t: "No, by default. Development and testing use test data. If production data is ever needed to fix a problem, it is limited to what is needed and removed afterwards." },
    { d: "Secure development", q: "Are development, test and production environments separated?", f: "codereview", y: "Yes. Production is separate from development and test, with its own credentials. Only named people can deploy to production.", n: "Environments are being separated with their own credentials, and production deploys limited to named people." },
    { d: "Secure development", q: "How do you protect secrets such as API keys?", f: "pwmanager", y: "Secrets are kept in the hosting provider's secret store or the company password manager, never in code repositories. They are rotated when someone with access leaves.", n: "Secrets are being moved into a secret store or password manager and out of code and chat." },

    // Incident response
    { d: "Incident response", q: "Do you have an incident response plan?", f: "incident", y: "Yes. A written incident response plan names {owner} as the decision maker and covers detection, containment, recovery, client notification and a review afterwards.", n: "Not as a written plan yet. {owner} handles incidents. A written plan is being finalised." },
    { d: "Incident response", q: "How quickly will you notify us of a security incident or data breach?", f: "notify", y: "Affected clients are notified without undue delay and within 72 hours of {company} becoming aware of a breach affecting their data.", n: "Affected clients are notified as soon as a breach affecting their data is confirmed. A written 72-hour commitment is being added to our incident plan." },
    { d: "Incident response", q: "Have you had a security breach in the last 3 years?", t: "[Answer truthfully. If none: \"{company} has not had a security breach affecting client data in the last 3 years.\" If yes: describe it briefly and what changed after it.]" },
    { d: "Incident response", q: "Who is the contact for security incidents?", t: "{owner}, {contact}." },

    // Vendors
    { d: "Vendors and subprocessors", q: "Do you use subcontractors or subprocessors that will access our data?", f: "vendors", y: "Yes, a small set of providers. A current list of subprocessors that touch client data, with location and purpose, is kept and shared on request. Main providers: {hosting}.", n: "Our main providers are {hosting}. A complete written subprocessor list is being compiled." },
    { d: "Vendors and subprocessors", q: "How do you assess the security of your vendors?", f: "vendors", y: "Before adopting a tool that touches client data, we check its security documentation (for example SOC 2 or ISO 27001), data location and MFA support. The list is reviewed yearly.", n: "We choose established providers with published security documentation. A formal vendor check is being added to our process." },
    { d: "Vendors and subprocessors", q: "Will you notify us before adding a new subprocessor?", t: "Yes. {company} will inform clients before adding a new subprocessor that will process their personal data, where a data processing agreement requires it." },

    // Privacy
    { d: "Privacy", q: "Are you compliant with GDPR?", t: "{company} processes personal data in line with GDPR where it applies. We sign a data processing agreement with clients when we process personal data on their behalf. We do not claim a certification for GDPR, as none exists." },
    { d: "Privacy", q: "Will you sign our data processing agreement (DPA)?", t: "Yes, where we process personal data on your behalf. Please send your DPA for review." },
    { d: "Privacy", q: "Is data transferred outside the EU/EEA?", t: "Client data is stored in {region}. Where a provider transfers data outside the EU/EEA, it relies on the EU-US Data Privacy Framework or Standard Contractual Clauses. Details per provider are available on request." },

    // Physical
    { d: "Physical security", q: "How do you secure your offices or workplaces?", t: "{company} works from offices and home offices without on-site servers. Client data lives with our hosting providers, whose data centres are covered by their own certifications. Laptops are locked when unattended." },
    { d: "Physical security", q: "Do you operate your own data centre?", t: "No. All systems run with hosting providers: {hosting}." }
  ];

  /* Added 2026-10-11: questions that commonly appear in vendor questionnaires (written from scratch, no licensed questionnaire text). */
  var B = [
    // Access control
    { d: "Access control", q: "Do you use single sign-on (SSO) for your business applications?", f: "sso", y: "Yes. Staff sign in to the main business applications through one identity provider with MFA, so access is granted and removed in one place.", n: "Not yet. Each application has its own login, protected by the password manager and MFA where available. Moving the main applications behind one identity provider is planned." },
    { d: "Access control", q: "Is there one central place to disable a user's access?", f: "sso", y: "Yes. Disabling the account in our identity provider removes access to every application connected to it. Remaining non-SSO tools are covered by the leaver checklist.", n: "Access is removed per application, using a leaver checklist. A central identity provider is planned." },
    { d: "Access control", q: "Is MFA enforced on your email system?", f: "mfa", y: "Yes. MFA is required for every email account.", n: "Not on every email account yet. This is being fixed first." },
    { d: "Access control", q: "Is MFA enforced on your source code repositories?", f: "mfa", y: "Yes. MFA is required for every account with access to our code hosting.", n: "Not on every code hosting account yet. This is being fixed first." },
    { d: "Access control", q: "Do you have a password policy?", f: "pwmanager", y: "Yes. Staff use the company password manager to generate and store a unique password for every service. Passwords are never reused or shared outside the password manager.", n: "Staff are asked to use unique passwords. A company password manager that generates and stores them is being rolled out." },

    // Devices
    { d: "Devices", q: "Are company devices centrally managed (MDM)?", f: "mdm", y: "Yes. Work laptops are enrolled in device management, which enforces encryption, screen lock and updates.", n: "Not yet. Encryption, screen lock and updates are set on each device by hand. Central device management is planned." },
    { d: "Devices", q: "Can you remotely lock or wipe a lost or stolen device?", f: "mdm", y: "Yes. Device management lets us lock or wipe a work laptop remotely.", n: "Not centrally yet. A lost device is protected by its disk encryption, and all its sessions and passwords are revoked at once. Remote wipe through device management is planned." },
    { d: "Devices", q: "Are personal devices (BYOD) allowed to access our data?", t: "[Choose one and delete the other: \"No. {company} accesses client data only from company devices.\" or \"Yes, with conditions: the device must have full-disk encryption, a screen lock, current updates, and MFA on every account used for client work.\"]" },
    { d: "Devices", q: "How quickly are critical security patches applied to devices?", f: "updates", y: "Automatic updates are switched on, so critical operating system and browser patches install as soon as they are released.", n: "Patches are installed by hand. Automatic updates on all work devices are being switched on." },

    // Data protection
    { d: "Data protection", q: "Do you classify data by sensitivity?", f: "dataclass", y: "Yes. Data is classed as confidential (client data, credentials, contracts), internal or public. Confidential data is limited to the people on the engagement and kept only in approved systems.", n: "Not formally yet. All client data is treated as confidential by default. A written classification is being added to our policies." },
    { d: "Data protection", q: "How do you handle confidential client data differently from other data?", f: "dataclass", y: "Confidential data is kept only in approved company or client systems, shared only with people on the engagement, never copied to personal accounts or removable media, and deleted at the end of the engagement.", n: "All client data is treated as confidential by default and kept in company or client systems. Written handling rules per class are being added." },
    { d: "Data protection", q: "Can you keep our data in a specific region, such as the EU?", t: "Client data is stored in {region}, with these providers: {hosting}. A request to keep data in one region is agreed per engagement where the provider supports it." },

    // Encryption
    { d: "Encryption", q: "Are backups encrypted?", f: "rest", y: "Yes. Encryption at rest covers stored client data, including backups held with our providers ({hosting}).", n: "Not for every store yet. Encryption at rest, including for backups, is being switched on." },
    { d: "Encryption", q: "Which TLS versions do your services support?", f: "tls", y: "All services use HTTPS or TLS through our providers ({hosting}), which support TLS 1.2 or higher. [Confirm that TLS 1.0 and 1.1 are switched off on every service you run.]", n: "Most services use HTTPS. Enforcing TLS 1.2 or higher on every service is being completed." },

    // Change management
    { d: "Change management", q: "Do you have a change management process for production systems?", f: "changes", y: "Yes. Every change to production is tracked in a ticket or pull request, with a short description, the person who made it and the date.", n: "Not formally yet. Changes are made by named people. Tracking every production change in a ticket or pull request is being introduced." },
    { d: "Change management", q: "Can changes to production be rolled back?", f: "changes", y: "Yes. Changes are tracked in version control or the provider's history, so a change can be reverted to the previous version.", n: "Not for every system yet. Version control or change history for every production system is being set up." },
    { d: "Change management", q: "How are emergency changes handled?", f: "changes", y: "Emergency changes are recorded in a ticket or pull request like every other change, so they can be reviewed and rolled back.", n: "Emergency changes are made by named people. Recording and reviewing them afterwards is being added to our process." },

    // Logging and monitoring
    { d: "Logging and monitoring", q: "How long do you keep logs?", f: "logs", y: "Login and admin activity logs are kept for at least 90 days.", n: "Retention depends on each provider's default. A minimum of 90 days is being set for all main systems." },
    { d: "Logging and monitoring", q: "Are logs protected against tampering?", f: "logs", y: "Audit logs are held by our providers' logging features (email suite, code hosting, cloud accounts). Normal user accounts cannot change or delete them.", n: "Audit logging is being switched on in all main systems, using provider logs that normal users cannot change." },

    // Vulnerability management
    { d: "Vulnerability management", q: "Do you scan your code and dependencies for vulnerabilities?", f: "patching", y: "Yes. Dependency and vulnerability alerts are switched on for our code repositories, and alerts are handled within the fix times in our patch schedule.", n: "Not automatically yet. Dependency and vulnerability alerts are being switched on for all repositories." },
    { d: "Vulnerability management", q: "Do you have a bug bounty or responsible disclosure policy?", t: "{company} does not run a paid bug bounty. Security issues can be reported to {contact}. Reports are acknowledged within 2 working days." },

    // AI tools
    { d: "AI tools", q: "Do you use AI tools (such as chat assistants or code assistants) with our data?", f: "aipolicy", y: "Only AI tools approved under our written AI rules are used with client data, on business plans whose terms exclude training on our data. Client data is not entered into other AI tools.", n: "We do not yet have written AI rules. Until they are in place, staff are told not to put client data into AI tools." },
    { d: "AI tools", q: "Do you have a policy on the use of generative AI?", f: "aipolicy", y: "Yes. Written rules say which AI tools are approved, what data may be entered, that outputs are reviewed by a person, and that client data is never used to train models.", n: "Not yet. Written rules for AI tools are being drafted." },
    { d: "AI tools", q: "Are AI providers included in your subprocessor list?", f: "aipolicy", y: "Yes. AI tools approved for client data are treated as subprocessors and listed with their purpose and data location.", n: "Not yet. AI providers will be added to the subprocessor list once our AI rules are written." },

    // People
    { d: "People", q: "Do you perform background checks on staff?", f: "screening", y: "Yes. Before someone gets access to client data, we check their references and identity.", n: "Not formally. New staff are known to us or recommended by people we trust. Reference checks before granting access to client data are being introduced." },
    { d: "People", q: "Do contractors follow the same security rules as employees?", f: "policies", y: "Yes. Our security policies apply to everyone who works for {company}, including contractors, who confirm them in writing.", n: "Contractors are bound by confidentiality terms. Written security policies that they confirm are being finalised." },
    { d: "People", q: "Do you run phishing awareness exercises?", f: "training", y: "Phishing is covered in the yearly security awareness training, including how to spot and report suspicious messages.", n: "Not yet. Yearly awareness training covering phishing is being introduced." },

    // Incident response
    { d: "Incident response", q: "Do you have a 24/7 security contact?", t: "{company} does not run a 24/7 security operations centre. Security reports to {contact} are acknowledged within 2 working days, and an incident affecting your data is escalated to {owner} at once." },

    // Backups and continuity
    { d: "Backups and continuity", q: "Do you have redundancy for critical systems?", t: "Our systems run with cloud providers ({hosting}) that operate redundant infrastructure. {company} relies on their availability commitments and on its own backups." },

    // Privacy
    { d: "Privacy", q: "Have you appointed a Data Protection Officer (DPO)?", t: "{owner} handles data protection questions at {contact}. [If you have appointed a Data Protection Officer, give their name and contact instead. GDPR requires a DPO only in specific cases, for example large-scale processing of sensitive data.]" },
    { d: "Privacy", q: "Can you help us answer data subject requests (access, deletion)?", t: "Yes. A request from your customers or staff that reaches us is forwarded to you without delay, and we help you answer it within the deadlines in our data processing agreement." },

    // Physical security
    { d: "Physical security", q: "Is our data printed or stored on removable media?", t: "No, by default. Client data stays in company or client systems. It is not printed or copied to USB drives or other removable media unless the engagement requires it and you agree." }
  ];

  /* Keep each domain together so the kit shows one heading per area. */
  var order = [];
  A.concat(B).forEach(function (a) { if (order.indexOf(a.d) < 0) order.push(a.d); });
  A = order.reduce(function (acc, dom) {
    return acc.concat(A.filter(function (a) { return a.d === dom; }), B.filter(function (a) { return a.d === dom; }));
  }, []);

  window.SAK = window.SAK || {};
  window.SAK.answers = A;
})();
