// V10.9: resource/action links framework.
//
// This is the single typed source of truth for every external/research link
// shown on SettleMap. It wraps the existing action-link categories defined in
// demoPlatform.ts (kept there for backward compatibility) and adds the fields
// needed to label links consistently as official guidance, a research
// option, or a community resource.
//
// Rules followed here:
// - Do not invent uncertain URLs. Only categories with an already-verified
//   URL (see demoPlatform.ts singaporeOfficialLinkCategories) get type "official".
// - Generic destination-agnostic categories with no confirmed URL get type
//   "research" — they point users to "verify from official website" instead.
// - "community" is supported in the type system but has zero live entries.
//   No fake community links are created.

import {
  actionLinkCategories,
  singaporeOfficialLinkCategories,
  type ActionLinkCategory,
} from "@/data/demoPlatform";

export type ResourceLinkType = "official" | "research" | "community";

export type ResourceLink = {
  id: string;
  title: string;
  category: string;
  countryOrRoute?: string;
  type: ResourceLinkType;
  url?: string;
  description: string;
  buttonLabel: string;
  riskNote: string;
  lastChecked?: string;
  opensInNewTab: boolean;
};

const STANDARD_RISK_NOTE = "Not an endorsement. Verify directly before engaging any provider.";
const OFFICIAL_RISK_NOTE = "Always verify directly from the official source before acting.";

function fromGeneric(category: ActionLinkCategory): ResourceLink {
  return {
    id: category.key,
    title: category.title,
    category: category.title,
    type: "research",
    url: category.url,
    description: category.whatToDo,
    buttonLabel: "Research option",
    riskNote: STANDARD_RISK_NOTE,
    opensInNewTab: true,
  };
}

function fromSingapore(category: ActionLinkCategory): ResourceLink {
  return {
    id: category.key,
    title: category.title,
    category: category.title,
    countryOrRoute: "Singapore",
    type: category.url ? "official" : "research",
    url: category.url,
    description: category.whatToDo,
    buttonLabel: category.url ? "Official guidance" : "Research option",
    riskNote: category.url ? OFFICIAL_RISK_NOTE : STANDARD_RISK_NOTE,
    lastChecked: category.url ? "2026-06-23" : undefined,
    opensInNewTab: true,
  };
}

export const resourceLinks: ResourceLink[] = [
  ...actionLinkCategories.map(fromGeneric),
  ...singaporeOfficialLinkCategories.map(fromSingapore),
  // No community resources exist yet. Do not add placeholder/fake entries here —
  // when a real, verified community resource is identified, add it with type: "community".
];

export const RESOURCE_LINK_TYPE_LABELS: Record<ResourceLinkType, string> = {
  official: "Official guidance",
  research: "Research option",
  community: "Community resource",
};

export function getResourceLinksByType(type: ResourceLinkType): ResourceLink[] {
  return resourceLinks.filter((link) => link.type === type);
}
