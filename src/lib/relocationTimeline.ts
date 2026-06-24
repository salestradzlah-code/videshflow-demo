import { destinations, moveReasons, profiles, type AddOnKey, type DestinationKey, type MoveReasonKey, type ProfileKey, type PetKey, type MoveDateKey, type TimelineTask } from "@/data/demoPlatform";

const baseTasks: TimelineTask[] = [
  {
    id: "official-route-check",
    phase: "Before you move",
    title: "Check official requirements",
    description: "Review official government, school, employer or regulator sources for the selected origin and destination before relying on any third-party advice.",
    nextStep: "Open official sources and save key deadlines.",
    timing: "T-60 to T-30",
    priority: "High",
    category: "Official sources",
    tier: "Core",
    section: "Official checks",
    whereToGo: "Use the official government, immigration, school or employer website for your specific origin and destination — see the Reference Links page for a starting list.",
    howTo: "Search the official site directly, note the page URL and the date you checked it, and save or screenshot the requirement so you can refer back to it later.",
    whatToPrepare: ["Origin and destination country/city", "Visa, pass or admission type", "Move date or target window"],
    buttonLabel: "Open reference links",
    sourceType: "Official source",
    aiAssistIdea: "Future AI assist could detect which official pages are most relevant to your route and flag when a requirement page has changed since you last checked it.",
  },
  {
    id: "document-folder",
    phase: "Before you move",
    title: "Create document folder",
    description: "Organise passports, approvals, certificates, medical records, school papers, employment documents and digital backups in one place.",
    nextStep: "Create document folder.",
    timing: "T-45",
    priority: "High",
    category: "Documents",
    tier: "Core",
    section: "Documents",
  },
  {
    id: "temporary-stay",
    phase: "Before you move",
    title: "Book temporary stay",
    description: "Use a hotel, serviced apartment or short stay until you understand commute, school, budget and neighbourhood reality before signing a long lease.",
    nextStep: "Compare three options.",
    timing: "T-30",
    priority: "High",
    category: "Housing",
    tier: "Core",
    section: "Housing",
    whereToGo: "Use the Services Directory housing section or a serviced-apartment/short-stay marketplace you trust.",
    howTo: "Shortlist 2 or 3 short-stay options and compare nightly/weekly rate, minimum stay, cancellation terms, and distance to work, school or transport.",
    whatToPrepare: ["Arrival date", "Length of stay needed", "Budget per night/week", "Number of travellers"],
    providerQuestions: ["Is a long-stay or weekly/monthly rate available?", "What is included (utilities, WiFi, cleaning)?", "What is the cancellation policy?"],
    buttonLabel: "Ask about long-stay rate",
    sourceType: "Research option",
    aiAssistIdea: "Future AI assist could compare short-stay listings against your commute and budget inputs and rank them automatically.",
  },
  {
    id: "budget-buffer",
    phase: "Before you move",
    title: "Plan first month budget",
    description: "Estimate rent deposit, temporary stay, first month transport, SIM, groceries, setup items (furniture, broadband, document charges) and an emergency buffer, then set a simple weekly tracking habit from day one. This is a planning checklist, not financial or insurance advice.",
    nextStep: "Estimate first month costs.",
    timing: "T-30",
    priority: "High",
    category: "Money",
    tier: "Core",
    section: "Money and banking",
  },
  {
    id: "arrival-connectivity",
    phase: "Days 1 to 7",
    title: "Get connected on arrival",
    description: "Set up local SIM or eSIM, internet access, maps, emergency numbers, local transport app and family communication plan.",
    nextStep: "Save emergency contacts.",
    timing: "Day 1",
    priority: "High",
    category: "Connectivity",
    tier: "Core",
    section: "Arrival week",
  },
  {
    id: "banking-first-week",
    phase: "Days 1 to 7",
    title: "Set up local banking",
    description: "Research local banking, payment apps, remittance, cards and salary account steps. Verify requirements with the bank directly.",
    nextStep: "Prepare provider questions.",
    timing: "Day 2 to 7",
    priority: "High",
    category: "Banking",
    tier: "Core",
    section: "Money and banking",
    whereToGo: "Use the Services Directory banking section, or visit/contact a local bank branch directly.",
    howTo: "Compare 2 or 3 banks on account opening requirements, minimum balance, fees, debit/credit card options and how international transfers work.",
    whatToPrepare: ["Passport / ID", "Proof of address", "Pass or visa approval letter", "Employment letter or proof of income"],
    providerQuestions: ["What documents are needed to open an account as a new arrival?", "Are there minimum balance or monthly fees?", "How long until the account and card are active?"],
    buttonLabel: "Prepare bank questions",
    sourceType: "Research option",
    aiAssistIdea: "Future AI assist could pre-fill a bank-account-opening checklist based on your pass type and bank's published requirements.",
    doThisBefore: "Visiting a branch or starting an online application.",
    dependsOn: "A local number, a confirmed address and your ID/pass documents.",
    whyItMatters: "Local banking often requires a local number, an address and pass or ID details. Confirm exact requirements with the bank before visiting a branch, so you are not turned away.",
  },
  {
    id: "rental-search",
    phase: "Days 8 to 30",
    title: "Compare housing areas",
    description: "Test the commute to work, school or university and compare rent, deposits, safety, school access and groceries across two or three areas before signing a long-term lease.",
    nextStep: "Compare three options.",
    timing: "Week 2 to 4",
    priority: "High",
    category: "Housing",
    tier: "Core",
    section: "Housing",
    whereToGo: "Use the Services Directory long-term housing section or a local property marketplace, and check local rental rules before signing anything.",
    howTo: "Shortlist 2 or 3 areas, test the commute at normal travel times, and compare rent, deposit, lease length, notice period and what is included before committing.",
    whatToPrepare: ["Budget range", "Preferred commute time", "Lease length needed", "Deposit funds available"],
    providerQuestions: ["What is the deposit, notice period and minimum stay?", "What is included in rent (utilities, WiFi, furnishing)?", "What are the local tenancy registration or rental rules?"],
    buttonLabel: "Open housing checklist",
    sourceType: "Research option",
    aiAssistIdea: "Future AI assist could flag whether a listed rent and deposit are within typical range for the area and pass type.",
  },
  {
    id: "home-setup",
    phase: "Days 8 to 30",
    title: "Set up home and health basics",
    description: "Plan furniture, appliances, WiFi, utilities and delivery windows, and register with a nearby clinic or pharmacy. Verify medical requirements directly.",
    nextStep: "Prepare provider questions.",
    timing: "Week 2 to 4",
    priority: "Medium",
    category: "Home setup",
    tier: "Recommended",
    section: "First 30 days",
    whereToGo: "Use the Services Directory healthcare section to find a nearby clinic, GP or pharmacy, and your home setup checklist for furniture/WiFi.",
    howTo: "Register with one clinic close to home before you need urgent care, and confirm how prescriptions and referrals work locally. Separately, compare 2 or 3 furniture/appliance and broadband providers for delivery and installation timing.",
    whatToPrepare: ["Passport / ID", "Existing medical records or prescriptions", "Home address", "Insurance details if applicable"],
    providerQuestions: ["What documents are needed to register as a new patient?", "How do prescription refills and referrals work?", "What is the earliest available appointment slot?"],
    buttonLabel: "Open healthcare checklist",
    sourceType: "Research option",
    aiAssistIdea: "Future AI assist could match clinics to your address and insurance coverage and flag registration documents you are missing.",
  },
  {
    id: "community-map",
    phase: "Days 31 to 90",
    title: "Build community and routine",
    description: "Build a family support network: local communities, cultural groups, places of worship, neighbourhood groups, expat/returnee networks, parent groups, professional circles, groceries and weekend routines.",
    nextStep: "Add to calendar.",
    timing: "Month 2",
    priority: "Medium",
    category: "Community",
    tier: "Recommended",
    section: "First 30 days",
  },
  {
    id: "review-costs",
    phase: "Days 31 to 90",
    title: "Review cost versus budget",
    description: "Compare actual rent, food, transport, school, insurance and setup spending against the original move budget.",
    nextStep: "Estimate first month costs.",
    timing: "Month 2 to 3",
    priority: "Medium",
    category: "Money",
    tier: "Optional",
    section: "Money and banking",
  },
];

const domesticBaseTasks: TimelineTask[] = [
  {
    id: "lease-handover",
    phase: "Before you move",
    title: "Plan lease handover and utilities",
    description: "Confirm notice period, deposit return conditions, handover inspection, repair obligations, and the closure or transfer date for electricity, water, gas and internet at the current address.",
    nextStep: "Add to calendar.",
    timing: "T-30",
    priority: "High",
    category: "Housing",
    tier: "Core",
    section: "Housing",
  },
  {
    id: "movers-quotes-domestic",
    phase: "Before you move",
    title: "Compare mover quotes",
    description: "Shortlist 2 or 3 movers and compare price, insurance, packing, delivery window and cancellation terms before booking a moving date.",
    nextStep: "Send the same inventory list to each mover so quotes are comparable.",
    timing: "T-21",
    priority: "High",
    category: "Movers",
    whereToGo: "Use the Services Directory moving section or your preferred local mover marketplace.",
    howTo: "Send the same inventory list to each provider so quotes are comparable, then book once insurance and cancellation terms are confirmed in writing.",
    whatToPrepare: ["Moving date", "Pickup address", "Delivery address", "Item list", "Lift access", "Fragile items and photos"],
    providerQuestions: ["What is covered by insurance, and what is excluded?", "What happens if the moving date changes?", "Are packing materials and labour included in the price?"],
    buttonLabel: "Open mover checklist",
    sourceType: "Research option",
    aiAssistIdea: "Future AI assist could compare submitted mover quotes side by side and flag any term that looks unusual.",
  },
  {
    id: "address-change",
    phase: "Days 1 to 7",
    title: "Update your address everywhere it matters",
    description: "Update address with banks, employer, postal redirection, subscriptions, local council or town registrations and parking permits.",
    timing: "Day 1 to 7",
    priority: "High",
    category: "Address changes",
  },
  {
    id: "school-transfer-domestic",
    phase: "Days 1 to 7",
    title: "Handle school transfer paperwork",
    description: "Request transfer records, confirm new school enrolment steps and align term dates if children are moving with you.",
    timing: "Day 1 to 7",
    priority: "Medium",
    category: "Schooling",
  },
  {
    id: "domestic-utilities-broadband",
    phase: "Days 1 to 7",
    title: "Transfer utilities and broadband",
    description: "Confirm the switch-over or new sign-up date for electricity, water, gas, internet and broadband at the new address so nothing lapses in the first week.",
    nextStep: "Confirm switch-over date.",
    timing: "Day 1 to 7",
    priority: "Medium",
    category: "Utilities",
    whereToGo: "Use the Services Directory utilities and broadband section, or contact your current and new providers directly.",
    howTo: "Book the new-address sign-up or transfer date before move-in, and confirm the final reading and closing date for the old address on the same call.",
    whatToPrepare: ["Old and new addresses", "Move-in date", "Account/customer numbers", "Proof of tenancy or ownership"],
    providerQuestions: ["What is the earliest activation date at the new address?", "Is there an installation or transfer fee?", "What is the final-bill process for the old address?"],
    buttonLabel: "Confirm switch-over date",
    sourceType: "Research option",
    aiAssistIdea: "Future AI assist could remind you a set number of days before the lease ends if a transfer date hasn't been booked yet.",
  },
  {
    id: "domestic-disposal-donation",
    phase: "Days 8 to 30",
    title: "Plan disposal or donation",
    description: "Decide what to store, sell, donate or move into the new home, and book bulky-item collection or donation drop-off before the move-in date.",
    nextStep: "Download checklist.",
    timing: "Week 2 to 4",
    priority: "Low",
    category: "Home setup",
    tier: "Recommended",
    section: "First 30 days",
    whereToGo: "Use your local municipal bulky-waste collection service, or a donation/charity drop-off and resale marketplace near you.",
    howTo: "Sort items into keep, sell, donate and dispose, then book a collection slot or drop-off date that lands before your move-in date.",
    whatToPrepare: ["List of items by category", "Photos for resale/donation listings", "Collection address and date", "Access details (lift, parking, stairs)"],
    providerQuestions: ["What items are accepted for donation or collection?", "Is there a collection fee or minimum notice period?", "What is the latest booking date before the move?"],
    buttonLabel: "Download checklist",
    sourceType: "Research option",
    aiAssistIdea: "Future AI assist could suggest a donate/sell/dispose split based on item photos and condition.",
  },
  {
    id: "domestic-budget-review",
    phase: "Days 31 to 90",
    title: "Review moving budget versus actual spend",
    description: "Compare actual mover, deposit, repair and setup costs against the original moving budget.",
    timing: "Month 2 to 3",
    priority: "Medium",
    category: "Money",
  },
];

const petAddOns: Record<PetKey, TimelineTask[]> = {
  none: [],
  dog: [
    { id: "pet-dog-rules", phase: "Before you move", title: "Check pet import or local pet rules", description: "Research import permits, vaccination records, microchip checks and quarantine requirements where relevant for your dog.", timing: "T-45", priority: "High", category: "Pets" },
    { id: "pet-dog-transport", phase: "Before you move", title: "Arrange pet-friendly transport", description: "Book airline or ground pet transport, crate requirements and travel timing suited to your dog.", timing: "T-21", priority: "Medium", category: "Pets" },
    { id: "pet-dog-stay-vet", phase: "Days 1 to 7", title: "Confirm pet-friendly stay and find a local vet", description: "Check pet-friendly temporary stay and rental rules, and shortlist a local vet near your new address.", timing: "Day 1 to 7", priority: "Medium", category: "Pets" },
  ],
  cat: [
    { id: "pet-cat-rules", phase: "Before you move", title: "Check pet import or local pet rules", description: "Research import permits, vaccination records, microchip checks and quarantine requirements where relevant for your cat.", timing: "T-45", priority: "High", category: "Pets" },
    { id: "pet-cat-transport", phase: "Before you move", title: "Arrange pet-friendly transport", description: "Book airline or ground pet transport, carrier requirements and travel timing suited to your cat.", timing: "T-21", priority: "Medium", category: "Pets" },
    { id: "pet-cat-stay-vet", phase: "Days 1 to 7", title: "Confirm pet-friendly stay and find a local vet", description: "Check pet-friendly temporary stay and rental rules, and shortlist a local vet near your new address.", timing: "Day 1 to 7", priority: "Medium", category: "Pets" },
  ],
  multiple: [
    { id: "pet-multi-rules", phase: "Before you move", title: "Check import or local pet rules for each pet", description: "Research import permits, vaccination records, microchip checks and quarantine requirements for every pet separately.", timing: "T-45", priority: "High", category: "Pets" },
    { id: "pet-multi-transport", phase: "Before you move", title: "Arrange transport for multiple pets", description: "Plan airline or ground transport, crates and travel timing that work for all pets together.", timing: "T-21", priority: "Medium", category: "Pets" },
    { id: "pet-multi-stay-vet", phase: "Days 1 to 7", title: "Confirm pet-friendly stay and find a local vet", description: "Check pet-friendly temporary stay and rental rules for multiple pets, and shortlist a local vet near your new address.", timing: "Day 1 to 7", priority: "Medium", category: "Pets" },
  ],
  other: [
    { id: "pet-other-rules", phase: "Before you move", title: "Check import or local rules for your pet", description: "Research species-specific import rules, vaccination or health records, and any quarantine requirements.", timing: "T-45", priority: "High", category: "Pets" },
    { id: "pet-other-stay-vet", phase: "Days 1 to 7", title: "Confirm pet-friendly stay and find a local vet", description: "Check pet-friendly temporary stay and rental rules, and shortlist a local vet familiar with your pet's species.", timing: "Day 1 to 7", priority: "Medium", category: "Pets" },
  ],
};

const reasonAddOns: Record<MoveReasonKey, TimelineTask[]> = {
  job: [
    { id: "job-offer-reality", phase: "Before you move", title: "Check salary and work readiness", description: "Compare salary against rent, tax direction, transport, school and insurance, and prepare formal wear, laptop accessories and first-week office expectations.", nextStep: "Estimate first month costs.", timing: "T-45", priority: "High", category: "Offer decision", tier: "Core" },
  ],
  corporate: [
    { id: "relocation-package", phase: "Before you move", title: "Decode relocation package and movers", description: "Separate employer-covered items from family-owned tasks (flights, hotel, movers, school search, spouse support, deposits) and request a written mover survey with packing, customs and insurance terms.", nextStep: "Compare three options.", timing: "T-45", priority: "High", category: "Employer", tier: "Core" },
  ],
  student: [
    {
      id: "student-docs",
      phase: "Before you move",
      title: "Lock student documents",
      description: "Organise admission letter, financial proof, transcripts, accommodation, insurance, visa or pass steps and emergency contacts.",
      nextStep: "Create document folder.",
      timing: "T-45",
      priority: "High",
      category: "Student",
      tier: "Core",
      section: "Documents",
      whereToGo: "Use the institution's official admissions/international-student office page, plus the document folder you are building.",
      howTo: "Request the full document checklist directly from the school or university, then collect each item and confirm the application or pass-application deadline.",
      whatToPrepare: ["Admission letter", "Financial proof", "Transcripts", "Accommodation confirmation", "Insurance details", "Emergency contacts"],
      providerQuestions: ["What is the full list of documents needed for admission and any visa/pass application?", "What is the deadline for each document?", "Is there a waitlist or conditional-offer process?"],
      buttonLabel: "Open document folder",
      sourceType: "Research option",
      aiAssistIdea: "Future AI assist could check off documents as you upload them and flag which ones are still missing.",
    },
  ],
  family: [
    { id: "family-schooling", phase: "Before you move", title: "Start school and childcare research", description: "Confirm school timing: term dates, application windows and transfer records. Request vaccination and medical records, check catchments, transport and childcare waitlists before arrival.", nextStep: "Compare three options.", timing: "T-60", priority: "High", category: "Schooling", tier: "Core" },
  ],
  pr: [
    { id: "long-term-docs", phase: "Before you move", title: "Plan long-term settlement documents", description: "Prepare certificates, financial records, medical records, education documents, insurance and family files for settlement.", timing: "T-60", priority: "High", category: "Settlement" },
    { id: "settlement-network", phase: "Days 31 to 90", title: "Build long-term local support", description: "Map community, schools, healthcare, banking, tax professionals, transport and housing options for a stable first year.", timing: "Month 2 to 3", priority: "Medium", category: "Community" },
  ],
  business: [
    { id: "business-setup", phase: "Before you move", title: "Research business setup and tax caution areas", description: "Use official business registration, banking and tax sources. Treat this as research, not tax or legal advice.", timing: "T-45", priority: "High", category: "Business" },
    { id: "network-build", phase: "Days 31 to 90", title: "Build local founder and professional network", description: "Find chambers, communities, startup groups, coworking options and professional service providers to research.", timing: "Month 2", priority: "Medium", category: "Network" },
  ],
  short: [
    { id: "light-pack", phase: "Before you move", title: "Plan light packing and temporary setup", description: "Avoid over-shipping. Focus on documents, clothes, work essentials, medicines and serviced accommodation.", timing: "T-21", priority: "Medium", category: "Packing" },
    { id: "expense-tracking", phase: "Days 1 to 7", title: "Set simple expense tracking", description: "Track reimbursable and personal expenses from day one to avoid assignment confusion.", timing: "Day 1", priority: "Medium", category: "Money" },
  ],
  returning: [
    { id: "reverse-relocation", phase: "Before you move", title: "Restart home-country systems", description: "Check housing, banking, tax residency caution and school transfer, then rebuild local ID, commute, community and healthcare routines that lapsed while you were away.", nextStep: "Create document folder.", timing: "T-45", priority: "High", category: "Returning home", tier: "Core" },
  ],
  landed: [
    { id: "already-landed-triage", phase: "Days 1 to 7", title: "Run first-week triage", description: "Prioritise SIM, bank, temporary stay, house search, groceries, emergency contacts, WiFi and local transport.", timing: "Today", priority: "High", category: "Arrival" },
    { id: "catch-up-plan", phase: "Days 8 to 30", title: "Catch up missed pre-move tasks", description: "Backfill documents, insurance, banking, housing, school, utilities and local registrations that were not completed before arrival.", timing: "Week 2", priority: "High", category: "Catch-up" },
  ],
  retirement: [
    { id: "retirement-healthcare", phase: "Before you move", title: "Check healthcare and pension logistics", description: "Research healthcare system access, long-term insurance, prescription continuity, and how pension or retirement income transfers. Confirm tax or residency points with qualified professionals.", nextStep: "Prepare provider questions.", timing: "T-60", priority: "High", category: "Healthcare", tier: "Core" },
    { id: "retirement-housing-comfort", phase: "Days 8 to 30", title: "Prioritise housing comfort", description: "Check accessibility, transport ease, single-level living options and proximity to healthcare, then find local clubs, faith communities and hobby groups for a steady weekly routine.", nextStep: "Compare three options.", timing: "Week 2 to 4", priority: "Medium", category: "Housing", tier: "Recommended" },
  ],
  domestic: [
    { id: "domestic-school-transfer", phase: "Days 1 to 7", title: "Confirm school transfer is on track", description: "Follow up on transfer records and new-school enrolment steps if children are part of the move.", timing: "Day 1 to 7", priority: "Medium", category: "Schooling" },
    { id: "domestic-services-update", phase: "Days 8 to 30", title: "Update local services and memberships", description: "Test the new commute, update transport passes or vehicle registration, and update gym, clinic, subscriptions and any address-linked memberships or local services.", timing: "Week 2 to 4", priority: "Low", category: "Local services" },
  ],
};

const profileAddOns: Record<ProfileKey, TimelineTask[]> = {
  solo: [
    { id: "solo-basics", phase: "Days 1 to 7", title: "Stabilise solo essentials", description: "Focus on temporary stay, SIM, transport, food, banking, safety and budget discipline.", timing: "Day 1 to 7", priority: "Medium", category: "Solo" },
  ],
  couple: [
    { id: "couple-setup", phase: "Days 8 to 30", title: "Align couple housing and budget", description: "Agree commute, rent ceiling, groceries, spouse setup, community and weekend routine.", timing: "Week 2 to 4", priority: "Medium", category: "Couple" },
  ],
  familyChild: [
    { id: "child-comfort", phase: "Days 1 to 7", title: "Set child comfort and safety basics", description: "Child healthcare basics: register with a nearby clinic or paediatrician and confirm medicine supply. Map school route, groceries, playground, emergency contacts and safe commute.", timing: "Day 1 to 7", priority: "High", category: "Child" },
  ],
  familyChildren: [
    { id: "children-routine", phase: "Days 8 to 30", title: "Build children’s school and activity routine", description: "Coordinate school records and transport. Confirm child healthcare basics (clinic, vaccinations on file) and research childcare, playgroups and a family-friendly neighbourhood.", timing: "Week 2 to 4", priority: "High", category: "Children" },
  ],
  student: [],
  seniors: [
    { id: "senior-access", phase: "Before you move", title: "Plan senior medical and accessibility needs", description: "Check medicines, prescriptions, accessibility, transport, nearby clinic, insurance and emergency contacts.", timing: "T-30", priority: "High", category: "Seniors" },
  ],
  retiree: [
    { id: "retiree-routine", phase: "Days 31 to 90", title: "Settle into a steady retirement routine", description: "Balance healthcare appointments, social activities, transport and a comfortable weekly rhythm in the new location.", timing: "Month 2 to 3", priority: "Medium", category: "Retiree" },
  ],
  elderlyParent: [
    { id: "elderly-parent-continuity", phase: "Before you move", title: "Plan elderly parent medical continuity and comfort", description: "Confirm medication supply, medical records transfer, accessibility needs, insurance caution for pre-existing conditions, and emergency contacts before the move.", timing: "T-30", priority: "High", category: "Elderly parent" },
  ],
  preferNotToSay: [
    { id: "general-checklist", phase: "Days 1 to 7", title: "Follow a general relocation checklist", description: "Cover documents, banking, housing, connectivity and healthcare basics that apply to most relocations.", timing: "Day 1 to 7", priority: "Medium", category: "General" },
  ],
};

const addOnTasks: Record<AddOnKey, TimelineTask[]> = {
  pets: [],
  schooling: [
    {
      id: "addon-school-records",
      phase: "Before you move",
      title: "Request school records and transfer documents",
      description: "Collect transcripts, vaccination records and transfer letters from the current school before the move.",
      timing: "T-45",
      priority: "High",
      category: "New contracts to set up",
      whereToGo: "Contact the current school's registrar or front office directly.",
      howTo: "Request transcripts, vaccination records and a transfer letter in writing, and ask how long processing takes so you are not left waiting close to the move date.",
      whatToPrepare: ["Student's full name and ID/enrolment number", "Grade/year level", "New school's name (if known)", "Move date"],
      providerQuestions: ["What is the full list of documents needed for admission?", "How long does processing take?", "Can records be sent electronically to the new school?"],
      buttonLabel: "Ask school about transfer documents",
      sourceType: "Research option",
      aiAssistIdea: "Future AI assist could track which transfer documents have been received versus still requested.",
    },
    {
      id: "addon-school-shortlist",
      phase: "Days 1 to 7",
      title: "Shortlist schools or childcare near your new address",
      description: "Compare catchments, fees, waitlists, transport and admission timelines. Verify directly with each school.",
      timing: "Day 1 to 7",
      priority: "High",
      category: "New contracts to set up",
      whereToGo: "Use the Services Directory schooling and childcare section, or each school's official admissions page.",
      howTo: "Shortlist 2 or 3 schools or childcare providers and compare catchment, fees, waitlist length, transport and admission timeline before applying.",
      whatToPrepare: ["Child's age/grade level", "Home address", "Budget for fees", "Transfer documents from the previous school"],
      providerQuestions: ["What is the full list of documents needed for admission?", "Is there a waitlist, and how long is it?", "What is the application deadline?"],
      buttonLabel: "Open schooling checklist",
      sourceType: "Research option",
      aiAssistIdea: "Future AI assist could rank shortlisted schools by commute time and published admission timelines.",
    },
  ],
  seniorHealthcare: [
    { id: "addon-senior-coverage", phase: "Before you move", title: "Check senior healthcare coverage and pre-existing conditions", description: "Insurance for seniors often excludes or surcharges pre-existing conditions. Compare policies and confirm exclusions directly with providers before relying on any plan.", timing: "T-45", priority: "High", category: "Insurance planning" },
    { id: "addon-senior-clinic", phase: "Days 8 to 30", title: "Register with a local clinic or GP for senior care", description: "Find a clinic comfortable with ongoing senior care needs and confirm how prescriptions and referrals work locally.", timing: "Week 2 to 4", priority: "High", category: "New contracts to set up" },
  ],
  medication: [
    { id: "addon-medication-supply", phase: "Before you move", title: "Plan medication and prescription continuity", description: "Check how much medication you can legally carry, get prescriptions in destination-recognised format, and confirm local availability of the same medicines.", timing: "T-30", priority: "High", category: "Insurance planning" },
    { id: "addon-medication-pharmacy", phase: "Days 1 to 7", title: "Locate a local pharmacy and confirm refill process", description: "Find a nearby pharmacy and confirm how prescriptions are transferred or re-issued in the new location.", timing: "Day 1 to 7", priority: "Medium", category: "New contracts to set up" },
  ],
  vehicle: [
    { id: "addon-vehicle-old", phase: "Before you move", title: "Decide on selling, shipping or storing your vehicle", description: "Compare costs of selling, shipping or storing your vehicle, plus road tax, parking and insurance cancellation at the old address.", timing: "T-30", priority: "Medium", category: "Existing contracts to terminate" },
    { id: "addon-vehicle-new", phase: "Days 8 to 30", title: "Check driving licence, IDP and local vehicle options", description: "Confirm licence validity, International Driving Permit requirements, and compare buying, leasing or ride-hailing for the new location.", timing: "Week 2 to 4", priority: "Medium", category: "New contracts to set up" },
  ],
  bankSimContinuity: [
    { id: "addon-sim-otp", phase: "Before you move", title: "Plan home-country bank OTP and SIM continuity", description: "Check if your home carrier offers low-cost roaming or standby plans, or switch OTP-critical accounts to an authenticator app before leaving.", timing: "T-21", priority: "High", category: "Existing contracts to terminate" },
    { id: "addon-sim-otp-followup", phase: "Days 1 to 7", title: "Confirm OTP access is working from the new location", description: "Test banking and government logins early so you are not locked out if SMS OTPs do not arrive internationally.", timing: "Day 1 to 7", priority: "High", category: "New contracts to set up" },
  ],
  contractsTerminate: [
    { id: "addon-lease-notice", phase: "Before you move", title: "Give lease notice and plan handover", description: "Confirm notice period, deposit return conditions and handover inspection at your current address.", timing: "T-45", priority: "High", category: "Existing contracts to terminate" },
    { id: "addon-broadband-cancel", phase: "Before you move", title: "Cancel or transfer broadband, WiFi, TV and cable", description: "Check cancellation notice periods and early-termination fees for internet, TV and cable contracts.", timing: "T-21", priority: "Medium", category: "Existing contracts to terminate" },
    { id: "addon-mobile-downgrade", phase: "Before you move", title: "Downgrade mobile plan or set up roaming", description: "Switch to a roaming plan or pause your existing mobile contract to avoid paying for unused local minutes.", timing: "T-14", priority: "Medium", category: "Existing contracts to terminate" },
    { id: "addon-utilities-cancel", phase: "Before you move", title: "Cancel or transfer utilities at the old address", description: "Plan final readings and closure for electricity, water and gas, or transfer where the new occupant agrees.", timing: "T-14", priority: "High", category: "Existing contracts to terminate" },
    { id: "addon-memberships-cancel", phase: "Before you move", title: "Cancel gym, clubs and memberships", description: "Review notice periods for gym, clubs and recurring memberships tied to your current address.", timing: "T-14", priority: "Low", category: "Existing contracts to terminate" },
    { id: "addon-school-notice", phase: "Before you move", title: "Give school or childcare notice at the old location", description: "Notify the current school or childcare provider and request transfer documents ahead of departure.", timing: "T-30", priority: "Medium", category: "Existing contracts to terminate" },
    { id: "addon-insurance-cancel", phase: "Before you move", title: "Cancel or transfer existing insurance policies", description: "Check renter, home, vehicle or health insurance cancellation terms before leaving. Confirm refund or transfer rules directly with the insurer.", timing: "T-21", priority: "Medium", category: "Existing contracts to terminate" },
    { id: "addon-vehicle-wind-down", phase: "Before you move", title: "Wind down vehicle sale, storage, road tax and parking", description: "Settle vehicle sale or storage, cancel road tax and parking permits where no longer needed at the old address.", timing: "T-21", priority: "Medium", category: "Existing contracts to terminate" },
    { id: "addon-helper-notice", phase: "Before you move", title: "Give notice to domestic helper or service providers where relevant", description: "Confirm notice periods, final payments and references for any household helper or recurring service provider.", timing: "T-21", priority: "Low", category: "Existing contracts to terminate" },
    { id: "addon-mail-forwarding", phase: "Days 1 to 7", title: "Set up mail forwarding and update your address", description: "Arrange mail redirection and update your address with banks, employer and key subscriptions.", timing: "Day 1 to 7", priority: "Medium", category: "Existing contracts to terminate" },
    { id: "addon-subscriptions-cancel", phase: "Before you move", title: "Cancel local subscriptions and deliveries", description: "Review recurring local subscriptions, food deliveries and memberships that will not transfer to the new location.", timing: "T-14", priority: "Low", category: "Existing contracts to terminate" },
  ],
  contractsSetup: [
    { id: "addon-setup-temp-stay", phase: "Before you move", title: "Book temporary stay at the destination", description: "Arrange a temporary stay before committing to a long-term rental at the destination.", timing: "T-21", priority: "High", category: "New contracts to set up" },
    { id: "addon-setup-rental", phase: "Days 8 to 30", title: "Sign a long-term rental agreement", description: "Compare rent, deposit terms and lease conditions before signing a long-term rental at the destination.", timing: "Week 2 to 4", priority: "High", category: "New contracts to set up", doThisBefore: "Signing any lease or paying a deposit.", dependsOn: "A temporary stay to view areas in person, and proof of income/pass or ID ready for the landlord or agent.", whyItMatters: "Committing to a long lease before viewing in person or before your income/ID documents are ready can be hard to reverse. Use a temporary stay to compare areas first." },
    { id: "addon-setup-utilities", phase: "Days 1 to 7", title: "Set up electricity, water and gas", description: "Open new utility accounts at the destination address and confirm activation timelines.", timing: "Day 1 to 7", priority: "High", category: "New contracts to set up" },
    { id: "addon-setup-broadband", phase: "Days 1 to 7", title: "Set up broadband and WiFi", description: "Compare local broadband providers and book installation as early as possible.", timing: "Day 1 to 7", priority: "Medium", category: "New contracts to set up" },
    { id: "addon-setup-mobile", phase: "Days 1 to 7", title: "Activate a local mobile, SIM or eSIM", description: "Set up a local SIM or eSIM for calls, data and local verification codes.", timing: "Day 1 to 7", priority: "High", category: "New contracts to set up", doThisBefore: "Setting up local banking, government accounts or local ID/app access.", dependsOn: "Passport/ID, since most carriers require ID to register a SIM.", whyItMatters: "A local number is often required before banking, government or app registration will accept you. Doing this early avoids being blocked later." },
    { id: "addon-setup-tv", phase: "Days 8 to 30", title: "Set up TV or streaming if relevant", description: "Compare local TV, cable or streaming options if relevant to your household.", timing: "Week 2 to 4", priority: "Low", category: "New contracts to set up" },
    { id: "addon-setup-banking", phase: "Days 1 to 7", title: "Set up local banking and payment apps", description: "Open a local bank account and set up payment apps for daily transactions.", timing: "Day 1 to 7", priority: "High", category: "New contracts to set up", doThisBefore: "Visiting a branch or starting an online application.", dependsOn: "A local number, a confirmed address and your ID/pass documents.", whyItMatters: "Local banking often requires a local number, an address and pass or ID details. Check exact requirements with the bank before visiting a branch." },
    { id: "addon-setup-insurance", phase: "Days 8 to 30", title: "Set up local insurance where relevant", description: "Compare renter, health or vehicle insurance for the new location and verify with licensed providers.", timing: "Week 2 to 4", priority: "Medium", category: "New contracts to set up" },
    { id: "addon-setup-school", phase: "Days 8 to 30", title: "Set up school or childcare at the destination", description: "Complete enrolment steps for school or childcare if children are part of the move.", timing: "Week 2 to 4", priority: "Medium", category: "New contracts to set up" },
    { id: "addon-setup-clinic", phase: "Days 8 to 30", title: "Register with a healthcare clinic or GP", description: "Find a nearby clinic or GP and register before you need urgent care.", timing: "Week 2 to 4", priority: "Medium", category: "New contracts to set up" },
    { id: "addon-setup-transport-card", phase: "Days 1 to 7", title: "Get a public transport card", description: "Set up a local transport card or app for daily commuting.", timing: "Day 1 to 7", priority: "Low", category: "New contracts to set up" },
    { id: "addon-setup-driving", phase: "Days 8 to 30", title: "Check driving licence or IDP requirements", description: "Confirm whether your licence is valid locally or whether you need an International Driving Permit or local conversion.", timing: "Week 2 to 4", priority: "Medium", category: "New contracts to set up" },
    { id: "addon-setup-furniture", phase: "Days 8 to 30", title: "Plan furniture and appliance delivery", description: "Compare furniture and appliance options and confirm delivery windows for the new home.", timing: "Week 2 to 4", priority: "Medium", category: "New contracts to set up" },
    { id: "addon-setup-groceries", phase: "Days 1 to 7", title: "Map groceries and community options", description: "Find the nearest supermarket, cultural food options and community groups near your new home.", timing: "Day 1 to 7", priority: "Low", category: "New contracts to set up" },
  ],
  insurance: [
    { id: "addon-insurance-travel", phase: "Before you move", title: "Compare travel insurance for the move itself", description: "Compare travel insurance covering the journey and the initial settling-in period. SettleMap does not sell or advise on insurance.", timing: "T-30", priority: "Medium", category: "Insurance planning" },
    { id: "addon-insurance-health", phase: "Before you move", title: "Compare health or medical insurance", description: "Compare health or medical insurance options at the destination. Verify coverage, exclusions and waiting periods with licensed providers.", timing: "T-30", priority: "High", category: "Insurance planning" },
    { id: "addon-insurance-home", phase: "Days 8 to 30", title: "Compare renter or home insurance", description: "Compare renter or home insurance for your new address, including contents and liability cover.", timing: "Week 2 to 4", priority: "Medium", category: "Insurance planning" },
  ],
  temporaryStay: [
    { id: "addon-temp-stay-book", phase: "Before you move", title: "Book a temporary stay bridge before signing a lease", description: "Book a hotel, serviced apartment or short stay to bridge the gap before committing to a long-term rental.", timing: "T-21", priority: "High", category: "New contracts to set up" },
  ],
  furniture: [
    { id: "addon-furniture-plan", phase: "Days 8 to 30", title: "Plan furniture and appliances for the new home", description: "Compare voltage, warranty, delivery and installation timing for furniture and appliances before buying.", timing: "Week 2 to 4", priority: "Medium", category: "New contracts to set up" },
  ],
  storage: [
    { id: "addon-storage-book", phase: "Before you move", title: "Book storage for items not moving immediately", description: "Compare storage unit size, cost and access terms for belongings not travelling with you right away.", timing: "T-21", priority: "Medium", category: "Existing contracts to terminate" },
  ],
  languageCommunity: [
    { id: "addon-language-community", phase: "Days 31 to 90", title: "Connect with language, community and cultural groups", description: "Find community groups, language classes, faith groups and cultural associations to help you settle in socially.", timing: "Month 2 to 3", priority: "Low", category: "Settling in" },
  ],
};

const singaporeRentalChecklist: TimelineTask[] = [
  { id: "sg-rental-cooking-rules", phase: "Before you move", title: "Confirm cooking rules with the landlord", description: "Check whether daily cooking is allowed or only light cooking. Many shared rooms in Singapore restrict cooking — confirm directly with the landlord or agent.", timing: "T-21", priority: "High", category: "Singapore rental checklist" },
  { id: "sg-rental-furnishing", phase: "Before you move", title: "Confirm fully furnished items in writing", description: "List exactly what is included: bed, wardrobe, desk, aircon. Get this confirmed in writing before paying any deposit.", timing: "T-21", priority: "High", category: "Singapore rental checklist" },
  { id: "sg-rental-utilities-wifi", phase: "Before you move", title: "Confirm utilities and WiFi inclusions", description: "Check whether utilities, WiFi and aircon usage are included in rent or billed separately, and ask about any usage caps.", timing: "T-14", priority: "High", category: "Singapore rental checklist" },
  { id: "sg-rental-occupancy-rules", phase: "Before you move", title: "Confirm single occupancy and visitor rules", description: "Ask about occupancy limits, overnight guest rules and any restrictions tied to your pass type before signing.", timing: "T-14", priority: "Medium", category: "Singapore rental checklist" },
  { id: "sg-rental-agent-fee", phase: "Before you move", title: "Confirm agent fee, if any", description: "Clarify whether an agent fee applies, who pays it, and get the amount confirmed in writing before committing.", timing: "T-14", priority: "Medium", category: "Singapore rental checklist" },
  { id: "sg-rental-move-in-date", phase: "Before you move", title: "Confirm move-in date and key handover", description: "Lock the move-in date and key handover process with the landlord or agent ahead of your arrival.", timing: "T-10", priority: "Medium", category: "Singapore rental checklist" },
  { id: "sg-rental-registration", phase: "Days 1 to 7", title: "Confirm landlord approval and proper registration", description: "For HDB flats, verify official HDB rules, eligibility and registration requirements before committing. For condos, verify condo house rules and management/landlord approval. Always verify official rules directly — this is not legal or housing advice.", timing: "Day 1 to 7", priority: "High", category: "Singapore rental checklist", doThisBefore: "Signing the tenancy agreement or paying a deposit.", dependsOn: "Pass/ID details and confirmed eligibility for the flat or unit type.", whyItMatters: "HDB and condo rentals each have their own eligibility and registration rules. Check requirements with HDB, the management office or agent before committing." },
  { id: "sg-rental-deposit-terms", phase: "Days 1 to 7", title: "Confirm deposit, notice period and minimum stay", description: "Get deposit amount, notice period, minimum stay and visitor rules confirmed in writing before signing the tenancy agreement.", timing: "Day 1 to 7", priority: "High", category: "Singapore rental checklist" },
];

// V10.1.1 — make the generic "Build community and routine" task read naturally for the
// move profile instead of always sounding family/community-oriented (e.g. for a solo or
// student mover). Title only; the task id, phase and category are unchanged.
const COMMUNITY_TASK_TITLE_BY_PROFILE: Partial<Record<ProfileKey, string>> = {
  student: "Set campus routine",
  solo: "Build local routine and support network",
  familyChild: "Build family routine, school rhythm and local support",
  familyChildren: "Build family routine, school rhythm and local support",
};

// V11.3 — student-life and campus routine were two separate tasks; merged into the single
// "Set campus routine" community task below, so the description needs the campus-specific
// content folded in (accommodation, transport, budget, study schedule, local support).
const COMMUNITY_TASK_DESCRIPTION_BY_PROFILE: Partial<Record<ProfileKey, string>> = {
  student: "Plan campus transport, study schedule and budget alongside finding local communities, cultural groups, groceries and weekend routines.",
};

function withRouteContext(task: TimelineTask, originLabel: string, destinationLabel: string, profileKey?: ProfileKey): TimelineTask {
  const isCommunityTask = task.id === "community-map";
  const title = isCommunityTask && profileKey && COMMUNITY_TASK_TITLE_BY_PROFILE[profileKey]
    ? COMMUNITY_TASK_TITLE_BY_PROFILE[profileKey]!
    : task.title;
  const baseDescription = isCommunityTask && profileKey && COMMUNITY_TASK_DESCRIPTION_BY_PROFILE[profileKey]
    ? COMMUNITY_TASK_DESCRIPTION_BY_PROFILE[profileKey]!
    : task.description;
  return {
    ...task,
    title,
    description: baseDescription.replace("selected origin and destination", `${originLabel} to ${destinationLabel}`),
  };
}

// V10.1 — for a domestic move, pet tasks should read as a local-only checklist, not an
// international import/customs checklist. Strip import/customs-specific wording in that case.
function withDomesticPetContext(task: TimelineTask, isDomestic: boolean): TimelineTask {
  if (!isDomestic) return task;
  return {
    ...task,
    title: task.title.replace("Check pet import or local pet rules", "Check local pet travel rules").replace("Check import or local pet rules for each pet", "Check local pet travel rules for each pet").replace("Check import or local rules for your pet", "Check local pet travel rules"),
    description: task.description.replace(/Research import permits, vaccination records, microchip checks and quarantine requirements[^.]*\./, "Confirm vaccination records, microchip checks and any local transport rules for the move within the same country.").replace(/Research species-specific import rules[^.]*\./, "Confirm species-specific local transport rules and any health or microchip records needed."),
  };
}

export function buildTimeline(
  originKey: DestinationKey,
  destinationKey: DestinationKey,
  reasonKey: MoveReasonKey,
  profileKey: ProfileKey,
  petKey: PetKey = "none",
  addOns: AddOnKey[] = [],
  hasAccommodationContext: boolean = false,
): TimelineTask[] {
  const origin = destinations.find((item) => item.key === originKey) ?? destinations[0];
  const destination = destinations.find((item) => item.key === destinationKey) ?? destinations[1];
  const reason = moveReasons.find((item) => item.key === reasonKey) ?? moveReasons[0];
  const profile = profiles.find((item) => item.key === profileKey) ?? profiles[0];
  const isDomestic = originKey === destinationKey;
  // V10.1 Fix 1 — children/childcare/school tasks must only appear when the profile is
  // Family with child(ren) or the user explicitly selected the Children/schooling add-on.
  const hasChildrenContext = profileKey === "familyChild" || profileKey === "familyChildren" || addOns.includes("schooling");

  const routeSpecific: TimelineTask = isDomestic
    ? {
        id: "route-specific-starter-kit",
        phase: "Before you move",
        title: `Build your domestic relocation plan within ${origin.label}`,
        description: `Use the ${reason.label.toLowerCase()} and ${profile.label.toLowerCase()} context to prioritise lease handover, movers, utilities, registrations and first-month tasks.`,
        timing: "Today",
        priority: "High",
        category: "Domestic relocation plan",
      }
    : {
        id: "route-specific-starter-kit",
        phase: "Before you move",
        title: `Create your ${origin.label} to ${destination.label} route starter kit`,
        description: `Use the ${reason.label.toLowerCase()} and ${profile.label.toLowerCase()} context to prioritise official links, documents, services, money planning and first-month tasks.`,
        timing: "Today",
        priority: "High",
        category: "International relocation plan",
      };

  // V10.1 Fix 1 — domestic school-transfer tasks should only appear when children are
  // actually part of the move, not for every domestic relocation (e.g. Solo, Couple).
  // V11.3 — people returning to their home country already know the area, so a temporary
  // stay search and a separate end-of-period cost review are not core actions for them.
  const isReturning = reasonKey === "returning" && !isDomestic;
  const baseSet = (isDomestic ? domesticBaseTasks : baseTasks).filter(
    (task) =>
      (hasChildrenContext || task.id !== "school-transfer-domestic") &&
      (!isReturning || (task.id !== "temporary-stay" && task.id !== "review-costs")),
  );
  const reasonTasks = reasonAddOns[reason.key].filter(
    (task) => hasChildrenContext || task.id !== "domestic-school-transfer",
  );

  const uniqueAddOns = Array.from(new Set(addOns));
  // V10.1 Fix 1 — Singapore rental tasks should appear whenever housing/accommodation is
  // actually relevant: either the user picked a housing-related add-on, or they opened and
  // used the accommodation profile step directly (manual "+ Add accommodation" entry point).
  const wantsHousingHelp = uniqueAddOns.includes("temporaryStay") || uniqueAddOns.includes("contractsSetup") || hasAccommodationContext;
  const singaporeChecklist = destinationKey === "singapore" && wantsHousingHelp ? singaporeRentalChecklist : [];
  const petTasks = petAddOns[petKey].map((task) => withDomesticPetContext(task, isDomestic));

  // V10.1.1 hotfix — "addon-setup-school" and "addon-school-notice" live inside the
  // contractsSetup / contractsTerminate add-on bundles, which Student and Solo users pick
  // for entirely unrelated reasons (broadband, banking, utilities). Those two specific tasks
  // must still obey the children/schooling gate even though the rest of the bundle should not.
  const SCHOOL_CHILDCARE_TASK_IDS = new Set(["addon-setup-school", "addon-school-notice"]);
  const addOnTaskList = uniqueAddOns
    .flatMap((key) => addOnTasks[key] ?? [])
    .filter((task) => hasChildrenContext || !SCHOOL_CHILDCARE_TASK_IDS.has(task.id));

  return [
    routeSpecific,
    ...baseSet.map((task) => withRouteContext(task, origin.label, destination.label, profile.key)),
    ...reasonTasks,
    ...profileAddOns[profile.key],
    ...petTasks,
    ...addOnTaskList,
    ...singaporeChecklist,
  ];
}

export function groupByPhase(tasks: TimelineTask[]) {
  return tasks.reduce<Record<string, TimelineTask[]>>((acc, task) => {
    if (!acc[task.phase]) acc[task.phase] = [];
    acc[task.phase].push(task);
    return acc;
  }, {});
}

export function calculateProgress(tasks: TimelineTask[], completedIds: string[]) {
  if (!tasks.length) return 0;
  const completed = tasks.filter((task) => completedIds.includes(task.id)).length;
  return Math.round((completed / tasks.length) * 100);
}

// V9.2 dynamic timeline foundation. Data and labels only — no calendar integration yet.
export type MoveDateLabel = { label: string; date: string };

export function getMoveDateLabels(moveDateType: MoveDateKey | null, moveDateValue: string): MoveDateLabel[] {
  if (moveDateType !== "exact" || !moveDateValue) return [];
  const moveDate = new Date(`${moveDateValue}T00:00:00`);
  if (Number.isNaN(moveDate.getTime())) return [];

  function offset(days: number, label: string): MoveDateLabel {
    const d = new Date(moveDate);
    d.setDate(d.getDate() + days);
    return { label, date: d.toISOString().slice(0, 10) };
  }

  return [
    offset(-90, "90 days before move"),
    offset(-30, "30 days before move"),
    offset(-7, "7 days before move"),
    offset(0, "Arrival week"),
    offset(30, "First 30 days"),
    offset(90, "First 90 days"),
  ];
}
