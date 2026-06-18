import { destinations, moveReasons, profiles, type DestinationKey, type MoveReasonKey, type ProfileKey, type TimelineTask, type TimelinePhase } from "@/data/demoPlatform";

const baseTimeline: TimelineTask[] = [
  {
    id: "docs-master-folder",
    phase: "Before flying",
    day: "T-60 to T-30",
    title: "Build the master document folder",
    description: "Collect passports, offer or admission letter, family documents, medical records, prescriptions, school records, and digital backups.",
    owner: "Mover",
    category: "Documents",
    priority: "Critical",
    tools: ["Document vault", "Cloud backup", "Printed folder"],
  },
  {
    id: "budget-reality-check",
    phase: "Before flying",
    day: "T-45 to T-21",
    title: "Run cost and salary reality check",
    description: "Compare rent, school, groceries, utilities, commute, first-month deposits, and emergency buffer for the selected destination.",
    owner: "Family lead",
    category: "Money",
    priority: "High",
    tools: ["Cost worksheet", "Rental research", "Official links"],
  },
  {
    id: "packing-customs-baggage",
    phase: "Before flying",
    day: "T-30 to T-7",
    title: "Finalise packing, baggage and customs caution",
    description: "Use a luggage scale, list medicines with prescriptions, check restricted food items, and decide what to ship versus buy locally.",
    owner: "Family",
    category: "Travel",
    priority: "High",
    tools: ["Baggage planner", "Customs reminder", "Mover quote"],
  },
  {
    id: "arrival-connectivity",
    phase: "Days 1 to 7",
    day: "Day 1",
    title: "Get connected without losing Indian OTPs",
    description: "Activate local SIM or roaming backup, keep Indian SIM active, install transport and map apps, and save emergency contacts.",
    owner: "Mover",
    category: "Daily life",
    priority: "Critical",
    tools: ["SIM checklist", "OTP plan", "Transport apps"],
  },
  {
    id: "temporary-stay-area-shortlist",
    phase: "Days 1 to 7",
    day: "Day 2 to 5",
    title: "Convert temporary stay into area shortlist",
    description: "Test commute to office, nearby groceries, clinics, school route, and late-night comfort before committing to a rental.",
    owner: "Family lead",
    category: "Housing",
    priority: "High",
    tools: ["Neighbourhood checklist", "Map notes", "Safety check"],
  },
  {
    id: "rental-inspection",
    phase: "Days 8 to 30",
    day: "Week 2 to 4",
    title: "Secure rental and inspect before move-in",
    description: "Verify agent or landlord, inspect condition, take photos, record meter readings, confirm key collection and delivery slots.",
    owner: "Family lead",
    category: "Housing",
    priority: "Critical",
    tools: ["Rental viewing checklist", "Photo log", "Meter reading notes"],
  },
  {
    id: "home-setup-week",
    phase: "Days 8 to 30",
    day: "Week 3 to 4",
    title: "Set up home basics first",
    description: "Prioritise mattress, WiFi request, electricity, local SIM, groceries, kitchen basics, furniture delivery, and kids route testing.",
    owner: "Family",
    category: "Daily life",
    priority: "High",
    tools: ["Home setup list", "Delivery tracker", "Grocery list"],
  },
  {
    id: "services-to-research",
    phase: "Days 8 to 30",
    day: "Week 4",
    title: "Research services without assuming endorsement",
    description: "Compare movers, insurance, remittance, dental, rental, school, helper, cleaning, and community options directly before engaging.",
    owner: "Mover",
    category: "Services",
    priority: "Normal",
    tools: ["Services directory", "Reference links", "Provider notes"],
  },
  {
    id: "routine-stabilisation",
    phase: "Days 31 to 90",
    day: "Month 2",
    title: "Stabilise routine and monthly budget",
    description: "Review real costs, commute, school or childcare rhythm, groceries, medical access, community, and Indian banking dependencies.",
    owner: "Family",
    category: "Family",
    priority: "High",
    tools: ["Budget tracker", "Community checklist", "Banking reminders"],
  },
  {
    id: "long-term-admin-review",
    phase: "Days 31 to 90",
    day: "Month 3",
    title: "Review long-term admin with qualified sources",
    description: "Check tax residency, NRE / NRO, insurance, school, driving, and local official requirements with official sources or professionals.",
    owner: "Family lead",
    category: "Documents",
    priority: "Normal",
    tools: ["Official-source router", "Professional advice reminder", "Document audit"],
  },
];

const reasonAddOns: Record<MoveReasonKey, TimelineTask[]> = {
  job: [
    { id: "job-office-clothing", phase: "Before flying", day: "T-21", title: "Prepare office and interview clothing", description: "Buy formal shirts, business suits, ties, shoes, rainwear or winter wear where cheaper in India and suitable for the destination.", owner: "Mover", category: "Daily life", priority: "Normal", tools: ["Before you fly checklist"] },
  ],
  transfer: [
    { id: "transfer-package-review", phase: "Before flying", day: "T-45", title: "Decode employer relocation package", description: "Check flights, temporary stay, movers, family support, school allowance, insurance, reimbursable items, and receipts needed.", owner: "Mover", category: "Money", priority: "High", tools: ["Package checklist", "HR questions"] },
  ],
  student: [
    { id: "student-campus-ready", phase: "Before flying", day: "T-30", title: "Prepare student arrival pack", description: "Keep admission, accommodation, insurance, funds, transcripts, laptop, local transport, and university orientation details ready.", owner: "Student", category: "Documents", priority: "High", tools: ["Student move kit"] },
  ],
  family: [
    { id: "family-school-health", phase: "Before flying", day: "T-45", title: "Prepare school and family health records", description: "Collect school transcripts, vaccination records, prescriptions, dental checks, and childcare or school shortlist before flying.", owner: "Family", category: "Family", priority: "High", tools: ["Family checklist", "School records"] },
  ],
  pr: [
    { id: "pr-settlement-buffer", phase: "Before flying", day: "T-30", title: "Plan long-term settlement buffer", description: "Prepare a longer cash buffer, shipping plan, job search timeline, school research, and banking or remittance notes.", owner: "Family lead", category: "Money", priority: "High", tools: ["Settlement plan"] },
  ],
  business: [
    { id: "business-setup-research", phase: "Days 31 to 90", day: "Month 2", title: "Research business setup and professional support", description: "Use official sources and qualified professionals for company setup, tax, banking, licences, and local network building.", owner: "Founder", category: "Services", priority: "Normal", tools: ["Official links", "Professional support list"] },
  ],
  assignment: [
    { id: "assignment-light-setup", phase: "Before flying", day: "T-14", title: "Keep the move light and reversible", description: "Prioritise temporary stay, local SIM, transport, expense tracking, and minimal shipping for a short assignment.", owner: "Mover", category: "Travel", priority: "Normal", tools: ["Short assignment checklist"] },
  ],
  landed: [
    { id: "landed-stabilise-now", phase: "Days 1 to 7", day: "Today", title: "Stabilise the immediate week", description: "Focus on local SIM, groceries, house search, bank access, WiFi, emergency contacts, and official appointments already pending.", owner: "Mover", category: "AI", priority: "Critical", tools: ["AI triage", "First 7 days list"] },
  ],
};

const profileAddOns: Record<ProfileKey, TimelineTask[]> = {
  solo: [],
  couple: [
    { id: "couple-spouse-setup", phase: "Days 31 to 90", day: "Month 2", title: "Build spouse and couple routine", description: "Review spouse setup, community, budget, groceries, healthcare, commute, and personal support network.", owner: "Couple", category: "Family", priority: "Normal", tools: ["Community finder"] },
  ],
  familyChild: [
    { id: "child-playgroup-route", phase: "Days 8 to 30", day: "Week 3", title: "Test school route and child routine", description: "Check school or childcare commute, play area, clinic access, groceries, and weekend family activities before routine locks in.", owner: "Family", category: "Family", priority: "High", tools: ["School route checklist", "Playgroup finder"] },
  ],
  familyChildren: [
    { id: "children-school-calendar", phase: "Before flying", day: "T-30", title: "Align school calendar and records", description: "Prepare records for each child, understand transition timing, and keep family medical and vaccination records ready.", owner: "Family", category: "Family", priority: "High", tools: ["School checklist", "Medical records"] },
  ],
  student: [],
  parents: [
    { id: "parents-medical-comfort", phase: "Before flying", day: "T-21", title: "Prepare seniors comfort and medical plan", description: "Plan medicines, doctor letters, accessibility, transport, insurance, emergency contacts, and familiar food comfort items.", owner: "Family", category: "Family", priority: "High", tools: ["Senior checklist", "Medicine list"] },
  ],
};

export function buildTimeline(destinationKey: DestinationKey, reasonKey: MoveReasonKey, profileKey: ProfileKey): TimelineTask[] {
  const destination = destinations.find((item) => item.key === destinationKey) ?? destinations[0];
  const reason = moveReasons.find((item) => item.key === reasonKey) ?? moveReasons[0];
  const profile = profiles.find((item) => item.key === profileKey) ?? profiles[0];

  const destinationTask: TimelineTask = {
    id: `destination-${destination.key}`,
    phase: "Before flying",
    day: "T-45",
    title: `Load ${destination.label} starter kit`,
    description: `${destination.headline} Focus on ${destination.focus.slice(0, 3).join(", ").toLowerCase()} and verify official-source details directly.`,
    owner: "Mover",
    category: "AI",
    priority: destination.key === "singapore" ? "Critical" : "High",
    tools: ["Country kit", "Reference links", "Services directory"],
  };

  return [destinationTask, ...baseTimeline, ...(reasonAddOns[reason.key] ?? []), ...(profileAddOns[profile.key] ?? [])].sort((a, b) => phaseOrder[a.phase] - phaseOrder[b.phase]);
}

export const phaseOrder: Record<TimelinePhase, number> = {
  "Before flying": 1,
  "Days 1 to 7": 2,
  "Days 8 to 30": 3,
  "Days 31 to 90": 4,
};

export function groupByPhase(tasks: TimelineTask[]) {
  return tasks.reduce<Record<TimelinePhase, TimelineTask[]>>((acc, task) => {
    acc[task.phase] = acc[task.phase] || [];
    acc[task.phase].push(task);
    return acc;
  }, { "Before flying": [], "Days 1 to 7": [], "Days 8 to 30": [], "Days 31 to 90": [] });
}

export function calculateProgress(tasks: TimelineTask[], completedIds: string[]) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((task) => completedIds.includes(task.id)).length / tasks.length) * 100);
}
