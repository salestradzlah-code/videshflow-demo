// ── SettleMap Premium Relocation Pack Generator ───────────────────────────────
// Pure helper — no side effects, no async. Used by webhook email + success page.

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

export interface PremiumRelocationPack {
  effectiveRoute: string;
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

// ── Route helpers ─────────────────────────────────────────────────────────────
function routeContext(origin: string, destination: string): string {
  const d = destination.toLowerCase();
  const o = origin.toLowerCase();
  if (d.includes("uk") || d.includes("united kingdom") || d.includes("britain"))
    return `${origin} to UK — check your visa category (Skilled Worker, Family, Student, etc.), BRP or eVisa collection, NHS surcharge, and UKVI processing timeline. Refer to UK Visas and Immigration (UKVI) official site and UKCISA for guidance.`;
  if (d.includes("australia"))
    return `${origin} to Australia — check your visa subclass, CoE if applicable, OSHC or OVHC health insurance, and state/territory arrival requirements. Refer to the Australian Department of Home Affairs for official guidance.`;
  if (d.includes("canada"))
    return `${origin} to Canada — check your permit or visa type, Express Entry or LMIA where relevant, provincial health coverage waiting period, and settlement services. Refer to IRCC (Immigration, Refugees and Citizenship Canada) for official guidance.`;
  if (d.includes("germany") || d.includes("eu") || d.includes("europe"))
    return `${origin} to Germany / EU — check APS assessment where relevant, blocked account (Sperrkonto) if applicable, Anmeldung city registration, residence permit appointment timelines, and health insurance requirements. Refer to your German consulate or relevant EU country's official immigration authority.`;
  if (d.includes("singapore"))
    return `${origin} to Singapore — check IPA/pass type (EP, SP, DP, LTVP, student pass), MOM requirements, accommodation near your workplace, banking setup, and SIM. Refer to ICA Singapore and MOM Singapore for official guidance.`;
  if ((d.includes("us") || d.includes("united states") || d.includes("usa")) && !d.includes("australia"))
    return `${origin} to US — check your visa category (H-1B, L-1, F-1, spouse visa, etc.), SEVIS if applicable, Social Security Number eligibility, state tax residency rules, and local setup requirements. Refer to USCIS and your institution or employer's HR for official guidance.`;
  if (d.includes("new zealand"))
    return `${origin} to New Zealand — check your visa type, Accredited Employer Work Visa (AEWV) if employer-sponsored, health insurance, and settlement services. Refer to Immigration New Zealand for official guidance.`;
  if (o.includes("singapore") || o.includes("uk") || o.includes("australia") || o.includes("us") || o.includes("canada"))
    return `${origin} to ${destination} — check entry requirements, visa or permit type, health insurance requirements, tax residency implications of leaving your origin country, and local registration rules. Always verify with the official immigration authority of your destination and consult a tax adviser regarding exit and entry implications.`;
  return `${origin} to ${destination} — check entry and residency requirements with your destination country's official immigration authority. Verify health insurance requirements, local registration obligations, and tax residency implications. Always confirm requirements on official government portals before acting.`;
}

// ── Module keys ───────────────────────────────────────────────────────────────
type ModuleKey = "family" | "couple" | "solo" | "corporate" | "returning" | "pet" | "student";

function parseModules(modules: string | null | undefined): Set<ModuleKey> {
  if (!modules) return new Set();
  const valid: ModuleKey[] = ["family","couple","solo","corporate","returning","pet","student"];
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

  // Always include corporate if whoIsMoving says corporate; same for returning
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
      // BEFORE DECIDING
      "BEFORE DECIDING: Research cost of living in your destination city — rent, groceries, transport, childcare, healthcare. Compare to your current costs.",
      "BEFORE DECIDING: Check visa or permit eligibility for your specific situation — do not assume. Refer to the official immigration authority of your destination country.",
      "BEFORE DECIDING: Confirm employment contract, start date, and any relocation support in writing before committing to a move date.",
      // 90-60 DAYS
      "90–60 DAYS BEFORE: Apply for visa or permit. Start early — processing times vary from 2 weeks to 6 months. Check official processing timeline on the immigration authority website.",
      "90–60 DAYS BEFORE: Research housing in your destination — neighbourhoods, rental range, proximity to workplace or school. Contact 2–3 agents or platforms for availability.",
      "90–60 DAYS BEFORE: Begin school or childcare research if applicable. Check enrollment deadlines and catchment areas.",
      "90–60 DAYS BEFORE: Start pet relocation process if applicable — microchip, vaccinations, import permit, quarantine rules.",
      "90–60 DAYS BEFORE: Notify your current landlord, employer, bank, insurance, and utility providers of your move date and last day of service.",
      // 60-30 DAYS
      "60–30 DAYS BEFORE: Book flights. Confirm flight dates align with visa validity — some visas require you to enter within a fixed window.",
      "60–30 DAYS BEFORE: Arrange temporary accommodation for arrival — at least 2 weeks while you view permanent options in person.",
      "60–30 DAYS BEFORE: Research health insurance for your destination — check whether employer or institution provides it, and when coverage starts.",
      "60–30 DAYS BEFORE: Keep your origin SIM active for at least 6 months — banking OTPs rely on it. Arrange destination SIM plan for arrival week.",
      "60–30 DAYS BEFORE: Confirm international card access — test a small transaction from a travel account or enable your debit card for overseas use.",
      "60–30 DAYS BEFORE: Sort packing — bring essentials, ship or store non-essentials. Decide what to sell, donate, or put in storage.",
      // 30-7 DAYS
      "30–7 DAYS BEFORE: Do a full document check — passport validity (6 months minimum beyond visa), visa, work/admission letter, housing confirmation, insurance, emergency contacts.",
      "30–7 DAYS BEFORE: Sort pet export paperwork and vet health certificate if applicable. Confirm airline cargo booking.",
      "30–7 DAYS BEFORE: Transfer an initial fund to destination or confirm you have access to funds on arrival (cash or card).",
      "30–7 DAYS BEFORE: Notify family of your local address, new SIM number, and emergency contact on arrival.",
      "30–7 DAYS BEFORE: Download offline maps, transport apps, and banking apps for your destination before leaving.",
      // FINAL WEEK
      `FINAL WEEK: Confirm accommodation check-in details, arrival contact, and timing.`,
      "FINAL WEEK: Carry all critical documents in hand luggage — do not put passport, visa, or admission letter in checked bags.",
      "FINAL WEEK: Carry prescription medicines with a doctor letter. Bring at least 4 weeks' supply in hand luggage.",
      "FINAL WEEK: Inform your current bank of your travel dates to avoid card blocks on arrival.",
      // TRAVEL DAY
      "TRAVEL DAY: Keep travel documents, phone, charger, and 2–3 days of medication in your carry-on. Check flight status and boarding requirements 24 hours in advance.",
      "TRAVEL DAY: Save offline: accommodation address, arrival emergency contact, and local transport options from airport.",
      // FIRST 7 DAYS
      "FIRST 7 DAYS: Get a local SIM or activate eSIM — data is essential from day one.",
      "FIRST 7 DAYS: Check into your accommodation, confirm rental agreement terms, and get the landlord contact saved.",
      "FIRST 7 DAYS: Buy household essentials. Note what is provided — do not over-buy before confirming what comes with the property.",
      "FIRST 7 DAYS: Set up local transport — research daily/weekly/monthly pass options.",
      "FIRST 7 DAYS: Register at your employer, institution, or local authority as required. Bring passport, visa/entry document, and address proof.",
      "FIRST 7 DAYS: Open a local bank account or confirm your international account works for daily expenses.",
      "FIRST 7 DAYS: Register with a GP or health centre — do not wait until you are unwell.",
      "FIRST 7 DAYS: Save emergency contacts — local emergency number (varies by country), nearest hospital, nearest home consulate or high commission.",
      // FIRST 30 DAYS
      "FIRST 30 DAYS: Complete any mandatory registration — address registration (Anmeldung in Germany, IRCC in Canada, ICA in Singapore, etc.) within the required deadline. Check your destination's specific rule.",
      "FIRST 30 DAYS: Set up international transfer for home remittances — compare Wise, Revolut, bank transfer, or local equivalent for fees and rates.",
      "FIRST 30 DAYS: Finalise school or childcare enrolment if applicable.",
      "FIRST 30 DAYS: Confirm health insurance is active and you know the claims process.",
      "FIRST 30 DAYS: Track spending vs budget — adjust if early expenses exceed estimate.",
      // LONG TERM
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
      "MOVING AND SHIPPING: Get 2–3 quotes. Costs depend on volume, distance, and transit time. Air freight is fast but expensive; sea freight is cheaper for large volumes. Factor in customs duty for high-value items.",
      "INSURANCE: Health insurance (if not employer-provided), renters insurance (recommended for contents), and travel insurance for the move period. Compare premiums and exclusions before purchasing.",
      "SIM AND INTERNET: Monthly SIM plan plus home broadband setup. Research whether your accommodation includes broadband — many rentals do not.",
      "TRANSPORT: Monthly pass vs pay-per-use. Research student, senior, or employer discount cards for your city.",
      "FOOD AND FIRST WEEK ESSENTIALS: Budget for eating out or takeaway during the first week before you set up a kitchen. Then estimate weekly grocery costs for your household size.",
      "SCHOOL OR CHILDCARE (if applicable): Registration fees, term fees, uniform or materials. Check whether government subsidies or employer contributions apply.",
      "PET COSTS (if applicable): Import permit fees, quarantine (if required), vet health certificate, cargo fees, crate, and first vet visit at destination.",
      "SETUP COSTS: Bedding, kitchen basics, cleaning supplies, adaptor, and any furniture not provided by your accommodation.",
      "EMERGENCY BUFFER: Keep a minimum of 8–12 weeks of total living costs as an untouched emergency reserve. This covers job gap, delayed deposit return, or unexpected medical cost.",
      "CURRENCY TRANSFER STRATEGY: Compare Wise, Revolut, your bank's international wire, or a specialist FX broker. Check rates and fees for your currency pair. Transfer in tranches if rates are volatile rather than one large transfer.",
      "BUDGET TRACKING NOTE: Track actual spend vs estimate weekly for the first 60 days. Adjust the categories above with real numbers once you are on the ground.",
    ],
  };

  const documentTracker: PackSection = {
    title: "Document tracker",
    items: [
      "PASSPORT: Check validity — must be valid for at least 6 months beyond your intended stay in most destinations. Renew before applying for a visa if close to expiry. Carry original + digital scan in a secure cloud folder.",
      "VISA OR STATUS DOCUMENT: Your visa sticker, entry vignette, or approval letter. Know your visa type, permitted stay duration, and conditions. Carry a printed copy.",
      "EMPLOYMENT OR ADMISSION LETTER: Signed offer letter or admission confirmation from your employer or institution. Carry original. Used for banking, housing, and registration.",
      "HOUSING DOCUMENTS: Signed lease or rental agreement, landlord contact, and accommodation confirmation for arrival. If staying in temporary accommodation, keep the booking confirmation.",
      "MEDICAL AND VACCINATION RECORDS: Personal health record, vaccination card or book (especially for children), and a list of any ongoing prescriptions with generic names (not just brand names).",
      "SCHOOL RECORDS (if applicable): Academic transcripts, school leaving certificate, report cards, and any standardised test results for school-age children.",
      "PET DOCUMENTS (if applicable): Microchip certificate, vaccination record, rabies titre test result, import permit, quarantine booking confirmation, and vet health certificate.",
      "BANKING AND TAX DOCUMENTS: Bank statements (last 3–6 months), proof of funds if required for visa, home country tax ID, and employer payslips if used for proof of income.",
      "IDENTITY DOCUMENTS: Birth certificate, marriage certificate (if applicable), and national ID card. Keep certified copies — originals rarely need to leave your secure folder.",
      "EMERGENCY CONTACTS PAGE: One printed A4 page with: your home consulate or high commission address and number, local emergency services number, employer HR contact, landlord contact, nearest hospital, and family contact in home country.",
      "ORIGINALS TO CARRY IN HAND LUGGAGE: Passport, visa/entry document, admission or employment letter, accommodation confirmation, pet travel documents (if applicable), and emergency contacts page. Never put these in checked baggage.",
      "SECURE BACKUP: Scan all key documents to a password-protected cloud folder (Google Drive, iCloud, etc.) shared with one trusted family member. This is your recovery option if documents are lost.",
    ],
  };

  const firstWeekPlan: PackSection = {
    title: "First week setup plan",
    items: [
      "DAY 1 — SIM / eSIM: Get a local SIM or activate a pre-ordered eSIM at the airport or nearest telecom store. Data is essential from arrival. Prepaid is safer for the first month while you assess plans.",
      "DAY 1–2 — MONEY AND BANKING: Confirm your international card works for local ATM and card payments. If not, use a spare card or cash buffer. Open a local bank account as soon as you have an address — some banks accept a temporary accommodation letter.",
      "DAY 1–2 — TRANSPORT: Get a local transit card or research the app for your city's transport system. Check whether a monthly pass makes financial sense from week one.",
      "DAY 2–3 — GROCERIES AND HOUSEHOLD ESSENTIALS: Buy 1–2 weeks of basics. Check whether your accommodation has cooking facilities and what is provided — do not over-buy.",
      "DAY 3–5 — HEALTHCARE / CLINIC REGISTRATION: Register with a local GP or health centre before you need medical help. Bring your passport and proof of address or accommodation. If you take regular medication, ask about repeat prescriptions at your first visit.",
      "DAY 1–3 — HOUSING CHECK-IN: Confirm check-in details with your landlord or accommodation provider. Document the property condition with photos on arrival day — this protects your deposit.",
      "DAY 3–5 — EMPLOYER, UNIVERSITY, OR SCHOOL CHECK-IN: Complete any mandatory registration with your employer, institution, or local authority within the required deadline. Bring original documents.",
      "DAY 5–7 — ADDRESS UPDATE: Update your address with: your bank, insurance provider, any government registrations (e.g., tax, social security), and family at home.",
      "THROUGHOUT — EMERGENCY CONTACTS: Save to your phone: local emergency services number, nearest hospital address, home consulate or high commission, employer HR contact, and landlord.",
      "WEEK 1 SAFETY NOTE: Do not commit to long-term contracts (gym, internet, mobile plan) in week one unless you are certain of your address and duration of stay. One month of flexible arrangements is worth the extra cost.",
    ],
  };

  // Build persona modules based on parsed modules
  const personaModules: PackSection[] = [];
  const moduleOrder: ModuleKey[] = ["family", "couple", "solo", "corporate", "returning", "pet", "student"];
  for (const key of moduleOrder) {
    if (modules.has(key)) personaModules.push(PERSONA_MODULES[key]);
  }
  // If no modules selected, include a general relocation support note
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
      'HOUSING ENQUIRY: "Hi, I am relocating to [city] in [month] and I am looking for a [flat/house/room] near [area or landmark]. Could you let me know: what is included in the rent, what is the deposit amount and return conditions, what notice period is required, and is there a guarantor requirement for international residents?" — Do not sign any agreement without reading the full lease. Verify with a local tenancy advisory service if in doubt.',
      'MOVER QUOTE ENQUIRY: "I am moving from [origin] to [destination] in [month]. The volume is approximately [boxes/cubic metres]. Could you provide a quote covering: packing service if available, transit time, insurance included in the quote, customs clearance assistance, and the prohibited items list?" — Get at least 2–3 quotes. Verify the mover is licensed and insured in your destination country.',
      'BANKING ENQUIRY: "I am relocating to [city] in [month]. Could you tell me: what documents are required to open an account as a new resident or visa holder, whether there is a fee-free account for new arrivals or international customers, and how long the account opening process takes?" — Some banks allow online pre-registration. Verify eligibility for your visa type.',
      'SIM / eSIM ENQUIRY: "I am arriving in [city] in [month] and need a SIM or eSIM. Could you confirm: the data allowance, whether international calls to [home country] are included, the minimum contract length, and whether I can get a SIM without a local bank account on arrival?" — Prepaid SIMs avoid contract lock-in for the first 1–2 months.',
      'INSURANCE ENQUIRY: "I am relocating to [destination] and need [health/renters/travel] insurance. Could you confirm: what is covered and what is excluded, whether pre-existing conditions are covered, what the claims process is, and whether there is a waiting period before coverage starts?" — Always read the policy document before purchasing. Do not rely solely on a sales summary.',
      'SCHOOL / CHILDCARE ENQUIRY: "I am relocating to [city] in [month] with a child aged [age]. Could you let me know: whether there are current enrolment vacancies, what the enrolment deadline is, what documents are required, and whether there are fees for the current term?" — Verify curriculum, language of instruction, and any mandatory uniform or materials costs before committing.',
      'UNIVERSITY ADMIN ENQUIRY: "I am an incoming [undergraduate/postgraduate] student arriving in [month]. Could you confirm: where I collect my student ID, the international student office address and contact, the orientation schedule, and what documents I need to bring on day one?" — Verify all information on the university official website — not student forums.',
      'HEALTHCARE / CLINIC ENQUIRY: "I am a new resident in [city] looking to register with a GP or health centre. Could you let me know: whether you are accepting new patients, what documents are required to register, whether you can prescribe continuation of an existing medication, and what the consultation fee is if I do not yet have local health cover?" — In some countries, NHS or equivalent covers GP registration from day one. Verify your entitlement based on your visa or residency status.',
      'PET RELOCATION ENQUIRY: "I am relocating from [origin] to [destination] in [month] with a [dog/cat/other]. I need support with: import permit application, quarantine arrangements if required, and airline cargo booking. Could you confirm the process, timeline, and estimated cost?" — Only use IATA-certified pet transport agents. Verify all import rules directly with the official veterinary or customs authority of your destination.',
      'CORPORATE HR / RELOCATION ALLOWANCE ENQUIRY: "I am confirming the details of my relocation package for my move from [origin] to [destination]. Could you confirm in writing: the total allowance, what is covered and what requires pre-approval, the reimbursement process and deadlines, and the contact for any local settlement support?" — Get all relocation package details in writing before committing to travel dates.',
      'RETURNING HOME REACTIVATION ENQUIRY: "I am returning to [home country] after [X years] abroad. I would like to reactivate my [bank account / national ID / local registration]. Could you confirm: what documents are required, whether I can initiate this process online before arrival, and what the processing time is?" — Check whether your bank account is dormant, closed, or still active. Contact your bank before returning to avoid being unable to access funds on arrival.',
      "PROVIDER REFERENCE POLICY: SettleMap does not recommend, verify, rank, or endorse any specific provider. Scripts above are neutral templates. You must verify credentials, licensing, pricing, and suitability directly. Official links should always be checked first. If a commercial provider is referenced in your research, verify independently before engaging.",
    ],
  };

  const researchLinks: PackSection = {
    title: "Research links — where to verify",
    items: [
      "OFFICIAL GOVERNMENT PORTAL: Search '[destination country] official government portal' for immigration, tax, healthcare, and local registration. Bookmark this — it is the authoritative source for requirements and deadlines. Do not rely on third-party summaries for official rules.",
      "IMMIGRATION AND ENTRY RULES: Search '[destination country] immigration official site' for visa, permit, entry requirements, and processing timelines. If employer-sponsored, your employer or HR should provide the official MOM, USCIS, UKVI, or equivalent contact.",
      "HOUSING AND RENTAL: Search licensed property agents or official rental listing platforms in your destination city. Check for a local tenancy advisory service or housing authority — most countries have one that provides free guidance on tenant rights.",
      "BANKING AND REMITTANCE: Search 'bank account for new residents [destination city]' or 'student/international account [bank name]'. For remittance, compare Wise, Revolut, your bank's international wire, or a licensed FX broker for your currency pair.",
      "SIM, eSIM AND INTERNET: Search the three largest telecom providers in your destination country for prepaid and monthly plans. Check whether your destination has eSIM support on arrival.",
      "HEALTHCARE: Search '[destination country] national health service' or 'GP registration [destination city]'. For private cover, compare licensed health insurance providers registered in your destination country.",
      "INSURANCE: Search 'expat health insurance [destination country]' or 'renters insurance [destination city]'. Verify the insurer is licensed in your destination. Check the Financial Services Regulatory Authority or equivalent for your destination.",
      "TRANSPORT: Search '[destination city] public transport card' or '[destination city] monthly pass'. Download the official transport authority app before arriving.",
      "TAX AND PAYROLL: Search '[destination country] tax for new residents' or '[destination country] income tax for [visa type]'. Consult a qualified tax adviser for cross-border tax obligations — do not rely on general forum advice.",
      "IDENTITY AND REGISTRATION: Search '[destination country] address registration for new arrivals' — many countries have mandatory registration (Anmeldung in Germany, address notification in Singapore, etc.) with deadlines. Check your destination's requirement.",
      "SCHOOLS AND CHILDCARE: Search '[destination city] school enrollment international students' or '[destination city] nursery and childcare'. Check the local education authority website for catchment areas and enrollment deadlines.",
      "PETS: Search '[destination country] pet import rules [official authority]' — e.g., Australian Department of Agriculture for Australia, APHA for UK, AVS for Singapore. Always use the official authority website, not third-party summaries.",
      "MOVING AND SHIPPING: Compare at least 2–3 quotes from licensed international removals companies. Verify they are FIDI FAIM accredited or equivalent for your destination. Search '[destination country] customs rules for household goods' for duty-free allowances.",
      "EMERGENCY NUMBERS: Research your destination country's emergency number (not always 999 or 911 — varies by country), nearest hospital, and nearest home country consulate or high commission before arrival.",
      "CONSUMER PROTECTION: Search '[destination country] consumer protection authority' for your rights on housing, services, and financial products. If you experience a dispute with a provider, this is your first point of reference.",
      "Note: SettleMap provides research starting points only. All links and information must be verified directly from official sources before acting. SettleMap does not recommend, verify, rank, or endorse providers.",
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

// ── Email formatters ──────────────────────────────────────────────────────────
function sectionToHtml(section: PackSection): string {
  const items = section.items
    .map((i) => `<li style="margin:4px 0;font-size:14px;line-height:1.7;color:#3f3f46;">${i}</li>`)
    .join("");
  return `
    <div style="margin:20px 0;">
      <p style="color:#7c3aed;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px 0;">${section.title}</p>
      <ul style="padding-left:20px;margin:0;">${items}</ul>
    </div>`;
}

function sectionToText(section: PackSection): string {
  return `${section.title.toUpperCase()}\n${section.items.map((i) => `- ${i}`).join("\n")}`;
}

export function buildPremiumPackEmail(
  pack: PremiumRelocationPack,
  buyerName: string | null,
  timingMonth: string | null,
  modules: string | null,
): { subject: string; html: string; text: string } {
  const greeting = buyerName ? `Hi ${buyerName},` : "Hi,";

  const moveDetails = `
    <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <p style="color:#7c3aed;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px 0;">Move details</p>
      <p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Route:</strong> ${pack.effectiveRoute}</p>
      ${timingMonth ? `<p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Planned timing:</strong> ${timingMonth}</p>` : ""}
      ${modules ? `<p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Add-on modules:</strong> ${modules}</p>` : ""}
    </div>`;

  const mainSections = [
    pack.routeSnapshot,
    pack.detailedChecklist,
    pack.budgetTemplate,
    pack.documentTracker,
    pack.firstWeekPlan,
    ...pack.personaModules,
    pack.providerScripts,
    pack.researchLinks,
    pack.officialSourceReminder,
  ];

  const sectionsHtml = mainSections.map(sectionToHtml).join("");
  const sectionsText = mainSections.map(sectionToText).join("\n\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your SettleMap Premium Relocation Pack</title></head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f4f4f5;margin:0;padding:0;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#7c3aed;padding:28px 32px;">
      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;">SettleMap</h1>
      <p style="color:#ede9fe;margin:4px 0 0 0;font-size:13px;">Premium Relocation Pack — paid</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#18181b;font-size:16px;line-height:1.6;">${greeting}</p>
      <p style="color:#3f3f46;font-size:15px;line-height:1.7;">Thank you for joining SettleMap. Your <strong>Premium Relocation Pack</strong> is ready. Payment confirmed by Stripe.</p>
      ${moveDetails}
      <div style="background:#f4f4f5;border-radius:8px;padding:20px;margin:24px 0;">
        ${sectionsHtml}
      </div>
      <div style="margin:24px 0;">
        <p style="color:#3f3f46;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px 0;">Build your route plan</p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app" style="color:#7c3aed;font-weight:600;">settlemap.app</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/#route-selector" style="color:#7c3aed;">Route planner &rarr;</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/countries" style="color:#7c3aed;">Route Library</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/services" style="color:#7c3aed;">Services Directory</a></p>
      </div>
      <div style="background:#fef9c3;border-left:3px solid #facc15;padding:10px 14px;border-radius:4px;margin:16px 0;">
        <p style="color:#713f12;font-size:12px;line-height:1.6;margin:0;">
          Do not send: passport numbers, visa numbers, bank details, medical details or ID documents.
        </p>
      </div>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />
      <p style="color:#71717a;font-size:12px;line-height:1.6;">${pack.safetyBoundaryNote}</p>
      <p style="color:#3f3f46;font-size:14px;margin:16px 0 0 0;">Regards,<br><strong>Ash</strong><br>SettleMap<br>
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
    sectionsText,
    "",
    "BUILD YOUR ROUTE PLAN:",
    "https://settlemap.app",
    "https://settlemap.app/#route-selector",
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

  return { subject: "Your SettleMap Premium Relocation Pack is ready", html, text };
}
