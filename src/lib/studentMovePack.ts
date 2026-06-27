// ── SettleMap Student Move Pack Generator ────────────────────────────────────────────
// Pure helper — no side effects, no async. Used by webhook email + success page.
// V12.12.15: Executive summary, Next 7 actions, Budget table, Document tracker,
//            Provider worksheet, Parent handover, Copy-paste scripts, Quality gate.

import {
  RESEARCH_LINKS_BOUNDARY_COPY,
  getResearchLinkChecklistItems,
} from "@/data/researchLinksRegistry";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface PackMetadata {
  moveRoute?: string | null;
  otherRoute?: string | null;
  departureMonth?: string | null;
  concerns?: string | null;
  buyerRole?: string | null;
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

export interface StudentMovePack {
  effectiveRoute: string;
  routeSummary: string;
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
  enhancedParentHandover: PackSection;
  copyPasteScripts: PackSection;
  qualityGateFooter: PackSection;
  // Original sections
  ninetyDayPlan: PackSection;
  firstSevenDays: PackSection;
  concernSections: PackSection[];
  providerQuestions: PackSection;
  parentHandover: PackSection;
  packingChecklist: PackSection;
  officialSourceReminder: PackSection;
  researchLinksSection: PackSection;
  safetyBoundaryNote: string;
}

// ─── Route helpers ─────────────────────────────────────────────────────────────

function resolveRoute(meta: PackMetadata): string {
  if (meta.moveRoute === "Other route" && meta.otherRoute?.trim())
    return meta.otherRoute.trim();
  return meta.moveRoute?.trim() || "Your route";
}

function routeContext(route: string): string {
  const r = route.toLowerCase();
  // IMPORTANT: check "australia" BEFORE "us" — "australia" contains "us" as a substring.
  if (r.includes("australia")) return "For a student move from India to Australia, check your CoE, student visa (subclass 500), OSHC health insurance, and university arrival reporting requirements. Refer to the Australian Department of Home Affairs and your institution's international student office for official guidance.";
  if (r.includes("canada")) return "For a student move from India to Canada, check your LOA, study permit, PAL/SDS requirements where relevant, and GIC if required by your institution. Check provincial health coverage requirements. Refer to IRCC (Immigration, Refugees and Citizenship Canada) and your institution for official guidance.";
  if (r.includes("uk")) return "For a student move from India to the UK, check your CAS, student visa, BRP/eVisa collection, NHS surcharge, and UKVI visa timeline. Refer to UKCISA and the UK Visas and Immigration (UKVI) official site for official guidance.";
  if (r.includes("germany") || r.includes("eu")) return "For a student move from India to Germany / the EU, check APS assessment where relevant, blocked account (Sperrkonto), health insurance, Anmeldung city registration, and residence permit appointment timelines. Refer to your German consulate and institution's international office for official guidance.";
  if (r.includes("singapore")) return "For a student move from India to Singapore, check IPA/student pass requirements, accommodation near your institution, local SIM setup, bank and payment account requirements, and campus reporting dates. Refer to ICA Singapore and your institution for official guidance.";
  // Word-boundary check for US
  if (/\bus\b/.test(r) || r.includes("united states") || r.includes("usa")) return "For a student move from India to the US, check your I-20, SEVIS fee payment, F-1 visa interview requirements, and earliest entry date rules. Refer to your DSO, the US Embassy, and the official SEVIS site for official guidance.";
  return "Check your destination country's official immigration and student entry requirements, university arrival guidance, housing rules, health coverage requirements, and local registration requirements.";
}

function assessRiskLevel(route: string): string {
  const r = route.toLowerCase();
  if (r.includes("germany") || r.includes("eu"))
    return "Medium-High — Germany / EU route involves APS assessment (for Indian degrees in some fields), blocked account (Sperrkonto), health insurance proof, Anmeldung city registration, and residence permit timeline. Check the current official processing timeline before booking irreversible travel.";
  if (r.includes("australia"))
    return "Medium — Australia student route requires CoE, student visa (subclass 500), OSHC health insurance, and university arrival reporting obligations. Check the current official processing timeline before booking irreversible travel.";
  if (r.includes("canada"))
    return "Medium — Canada study permit may require GIC, LOA, PAL/SDS depending on institution, plus provincial health coverage waiting periods. Check the current official processing timeline before booking irreversible travel.";
  if (r.includes("uk"))
    return "Low-Medium — UK student visa route is well-documented via UKVI. CAS from university required, plus BRP or eVisa, NHS surcharge payment. Check the current official processing timeline before booking irreversible travel.";
  if (/\bus\b/.test(r) || r.includes("united states") || r.includes("usa"))
    return "Low-Medium — US F-1 route requires I-20, SEVIS fee, F-1 visa interview, and earliest entry date compliance. Check the current official processing timeline before booking irreversible travel.";
  if (r.includes("singapore"))
    return "Low — Singapore student pass (ICA) route is typically streamlined. Confirm IPA letter and campus reporting date with your institution. Check the current official processing timeline before booking irreversible travel.";
  return "Low-Medium — Check the current official processing timeline before booking irreversible travel. Verify requirements with your destination's official immigration authority before acting.";
}

// ─── V12.12.15 section generators ─────────────────────────────────────────────

function generateExecutiveSummary(meta: PackMetadata, route: string): PackSection {
  const departure = meta.departureMonth || "your planned departure month";
  const role = meta.buyerRole || "Student";
  return {
    title: "Your move at a glance",
    items: [
      `Route: ${route}`,
      `Timing: ${departure}`,
      `Who is moving: ${role}`,
      "Top 5 priorities: (1) Confirm visa / entry document status — everything else waits on this (2) Secure accommodation before arrival or immediately on check-in (3) Keep India SIM active — banking OTPs depend on it (4) Build a 60-day cash buffer including rent deposit (5) Prepare a hand-luggage document pack: passport, visa, admission letter, accommodation confirmation",
      "Top 5 things to verify officially: (1) Student visa conditions and processing timeline — official immigration authority of your destination (2) University enrollment and arrival reporting requirements — your institution's international student office (3) Health insurance requirements for your specific visa type (4) Local registration deadlines where applicable (5) Bank account opening requirements for your visa category",
      "Top 5 things to do this week: (1) Check the official visa processing timeline for your route (2) Email your university international student office for an arrival guide (3) Shortlist at least 2 accommodation options (4) Confirm your India SIM will stay active for 6+ months (5) Draft a 60-day budget estimate",
      `Planning complexity: ${assessRiskLevel(route)}`,
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
      "It helps students and families align on documents, money, and emergency contacts.",
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
      "Share the parent and student handover section if relevant.",
      "Send feedback using the pilot feedback link: https://settlemap.app/pilot-feedback",
    ],
  };
}

function generateNext7Actions(route: string): PackSection {
  const r = route.toLowerCase();
  const visaAuth = r.includes("uk")
    ? "gov.uk/visas-immigration (UKVI)"
    : r.includes("australia")
    ? "homeaffairs.gov.au (Department of Home Affairs)"
    : r.includes("canada")
    ? "canada.ca/immigration (IRCC)"
    : r.includes("germany") || r.includes("eu")
    ? "German consulate website for your origin country"
    : r.includes("singapore")
    ? "ica.gov.sg (ICA Singapore)"
    : /\bus\b/.test(r) || r.includes("united states")
    ? "uscis.gov and travel.state.gov (US Embassy)"
    : "your destination country's official immigration authority website";
  return {
    title: "Next 7 actions — start here",
    items: [
      `1. [VISA / ENTRY] Check the official processing timeline for your student visa. Why it matters: Visa is the hard dependency — all planning follows from it. Owner: You. Time: 30 min. Verify on: ${visaAuth}`,
      "2. [UNIVERSITY] Contact your institution's international student office. Ask for: arrival guide, orientation date, student ID collection process, and mandatory reporting requirements. Why it matters: Arrival reporting deadlines are often strict — missing them affects enrollment. Owner: You. Time: 15 min (email or form). Verify on: Official institution website.",
      "3. [ACCOMMODATION] Shortlist at least 2 accommodation options. Do not commit to a 12-month lease before viewing in person. Why it matters: Accommodation near campus fills quickly for peak intake months. Owner: You. Time: 1–2 hrs. Verify on: University-approved housing list and local property platforms.",
      "4. [SIM / OTP] Do not cancel your India SIM. Keep it active for at least 6 months after arrival. Why it matters: Indian bank OTPs (HDFC, SBI, ICICI, Axis, Kotak, etc.) are sent to your Indian number — losing it can lock you out of internet banking. Owner: You. Time: 5 min (call your carrier). Verify on: Your mobile carrier.",
      "5. [BANKING] Research bank account options at your destination for your visa type. Why it matters: Some banks require a local address or student ID — knowing this upfront prevents delays on arrival. Owner: You. Time: 20 min. Verify on: Official bank websites — student account pages specifically.",
      "6. [BUDGET] Build a 60-day budget: rent deposit + first month rent + SIM + food + transport + setup + emergency buffer. Why it matters: Running out of funds in the first 30 days is the top financial stressor for international students. Owner: You + family. Time: 30–45 min. Verify: Cross-check estimates with current students at your destination (university forums, Facebook groups).",
      "7. [DOCUMENTS] Create a document checklist and scan all originals to a secure cloud folder shared with one trusted family member. Why it matters: Lost or missing documents at arrival can delay registration, housing, and banking — digital backups are the safety net. Owner: You. Time: 30 min. Verify on: Your institution's international student arrival guide.",
    ],
  };
}

function getOfficialSourceChecklist(route: string): PackSection {
  const r = route.toLowerCase();
  const immigrationLink = r.includes("uk")
    ? "Search: 'UKVI student visa official' — gov.uk/student-visa"
    : r.includes("australia")
    ? "Search: 'Australian student visa subclass 500 official' — homeaffairs.gov.au"
    : r.includes("canada")
    ? "Search: 'IRCC study permit Canada official' — canada.ca/immigration"
    : r.includes("germany") || r.includes("eu")
    ? "Search: 'German student visa official' — check your German consulate for your origin country"
    : r.includes("singapore")
    ? "Search: 'Singapore student pass ICA official' — ica.gov.sg"
    : /\bus\b/.test(r) || r.includes("united states")
    ? "Search: 'F-1 student visa USCIS official' — uscis.gov and travel.state.gov"
    : "Search: '[your destination] student visa official immigration authority'";
  return {
    title: "Official-source verification checklist",
    items: [
      `IMMIGRATION AUTHORITY — verify on official website: Student visa conditions, permitted activities, stay duration, reporting requirements. ${immigrationLink}`,
      "UNIVERSITY / INSTITUTION — verify on official website: Enrollment requirements, mandatory arrival reporting date, student ID collection, orientation schedule, mandatory health insurance, and campus services for international students.",
      "HOUSING PROVIDER — verify on official listing or provider website: Lease terms, deposit amount and return conditions, what is included in rent (utilities, internet), notice period, and any guarantor requirements for international students.",
      "BANK — verify on official bank website: Student account eligibility for your visa type, documents required to open, account opening timeline, fees, and international transfer options.",
      "HEALTH INSURANCE / HEALTHCARE — verify on institution or insurance provider website: Whether your visa requires mandatory health insurance, what is covered and excluded, nearest GP or health centre, and how to access repeat prescriptions.",
      "SIM / TELECOM — verify on official telecom provider website: Prepaid SIM availability without a local bank account, data allowance, international call options to India, and eSIM availability for pre-arrival activation.",
      "LOCAL REGISTRATION — verify on official government portal: Whether address registration is mandatory in your destination (Anmeldung in Germany, ICA address update in Singapore, IRCC address update in Canada), the deadline, and documents required.",
      "CONSULATE / EMERGENCY — search mea.gov.in for the nearest Indian consulate or high commission in your destination city. Save the address, main phone, and emergency line before departure.",
    ],
  };
}

function getRouteResearchPrompts(route: string): PackSection {
  return {
    title: "Route research links and search prompts",
    items: [
      `Official immigration prompt: search "${route} student visa official government" and open only government or official immigration pages first.`,
      `University prompt: search "${route} international student arrival checklist official" and compare it with your own university's international student office page.`,
      `Housing prompt: search "${route} student accommodation official university housing" before using private platforms. Start with university-approved lists where available.`,
      `Banking prompt: search "${route} student bank account documents official bank" and write down the exact documents each bank asks for.`,
      `Healthcare prompt: search "${route} student health insurance official university" and verify whether cover is mandatory before arrival.`,
      "SettleMap reference links: https://settlemap.app/reference-links — use this as a starting map, not as a substitute for official sources.",
      "Provider research prompt: compare at least two providers for housing, SIM, banking, insurance, and moving/shipping. SettleMap does not recommend or endorse specific providers.",
    ],
  };
}

function getBudgetStarterTable(): PackTableSection {
  return {
    title: "Budget starter worksheet — fill in as you research",
    headers: ["Category", "Estimate", "Actual", "Notes", "Verification needed"],
    rows: [
      ["Visa / permit fees", "", "", "", "Official immigration authority"],
      ["Flights", "", "", "", "Airline / booking platform"],
      ["Temporary stay (arrival 1–2 wks)", "", "", "", "University housing / booking platform"],
      ["Security deposit", "", "", "", "Ask housing provider"],
      ["First month rent", "", "", "", "Ask housing provider"],
      ["SIM / internet (monthly)", "", "", "", "Local telecom website"],
      ["Transport (monthly pass)", "", "", "", "Local transport authority"],
      ["Food / essentials (monthly)", "", "", "", "Students at your destination"],
      ["Health insurance (if not included)", "", "", "", "Institution / insurance provider"],
      ["Setup costs (bedding, kitchen, adaptor)", "", "", "", "Local supermarket / Amazon at destination"],
      ["Emergency buffer — do not spend", "", "", "8–12 weeks of living costs minimum", "Your own calculation"],
    ],
    note: "Fill in Estimate and Actual columns as you research. Copy into Google Sheets or Excel to track real spending.",
  };
}

function getDocumentTrackerTable(): PackTableSection {
  return {
    title: "Document tracker",
    headers: ["Document", "Needed for", "Owner", "Status", "Where to verify", "Notes"],
    rows: [
      ["Passport", "All entry, banking, registration", "You", "", "Passport authority", "Valid 6+ months beyond stay"],
      ["Student visa / entry document", "Entry, university, bank", "You", "", "Official immigration authority", "Check permitted activities"],
      ["Admission / offer letter", "Entry, banking, housing", "You", "", "Your institution", "Carry original — not scan only"],
      ["Accommodation confirmation", "Arrival, registration", "You", "", "Housing provider", "Check-in date + landlord contact"],
      ["Vaccination record", "Health centre registration", "You", "", "Your GP / doctor", "Especially for ongoing conditions"],
      ["Doctor letter (if on medication)", "Customs, pharmacy", "You + Doctor", "", "Your GP", "List medications by generic name"],
      ["Emergency contacts page", "Safety", "You + Family", "", "N/A — you create this", "Print A4, carry in hand luggage"],
      ["Travel insurance (if applicable)", "Health, trip issues", "You", "", "Insurance provider", "Check coverage dates and exclusions"],
    ],
    note: "Add rows for route-specific documents (GIC letter for Canada, blocked account for Germany, CoE for Australia, etc.).",
  };
}

function getProviderWorksheet(): PackTableSection {
  return {
    title: "Provider comparison worksheet",
    headers: ["Category", "Question to ask", "Answer", "Cost", "Risk note", "Decision"],
    rows: [
      ["Housing", "Deposit amount and return conditions?", "", "", "Avoid if terms are unclear", ""],
      ["Housing", "Guarantor required for international student?", "", "", "May need higher deposit instead", ""],
      ["Bank", "Docs needed to open student account?", "", "", "Bring all required docs to appointment", ""],
      ["Bank", "Can I open the account online before arrival?", "", "", "Pre-registration saves arrival-day time", ""],
      ["SIM", "Prepaid SIM without local bank account?", "", "", "Prepaid is safest in first month", ""],
      ["SIM", "International calls to India included?", "", "", "Check per-minute rates if not included", ""],
      ["Mover / shipping", "What is included in the quote?", "", "", "Get 2–3 quotes minimum", ""],
      ["Insurance", "What is excluded from health cover?", "", "", "Read policy document, not just the summary", ""],
    ],
    note: "SettleMap does not recommend or endorse any specific provider. Verify credentials and suitability directly before engaging.",
  };
}

function getEnhancedParentHandover(route: string, departure: string): PackSection {
  // route used for contextual note in escalation item
  const _r = route.toLowerCase();
  const consularSearch = _r.includes("uk") ? "London — search mea.gov.in for High Commission of India UK"
    : _r.includes("australia") ? "your destination city in Australia — search mea.gov.in"
    : _r.includes("canada") ? "your destination city in Canada — search mea.gov.in"
    : _r.includes("germany") || _r.includes("eu") ? "your destination city in Germany / EU — search mea.gov.in"
    : _r.includes("singapore") ? "Singapore — search mea.gov.in for High Commission of India Singapore"
    : /\bus\b/.test(_r) || _r.includes("united states") ? "your city in the US — search mea.gov.in"
    : "your destination city — search mea.gov.in";
  return {
    title: "Parent and student handover",
    items: [
      `EMERGENCY CONTACTS TO SHARE BEFORE DEPARTURE: (1) Student's new local SIM number — once confirmed at destination (2) Student's accommodation address — once checked in (3) Campus security or residence front desk number (4) Indian consulate or high commission in ${consularSearch} (5) A trusted local contact if available in the destination city`,
      `WEEKLY CHECK-IN PLAN: Agree before departure on a fixed day and time for a video or WhatsApp call — recommend Sunday evening at the destination's local time. If a call is missed: text first, then call. If no contact for 48+ hours in the first week, use a backup (campus security or accommodation front desk). First planned check-in: within 24 hours of landing on ${departure}.`,
      "MONEY TRANSFER PLAN: Agree on the monthly transfer amount, method (Wise / Revolut / bank wire), and transfer date each month. Transfer a few days early to allow for processing times. Both the student and parents should know how to initiate an emergency transfer independently without needing to call each other first.",
      "DOCUMENT BACKUP: Parents to keep digital copies of: passport bio page, student visa, admission letter, accommodation confirmation, and emergency contacts page. Store in a shared Google Drive or similar — both student and parents have access. This is the recovery option if physical documents are lost or damaged abroad.",
      "LOCAL ADDRESS UPDATE: Student to send parents the full local address, university address, and new local SIM number within 48 hours of arrival and check-in. Both sides to save this in their phone contacts immediately.",
      "WHAT PARENTS SHOULD NOT PANIC ABOUT: (1) Short silences in the first 48 hours of arrival — settling in is overwhelming and the student may be in orientation or setup mode (2) Homesickness or tiredness in weeks 1–3 — this is normal and typically resolves as routines form (3) Minor spending overruns in the first week — setup costs always run higher than estimates",
      "WHAT PARENTS SHOULD ESCALATE IMMEDIATELY: (1) No contact for 5+ consecutive days without prior warning — contact campus security first, then the accommodation front desk (2) Medical emergency reported by the student — campus health centre first, then local emergency services (number varies by country), then the Indian consulate (3) Passport or visa reported lost or stolen — student to report to local police and get a crime reference number, then contact the Indian consulate — not friends or online forums first (4) Financial emergency — initiate an emergency transfer immediately and contact the university international student office for emergency hardship support",
    ],
  };
}

function getCopyPasteScripts(_route: string): PackSection {
  return {
    title: "Copy-paste scripts — ready to use",
    items: [
      `UNIVERSITY INTERNATIONAL OFFICE (email): Subject: Arriving student — arrival guidance request | Body: "Dear International Student Office, I am an incoming student arriving in [month] for [programme name]. I would like to confirm: (1) Mandatory arrival reporting date and process (2) Where and when to collect my student ID (3) Orientation schedule and whether I need to register in advance (4) Documents to bring on my first day. Thank you — [Your name], [Student ID if known]"`,
      `ACCOMMODATION PROVIDER (email or WhatsApp): "Hi, I am moving from [origin] to [destination] in [month] and I am interested in a [flat/room] in [area]. Could you confirm: (1) The deposit amount and refund conditions (2) What is included in the rent — utilities, internet, laundry? (3) The minimum notice period to end the tenancy (4) Whether there is a guarantor requirement for international students. Thank you."`,
      `BANK (branch visit prep or email): "I am relocating to [city] in [month] as an international student on a [visa type] visa. Could you let me know: (1) Documents required to open a student account (2) Whether there is a fee-free student account option (3) Whether I can start the application online before arrival (4) How long the account opening process takes. Thank you."`,
      `SIM PROVIDER (enquiry): "I am arriving in [city] in [month] and need a SIM or eSIM. Could you confirm: (1) Whether a prepaid SIM is available without a local bank account (2) Data allowance and monthly cost (3) International calls to India — included or add-on? (4) Whether an eSIM can be ordered before arrival to activate on landing. Thank you."`,
      `INSURANCE PROVIDER (email): "I am relocating to [destination] as an international student in [month]. Could you confirm: (1) What is covered and excluded from the health plan (2) Whether pre-existing conditions are covered (3) The claims process and typical reimbursement timeline (4) Whether the plan satisfies the health insurance requirement for a [visa type] student visa. Thank you."`,
      `MOVER / SHIPPING (quote request): "I am moving from [origin] to [destination] in [month]. Estimated volume: [X boxes / cubic metres]. Could you provide a quote including: (1) Packing service if available (2) Estimated transit time (3) Insurance included in the quote (4) Customs clearance support. I will compare 2–3 quotes before deciding. Thank you."`,
      "SCRIPT POLICY: These are neutral research templates only. SettleMap does not recommend or endorse specific providers. Verify credentials, pricing, and suitability independently before engaging any provider.",
    ],
  };
}

function getQualityGateFooter(): PackSection {
  return {
    title: "Quality gate footer — planning support only",
    items: [
      "PLANNING SUPPORT ONLY: SettleMap is a planning and research tool. It does not provide immigration, legal, tax, financial, property, insurance, medical, school admission, or government advice.",
      "VERIFY OFFICIAL SOURCES: All requirements, deadlines, and costs must be verified directly on official government, institution, or provider websites before you act on them.",
      "NO SENSITIVE DOCUMENT UPLOAD: SettleMap does not require or accept passport numbers, visa numbers, bank account details, medical records, or ID document uploads at any point.",
      "DO NOT SEND SENSITIVE DATA: Do not send passport numbers, visa numbers, bank details, medical details, or ID documents to SettleMap.",
      "SUPPORT: Questions about your pack or the SettleMap service — email support@settlemap.app. We respond within 2 business days.",
      "PACK VERSION: V12.12.17 — Paid Email Content Completeness",
    ],
  };
}

// ── Concern section generators ────────────────────────────────────────────────

type ConcernKey =
  | "accommodation"
  | "packing"
  | "sim"
  | "banking"
  | "firstweek"
  | "insurance"
  | "campus"
  | "parent"
  | "budget"
  | "provider"
  | "research";

function concernKey(label: string): ConcernKey | null {
  const l = label.toLowerCase();
  if (l.includes("accommodation")) return "accommodation";
  if (l.includes("packing")) return "packing";
  if (l.includes("sim") || l.includes("otp")) return "sim";
  if (l.includes("banking")) return "banking";
  if (l.includes("first 7") || l.includes("first seven")) return "firstweek";
  if (l.includes("insurance") || l.includes("healthcare")) return "insurance";
  if (l.includes("campus")) return "campus";
  if (l.includes("parent")) return "parent";
  if (l.includes("budget")) return "budget";
  if (l.includes("provider")) return "provider";
  return null;
}

const CONCERN_SECTIONS: Record<ConcernKey, PackSection> = {
  accommodation: {
    title: "Accommodation research",
    items: [
      "Questions to ask before booking: Is utilities included? What is the deposit amount and return policy? What is the notice period? Is there a guarantor requirement?",
      "Budget for first and last month rent plus deposit — typically 1–2 months upfront.",
      "Compare at least 2–3 options before committing — check distance to campus, supermarket, and public transport.",
      "Consider temporary/short-term stay for the first 1–2 weeks while you view options in person.",
      "Check lease terms carefully — avoid signing a 12-month lease before you arrive unless you have viewed it.",
      "Confirm what is and is not included: furniture, internet, bills, laundry access.",
    ],
  },
  packing: {
    title: "Packing and bring-vs-buy checklist",
    items: [
      "HAND LUGGAGE — MEDICINES: Carry all prescription medicines in original packaging with a doctor letter in English. Bring at least 2–3 weeks' supply in carry-on in case checked luggage is delayed. Check your destination's medicine import rules — some medications require prior approval.",
      "BRING FROM INDIA: Laptop and all chargers and adaptors, unlocked India SIM (keep active for OTPs), formal/smart clothes for admin and campus days, lightweight layers for arrival week, academic certificates and transcripts (originals + copies), prescribed eyewear or contacts with a spare pair.",
      "WEATHER-SPECIFIC: Check the climate for your destination at arrival time. UK/Germany — pack a rain jacket and warm layer even in summer. Singapore — light breathable clothing only, no heavy jackets needed. Australia/Canada — check seasonal temperature range, a packable down jacket is useful in colder months. US — depends on state; check specifically for your city.",
      "BUY AT DESTINATION — CHEAPER THERE: Bulky bedding (duvet, pillows, sheets), large towels, kitchen basics (kettle, pots, crockery), heavy winter coats, toiletries and personal care items, local plug adaptors if your power strip has universal ports.",
      "BEDDING DECISION: Many student accommodations provide basic bedding or rent it. Check with your accommodation before buying — if provided, save the luggage space.",
      "KITCHEN BASICS DECISION: University halls often have shared kitchen basics. Private rentals may be unfurnished — confirm with your landlord what is included before buying.",
      "DO NOT PACK: Food items that may be restricted (meat, dairy, fruits, seeds vary by country — check customs rules for your destination country). Prohibited items vary — always check the official customs website before packing.",
      "CUSTOMS REMINDER: Always verify restricted and prohibited items with your destination country's official customs authority before packing. Declaring dutiable items is your responsibility. Official source: search your destination country's customs or border control official website.",
    ],
  },

  sim: {
    title: "India SIM and OTP continuity",
    items: [
      "Do NOT cancel or port away your India SIM before departure — keep it active for at least 6 months.",
      "Indian bank OTPs (HDFC, SBI, ICICI, Axis, Kotak, etc.) are sent to your Indian number — losing it can lock you out of internet banking.",
      "Test international roaming on your Indian SIM before departure, or activate an eSIM for arrival-day data.",
      "Plan for a destination SIM in addition to keeping your India number — you will need both.",
      "Check whether your Indian bank supports overseas mobile banking setup or number change — do this before you leave.",
      "WhatsApp can switch to a new number later, but do this carefully and only after your banking OTPs are safe.",
    ],
  },
  banking: {
    title: "Banking research and preparation",
    items: [
      "Research the bank account opening requirements at your destination — some accept student ID, others need a local address.",
      "Prepare these document categories: valid ID (passport), acceptance or enrollment letter, proof of accommodation or address, initial minimum deposit.",
      "Compare international transfer options: Wise, Revolut, or your bank's international transfer — check fees and exchange rates.",
      "Check if your Indian bank card works internationally without a block — call or enable online before departure.",
      "Set up internet banking and the mobile app from India before you leave.",
      "Carry a small amount of local currency in cash for the first 24-48 hours.",
    ],
  },
  firstweek: {
    title: "First 7 days setup guide",
    items: [
      "Day 1: Get a local SIM or activate your eSIM — data is essential from day one. Prepaid SIMs are usually available at the airport or major supermarkets.",
      "Day 1-2: Check into your accommodation and confirm your rental or temporary stay. Get your landlord or hall contact number saved immediately.",
      "Day 2-3: Buy essential groceries, a travel adaptor, and household basics. Note: Bedding and kitchen items can often wait 1-2 days once you confirm what is provided.",
      "Day 3-4: Set up local transport — research bus/rail card, app, or pass for your city. Student discount cards are often available from day one with a valid student ID.",
      "Day 3-5: Register at your university or institution, collect your student ID. Bring your passport, visa/entry document, and admission letter. Check your institution's international student office for exact requirements — this is an official source, not SettleMap.",
      "Day 5-7: Open a local bank account, or confirm your international card is working. Requirements vary by bank — check each bank's website for documentation needed.",
      "Day 5-7: Register with a local GP or health centre if you have ongoing prescriptions or health needs. Do not wait until you are unwell.",
      "Throughout: Save emergency contacts — campus security, local emergency services number (varies by country), nearest Indian consulate or high commission, and a trusted local contact.",
    ],
  },
  insurance: {
    title: "Insurance and healthcare research",
    items: [
      "Check whether your university or institution includes health coverage — read what is and is not covered.",
      "Research out-of-pocket GP and urgent care costs if not covered — costs vary widely by country.",
      "Carry an adequate supply of any prescription medication with a doctor letter in English.",
      "Check whether your Indian health insurance has any international coverage or travel add-on.",
      "Save the nearest clinic, hospital, and 24-hour pharmacy contact before you need them.",
      "Check if your destination country requires mandatory student health insurance as a visa condition.",
    ],
  },
  campus: {
    title: "Campus arrival prep",
    items: [
      "Confirm your orientation dates and register or RSVP in advance if required.",
      "Know where and when to collect your student ID — this is needed for many services from day one.",
      "Save university support contacts: international student office, accommodation office, student welfare/union.",
      "Map the route from your accommodation to campus before your first day — check public transport options.",
      "Download your campus map, timetable app, and student portal before arrival.",
      "Check if there is an airport pickup or arrival support service from your institution.",
    ],
  },
  parent: {
    title: "Parent and student handover checklist",
    items: [
      "Share emergency contacts before departure: campus security number, student's local SIM number, nearest Indian consulate, a trusted local contact if any.",
      "Agree on a weekly communication schedule — video call day/time, WhatsApp check-ins.",
      "Set up a shared expense agreement or monthly budget transfer plan.",
      "Keep a backup of key documents: passport copy, visa copy, admission letter, accommodation confirmation, travel insurance if applicable.",
      "Agree on how to handle financial emergencies: international bank transfer, emergency fund amount, who to contact.",
      "Student to send parents the local address, university address, and local emergency number on arrival.",
    ],
  },
  budget: {
    title: "Budget planning — first 60 days",
    items: [
      "FIRST 60-DAY BUFFER: Estimate rent + deposit + groceries + transport + SIM + setup costs before you land.",
      "RENT AND DEPOSIT: Budget for 1-2 months deposit plus first month rent payable before or on arrival.",
      "FOOD AND GROCERIES: Research typical weekly grocery costs at your destination — cook at home where possible in early weeks.",
      "TRANSPORT: Research a monthly pass vs daily rates — passes are usually cheaper for regular use.",
      "SETUP COSTS: Bedding, kitchen basics, toiletries, adaptor, and any required course materials.",
      "EMERGENCY BUFFER: Keep at least 4-6 weeks of living costs in reserve as a safety buffer.",
    ],
  },
  provider: {
    title: "Provider research questions",
    items: [
      "HOUSING: What is included in the rent? What is the deposit and return policy? What notice period is required? Is there a guarantor requirement for international students?",
      "SIM / INTERNET: What is the monthly data allowance? Does the plan include calls to India? What is the minimum contract length? Can I get a SIM without a local bank account?",
      "BANKING: What documents do I need to open a student account? Is there a fee-free student account? How long does opening take? Can I open online before arrival?",
      "MOVERS / SHIPPING: What is the estimated transit time? What is restricted or prohibited? What insurance is included in the quote? What is the volumetric weight calculation?",
      "INSURANCE: Is health insurance mandatory for my student visa? What does the university health plan cover and what is excluded? Does it cover pre-existing conditions or ongoing prescriptions? What is the process to make a claim? Always verify coverage requirements with your institution and the relevant immigration authority.",
      "SCHOOL / UNIVERSITY ADMIN: Where do I collect my student ID and when? What is the international student office address and contact? Where do I go for arrival orientation? What documentation do I need to bring on day one?",
      "HEALTHCARE / CLINIC: Is there a GP or student health centre on campus? Do I need to register in advance? What is the nearest 24-hour clinic or walk-in centre? Can I get a repeat prescription for my existing medication here?",
    ],
  },
  research: {
    title: "Research links — where to start",
    items: [
      "IMMIGRATION AND ENTRY: Search your destination country's official immigration or home affairs website for student visa requirements, entry rules, and processing times. Do not rely on third-party summaries — always verify on the official government portal.",
      "UNIVERSITY AND STUDENT SETUP: Check your institution's International Student Office page for arrival, orientation, student ID, accommodation, health coverage, and academic registration guidance.",
      "BANKING: Search for student bank accounts at major banks in your destination city. Look for accounts with no monthly fee for students and low international transfer fees. Compare at least 2-3 options before choosing.",
      "SIM AND INTERNET: Check local telecom providers for prepaid student SIM or monthly plans. Look for: data allowance, international call minutes, and contract length. Prepaid is safest for the first few months.",
      "HOUSING RESEARCH: For off-campus housing, search local property listing sites for your city. Prioritise accommodation close to campus or on a direct transit route. Check student union housing boards and university-approved accommodation lists first.",
      "HEALTHCARE: Search for student health services on your university website. For out-of-pocket care, search for GP clinics near your accommodation and save the address before you need it.",
      "INSURANCE: If not covered by your university, search for international student health insurance plans for your destination country. Compare coverage, exclusions, and claim process before purchasing.",
      "TRANSPORT: Search for monthly transit passes or student discount cards for your city. Check if the university has a bus or shuttle service. Download the local transport app before arriving.",
      "TAX AND PAYROLL (if working): If you plan to work part-time, search for tax filing requirements for student visa holders in your destination country. Check your visa conditions on working hours first.",
      "OFFICIAL GOVERNMENT PORTALS: Bookmark your destination country's main government portal for immigration, tax, healthcare, and local registration — these are the authoritative source for requirements and deadlines.",
      "Note: SettleMap provides research starting points only. All links and information must be verified directly from official sources before acting.",
    ],
  },
};

// -- Main generator --

export function generateStudentMovePack(meta: PackMetadata): StudentMovePack {
  const route = resolveRoute(meta);
  const departure = meta.departureMonth || "your planned departure date";

  const concernLabels = meta.concerns
    ? meta.concerns.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  const coreKeys: ConcernKey[] = ["provider", "parent", "packing", "firstweek", "research"];
  const selectedKeys = new Set<ConcernKey>(coreKeys);
  for (const label of concernLabels) {
    const key = concernKey(label);
    if (key) selectedKeys.add(key);
  }

  const concernSections: PackSection[] = Array.from(selectedKeys).map(
    (k) => CONCERN_SECTIONS[k],
  );

  const researchLinksSection: PackSection = {
    title: "Research links — where to start",
    items: [
      ...getResearchLinkChecklistItems({
        audience: "student",
        destination: route,
        personaTags: ["student"],
        limit: 10,
      }),
      RESEARCH_LINKS_BOUNDARY_COPY,
    ],
  };

  return {
    effectiveRoute: route,
    routeSummary: routeContext(route),

    // V12.12.15 new sections
    executiveSummary: generateExecutiveSummary(meta, route),
    whyUseful: getWhyThisPackIsUseful(),
    afterReceiving: getAfterReceivingChecklist(),
    next7Actions: generateNext7Actions(route),
    officialSourceChecklist: getOfficialSourceChecklist(route),
    routeResearchPrompts: getRouteResearchPrompts(route),
    budgetStarterTable: getBudgetStarterTable(),
    documentTrackerTable: getDocumentTrackerTable(),
    providerWorksheet: getProviderWorksheet(),
    enhancedParentHandover: getEnhancedParentHandover(route, departure),
    copyPasteScripts: getCopyPasteScripts(route),
    qualityGateFooter: getQualityGateFooter(),

    // Original sections
    ninetyDayPlan: {
      title: "90-day route-aware focus plan",
      items: [
        `Weeks 1-2: Confirm visa status, check official entry requirements for ${route}, and finalise accommodation.`,
        "Weeks 3-4: Book flights, arrange travel insurance research, and sort India SIM continuity.",
        "Weeks 5-8: Sort packing list, confirm banking documents, set budget for arrival month.",
        "Weeks 9-10: Do a full document check — passport, visa, admission letter, accommodation confirmation.",
        "Weeks 11-12: Test India SIM roaming or eSIM, confirm local SIM plan, and prepare parent handover checklist.",
        `Arrival week (${departure}): Collect local SIM, check in, register at university, open bank account.`,
        "Days 8-30: Settle in, set up internet banking, join student community, confirm health coverage.",
        "Days 30-90: Build routine, track spending vs budget, review provider contracts, plan first trip home if needed.",
      ],
    },
    firstSevenDays: CONCERN_SECTIONS.firstweek,
    concernSections,
    providerQuestions: CONCERN_SECTIONS.provider,
    parentHandover: CONCERN_SECTIONS.parent,
    packingChecklist: CONCERN_SECTIONS.packing,
    researchLinksSection,
    officialSourceReminder: {
      title: "Official source reminder",
      items: [
        "Always verify visa requirements on your destination country's official government immigration website.",
        "Check university official pages for enrollment, accommodation, orientation, and health cover requirements.",
        "Check the Indian embassy or consulate page for your destination country for emergency consular contacts.",
        "Do not rely solely on peer advice or forums for visa timelines — official sources only.",
        `Route tip: ${routeContext(route)}`,
      ],
    },
    safetyBoundaryNote:
      "SettleMap provides planning checklists and research guides only. It does not provide immigration, legal, tax, financial, property, insurance, medical, school admission or government advice. Always verify requirements with official sources and qualified professionals.",
  };
}

// -- Email formatters --

function sectionToHtml(section: PackSection): string {
  const items = section.items
    .map((i) => `<li style="margin:4px 0;font-size:14px;line-height:1.7;color:#3f3f46;">${i}</li>`)
    .join("");
  return `
    <div style="margin:20px 0;">
      <p style="color:#166534;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px 0;">${section.title}</p>
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
        `<th style="text-align:left;padding:7px 9px;border:1px solid #d1fae5;background:#f0fdf4;font-size:11px;font-weight:700;color:#166534;white-space:nowrap;">${h}</th>`,
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

export function buildPackEmail(
  pack: StudentMovePack,
  buyerName: string | null,
  departureMonth: string | null,
  concerns: string | null,
): { subject: string; html: string; text: string } {
  const greeting = buyerName ? `Hi ${buyerName},` : "Hi,";
  const accent = "#059669";

  const moveDetails = `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <p style="color:#166534;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px 0;">Move details</p>
      <p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Route:</strong> ${pack.effectiveRoute}</p>
      ${departureMonth ? `<p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Expected departure:</strong> ${departureMonth}</p>` : ""}
      ${concerns ? `<p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Main concerns:</strong> ${concerns}</p>` : ""}
    </div>`;

  // Appendix: supplementary legacy content, kept available but moved out of the
  // way of the 19 mandated sections so the promised worksheets are never buried.
  const appendixSections = [
    ...pack.concernSections.filter(
      (s) =>
        s.title !== pack.firstSevenDays.title &&
        s.title !== pack.ninetyDayPlan.title &&
        s.title !== pack.researchLinksSection.title,
    ),
    pack.researchLinksSection,
    pack.officialSourceReminder,
  ];
  const appendixHtml = appendixSections.map(sectionToHtml).join("");
  const appendixText = appendixSections.map(sectionToText).join("\n\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your SettleMap Student Move Pack</title></head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f4f4f5;margin:0;padding:0;">
  <div style="max-width:620px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#059669;padding:28px 32px;">
      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;">SettleMap</h1>
      <p style="color:#d1fae5;margin:4px 0 0 0;font-size:13px;">Student Move Pack -- paid early access</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#18181b;font-size:16px;line-height:1.6;">${greeting}</p>
      <p style="color:#3f3f46;font-size:15px;line-height:1.7;">Thank you for joining SettleMap early access. Your <strong>Student Move Pack</strong> is ready. Payment confirmed by Stripe.</p>
      ${moveDetails}
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:18px 20px;margin:20px 0;">
        ${sectionToHtml(pack.whyUseful)}
      </div>
      <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.executiveSummary)}
      </div>
      <div style="background:#f0fdf4;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.next7Actions)}
      </div>
      <div style="background:#ffffff;border:1px solid #d1fae5;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.afterReceiving)}
      </div>
      <div style="background:#f4f4f5;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.ninetyDayPlan)}
      </div>
      <div style="background:#ffffff;border:1px solid #e4e4e7;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.firstSevenDays)}
      </div>
      <div style="background:#f4f4f5;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.officialSourceChecklist)}
      </div>
      <div style="background:#eff6ff;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.routeResearchPrompts)}
      </div>
      <div style="background:#ffffff;border:1px solid #e4e4e7;border-radius:8px;padding:20px;margin:20px 0;">
        <p style="color:${accent};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px 0;">Your worksheets — copy these into Google Sheets or Excel</p>
        ${tableToHtml(pack.budgetStarterTable, accent)}
        ${tableToHtml(pack.documentTrackerTable, accent)}
        ${tableToHtml(pack.providerWorksheet, accent)}
      </div>
      <div style="background:#f0fdf4;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.enhancedParentHandover)}
      </div>
      <div style="background:#f4f4f5;border-radius:8px;padding:20px;margin:20px 0;">
        ${sectionToHtml(pack.copyPasteScripts)}
      </div>
      <div style="margin:24px 0;">
        <p style="color:#3f3f46;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px 0;">Build your route plan</p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app" style="color:#059669;font-weight:600;">settlemap.app</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/#route-planner" style="color:#059669;">Route planner</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/countries" style="color:#059669;">Route Library</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/services" style="color:#059669;">Services Directory</a></p>
      </div>
      <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:16px 20px;margin:20px 0;">
        <p style="color:#166534;font-size:14px;margin:0;">Tell us what's missing or what worked: <a href="https://settlemap.app/pilot-feedback" style="color:#059669;font-weight:600;">settlemap.app/pilot-feedback</a></p>
      </div>
      <div style="background:#fafafa;border:1px dashed #d4d4d8;border-radius:8px;padding:18px 20px;margin:20px 0;">
        <p style="color:#71717a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px 0;">Appendix — extra planning notes</p>
        ${appendixHtml}
      </div>
      <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:20px 0;">
        ${sectionToHtml(pack.qualityGateFooter)}
      </div>
      <div style="background:#fef9c3;border-left:3px solid #facc15;padding:10px 14px;border-radius:4px;margin:16px 0;">
        <p style="color:#713f12;font-size:12px;line-height:1.6;margin:0;">
          Do not send: passport numbers, visa numbers, bank details, medical details or ID documents.
        </p>
      </div>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />
      <p style="color:#3f3f46;font-size:14px;margin:16px 0 0 0;">Regards,<br><strong>SettleMap Team</strong><br>
        <a href="mailto:support@settlemap.app" style="color:#059669;">support@settlemap.app</a></p>
    </div>
  </div>
</body>
</html>`;

  const text = [
    greeting,
    "",
    "Thank you for joining SettleMap early access. Your Student Move Pack is ready.",
    "",
    `Route: ${pack.effectiveRoute}`,
    departureMonth ? `Expected departure: ${departureMonth}` : "",
    concerns ? `Main concerns: ${concerns}` : "",
    "",
    sectionToText(pack.whyUseful),
    "",
    sectionToText(pack.executiveSummary),
    "",
    sectionToText(pack.next7Actions),
    "",
    sectionToText(pack.afterReceiving),
    "",
    sectionToText(pack.ninetyDayPlan),
    "",
    sectionToText(pack.firstSevenDays),
    "",
    sectionToText(pack.officialSourceChecklist),
    "",
    sectionToText(pack.routeResearchPrompts),
    "",
    "YOUR WORKSHEETS — copy these into Google Sheets or Excel:",
    tableToText(pack.budgetStarterTable),
    "",
    tableToText(pack.documentTrackerTable),
    "",
    tableToText(pack.providerWorksheet),
    "",
    sectionToText(pack.enhancedParentHandover),
    "",
    sectionToText(pack.copyPasteScripts),
    "",
    "BUILD YOUR ROUTE PLAN:",
    "https://settlemap.app",
    "https://settlemap.app/#route-planner",
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
    .filter((l) => l !== undefined)
    .join("\n");

  return { subject: "Your SettleMap Student Move Pack is ready", html, text };
}
