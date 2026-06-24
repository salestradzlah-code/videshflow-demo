// ── SettleMap Student Move Pack Generator ────────────────────────────────────────────
// Pure helper — no side effects, no async. Used by webhook email + success page.

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
  | "provider";

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
      "BRING: Original official documents (passport, visa, admission letter, academic certificates), prescription medicines with a doctor letter, laptop and chargers, India SIM card (keep active), formal clothes for admin days.",
      "BUY AT DESTINATION: Bulky items (towels, bedding, kitchen basics), toiletries, heavy winter clothing — these are usually cheaper locally.",
      "ESSENTIAL FIRST WEEK BAG: 3–5 days of casual clothes, travel adaptor, power bank, small first-aid kit, 2–3 weeks of any prescription medication.",
      "CHECK CUSTOMS RULES: Do not pack restricted or prohibited items — check your destination country's customs guidelines.",
      "DOCUMENTS TO CARRY IN HAND LUGGAGE: Passport, visa, admission letter, accommodation booking confirmation, emergency contacts.",
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
      "Day 1: Get a local SIM or activate your eSIM — data is essential from day one.",
      "Day 1–2: Check into your accommodation and confirm your rental or temporary stay.",
      "Day 2–3: Buy essential groceries, a travel adaptor, and household basics.",
      "Day 3–4: Set up local transport — research bus/rail card, app, or pass for your city.",
      "Day 3–5: Register at your university or institution, collect your student ID.",
      "Day 5–7: Open a local bank account, or confirm your international card is working.",
      "Throughout: Save emergency contacts — campus security, local emergency services (not 999/911 by default in all countries), nearest Indian consulate.",
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
  const coreKeys: ConcernKey[] = ["provider", "parent", "packing", "firstweek"];
  const selectedKeys = new Set<ConcernKey>(coreKeys);
  for (const label of concernLabels) {
    const key = concernKey(label);
    if (key) selectedKeys.add(key);
  }

  const concernSections: PackSection[] = Array.from(selectedKeys).map(
    (k) => CONCERN_SECTIONS[k],
  );

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
      (s) => s.title !== pack.firstSevenDays.title && s.title !== pack.ninetyDayPlan.title,
    ),
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
