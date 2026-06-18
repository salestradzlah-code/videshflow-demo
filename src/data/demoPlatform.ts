import { Bot, Building2, Car, FileCheck2, Globe2, GraduationCap, HeartHandshake, Home, Luggage, Plane, ShieldCheck, ShoppingBag, Smartphone, UsersRound } from "lucide-react";

export type DestinationKey = "singapore" | "uk" | "usa" | "canada" | "uae" | "australia" | "germany" | "gulf";
export type MoveReasonKey = "job" | "transfer" | "student" | "family" | "pr" | "business" | "assignment" | "landed";
export type ProfileKey = "solo" | "couple" | "familyChild" | "familyChildren" | "student" | "parents";
export type TimelinePhase = "Before flying" | "Days 1 to 7" | "Days 8 to 30" | "Days 31 to 90";

export type Destination = {
  key: DestinationKey;
  label: string;
  route: string;
  climate: string;
  starterPath?: string;
  headline: string;
  focus: string[];
  serviceLinks: string[];
};

export type MoveReason = {
  key: MoveReasonKey;
  label: string;
  focus: string[];
};

export type Profile = {
  key: ProfileKey;
  label: string;
  focus: string[];
};

export type TimelineTask = {
  id: string;
  phase: TimelinePhase;
  day: string;
  title: string;
  description: string;
  owner: string;
  category: "Documents" | "Housing" | "Money" | "Travel" | "Family" | "Daily life" | "Services" | "AI";
  priority: "Critical" | "High" | "Normal";
  tools: string[];
};

export type Story = {
  name: string;
  route: string;
  profile: string;
  lesson: string;
  stress: string;
  outcome: string;
};

export const destinations: Destination[] = [
  {
    key: "singapore",
    label: "Singapore",
    route: "India to Singapore",
    climate: "Humid, rainy, tropical. Plan breathable office wear, rainwear, comfortable shoes, and indoor routines.",
    starterPath: "/countries/singapore",
    headline: "Best for Indian tech professionals and families who need cost, rent, school, SIM, OTP, and house setup clarity.",
    focus: ["Salary versus rent reality", "MRT commute and rental areas", "School and childcare planning", "Indian SIM and OTP continuity", "Groceries, temples, vegetarian food"],
    serviceLinks: ["MOM and ICA official sources", "Rental portals to research", "SIM and broadband providers", "Indian grocery and community references"],
  },
  {
    key: "uk",
    label: "United Kingdom",
    route: "India to UK",
    climate: "Cooler, wet, short winter days. Plan layers, heating costs, school calendar, NHS registration, and rental proofs.",
    starterPath: "/countries/united-kingdom",
    headline: "Best for skilled workers, students, and families preparing for rent, NHS, banking, schools, and first winter.",
    focus: ["Rent and council tax awareness", "NHS and GP registration", "School catchment planning", "Weather and winter clothing", "Banking and proof of address"],
    serviceLinks: ["GOV.UK official sources", "UCAS or university portals", "Temporary stay options", "Community groups and Indian stores"],
  },
  {
    key: "usa",
    label: "United States",
    route: "India to US",
    climate: "Highly state and city dependent. Plan for car dependency, credit history, healthcare, and school district variation.",
    starterPath: "/countries/united-states",
    headline: "Best for tech, students, and families who need state-specific caution, SSN, credit, leasing, and healthcare orientation.",
    focus: ["State-specific setup", "SSN and credit history", "Car and driving realities", "Health insurance", "School district research"],
    serviceLinks: ["USCIS and Travel.State.Gov", "University portals", "Rental and utility platforms", "DMV state resources"],
  },
  {
    key: "canada",
    label: "Canada",
    route: "India to Canada",
    climate: "Cold winters in many provinces. Plan winter clothing, housing deposits, transit, healthcare wait periods, and settlement services.",
    starterPath: undefined,
    headline: "Useful for students, PR families, and work permit holders preparing for province-specific settlement.",
    focus: ["Province-specific official sources", "Proof of funds and initial budget", "Winter prep", "Rental and credit checks", "Settlement services"],
    serviceLinks: ["IRCC official sources", "EduCanada", "Rental platforms", "Settlement service directories"],
  },
  {
    key: "uae",
    label: "UAE",
    route: "India to UAE",
    climate: "Hot desert climate. Plan housing deposits, school fees, employer coverage, driving, AC costs, and community networks.",
    starterPath: "/countries/united-arab-emirates",
    headline: "Best for Dubai and Abu Dhabi movers who need visa sequence, rent, school, Emirates ID, insurance, and family logistics.",
    focus: ["Employer and family sponsorship sequence", "Rent and school fee reality", "Medical insurance", "Driving and commute", "Indian community and groceries"],
    serviceLinks: ["UAE official portals", "GDRFA or ICP references", "Temporary stay and rental portals", "Movers and attestation services"],
  },
  {
    key: "australia",
    label: "Australia",
    route: "India to Australia",
    climate: "City dependent, with strong seasonal differences. Plan suburbs, school zones, healthcare eligibility, and car or transit needs.",
    starterPath: "/countries/australia",
    headline: "Best for PR holders, students, and skilled migrants preparing for suburbs, rent, schools, healthcare, and first job timeline.",
    focus: ["Suburb and commute planning", "Medicare or insurance checks", "School zone research", "TFN and banking", "Job search buffer"],
    serviceLinks: ["Home Affairs official sources", "Study Australia", "Services Australia", "Rental and moving providers"],
  },
  {
    key: "germany",
    label: "Germany / EU",
    route: "India to Germany / EU",
    climate: "Cold winters and language-dependent administration. Plan city registration, insurance, documents, appointments, and language basics.",
    starterPath: "/countries/germany-eu",
    headline: "Best for professionals and students who need bureaucracy, appointments, language, insurance, and city-specific guidance.",
    focus: ["City registration", "Insurance and appointments", "German language basics", "Rental proofs", "Document translation"],
    serviceLinks: ["Official city portals", "Embassy sources", "Language tools", "Housing and community resources"],
  },
  {
    key: "gulf",
    label: "Saudi Arabia / Gulf",
    route: "India to Saudi Arabia / Gulf",
    climate: "Hot climate, employer-led paperwork, family sponsorship, accommodation norms, driving, and cultural expectations matter.",
    starterPath: undefined,
    headline: "Useful for Gulf job, family, and assignment movers who need employer process clarity and daily life setup planning.",
    focus: ["Employer process", "Family sponsorship planning", "Accommodation and transport", "Medical and insurance", "Cultural expectations"],
    serviceLinks: ["Official government sources", "Employer portals", "Temporary stay options", "Movers and attestation services"],
  },
];

export const moveReasons: MoveReason[] = [
  { key: "job", label: "Job offer", focus: ["Salary and cost reality", "Rental research", "Commute", "Office clothing", "Banking", "First 90 days"] },
  { key: "transfer", label: "Corporate transfer", focus: ["Employer relocation package", "Temporary stay", "Movers", "School planning", "Spouse setup", "Benefits check"] },
  { key: "student", label: "Student move", focus: ["University documents", "Accommodation", "Local SIM", "Banking", "Student budget", "Local transport"] },
  { key: "family", label: "Family move", focus: ["Schooling", "Childcare", "Rental house", "Groceries", "Healthcare", "Safety", "Community"] },
  { key: "pr", label: "PR / migration", focus: ["Long-term settlement", "Documents", "Shipping", "Housing", "Children", "Banking", "Community"] },
  { key: "business", label: "Business / startup", focus: ["Business setup links", "Banking", "Local network", "Office setup", "Tax caution", "Professional support"] },
  { key: "assignment", label: "Short assignment", focus: ["Temporary stay", "Light packing", "Local SIM", "Transport", "Food", "Expense tracking"] },
  { key: "landed", label: "Already landed", focus: ["First 7 days", "Local SIM", "Bank", "House search", "WiFi", "Groceries", "Emergency contacts"] },
];

export const profiles: Profile[] = [
  { key: "solo", label: "Solo", focus: ["Cost control", "Temporary stay", "Transport", "Banking", "SIM", "Community"] },
  { key: "couple", label: "Couple", focus: ["Housing", "Spouse setup", "Budget", "Groceries", "Community", "Healthcare"] },
  { key: "familyChild", label: "Family with child", focus: ["School", "Childcare", "Healthcare", "Larger rental", "Safety", "Commute", "Playgroups"] },
  { key: "familyChildren", label: "Family with children", focus: ["School timing", "Childcare", "Family budget", "House setup", "Playgroups", "Medical", "Community"] },
  { key: "student", label: "Student", focus: ["Accommodation", "Budget", "Documents", "Local SIM", "Student life", "Transport"] },
  { key: "parents", label: "With parents / seniors", focus: ["Medical", "Accessibility", "Transport", "Medicines", "Comfort", "Emergency contacts"] },
];

export const platformStats = [
  { label: "90 day plan", value: "4 phases", icon: Globe2 },
  { label: "Document readiness", value: "Mock OCR", icon: FileCheck2 },
  { label: "AI layer", value: "API-ready", icon: Bot },
  { label: "Service routing", value: "Research only", icon: ShieldCheck },
];

export const documentCategories = [
  { id: "passport", label: "Passport and visa / pass letters", requiredFor: ["all"], icon: FileCheck2 },
  { id: "offer", label: "Offer letter, employment contract, or university offer", requiredFor: ["job", "transfer", "student"], icon: Building2 },
  { id: "family", label: "Marriage, birth, and school records", requiredFor: ["family", "familyChild", "familyChildren", "parents"], icon: UsersRound },
  { id: "medical", label: "Medical history, prescriptions, vaccination records", requiredFor: ["all"], icon: HeartHandshake },
  { id: "finance", label: "Banking, remittance, forex and proof of funds", requiredFor: ["all"], icon: ShieldCheck },
  { id: "housing", label: "Temporary stay, rental shortlist, mover quote", requiredFor: ["all"], icon: Home },
  { id: "driving", label: "Driving licence, IDP, cab or rental car notes", requiredFor: ["job", "transfer", "family", "pr"], icon: Car },
  { id: "packing", label: "Packing list, luggage weights, customs caution", requiredFor: ["all"], icon: Luggage },
];

export const serviceCategories = [
  { label: "Flights and temporary stay", icon: Plane },
  { label: "Movers and baggage", icon: Luggage },
  { label: "Rental and home setup", icon: Home },
  { label: "SIM, roaming and broadband", icon: Smartphone },
  { label: "Schools and childcare", icon: GraduationCap },
  { label: "Groceries and community", icon: ShoppingBag },
];

export const realStories: Story[] = [
  {
    name: "Rahul S.",
    route: "India to Singapore",
    profile: "DevOps lead, family with child",
    stress: "Rent and school timing looked simple on paper but became the biggest first-month pressure.",
    lesson: "Shortlist neighbourhoods using office commute, school route, groceries, and MRT access together, not separately.",
    outcome: "Moved from panic browsing to a realistic area shortlist before signing a lease.",
  },
  {
    name: "Priya M.",
    route: "India to UK",
    profile: "Nurse, spouse joining later",
    stress: "Proof of address and bank setup delayed everything else.",
    lesson: "Keep temporary stay, employer letters, and appointment documents accessible in one physical folder and one cloud folder.",
    outcome: "Avoided repeated document searches during the first two weeks.",
  },
  {
    name: "Aman K.",
    route: "India to Canada",
    profile: "Student move",
    stress: "Packing too much and still missing winter basics.",
    lesson: "Ship less, carry essentials, and buy bulky winter items locally after checking weather and campus support groups.",
    outcome: "Reduced baggage cost and avoided buying duplicate electronics.",
  },
  {
    name: "Neha R.",
    route: "India to UAE",
    profile: "Corporate transfer, family",
    stress: "School fees and housing deposits came together.",
    lesson: "Ask the employer what is paid upfront, reimbursed later, and not covered at all.",
    outcome: "Created a separate first-60-days cash buffer before flying.",
  },
];
