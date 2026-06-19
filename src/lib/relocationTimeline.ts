import { destinations, moveReasons, profiles, type DestinationKey, type MoveReasonKey, type ProfileKey, type TimelineTask } from "@/data/demoPlatform";

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
    description: "Find local communities, temples, mandals, parent groups, professional circles, groceries and weekend routines.",
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
    { id: "family-groceries", phase: "Days 1 to 7", title: "Map groceries, clinic and family basics", description: "Find nearest supermarket, Indian groceries, clinic, pharmacy, playground and safe transport routine.", timing: "Day 1 to 7", priority: "Medium", category: "Family" },
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
};

function withRouteContext(task: TimelineTask, originLabel: string, destinationLabel: string): TimelineTask {
  return {
    ...task,
    description: task.description.replace("selected origin and destination", `${originLabel} to ${destinationLabel}`),
  };
}

export function buildTimeline(originKey: DestinationKey, destinationKey: DestinationKey, reasonKey: MoveReasonKey, profileKey: ProfileKey): TimelineTask[] {
  const origin = destinations.find((item) => item.key === originKey) ?? destinations[0];
  const destination = destinations.find((item) => item.key === destinationKey) ?? destinations[1];
  const reason = moveReasons.find((item) => item.key === reasonKey) ?? moveReasons[0];
  const profile = profiles.find((item) => item.key === profileKey) ?? profiles[0];

  const routeSpecific: TimelineTask = {
    id: "route-specific-starter-kit",
    phase: "Before you move",
    title: `Create your ${origin.label} to ${destination.label} route starter kit`,
    description: `Use the ${reason.label.toLowerCase()} and ${profile.label.toLowerCase()} context to prioritise official links, documents, services, money planning and first-month tasks.`,
    timing: "Today",
    priority: "High",
    category: "Route starter kit",
  };

  return [routeSpecific, ...baseTasks.map((task) => withRouteContext(task, origin.label, destination.label)), ...reasonAddOns[reason.key], ...profileAddOns[profile.key]];
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
