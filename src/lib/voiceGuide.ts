import type { PackSection } from "@/lib/studentMovePack";
import {
  RESEARCH_LINKS_BOUNDARY_COPY,
  getResearchLinkChecklistItems,
} from "@/data/researchLinksRegistry";

export interface VoiceGuideMetadata {
  origin?: string | null;
  destination?: string | null;
  moveReason?: string | null;
  whoIsMoving?: string | null;
  timingMonth?: string | null;
  concerns?: string | null;
  buyerName?: string | null;
}

export interface VoiceGuidePack {
  effectiveRoute: string;
  routeSummary: PackSection;
  topSevenFocus: PackSection;
  firstSevenDays: PackSection;
  checklistWalkthrough: PackSection;
  documentsToPrepare: PackSection;
  providerQuestions: PackSection;
  researchLinks: PackSection;
  commonMistakes: PackSection;
  boundaryNote: PackSection;
  supportEmail: string;
  safetyBoundaryNote: string;
}

function clean(value: string | null | undefined, fallback: string): string {
  return value && value.trim() ? value.trim() : fallback;
}

export function generateVoiceGuide(meta: VoiceGuideMetadata): VoiceGuidePack {
  const origin = clean(meta.origin, "your origin");
  const destination = clean(meta.destination, "your destination");
  const moveReason = clean(meta.moveReason, "your relocation");
  const whoIsMoving = clean(meta.whoIsMoving, "you");
  const timingMonth = clean(meta.timingMonth, "your planned move window");
  const concerns = clean(meta.concerns, "documents, first-week setup and provider research");
  const effectiveRoute = `${origin} to ${destination}`;

  const routeSummary: PackSection = {
    title: "Route summary",
    items: [
      `Route: ${effectiveRoute}.`,
      `Move reason: ${moveReason}.`,
      `Who is moving: ${whoIsMoving}.`,
      `Timing: ${timingMonth}.`,
      `Main planning concerns: ${concerns}.`,
      "Use this as a conversational walkthrough script for your own planning session. It is not generated audio and it is not a human call.",
    ],
  };

  const topSevenFocus: PackSection = {
    title: "Top 7 things to focus on",
    items: [
      "Confirm the official entry, visa, permit or residency category that applies to your move before making irreversible bookings.",
      "Build a document folder with identity, status, employment or admission, housing, health and emergency-contact records.",
      "Plan first-month cash flow: temporary stay, deposit, first rent, local SIM, transport, food and emergency buffer.",
      "Research housing before arrival, but avoid signing anything you cannot verify directly.",
      "Prepare banking, SIM or eSIM and internet access so you can function from day one.",
      "List the providers you may need to research, then ask each provider the same questions so you can compare fairly.",
      "Keep official-source verification as a separate task before acting on any major requirement.",
    ],
  };

  const firstSevenDays: PackSection = {
    title: "First 7 days explanation",
    items: [
      "Day 1: Get data access working through local SIM, eSIM or roaming. Save local emergency numbers and your temporary address.",
      "Days 1-2: Check into accommodation, photograph the condition, confirm Wi-Fi, utilities and landlord or reception contacts.",
      "Days 2-3: Buy essentials only: groceries, adaptor, bedding, toiletries and local transport card or app.",
      "Days 3-5: Start local admin tasks that are relevant to your route, such as registration, employer onboarding, university check-in or health registration.",
      "Days 5-7: Review banking, transport, healthcare and housing next steps. Keep receipts and confirmation emails in one folder.",
      "End of week: Recheck your official-source list and decide what needs professional help rather than guesswork.",
    ],
  };

  const checklistWalkthrough: PackSection = {
    title: "Checklist walkthrough",
    items: [
      "Before booking: verify official requirements, timeline, validity dates and any restrictions attached to your status.",
      "Before leaving: confirm accommodation, travel documents, first-week budget, phone access and emergency contacts.",
      "Arrival week: handle SIM, transport, groceries, local address, account setup and the most urgent official admin items.",
      "First month: compare providers, settle recurring bills, update address records and review whether your budget is realistic.",
      "After setup: keep checking official portals because rules, fees and processing timelines can change.",
    ],
  };

  const documentsToPrepare: PackSection = {
    title: "Documents to prepare",
    items: [
      "Passport and other identity documents.",
      "Visa, permit, status approval, entry document or employer/institution letters where relevant.",
      "Employment contract, transfer letter, admission letter or enrolment confirmation.",
      "Housing confirmation, lease draft, landlord contact or temporary-stay booking.",
      "Medical and vaccination records, prescriptions and insurance documents where relevant.",
      "School, childcare, university, pet, banking and tax documents where relevant.",
      "Emergency contacts and important originals to carry with you, not packed in shipping.",
    ],
  };

  const providerQuestions: PackSection = {
    title: "Provider questions to ask",
    items: [
      "Housing: What is included, what is the deposit, what are the break terms, and who is legally authorised to rent the property?",
      "Mover: What is included in the quote, what insurance applies, what items are restricted, and what is the delivery timeline?",
      "Banking: What documents are required, can a new arrival open an account, what fees apply, and how long does setup take?",
      "SIM or internet: Is it prepaid or contract, what data is included, what ID is required, and are there cancellation fees?",
      "Insurance: What is covered, what is excluded, what is the waiting period, and how are claims handled?",
      "School, childcare, university, healthcare, pet or HR providers: Ask for written requirements and verify them with official or registered sources before acting.",
    ],
  };

  const researchLinks: PackSection = {
    title: "Research links to verify",
    items: [
      ...getResearchLinkChecklistItems({
        audience: "voice-guide",
        destination,
        personaTags: [whoIsMoving, moveReason],
        limit: 10,
      }),
      RESEARCH_LINKS_BOUNDARY_COPY,
    ],
  };

  const commonMistakes: PackSection = {
    title: "Common mistakes to avoid",
    items: [
      "Assuming a forum, agent, recruiter or friend has the latest official rules.",
      "Signing housing or mover contracts before checking identity, licensing, cancellation terms and total cost.",
      "Packing important originals into shipping instead of carrying them.",
      "Ignoring first-week cash flow and relying only on one card or one bank account.",
      "Waiting until arrival to research phone access, registration, healthcare or institution onboarding.",
      "Treating SettleMap as professional advice. Use it to organise your checklist, then verify with official sources or qualified professionals.",
    ],
  };

  const safetyBoundaryNote =
    "SettleMap Voice Guide is a self-serve planning walkthrough and script. It does not provide legal, immigration, tax, financial, property, insurance, medical, school admission, government or vendor advice. Verify official requirements with official sources.";

  return {
    effectiveRoute,
    routeSummary,
    topSevenFocus,
    firstSevenDays,
    checklistWalkthrough,
    documentsToPrepare,
    providerQuestions,
    researchLinks,
    commonMistakes,
    boundaryNote: {
      title: "Boundary note",
      items: [
        safetyBoundaryNote,
        "No human review, concierge service, provider recommendation, booking, application submission or generated audio is included in this version.",
      ],
    },
    supportEmail: "support@settlemap.app",
    safetyBoundaryNote,
  };
}

function sectionToHtml(section: PackSection): string {
  const items = section.items
    .map((item) => `<li style="margin:4px 0;font-size:14px;line-height:1.7;color:#3f3f46;">${item}</li>`)
    .join("");

  return `
    <div style="margin:20px 0;">
      <p style="color:#0f766e;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px 0;">${section.title}</p>
      <ul style="padding-left:20px;margin:0;">${items}</ul>
    </div>`;
}

function sectionToText(section: PackSection): string {
  return `${section.title.toUpperCase()}\n${section.items.map((item) => `- ${item}`).join("\n")}`;
}

export function buildVoiceGuideEmail(
  guide: VoiceGuidePack,
  buyerName: string | null,
  timingMonth: string | null,
  concerns: string | null,
): { subject: string; html: string; text: string } {
  const greeting = buyerName ? `Hi ${buyerName},` : "Hi,";
  const sections = [
    guide.routeSummary,
    guide.topSevenFocus,
    guide.firstSevenDays,
    guide.checklistWalkthrough,
    guide.documentsToPrepare,
    guide.providerQuestions,
    guide.researchLinks,
    guide.commonMistakes,
    guide.boundaryNote,
  ];

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your SettleMap Voice Guide</title></head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f4f4f5;margin:0;padding:0;">
  <div style="max-width:640px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#0f766e;padding:28px 32px;">
      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;">SettleMap Voice Guide</h1>
      <p style="color:#ccfbf1;margin:4px 0 0 0;font-size:13px;">Voice-style planning walkthrough script</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#18181b;font-size:16px;line-height:1.6;">${greeting}</p>
      <p style="color:#3f3f46;font-size:15px;line-height:1.7;">Thank you for your payment. Your <strong>SettleMap Voice Guide script and walkthrough</strong> is ready. This is a written conversational guide, not generated audio.</p>
      <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;padding:16px 20px;margin:20px 0;">
        <p style="color:#0f766e;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px 0;">Move details</p>
        <p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Route:</strong> ${guide.effectiveRoute}</p>
        ${timingMonth ? `<p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Timing:</strong> ${timingMonth}</p>` : ""}
        ${concerns ? `<p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Main concerns:</strong> ${concerns}</p>` : ""}
      </div>
      <div style="background:#f4f4f5;border-radius:8px;padding:20px;margin:24px 0;">
        ${sections.map(sectionToHtml).join("")}
      </div>
      <p style="color:#71717a;font-size:12px;line-height:1.6;">${guide.safetyBoundaryNote}</p>
      <p style="color:#3f3f46;font-size:14px;margin:16px 0 0 0;">Regards,<br><strong>Ash</strong><br>SettleMap<br>
        <a href="mailto:support@settlemap.app" style="color:#0f766e;">support@settlemap.app</a></p>
    </div>
  </div>
</body>
</html>`;

  const text = [
    greeting,
    "",
    "Thank you for your payment. Your SettleMap Voice Guide script and walkthrough is ready. This is a written conversational guide, not generated audio.",
    "",
    ...sections.map(sectionToText),
    "",
    guide.safetyBoundaryNote,
    "",
    "Regards, SettleMap Team | support@settlemap.app",
  ].join("\n\n");

  return {
    subject: "Your SettleMap Voice Guide is ready",
    html,
    text,
  };
}
