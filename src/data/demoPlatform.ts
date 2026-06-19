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
  | "landed";

export type ProfileKey = "solo" | "couple" | "familyChild" | "familyChildren" | "student" | "seniors";

export type TimelinePhase = "Before you move" | "Days 1 to 7" | "Days 8 to 30" | "Days 31 to 90";

export type TimelineTask = {
  id: string;
  phase: TimelinePhase;
  title: string;
  description: string;
  timing: string;
  priority: "High" | "Medium" | "Low";
  category: string;
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
    essentials: ["Work or student pass status", "Temporary stay before rental", "Local SIM and banking", "School or childcare plan", "Indian grocery and community map"],
    services: ["Serviced apartment", "Rental portals", "Movers", "SIM and broadband", "Indian groceries"],
  },
  {
    key: "united-kingdom",
    label: "United Kingdom",
    route: "Global to UK",
    starterPath: "/countries/united-kingdom",
    headline: "Plan around visa status, NHS access, rental deposits, school catchments, weather, transport and high initial setup costs.",
    climate: "Cooler and wetter than most Indian cities. Layered clothing, rainwear and winter preparation matter.",
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
] as const;

export const profiles = [
  { key: "solo", label: "Solo", focus: ["Cost", "Temporary stay", "Transport", "Banking", "SIM"] },
  { key: "couple", label: "Couple", focus: ["Housing", "Spouse setup", "Budget", "Groceries", "Community"] },
  { key: "familyChild", label: "Family with child", focus: ["School", "Childcare", "Healthcare", "Larger rental", "Safety", "Commute", "Playgroups"] },
  { key: "familyChildren", label: "Family with children", focus: ["School zones", "Childcare", "Healthcare", "Larger rental", "Safety", "Commute", "Playgroups"] },
  { key: "student", label: "Student", focus: ["Accommodation", "Budget", "Documents", "Local SIM", "Student life"] },
  { key: "seniors", label: "With parents / seniors", focus: ["Medical", "Accessibility", "Transport", "Medicines", "Comfort", "Emergency contacts"] },
] as const;

export const platformStats = [
  { label: "Route paths", value: "100+", icon: Globe2 },
  { label: "90-day tasks", value: "Adaptive", icon: FileCheck2 },
  { label: "Service categories", value: "25+", icon: Wrench },
  { label: "Demo mode", value: "No login", icon: ShieldCheck },
];

export const documentCategories = [
  { title: "Identity and travel", icon: FileText, items: ["Passport", "Visa / pass approval", "Birth certificates", "Marriage certificate"], requiredFor: ["job", "corporate", "student", "family", "pr", "business", "short", "returning", "landed"] },
  { title: "Education and work", icon: GraduationCap, items: ["Degree certificates", "Transcripts", "Employment letter", "Offer letter"], requiredFor: ["job", "corporate", "student", "pr", "business"] },
  { title: "Family and school", icon: UsersRound, items: ["School records", "Vaccination records", "Child medical notes", "Dependent documents"], requiredFor: ["family", "corporate", "pr", "familyChild", "familyChildren", "seniors"] },
  { title: "Money and setup", icon: Landmark, items: ["Bank statements", "Tax residency notes", "Insurance policy", "Rental documents"], requiredFor: ["job", "corporate", "family", "pr", "business", "returning", "landed"] },
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
  { title: "Groceries and community", icon: ShoppingBag, note: "Find Indian groceries, temples, mandals, community groups and local support networks." },
  { title: "Official links", icon: MapPin, note: "Always verify visa, tax, healthcare, school and residency rules from official sources." },
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
];

export type Destination = (typeof destinations)[number];
export type MoveReason = (typeof moveReasons)[number];
export type Profile = (typeof profiles)[number];
