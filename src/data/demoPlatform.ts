import { BadgeCheck, Bot, Building2, Car, FileCheck2, FileText, Globe2, GraduationCap, HeartHandshake, Home, Landmark, Luggage, MapPin, Plane, PlugZap, ShieldCheck, ShoppingBag, Smartphone, Sofa, UsersRound, Wifi, Wrench } from "lucide-react";

export type DestinationKey =
  | "india"
  | "singapore"
  | "united-kingdom"
  | "united-states"
  | "canada"
  | "australia"
  | "united-arab-emirates"
  | "germany-eu"
  | "saudi-gulf"
  | "portugal"
  | "other";

export type MoveReasonKey =
  | "job"
  | "corporate"
  | "student"
  | "family"
  | "pr"
  | "business"
  | "short"
  | "returning"
  | "landed"
  | "retirement"
  | "domestic";

export type ProfileKey = "solo" | "couple" | "familyChild" | "familyChildren" | "student" | "seniors" | "retiree" | "elderlyParent" | "preferNotToSay";

export type PetKey = "none" | "dog" | "cat" | "multiple" | "other";

export type AddOnKey =
  | "pets"
  | "schooling"
  | "seniorHealthcare"
  | "medication"
  | "vehicle"
  | "bankSimContinuity"
  | "contractsTerminate"
  | "contractsSetup"
  | "insurance"
  | "temporaryStay"
  | "furniture"
  | "storage"
  | "languageCommunity";

export type TimelinePhase = "Before you move" | "Days 1 to 7" | "Days 8 to 30" | "Days 31 to 90";

// V11.3 — task tier shown in the action plan UI. Falls back to a priority-based heuristic
// (High -> Core, Medium -> Recommended, Low -> Optional) in src/lib/projectPlan.ts when a task
// does not set this explicitly, so existing task literals do not all need to be touched.
export type TaskTier = "Core" | "Recommended" | "Optional";

// V11.3 — named action-plan section used for collapsible grouping. Falls back to a
// phase/category-based heuristic in src/lib/projectPlan.ts when not set explicitly.
export type PlanSection =
  | "Start here"
  | "Official checks"
  | "Documents"
  | "Housing"
  | "Money and banking"
  | "Arrival week"
  | "First 30 days"
  | "Optional extras";

export type TimelineTask = {
  id: string;
  phase: TimelinePhase;
  title: string;
  description: string;
  timing: string;
  priority: "High" | "Medium" | "Low";
  category: string;
  // V11.3 additions — optional so existing task literals remain valid without edits.
  nextStep?: string;
  tier?: TaskTier;
  section?: PlanSection;
  // V11.5 additions — make action cards actionable (where to go, how to do it, what to
  // prepare, suggested button label, source type, future AI assist idea). All optional so
  // existing task literals remain valid without edits; ProjectPlanBoard.tsx renders these in
  // a collapsed "How to do this" drawer when present.
  whereToGo?: string;
  howTo?: string;
  whatToPrepare?: string[];
  buttonLabel?: string;
  sourceType?: "Official source" | "Research option";
  providerQuestions?: string[];
  aiAssistIdea?: string;
  // V11.8 additions — optional dependency note shown in the "How to do this" drawer when a task
  // relies on another task being done first (e.g. banking setup often needs a local number and
  // address). All optional so existing task literals remain valid without edits.
  dependsOn?: string;
  doThisBefore?: string;
  whyItMatters?: string;
};

export const destinations = [
  {
    key: "india",
    label: "India",
    route: "Global to India",
    starterPath: undefined,
    headline: "Returning to India or relocating within India with documents, housing, schooling, banking, and family logistics in order.",
    climate: "City-specific. Plan around monsoon, heat, winter, pollution and local commute realities.",
    essentials: ["Aadhaar/PAN/NRI paperwork", "Banking and tax residency review", "Rental or family home setup", "School or college transfer", "Local SIM and UPI setup"],
    services: ["Temporary stay", "Domestic movers", "Document notarisation", "Banking and tax professionals", "School admission research"],
  },
  {
    key: "singapore",
    label: "Singapore",
    route: "Global to Singapore",
    starterPath: "/countries/singapore",
    headline: "Fast, organised and expensive. The big wins are housing research, pass rules, schooling, food, banking and first-month setup.",
    climate: "Hot, humid and rainy across the year. Pack light office wear, umbrellas, breathable clothes and medicines.",
    essentials: ["Work or student pass status", "Temporary stay before rental", "Local SIM and banking", "School or childcare plan", "Local community and support map"],
    services: ["Serviced apartment", "Rental portals", "Movers", "SIM and broadband", "Groceries and local food"],
  },
  {
    key: "united-kingdom",
    label: "United Kingdom",
    route: "Global to UK",
    starterPath: "/countries/united-kingdom",
    headline: "Plan around visa status, NHS access, rental deposits, school catchments, weather, transport and high initial setup costs.",
    climate: "Cooler and wetter than most tropical and equatorial climates. Layered clothing, rainwear and winter preparation matter.",
    essentials: ["Visa and BRP/eVisa checks", "NHS and GP registration", "Rental deposit planning", "Council tax awareness", "School catchment research"],
    services: ["Temporary stay", "Rental search", "Banking", "Furniture and appliances", "School research"],
  },
  {
    key: "united-states",
    label: "United States",
    route: "Global to USA",
    starterPath: "/countries/united-states",
    headline: "A large, state-by-state relocation. Focus on visa category, credit history, health insurance, driving, school districts and city-specific costs.",
    climate: "Highly regional. Weather and clothing needs vary sharply between cities and states.",
    essentials: ["Visa category and dependants", "Health insurance reality", "Credit and banking setup", "Driving licence path", "School district research"],
    services: ["Temporary stay", "Car rental", "Health insurance research", "Furniture", "Local services by state"],
  },
  {
    key: "canada",
    label: "Canada",
    route: "Global to Canada",
    starterPath: undefined,
    headline: "A long-term settlement move where weather, housing, school, banking, healthcare registration and province-specific rules matter.",
    climate: "Cold winters in many provinces. Winter clothing and arrival month planning are important.",
    essentials: ["PR, work or student pathway", "Province and city selection", "Temporary stay", "Banking and SIN", "Healthcare registration"],
    services: ["Temporary stay", "Rental search", "Winter clothing", "Banking", "Settlement services"],
  },
  {
    key: "australia",
    label: "Australia",
    route: "Global to Australia",
    starterPath: "/countries/australia",
    headline: "Plan around visa class, city choice, rental competition, schooling, Medicare/insurance, banking and long-distance logistics.",
    climate: "Season and climate vary by state. Sydney, Melbourne, Brisbane and Perth need different preparation.",
    essentials: ["Visa and dependant status", "City cost comparison", "Rental inspection readiness", "School zones", "Banking and Medicare/insurance"],
    services: ["Temporary stay", "Rental search", "Movers", "Furniture", "School research"],
  },
  {
    key: "united-arab-emirates",
    label: "UAE",
    route: "Global to UAE",
    starterPath: "/countries/united-arab-emirates",
    headline: "A fast setup market. The key areas are residence visa, Emirates ID, housing, school fees, car/transport, banking and insurance.",
    climate: "Very hot summers. Arrival timing, clothing and car/transport planning are important.",
    essentials: ["Residence visa and Emirates ID", "Employer or sponsor process", "School fee planning", "Rental deposits", "Medical insurance"],
    services: ["Temporary stay", "Real estate platforms", "Car rental", "School search", "Furniture and appliances"],
  },
  {
    key: "germany-eu",
    label: "Germany / EU",
    route: "Global to Germany / EU",
    starterPath: "/countries/germany-eu",
    headline: "Plan country-by-country. Registration, rental paperwork, health insurance, language, school and appointment systems need early preparation.",
    climate: "Cooler climate with proper winter needs. Local language support and documents are important.",
    essentials: ["Visa or residence route", "City registration", "Health insurance", "Rental documents", "Language and appointments"],
    services: ["Temporary stay", "Rental search", "Translation", "Notary and apostille", "Health insurance research"],
  },
  {
    key: "saudi-gulf",
    label: "Saudi Arabia / Gulf",
    route: "Global to Saudi Arabia / Gulf",
    starterPath: undefined,
    headline: "Gulf moves need employer coordination, residence documents, family status, housing, school, transport, medical and local cultural preparation.",
    climate: "Hot and dry in many cities. Plan clothing, air-conditioning, transport and family comfort early.",
    essentials: ["Employer visa process", "Family eligibility", "Housing compound or apartment", "School research", "Medical and insurance"],
    services: ["Temporary stay", "Relocation support", "School search", "Car rental", "Furniture and appliances"],
  },
  {
    key: "portugal",
    label: "Portugal",
    route: "Global to Portugal",
    starterPath: undefined,
    headline: "Plan around visa or residence route, NIF and bank account setup, rental documents, healthcare registration and regional cost differences.",
    climate: "Mild winters, hot summers. Coastal areas and inland cities differ in heat and humidity.",
    essentials: ["Visa or residence route", "NIF and bank account", "Rental documents", "Healthcare registration", "Local transport"],
    services: ["Temporary stay", "Rental search", "Translation", "Notary support", "Healthcare research"],
  },
  {
    key: "other",
    label: "Other",
    route: "Custom global route",
    starterPath: undefined,
    headline: "Use the generic route checklist until a country-specific starter kit is created.",
    climate: "Check official climate, health, safety and settlement sources for the selected city.",
    essentials: ["Official visa source", "Temporary stay", "Banking", "Health cover", "Housing research"],
    services: ["Official sources", "Temporary stay", "Movers", "Banking", "Community research"],
  },
] as const;

export const moveReasons = [
  { key: "job", label: "Job offer", focus: ["Salary and cost reality", "Rental research", "Commute", "Office clothing", "Banking", "First 90 days"] },
  { key: "corporate", label: "Corporate transfer", focus: ["Employer relocation package", "Temporary stay", "Movers", "School planning", "Spouse setup"] },
  { key: "student", label: "Student move", focus: ["University documents", "Accommodation", "Local SIM", "Banking", "Student budget", "Local transport"] },
  { key: "family", label: "Family move", focus: ["Schooling", "Childcare", "Rental house", "Groceries", "Healthcare", "Safety", "Community"] },
  { key: "pr", label: "PR / migration", focus: ["Long-term settlement", "Documents", "Shipping", "Housing", "Children", "Banking", "Community"] },
  { key: "business", label: "Business / startup", focus: ["Business setup links", "Banking", "Local network", "Office setup", "Tax caution"] },
  { key: "short", label: "Short assignment", focus: ["Temporary stay", "Light packing", "Local SIM", "Transport", "Food", "Expense tracking"] },
  { key: "returning", label: "Returning home", focus: ["Reverse relocation", "NRI paperwork", "Banking", "Home setup", "School transfer", "Tax caution"] },
  { key: "landed", label: "Already landed", focus: ["First 7 days", "Local SIM", "Bank", "House search", "WiFi", "Groceries", "Emergency contacts"] },
  { key: "retirement", label: "Retirement / lifestyle move", focus: ["Healthcare access", "Long-term insurance", "Pension and income planning", "Housing comfort", "Community routine", "Tax and residency caution"] },
  { key: "domestic", label: "Domestic move", focus: ["Lease handover", "Movers", "Utilities", "Address changes", "School transfer", "Local registrations"] },
] as const;

export const profiles = [
  { key: "solo", label: "Solo", focus: ["Cost", "Temporary stay", "Transport", "Banking", "SIM"] },
  { key: "couple", label: "Couple", focus: ["Housing", "Spouse setup", "Budget", "Groceries", "Community"] },
  { key: "familyChild", label: "Family with child", focus: ["School", "Childcare", "Healthcare", "Larger rental", "Safety", "Commute", "Playgroups"] },
  { key: "familyChildren", label: "Family with children", focus: ["School zones", "Childcare", "Healthcare", "Larger rental", "Safety", "Commute", "Playgroups"] },
  { key: "student", label: "Student", focus: ["Accommodation", "Budget", "Documents", "Local SIM", "Student life"] },
  { key: "seniors", label: "With parents / seniors", focus: ["Medical", "Accessibility", "Transport", "Medicines", "Comfort", "Emergency contacts"] },
  { key: "retiree", label: "Retiree / senior couple", focus: ["Healthcare access", "Insurance", "Accessibility", "Community", "Comfort", "Budgeting"] },
  { key: "elderlyParent", label: "Elderly parent included", focus: ["Medical continuity", "Accessibility", "Medicines", "Insurance caution", "Comfort", "Emergency contacts"] },
  { key: "preferNotToSay", label: "Prefer not to say", focus: ["General checklist", "Documents", "Banking", "Housing", "Connectivity"] },
] as const;

export const addOnOptions = [
  { key: "pets", label: "Pets" },
  { key: "schooling", label: "Children / schooling" },
  { key: "seniorHealthcare", label: "Senior healthcare" },
  { key: "medication", label: "Medication / prescriptions" },
  { key: "vehicle", label: "Vehicle / driving" },
  { key: "bankSimContinuity", label: "Home country bank OTP / SIM continuity" },
  { key: "contractsTerminate", label: "Existing contracts to terminate" },
  { key: "contractsSetup", label: "New contracts to set up" },
  { key: "insurance", label: "Insurance planning" },
  { key: "temporaryStay", label: "Temporary stay" },
  { key: "furniture", label: "Furniture and appliances" },
  { key: "storage", label: "Storage" },
  { key: "languageCommunity", label: "Language / community / culture" },
] as const;

export const petOptions = [
  { key: "none", label: "No pets" },
  { key: "dog", label: "Dog" },
  { key: "cat", label: "Cat" },
  { key: "multiple", label: "Multiple pets" },
  { key: "other", label: "Other pet" },
] as const;

export const domesticEssentials = [
  "Lease handover",
  "Movers",
  "Address change",
  "Utilities",
  "Internet / WiFi / TV / cable",
  "School transfer",
  "Local registration",
  "Storage",
  "Insurance",
  "Vehicle",
  "Mail forwarding",
  "Budget",
  "Community",
] as const;

export type AccommodationKey =
  | "occupancy"
  | "moveInWindow"
  | "roomType"
  | "furnishing"
  | "cooking"
  | "smoking"
  | "transportPref"
  | "passType";

export const occupancyOptions = [
  { key: "single", label: "Single occupancy" },
  { key: "couple", label: "Couple" },
  { key: "family", label: "Family" },
  { key: "sharedOkay", label: "Shared room okay" },
  { key: "privateOnly", label: "Private studio / entire place preferred" },
] as const;

export const moveInWindowOptions = [
  { key: "specificDate", label: "Specific date" },
  { key: "endOfMonth", label: "End of month" },
  { key: "flexible", label: "Flexible" },
] as const;

export const roomTypeOptions = [
  { key: "commonRoom", label: "Common room" },
  { key: "masterRoom", label: "Master room" },
  { key: "studio", label: "Studio" },
  { key: "oneBedroom", label: "1-bedroom" },
  { key: "entireUnit", label: "Entire unit" },
  { key: "temporaryStay", label: "Temporary stay" },
  { key: "flexible", label: "Flexible" },
] as const;

export const furnishingOptions = [
  { key: "fully", label: "Fully furnished" },
  { key: "partially", label: "Partially furnished" },
  { key: "unfurnished", label: "Unfurnished" },
  { key: "flexible", label: "Flexible" },
] as const;

export const cookingOptions = [
  { key: "daily", label: "Daily cooking required" },
  { key: "light", label: "Light cooking okay" },
  { key: "none", label: "No cooking needed" },
  { key: "confirm", label: "Need to confirm with landlord" },
] as const;

export const smokingOptions = [
  { key: "nonSmoker", label: "Non-smoker" },
  { key: "smoker", label: "Smoker" },
  { key: "preferNotToSay", label: "Prefer not to say" },
] as const;

export const transportPrefOptionsDefault = [
  { key: "nearPublicTransport", label: "Near public transport" },
  { key: "directBus", label: "Direct bus" },
  { key: "maxCommute", label: "Max commute time" },
  { key: "flexible", label: "Flexible" },
] as const;

const usCaTransportOptions = [
  { key: "nearSubwayMetroRail", label: "Near subway / metro / rail" },
  { key: "directBus", label: "Direct bus" },
  { key: "maxCommute", label: "Max commute time" },
  { key: "drivingPreferred", label: "Driving preferred" },
  { key: "flexible", label: "Flexible" },
] as const;

const gulfTransportOptions = [
  { key: "nearMetroBusTaxi", label: "Near metro / bus / taxi access" },
  { key: "drivingPreferred", label: "Driving preferred" },
  { key: "flexible", label: "Flexible" },
] as const;

const euTransportOptions = [
  { key: "nearMetroTramRail", label: "Near metro / tram / rail" },
  { key: "walkableNeighbourhood", label: "Walkable neighbourhood" },
  { key: "flexible", label: "Flexible" },
] as const;

export const transportPrefOptionsByDestination: Record<string, ReadonlyArray<{ key: string; label: string }>> = {
  singapore: [
    { key: "nearMrtLrt", label: "Near MRT / LRT" },
    { key: "directBus", label: "Direct bus" },
    { key: "maxCommute", label: "Max commute time" },
    { key: "flexible", label: "Flexible" },
  ],
  "united-kingdom": [
    { key: "nearTubeRail", label: "Near Tube / rail" },
    { key: "directBus", label: "Direct bus" },
    { key: "maxCommute", label: "Max commute time" },
    { key: "flexible", label: "Flexible" },
  ],
  "united-states": usCaTransportOptions,
  canada: usCaTransportOptions,
  australia: [
    { key: "nearTrainTramBus", label: "Near train / tram / bus" },
    { key: "maxCommute", label: "Max commute time" },
    { key: "drivingPreferred", label: "Driving preferred" },
    { key: "flexible", label: "Flexible" },
  ],
  "united-arab-emirates": gulfTransportOptions,
  "saudi-gulf": gulfTransportOptions,
  "germany-eu": euTransportOptions,
  portugal: euTransportOptions,
};

export function getTransportPrefOptions(destinationKey: DestinationKey | null): ReadonlyArray<{ key: string; label: string }> {
  if (!destinationKey) return transportPrefOptionsDefault;
  return transportPrefOptionsByDestination[destinationKey] ?? transportPrefOptionsDefault;
}

// Kept for back-compatibility — generic fallback array.
export const transportPrefOptions = transportPrefOptionsDefault;

export const passTypeOptions = [
  { key: "ep", label: "EP" },
  { key: "sPass", label: "S Pass" },
  { key: "dp", label: "Dependant Pass" },
  { key: "studentPass", label: "Student Pass" },
  { key: "pr", label: "PR" },
  { key: "citizen", label: "Citizen" },
  { key: "tourist", label: "Tourist" },
  { key: "other", label: "Other" },
] as const;

export const platformStats = [
  { label: "Route paths", value: "100+", icon: Globe2 },
  { label: "90-day tasks", value: "Adaptive", icon: FileCheck2 },
  { label: "Service categories", value: "25+", icon: Wrench },
  { label: "No login needed", value: "Browser only", icon: ShieldCheck },
];

export const documentCategories = [
  { title: "Identity and travel", icon: FileText, items: ["Passport", "Visa / pass approval", "Birth certificates", "Marriage certificate"], requiredFor: ["job", "corporate", "student", "family", "pr", "business", "short", "returning", "landed", "retirement"] },
  { title: "Education and work", icon: GraduationCap, items: ["Degree certificates", "Transcripts", "Employment letter", "Offer letter"], requiredFor: ["job", "corporate", "student", "pr", "business"] },
  { title: "Family and school", icon: UsersRound, items: ["School records", "Vaccination records", "Child medical notes", "Dependent documents"], requiredFor: ["family", "corporate", "pr", "familyChild", "familyChildren", "seniors"] },
  { title: "Money and setup", icon: Landmark, items: ["Bank statements", "Tax residency notes", "Insurance policy", "Rental documents"], requiredFor: ["job", "corporate", "family", "pr", "business", "returning", "landed", "retirement", "domestic"] },
];

export const serviceCategories = [
  { title: "International movers", icon: Luggage, note: "Provider options to research for packing, shipping, customs, insurance and destination delivery." },
  { title: "Temporary stay", icon: Home, note: "Hotels, serviced apartments and Airbnb-style stays to compare before signing a long rental." },
  { title: "Furniture", icon: Sofa, note: "Research local furniture options for first-month home setup and delivery timing." },
  { title: "Electrical appliances", icon: PlugZap, note: "Compare voltage, warranty, delivery and installation before buying appliances." },
  { title: "SIM and internet", icon: Wifi, note: "Research local SIM, eSIM, roaming and home broadband options before arrival." },
  { title: "Banking and remittance", icon: Smartphone, note: "Compare bank accounts, international transfers, FX spreads and fees directly." },
  { title: "Schooling and childcare", icon: GraduationCap, note: "Research official school portals, childcare options, catchments and admission dates." },
  { title: "Healthcare and insurance", icon: HeartHandshake, note: "Research GP, clinics, insurance, medicine rules and emergency numbers." },
  { title: "Notary and attestation", icon: BadgeCheck, note: "Research apostille, notarisation, translation and embassy-specific requirements." },
  { title: "Transport and driving", icon: Car, note: "Research airport transfer, taxi apps, public transport cards, IDP and driving licence rules." },
  { title: "Groceries and community", icon: ShoppingBag, note: "Cultural food, community, faith, language, and local support to research near likely neighbourhoods." },
  { title: "Official links", icon: MapPin, note: "Always verify visa, tax, healthcare, school and residency rules from official sources." },
  { title: "Pet relocation", icon: HeartHandshake, note: "Research pet import or local pet rules, vaccination records, microchip checks, quarantine requirements and pet-friendly transport and rentals." },
  { title: "Insurance planning", icon: ShieldCheck, note: "Compare travel, health, renter, vehicle, pet and student insurance directly with licensed providers. SettleMap does not sell or advise on insurance." },
];

export const realStories = [
  {
    name: "DevOps lead",
    route: "India to Singapore",
    profile: "Job offer · Family with child",
    stress: "Rental deposits, school timing and first-month cashflow felt bigger than the visa process.",
    lesson: "Temporary stay and school research should start before the final joining date is confirmed.",
    outcome: "Settled faster after converting the move into a 90-day project plan.",
  },
  {
    name: "Corporate transfer",
    route: "Singapore to Australia",
    profile: "Corporate transfer · Family with children",
    stress: "The family underestimated rental inspections, school zones and furniture delivery times.",
    lesson: "Employer relocation benefits need to be translated into practical week-by-week tasks.",
    outcome: "A route checklist helped separate company-covered tasks from family-owned tasks.",
  },
  {
    name: "Returning founder",
    route: "USA to India",
    profile: "Returning home · Couple",
    stress: "Banking, tax residency, home setup and reverse culture adjustment were more complex than expected.",
    lesson: "Returning home is also a relocation project, not just a flight back.",
    outcome: "Document and money checklists reduced last-minute confusion.",
  },
  {
    name: "Student move",
    route: "UK to UAE",
    profile: "Student move · Solo",
    stress: "Accommodation, SIM, transport and document deadlines were scattered across many portals.",
    lesson: "A single timeline with official links and reminders reduces anxiety.",
    outcome: "The student knew what to do before travel, on arrival week and in the first month.",
  },
  {
    name: "Returning analyst",
    route: "Singapore to India",
    profile: "Returning home · Solo",
    stress: "Bank account closures, SIM porting and shipping personal items back felt more complex than the original move out.",
    lesson: "A reverse move needs its own checklist, not just the forward one read backwards.",
    outcome: "Closing local accounts and confirming tax residency status early avoided last-month surprises.",
  },
  {
    name: "Cross-state hire",
    route: "USA to USA (domestic)",
    profile: "Domestic move · Couple",
    stress: "Lease handover, utility transfers and address changes across state lines were more paperwork than expected for a same-country move.",
    lesson: "Domestic moves still need a structured 30-day checklist, especially for state-specific registrations.",
    outcome: "A documented handover and address-change list reduced missed bills and registration gaps.",
  },
  {
    name: "Retired couple",
    route: "Canada to Portugal",
    profile: "Retirement / lifestyle move · Retiree couple",
    stress: "Healthcare registration, NIF setup and pension/income planning needed coordination before relocating, not after.",
    lesson: "Retirement moves need healthcare and tax residency confirmed before committing to a city.",
    outcome: "Sequencing NIF, bank account and healthcare registration ahead of arrival gave a calmer settling-in period.",
  },
  {
    name: "Relocating family",
    route: "Singapore to Singapore (domestic)",
    profile: "Domestic move · Family with child",
    stress: "Switching towns within Singapore still meant lease handover, school transfer paperwork and re-registering services felt heavier than expected for a short-distance move.",
    lesson: "A same-country move still benefits from a structured checklist, not just a moving truck booking.",
    outcome: "A 30-day domestic checklist kept school transfer, address changes and utility switches on schedule.",
  },
];

export const moveDateOptions = [
  { key: "exact", label: "Exact date" },
  { key: "endOfMonth", label: "End of month" },
  { key: "flexible", label: "Flexible" },
  { key: "notSure", label: "Not sure yet" },
] as const;

export type MoveDateKey = (typeof moveDateOptions)[number]["key"];

export type ActionLinkCategory = {
  key: string;
  title: string;
  whatToDo: string;
  whereToStart: string;
  // V9.2.1 — only set when the exact official government/statutory-board URL has been confirmed.
  // If absent, the UI must show "Check official source" instead of a link.
  url?: string;
};

// Generic, destination-agnostic action categories. No external URLs are included on purpose —
// users are pointed to "verify from official website" rather than risk an unverified link.
export const actionLinkCategories: ActionLinkCategory[] = [
  { key: "official", title: "Official government links", whatToDo: "Confirm visa, residency, tax and work-pass rules directly from the destination government.", whereToStart: "Search the destination country's official immigration or government portal." },
  { key: "housing", title: "Housing / rental", whatToDo: "Compare rental listings, deposits and lease terms before committing.", whereToStart: "Search licensed rental portals or registered agents for your destination city." },
  { key: "sim", title: "SIM / eSIM / internet", whatToDo: "Activate a local SIM or eSIM and compare home broadband plans.", whereToStart: "Search the destination's major telecom providers directly." },
  { key: "banking", title: "Banking / remittance", whatToDo: "Compare local bank accounts and remittance or FX providers.", whereToStart: "Search licensed banks and regulated remittance providers serving your destination." },
  { key: "insurance", title: "Insurance", whatToDo: "Compare health, travel, renter and vehicle insurance options.", whereToStart: "Search licensed insurance providers or official comparison sites for your destination." },
  { key: "healthcare", title: "Healthcare", whatToDo: "Register with a clinic and confirm prescription continuity.", whereToStart: "Search the destination's official healthcare or health ministry portal." },
  { key: "schooling", title: "Schooling / childcare", whatToDo: "Check admission timelines, catchments and waitlists.", whereToStart: "Search the destination's official education ministry or school admission portal." },
  { key: "movers", title: "Movers / shipping", whatToDo: "Compare mover quotes, insurance cover and customs handling.", whereToStart: "Search licensed international or local movers serving your route." },
  { key: "transport", title: "Transport / driving", whatToDo: "Check licence conversion, IDP rules and public transport options.", whereToStart: "Search the destination's official transport authority website." },
  { key: "pets", title: "Pets", whatToDo: "Check import permits, vaccination and quarantine requirements.", whereToStart: "Search the destination's official agriculture or biosecurity authority website." },
];

// Singapore-specific official link categories — verbatim from the V9 official links section,
// kept here so both the route wizard and the Services Directory can share one source of truth.
export const singaporeOfficialLinkCategories: ActionLinkCategory[] = [
  {
    key: "hdb",
    title: "HDB renting from open market / tenant eligibility",
    whatToDo: "Confirm HDB rental eligibility, subletting rules and registration requirements.",
    whereToStart: "Search the official HDB website.",
    url: "https://www.hdb.gov.sg/residential/renting-a-flat/renting-from-the-open-market/eligibility",
  },
  {
    key: "ura",
    title: "URA private residential rental guidance",
    whatToDo: "Confirm private residential rental guidance for condos and private property.",
    whereToStart: "Search the official URA website.",
    url: "https://www.ura.gov.sg/Corporate/Property/Residential/Renting-Property",
  },
  {
    key: "cea",
    title: "CEA public register for property agents",
    whatToDo: "Verify an agent's registration before engaging them.",
    whereToStart: "Search the official CEA public register.",
    url: "https://eservices.cea.gov.sg/aceas/public-register/",
  },
  {
    key: "iras",
    title: "IRAS renting a property / tenancy stamp duty",
    whatToDo: "Confirm stamp duty obligations for your tenancy agreement.",
    whereToStart: "Search the official IRAS website.",
    url: "https://www.iras.gov.sg/taxes/stamp-duty/for-property/renting-a-property",
  },
  {
    key: "mom",
    title: "MOM address update / pass holder address",
    whatToDo: "Update your address as a pass holder where required.",
    whereToStart: "Search the official MOM website.",
    // V9.2.1 — no single official URL covers all pass types (EP, S Pass, Work Permit, Dependant's Pass
    // each have their own MOM page), so this stays verify-only rather than risk linking the wrong one.
  },
];

// V11.8 — "Apps to prepare" categories per destination. These are common app categories worth
// researching before or soon after arrival, not a mandatory or endorsed list. Example app names
// are illustrative only (well-known, widely reported as commonly used in that market) and are
// not recommendations — always check what is current and suitable before installing anything.
export type AppEcosystemGuide = {
  mapsTransport: string[];
  localPayments: string[];
  foodGrocery: string[];
  rideHailing: string[];
  emergencyContacts: string[];
  officialServices?: string[];
};

export const appEcosystemGuide: Record<DestinationKey, AppEcosystemGuide> = {
  india: {
    mapsTransport: ["Google Maps", "City transit apps (metro/bus)"],
    localPayments: ["UPI apps (e.g. bank apps, common UPI apps)", "Your bank's mobile app"],
    foodGrocery: ["Food delivery apps", "Grocery delivery apps"],
    rideHailing: ["Common ride-hailing apps"],
    emergencyContacts: ["112 India emergency helpline (verify current number locally)"],
    officialServices: ["DigiLocker", "mAadhaar (where applicable)"],
  },
  singapore: {
    mapsTransport: ["Google Maps or Citymapper-style transit apps", "SimplyGo / transit card app"],
    localPayments: ["PayNow-enabled bank apps", "Common e-wallet apps"],
    foodGrocery: ["Food delivery apps", "Grocery delivery apps"],
    rideHailing: ["Grab or other licensed ride-hailing apps"],
    emergencyContacts: ["999 police, 995 ambulance/fire (verify current numbers)"],
    officialServices: ["Singpass app", "HDB / URA portals (browser, not app-only)"],
  },
  "united-kingdom": {
    mapsTransport: ["Google Maps", "Citymapper or local transit apps"],
    localPayments: ["Your UK bank's mobile app", "Common contactless payment apps"],
    foodGrocery: ["Food delivery apps", "Supermarket delivery apps"],
    rideHailing: ["Uber or other licensed ride-hailing apps"],
    emergencyContacts: ["999 emergency, 111 NHS non-emergency (verify current numbers)"],
    officialServices: ["GOV.UK app / website", "NHS app"],
  },
  "united-states": {
    mapsTransport: ["Google Maps", "Local transit authority app"],
    localPayments: ["Your US bank's mobile app", "Common payment apps (e.g. Zelle-style transfers)"],
    foodGrocery: ["Food delivery apps", "Grocery delivery apps"],
    rideHailing: ["Uber or Lyft, or other licensed ride-hailing apps"],
    emergencyContacts: ["911 emergency (verify local non-emergency line too)"],
    officialServices: ["State DMV app/site where available"],
  },
  canada: {
    mapsTransport: ["Google Maps", "Local transit authority app"],
    localPayments: ["Your Canadian bank's mobile app", "Interac e-Transfer enabled banking app"],
    foodGrocery: ["Food delivery apps", "Grocery delivery apps"],
    rideHailing: ["Uber or other licensed ride-hailing apps"],
    emergencyContacts: ["911 emergency (verify local non-emergency line too)"],
    officialServices: ["Provincial health card / services portal"],
  },
  australia: {
    mapsTransport: ["Google Maps", "State transit app (e.g. myki/Opal-style apps)"],
    localPayments: ["Your Australian bank's mobile app", "Common payment apps"],
    foodGrocery: ["Food delivery apps", "Grocery delivery apps"],
    rideHailing: ["Uber or other licensed ride-hailing apps"],
    emergencyContacts: ["000 emergency (verify local non-emergency line too)"],
    officialServices: ["myGov account/app"],
  },
  "united-arab-emirates": {
    mapsTransport: ["Google Maps", "RTA / local transit app where applicable"],
    localPayments: ["Your UAE bank's mobile app", "Common e-wallet apps"],
    foodGrocery: ["Food delivery apps", "Grocery delivery apps"],
    rideHailing: ["Careem, Uber or other licensed ride-hailing apps"],
    emergencyContacts: ["999 police, 998 ambulance, 997 fire (verify current numbers)"],
    officialServices: ["UAE Pass app"],
  },
  "germany-eu": {
    mapsTransport: ["Google Maps", "Local transit app (city-specific)"],
    localPayments: ["Your bank's mobile app", "Common EU payment/transfer apps"],
    foodGrocery: ["Food delivery apps", "Grocery delivery apps"],
    rideHailing: ["Uber or other licensed ride-hailing/taxi apps"],
    emergencyContacts: ["112 EU-wide emergency number (verify local non-emergency line too)"],
    officialServices: ["Local municipality registration portal where available"],
  },
  "saudi-gulf": {
    mapsTransport: ["Google Maps", "Local transit/taxi app where applicable"],
    localPayments: ["Your bank's mobile app", "Common e-wallet apps"],
    foodGrocery: ["Food delivery apps", "Grocery delivery apps"],
    rideHailing: ["Careem, Uber or other licensed ride-hailing apps"],
    emergencyContacts: ["999 or 911 depending on country (verify current local number)"],
    officialServices: ["National ID / government services app where applicable"],
  },
  portugal: {
    mapsTransport: ["Google Maps", "Local transit app (city-specific)"],
    localPayments: ["Your bank's mobile app", "MB WAY or other common local payment apps"],
    foodGrocery: ["Food delivery apps", "Grocery delivery apps"],
    rideHailing: ["Uber, Bolt or other licensed ride-hailing apps"],
    emergencyContacts: ["112 emergency number"],
    officialServices: ["AT / Finanças portal where applicable"],
  },
  other: {
    mapsTransport: ["A reliable maps/navigation app", "Local transit app if available"],
    localPayments: ["Your bank's mobile app", "Common local e-wallet apps"],
    foodGrocery: ["Food delivery apps if available", "Grocery delivery apps if available"],
    rideHailing: ["A licensed ride-hailing or taxi app for the area"],
    emergencyContacts: ["The local emergency number — confirm on arrival"],
  },
};

export const APP_CATEGORIES_DISCLAIMER =
  "Common app categories to research, not a mandatory or endorsed list. App names shown are examples only. Confirm what is current, licensed and suitable for you before installing or registering.";

export const ACTION_LINKS_NOT_ENDORSEMENT =
  "These categories are research starting points, not endorsements or recommendations. SettleMap does not verify listings, agents, landlords, visas, taxes, insurance, schools or service providers. Always verify rule-sensitive matters with official sources.";

export const OFFICIAL_LINKS_DISCLAIMER =
  "Always verify directly from official websites. SettleMap does not provide legal, immigration, tax, housing or real estate advice.";

export type Destination = (typeof destinations)[number];
export type MoveReason = (typeof moveReasons)[number];
export type Profile = (typeof profiles)[number];
