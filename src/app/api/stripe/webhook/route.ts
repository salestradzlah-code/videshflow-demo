import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

// ── Runtime config ────────────────────────────────────────────────────────────
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// ── Init helpers ──────────────────────────────────────────────────────────────
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Stripe(key, { apiVersion: "2024-11-20.acacia" as any });
}

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not configured");
  return new Resend(key);
}

// ── Custom field parser ───────────────────────────────────────────────────────
type StripeCustomField = { key: string; text?: { value: string | null } | null };

function parseCustomFields(
  fields: StripeCustomField[] | null | undefined,
): { name: string | null; route: string | null; departure: string | null } {
  if (!fields || fields.length === 0) {
    return { name: null, route: null, departure: null };
  }
  const findText = (keywords: string[]) =>
    fields.find((f) =>
      keywords.some((kw) => f.key.toLowerCase().includes(kw)),
    )?.text?.value ?? null;

  return {
    name: findText(["name", "student", "parent"]),
    route: findText(["route", "move", "destination"]),
    departure: findText(["departure", "month", "when"]),
  };
}

// ── Customer email builder ────────────────────────────────────────────────────
function buildCustomerEmail(params: {
  customerName: string | null;
  moveRoute: string | null;
  departureMonth: string | null;
}): { subject: string; html: string; text: string } {
  const greeting = params.customerName ? `Hi ${params.customerName},` : "Hi,";

  const routeNote = params.moveRoute
    ? `<p style="color:#3f3f46;font-size:15px;line-height:1.7;">Your move route: <strong>${params.moveRoute}</strong>${params.departureMonth ? ` — departing around ${params.departureMonth}` : ""}.</p>`
    : "";

  const replyRequest = !params.moveRoute
    ? `<p style="color:#3f3f46;font-size:14px;line-height:1.7;">To help us tailor your pack, please reply with your <strong>move route</strong> (e.g. India to UK) and <strong>expected departure month</strong>.</p>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your SettleMap Student Move Pack</title></head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f4f4f5;margin:0;padding:0;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#059669;padding:28px 32px;">
      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;letter-spacing:-0.3px;">SettleMap</h1>
    </div>
    <div style="padding:32px;">
      <p style="color:#18181b;font-size:16px;line-height:1.6;">${greeting}</p>
      <p style="color:#3f3f46;font-size:15px;line-height:1.7;">Thank you for joining SettleMap early access.</p>
      <p style="color:#3f3f46;font-size:15px;line-height:1.7;">Your <strong>Student Move Pack</strong> payment has been received and confirmed by Stripe.</p>
      ${routeNote}
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:24px 0;">
        <p style="color:#166534;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px 0;">Your Student Move Pack includes</p>
        <ul style="color:#3f3f46;font-size:14px;line-height:1.8;margin:0;padding-left:20px;">
          <li>90-day route-aware project plan</li>
          <li>First 7 days setup guide</li>
          <li>India SIM/OTP continuity checklist where relevant</li>
          <li>Packing and bring-vs-buy checklist</li>
          <li>Parent/student question checklist</li>
          <li>Provider research scripts</li>
          <li>Downloadable checklist where available</li>
          <li>Email support for access and payment questions</li>
        </ul>
      </div>
      <div style="background:#f4f4f5;border-radius:8px;padding:20px;margin:24px 0;">
        <p style="color:#3f3f46;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px 0;">Start building your plan</p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app" style="color:#059669;font-weight:600;">settlemap.app</a> — your move planning home</p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/#route-planner" style="color:#059669;">Build your move plan &rarr;</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/countries" style="color:#059669;">Route Library</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/services" style="color:#059669;">Services Research</a></p>
      </div>
      ${replyRequest}
      <p style="color:#3f3f46;font-size:14px;line-height:1.7;">If you need help, reply to this email and include:</p>
      <ul style="color:#3f3f46;font-size:14px;line-height:1.8;padding-left:20px;">
        <li>Payment email address</li>
        <li>Student or parent name</li>
        <li>Move route (e.g. India to UK)</li>
        <li>Expected departure month</li>
        <li>Key concerns (accommodation, packing, SIM/OTP, banking, first 7 days)</li>
      </ul>
      <div style="background:#fef9c3;border-left:3px solid #facc15;padding:10px 14px;border-radius:4px;margin:16px 0;">
        <p style="color:#713f12;font-size:12px;line-height:1.6;margin:0;">
          Please do not send passport numbers, visa numbers, bank details, medical details or ID documents.
        </p>
      </div>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />
      <p style="color:#71717a;font-size:12px;line-height:1.6;">
        SettleMap provides planning support only. It is not legal, immigration, financial, property, insurance, medical, school, admission or government advice. Always verify official requirements with official sources and qualified professionals.
      </p>
      <p style="color:#3f3f46;font-size:14px;margin:16px 0 0 0;">Regards,<br><strong>Ash</strong><br>SettleMap<br><a href="mailto:support@settlemap.app" style="color:#059669;">support@settlemap.app</a></p>
    </div>
  </div>
</body>
</html>`;

  const textLines = [
    greeting,
    "",
    "Thank you for joining SettleMap early access.",
    "Your Student Move Pack payment has been received and confirmed by Stripe.",
    params.moveRoute
      ? `Your move route: ${params.moveRoute}${params.departureMonth ? ` — departing around ${params.departureMonth}` : ""}.`
      : "",
    "",
    "YOUR STUDENT MOVE PACK INCLUDES:",
    "- 90-day route-aware project plan",
    "- First 7 days setup guide",
    "- India SIM/OTP continuity checklist where relevant",
    "- Packing and bring-vs-buy checklist",
    "- Parent/student question checklist",
    "- Provider research scripts",
    "- Downloadable checklist where available",
    "- Email support for access and payment questions",
    "",
    "START BUILDING YOUR PLAN:",
    "https://settlemap.app",
    "https://settlemap.app/#route-planner",
    "https://settlemap.app/countries",
    "https://settlemap.app/services",
    "",
    !params.moveRoute
      ? "To help us tailor your pack, please reply with your move route (e.g. India to UK) and expected departure month."
      : "",
    "",
    "If you need help, reply and include: payment email, student or parent name, move route, expected departure month, and key concerns.",
    "",
    "Do not send: passport numbers, visa numbers, bank details, medical details or ID documents.",
    "",
    "SettleMap provides planning support only. Not legal, immigration, financial, property, insurance, medical, school or government advice.",
    "",
    "Regards, Ash",
    "SettleMap | support@settlemap.app",
  ];

  const text = textLines.filter((l) => l !== undefined).join("\n");

  return { subject: "Your SettleMap Student Move Pack", html, text };
}

// ── Internal notification builder ─────────────────────────────────────────────
function buildInternalEmail(params: {
  customerEmail: string | null;
  customerName: string | null;
  amountTotal: number;
  currency: string;
  sessionId: string;
  paymentIntentId: string;
  moveRoute: string | null;
  departureMonth: string | null;
  paymentLinkId: string | null;
  customerEmailSent: boolean;
  createdAt: number;
}): { subject: string; html: string; text: string } {
  const amount = `${((params.amountTotal) / 100).toFixed(2)} ${params.currency.toUpperCase()}`;
  const ts = new Date(params.createdAt * 1000).toISOString();
  const action = !params.moveRoute
    ? "Action: ask customer for move route and expected departure month if they do not reply within 24h."
    : "No immediate action — monitor for reply.";

  const rows: [string, string][] = [
    ["Customer email", params.customerEmail ?? "(not available)"],
    ["Customer name", params.customerName ?? "(not provided)"],
    ["Amount", amount],
    ["Session ID", params.sessionId],
    ["Payment Intent ID", params.paymentIntentId],
    ["Move route", params.moveRoute ?? "(not provided)"],
    ["Departure", params.departureMonth ?? "(not provided)"],
    ["Payment Link ID", params.paymentLinkId ?? "(not available)"],
    ["Customer email sent", params.customerEmailSent ? "yes" : "no"],
    ["Timestamp (UTC)", ts],
  ];

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#71717a;white-space:nowrap;font-size:13px;">${k}</td><td style="padding:6px 0;color:#18181b;font-size:13px;">${v}</td></tr>`,
    )
    .join("");

  const html = `<div style="font-family:system-ui,sans-serif;padding:24px;max-width:600px;">
<h2 style="color:#059669;margin:0 0 16px 0;">New Student Move Pack Payment</h2>
<table style="width:100%;border-collapse:collapse;">${tableRows}</table>
<div style="margin-top:16px;padding:12px 16px;background:#fef9c3;border-radius:6px;font-size:13px;color:#713f12;">${action}</div>
</div>`;

  const textLines = [
    "NEW SETTLEMAP STUDENT MOVE PACK PAYMENT",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    action,
  ];

  return {
    subject: `New SettleMap Student Move Pack payment — ${params.customerEmail ?? "email unknown"}`,
    html,
    text: textLines.join("\n"),
  };
}

// ── Event types ───────────────────────────────────────────────────────────────
const FULFIL_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
]);
const IGNORE_EVENTS = new Set([
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
]);

// ── GET — health check ────────────────────────────────────────────────────────
export async function GET() {
  return new Response("SettleMap Stripe webhook endpoint is available.", {
    status: 200,
  });
}

// ── POST — webhook handler ────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // 1. Read raw body (must NOT use request.json() — Stripe needs raw bytes)
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    console.error("[webhook] Failed to read request body");
    return new Response("Bad request", { status: 400 });
  }

  // 2. Check signature header
  const signature = request.headers.get("stripe-signature") ?? "";
  if (!signature) {
    console.error("[webhook] Missing stripe-signature header");
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  // 3. Init Stripe
  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    console.error(
      "[webhook] Stripe init error:",
      err instanceof Error ? err.message : "unknown",
    );
    return new Response("Server configuration error", { status: 500 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not set");
    return new Response("Server configuration error", { status: 500 });
  }

  // 4. Verify signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error(
      "[webhook] Signature verification failed:",
      err instanceof Error ? err.message : "unknown",
    );
    return new Response("Invalid signature", { status: 400 });
  }

  console.log("[webhook] event.id:", event.id, "event.type:", event.type);

  // 5. Route by event type
  if (IGNORE_EVENTS.has(event.type)) {
    console.log("[webhook] Ignoring event type:", event.type);
    return NextResponse.json({ received: true });
  }
  if (!FULFIL_EVENTS.has(event.type)) {
    console.log("[webhook] Unhandled event type:", event.type);
    return NextResponse.json({ received: true });
  }

  // 6. Extract session
  const session = event.data.object as Stripe.Checkout.Session;

  // 7. Validate payment
  if (session.payment_status !== "paid") {
    console.warn(
      "[webhook] payment_status not paid:",
      session.payment_status,
      "session.id:",
      session.id,
    );
    return NextResponse.json({ received: true });
  }
  if (session.amount_total !== 1900) {
    console.warn(
      "[webhook] Unexpected amount_total:",
      session.amount_total,
      "session.id:",
      session.id,
    );
    return NextResponse.json({ received: true });
  }
  if (session.currency !== "sgd") {
    console.warn(
      "[webhook] Unexpected currency:",
      session.currency,
      "session.id:",
      session.id,
    );
    return NextResponse.json({ received: true });
  }

  // 8. Resolve PaymentIntent ID
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent as Stripe.PaymentIntent | null)?.id ?? null;

  if (!paymentIntentId) {
    console.warn("[webhook] No payment_intent on session:", session.id);
    return NextResponse.json({ received: true });
  }

  // 9. Idempotency check via PaymentIntent metadata
  let paymentIntent: Stripe.PaymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (err) {
    console.error(
      "[webhook] Failed to retrieve PaymentIntent:",
      paymentIntentId,
      err instanceof Error ? err.message : "unknown",
    );
    return new Response("PaymentIntent retrieval failed", { status: 500 });
  }

  if (paymentIntent.metadata?.settlemap_fulfilled_at) {
    console.log(
      "[webhook] Already fulfilled — skipping. session.id:",
      session.id,
      "fulfilled_at:",
      paymentIntent.metadata.settlemap_fulfilled_at,
    );
    return NextResponse.json({ received: true });
  }

  // 10. Parse session data
  const customerEmail = session.customer_details?.email ?? null;
  const customerNameFromDetails = session.customer_details?.name ?? null;
  const customFields = parseCustomFields(
    session.custom_fields as StripeCustomField[] | null | undefined,
  );
  const resolvedName = customFields.name ?? customerNameFromDetails;
  const paymentLinkId =
    typeof session.payment_link === "string"
      ? session.payment_link
      : (session.payment_link as Stripe.PaymentLink | null)?.id ?? null;

  // 11. Init Resend
  let resend: Resend;
  try {
    resend = getResend();
  } catch (err) {
    console.error(
      "[webhook] Resend init error — RESEND_API_KEY missing:",
      err instanceof Error ? err.message : "unknown",
    );
    return new Response("Email service not configured", { status: 500 });
  }

  const fromEmail =
    process.env.SETTLEMAP_FROM_EMAIL ?? "SettleMap <support@settlemap.app>";
  const supportEmail =
    process.env.SETTLEMAP_SUPPORT_EMAIL ?? "support@settlemap.app";

  let customerEmailSent = false;

  // 12. Send customer fulfilment email
  if (customerEmail) {
    const { subject, html, text } = buildCustomerEmail({
      customerName: resolvedName,
      moveRoute: customFields.route,
      departureMonth: customFields.departure,
    });

    const { error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: customerEmail,
      replyTo: supportEmail,
      subject,
      html,
      text,
    });

    if (sendError) {
      // Log error type only — never log customer email content
      console.error(
        "[webhook] Customer email send failed. error.name:",
        (sendError as { name?: string }).name ?? "unknown",
        "session.id:",
        session.id,
      );
      // Return 500 so Stripe retries the webhook
      return new Response("Customer email send failed", { status: 500 });
    }

    customerEmailSent = true;
    // Log email domain only — not full address
    const emailDomain = customerEmail.split("@")[1] ?? "unknown";
    console.log(
      "[webhook] Customer email sent. domain:",
      emailDomain,
      "session.id:",
      session.id,
    );
  } else {
    console.warn(
      "[webhook] No customer email on session — skipping customer email. session.id:",
      session.id,
    );
  }

  // 13. Update PaymentIntent metadata (idempotency marker)
  const fulfilledAt = new Date().toISOString();
  let metadataUpdated = false;
  try {
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        settlemap_product: "student_move_pack",
        settlemap_fulfilled_at: fulfilledAt,
        settlemap_fulfilment_email_sent: customerEmailSent ? "true" : "false",
        settlemap_fulfilment_version: "V12.8",
      },
    });
    metadataUpdated = true;
    console.log(
      "[webhook] PaymentIntent metadata updated. paymentIntentId:",
      paymentIntentId,
    );
  } catch (err) {
    // Non-fatal — log and continue
    console.error(
      "[webhook] Failed to update PaymentIntent metadata. paymentIntentId:",
      paymentIntentId,
      err instanceof Error ? err.message : "unknown",
    );
  }

  // 14. Send internal notification email
  const internalEmail = buildInternalEmail({
    customerEmail,
    customerName: resolvedName,
    amountTotal: session.amount_total ?? 0,
    currency: session.currency ?? "sgd",
    sessionId: session.id,
    paymentIntentId,
    moveRoute: customFields.route,
    departureMonth: customFields.departure,
    paymentLinkId,
    customerEmailSent,
    createdAt: session.created,
  });

  const { error: internalError } = await resend.emails.send({
    from: fromEmail,
    to: supportEmail,
    subject: internalEmail.subject,
    html: internalEmail.html,
    text: internalEmail.text,
  });

  if (internalError) {
    // Non-fatal — fulfilment already done
    console.error(
      "[webhook] Internal notification failed. error.name:",
      (internalError as { name?: string }).name ?? "unknown",
      "session.id:",
      session.id,
    );
  } else {
    console.log(
      "[webhook] Internal notification sent. session.id:",
      session.id,
    );
  }

  console.log(
    "[webhook] Fulfilment complete. session.id:",
    session.id,
    "customerEmailSent:",
    customerEmailSent,
    "metadataUpdated:",
    metadataUpdated,
  );

  return NextResponse.json({ received: true });
}
