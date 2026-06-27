// ── SettleMap Premium Relocation Pack Generator ───────────────────────────────
// Pure helper — no side effects, no async. Used by webhook email + success page.
// V12.12.15: Executive summary, Next 7 actions, Budget table, Document tracker,
//            Provider worksheet, Copy-paste scripts, Quality gate footer.

import {
  RESEARCH_LINKS_BOUNDARY_COPY,
  getResearchLinkChecklistItems,
} from "@/data/researchLinksRegistry";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface PremiumPackMetadata {
  origin?: string | null;
  destination?: string | null;
  moveReason?: string | null;
  whoIsMoving?: string | null;
  timingMonth?: string | null;
  modules?: string | null; // comma-sep: family,couple,solo,corporate,returning,pet,student
  concerns?: string | null;
  buyerName?: string | null;
}

export interface PackSection {
  title: string;
  items: string[];
}

export interface PackTableSection {
  title: string;
  headers: string[];
  rows: string[][];
  note?: string;
}

export interface PremiumRelocationPack {
  effectiveRoute: string;
  // V12.12.15 — agentic structure sections
  executiveSummary: PackSection;
  whyUseful: PackSection;
  afterReceiving: PackSection;
  next7Actions: PackSection;
  officialSourceChecklist: PackSection;
  routeResearchPrompts: PackSection;
  budgetStarterTable: PackTableSection;
  documentTrackerTable: PackTableSection;
  providerWorksheet: PackTableSection;
  copyPasteScripts: PackSection;
  qualityGateFooter: PackSection;
  // V12.12.17 — banking/tax checklist + dedicated family handover
  bankingTaxChecklist: PackSection;
  familyHandover: PackSection | null;
  // Original sections
  routeSnapshot: PackSection;
  detailedChecklist: PackSection;
  budgetTemplate: PackSection;
  documentTracker: PackSection;
  firstWeekPlan: PackSection;
  personaModules: PackSection[];
  providerScripts: PackSection;
  researchLinks: PackSection;
  officialSourceReminder: PackSection;
  safetyBoundaryNote: string;
}

// ── V12.12.17 — Banking and tax planning checklist ────────────────────────────

function getBankingTaxChecklist(moveReason: string): PackSection {
  const corporateNote =
    moveReason.toLowerCase().includes("corporate") || moveReason.toLowerCase().includes("job") || moveReason.toLowerCase().includes("work")
      ? "A work-related move can trigger tax residency rules in both your origin and destination country in the same tax year — this is common and not a sign of a problem, but it must be checked."
      : "Even a non-work move can change your tax residency status depending on how many days you spend in each country — check both countries' residency rules.";

  return {
    title: "Banking and tax planning checklist",
    items: [
      "OPEN A LOCAL ACCOUNT EARLY: Most banks require proof of address or an employment/admission letter — ask what is accepted before you travel so you are not stuck using a travel card for weeks.",
      "KEEP YOUR ORIGIN ACCOUNT ACTIVE: Many banking OTPs and verifications still route to your origin number and account for the first few months — do not close it on departure.",
      "COMPARE INTERNATIONAL TRANSFER OPTIONS: Compare Wise, Revolut, your bank's wire transfer, and a local FX broker for your specific currency pair before moving a large sum.",
      corporateNote,
      "CHECK DOUBLE-TAX AGREEMENT STATUS: Check whether your origin and destination country have a double taxation agreement — this affects whether the same income is taxed twice.",
      "TRACK YOUR DAYS IN EACH COUNTRY: Tax residency in most countries is based on day-count thresholds (commonly around 183 days, but this varies). Keep a simple log of travel dates.",
      "FILE BOTH-COUNTRY OBLIGATIONS ON TIME: If you may owe tax filings in both countries, note both deadlines now — penalties for late filing apply even if no tax is ultimately owed.",
      "QUALIFIED ADVISER REMINDER: This checklist is planning support only. SettleMap does not provide tax or financial advice. Before making any tax residency, filing, or cross-border banking decision, consult a qualified tax adviser or accountant licensed in the relevant country.",
    ],
  };
}

// ─── Route helpers ────────────────────────────────────────────────────────────

function routeContext(origin: string, destination: string): string {
  const d = destination.toLowerCase();
  if (d.includes("uk") || d.includes("united kingdom") || d.includes("britain"))
    return `For a move from ${origin} to the UK, check your visa category (Skilled Worker, Family, Student, etc.), BRP or eVisa collection, NHS surcharge, and UKVI processing timeline. Refer to UK Visas and Immigration (UKVI) official site and UKCISA for guidance.`;
  if (d.includes("australia"))
    return `For a move from ${origin} to Australia, check your visa subclass, CoE if applicable, OSHC or OVHC health insurance, and state/territory arrival requirements. Refer to the Australian Department of Home Affairs for official guidance.`;
  if (d.includes("canada"))
    return `For a move from ${origin} to Canada, check your permit or visa type, Express Entry or LMIA where relevant, provincial health coverage waiting period, and settlement services. Refer to IRCC (Immigration, Refugees and Citizenship Canada) for official guidance.`;
  if (d.includes("germany") || d.includes("eu") || d.includes("europe"))
    return `For a move from ${origin} to Germany / the EU, check APS assessment where relevant, blocked account (Sperrkonto) if applicable, Anmeldung city registration, residence permit appointment timelines, and health insurance requirements. Refer to your German consulate or relevant EU country's official immigration authority.`;
  if (d.includes("singapore"))
    return `For a move from ${origin} to Singapore, check IPA/pass type (EP, SP, DP, LTVP, student pass), MOM requirements, accommodation near your workplace, banking setup, and SIM. Refer to ICA Singapore and MOM Singapore for official guidance.`;
  if ((d.includes("us") || d.includes("united states") || d.includes("usa")) && !d.includes("australia"))
    return `For a move from ${origin} to the US, check your visa category (H-1B, L-1, F-1, spouse visa, etc.), SEVIS if applicable, Social Security Number eligibility, state tax residency rules, and local setup requirements. Refer to USCIS and your institution or employer's HR for official guidance.`;
  if (d.includes("new zealand"))
    return `For a move from ${origin} to New Zealand, check your visa type, Accredited Employer Work Visa (AEWV) if employer-sponsored, health insurance, and settlement services. Refer to Immigration New Zealand for official guidance.`;
  return `For a move from ${origin} to ${destination}, check entry and residency requirements with your destination country's official immigration authority. Verify health insurance requirements, local registration obligations, and tax residency implications. Always confirm requirements on official government portals before acting.`;
}

function assessRiskLevel(origin: string, destination: string, whoIsMoving: string, moveReason: string): string {
  const d = destination.toLowerCase();
  const w = whoIsMoving.toLowerCase();
  const m = moveReason.toLowerCase();
  let complexity = "Low-Medium";
  const factors: string[] = [];

  if (d.includes("germany") || d.includes("eu")) { complexity = "Medium-High"; factors.push("Germany / EU involves APS assessment for some Indian degrees, blocked account, Anmeldung, health insurance proof"); }
  else if (d.includes("canada")) { complexity = "Medium"; factors.push("Canada may require LMIA, Express Entry steps, and provincial health waiting periods"); }
  else if (d.includes("australia")) { complexity = "Medium"; factors.push("Australia requires relevant visa subclass, OSHC/OVHC health insurance confirmation"); }
  else if (d.includes("uk")) { complexity = "Low-Medium"; factors.push("UK route is well-documented via UKVI — NHS surcharge, BRP or eVisa, biometric enrolment"); }

  if (w.includes("family") || w.includes("children")) factors.push("family move adds school research, dependent visa, and registration complexity");
  if (w.includes("pet")) factors.push("pet relocation adds microchip, titre test, import permit, possible quarantine — start 3–4 months early");
  if (m.includes("corporate") || m.includes("transfer")) factors.push("corporate transfer may trigger tax residency obligations in both countries — consult a qualified tax adviser");

  const factorText = factors.length > 0 ? " Specific factors: " + factors.join("; ") + "." : "";
  return `${complexity} — Check the current official processing timeline before booking irreversible travel.${factorText}`;
}

// ─── V12.12.15 section generators ─────────────────────────────────────────────

function generateExecutiveSummary(
  origin: string,
  destination: string,
  whoIsMoving: string,
  moveReason: string,
  timing: string,
  effectiveRoute: string,
): PackSection {
  return {
    title: "Your move at a glance",
    items: [
      `Route: ${effectiveRoute}`,
      `Timing: ${timing}`,
      `Who is moving: ${whoIsMoving}`,
      `Move reason: ${moveReason}`,
      "Top 5 priorities: (1) Confirm visa / permit category and processing timeline (2) Secure housing — temporary stay for arrival week, then permanent (3) Keep origin SIM active for 6 months — banking OTPs depend on it (4) Build a 90-day cash buffer — deposit + first month rent + setup + emergency reserve (5) Prepare a hand-luggage document pack: passport, visa, work/admission letter, housing confirmation",
      "Top 5 things to verify officially: (1) Visa / permit conditions and permitted activities — official immigration authority of your destination (2) Mandatory local registration deadlines and documents (3) Health insurance requirements for your visa type — check whether employer or institution provides coverage (4) Tax residency implications in both origin and destination countries — consult a qualified tax adviser (5) Bank account requirements for your specific visa or residency status",
      "Top 5 things to do this week: (1) Check the official visa processing timeline for your category (2) Research at least 2 housing options in your destination neighbourhood (3) Confirm your origin SIM will stay active for 6+ months (4) Build a 90-day budget estimate with a named emergency buffer (5) Prepare your document checklist and scan originals to a secure cloud folder",
      `Planning complexity: ${assessRiskLevel(origin, destination, whoIsMoving, moveReason)}`,
    ],
  };
}

function getWhyThisPackIsUseful(): PackSection {
  return {
    title: "Why this pack is useful",
    items: [
      "It turns your move into a practical action plan.",
      "It separates planning guidance from official-source verification.",
      "It gives worksheets you can copy into Google Sheets or Excel.",
      "It gives provider questions and scripts so you do not start from a blank page.",
      "It helps families, students, and solo movers align on documents, money, and emergency contacts.",
    ],
  };
}

function getAfterReceivingChecklist(): PackSection {
  return {
    title: "What to do after receiving this pack",
    items: [
      "Save this email.",
      "Copy the budget worksheet into Google Sheets or Excel.",
      "Complete the document tracker.",
      "Verify official requirements.",
      "Send 2 to 3 provider questions using the scripts.",
      "Share the family handover or relevant persona section if applicable.",
      "Send feedback using the pilot feedback link: https://settlemap.app/pilot-feedback",
    ],
  };
}

function generateNext7Actions(origin: string, destination: string, moveReason: string): PackSection {
  const d = destination.toLowerCase();
  const visaAuth = d.includes("uk")
    ? "gov.uk/visas-immigration (UKVI)"
    : d.includes("australia")
    ? "homeaffairs.gov.au (Department of Home Affairs)"
    : d.includes("canada")
    ? "canada.ca/immigration (IRCC)"
    : d.includes("germany") || d.includes("eu")
    ? "German consulate website for your origin country"
    : d.includes("singapore")
    ? "mom.gov.sg (MOM) and ica.gov.sg (ICA)"
    : d.includes("us") || d.includes("united states")
    ? "uscis.gov and travel.state.gov (US Embassy)"
    : "your destination country's official immigration authority website";
  const m = moveReason.toLowerCase();
  const isCorporate = m.includes("corporate") || m.includes("transfer") || m.includes("employer");
  return {
    title: "Next 7 actions — start here",
    items: [
      `1. [VISA / PERMIT] Check the official processing timeline for your visa or permit category. Why it matters: Visa approval is the hard dependency — your start date, housing, and school plans all follow from it. Owner: You${isCorporate ? " + HR / employer" : ""}. Time: 30–45 min. Verify on: ${visaAuth}`,
      `2. [${isCorporate ? "EMPLOYER / HR" : "DESTINATION SETUP"}] ${isCorporate ? "Get written confirmation of your relocation package: what is covered, claim process, and deadlines. Why it matters: Verbal promises are not enforceable — package details must be in writing before you commit to a move date." : "Research your destination neighbourhood — proximity to workplace, schools, transport, and healthcare. Why it matters: Location decisions are hard to reverse once you have signed a lease."} Owner: You${isCorporate ? " + HR" : ""}. Time: 1 hr. Verify on: ${isCorporate ? "Your employer HR directly — in writing" : "Local property platforms and Google Maps"}.`,
      "3. [HOUSING] Contact 2–3 housing agents or platforms. Request availability for your arrival month. Do not commit to a lease before viewing in person. Why it matters: Good rental properties near workplaces and international schools fill quickly for peak months. Owner: You. Time: 1–2 hrs. Verify on: Local property listing sites and, if applicable, company relocation resources.",
      `4. [SIM / OTP] Do not cancel your ${origin} SIM or origin number. Keep it active for at least 6 months after arrival. Why it matters: Banking OTPs from your origin bank are sent to your registered mobile — losing the number can lock you out of internet banking. Owner: You. Time: 5 min (call your carrier). Verify on: Your mobile carrier.`,
      "5. [BANKING] Research bank account or expat account options at your destination for your visa or permit type. Why it matters: Requirements vary by visa — knowing what documents to bring prevents account opening delays. Owner: You. Time: 20 min. Verify on: Official bank websites — expat or international account pages specifically.",
      "6. [BUDGET] Build a 90-day budget: temporary stay + deposit + first month rent + SIM + transport + food + insurance + setup costs + emergency buffer. Why it matters: The first 90 days of a relocation are always higher-cost than steady state — underbudgeting is the most common planning mistake. Owner: You + family. Time: 45 min. Verify: Cross-check costs with current residents or online expat forums for your destination city.",
      "7. [DOCUMENTS] Create a document checklist and scan all originals to a secure cloud folder shared with one trusted family member. Why it matters: A cross-border move with lost or missing documents on arrival can delay housing, banking, employment, and registration. Owner: You. Time: 30–45 min. Verify on: Your employer, institution, or destination country's official immigration authority arrival guide.",
    ],
  };
}

function getOfficialSourceChecklist(origin: string, destination: string): PackSection {
  const d = destination.toLowerCase();
  const immigrationLink = d.includes("uk")
    ? "Search: 'UKVI visa official' — gov.uk/visas-immigration"
    : d.includes("australia")
    ? "Search: 'Australian visa official Department of Home Affairs' — homeaffairs.gov.au"
    : d.includes("canada")
    ? "Search: 'IRCC permit Canada official' — canada.ca/immigration"
    : d.includes("germany") || d.includes("eu")
    ? "Search: 'German visa official' — check your German consulate for your origin country, or relevant EU immigration authority"
    : d.includes("singapore")
    ? "Search: 'Singapore work pass MOM official' — mom.gov.sg or ica.gov.sg"
    : d.includes("us") || d.includes("united states")
    ? "Search: 'USCIS visa official' — uscis.gov and travel.state.gov"
    : "Search: '[destination country] visa official immigration authority'";
  return {
    title: "Official-source verification checklist",
    items: [
      `IMMIGRATION AUTHORITY — verify on official website: Visa or permit category, conditions, permitted activities, stay duration, reporting requirements, and renewal timeline. ${immigrationLink}`,
      "EMPLOYER / INSTITUTION — verify directly in writing: Start date rules (some visas prohibit starting work before permit is issued), relocation package details, health insurance start date, and HR contact at destination.",
      "HOUSING PROVIDER — verify on official listing or provider website: Lease terms, deposit amount and return conditions, what is included in rent (utilities, internet), notice period, and guarantor requirements for visa holders.",
      "BANK — verify on official bank website: Account eligibility for your visa or permit type, documents required to open (some require a local address or employer letter), fees, and international transfer options.",
      "HEALTH INSURANCE / HEALTHCARE — verify on official provider or institution website: Whether your visa requires mandatory health insurance, what your employer's group plan covers and excludes, when coverage starts (watch for waiting periods), and how to make a claim.",
      "SIM / TELECOM — verify on official telecom provider website: Prepaid SIM availability, whether a local bank account is required to purchase, eSIM availability for pre-arrival activation, and international call options to your origin country.",
      `LOCAL REGISTRATION — verify on official government portal: Whether mandatory address registration applies in your destination (Anmeldung in Germany, ICA address update in Singapore, IRCC address update in Canada, etc.), the deadline, required documents, and penalties for late registration.`,
      `CONSULATE / EMERGENCY — find the ${origin} consulate or high commission in your destination city. Save the address, main phone number, and emergency line before departure. Search mea.gov.in for Indian missions, or your home country's foreign affairs ministry.`,
    ],
  };
}

function getPremiumRouteResearchPrompts(origin: string, destination: string, moveReason: string): PackSection {
  return {
    title: "Route research links and search prompts",
    items: [
      `Official immigration prompt: search "${destination} ${moveReason} visa permit official government" and open only government or official immigration pages first.`,
      `Employer / institution prompt: search "${destination} relocation arrival checklist official ${moveReason}" and compare findings with your employer, HR, or institution in writing.`,
      `Housing prompt: search "${destination} rental deposit rules official tenancy guidance" before contacting private agents or platforms.`,
      `Banking prompt: search "${destination} bank account documents for new residents official bank" and note exact documents needed for your visa or permit type.`,
      `Healthcare prompt: search "${destination} health insurance new residents official" and verify start dates, waiting periods, and exclusions directly with official or provider sources.`,
      `Consulate prompt: search "${origin} consulate ${destination} official" and save the nearest mission contact before departure.`,
      "SettleMap reference links: https://settlemap.app/reference-links — use this as a starting map, not as a substitute for official sources.",
      "Provider research prompt: compare at least two providers for housing, moving/shipping, SIM, banking, insurance, school/childcare, and pet relocation where relevant. SettleMap does not recommend or endorse specific providers.",
    ],
  };
}

function getPremiumBudgetTable(): PackTableSection {
  return {
    title: "Budget starter worksheet — fill in as you research",
    headers: ["Category", "Estimate", "Actual", "Notes", "Verification needed"],
    rows: [
      ["Visa / permit fees", "", "", "", "Official immigration authority"],
      ["Flights (all travellers)", "", "", "", "Airline / booking platform"],
      ["Temporary stay (arrival 2–4 wks)", "", "", "", "Booking platform / company housing"],
      ["Security deposit (1–2 months rent)", "", "", "", "Ask housing provider"],
      ["First month rent", "", "", "", "Ask housing provider"],
      ["Moving / shipping", "", "", "", "Get 2–3 quotes minimum"],
      ["SIM / internet (monthly)", "", "", "", "Local telecom website"],
      ["Transport (monthly passes)", "", "", "", "Local transport authority"],
      ["Food / essentials (monthly)", "", "", "", "Expat forums for your destination city"],
      ["Health insurance (if not employer-provided)", "", "", "", "Insurance provider / institution"],
      ["School / childcare (if applicable)", "", "", "", "School directly"],
      ["Pet relocation costs (if applicable)", "", "", "", "Vet + IATA-certified agent"],
      ["Setup costs (furniture, bedding, kitchen)", "", "", "", "Local supermarket / marketplace"],
      ["Emergency buffer — do not spend", "", "", "8–12 weeks of living costs minimum", "Your own calculation"],
    ],
    note: "Fill in Estimate and Actual columns as you research. Copy into Google Sheets or Excel to track real spending against budget.",
  };
}

function getPremiumDocumentTracker(): PackTableSection {
  return {
    title: "Document tracker",
    headers: ["Document", "Needed for", "Owner", "Status", "Where to verify", "Notes"],
    rows: [
      ["Passport (all travellers)", "All entry, banking, registration", "Each person", "", "Passport authority", "Valid 6+ months beyond stay for all"],
      ["Visa / permit document", "Entry, employer, bank, housing", "You", "", "Official immigration authority", "Check conditions and expiry"],
      ["Work or admission letter", "Entry, banking, housing, registration", "You", "", "Employer / institution", "Carry original — not scan only"],
      ["Accommodation confirmation", "Arrival, registration", "You", "", "Housing provider", "Check-in date + landlord contact"],
      ["Medical records / vaccination cards", "Healthcare, school enrolment", "All family", "", "Your GP / doctor", "For children: school may require proof"],
      ["Doctor letter (if on medication)", "Customs, pharmacy", "Affected person + Doctor", "", "Your GP", "List medications by generic name"],
      ["School records (children)", "School enrolment", "Parent + child", "", "Previous school", "Transcripts, certificates, assessments"],
      ["Pet documents (if applicable)", "Customs, quarantine, airline", "You", "", "Vet + official vet authority", "Microchip cert, vaccination, import permit"],
      ["Emergency contacts page", "Safety", "All family", "", "N/A — you create this", "Print A4, carry in hand luggage"],
      ["Relocation package letter (corporate)", "Reimbursement claims", "You", "", "HR in writing", "Keep original with receipts"],
    ],
    note: "Add rows for route-specific documents (GIC / LOA for Canada, blocked account for Germany, CoE for Australia, SEVIS for US, etc.).",
  };
}

function getPremiumProviderWorksheet(): PackTableSection {
  return {
    title: "Provider comparison worksheet",
    headers: ["Category", "Question to ask", "Answer", "Cost", "Risk note", "Decision"],
    rows: [
      ["Housing", "Deposit, return conditions, and notice period?", "", "", "Avoid if deposit terms are unclear", ""],
      ["Housing", "Guarantor required for visa holder / non-citizen?", "", "", "May require company letter or higher deposit", ""],
      ["Mover / shipping", "What is included in the quote?", "", "", "Get 2–3 quotes — check insurance coverage", ""],
      ["Mover / shipping", "What items are restricted or prohibited?", "", "", "Check against customs rules for destination", ""],
      ["Bank", "Account eligibility for my visa or permit type?", "", "", "Bring all required docs to appointment", ""],
      ["Bank", "Can I open online before arrival?", "", "", "Pre-registration saves arrival-day time", ""],
      ["SIM", "Prepaid SIM without local bank account?", "", "", "Prepaid is safest in first 1–2 months", ""],
      ["Insurance", "What is excluded from health cover?", "", "", "Read policy document — not just sales summary", ""],
      ["School / childcare", "Enrolment vacancies for my child's age?", "", "", "Check deadlines and required documents", ""],
      ["Pet agent (if applicable)", "IATA-certified and licensed for my route?", "", "", "Only use IATA-certified agents for pets", ""],
    ],
    note: "SettleMap does not recommend or endorse any specific provider. Verify credentials, licensing, and suitability directly before engaging.",
  };
}

function getPremiumCopyPasteScripts(_origin: string, _destination: string): PackSection {
  return {
    title: "Copy-paste scripts — ready to use",
    items: [
      `HOUSING ENQUIRY (email or agent): "Hi, I am moving from [origin] to [destination] in [month] and looking for a [flat/house] in [area] for [number of people]. Could you confirm: (1) Deposit amount and return conditions (2) What is included in the rent — utilities, internet, parking? (3) Minimum notice period (4) Whether there is a guarantor requirement for [visa type] holders. Thank you."`,
      `MOVER / SHIPPING QUOTE (email): "I am moving from [origin] to [destination] in [month]. Estimated volume: [X boxes / cubic metres / number of rooms]. Could you provide a quote covering: (1) Packing service if available (2) Door-to-door transit time (3) Insurance included in the quote (4) Customs clearance assistance and any items you cannot ship. I will compare 2–3 quotes before deciding. Thank you."`,
      `BANK ENQUIRY (email or branch prep): "I am relocating to [city] in [month] on a [visa/permit type]. Could you let me know: (1) What documents are required to open an account for my status (2) Whether there is a no-fee account for new arrivals or international residents (3) Whether I can start the application online before arrival (4) How long account opening takes. Thank you."`,
      `SIM / eSIM ENQUIRY: "I am arriving in [city] in [month]. Could you confirm: (1) Whether a prepaid SIM is available without a local bank account (2) Data allowance and monthly cost (3) International calls to [origin country] — included or add-on? (4) Whether an eSIM can be activated before arrival. Thank you."`,
      `INSURANCE ENQUIRY (email): "I am moving from [origin] to [destination] in [month] with [family details if applicable]. Could you confirm: (1) What is covered and excluded from the health plan (2) Whether pre-existing conditions are covered (3) Whether dependants are included (4) The claims process and reimbursement timeline (5) Whether there is a waiting period before coverage starts. Thank you."`,
      `CORPORATE HR — RELOCATION PACKAGE (internal email): "I am confirming the details of my relocation support for my move from [origin] to [destination]. Could you confirm in writing: (1) The total allowance and what is covered vs what requires pre-approval (2) The reimbursement process and submission deadline (3) Whether temporary accommodation is arranged or self-managed (4) The local HR contact at the destination office. Thank you."`,
      `SCHOOL / CHILDCARE ENQUIRY (if applicable): "I am relocating to [city] in [month] with a child aged [age]. Could you let me know: (1) Whether there are enrolment vacancies (2) The enrolment deadline and required documents (3) Language of instruction and any language support for international students (4) Registration fees and term cost. Thank you."`,
      `PET RELOCATION ENQUIRY (if applicable): "I am moving from [origin] to [destination] in [month] with a [dog/cat/other]. I need support with: import permit application, quarantine arrangements if required, and airline cargo booking. Could you confirm the process, timeline, and all-in estimated cost? I will only use IATA-certified agents. Thank you."`,
      "SCRIPT POLICY: These are neutral research templates only. SettleMap does not recommend or endorse specific providers. Verify credentials, pricing, licensing, and suitability independently before engaging any provider.",
    ],
  };
}

function getPremiumQualityGateFooter(): PackSection {
  return {
    title: "Quality gate footer — planning support only",
    items: [
      "PLANNING SUPPORT ONLY: SettleMap is a planning and research tool. It does not provide immigration, legal, tax, financial, property, insurance, medical, school admission, or government advice.",
      "VERIFY OFFICIAL SOURCES: All requirements, deadlines, and costs must be verified directly on official government, employer, institution, or provider websites before you act on them.",
      "NO SENSITIVE DOCUMENT UPLOAD: SettleMap does not require or accept passport numbers, visa numbers, bank account details, medical records, or ID document uploads at any point.",
      "DO NOT SEND SENSITIVE DATA: Do not send passport numbers, visa numbers, bank details, medical details, or ID documents to SettleMap.",
      "SUPPORT: Questions about your pack or the SettleMap service — email support@settlemap.app. We respond within 2 business days.",
      "PACK VERSION: V12.12.17 — Paid Email Content Completeness",
    ],
  };
}

// ── Module keys ───────────────────────────────────────────────────────────────

type ModuleKey = "family" | "couple" | "solo" | "corporate" | "returning" | "pet" | "student";

function parseModules(modules: string | null | undefined): Set<ModuleKey> {
  if (!modules) return new Set();
  const valid: ModuleKey[] = ["family", "couple", "solo", "corporate", "returning", "pet", "student"];
  const result = new Set<ModuleKey>();
  for (const m of modules.split(",").map((s) => s.trim().toLowerCase() as ModuleKey)) {
    if (valid.includes(m)) result.add(m);
  }
  return result;
}

// ── Persona module content ────────────────────────────────────────────────────

const PERSONA_MODULES: Record<ModuleKey, PackSection> = {
  family: {
    title: "Family move module",
    items: [
      "SCHOOL RESEARCH: Start school research 3–4 months before arrival. Check school year calendar, enrollment deadlines, and catchment area rules for your destination. Do not assume enrollment — confirm directly with the school or local education authority.",
      "CHILDCARE: Research childcare options if applicable — government-subsidised vs private, registration waitlists (can be 3–6 months), and cost range for your destination city.",
      "FAMILY BANKING: Open a joint or family account if preferred. Check if your destination allows dependants to hold accounts as minors. Compare accounts with no monthly fee and low international transfer charges.",
      "FAMILY HEALTHCARE: Register all family members with a local GP or health centre within the first two weeks. Check if child vaccinations need updating or re-recording for school enrollment.",
      "DEPENDENT PASS / VISA: If moving with dependants on your pass or visa, confirm what rights dependants have (work, study, healthcare). Check renewal and extension rules. Refer to official immigration authority.",
      "FAMILY EMERGENCY PLAN: Before departure, share with all family members: local emergency number (varies by country), nearest hospital, Indian/home consulate address and number, and a trusted local contact if any.",
    ],
  },
  couple: {
    title: "Couple move module",
    items: [
      "VISA AND DEPENDENCY: Check whether one partner is on a dependent or spouse visa and what work or study rights that entails. Refer to the official immigration authority for specific rights — do not assume.",
      "JOINT FINANCES: Decide before arriving whether to open a joint account or maintain separate accounts at the same bank. Some banks allow joint accounts on different visa types — verify eligibility.",
      "SHARED HOUSING: When viewing rental properties, confirm both names can be on the lease or whether a guarantor is required. Check deposit rules for joint tenants.",
      "EMPLOYMENT RIGHTS: If one partner is on a dependent visa, check whether a work permit or separate authorisation is required before starting any paid work.",
      "SOCIAL NETWORK: Building a network in a new country takes time. Look for expat groups, community organisations, or professional networks specific to your industry or home country for the first few months.",
    ],
  },
  solo: {
    title: "Solo mover module",
    items: [
      "SAFETY AND CONTACTS: Before departure, share your local address, workplace address, local SIM number, and nearest consulate contact with family or a trusted person at home.",
      "SOLO BUDGET BUFFER: Solo movers carry the full cost alone — keep at least 8–12 weeks of living costs as an emergency reserve, not the typical 4–6 week buffer.",
      "FIRST WEEK NETWORK: Find your nearest community centre, expat group, or professional network in your destination city in advance. Having one familiar contact from day one reduces isolation risk significantly.",
      "ACCOMMODATION SAFETY: For solo movers, prioritise well-reviewed and secure accommodation for the first 2–4 weeks even if it costs more. Do not commit to a 6–12 month lease before you have visited and assessed the area.",
      "HEALTHCARE SELF-REGISTRATION: Register with a local GP or health centre in your first week. As a solo mover there is no one to assist in a medical situation — having a registered local GP is essential.",
    ],
  },
  corporate: {
    title: "Corporate transfer module",
    items: [
      "EMPLOYER RELOCATION ALLOWANCE: Confirm your relocation package details before departure — what is covered (flights, temporary accommodation, shipping, setup costs), the claim process, and any reimbursement deadlines.",
      "WORK PASS AND VISA: Your employer or HR should sponsor or support the work pass application. Confirm start date rules — in some countries you cannot start work before the pass is issued. Refer to official immigration authority.",
      "TAX RESIDENCY IMPLICATIONS: A cross-border corporate transfer may trigger tax residency obligations in both origin and destination countries. Consult a qualified tax adviser before moving — do not rely on HR alone.",
      "RELOCATION EXPENSE TRACKER: Keep receipts and records of all relocation expenses — flights, shipping, accommodation, setup costs — even if your employer covers them. Some may be tax-deductible or reimbursable.",
      "CORPORATE HEALTH INSURANCE: Confirm whether your employer's group policy covers dependants and whether it starts on day one of employment or after a waiting period. Arrange independent cover for any gap.",
      "HR CHECKLIST TO REQUEST: Written confirmation of your package, visa sponsorship timeline, local payroll setup date, accommodation support if any, and local HR contact at destination office.",
    ],
  },
  returning: {
    title: "Returning home module",
    items: [
      "RE-ENTRY PERMIT OR STATUS: If you have been abroad for an extended period, check your home country re-entry rules, passport validity requirements, and any permit or status you need to reactivate. Refer to the official immigration authority.",
      "BANKING REACTIVATION: Dormant accounts may have been closed or frozen. Contact your home bank before returning to reactivate accounts, update KYC, and restore access to mobile and internet banking.",
      "TAX FILING STATUS: Returning to your home country may change your tax residency status. Consult a tax adviser to understand filing obligations in both countries — particularly if you have foreign income or assets.",
      "LOCAL ID AND DOCUMENTS: Driving licence, local ID card, voter registration, and other local documents may have lapsed. Check renewal requirements and timelines before arrival.",
      "PROPERTY AND RENTAL: If you own property in your home country, notify your bank or property manager in advance. If renting, check lease availability in your preferred area 2–3 months before return.",
      "SOCIAL SECURITY / CPF / PROVIDENT FUND: If your home country has a social security or provident fund contribution system, check your status, any refunds processed while abroad, and how to resume contributions.",
    ],
  },
  pet: {
    title: "Pet relocation module",
    items: [
      "MICROCHIP: Confirm your pet has an ISO-compliant microchip (15-digit). This is mandatory for most international pet moves. Check destination requirements — some countries require microchipping before rabies vaccination.",
      "VACCINATIONS: Check your destination country's required vaccinations, specific vaccine brands or types accepted, and timing (some require vaccination 21+ days before travel, others longer). Verify with the official veterinary authority of your destination.",
      "RABIES TITRE TEST: Many countries require a rabies titre (antibody) blood test after vaccination, with a mandatory waiting period (30 days to 6 months depending on destination). Start this process early — it is a common bottleneck.",
      "IMPORT PERMIT: Check whether your destination country requires an import permit for pets. Apply early — processing can take 4–12 weeks. Refer to the official government veterinary or customs authority.",
      "QUARANTINE RULES: Some countries require mandatory quarantine regardless of vaccination status. Check exact quarantine duration, approved facilities, and cost before confirming your travel date.",
      "AIRLINE AND CARGO: Check your airline's pet policy — in-cabin, checked baggage, or cargo freight. Airline rules change frequently. Book early and confirm with the airline directly. For cargo, use IATA-certified pet carriers.",
      "VET HEALTH CERTIFICATE: Most destinations require an official health certificate signed by a licensed vet, often issued within 7–10 days of travel. Check if it needs endorsement by your origin country's official veterinary authority.",
      "PET SCRIPTS: See provider research scripts for a pet relocation enquiry script you can use when contacting pet relocation agents or veterinary authorities.",
    ],
  },
  student: {
    title: "Student add-on module",
    items: [
      "STUDENT VISA OR PASS: If a student is moving as part of the family or independently, check student visa requirements, CoE or admission letter requirements, and university reporting obligations separately from the main visa. Refer to the official immigration authority.",
      "STUDENT BANKING: Many student accounts offer no-fee options and may require different documentation than adult accounts. Research student-specific accounts at major banks in your destination city.",
      "STUDENT SIM: Some telecom providers offer student-specific plans with discounted rates. Check with the student union or campus services — they often negotiate discounts.",
      "CAMPUS REGISTRATION: Confirm orientation dates, student ID collection process, and international student office contact. Bring passport, visa/entry document, and admission letter on day one.",
      "STUDENT HEALTH COVER: Confirm whether the institution includes health coverage for the student, what is excluded, and whether supplementary insurance is recommended.",
    ],
  },
};

// ── Main generator ────────────────────────────────────────────────────────────

export function generatePremiumRelocationPack(meta: PremiumPackMetadata): PremiumRelocationPack {
  const origin = meta.origin?.trim() || "Your origin";
  const destination = meta.destination?.trim() || "your destination";
  const timing = meta.timingMonth || "your planned move date";
  const whoIsMoving = meta.whoIsMoving || "you and your household";
  const moveReason = meta.moveReason || "relocation";
  const modules = parseModules(meta.modules);
  const effectiveRoute = `${origin} to ${destination}`;

  if ((meta.whoIsMoving ?? "").toLowerCase().includes("corporate")) modules.add("corporate");
  if ((meta.whoIsMoving ?? "").toLowerCase().includes("return")) modules.add("returning");
  if ((meta.whoIsMoving ?? "").toLowerCase().includes("family")) modules.add("family");
  if ((meta.whoIsMoving ?? "").toLowerCase().includes("couple")) modules.add("couple");
  if ((meta.whoIsMoving ?? "").toLowerCase().includes("solo")) modules.add("solo");

  const routeSummary = routeContext(origin, destination);

  const routeSnapshot: PackSection = {
    title: "Your move snapshot",
    items: [
      `Route: ${effectiveRoute}`,
      `Move reason: ${moveReason}`,
      `Who is moving: ${whoIsMoving}`,
      `Planned timing: ${timing}`,
      `Route context: ${routeSummary}`,
      "Main focus areas: Use this pack to work through checklists, budget, documents, and first-week setup in the order that fits your timeline.",
      "Planning support only — verify all official requirements directly with the relevant immigration authority, employer, institution, or government portal.",
    ],
  };

  const detailedChecklist: PackSection = {
    title: "Detailed move checklist",
    items: [
      "BEFORE DECIDING: Research cost of living in your destination city — rent, groceries, transport, childcare, healthcare. Compare to your current costs.",
      "BEFORE DECIDING: Check visa or permit eligibility for your specific situation — do not assume. Refer to the official immigration authority of your destination country.",
      "BEFORE DECIDING: Confirm employment contract, start date, and any relocation support in writing before committing to a move date.",
      "90–60 DAYS BEFORE: Apply for visa or permit. Start early — processing times vary from 2 weeks to 6 months. Check official processing timeline on the immigration authority website.",
      "90–60 DAYS BEFORE: Research housing in your destination — neighbourhoods, rental range, proximity to workplace or school. Contact 2–3 agents or platforms for availability.",
      "90–60 DAYS BEFORE: Begin school or childcare research if applicable. Check enrollment deadlines and catchment areas.",
      "90–60 DAYS BEFORE: Start pet relocation process if applicable — microchip, vaccinations, import permit, quarantine rules.",
      "90–60 DAYS BEFORE: Notify your current landlord, employer, bank, insurance, and utility providers of your move date and last day of service.",
      "60–30 DAYS BEFORE: Book flights. Confirm flight dates align with visa validity — some visas require you to enter within a fixed window.",
      "60–30 DAYS BEFORE: Arrange temporary accommodation for arrival — at least 2 weeks while you view permanent options in person.",
      "60–30 DAYS BEFORE: Research health insurance for your destination — check whether employer or institution provides it, and when coverage starts.",
      "60–30 DAYS BEFORE: Keep your origin SIM active for at least 6 months — banking OTPs rely on it. Arrange destination SIM plan for arrival week.",
      "60–30 DAYS BEFORE: Confirm international card access — test a small transaction from a travel account or enable your debit card for overseas use.",
      "60–30 DAYS BEFORE: Sort packing — bring essentials, ship or store non-essentials. Decide what to sell, donate, or put in storage.",
      "30–7 DAYS BEFORE: Do a full document check — passport validity (6 months minimum beyond visa), visa, work/admission letter, housing confirmation, insurance, emergency contacts.",
      "30–7 DAYS BEFORE: Sort pet export paperwork and vet health certificate if applicable. Confirm airline cargo booking.",
      "30–7 DAYS BEFORE: Transfer an initial fund to destination or confirm you have access to funds on arrival (cash or card).",
      "30–7 DAYS BEFORE: Notify family of your local address, new SIM number, and emergency contact on arrival.",
      "30–7 DAYS BEFORE: Download offline maps, transport apps, and banking apps for your destination before leaving.",
      `FINAL WEEK: Confirm accommodation check-in details, arrival contact, and timing.`,
      "FINAL WEEK: Carry all critical documents in hand luggage — do not put passport, visa, or admission letter in checked bags.",
      "FINAL WEEK: Carry prescription medicines with a doctor letter. Bring at least 4 weeks' supply in hand luggage.",
      "FINAL WEEK: Inform your current bank of your travel dates to avoid card blocks on arrival.",
      "TRAVEL DAY: Keep travel documents, phone, charger, and 2–3 days of medication in your carry-on. Check flight status and boarding requirements 24 hours in advance.",
      "TRAVEL DAY: Save offline: accommodation address, arrival emergency contact, and local transport options from airport.",
      "FIRST 7 DAYS: Get a local SIM or activate eSIM — data is essential from day one.",
      "FIRST 7 DAYS: Check into your accommodation, confirm rental agreement terms, and get the landlord contact saved.",
      "FIRST 7 DAYS: Buy household essentials. Note what is provided — do not over-buy before confirming what comes with the property.",
      "FIRST 7 DAYS: Set up local transport — research daily/weekly/monthly pass options.",
      "FIRST 7 DAYS: Register at your employer, institution, or local authority as required. Bring passport, visa/entry document, and address proof.",
      "FIRST 7 DAYS: Open a local bank account or confirm your international account works for daily expenses.",
      "FIRST 7 DAYS: Register with a GP or health centre — do not wait until you are unwell.",
      "FIRST 7 DAYS: Save emergency contacts — local emergency number (varies by country), nearest hospital, nearest home consulate or high commission.",
      "FIRST 30 DAYS: Complete any mandatory registration — address registration (Anmeldung in Germany, IRCC in Canada, ICA in Singapore, etc.) within the required deadline. Check your destination's specific rule.",
      "FIRST 30 DAYS: Set up international transfer for home remittances — compare Wise, Revolut, bank transfer, or local equivalent for fees and rates.",
      "FIRST 30 DAYS: Finalise school or childcare enrolment if applicable.",
      "FIRST 30 DAYS: Confirm health insurance is active and you know the claims process.",
      "FIRST 30 DAYS: Track spending vs budget — adjust if early expenses exceed estimate.",
      "LONG TERM SETTLING: Renew or extend visa/permit before expiry — check renewal timeline and eligibility 3–4 months in advance.",
      "LONG TERM SETTLING: File tax returns for both origin and destination if required. Consult a qualified tax adviser.",
      "LONG TERM SETTLING: Review insurance, banking, and service contracts at the 6-month mark.",
      "LONG TERM SETTLING: Build a local support network — professional, social, and community contacts.",
      "LONG TERM SETTLING: Plan your first trip home — check re-entry requirements and any advance permissions needed for your visa status.",
    ],
  };

  const budgetTemplate: PackSection = {
    title: "Budget template — first 90 days",
    items: [
      "TEMPORARY STAY (arrival 1–4 weeks): Budget for a serviced apartment, extended stay hotel, or short-term rental. Cost varies widely — research your destination city specifically. This is often the single largest upfront expense.",
      "RENTAL DEPOSIT: Typically 1–2 months' rent payable before or on move-in. Confirm whether the deposit is refundable and the return conditions.",
      "FIRST MONTH RENT: Payable upfront or on move-in day. Confirm exact amount and payment method with your landlord before arrival.",

      "MOVING AND SHIPPING: Get 2-3 quotes. Costs depend on volume, distance, and transit time. Air freight is fast but expensive; sea freight is cheaper for large volumes. Factor in customs duty for high-value items.",
      "INSURANCE: Health insurance (if not employer-provided), renters insurance (recommended for contents), and travel insurance for the move period. Compare premiums and exclusions before purchasing.",
      "SIM AND INTERNET: Monthly SIM plan plus home broadband setup. Research whether your accommodation includes broadband — many rentals do not.",
      "TRANSPORT: Monthly pass vs pay-per-use. Research student, senior, or employer discount cards for your city.",
      "FOOD AND FIRST WEEK ESSENTIALS: Budget for eating out or takeaway during the first week before you set up a kitchen. Then estimate weekly grocery costs for your household size.",
      "SCHOOL OR CHILDCARE (if applicable): Registration fees, term fees, uniform or materials. Check whether government subsidies or employer contributions apply.",
      "PET COSTS (if applicable): Import permit fees, quarantine (if required), vet health certificate, cargo fees, crate, and first vet visit at destination.",
      "SETUP COSTS: Bedding, kitchen basics, cleaning supplies, adaptor, and any furniture not provided by your accommodation.",
      "EMERGENCY BUFFER: Keep a minimum of 8-12 weeks of total living costs as an untouched emergency reserve. This covers job gap, delayed deposit return, or unexpected medical cost.",
      "CURRENCY TRANSFER STRATEGY: Compare Wise, Revolut, your bank's international wire, or a specialist FX broker. Check rates and fees for your currency pair. Transfer in tranches if rates are volatile rather than one large transfer.",
      "BUDGET TRACKING NOTE: Track actual spend vs estimate weekly for the first 60 days. Adjust the categories above with real numbers once you are on the ground.",
    ],
  };

  const documentTracker: PackSection = {
    title: "Document tracker (detail)",
    items: [
      "PASSPORT: Check validity — must be valid for at least 6 months beyond your intended stay in most destinations. Renew before applying for a visa if close to expiry. Carry original + digital scan in a secure cloud folder.",
      "VISA OR STATUS DOCUMENT: Your visa sticker, entry vignette, or approval letter. Know your visa type, permitted stay duration, and conditions. Carry a printed copy.",
      "EMPLOYMENT OR ADMISSION LETTER: Signed offer letter or admission confirmation from your employer or institution. Carry original. Used for banking, housing, and registration.",
      "HOUSING DOCUMENTS: Signed lease or rental agreement, landlord contact, and accommodation confirmation for arrival. If staying in temporary accommodation, keep the booking confirmation.",
      "MEDICAL AND VACCINATION RECORDS: Personal health record, vaccination card or book (especially for children), and a list of any ongoing prescriptions with generic names (not just brand names).",
      "SCHOOL RECORDS (if applicable): Academic transcripts, school leaving certificate, report cards, and any standardised test results for school-age children.",
      "PET DOCUMENTS (if applicable): Microchip certificate, vaccination record, rabies titre test result, import permit, quarantine booking confirmation, and vet health certificate.",
      "BANKING AND TAX DOCUMENTS: Bank statements (last 3-6 months), proof of funds if required for visa, home country tax ID, and employer payslips if used for proof of income.",
      "IDENTITY DOCUMENTS: Birth certificate, marriage certificate (if applicable), and national ID card. Keep certified copies — originals rarely need to leave your secure folder.",
      "EMERGENCY CONTACTS PAGE: One printed A4 page with: your home consulate or high commission address and number, local emergency services number, employer HR contact, landlord contact, nearest hospital, and family contact in home country.",
      "ORIGINALS TO CARRY IN HAND LUGGAGE: Passport, visa/entry document, admission or employment letter, accommodation confirmation, pet travel documents (if applicable), and emergency contacts page. Never put these in checked baggage.",
      "SECURE BACKUP: Scan all key documents to a password-protected cloud folder (Google Drive, iCloud, etc.) shared with one trusted family member. This is your recovery option if documents are lost.",
    ],
  };

  const firstWeekPlan: PackSection = {
    title: "First week setup plan",
    items: [
      "DAY 1 -- SIM / eSIM: Get a local SIM or activate a pre-ordered eSIM at the airport or nearest telecom store. Data is essential from arrival. Prepaid is safer for the first month while you assess plans.",
      "DAY 1-2 -- MONEY AND BANKING: Confirm your international card works for local ATM and card payments. If not, use a spare card or cash buffer. Open a local bank account as soon as you have an address — some banks accept a temporary accommodation letter.",
      "DAY 1-2 -- TRANSPORT: Get a local transit card or research the app for your city's transport system. Check whether a monthly pass makes financial sense from week one.",
      "DAY 2-3 -- GROCERIES AND HOUSEHOLD ESSENTIALS: Buy 1-2 weeks of basics. Check whether your accommodation has cooking facilities and what is provided — do not over-buy.",
      "DAY 3-5 -- HEALTHCARE / CLINIC REGISTRATION: Register with a local GP or health centre before you need medical help. Bring your passport and proof of address or accommodation. If you take regular medication, ask about repeat prescriptions at your first visit.",
      "DAY 1-3 -- HOUSING CHECK-IN: Confirm check-in details with your landlord or accommodation provider. Document the property condition with photos on arrival day — this protects your deposit.",
      "DAY 3-5 -- EMPLOYER, UNIVERSITY, OR SCHOOL CHECK-IN: Complete any mandatory registration with your employer, institution, or local authority within the required deadline. Bring original documents.",
      "DAY 5-7 -- ADDRESS UPDATE: Update your address with: your bank, insurance provider, any government registrations (e.g., tax, social security), and family at home.",
      "THROUGHOUT -- EMERGENCY CONTACTS: Save to your phone: local emergency services number, nearest hospital address, home consulate or high commission, employer HR contact, and landlord.",
      "WEEK 1 SAFETY NOTE: Do not commit to long-term contracts (gym, internet, mobile plan) in week one unless you are certain of your address and duration of stay. One month of flexible arrangements is worth the extra cost.",
    ],
  };

  const personaModules: PackSection[] = [];
  const moduleOrder: ModuleKey[] = ["couple", "solo", "corporate", "returning", "pet", "student"];
  const familyHandover: PackSection | null = modules.has("family") ? PERSONA_MODULES.family : null;
  for (const key of moduleOrder) {
    if (modules.has(key)) personaModules.push(PERSONA_MODULES[key]);
  }
  if (personaModules.length === 0) {
    personaModules.push({
      title: "General relocation support",
      items: [
        "No specific add-on modules were selected. If your move involves family, pets, corporate transfer, returning home, or student planning, these modules can be added by contacting support@settlemap.app.",
        "For any complex or multi-person move, refer to the detailed checklist, document tracker, and first week plan above — these are applicable to all move types.",
      ],
    });
  }

  const providerScripts: PackSection = {
    title: "Provider research scripts",
    items: [
      "HOUSING ENQUIRY: Hi, I am relocating to [city] in [month] and looking for a [flat/house/room] near [area]. Could you let me know: what is included in the rent, what is the deposit amount and return conditions, what notice period is required, and is there a guarantor requirement for international residents? Do not sign any agreement without reading the full lease.",
      "MOVER QUOTE ENQUIRY: I am moving from [origin] to [destination] in [month]. Volume is approximately [boxes/cubic metres]. Could you provide a quote covering: packing service if available, transit time, insurance included in the quote, customs clearance assistance, and the prohibited items list? Get at least 2-3 quotes. Verify the mover is licensed and insured.",
      "BANKING ENQUIRY: I am relocating to [city] in [month]. Could you tell me: what documents are required to open an account as a new resident or visa holder, whether there is a fee-free account for new arrivals or international customers, and how long the account opening process takes?",
      "SIM / eSIM ENQUIRY: I am arriving in [city] in [month] and need a SIM or eSIM. Could you confirm: the data allowance, whether international calls to [home country] are included, the minimum contract length, and whether I can get a SIM without a local bank account on arrival? Prepaid SIMs avoid contract lock-in for the first 1-2 months.",
      "INSURANCE ENQUIRY: I am relocating to [destination] and need [health/renters/travel] insurance. Could you confirm: what is covered and what is excluded, whether pre-existing conditions are covered, what the claims process is, and whether there is a waiting period before coverage starts? Always read the policy document before purchasing.",
      "SCHOOL / CHILDCARE ENQUIRY: I am relocating to [city] in [month] with a child aged [age]. Could you let me know: whether there are current enrolment vacancies, what the enrolment deadline is, what documents are required, and whether there are fees for the current term?",
      "UNIVERSITY ADMIN ENQUIRY: I am an incoming student arriving in [month]. Could you confirm: where I collect my student ID, the international student office address and contact, the orientation schedule, and what documents I need to bring on day one? Verify all information on the university official website.",
      "HEALTHCARE / CLINIC ENQUIRY: I am a new resident in [city] looking to register with a GP or health centre. Could you let me know: whether you are accepting new patients, what documents are required to register, whether you can prescribe continuation of an existing medication, and what the consultation fee is if I do not yet have local health cover?",
      "PET RELOCATION ENQUIRY: I am relocating from [origin] to [destination] in [month] with a [dog/cat/other]. I need support with: import permit application, quarantine arrangements if required, and airline cargo booking. Could you confirm the process, timeline, and estimated cost? Only use IATA-certified pet transport agents.",
      "CORPORATE HR / RELOCATION ALLOWANCE ENQUIRY: I am confirming the details of my relocation package for my move from [origin] to [destination]. Could you confirm in writing: the total allowance, what is covered and what requires pre-approval, the reimbursement process and deadlines, and the contact for any local settlement support? Get all relocation package details in writing before committing to travel dates.",
      "RETURNING HOME REACTIVATION ENQUIRY: I am returning to [home country] after [X years] abroad. I would like to reactivate my [bank account / national ID / local registration]. Could you confirm: what documents are required, whether I can initiate this process online before arrival, and what the processing time is?",
      "PROVIDER REFERENCE POLICY: SettleMap does not recommend, verify, rank, or endorse any specific provider. Scripts above are neutral templates. You must verify credentials, licensing, pricing, and suitability directly.",
    ],
  };

  const researchLinks: PackSection = {
    title: "Research links — where to verify",
    items: [
      ...getResearchLinkChecklistItems({
        audience: "premium",
        destination,
        personaTags: [whoIsMoving, moveReason, modules.has("pet") ? "pet" : "", modules.has("student") ? "student" : ""].filter(Boolean),
        limit: 14,
      }),
      RESEARCH_LINKS_BOUNDARY_COPY,
    ],
  };

  const officialSourceReminder: PackSection = {
    title: "Official source reminders",
    items: [
      "Always verify visa and permit requirements on your destination country's official immigration authority website — not on forums, aggregators, or third-party summaries.",
      "Check your destination's mandatory registration requirements (address registration, tax registration, etc.) and deadlines — missing these can affect visa status or legal standing.",
      `Route note: ${routeSummary}`,
      "For employment: confirm work rights with the official immigration authority — what is permitted on your visa type may differ from what your employer or recruiter assumes.",
      "For healthcare: check whether your visa type entitles you to public health services, and when coverage starts. Do not assume coverage begins on arrival.",
      "For tax: a cross-border move may create obligations in both origin and destination countries. Consult a qualified tax adviser — not HR alone.",
      "For pets: import rules change frequently. Always verify directly with the official veterinary or customs authority of your destination in the 6 weeks before travel.",
      "SettleMap provides planning and research support only. It does not provide immigration, legal, tax, property, financial, insurance, medical, school admission or government advice.",
    ],
  };

  return {
    effectiveRoute,
    executiveSummary: generateExecutiveSummary(origin, destination, whoIsMoving, moveReason, timing, effectiveRoute),
    whyUseful: getWhyThisPackIsUseful(),
    afterReceiving: getAfterReceivingChecklist(),
    next7Actions: generateNext7Actions(origin, destination, moveReason),
    officialSourceChecklist: getOfficialSourceChecklist(origin, destination),
    routeResearchPrompts: getPremiumRouteResearchPrompts(origin, destination, moveReason),
    budgetStarterTable: getPremiumBudgetTable(),
    documentTrackerTable: getPremiumDocumentTracker(),
    providerWorksheet: getPremiumProviderWorksheet(),
    copyPasteScripts: getPremiumCopyPasteScripts(origin, destination),
    qualityGateFooter: getPremiumQualityGateFooter(),
    bankingTaxChecklist: getBankingTaxChecklist(moveReason),
    familyHandover,
    routeSnapshot,
    detailedChecklist,
    budgetTemplate,
    documentTracker,
    firstWeekPlan,
    personaModules,
    providerScripts,
    researchLinks,
    officialSourceReminder,
    safetyBoundaryNote:
      "SettleMap provides planning checklists and research guides only. It does not provide immigration, legal, tax, financial, property, insurance, medical, school admission or government advice. Always verify requirements with official sources and qualified professionals.",
  };
}

// -- Email formatters --

function sectionToHtml(section: PackSection, accentColor = "#7c3aed"): string {
  const items = section.items
    .map((i) => `<li style="margin:4px 0;font-size:14px;line-height:1.7;color:#3f3f46;">${i}</li>`)
    .join("");
  return `
    <div style="margin:20px 0;">
      <p style="color:${accentColor};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px 0;">${section.title}</p>
      <ul style="padding-left:20px;margin:0;">${items}</ul>
    </div>`;
}

function sectionToText(section: PackSection): string {
  return `${section.title.toUpperCase()}\n${section.items.map((i) => `- ${i}`).join("\n")}`;
}

function tableToHtml(table: PackTableSection, accentColor: string): string {
  const headerCells = table.headers
    .map(
      (h) =>
        `<th style="text-align:left;padding:7px 9px;border:1px solid #ddd6fe;background:#f5f3ff;font-size:11px;font-weight:700;color:${accentColor};white-space:nowrap;">${h}</th>`,
    )
    .join("");
  const dataRows = table.rows
    .map((row) => {
      const cells = row
        .map(
          (cell) =>
            `<td style="padding:6px 9px;border:1px solid #e4e4e7;font-size:12px;color:#3f3f46;vertical-align:top;">${cell || "&nbsp;"}</td>`,
        )
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");
  return `
    <div style="margin:20px 0;">
      <p style="color:${accentColor};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px 0;">${table.title}</p>
      ${table.note ? `<p style="color:#71717a;font-size:12px;margin:0 0 8px 0;">${table.note}</p>` : ""}
      <div style="overflow-x:auto;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:12px;">
          <thead><tr>${headerCells}</tr></thead>
          <tbody>${dataRows}</tbody>
        </table>
      </div>
    </div>`;
}

function tableToText(table: PackTableSection): string {
  const sep = " | ";
  const header = table.headers.join(sep);
  const divider = table.headers.map((h) => "-".repeat(h.length)).join("-+-");
  const rows = table.rows.map((r) => r.join(sep));
  const lines = [
    table.title.toUpperCase(),
    ...(table.note ? [table.note] : []),
    header,
    divider,
    ...rows,
    "(Copy the table above into Google Sheets or Excel — fill in Estimate and Actual columns as you research.)",
  ];
  return lines.join("\n");
}

export function buildPremiumPackEmail(
  pack: PremiumRelocationPack,
  buyerName: string | null,
  timingMonth: string | null,
  modules: string | null,
): { subject: string; html: string; text: string } {
  const greeting = buyerName ? `Hi ${buyerName},` : "Hi,";
  const accent = "#7c3aed";

  const moveDetails = `
    <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <p style="color:#7c3aed;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px 0;">Move details</p>
      <p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Route:</strong> ${pack.effectiveRoute}</p>
      ${timingMonth ? `<p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Planned timing:</strong> ${timingMonth}</p>` : ""}
      ${modules ? `<p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Add-on modules:</strong> ${modules}</p>` : ""}
    </div>`;

  // Appendix: supplementary legacy content — kept available, moved out of the
  // way of the 20 mandated sections so worksheets and the new banking/tax
  // checklist are never buried.
  const appendixSections = [
    pack.budgetTemplate,
    pack.documentTracker,
    pack.firstWeekPlan,
    ...pack.personaModules,
    pack.providerScripts,
    pack.researchLinks,
    pack.officialSourceReminder,
  ];
  const appendixHtml = appendixSections.map((s) => sectionToHtml(s, accent)).join("");
  const appendixText = appendixSections.map(sectionToText).join("\n\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your SettleMap Premium Relocation Pack</title></head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f4f4f5;margin:0;padding:0;">
  <div style="max-width:620px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#7c3aed;padding:28px 32px;">
      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;">SettleMap</h1>
      <p style="color:#ede9fe;margin:4px 0 0 0;font-size:13px;">Premium Relocation Pack -- paid</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#18181b;font-size:16px;line-height:1.6;">${greeting}</p>
      <p style="color:#3f3f46;font-size:15px;line-height:1.7;">Thank you for joining SettleMap. Your <strong>Premium Relocation Pack</strong> is ready. Payment confirmed by Stripe.</p>
      ${moveDetails}
      <div style="background:#faf5ff;border:1px solid #ddd6fe;border-radius:8px;padding:18px 20px;margin:20px 0;">
        ${sectionToHtml(pack.whyUseful, accent)}
      </div>
      <div style="background:#f5f3ff;border:1px solid #c4b5fd;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.executiveSummary, accent)}
      </div>
      <div style="background:#faf5ff;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.next7Actions, accent)}
      </div>
      <div style="background:#ffffff;border:1px solid #ddd6fe;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.afterReceiving, accent)}
      </div>
      <div style="background:#f4f4f5;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.routeSnapshot, accent)}
      </div>
      <div style="background:#ffffff;border:1px solid #ddd6fe;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.detailedChecklist, accent)}
      </div>
      <div style="background:#ffffff;border:1px solid #e4e4e7;border-radius:8px;padding:20px;margin:20px 0;">
        <p style="color:${accent};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px 0;">Your worksheets — copy these into Google Sheets or Excel</p>
        ${tableToHtml(pack.budgetStarterTable, accent)}
        ${tableToHtml(pack.documentTrackerTable, accent)}
      </div>
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.bankingTaxChecklist, "#9a3412")}
      </div>
      <div style="background:#ffffff;border:1px solid #e4e4e7;border-radius:8px;padding:20px;margin:20px 0;">
        ${tableToHtml(pack.providerWorksheet, accent)}
      </div>
      <div style="background:#f4f4f5;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.officialSourceChecklist, accent)}
      </div>
      <div style="background:#eff6ff;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.routeResearchPrompts, accent)}
      </div>
      <div style="background:#f4f4f5;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.copyPasteScripts, accent)}
      </div>
      ${
        pack.familyHandover
          ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.familyHandover, "#166534")}
      </div>`
          : ""
      }
      <div style="margin:24px 0;">
        <p style="color:#3f3f46;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px 0;">Build your route plan</p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app" style="color:#7c3aed;font-weight:600;">settlemap.app</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/#route-selector" style="color:#7c3aed;">Route planner</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/countries" style="color:#7c3aed;">Route Library</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/services" style="color:#7c3aed;">Services Directory</a></p>
      </div>
      <div style="background:#f5f3ff;border:1px solid #c4b5fd;border-radius:8px;padding:16px 20px;margin:20px 0;">
        <p style="color:#5b21b6;font-size:14px;margin:0;">Tell us what's missing or what worked: <a href="https://settlemap.app/pilot-feedback" style="color:#7c3aed;font-weight:600;">settlemap.app/pilot-feedback</a></p>
      </div>
      <div style="background:#fafafa;border:1px dashed #d4d4d8;border-radius:8px;padding:18px 20px;margin:20px 0;">
        <p style="color:#71717a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px 0;">Appendix — extra planning notes</p>
        ${appendixHtml}
      </div>
      <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:20px 0;">
        ${sectionToHtml(pack.qualityGateFooter, "#92400e")}
      </div>
      <div style="background:#fef9c3;border-left:3px solid #facc15;padding:10px 14px;border-radius:4px;margin:16px 0;">
        <p style="color:#713f12;font-size:12px;line-height:1.6;margin:0;">
          Do not send: passport numbers, visa numbers, bank details, medical details or ID documents.
        </p>
      </div>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />
      <p style="color:#3f3f46;font-size:14px;margin:16px 0 0 0;">Regards,<br><strong>SettleMap Team</strong><br>
        <a href="mailto:support@settlemap.app" style="color:#7c3aed;">support@settlemap.app</a></p>
    </div>
  </div>
</body>
</html>`;

  const text = [
    greeting,
    "",
    "Thank you for joining SettleMap. Your Premium Relocation Pack is ready.",
    "",
    `Route: ${pack.effectiveRoute}`,
    timingMonth ? `Planned timing: ${timingMonth}` : "",
    modules ? `Modules: ${modules}` : "",
    "",
    sectionToText(pack.whyUseful),
    "",
    sectionToText(pack.executiveSummary),
    "",
    sectionToText(pack.next7Actions),
    "",
    sectionToText(pack.afterReceiving),
    "",
    sectionToText(pack.routeSnapshot),
    "",
    sectionToText(pack.detailedChecklist),
    "",
    "YOUR WORKSHEETS — copy these into Google Sheets or Excel:",
    tableToText(pack.budgetStarterTable),
    "",
    tableToText(pack.documentTrackerTable),
    "",
    sectionToText(pack.bankingTaxChecklist),
    "",
    tableToText(pack.providerWorksheet),
    "",
    sectionToText(pack.officialSourceChecklist),
    "",
    sectionToText(pack.routeResearchPrompts),
    "",
    sectionToText(pack.copyPasteScripts),
    "",
    pack.familyHandover ? sectionToText(pack.familyHandover) : "",
    pack.familyHandover ? "" : "",
    "BUILD YOUR ROUTE PLAN:",
    "https://settlemap.app",
    "https://settlemap.app/#route-selector",
    "https://settlemap.app/countries",
    "https://settlemap.app/services",
    "",
    "PILOT FEEDBACK: https://settlemap.app/pilot-feedback",
    "",
    "APPENDIX — extra planning notes:",
    appendixText,
    "",
    sectionToText(pack.qualityGateFooter),
    "",
    "Do not send: passport numbers, visa numbers, bank details, medical details or ID documents.",
    "",
    "Regards, SettleMap Team | support@settlemap.app",
  ]
    .filter((l) => l !== undefined && l !== "")
    .join("\n");

  return { subject: "Your SettleMap Premium Relocation Pack is ready", html, text };
}
