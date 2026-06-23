// V10 — Relocation Command Centre. Turns the existing TimelineTask data (relocationTimeline.ts)
// into a project-plan style model: status, owner, stage, due labels, action type and copy scripts.
// Everything here is computed from the existing task fields (id/category/title/phase/priority) —
// no changes were needed to the underlying task data, and nothing is sent to a server.
import type { TimelineTask, MoveDateKey, TaskTier, PlanSection } from "@/data/demoPlatform";

export type TaskStatus = "Not started" | "In progress" | "Waiting" | "Done" | "Not applicable";

export const TASK_STATUSES: TaskStatus[] = ["Not started", "In progress", "Waiting", "Done", "Not applicable"];

export type TaskOwner = "Me" | "Family" | "Employer" | "Agent / landlord" | "School / university" | "Mover / provider";

export type TaskStage = "Before move" | "Arrival week" | "First 30 days" | "First 90 days";

export const TASK_STAGES: TaskStage[] = ["Before move", "Arrival week", "First 30 days", "First 90 days"];

export type ActionType = "Open official link" | "Start research" | "Copy script" | "Add note" | "Mark done" | "Plan action";

export type TaskScript = { title: string; text: string };

export function getTaskStage(phase: string): TaskStage {
  switch (phase) {
    case "Before you move":
      return "Before move";
    case "Days 1 to 7":
      return "Arrival week";
    case "Days 8 to 30":
      return "First 30 days";
    case "Days 31 to 90":
      return "First 90 days";
    default:
      return "Before move";
  }
}

// --- Owner heuristic --------------------------------------------------
export function getTaskOwner(task: TimelineTask): TaskOwner {
  const category = task.category.toLowerCase();
  const title = task.title.toLowerCase();

  if (category.includes("school") || category.includes("student") || title.includes("school") || title.includes("childcare") || title.includes("university")) {
    return "School / university";
  }
  if (category.includes("movers") || title.includes("mover")) {
    return "Mover / provider";
  }
  if (category.includes("rental checklist") || category === "housing" || title.includes("landlord") || title.includes("agent")) {
    return "Agent / landlord";
  }
  if (category.includes("employer") || category.includes("offer decision") || category.includes("work") || title.includes("employer")) {
    return "Employer";
  }
  if (category.includes("family") || category.includes("child") || category.includes("couple") || category.includes("community") || category.includes("pets") || category.includes("settling in")) {
    return "Family";
  }
  return "Me";
}

// --- Rule-sensitive / official-link / script classification ----------
// Tasks with a confirmed official government URL already available (Singapore housing official
// links only — see demoPlatform.ts singaporeOfficialLinkCategories). Anything not listed here that
// is still rule-sensitive falls back to "Plan action" + "Verify from official website" — never a
// guessed link.
const OFFICIAL_LINK_TASK_IDS: Record<string, string[]> = {
  "sg-rental-registration": ["hdb", "ura"],
};

// Tasks best served by a copyable message rather than a link.
const SCRIPT_TASK_MAP: Record<string, string> = {
  "sg-rental-cooking-rules": "cooking",
  "sg-rental-furnishing": "furnishing",
  "sg-rental-utilities-wifi": "utilities",
  "sg-rental-occupancy-rules": "occupancy",
  "sg-rental-agent-fee": "agentFee",
  "sg-rental-move-in-date": "moveInDate",
  "sg-rental-deposit-terms": "depositTerms",
  "movers-quotes-domestic": "movers",
  "mover-survey": "movers",
  "addon-school-shortlist": "school",
  "family-schooling": "school",
  "addon-setup-school": "school",
  "addon-school-records": "school",
  "student-docs": "school",
  "addon-insurance-home": "insurer",
  "addon-setup-insurance": "insurer",
  "temporary-stay": "tempStay",
  "addon-setup-temp-stay": "tempStay",
  "addon-temp-stay-book": "tempStay",
  // V11.5 Part 3 — give the previously link-only banking and utilities tasks a copy-paste
  // provider script as well, so the action card reads as a concrete next step.
  "banking-first-week": "banking",
  "addon-setup-banking": "banking",
  "domestic-utilities-broadband": "utilitiesTransfer",
  "addon-setup-utilities": "utilitiesTransfer",
};

// Rule-sensitive tasks with no safe, confirmed official URL — always "Plan action", never a link.
const RULE_SENSITIVE_PLAN_ONLY_IDS = new Set([
  "official-route-check",
  "addon-senior-coverage",
  "addon-medication-supply",
  "retirement-healthcare",
  "addon-setup-driving",
  "addon-vehicle-new",
  "business-setup",
  "addon-insurance-travel",
  "addon-insurance-health",
  "addon-insurance-cancel",
  "pet-dog-rules",
  "pet-cat-rules",
  "pet-multi-rules",
  "pet-other-rules",
  "elderly-parent-continuity",
]);

// Categories that map to one of the existing generic research categories (actionLinkCategories /
// the Services Directory). These route internally to /services rather than to an unconfirmed
// external link, per the "internal linking is acceptable for now" rule.
const RESEARCH_CATEGORIES = new Set(["housing", "movers", "connectivity", "banking", "transport", "healthcare", "schooling", "pets", "new contracts to set up", "home setup", "utilities"]);

const MARK_DONE_CATEGORIES = new Set(["existing contracts to terminate"]);

export type TaskActionInfo = {
  actionType: ActionType;
  actionTarget?: string;
  ruleSensitive: boolean;
  officialLinkKeys?: string[];
  scriptKey?: string;
};

export function getTaskActionInfo(task: TimelineTask): TaskActionInfo {
  const id = task.id;
  const category = task.category.toLowerCase();

  if (OFFICIAL_LINK_TASK_IDS[id]) {
    return { actionType: "Open official link", ruleSensitive: true, officialLinkKeys: OFFICIAL_LINK_TASK_IDS[id] };
  }
  if (SCRIPT_TASK_MAP[id]) {
    return { actionType: "Copy script", ruleSensitive: category.includes("rental checklist"), scriptKey: SCRIPT_TASK_MAP[id] };
  }
  if (RULE_SENSITIVE_PLAN_ONLY_IDS.has(id)) {
    return { actionType: "Plan action", ruleSensitive: true };
  }
  if (MARK_DONE_CATEGORIES.has(category)) {
    return { actionType: "Mark done", ruleSensitive: false };
  }
  if (category === "documents" || category === "money" || category === "budget" || category === "income planning") {
    return { actionType: "Add note", ruleSensitive: false };
  }
  if (RESEARCH_CATEGORIES.has(category)) {
    return { actionType: "Start research", actionTarget: "/services", ruleSensitive: category === "insurance planning" };
  }
  if (category === "insurance planning" || category.includes("pet") || category.includes("driving") || category.includes("licence")) {
    return { actionType: "Plan action", ruleSensitive: true };
  }
  return { actionType: "Plan action", ruleSensitive: false };
}

// --- V11.3 tier and section fallback heuristics -------------------------
// Most task literals in relocationTimeline.ts now set tier/section explicitly on the tasks
// that were renamed or merged for V11.3. Everything else (the long tail of add-on tasks)
// falls back to these heuristics so the whole plan still gets a tier and a collapsible
// section without having to touch every task literal individually.
export function getTaskTier(task: TimelineTask): TaskTier {
  if (task.tier) return task.tier;
  if (task.priority === "High") return "Core";
  if (task.priority === "Medium") return "Recommended";
  return "Optional";
}

const SECTION_CATEGORY_MAP: Record<string, PlanSection> = {
  documents: "Documents",
  housing: "Housing",
  movers: "Housing",
  "singapore rental checklist": "Housing",
  money: "Money and banking",
  budget: "Money and banking",
  banking: "Money and banking",
  "income planning": "Money and banking",
  "insurance planning": "Money and banking",
  connectivity: "Arrival week",
  "official sources": "Official checks",
};

export function getPlanSection(task: TimelineTask, tier: TaskTier): PlanSection {
  if (tier === "Optional") return "Optional extras";
  if (task.section) return task.section;
  if (task.id === "route-specific-starter-kit") return "Start here";
  if (task.id === "official-route-check") return "Official checks";

  const category = task.category.toLowerCase();
  if (SECTION_CATEGORY_MAP[category]) return SECTION_CATEGORY_MAP[category];

  if (task.phase === "Before you move") return "Documents";
  if (task.phase === "Days 1 to 7") return "Arrival week";
  if (task.phase === "Days 8 to 30") return "First 30 days";
  return "First 30 days";
}

export const PLAN_SECTION_ORDER: PlanSection[] = [
  "Start here",
  "Official checks",
  "Documents",
  "Housing",
  "Money and banking",
  "Arrival week",
  "First 30 days",
  "Optional extras",
];

// Default expand/collapse state per the V11.3 spec — only "Start here" and "Official checks"
// start open, everything else (including Optional extras) starts collapsed.
export const PLAN_SECTION_DEFAULT_EXPANDED: Record<PlanSection, boolean> = {
  "Start here": true,
  "Official checks": true,
  Documents: false,
  Housing: false,
  "Money and banking": false,
  "Arrival week": false,
  "First 30 days": false,
  "Optional extras": false,
};

// --- Due labels --------------------------------------------------------
export type DueInfo = { label: string; date?: string };

function offsetDate(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Approximate, bucketed by stage + priority. This intentionally does not overclaim day-level
// precision — it gives a useful planning signal, not a guarantee.
export function getDueInfo(task: TimelineTask, moveDateType: MoveDateKey | null, moveDateValue: string): DueInfo {
  const stage = getTaskStage(task.phase);
  const hasExactDate = moveDateType === "exact" && Boolean(moveDateValue);
  const moveDate = hasExactDate ? new Date(`${moveDateValue}T00:00:00`) : null;
  const validMoveDate = moveDate && !Number.isNaN(moveDate.getTime()) ? moveDate : null;

  if (stage === "Before move") {
    const offsetDays = task.priority === "High" ? -60 : task.priority === "Medium" ? -30 : -7;
    const label = task.priority === "High" ? "T-60" : task.priority === "Medium" ? "T-30" : "T-7";
    if (validMoveDate) return { label, date: offsetDate(validMoveDate, offsetDays) };
    return { label: task.priority === "High" ? "T-60 to T-30" : task.priority === "Medium" ? "T-30" : "T-7" };
  }
  if (stage === "Arrival week") {
    if (validMoveDate) return { label: "Arrival week", date: offsetDate(validMoveDate, 0) };
    return { label: "Day 1" };
  }
  if (stage === "First 30 days") {
    if (validMoveDate) return { label: "Day 30", date: offsetDate(validMoveDate, 30) };
    return { label: "First 30 days" };
  }
  if (validMoveDate) return { label: "Day 90", date: offsetDate(validMoveDate, 90) };
  return { label: "First 90 days" };
}

// --- Copy scripts for the project plan ---------------------------------
// Separate from the Tenant Bio "Scripts to copy" section (RouteWizard.tsx) so that section is
// never touched. Template-based only — no AI.
export type ProjectScriptInputs = {
  destinationLabel: string;
  isSingapore: boolean;
  moveInText: string;
  cookingLabel: string | null;
  agentFee: string | null;
};

// --- Enriched task model for the project plan board --------------------
export type EnrichedTask = TimelineTask & {
  stage: TaskStage;
  owner: TaskOwner;
  status: TaskStatus;
  dueLabel: string;
  dueDate?: string;
  actionType: ActionType;
  actionTarget?: string;
  officialLinkKeys?: string[];
  scriptKey?: string;
  ruleSensitive: boolean;
  note: string;
  resolvedTier: TaskTier;
  resolvedSection: PlanSection;
};

export function buildEnrichedTasks(
  tasks: TimelineTask[],
  taskStatuses: Record<string, TaskStatus>,
  taskNotes: Record<string, string>,
  moveDateType: MoveDateKey | null,
  moveDateValue: string
): EnrichedTask[] {
  return tasks.map((task) => {
    const stage = getTaskStage(task.phase);
    const owner = getTaskOwner(task);
    const actionInfo = getTaskActionInfo(task);
    const dueInfo = getDueInfo(task, moveDateType, moveDateValue);
    const resolvedTier = getTaskTier(task);
    const resolvedSection = getPlanSection(task, resolvedTier);
    return {
      ...task,
      stage,
      owner,
      status: taskStatuses[task.id] ?? "Not started",
      dueLabel: dueInfo.label,
      dueDate: dueInfo.date,
      actionType: actionInfo.actionType,
      actionTarget: actionInfo.actionTarget,
      officialLinkKeys: actionInfo.officialLinkKeys,
      scriptKey: actionInfo.scriptKey,
      ruleSensitive: actionInfo.ruleSensitive,
      note: taskNotes[task.id] ?? "",
      resolvedTier,
      resolvedSection,
    };
  });
}

const STAGE_ORDER: TaskStage[] = ["Before move", "Arrival week", "First 30 days", "First 90 days"];

export function getNextDueTask(tasks: EnrichedTask[]): EnrichedTask | null {
  const open = tasks.filter((task) => task.status !== "Done" && task.status !== "Not applicable");
  if (open.length === 0) return null;
  const sorted = [...open].sort((a, b) => {
    const stageDiff = STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage);
    if (stageDiff !== 0) return stageDiff;
    const priorityRank = (priority: string) => (priority === "High" ? 0 : priority === "Medium" ? 1 : 2);
    return priorityRank(a.priority) - priorityRank(b.priority);
  });
  return sorted[0];
}

export function buildProjectScripts(inputs: ProjectScriptInputs): Record<string, TaskScript> {
  const { destinationLabel, isSingapore, moveInText, cookingLabel, agentFee } = inputs;
  return {
    landlordGeneral: {
      title: "Ask landlord / agent",
      text: `Hi, I am interested in this place in ${destinationLabel}. Could you share more details and let me know if a viewing is possible? Thank you.`,
    },
    cooking: {
      title: "Ask about cooking",
      text: cookingLabel
        ? `Hi, just to confirm — is ${cookingLabel.toLowerCase()} allowed in this unit? Are there any restrictions I should know about?`
        : "Hi, could you confirm the cooking policy for this unit — is daily cooking allowed, or only light cooking?",
    },
    furnishing: {
      title: "Ask about furnishing",
      text: "Hi, could you list exactly what is included as fully furnished — bed, wardrobe, desk, aircon? Could this be confirmed in writing before any deposit is paid?",
    },
    utilities: {
      title: "Ask about utilities and WiFi",
      text: "Hi, could you confirm if utilities and WiFi are included in the rent, or billed separately? Is there any usage cap?",
    },
    occupancy: {
      title: "Ask about occupancy and visitor rules",
      text: "Hi, could you confirm the occupancy limit for this unit, and whether overnight guests are allowed?",
    },
    registration: {
      title: isSingapore ? "Ask about HDB/condo registration" : "Ask about registration requirements",
      text: isSingapore
        ? "Hi, for this unit, will the tenant be properly registered with HDB or the relevant authority? Can you confirm the landlord's approval process?"
        : "Hi, are there any local registration or paperwork requirements for a new tenant moving in? Could you guide me through the process?",
    },
    moveInDate: {
      title: "Ask about move-in date",
      text: `Hi, I am hoping to move in around ${moveInText}. Is this date workable, or is there flexibility either way?`,
    },
    agentFee: {
      title: "Ask about agent fee",
      text: agentFee
        ? `Hi, just to confirm the agent fee noted is "${agentFee}" — is this the final amount, and when is it payable?`
        : "Hi, could you confirm if there is an agent fee for this unit, and if so, how much and when it is payable?",
    },
    depositTerms: {
      title: "Ask about deposit and notice period",
      text: "Hi, could you confirm the deposit amount, notice period and minimum stay for this unit in writing before I proceed?",
    },
    movers: {
      title: "Ask movers for a quote",
      text: `Hi, I am relocating to ${destinationLabel} and would like a quote — could you confirm packing, insurance cover, estimated timeline and any charges that are not included in the headline price?`,
    },
    school: {
      title: "Ask school / university about admission documents",
      text: "Hi, could you confirm the full list of documents needed for admission, the application timeline, and whether there is a waitlist?",
    },
    insurer: {
      title: "Ask insurer about coverage",
      text: "Hi, could you confirm exactly what is covered, what is excluded (including pre-existing conditions), the waiting period and the claims process before I commit to this policy?",
    },
    tempStay: {
      title: "Ask temporary stay provider about long-stay rate",
      text: "Hi, could you confirm if a long-stay or weekly/monthly rate is available, what is included, and the cancellation policy?",
    },
    // V11.5 Part 3 — copy-paste scripts for banking and utilities so these read as a concrete
    // next step rather than a generic "research this" link.
    banking: {
      title: "Ask bank about account opening for new arrivals",
      text: "Hi, I am a new arrival and would like to open an account. Could you confirm the documents needed, any minimum balance or fees, and how long until the account and card are active?",
    },
    utilitiesTransfer: {
      title: "Ask utility/broadband provider about transfer date",
      text: "Hi, I would like to set up or transfer electricity, water, gas and broadband to my new address. Could you confirm the earliest activation date, any installation fee, and the closing process for my old address?",
    },
  };
}
