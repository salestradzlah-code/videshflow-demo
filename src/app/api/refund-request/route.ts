import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getEmailReadiness } from "@/lib/emailReadiness";

export const dynamic = "force-dynamic";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const paymentEmail = typeof body.paymentEmail === "string" ? body.paymentEmail.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const receiptRef = typeof body.receiptRef === "string" ? body.receiptRef.trim() : "";
  const moveRoute = typeof body.moveRoute === "string" ? body.moveRoute.trim() : "";
  const productName = typeof body.productName === "string" ? body.productName.trim() : "SettleMap Pack";
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  const comments = typeof body.comments === "string" ? body.comments.trim() : "";
  const consent = body.consent === true;

  // Validate required fields
  if (!isValidEmail(paymentEmail)) {
    return NextResponse.json({ error: "Please enter a valid payment email address." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!reason) {
    return NextResponse.json({ error: "Please select a reason for your refund request." }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json({ error: "Please confirm you are happy for SettleMap to contact you." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "Support email is not configured. Please email support@settlemap.app directly." }, { status: 503 });
  }

  const supportEmail = process.env.SETTLEMAP_SUPPORT_EMAIL ?? "support@settlemap.app";
  // V12.12.14: Use central email readiness helper
  const emailReadiness = getEmailReadiness();
  const fromEmail = emailReadiness.fromEmail;
  const submittedAt = new Date().toISOString();

  const rows: [string, string][] = [
    ["Submitted at (UTC)", submittedAt],
    ["Name", name],
    ["Payment email", paymentEmail],
    ["Product", productName],
    ["Receipt / reference", receiptRef || "(not provided)"],
    ["Move route", moveRoute || "(not provided)"],
    ["Reason", reason],
    ["Comments", comments || "(none)"],
    ["Consent confirmed", "Yes"],
  ];

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#71717a;font-size:13px;vertical-align:top;white-space:nowrap;">${k}</td><td style="padding:6px 0;color:#18181b;font-size:13px;word-break:break-all;">${v}</td></tr>`,
    )
    .join("");

  const html = `<div style="font-family:system-ui,sans-serif;padding:24px;max-width:600px;">
<h2 style="color:#059669;margin:0 0 8px 0;">Refund Request — SettleMap</h2>
<p style="color:#71717a;font-size:13px;margin:0 0 20px 0;">Submitted via SettleMap refund request form V12.12.8</p>
<table style="width:100%;border-collapse:collapse;">${tableRows}</table>
<div style="margin-top:16px;padding:12px 16px;background:#fef9c3;border-radius:6px;font-size:13px;color:#713f12;">
  <strong>Reminder:</strong> Do not include passport numbers, visa numbers, card numbers, bank details, medical details or ID documents in any follow-up email.
</div>
<div style="margin-top:12px;padding:12px 16px;background:#f0fdf4;border-radius:6px;font-size:13px;color:#166534;">
  SettleMap does not auto-refund via this form. Refund requests are reviewed individually. Refunds are not based on visa, housing, bank, legal or third-party outcomes.
</div>
</div>`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n") + "\n\nReview and respond to this customer within 2 business days.";

  const resend = new Resend(resendKey);

  // V12.12.14: Log sender readiness from central helper
  if (emailReadiness.usingFallbackSender) {
    console.warn("[refund-request] SETTLEMAP_FROM_EMAIL not set — using SettleMap noreply fallback");
  } else if (!emailReadiness.resendVerifiedSenderConfigured) {
    console.warn("[refund-request] SETTLEMAP_FROM_EMAIL is set but domain not verified. If send fails, verify domain in Resend dashboard.");
  } else {
    console.log("[refund-request] Using verified sender:", emailReadiness.fromEmailDomain);
  }

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: supportEmail,
    replyTo: paymentEmail,
    subject: `Refund request — ${name} — ${paymentEmail}`,
    html,
    text,
  });

  if (error) {
    // V12.12.11: Non-fatal. Do not return 500. Email failure is likely an unverified sender domain.
    // The user must email support directly. Returning 200 so the page shows a controlled fallback, not a crash.
    const errName = (error as { name?: string }).name ?? "unknown";
    console.error(
      "[refund-request] Email send failed:", errName,
      "— from:", fromEmail,
      "— to:", supportEmail,
      "— If validation_error: SETTLEMAP_FROM_EMAIL domain is not verified in Resend. Verify the settlemap.app sender domain."
    );
    return NextResponse.json(
      {
        error: `We could not send your request automatically (email system: ${errName}). Please email support@settlemap.app directly, quoting your payment email and receipt number.`,
        emailFailed: true,
      },
      { status: 200 }, // V12.12.11: Controlled fallback — not a 500
    );
  }

  console.log("[refund-request] Refund request submitted successfully. from:", fromEmail, "customer:", paymentEmail, "reason:", reason);
  return NextResponse.json({ success: true });
}
