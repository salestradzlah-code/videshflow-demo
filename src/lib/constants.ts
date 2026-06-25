export const SITE_NAME = "SettleMap";
export const SITE_URL = "https://settlemap.app";

// Live feedback channel for early access. All feedback and waitlist CTAs point here.
export const TALLY_FORM_URL = "https://tally.so/r/Pd46qP";
export const WAITLIST_FORM_URL = TALLY_FORM_URL;

// Help and partner intake forms are not yet connected to a backend.
// Until then, they point to safe internal fallback sections so users never hit broken external links.
export const STORY_FORM_URL = "#story-form-coming-soon";
export const HELP_FORM_URL = "#help-form-coming-soon";

// Partner interest now routes to the same live Tally form as feedback/early access,
// since no separate partner intake backend exists yet.
export const PARTNER_FORM_URL = TALLY_FORM_URL;
export const EARLY_ACCESS_FORM_URL = TALLY_FORM_URL;

// No fake contact inbox is shown publicly. Use the feedback form instead.
export const CONTACT_NOTE = "Use the feedback form to contact us during early access.";

export const DISCLAIMER_SHORT =
  "SettleMap is an early access planning tool, not a professional advice service. It is not a travel agency, immigration adviser, property agent, financial adviser, insurance adviser, medical adviser, school or admission adviser, or government website. It does not provide legal, immigration, tax, financial, medical, insurance, housing, school admission, travel, pet import, or vendor advice. Always verify current requirements with official sources and qualified professionals.";

export const OPERATOR_LINE = "SettleMap is operated by TRADZLAH LLP, Singapore UEN T20LL0224L.";

export const BETA_NOTE = "Planning support only — verify important details with official sources.";

export const DIRECTORY_DISCLAIMER =
  "Service listings and categories are for research convenience only. They are not endorsements, guarantees, official recommendations, or promises of service quality, pricing, licensing, availability, or outcomes. Verify directly before engaging any provider.";

export const INSURANCE_DISCLAIMER =
  "SettleMap does not sell or advise on insurance. Users must compare policies and verify with licensed professionals/providers.";

export const AI_ASSISTANT_DISCLAIMER =
  "SettleMap provides planning support only. It does not provide legal, immigration, tax, financial, medical, insurance, housing, school admission, travel, pet import, or vendor advice.";

// V10.4: monetisation readiness and lead capture disclosures.
export const AFFILIATE_DISCLOSURE_NOTE =
  "Some future action links may be affiliate or partner links. Official-source links are never paid placements.";

export const PARTNER_DISCLAIMER =
  "SettleMap does not currently endorse, verify or rank partners. Future partner listings, if any, will be clearly labelled.";

export const COMMERCIAL_LINKS_NOTE =
  "SettleMap is not a travel agency, immigration adviser, property agent, financial adviser, insurance adviser, medical adviser, school or admission adviser, or government website. Pricing signals, plans and commercial links shown here are research options and future plans, not endorsements or active offers. Always verify current requirements with official sources directly. Any future affiliate or partner links will be clearly disclosed.";

// V10.5: payment policy readiness.
export const PAID_SERVICES_DISCLAIMER =
  "This is planning support only. SettleMap does not provide legal, immigration, tax, property, financial, insurance, medical, school/admission or travel advice.";

export const PAYMENT_READINESS_NOTE =
  "SettleMap is in early access. Payments are not active yet. Early-access users will be contacted before any payment is requested.";

// V11.6 Part 1 — live support email, now published.
export const SUPPORT_EMAIL = "support@settlemap.app";

export const SUPPORT_EMAIL_SAFETY_NOTE =
  "Please do not send passport numbers, ID documents, medical records, bank details or other sensitive personal information by email.";

export const SUPPORT_CONTACT_NOTE = `Email support: ${SUPPORT_EMAIL}. ${SUPPORT_EMAIL_SAFETY_NOTE}`;

// V10.8: paid product clarity, resource action steps, and agentic roadmap readiness.
export const PRICING_BOUNDARY_SHORT =
  "Planning support only. SettleMap is not a travel agency, immigration adviser, property agent, financial adviser, insurance adviser, medical adviser, school/admission adviser, or government website. Always verify current requirements with official sources and qualified professionals.";

export const AGENT_ROADMAP_CAPABILITIES = [
  "Prepare route plans",
  "Draft messages",
  "Open comparison checklist",
  "Prepare document checklists",
  "Ask for approval before contacting providers",
  "Ask for approval before bookings or payments",
];

export const AGENT_ROADMAP_BOUNDARIES = [
  "Current version does not book services",
  "Current version does not contact providers",
  "Current version does not submit applications",
  "Current version does not make payments",
  "User approval will be required before any future external action",
];

// V10.9: consolidated launch readiness.
export const PRICING_NOT_INCLUDED_TITLE = "Not included in any current or future pilot unless explicitly stated.";

export const PRICING_NOT_INCLUDED = [
  "No human review",
  "No legal advice",
  "No immigration advice",
  "No tax or financial advice",
  "No property advice",
  "No insurance advice",
  "No medical advice",
  "No school/admission advice",
  "No provider contact by SettleMap today",
  "No booking by SettleMap today",
  "No payments made by SettleMap today",
  "No applications submitted by SettleMap today",
  "No guarantee of visa approval, housing availability, school admission, insurance acceptance, price, quality, licensing, service availability or outcome",
];

// Kept for backward compatibility with any older references; mirrors the verbatim V10.9 list above.
export const PAID_NOT_INCLUDED = PRICING_NOT_INCLUDED;

export const AGENTIC_APPROVAL_RULE =
  "SettleMap AI may prepare and suggest actions. You must approve before any external contact, booking, payment, submission or personal-data sharing.";

export const AGENTIC_ROADMAP_PHASES = [
  { phase: "Phase 1", title: "Drafts and checklists only", description: "AI drafts and checklists only." },
  { phase: "Phase 2", title: "Compares research options", description: "AI compares research options." },
  { phase: "Phase 3", title: "Prepares messages", description: "AI prepares emails/messages." },
  { phase: "Phase 4", title: "Contacts providers with approval", description: "AI contacts providers only after user approval." },
  { phase: "Phase 5", title: "Assists bookings/payments with approval", description: "AI assists bookings/payments only after explicit user approval." },
];

export const AI_CURRENT_BOUNDARIES = [
  "Current version does not contact providers",
  "Current version does not book hotels, flights, SIMs or services",
  "Current version does not make payments",
  "Current version does not submit forms",
  "Current version does not provide professional advice",
  "Current version does not process live voice sessions",
];

export const VOICE_GUIDE_DELIVERABLES = [
  "Voice-guided plan walkthrough",
  "Guided planning questions",
  "Next-step summary",
  "Script ideas",
  "Official-source reminders",
];

export const RESOURCE_LINKS_DISCLAIMER =
  "Service listings and external links are for research convenience only. They are not endorsements, guarantees, official recommendations, or promises of service quality, pricing, licensing, availability, or outcomes. Verify directly before engaging any provider.";

export const FUTURE_BOOKING_LINKS_TITLE = "Future booking and research links.";

export const FUTURE_BOOKING_LINKS_NOTE =
  "Some future links may be affiliate or partner links. If you choose to book directly with a third-party provider through those links, SettleMap may earn a commission at no extra cost to you. Official-source links are never paid placements.";

export const SUPPORT_CAN_HELP_LATER = [
  "Billing",
  "Technical issue",
  "Product feedback",
];

export const SUPPORT_CANNOT_HELP = [
  "Legal advice",
  "Immigration advice",
  "Tax advice",
  "Property advice",
  "Financial advice",
  "Insurance advice",
  "Medical advice",
  "School/admission advice",
];

export const SUPPORT_CURRENT_STATUS_NOTE = "Current status: early access version.";

// V11: AI-first homepage story, referral/partner disclosure language, and language readiness.

export const SETTLEMAP_HELPS_WITH = [
  "Planning and task organisation",
  "Official-source reminders",
  "Research links",
  "Copy-ready scripts",
  "Tenant Bio where applicable",
  "Future AI-generated plans and Voice Guide",
];

export const SETTLEMAP_DOES_NOT_DO = [
  "We do not provide legal, immigration, tax, property, financial, insurance, medical or school/admission advice.",
  "We do not guarantee approvals, prices, availability, licensing, quality or outcomes.",
  "We do not contact providers, book services, make payments or submit applications today.",
  "Where professional help is needed, SettleMap may show research options or partner contacts, but users must verify and engage directly.",
];

export const REFERRAL_RESEARCH_NOTE =
  "Where professional help may be useful, SettleMap may show relevant agencies, providers or partner contacts as research options. These are not endorsements or guarantees. Users must verify credentials, fees, terms and suitability directly.";

export const AFFILIATE_DISCLOSURE_FULL =
  "Some future links may be affiliate or partner links. If you choose to book directly with a third-party provider through those links, SettleMap may earn a commission at no extra cost to you. Official-source links are never paid placements.";

export const LANGUAGE_TRANSLATE_NOTE =
  "Prefer another language? Use your browser translation feature for now. Native multilingual support is planned.";

export const LANGUAGE_HELP_PAGE_NOTE =
  "Chrome, Safari and Edge can translate SettleMap into German, Italian, Hindi, Tamil and other languages using browser translation.";

export const AI_APPROVAL_RULE_VISIBLE =
  "SettleMap AI may prepare and suggest actions. You must approve before any external contact, booking, payment, submission or personal-data sharing.";

export const COMING_NEXT_ITEMS = [
  "AI-generated route plan",
  "Premium AI relocation pack",
  "SettleMap Voice Guide",
  "Partner research links",
  "Multilingual support",
];

// V11.5 Part 5 — short structured feedback field set. This mirrors what the real Tally form
// asks; it is shown on-site as a preview only (no on-site submission), since the form itself
// lives on Tally. Keep every field short — checkbox, 1-5 rating, or one short field. Only the
// final comment is free text, and only one such box exists.
export const FEEDBACK_WHO_IS_MOVING_OPTIONS = ["Student", "Working professional", "Family with children", "Domestic mover (within Singapore)", "Senior / retiree"];

export const FEEDBACK_USEFUL_OPTIONS = ["Action plan / task list", "Official-source links", "Copy-paste scripts", "Services directory", "Route library", "AI Assistant chat"];

export const FEEDBACK_MISSING_OPTIONS = ["More destinations/routes", "More detail per task", "Cost estimates", "Document checklist", "Local provider options", "Something else"];

export const FEEDBACK_PLAN_INTEREST_OPTIONS = ["S$19 AI Route Plan", "S$49 Premium AI Pack", "Voice Guide", "Not sure yet"];

// V11.5 Part 7 — pilot pricing is indicative; no live checkout exists yet.
export const PILOT_PRICE_TESTING_NOTE =
  "SettleMap is in early access. Payments are not active yet. Pilot prices are indicative. Payment links will be tested privately before public launch.";

// V11.5 Part 8 — Security and Data Handling page content, plus the footer link label.
export const SECURITY_DATA_PAGE_TITLE = "Security and data";

export const SECURITY_DATA_POINTS = [
  "No sensitive document upload is required to use SettleMap today.",
  "Payments, when enabled, will be handled by Stripe. SettleMap does not store card details.",
  "Feedback is collected through Tally, a third-party form provider.",
  "Do not submit passport numbers, ID numbers, or sensitive medical or financial details through feedback forms.",
  "SettleMap uses the planning details you enter (such as route, move type, and move date) only to generate your route checklist and to improve the product.",
  "You remain responsible for verifying official requirements directly with the relevant government, employer, school, or provider.",
];
