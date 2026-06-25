import { singaporeOfficialLinkCategories } from "@/data/demoPlatform";

export type ResearchLinkCategory =
  | "Official government portal"
  | "Immigration and entry"
  | "Housing and rental"
  | "Banking and remittance"
  | "SIM, eSIM and internet"
  | "Healthcare"
  | "Insurance"
  | "Transport"
  | "Tax or payroll ID"
  | "Schools or childcare"
  | "University setup"
  | "Pets"
  | "Moving and shipping"
  | "Emergency numbers"
  | "Consumer protection"
  | "Address change and local admin";

export type ResearchSourceType =
  | "official"
  | "official-search"
  | "registered-provider-search"
  | "commercial-research";

export type ResearchLink = {
  id: string;
  country: string;
  city?: string;
  category: ResearchLinkCategory;
  title: string;
  description: string;
  url?: string;
  sourceType: ResearchSourceType;
  official: boolean;
  priority: number;
  audience: string[];
  routeTags: string[];
  personaTags: string[];
  lastReviewedAt: string;
  verificationNote: string;
  isCommercial: boolean;
  commercialDisclosure: string;
};

export const RESEARCH_LINKS_BOUNDARY_COPY =
  "Research links are starting points only. SettleMap does not recommend, verify, rank or endorse providers. Always verify directly with official sources or the provider before acting.";

const reviewedAt = "2026-06-25";

const globalCategories: Array<{
  id: string;
  category: ResearchLinkCategory;
  title: string;
  description: string;
  sourceType: ResearchSourceType;
  official: boolean;
  priority: number;
  audience: string[];
  personaTags: string[];
  verificationNote: string;
  isCommercial?: boolean;
  commercialDisclosure?: string;
}> = [
  {
    id: "global-government-portal",
    category: "Official government portal",
    title: "Official government portal",
    description: "Search the official government portal for your destination country and city.",
    sourceType: "official-search",
    official: true,
    priority: 1,
    audience: ["all"],
    personaTags: ["all"],
    verificationNote: "Use the country or city government domain before acting.",
  },
  {
    id: "global-immigration-entry",
    category: "Immigration and entry",
    title: "Immigration and entry requirements",
    description: "Search the official immigration or home affairs portal for entry, visa, permit and processing-time rules.",
    sourceType: "official-search",
    official: true,
    priority: 2,
    audience: ["all"],
    personaTags: ["student", "family", "corporate", "solo", "returning"],
    verificationNote: "Verify rules on the official authority website before acting.",
  },
  {
    id: "global-housing-rental",
    category: "Housing and rental",
    title: "Housing and rental research",
    description: "Search official housing guidance first, then compare licensed or registered rental providers directly.",
    sourceType: "registered-provider-search",
    official: false,
    priority: 3,
    audience: ["all"],
    personaTags: ["student", "family", "corporate", "solo", "returning"],
    verificationNote: "Verify rent, deposit, agent identity and lease terms directly.",
    isCommercial: true,
    commercialDisclosure: "Commercial rental platforms or agents may appear in your own research; SettleMap does not endorse them.",
  },
  {
    id: "global-banking-remittance",
    category: "Banking and remittance",
    title: "Banking and remittance setup",
    description: "Search banks and licensed remittance providers for new-arrival account rules, fees and transfer timelines.",
    sourceType: "registered-provider-search",
    official: false,
    priority: 4,
    audience: ["all"],
    personaTags: ["student", "family", "corporate", "solo", "returning"],
    verificationNote: "Verify fees, account eligibility and provider licensing directly.",
    isCommercial: true,
    commercialDisclosure: "Financial providers are research options only, not recommendations.",
  },
  {
    id: "global-sim-internet",
    category: "SIM, eSIM and internet",
    title: "SIM, eSIM and internet options",
    description: "Search telecom providers directly for prepaid, eSIM, broadband and contract requirements.",
    sourceType: "commercial-research",
    official: false,
    priority: 5,
    audience: ["all"],
    personaTags: ["student", "family", "corporate", "solo"],
    verificationNote: "Verify ID requirements, contract term, roaming and cancellation fees before buying.",
    isCommercial: true,
    commercialDisclosure: "Telecom providers are research options only, not endorsements.",
  },
  {
    id: "global-healthcare",
    category: "Healthcare",
    title: "Healthcare registration",
    description: "Search the official health authority and local clinic registration rules for your destination.",
    sourceType: "official-search",
    official: true,
    priority: 6,
    audience: ["all"],
    personaTags: ["student", "family", "corporate", "solo", "returning"],
    verificationNote: "Verify eligibility, waiting periods and registration steps with the official health authority.",
  },
  {
    id: "global-insurance",
    category: "Insurance",
    title: "Insurance research",
    description: "Search licensed insurers directly for health, travel, renters, shipping or pet coverage where relevant.",
    sourceType: "registered-provider-search",
    official: false,
    priority: 7,
    audience: ["all"],
    personaTags: ["student", "family", "corporate", "pet"],
    verificationNote: "Read the policy wording and verify licensing before purchasing.",
    isCommercial: true,
    commercialDisclosure: "Insurance products are research options only. SettleMap does not sell or advise on insurance.",
  },
  {
    id: "global-transport",
    category: "Transport",
    title: "Transport authority and local travel",
    description: "Search the official transport authority for transit cards, driving licence conversion and local travel rules.",
    sourceType: "official-search",
    official: true,
    priority: 8,
    audience: ["all"],
    personaTags: ["all"],
    verificationNote: "Search the official transport authority before relying on third-party summaries.",
  },
  {
    id: "global-tax-payroll",
    category: "Tax or payroll ID",
    title: "Tax or payroll ID",
    description: "Search the official tax authority or employer payroll guidance for tax ID, payroll setup and filing obligations.",
    sourceType: "official-search",
    official: true,
    priority: 9,
    audience: ["all"],
    personaTags: ["corporate", "returning", "solo", "family"],
    verificationNote: "Tax can be regulated advice. Verify official rules and consult a qualified professional when needed.",
  },
  {
    id: "global-schools-childcare",
    category: "Schools or childcare",
    title: "Schools or childcare",
    description: "Search the official education authority, school district, school or childcare provider directly.",
    sourceType: "official-search",
    official: true,
    priority: 10,
    audience: ["all"],
    personaTags: ["family"],
    verificationNote: "Verify enrolment, catchment, fees, waiting lists and documents directly.",
  },
  {
    id: "global-university-setup",
    category: "University setup",
    title: "University setup",
    description: "Search your university's international student office, enrolment, accommodation and health cover pages.",
    sourceType: "official-search",
    official: true,
    priority: 11,
    audience: ["student"],
    personaTags: ["student"],
    verificationNote: "Your institution is the official source for campus setup and enrolment steps.",
  },
  {
    id: "global-pets",
    category: "Pets",
    title: "Pet relocation rules",
    description: "Search the official agriculture, biosecurity, customs or veterinary authority for pet import rules.",
    sourceType: "official-search",
    official: true,
    priority: 12,
    audience: ["all"],
    personaTags: ["pet", "family"],
    verificationNote: "Verify microchip, vaccination, titre test, permit and quarantine rules on official authority websites.",
  },
  {
    id: "global-moving-shipping",
    category: "Moving and shipping",
    title: "Moving and shipping providers",
    description: "Search licensed or registered movers directly and compare written quotes, insurance and customs handling.",
    sourceType: "registered-provider-search",
    official: false,
    priority: 13,
    audience: ["all"],
    personaTags: ["family", "corporate", "returning", "solo"],
    verificationNote: "Verify licensing, insurance, restricted items and total quote before booking.",
    isCommercial: true,
    commercialDisclosure: "Moving providers are research options only, not recommendations.",
  },
  {
    id: "global-emergency-numbers",
    category: "Emergency numbers",
    title: "Emergency numbers",
    description: "Search official police, ambulance, fire, consulate and local emergency pages for your destination.",
    sourceType: "official-search",
    official: true,
    priority: 14,
    audience: ["all"],
    personaTags: ["all"],
    verificationNote: "Save numbers from official sources and verify locally after arrival.",
  },
  {
    id: "global-consumer-protection",
    category: "Consumer protection",
    title: "Consumer protection",
    description: "Search official consumer protection or tenancy complaint channels for your destination.",
    sourceType: "official-search",
    official: true,
    priority: 15,
    audience: ["all"],
    personaTags: ["all"],
    verificationNote: "Use official complaint or consumer channels if a provider dispute arises.",
  },
  {
    id: "global-address-admin",
    category: "Address change and local admin",
    title: "Address change and local admin",
    description: "Search official address update, residence registration and local admin portals for your destination.",
    sourceType: "official-search",
    official: true,
    priority: 16,
    audience: ["all"],
    personaTags: ["student", "family", "corporate", "solo", "returning"],
    verificationNote: "Verify deadlines and required documents on the official authority website.",
  },
];

const globalResearchLinks: ResearchLink[] = globalCategories.map((item) => ({
  country: "Global",
  city: undefined,
  routeTags: ["all"],
  lastReviewedAt: reviewedAt,
  isCommercial: false,
  commercialDisclosure: "No commercial relationship. Research starting point only.",
  ...item,
}));

const singaporeOfficialLinks: ResearchLink[] = singaporeOfficialLinkCategories.map((category, index) => ({
  id: `singapore-${category.key}`,
  country: "Singapore",
  category:
    category.key === "iras"
      ? "Tax or payroll ID"
      : category.key === "mom"
        ? "Address change and local admin"
        : "Housing and rental",
  title: category.title,
  description: category.whatToDo,
  url: category.url,
  sourceType: category.url ? "official" : "official-search",
  official: true,
  priority: 20 + index,
  audience: ["all"],
  routeTags: ["singapore", "india-to-singapore", "philippines-to-singapore", "malaysia-to-singapore"],
  personaTags: ["family", "corporate", "student", "solo"],
  lastReviewedAt: "2026-06-23",
  verificationNote: category.whereToStart,
  isCommercial: false,
  commercialDisclosure: "Official source. Not a paid placement.",
}));

export const researchLinksRegistry: ResearchLink[] = [
  ...globalResearchLinks,
  ...singaporeOfficialLinks,
];

export function getResearchLinkChecklistItems(params?: {
  audience?: string;
  destination?: string | null;
  personaTags?: string[];
  limit?: number;
}): string[] {
  const destination = params?.destination?.toLowerCase() ?? "";
  const personaTags = (params?.personaTags ?? []).map((tag) => tag.toLowerCase());
  const audience = params?.audience?.toLowerCase() ?? "all";
  const limit = params?.limit ?? 12;

  return researchLinksRegistry
    .filter((link) => {
      const audienceMatch = link.audience.includes("all") || link.audience.includes(audience);
      const destinationMatch =
        !destination ||
        link.country.toLowerCase() === "global" ||
        destination.includes(link.country.toLowerCase());
      const personaMatch =
        link.personaTags.includes("all") ||
        personaTags.length === 0 ||
        personaTags.some((tag) =>
          link.personaTags.some((persona) => tag.includes(persona) || persona.includes(tag)),
        );
      return audienceMatch && destinationMatch && personaMatch;
    })
    .sort((a, b) => a.priority - b.priority)
    .slice(0, limit)
    .map((link) => {
      const sourceLabel = link.official ? "Official/source check" : "Research option";
      const urlText = link.url ? ` URL: ${link.url}` : "";
      return `${link.category}: ${link.description} ${sourceLabel}. ${link.verificationNote}${urlText}`;
    });
}
