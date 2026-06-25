// ── SettleMap Student Move Pack Generator ────────────────────────────────────────────
// Pure helper — no side effects, no async. Used by webhook email + success page.

import {
  RESEARCH_LINKS_BOUNDARY_COPY,
  getResearchLinkChecklistItems,
} from "@/data/researchLinksRegistry";

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

export interface StudentMovePack {
  effectiveRoute: string;
  routeSummary: string;
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

// ── Route helpers ─────────────────────────────────────────────────────
function resolveRoute(meta: PackMetadata): string {
  if (meta.moveRoute === "Other route" && meta.otherRoute?.trim())
    return meta.otherRoute.trim();
  return meta.moveRoute?.trim() || "Your route";
}

function routeContext(route: string): string {
  const r = route.toLowerCase();
  // IMPORTANT: check "australia" BEFORE "us" — "australia" contains "us" as a substring.
  // Use word-boundary regex for US so "australia" cannot accidentally match.
  if (r.includes("australia")) return "India to Australia — check your CoE, student visa (subclass 500), OSHC health insurance, and university arrival reporting requirements. Refer to the Australian Department of Home Affairs and your institution's international student office for official guidance.";
  if (r.includes("canada")) return "India to Canada — check your LOA, study permit, PAL/SDS requirements where relevant, and GIC if required by your institution. Check provincial health coverage requirements. Refer to IRCC (Immigration, Refugees and Citizenship Canada) and your institution for official guidance.";
  if (r.includes("uk")) return "India to UK — check your CAS, student visa, BRP/eVisa collection, NHS surcharge, and UKVI visa timeline. Refer to UKCISA and the UK Visas and Immigration (UKVI) official site for official guidance.";
  if (r.includes("germany") || r.includes("eu")) return "India to Germany / EU — check APS assessment where relevant, blocked account (Sperrkonto), health insurance, Anmeldung city registration, and residence permit appointment timelines. Refer to your German consulate and institution's international office for official guidance.";
  if (r.includes("singapore")) return "India to Singapore — check IPA/student pass requirements, accommodation near your institution, local SIM setup, bank and payment account requirements, and campus reporting dates. Refer to ICA Singapore and your institution for official guidance.";
  // Word-boundary check for US — ensures "australia" does not match
  if (/\bus\b/.test(r) || r.includes("united states") || r.includes("usa")) return "India to US — check your I-20, SEVIS fee payment, F-1 visa interview requirements, and earliest entry date rules. Refer to your DSO, the US Embassy, and the official SEVIS site for official guidance.";
  return "Check your destination country's official immigration and student entry requirements, university arrival guidance, housing rules, health coverage requirements, and local registration requirements.";
}

// ── Concern section generators ────────────────────────────────────────────
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
      'Questions to ask before booking: Is utilities included? What is the deposit amount and return policy? What is the notice period? Is there a guarantor requirement?',
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
      "HAND LUGGAGE — DOCUMENTS: Passport, visa/entry document, original admission letter, accommodation booking confirmation, printed emergency contacts (campus security, nearest Indian consulate, local contact). Keep these with you, not in checked baggage.",
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
      "Carry a small amount of local currency in cash for the first 24–48 hours.",
    ],
  },
  firstweek: {
    title: "First 7 days setup guide",
    items: [
      "Day 1: Get a local SIM or activate your eSIM — data is essential from day one. Prepaid SIMs are usually available at the airport or major supermarkets.",
      "Day 1–2: Check into your accommodation and confirm your rental or temporary stay. Get your landlord or hall contact number saved immediately.",
      "Day 2–3: Buy essential groceries, a travel adaptor, and household basics. Note: Bedding and kitchen items can often wait 1–2 days once you confirm what is provided.",
      "Day 3–4: Set up local transport — research bus/rail card, app, or pass for your city. Student discount cards are often available from day one with a valid student ID.",
      "Day 3–5: Register at your university or institution, collect your student ID. Bring your passport, visa/entry document, and admission letter. Check your institution's international student office for exact requirements — this is an official source, not SettleMap.",
      "Day 5–7: Open a local bank account, or confirm your international card is working. Requirements vary by bank — check each bank's website for documentation needed.",
      "Day 5–7: Register with a local GP or health centre if you have ongoing prescriptions or health needs. Do not wait until you are unwell.",
      "Throughout: Save emergency contacts — campus security, local emergency services number (varies by country — do not assume 999 or 911), nearest Indian consulate or high commission, and a trusted local contact.",
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
      "RENT AND DEPOSIT: Budget for 1–2 months deposit plus first month rent payable before or on arrival.",
      "FOOD AND GROCERIES: Research typical weekly grocery costs at your destination — cook at home where possible in early weeks.",
      "TRANSPORT: Research a monthly pass vs daily rates — passes are usually cheaper for regular use.",
      "SETUP COSTS: Bedding, kitchen basics, toiletries, adaptor, and any required course materials.",
      "EMERGENCY BUFFER: Keep at least 4–6 weeks of living costs in reserve as a safety buffer.",
    ],
  },
  provider: {
    title: "Provider research questions",
    items: [
      'HOUSING: "What is included in the rent?", "What is the deposit and return policy?", "What notice period is required?", "Is there a guarantor requirement for international students?"',
      'SIM / INTERNET: "What is the monthly data allowance?", "Does the plan include calls to India?", "What is the minimum contract length?", "Can I get a SIM without a local bank account?"',
      'BANKING: "What documents do I need to open a student account?", "Is there a fee-free student account?", "How long does opening take?", "Can I open online before arrival?"',
      'MOVERS / SHIPPING: "What is the estimated transit time?", "What is restricted or prohibited?", "What insurance is included in the quote?", "What is the volumetric weight calculation?"',
      'INSURANCE: "Is health insurance mandatory for my student visa?", "What does the university health plan cover and what is excluded?", "Does it cover pre-existing conditions or ongoing prescriptions?", "What is the process to make a claim?" — Always verify coverage requirements with your institution and the relevant immigration authority.',
      'SCHOOL / UNIVERSITY ADMIN: "Where do I collect my student ID and when?", "What is the international student office address and contact?", "Where do I go for arrival orientation?", "What documentation do I need to bring on day one?"',
      'HEALTHCARE / CLINIC: "Is there a GP or student health centre on campus?", "Do I need to register in advance?", "What is the nearest 24-hour clinic or walk-in centre?", "Can I get a repeat prescription for my existing medication here?"',
    ],
  },
  research: {
    title: "Research links — where to start",
    items: [
      "IMMIGRATION AND ENTRY: Search your destination country's official immigration or home affairs website for student visa requirements, entry rules, and processing times. Do not rely on third-party summaries — always verify on the official government portal.",
      "UNIVERSITY AND STUDENT SETUP: Check your institution's International Student Office page for arrival, orientation, student ID, accommodation, health coverage, and academic registration guidance.",
      "BANKING: Search for student bank accounts at major banks in your destination city. Look for accounts with no monthly fee for students and low international transfer fees. Compare at least 2–3 options before choosing.",
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

// ── Main generator ────────────────────────────────────────────────────────────
export function generateStudentMovePack(meta: PackMetadata): StudentMovePack {
  const route = resolveRoute(meta);
  const departure = meta.departureMonth || "your planned departure date";

  // Parse concern labels
  const concernLabels = meta.concerns
    ? meta.concerns.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  // Always include provider + parent + packing as core sections
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

    ninetyDayPlan: {
      title: "90-day route-aware focus plan",
      items: [
        `Weeks 1–2: Confirm visa status, check official entry requirements for ${route}, and finalise accommodation.`,
        "Weeks 3–4: Book flights, arrange travel insurance research, and sort India SIM continuity.",
        "Weeks 5–8: Sort packing list, confirm banking documents, set budget for arrival month.",
        "Weeks 9–10: Do a full document check — passport, visa, admission letter, accommodation confirmation.",
        "Weeks 11–12: Test India SIM roaming or eSIM, confirm local SIM plan, and prepare parent handover checklist.",
        `Arrival week (${departure}): Collect local SIM, check in, register at university, open bank account.`,
        "Days 8–30: Settle in, set up internet banking, join student community, confirm health coverage.",
        "Days 30–90: Build routine, track spending vs budget, review provider contracts, plan first trip home if needed.",
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

// ── Email formatters ──────────────────────────────────────────────────────────
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

export function buildPackEmail(
  pack: StudentMovePack,
  buyerName: string | null,
  departureMonth: string | null,
  concerns: string | null,
): { subject: string; html: string; text: string } {
  const greeting = buyerName ? `Hi ${buyerName},` : "Hi,";

  const moveDetails = `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <p style="color:#166534;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px 0;">Move details</p>
      <p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Route:</strong> ${pack.effectiveRoute}</p>
      ${departureMonth ? `<p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Expected departure:</strong> ${departureMonth}</p>` : ""}
      ${concerns ? `<p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Main concerns:</strong> ${concerns}</p>` : ""}
    </div>`;

  const allSections = [
    pack.ninetyDayPlan,
    pack.firstSevenDays,
    ...pack.concernSections.filter(
      (s) =>
        s.title !== pack.firstSevenDays.title &&
        s.title !== pack.ninetyDayPlan.title &&
        s.title !== pack.researchLinksSection.title,
    ),
    pack.researchLinksSection,
    pack.officialSourceReminder,
  ];

  const sectionsHtml = allSections.map(sectionToHtml).join("");
  const sectionsText = allSections.map(sectionToText).join("\n\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your SettleMap Student Move Pack</title></head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f4f4f5;margin:0;padding:0;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#059669;padding:28px 32px;">
      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;">SettleMap</h1>
      <p style="color:#d1fae5;margin:4px 0 0 0;font-size:13px;">Student Move Pack — paid early access</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#18181b;font-size:16px;line-height:1.6;">${greeting}</p>
      <p style="color:#3f3f46;font-size:15px;line-height:1.7;">Thank you for joining SettleMap early access. Your <strong>Student Move Pack</strong> is ready. Payment confirmed by Stripe.</p>
      ${moveDetails}
      <div style="background:#f4f4f5;border-radius:8px;padding:20px;margin:24px 0;">
        ${sectionsHtml}
      </div>
      <div style="margin:24px 0;">
        <p style="color:#3f3f46;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px 0;">Build your route plan</p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app" style="color:#059669;font-weight:600;">settlemap.app</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/#route-planner" style="color:#059669;">Route planner &rarr;</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/countries" style="color:#059669;">Route Library</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/services" style="color:#059669;">Services Directory</a></p>
      </div>
      <div style="background:#fef9c3;border-left:3px solid #facc15;padding:10px 14px;border-radius:4px;margin:16px 0;">
        <p style="color:#713f12;font-size:12px;line-height:1.6;margin:0;">
          Do not send: passport numbers, visa numbers, bank details, medical details or ID documents.
        </p>
      </div>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />
      <p style="color:#71717a;font-size:12px;line-height:1.6;">${pack.safetyBoundaryNote}</p>
      <p style="color:#3f3f46;font-size:14px;margin:16px 0 0 0;">Regards,<br><strong>Ash</strong><br>SettleMap<br>
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
    sectionsText,
    "",
    "BUILD YOUR ROUTE PLAN:",
    "https://settlemap.app",
    "https://settlemap.app/#route-planner",
    "https://settlemap.app/countries",
    "https://settlemap.app/services",
    "",
    "Do not send: passport numbers, visa numbers, bank details, medical details or ID documents.",
    "",
    pack.safetyBoundaryNote,
    "",
    "Regards, Ash — SettleMap | support@settlemap.app",
  ]
    .filter((l) => l !== undefined)
    .join("\n");

  return { subject: "Your SettleMap Student Move Pack is ready", html, text };
}
