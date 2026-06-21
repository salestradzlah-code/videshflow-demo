import { destinations, moveReasons, profiles, type AddOnKey, type DestinationKey, type MoveReasonKey, type ProfileKey, type PetKey, type TimelineTask } from "@/data/demoPlatform";

const baseTasks: TimelineTask[] = [
  {
    id: "official-route-check",
    phase: "Before you move",
    title: "Verify official route requirements",
    description: "Check official government, school, employer or immigration sources for the selected origin and destination before relying on any third-party advice.",
    timing: "T-60 to T-30",
    priority: "High",
    category: "Official sources",
  },
  {
    id: "document-folder",
    phase: "Before you move",
    title: "Create one relocation document folder",
    description: "Organise passports, approvals, certificates, medical records, school papers, employment documents and digital backups.",
    timing: "T-45",
    priority: "High",
    category: "Documents",
  },
  {
    id: "temporary-stay",
    phase: "Before you move",
    title: "Book temporary stay before long rental",
    description: "Use hotels, serviced apartments or short stays until you understand commute, school, budget and neighbourhood reality.",
    timing: "T-30",
    priority: "High",
    category: "Housing",
  },
  {
    id: "budget-buffer",
    phase: "Before you move",
    title: "Build first 60-day cash buffer",
    description: "Plan for deposits, transport, food, furniture, school, SIM, broadband, document charges and emergency costs.",
    timing: "T-30",
    priority: "High",
    category: "Money",
  },
  {
    id: "arrival-connectivity",
    phase: "Days 1 to 7",
    title: "Get connected on arrival",
    description: "Set up local SIM or eSIM, internet access, maps, emergency numbers, local transport app and family communication plan.",
    timing: "Day 1",
    priority: "High",
    category: "Connectivity",
  },
  {
    id: "banking-first-week",
    phase: "Days 1 to 7",
    title: "Start banking and payments setup",
    description: "Research local banking, payment apps, remittance, cards and salary account steps. Verify requirements with the bank directly.",
    timing: "Day 2 to 7",
    priority: "High",
    category: "Banking",
  },
  {
    id: "commute-test",
    phase: "Days 1 to 7",
    title: "Test commute and neighbourhood reality",
    description: "Do a real commute test to work, school or university before locking housing decisions.",
    timing: "Day 3 to 7",
    priority: "Medium",
    category: "Transport",
  },
  {
    id: "rental-search",
    phase: "Days 8 to 30",
    title: "Shortlist long-term housing",
    description: "Compare rent, commute, deposits, safety, school access, groceries and local rules before signing.",
    timing: "Week 2 to 4",
    priority: "High",
    category: "Housing",
  },
  {
    id: "home-setup",
    phase: "Days 8 to 30",
    title: "Set up home basics",
    description: "Plan furniture, appliances, mattress, kitchen basics, WiFi, utilities, cleaning, repairs and delivery windows.",
    timing: "Week 2 to 4",
    priority: "Medium",
    category: "Home setup",
  },
  {
    id: "local-health",
    phase: "Days 8 to 30",
    title: "Set healthcare and emergency basics",
    description: "Research clinics, insurance, prescriptions, emergency numbers and nearby pharmacies. Verify medical requirements directly.",
    timing: "Week 2 to 4",
    priority: "Medium",
    category: "Healthcare",
  },
  {
    id: "community-map",
    phase: "Days 31 to 90",
    title: "Build community and routine",
    description: "Find local communities, cultural groups, places of worship, neighbourhood groups, expat/returnee networks, parent groups, professional circles, groceries and weekend routines.",
    timing: "Month 2",
    priority: "Medium",
    category: "Community",
  },
  {
    id: "review-costs",
    phase: "Days 31 to 90",
    title: "Review real cost versus assumptions",
    description: "Compare actual rent, food, transport, school, insurance and setup spending against the original move budget.",
    timing: "Month 2 to 3",
    priority: "Medium",
    category: "Money",
  },
];

const domesticBaseTasks: TimelineTask[] = [
  {
    id: "lease-handover",
    phase: "Before you move",
    title: "Plan lease handover and notice periods",
    description: "Confirm notice period, deposit return conditions, handover inspection and any cleaning or repair obligations on the current address.",
    timing: "T-30",
    priority: "High",
    category: "Housing",
  },
  {
    id: "movers-quotes-domestic",
    phase: "Before you move",
    title: "Get mover quotes and book a moving date",
    description: "Compare local mover quotes, insurance cover, packing materials and a realistic moving-day schedule.",
    timing: "T-21",
    priority: "High",
    category: "Movers",
  },
  {
    id: "utilities-transfer",
    phase: "Before you move",
    title: "Transfer or close out utilities",
    description: "Plan electricity, water, gas, internet and home insurance closure at the old address and setup at the new one.",
    timing: "T-14",
    priority: "High",
    category: "Utilities",
  },
  {
    id: "address-change",
    phase: "Days 1 to 7",
    title: "Update your address everywhere it matters",
    description: "Update address with banks, employer, postal redirection, subscriptions and government registrations.",
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
    id: "local-registrations",
    phase: "Days 8 to 30",
    title: "Complete local registrations",
    description: "Check local council, town or city registrations, parking permits and any address-linked local services.",
    timing: "Week 2 to 4",
    priority: "Medium",
    category: "Registrations",
  },
  {
    id: "storage-furniture",
    phase: "Days 8 to 30",
    title: "Sort storage and furniture decisions",
    description: "Decide what to store, sell, donate or move, and book storage or furniture delivery slots accordingly.",
    timing: "Week 2 to 4",
    priority: "Medium",
    category: "Home setup",
  },
  {
    id: "local-transport-domestic",
    phase: "Days 8 to 30",
    title: "Confirm local transport and commute",
    description: "Test the new commute, update transport passes or vehicle registration details for the new address.",
    timing: "Week 2 to 4",
    priority: "Medium",
    category: "Transport",
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
    { id: "job-offer-reality", phase: "Before you move", title: "Check salary against real setup costs", description: "Compare salary, rent, tax direction, transport, school, insurance and deposits before finalising the move plan.", timing: "T-45", priority: "High", category: "Offer decision" },
    { id: "office-readiness", phase: "Before you move", title: "Prepare office clothing and work basics", description: "Plan formal wear, shoes, laptop accessories, commute, first-week office expectations and local business etiquette.", timing: "T-20", priority: "Medium", category: "Work" },
  ],
  corporate: [
    { id: "relocation-package", phase: "Before you move", title: "Decode employer relocation package", description: "Separate employer-covered items from family-owned tasks: flights, hotel, movers, school search, spouse support and deposits.", timing: "T-45", priority: "High", category: "Employer" },
    { id: "mover-survey", phase: "Before you move", title: "Request mover survey and written quote", description: "Compare packing, customs, insurance, storage, destination delivery, stairs, lift and hidden charges.", timing: "T-35", priority: "High", category: "Movers" },
  ],
  student: [
    { id: "student-docs", phase: "Before you move", title: "Lock university and student documents", description: "Organise admission letter, financial proof, transcripts, accommodation, insurance, visa or pass steps and emergency contacts.", timing: "T-45", priority: "High", category: "Student" },
    { id: "student-budget", phase: "Days 1 to 7", title: "Set student budget and transport routine", description: "Track rent, food, transport, mobile, study material, health cover and one-time setup costs from week one.", timing: "Day 1 to 7", priority: "Medium", category: "Budget" },
  ],
  family: [
    { id: "family-schooling", phase: "Before you move", title: "Start school and childcare research", description: "Check school calendars, records, vaccination notes, catchments, transport and childcare waitlists before arrival.", timing: "T-60", priority: "High", category: "Schooling" },
    { id: "family-groceries", phase: "Days 1 to 7", title: "Map groceries, clinic and family basics", description: "Find nearest supermarket, cultural food and community options, clinic, pharmacy, playground and safe transport routine.", timing: "Day 1 to 7", priority: "Medium", category: "Family" },
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
    { id: "reverse-relocation", phase: "Before you move", title: "Treat return home as a full relocation", description: "Check housing, NRI banking, tax residency caution, school transfer, documents, movers, SIM and healthcare continuity.", timing: "T-45", priority: "High", category: "Returning home" },
    { id: "local-reintegration", phase: "Days 31 to 90", title: "Rebuild local systems and routines", description: "Settle banking, local ID, utilities, domestic help, commute, community, school and healthcare routines.", timing: "Month 2 to 3", priority: "Medium", category: "Routine" },
  ],
  landed: [
    { id: "already-landed-triage", phase: "Days 1 to 7", title: "Run first-week triage", description: "Prioritise SIM, bank, temporary stay, house search, groceries, emergency contacts, WiFi and local transport.", timing: "Today", priority: "High", category: "Arrival" },
    { id: "catch-up-plan", phase: "Days 8 to 30", title: "Catch up missed pre-move tasks", description: "Backfill documents, insurance, banking, housing, school, utilities and local registrations that were not completed before arrival.", timing: "Week 2", priority: "High", category: "Catch-up" },
  ],
  retirement: [
    { id: "retirement-healthcare", phase: "Before you move", title: "Check healthcare access and long-term insurance", description: "Research healthcare system access, long-term insurance options, and prescription or medicine continuity for the destination.", timing: "T-60", priority: "High", category: "Healthcare" },
    { id: "retirement-income", phase: "Before you move", title: "Plan pension and retirement income logistics", description: "Understand how pension or retirement income transfers, and note tax or residency caution points to confirm with qualified professionals.", timing: "T-45", priority: "High", category: "Income planning" },
    { id: "retirement-housing-comfort", phase: "Days 8 to 30", title: "Prioritise housing comfort and accessibility", description: "Check accessibility, transport ease, single-level living options and proximity to healthcare and daily needs.", timing: "Week 2 to 4", priority: "Medium", category: "Housing" },
    { id: "retirement-community", phase: "Days 31 to 90", title: "Build a community and social routine", description: "Find local clubs, faith communities, hobby groups and a steady weekly routine to support wellbeing.", timing: "Month 2 to 3", priority: "Medium", category: "Community" },
  ],
  domestic: [
    { id: "domestic-school-transfer", phase: "Days 1 to 7", title: "Confirm school transfer is on track", description: "Follow up on transfer records and new-school enrolment steps if children are part of the move.", timing: "Day 1 to 7", priority: "Medium", category: "Schooling" },
    { id: "domestic-services-update", phase: "Days 8 to 30", title: "Update local services and memberships", description: "Update gym, clinic, subscriptions and any address-linked memberships or local services.", timing: "Week 2 to 4", priority: "Low", category: "Local services" },
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
    { id: "child-comfort", phase: "Days 1 to 7", title: "Set child comfort and safety basics", description: "Map school route, clinic, groceries, playground, medicines, emergency contacts and safe commute.", timing: "Day 1 to 7", priority: "High", category: "Child" },
  ],
  familyChildren: [
    { id: "children-routine", phase: "Days 8 to 30", title: "Build children’s school and activity routine", description: "Coordinate school records, transport, childcare, playgroups, healthcare and family-friendly neighbourhood research.", timing: "Week 2 to 4", priority: "High", category: "Children" },
  ],
  student: [
    { id: "student-life", phase: "Days 8 to 30", title: "Set student life routine", description: "Plan accommodation, campus transport, budget, groceries, health cover, study schedule and local support.", timing: "Week 2", priority: "Medium", category: "Student" },
  ],
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
    { id: "addon-school-records", phase: "Before you move", title: "Request school records and transfer documents", description: "Collect transcripts, vaccination records and transfer letters from the current school before the move.", timing: "T-45", priority: "High", category: "New contracts to set up" },
    { id: "addon-school-shortlist", phase: "Days 1 to 7", title: "Shortlist schools or childcare near your new address", description: "Compare catchments, fees, waitlists, transport and admission timelines. Verify directly with each school.", timing: "Day 1 to 7", priority: "High", category: "New contracts to set up" },
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
    { id: "addon-setup-rental", phase: "Days 8 to 30", title: "Sign a long-term rental agreement", description: "Compare rent, deposit terms and lease conditions before signing a long-term rental at the destination.", timing: "Week 2 to 4", priority: "High", category: "New contracts to set up" },
    { id: "addon-setup-utilities", phase: "Days 1 to 7", title: "Set up electricity, water and gas", description: "Open new utility accounts at the destination address and confirm activation timelines.", timing: "Day 1 to 7", priority: "High", category: "New contracts to set up" },
    { id: "addon-setup-broadband", phase: "Days 1 to 7", title: "Set up broadband and WiFi", description: "Compare local broadband providers and book installation as early as possible.", timing: "Day 1 to 7", priority: "Medium", category: "New contracts to set up" },
    { id: "addon-setup-mobile", phase: "Days 1 to 7", title: "Activate a local mobile, SIM or eSIM", description: "Set up a local SIM or eSIM for calls, data and local verification codes.", timing: "Day 1 to 7", priority: "High", category: "New contracts to set up" },
    { id: "addon-setup-tv", phase: "Days 8 to 30", title: "Set up TV or streaming if relevant", description: "Compare local TV, cable or streaming options if relevant to your household.", timing: "Week 2 to 4", priority: "Low", category: "New contracts to set up" },
    { id: "addon-setup-banking", phase: "Days 1 to 7", title: "Set up local banking and payment apps", description: "Open a local bank account and set up payment apps for daily transactions.", timing: "Day 1 to 7", priority: "High", category: "New contracts to set up" },
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
  { id: "sg-rental-registration", phase: "Days 1 to 7", title: "Confirm landlord approval and proper registration", description: "For HDB flats, verify official HDB rules, eligibility and registration requirements before committing. For condos, verify condo house rules and management/landlord approval. Always verify official rules directly — this is not legal or housing advice.", timing: "Day 1 to 7", priority: "High", category: "Singapore rental checklist" },
  { id: "sg-rental-deposit-terms", phase: "Days 1 to 7", title: "Confirm deposit, notice period and minimum stay", description: "Get deposit amount, notice period, minimum stay and visitor rules confirmed in writing before signing the tenancy agreement.", timing: "Day 1 to 7", priority: "High", category: "Singapore rental checklist" },
];

function withRouteContext(task: TimelineTask, originLabel: string, destinationLabel: string): TimelineTask {
  return {
    ...task,
    description: task.description.replace("selected origin and destination", `${originLabel} to ${destinationLabel}`),
  };
}

export function buildTimeline(
  originKey: DestinationKey,
  destinationKey: DestinationKey,
  reasonKey: MoveReasonKey,
  profileKey: ProfileKey,
  petKey: PetKey = "none",
  addOns: AddOnKey[] = [],
): TimelineTask[] {
  const origin = destinations.find((item) => item.key === originKey) ?? destinations[0];
  const destination = destinations.find((item) => item.key === destinationKey) ?? destinations[1];
  const reason = moveReasons.find((item) => item.key === reasonKey) ?? moveReasons[0];
  const profile = profiles.find((item) => item.key === profileKey) ?? profiles[0];
  const isDomestic = originKey === destinationKey;

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

  const baseSet = isDomestic ? domesticBaseTasks : baseTasks;

  const uniqueAddOns = Array.from(new Set(addOns));
  const wantsHousingHelp = uniqueAddOns.includes("temporaryStay") || uniqueAddOns.includes("contractsSetup");
  const singaporeChecklist = destinationKey === "singapore" && wantsHousingHelp ? singaporeRentalChecklist : [];

  return [
    routeSpecific,
    ...baseSet.map((task) => withRouteContext(task, origin.label, destination.label)),
    ...reasonAddOns[reason.key],
    ...profileAddOns[profile.key],
    ...petAddOns[petKey],
    ...uniqueAddOns.flatMap((key) => addOnTasks[key] ?? []),
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
