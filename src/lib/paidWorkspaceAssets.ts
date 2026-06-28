export interface WorkspaceCsvBlock {
  title: string;
  csv: string;
  note?: string;
}

export interface WorkspaceTable {
  title: string;
  headers: string[];
  rows: string[][];
  note?: string;
}

export const WORKSPACE_ASSETS_COPY =
  "These tables are copy-paste ready. Open Google Sheets or Excel, select a blank cell, and paste. They are starting templates. Fill and verify against official sources.";

export const WORKSPACE_STATUS_OPTIONS =
  "Not started / In progress / Waiting / Done / Needs official verification";

export function getWorkspaceAssetsItems(): string[] {
  return [
    WORKSPACE_ASSETS_COPY,
    "Included below: Budget starter worksheet, Document tracker, Provider comparison worksheet, Risk register, Next 7 actions tracker, and Progress tracker.",
    `Use these statuses where relevant: ${WORKSPACE_STATUS_OPTIONS}.`,
  ];
}

function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function rowsToCsv(headers: string[], rows: string[][]): string {
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

export const budgetHeaders = ["Category", "Estimate", "Actual", "Notes", "Verification needed"];
export const budgetRows = [
  ["Visa / immigration fees", "", "", "", "Official immigration authority"],
  ["Health surcharge / required health cost", "", "", "", "Official immigration, institution, employer, or insurer"],
  ["Flights", "", "", "", "Airline or booking provider"],
  ["Temporary stay", "", "", "", "Accommodation provider"],
  ["Rental deposit", "", "", "", "Housing provider or lease terms"],
  ["First month rent", "", "", "", "Housing provider or lease terms"],
  ["SIM / internet", "", "", "", "Telecom provider"],
  ["Transport", "", "", "", "Local transport authority or provider"],
  ["Food / first week essentials", "", "", "", "Local supermarket or current resident estimate"],
  ["Insurance", "", "", "", "Insurance provider policy document"],
  ["Setup costs", "", "", "", "Local stores or marketplace"],
  ["Emergency buffer", "", "", "", "Your own budget calculation"],
];

export const documentHeaders = ["Document", "Needed for", "Owner", "Status", "Where to verify", "Notes"];
export const documentRows = [
  ["Passport", "Travel, entry, banking, housing", "You", "Needs official verification", "Passport authority", ""],
  ["Visa / entry document", "Entry, work or study, local setup", "You", "Needs official verification", "Official immigration authority", ""],
  ["University admission / CAS or equivalent", "Entry, enrolment, housing, banking", "Student", "Needs official verification", "University or institution", ""],
  ["Accommodation confirmation", "Arrival, address proof, registration", "You", "Not started", "Housing provider", ""],
  ["Financial proof if required", "Visa, study, housing, banking", "You / family", "Needs official verification", "Official immigration authority or institution", ""],
  ["Medical / vaccination records if relevant", "Healthcare, school, insurance", "You / family", "Needs official verification", "Doctor, clinic, school, or insurer", ""],
  ["Doctor letter for medicines if relevant", "Travel, customs, pharmacy", "You / doctor", "Needs official verification", "Doctor and destination rules", ""],
  ["Academic transcripts", "University, school, credential checks", "Student", "Not started", "Institution", ""],
  ["Emergency contacts page", "Safety and handover", "You / family", "Not started", "Create and print yourself", ""],
  ["Travel insurance if applicable", "Travel disruption, medical support", "You", "Needs official verification", "Insurance provider policy document", ""],
];

export const providerHeaders = ["Category", "Question to ask", "Answer", "Cost", "Risk note", "Decision"];
export const providerRows = [
  ["Housing", "What is included, deposit amount, return conditions, notice period, and guarantor requirement?", "", "", "Avoid unclear deposit or lease terms.", ""],
  ["Bank", "What documents are required for this visa/status, and can setup begin before arrival?", "", "", "Account opening can be delayed by address or ID requirements.", ""],
  ["SIM / internet", "Can I get prepaid/eSIM without a local bank account, and what are contract terms?", "", "", "Avoid long contracts before your address is stable.", ""],
  ["Insurance", "What is covered, excluded, waiting-period based, and required by official rules?", "", "", "Read the policy document, not only the sales summary.", ""],
  ["Mover / shipping", "What is included, what is excluded, insurance coverage, transit time, and customs support?", "", "", "Compare 2-3 quotes and verify restrictions.", ""],
  ["Healthcare / clinic", "Can I register as a new patient, what documents are needed, and how are repeat medicines handled?", "", "", "Do not wait until you are unwell to research care.", ""],
  ["University admin", "What arrival reporting, student ID collection, orientation, and document steps are mandatory?", "", "", "Missed reporting can affect enrolment.", ""],
];

export const riskHeaders = ["Risk", "Likelihood", "Impact", "Early warning sign", "Prevention step", "Escalation path"];
export const riskRows = [
  ["Visa delay", "", "", "No update close to travel date", "Check official timeline before booking irreversible travel", "Official immigration authority / institution / employer"],
  ["Housing not confirmed", "", "", "No signed confirmation before arrival", "Keep temporary stay backup and avoid long lease before viewing", "Housing provider / university housing office / employer relocation contact"],
  ["Banking delay", "", "", "Bank requires local address or extra ID", "Research accepted documents and keep origin account active", "Bank support / employer or institution letter"],
  ["SIM / OTP issue", "", "", "Origin number stops receiving OTPs", "Keep origin SIM active for at least 6 months", "Origin telecom provider / bank support"],
  ["Budget overrun", "", "", "Actual costs exceed estimates in first two weeks", "Track actual spend weekly and keep emergency buffer untouched", "Family / employer / institution hardship support if applicable"],
  ["Missing document", "", "", "Original document not in hand luggage", "Use document tracker and carry critical originals", "Official issuer / institution / consulate if lost"],
  ["Health / medicine issue", "", "", "Prescription supply unclear before travel", "Carry doctor letter and research local clinic before arrival", "Doctor / local clinic / emergency services"],
  ["Homesickness / parent anxiety", "", "", "Missed check-ins or persistent distress", "Agree weekly check-in and backup contact plan", "Campus support / family contact / local emergency service if urgent"],
];

export const next7ActionsHeaders = ["#", "Category", "Action", "Owner", "Time estimate", "Where to verify", "Status"];
export const next7ActionsRows = [
  ["1", "Visa / entry", "Check the current official processing timeline and conditions.", "You", "30-45 min", "Official immigration authority", "Needs official verification"],
  ["2", "Institution / employer", "Confirm arrival, start-date, reporting, or onboarding requirements in writing.", "You", "20 min", "University, employer, or institution", "Not started"],
  ["3", "Housing", "Shortlist temporary stay and 2-3 longer-term options.", "You", "1-2 hrs", "Housing provider or official housing office", "Not started"],
  ["4", "SIM / OTP", "Keep origin SIM active and research destination SIM/eSIM options.", "You", "15 min", "Origin and destination telecom providers", "Not started"],
  ["5", "Banking", "List account-opening documents and any address requirements.", "You", "30 min", "Official bank websites", "Needs official verification"],
  ["6", "Budget", "Fill the budget worksheet with estimates and emergency buffer.", "You / family", "45 min", "Your own worksheet plus provider quotes", "Not started"],
  ["7", "Documents", "Complete the document tracker and hand-luggage document pack.", "You", "45 min", "Official requirements and institution/employer checklist", "Not started"],
];

export const progressHeaders = ["Task", "Owner", "Status", "Due window", "Blocker", "Next action"];
export const progressRows = [
  ["Visa / entry verification", "You", "Needs official verification", "This week", "", "Open official immigration website and record status"],
  ["Institution / employer confirmation", "You", "Not started", "This week", "", "Email international office, HR, or admission contact"],
  ["Budget worksheet", "You / family", "Not started", "This week", "", "Fill estimates and emergency buffer"],
  ["Document tracker", "You", "Not started", "This week", "", "Mark each document status"],
  ["Housing shortlist", "You", "Not started", "Next 7 days", "", "Compare at least two options"],
  ["Provider comparison", "You", "Not started", "Next 7 days", "", "Ask questions using scripts"],
  ["Arrival first-week plan", "You", "Not started", "Before travel", "", "Assign first-week tasks"],
  ["Pilot feedback / update request", "You", "Not started", "After reading pack", "", "Reply by email or use pilot feedback page"],
];

export function getBudgetCsvBlock(): WorkspaceCsvBlock {
  return {
    title: "Budget starter worksheet CSV",
    csv: rowsToCsv(budgetHeaders, budgetRows),
  };
}

export function getDocumentTrackerCsvBlock(): WorkspaceCsvBlock {
  return {
    title: "Document tracker CSV",
    csv: rowsToCsv(documentHeaders, documentRows),
  };
}

export function getProviderComparisonCsvBlock(): WorkspaceCsvBlock {
  return {
    title: "Provider comparison worksheet CSV",
    csv: rowsToCsv(providerHeaders, providerRows),
  };
}

export function getRiskRegisterCsvBlock(): WorkspaceCsvBlock {
  return {
    title: "Risk register CSV",
    csv: rowsToCsv(riskHeaders, riskRows),
  };
}

export function getNext7ActionsTrackerCsvBlock(): WorkspaceCsvBlock {
  return {
    title: "Next 7 actions tracker CSV",
    csv: rowsToCsv(next7ActionsHeaders, next7ActionsRows),
  };
}

export function getRiskRegisterTable(): WorkspaceTable {
  return {
    title: "Risk register",
    headers: riskHeaders,
    rows: riskRows,
    note: "Use this to spot early warning signs before they become urgent.",
  };
}

export function getNext7ActionsTrackerTable(): WorkspaceTable {
  return {
    title: "Next 7 actions tracker",
    headers: next7ActionsHeaders,
    rows: next7ActionsRows,
    note: `Status options: ${WORKSPACE_STATUS_OPTIONS}.`,
  };
}

export function getProgressTrackerTable(): WorkspaceTable {
  return {
    title: "Progress tracker",
    headers: progressHeaders,
    rows: progressRows,
    note: `Status options: ${WORKSPACE_STATUS_OPTIONS}.`,
  };
}

export function getOfficialSourceResearchPromptItems(routeLabel: string, destinationLabel: string): string[] {
  return [
    `Immigration authority: search "${destinationLabel} official immigration authority visa permit requirements" and open the government or official immigration result first.`,
    `University / institution: search "${routeLabel} official university international student arrival checklist" or use your own institution's official international office page.`,
    `Housing: search "${destinationLabel} official housing advice tenants deposit rules" plus your institution or employer housing guidance if available.`,
    `Banking: search "${destinationLabel} official bank account documents new resident student worker" and compare bank requirements directly on bank websites.`,
    `Healthcare / insurance: search "${destinationLabel} official health insurance new resident student worker" and verify waiting periods, exclusions, and mandatory coverage.`,
    `Telecom: search "${destinationLabel} prepaid SIM eSIM official telecom provider no local bank account" and compare provider terms directly.`,
    `Emergency / consulate: search "${destinationLabel} emergency number official" and "${routeLabel} consulate official" before departure.`,
    "These are search starting points to reach official sources, not endorsements. Always confirm on the official website itself.",
  ];
}

export function getPrivatePilotCtaItems(): string[] {
  return [
    "Reply to this email or use the pilot feedback page if you would like us to generate your next 7 actions once your status changes. This is private-pilot, best-effort support, not an automated reminder service.",
    "If your visa, housing, admission, or travel date changes, you can request an updated pack during the private pilot. This is best-effort pilot support, not an unlimited or guaranteed service.",
    "Pilot feedback page: https://settlemap.app/pilot-feedback",
  ];
}
