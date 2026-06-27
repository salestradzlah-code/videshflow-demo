import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateStudentMovePack, buildPackEmail } from "@/lib/studentMovePack";
import { generatePremiumRelocationPack, buildPremiumPackEmail } from "@/lib/premiumRelocationPack";
import { generateVoiceGuide, buildVoiceGuideEmail } from "@/lib/voiceGuide";
import { getEmailReadiness } from "@/lib/emailReadiness";

export const dynamic = "force-dynamic";

const QA_TEST_EMAIL = process.env.SETTLEMAP_QA_EMAIL ?? "hellosettlemap@gmail.com";
const VALID_PRODUCTS = ["student_move_pack", "premium_relocation_pack", "voice_guide", "all"] as const;
type QAProduct = (typeof VALID_PRODUCTS)[number];

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not configured");
  return new Resend(key);
}

type SendResult = { product: string; success: boolean; error?: string };

async function sendStudentTest(resend: Resend, fromEmail: string): Promise<SendResult> {
  try {
    const pack = generateStudentMovePack({
      moveRoute: "India to UK",
      otherRoute: null,
      departureMonth: "September 2026",
      concerns: "Documents, Housing, Banking, First 7 days",
      buyerRole: "Student",
      buyerName: "QA Test User",
    });
    const { subject, html, text } = buildPackEmail(pack, "QA Test User", "September 2026", "Documents, Housing, Banking, First 7 days");
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: QA_TEST_EMAIL,
      subject: `[QA TEST] ${subject}`,
      html,
      text,
    });
    if (error) return { product: "student_move_pack", success: false, error: (error as { name?: string }).name ?? "send error" };
    return { product: "student_move_pack", success: true };
  } catch (err) {
    return { product: "student_move_pack", success: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

async function sendPremiumTest(resend: Resend, fromEmail: string): Promise<SendResult> {
  try {
    const pack = generatePremiumRelocationPack({
      origin: "Singapore",
      destination: "UK",
      moveReason: "Work / job offer",
      whoIsMoving: "Family with children",
      timingMonth: "October 2026",
      modules: "family,student",
      concerns: "Documents, Housing, Healthcare, School",
      buyerName: "QA Test User",
    });
    const { subject, html, text } = buildPremiumPackEmail(pack, "QA Test User", "October 2026", "family,student");
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: QA_TEST_EMAIL,
      subject: `[QA TEST] ${subject}`,
      html,
      text,
    });
    if (error) return { product: "premium_relocation_pack", success: false, error: (error as { name?: string }).name ?? "send error" };
    return { product: "premium_relocation_pack", success: true };
  } catch (err) {
    return { product: "premium_relocation_pack", success: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

async function sendVoiceGuideTest(resend: Resend, fromEmail: string): Promise<SendResult> {
  try {
    const guide = generateVoiceGuide({
      origin: "India",
      destination: "Germany",
      moveReason: "Corporate / employer transfer",
      whoIsMoving: "Couple",
      timingMonth: "August 2026",
      concerns: "Documents, Banking, First 7 days, SIM / internet",
      buyerName: "QA Test User",
    });
    const { subject, html, text } = buildVoiceGuideEmail(guide, "QA Test User", "August 2026", "Documents, Banking, First 7 days, SIM / internet");
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: QA_TEST_EMAIL,
      subject: `[QA TEST] ${subject}`,
      html,
      text,
    });
    if (error) return { product: "voice_guide", success: false, error: (error as { name?: string }).name ?? "send error" };
    return { product: "voice_guide", success: true };
  } catch (err) {
    return { product: "voice_guide", success: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

export async function POST(request: NextRequest) {
  const adminToken = process.env.SETTLEMAP_ADMIN_TOKEN;
  if (!adminToken) {
    console.error("[qa-test-fulfilment] SETTLEMAP_ADMIN_TOKEN not configured");
    return NextResponse.json({ error: "Endpoint not configured." }, { status: 503 });
  }

  const authHeader = request.headers.get("authorization") ?? "";
  const providedToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!providedToken || providedToken !== adminToken) {
    console.warn("[qa-test-fulfilment] Unauthorized attempt");
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const product = (body.product ?? "all") as string;
  if (!VALID_PRODUCTS.includes(product as QAProduct)) {
    return NextResponse.json(
      { error: `Invalid product. Must be one of: ${VALID_PRODUCTS.join(", ")}` },
      { status: 400 },
    );
  }

  let resend: Resend;
  try {
    resend = getResend();
  } catch (err) {
    return NextResponse.json(
      { error: "Resend not configured: " + (err instanceof Error ? err.message : "unknown") },
      { status: 503 },
    );
  }

  // V12.12.14: Use central email readiness helper
  const emailReadiness = getEmailReadiness();
  const fromEmail = emailReadiness.fromEmail;
  const sentAt = new Date().toISOString();
  const results: SendResult[] = [];

  console.log("[qa-test-fulfilment] Starting QA test. product:", product, "sentAt:", sentAt, "senderDomain:", emailReadiness.fromEmailDomain, "verified:", emailReadiness.resendVerifiedSenderConfigured);

  if (product === "all" || product === "student_move_pack") {
    results.push(await sendStudentTest(resend, fromEmail));
  }
  if (product === "all" || product === "premium_relocation_pack") {
    results.push(await sendPremiumTest(resend, fromEmail));
  }
  if (product === "all" || product === "voice_guide") {
    results.push(await sendVoiceGuideTest(resend, fromEmail));
  }

  const allSuccess = results.every((result) => result.success);
  const anySuccess = results.some((result) => result.success);

  console.log("[qa-test-fulfilment] Results:", results.map((r) => `${r.product}:${r.success ? "ok" : r.error}`).join(", "));

  return NextResponse.json(
    {
      sentTo: QA_TEST_EMAIL,
      sentAt,
      product,
      results,
      allSuccess,
      anySuccess,
    },
    { status: allSuccess ? 200 : anySuccess ? 207 : 500 },
  );
}
