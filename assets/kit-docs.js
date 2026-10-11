/* Paid kit: policy templates and email scripts. Placeholders in {braces} are filled from the profile.
   Policies describe the target state. The buyer must edit anything that does not match what they do. */
(function () {
  var head = "Owner: {owner}\nApproved: {date}\nNext review: {review}\nApplies to: everyone who works for {company}, including contractors.\n\n";

  var POLICIES = [
    {
      id: "information-security-policy",
      title: "Information Security Policy",
      body: head +
"## 1. Purpose\n\n{company} protects the information that clients trust it with, and its own. This policy sets the rules. The other policies in this set give the detail.\n\n" +
"## 2. Responsibilities\n\n- {owner} is responsible for information security, approves these policies and reviews them at least once a year.\n- Everyone who works for {company} follows these policies and reports anything that looks wrong to {contact} at once.\n\n" +
"## 3. Principles\n\n- Least privilege: people get the access they need for their work, no more.\n- Strong login: multi-factor authentication (MFA) on every system that supports it.\n- Encryption: data is encrypted in transit and at rest.\n- Backups: important data is backed up automatically and restores are tested.\n- Honesty with clients: answers to client security questions describe what we actually do.\n\n" +
"## 4. Information classes\n\n| Class | Examples | Rule |\n|---|---|---|\n| Confidential | Client data, credentials, contracts | Only people on the engagement. Encrypted. Never in personal accounts. |\n| Internal | Plans, internal notes | Staff only. |\n| Public | Website, published content | No restriction. |\n\n" +
"## 5. Related policies\n\nAccess Control, Acceptable Use, Incident Response, Backup and Business Continuity, Data Retention and Deletion, Vendor Management, Secure Development.\n\n" +
"## 6. Exceptions and breaches of policy\n\nExceptions need written approval from {owner}, with an end date. Breaking this policy on purpose can lead to disciplinary steps or ending a contract.\n"
    },
    {
      id: "access-control-policy",
      title: "Access Control Policy",
      body: head +
"## 1. Accounts\n\n- Every person has a personal account. Shared accounts are used only where a service offers no alternative, and then the login lives in the company password manager with named access.\n- MFA is required on email, code hosting, cloud consoles, admin panels and the password manager. Authenticator apps or security keys are preferred over SMS.\n- Passwords are unique per service and stored only in the company password manager.\n\n" +
"## 2. Granting access\n\n- Access is granted per role and per client project, on request to {owner}.\n- Admin rights are limited to the people who need them.\n- Access to client systems follows the client's own rules where they have them.\n\n" +
"## 3. Reviews\n\n- {owner} reviews who has access to each system at least every 6 months and removes what is not needed.\n- The review date and changes are recorded.\n\n" +
"## 4. Joiners, movers, leavers\n\n- Joiners: accounts created on the first day, MFA set up before any client data is accessed.\n- Movers: access that is no longer needed is removed when the role changes.\n- Leavers: all access is removed within 1 working day of the last working day, using the leaver checklist below. Shared secrets the person knew are rotated.\n\n" +
"## 5. Leaver checklist\n\n- [ ] Email and calendar\n- [ ] Code hosting and CI\n- [ ] Cloud and hosting consoles\n- [ ] Password manager\n- [ ] Client systems and chat workspaces\n- [ ] Company devices returned and wiped\n- [ ] Shared secrets rotated\n"
    },
    {
      id: "acceptable-use-policy",
      title: "Acceptable Use Policy",
      body: head +
"## 1. Devices\n\n- Work is done on devices with full-disk encryption, a screen lock of 5 minutes or less, and automatic updates switched on.\n- Devices are locked when unattended and never left visible in a car.\n- Lost or stolen devices are reported to {contact} at once.\n\n" +
"## 2. Accounts and data\n\n- Client data stays in company or client systems. It is not copied to personal accounts, personal cloud storage or USB drives.\n- Client data is not pasted into public AI tools unless the client has agreed and the tool's terms allow it.\n- Passwords and secrets are never shared by chat, email or documents. Use the password manager.\n\n" +
"## 3. Email and links\n\n- Be careful with unexpected links, attachments and payment requests. Check by a second channel before acting on a request to change bank details or share credentials.\n- Report suspected phishing to {contact}.\n\n" +
"## 4. Software\n\n- Install software from official sources only.\n- Do not switch off security features such as encryption, updates or MFA.\n\n" +
"## 5. Confirmation\n\nEveryone confirms in writing that they have read this policy when they join and after each yearly review.\n"
    },
    {
      id: "incident-response-plan",
      title: "Incident Response Plan",
      body: head +
"## 1. What counts as an incident\n\nAnything that may affect the confidentiality, integrity or availability of client or company data. Examples: a lost laptop, a phishing click, a leaked password, unexpected admin access, ransomware, a provider breach.\n\n" +
"## 2. Report\n\nAnyone who suspects an incident reports it at once to {owner} ({contact}). Do not wait to be sure. Do not delete evidence.\n\n" +
"## 3. Roles\n\n- Incident lead: {owner}. Decides on actions and on telling clients.\n- Backup lead: [name of a second person, or an external adviser].\n\n" +
"## 4. Steps\n\n1. **Record**: start an incident log with time, who reported, what is known.\n2. **Contain**: revoke sessions, reset passwords, disable affected accounts or keys, isolate affected systems.\n3. **Assess**: what data and which clients are affected? Is personal data involved?\n4. **Notify**: tell affected clients without undue delay and within 72 hours of becoming aware of a breach of their data. Where {company} is the controller of personal data, check whether the supervisory authority must be told within 72 hours.\n5. **Recover**: restore from clean backups, patch the cause, confirm normal operation.\n6. **Review**: within 2 weeks, write down the cause and what changes. Update this plan if needed.\n\n" +
"## 5. Contacts\n\n| Who | Contact |\n|---|---|\n| Incident lead | {owner}, {contact} |\n| Hosting providers | {hosting} (support pages and abuse contacts) |\n| Data protection authority | [your national authority] |\n| Cyber insurer | [if any] |\n\n" +
"## 6. Test\n\nWalk through one scenario (for example a stolen laptop) once a year and record the result.\n"
    },
    {
      id: "backup-and-business-continuity-policy",
      title: "Backup and Business Continuity Policy",
      body: head +
"## 1. Backups\n\n- Client data, databases and important files are backed up automatically, at least daily.\n- Backups are stored in a separate account, region or provider from the original data and are encrypted.\n- Backups are kept for at least 30 days.\n\n" +
"## 2. Restore tests\n\n- At least once a year a restore is tested in a non-production environment. The time taken and any problems are recorded.\n\n" +
"## 3. Targets\n\n- Recovery point objective (RPO): 24 hours.\n- Recovery time objective (RTO): 1 working day for client-facing systems.\n\n" +
"## 4. Scenarios\n\n| Scenario | Response |\n|---|---|\n| Laptop lost or broken | Data is in cloud systems. Replace device, restore access, revoke old sessions. |\n| Provider outage | Follow the provider status page, inform affected clients, move critical work if the outage is long. |\n| Data deleted or encrypted by malware | Restore from the latest clean backup, then follow the Incident Response Plan. |\n| Key person unavailable | A second named person has emergency access to critical accounts through the password manager. |\n\n" +
"## 5. Review\n\n{owner} reviews this policy and the scenarios once a year.\n"
    },
    {
      id: "data-retention-and-deletion-policy",
      title: "Data Retention and Deletion Policy",
      body: head +
"## 1. Principle\n\n{company} keeps client data only as long as needed to deliver the service, meet legal duties or as agreed with the client.\n\n" +
"## 2. Retention periods\n\n| Data | Kept for |\n|---|---|\n| Client project data | Duration of the engagement, then returned or deleted within 30 days unless the client asks otherwise |\n| Backups | Expire on the normal schedule (at least 30 days, at most [90] days) |\n| Contracts and invoices | As required by tax law (for example 7 years in the Netherlands) |\n| Access and audit logs | At least 90 days |\n\n" +
"## 3. Deletion\n\n- Data is deleted from active systems with the provider's delete function. Devices are wiped before reuse or disposal.\n- Clients can ask for written confirmation of deletion from {contact}.\n\n" +
"## 4. Personal data\n\nWhere {company} processes personal data for a client, it follows the client's instructions and the data processing agreement.\n"
    },
    {
      id: "vendor-management-policy",
      title: "Vendor and Subprocessor Management Policy",
      body: head +
"## 1. Scope\n\nAny tool or company that stores, processes or can access client data.\n\n" +
"## 2. Before adopting a vendor\n\n- Check its security documentation (SOC 2 report, ISO 27001 certificate or a security page).\n- Check where data is stored and whether a data processing agreement is available.\n- Check that it supports MFA and, where useful, single sign-on.\n- {owner} approves the vendor.\n\n" +
"## 3. Subprocessor list\n\n{company} keeps a current list:\n\n| Vendor | Purpose | Data location | Security evidence |\n|---|---|---|---|\n| [from: {hosting}] | [purpose] | [location] | [SOC 2 / ISO / page] |\n\n" +
"## 4. Changes\n\nClients are told before a new subprocessor processes their personal data, where a data processing agreement requires it.\n\n" +
"## 5. Review\n\nThe list is reviewed once a year. Vendors no longer used are removed and their data deleted.\n"
    },
    {
      id: "secure-development-policy",
      title: "Secure Development Policy",
      body: head +
"## 1. Code changes\n\n- The main branch is protected. Changes go through review by a second person or required automated checks before merge.\n- Secrets (API keys, passwords, tokens) are never committed to code. They live in the hosting provider's secret store or the password manager.\n\n" +
"## 2. Dependencies\n\n- Dependency and vulnerability alerts are switched on for every repository.\n- Critical vulnerabilities are fixed within 7 days, high within 30 days.\n\n" +
"## 3. Environments\n\n- Development, test and production are separated, with separate credentials.\n- Production data is not used in development or testing. If it is needed to fix a problem, use the minimum and remove it afterwards.\n- Only named people can deploy to production.\n\n" +
"## 4. Common risks\n\nDevelopers check changes against common web risks (the OWASP Top 10), including injection, broken access control and insecure configuration.\n\n" +
"## 5. Client code and systems\n\nWhere a client's own rules are stricter, the client's rules apply.\n"
    }
  ];

  var EMAILS = [
    {
      title: "Send your overview before the questionnaire",
      body: "Subject: Security information for {clientName}\n\nHi {clientContact},\n\nBefore you send your security questionnaire, here is our Security Overview. It covers how we handle access, encryption, backups, incidents and vendors. Many teams find it answers most of their questions.\n\nIf you still need your questionnaire filled in, please send it and tell us which sections apply to our work for you, since we [describe the scope, for example: build your marketing site and do not host your customer data].\n\nBest,\n{owner}\n{company}"
    },
    {
      title: "Ask which sections apply",
      body: "Subject: Re: Vendor security questionnaire\n\nHi {clientContact},\n\nThanks for sending the questionnaire. To give you accurate answers quickly: our work for you covers [scope]. We will not [host your production data / have access to your customer data / connect to your internal network].\n\nCould you confirm which sections apply to this scope? We will answer those in full and mark the rest as not applicable, with a short reason.\n\nBest,\n{owner}"
    },
    {
      title: "Ask for more time",
      body: "Subject: Re: Security questionnaire, timing\n\nHi {clientContact},\n\nWe want to answer your questionnaire accurately rather than quickly. We will send it back by [date]. If anything blocks the project before then, I am happy to walk your team through our controls on a 20-minute call.\n\nBest,\n{owner}"
    },
    {
      title: "Answer \"Do you have SOC 2 or ISO 27001?\" honestly",
      body: "Subject: Re: SOC 2 / ISO 27001\n\nHi {clientContact},\n\nWe do not hold SOC 2 or ISO 27001 today. As a team of {sizeText}, we focus on the controls those frameworks check: MFA on all systems, encrypted devices, encrypted data in transit and at rest, automatic backups with tested restores, and a written incident plan with 72-hour client notification.\n\nOur Security Overview and policies are attached. We are glad to answer your questionnaire, sign your DPA, and agree specific controls in the contract if that helps.\n\nBest,\n{owner}"
    },
    {
      title: "Send the completed questionnaire",
      body: "Subject: Completed security questionnaire\n\nHi {clientContact},\n\nAttached is the completed questionnaire. Where an item is not in place today, we say so and give the date we expect to close it. Our policies are attached as well.\n\nQuestions go to {contact}. We review our answers at least once a year, and we will tell you if something material changes.\n\nBest,\n{owner}\n{company}"
    }
  ];

  window.SAK = window.SAK || {};
  window.SAK.policies = POLICIES;
  window.SAK.emails = EMAILS;
})();
