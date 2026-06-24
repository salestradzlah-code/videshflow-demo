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

// ── Route-aware first step suggestion ────────────────────────────────────────
function routeFirstStep(moveRoute: string | null): string {
  if (!moveRoute) return "";
  const r = moveRoute.toLowerCase();
  if (r.includes("uk")) return "For India to UK, start with your visa application timeline and UKCISA checklist.";
  if (r.includes("germany") || r.includes("eu")) return "For India to Germany / EU, start with your blocked account and visa appointment booking timeline.";
  if (r.includes("singapore")) return "For India to Singapore, start with your student pass application and accommodation confirmation.";
  if (r.includes("us")) return "For India to US, start with your I-20, visa appointment and sevis fee timeline.";
  if (r.includes("australia")) return "For India to Australia, start with your CoE and student visa timeline.";
  if (r.includes("canada")) return "For India to Canada, start with your study permit and bank draft requirements.";
  return "Start by reviewing the route-specific visa and entry requirements for your destination.";
}

// ── Customer email builder ────────────────────────────────────────────────────
function buildCustomerEmail(params: {
  customerName: string | null;
  moveRoute: string | null;
  departureMonth: string | null;
  concerns: string | null;
}): { subject: string; html: string; text: string } {
  const greeting = params.customerName ? `Hi ${params.customerName},` : "Hi,";

  const moveDetails = (params.moveRoute || params.departureMonth || params.concerns)
    ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:20px 0;">
        <p style="color:#166534;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px 0;">Move details received</p>
        ${params.moveRoute ? `<p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Route:</strong> ${params.moveRoute}</p>` : ""}
        ${params.departureMonth ? `<p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Expected departure:</strong> ${params.departureMonth}</p>` : ""}
        ${params.concerns ? `<p style="color:#3f3f46;font-size:14px;margin:4px 0;"><strong>Main concerns:</strong> ${params.concerns}</p>` : ""}
      </div>`
    : "";

  const firstStep = routeFirstStep(params.moveRoute);
  const firstStepHtml = firstStep
    ? `<div style="background:#fffbeb;border-left:3px solid #f59e0b;padding:12px 16px;border-radius:4px;margin:16px 0;">
        <p style="color:#78350f;font-size:13px;line-height:1.6;margin:0;"><strong>Suggested first step:</strong> ${firstStep}</p>
       </div>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your SettleMap Student Move Pack</title></head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f4f4f5;margin:0;padding:0;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#059669;padding:28px 32px;">
      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;letter-spacing:-0.3px;">SettleMap</h1>
      <p style="color:#d1fae5;margin:4px 0 0 0;font-size:13px;">Student Move Pack</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#18181b;font-size:16px;line-height:1.6;">${greeting}</p>
      <p style="color:#3f3f46;font-size:15px;line-height:1.7;">Thank you for joining SettleMap early access.</p>
      <p style="color:#3f3f46;font-size:15px;line-height:1.7;">Your <strong>Student Move Pack</strong> payment has been received and confirmed by Stripe.</p>
      ${moveDetails}
      <div style="background:#f4f4f5;border-radius:8px;padding:20px;margin:24px 0;">
        <p style="color:#3f3f46;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px 0;">Your Student Move Pack includes</p>
        <ul style="color:#3f3f46;font-size:14px;line-height:1.9;margin:0;padding-left:20px;">
          <li>90-day route-aware project plan guidance</li>
          <li>First 7 days setup guide</li>
          <li>India SIM/OTP continuity checklist where relevant</li>
          <li>Packing and bring-vs-buy checklist</li>
          <li>Parent/student question checklist</li>
          <li>Provider research scripts</li>
          <li>Services research starter</li>
          <li>Email support for access and payment questions</li>
        </ul>
      </div>
      <div style="background:#f0fdf4;border-radius:8px;padding:20px;margin:24px 0;">
        <p style="color:#166534;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px 0;">Start here</p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app" style="color:#059669;font-weight:600;">settlemap.app</a> — your move planning home</p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/#route-planner" style="color:#059669;">Build your route plan &rarr;</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/countries" style="color:#059669;">Route Library</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/services" style="color:#059669;">Services Directory</a></p>
        <p style="margin:6px 0;font-size:14px;"><a href="https://settlemap.app/#ai-assistant" style="color:#059669;">AI Assistant</a></p>
      </div>
      ${firstStepHtml}
      <p style="color:#3f3f46;font-size:14px;line-height:1.7;margin-top:20px;"><strong>Suggested first steps:</strong></p>
      <ol style="color:#3f3f46;font-size:14px;line-height:1.9;padding-left:20px;margin:8px 0 20px 0;">
        <li>Build your route plan at settlemap.app</li>
        <li>Review documents and official-source reminders</li>
        <li>Check first 7 days actions</li>
        <li>Review accommodation and service research sections</li>
        <li>Prepare parent/student handover checklist</li>
      </ol>
      <p style="color:#3f3f46;font-size:14px;line-height:1.7;">If you need help, reply with your <strong>payment email</strong> and <strong>route</strong>.</p>
      <div style="background:#fef9c3;border-left:3px solid #facc15;padding:10px 14px;border-radius:4px;margin:16px 0;">
        <p style="color:#713f12;font-size:12px;line-height:1.6;margin:0;">
          Do not send: passport numbers, visa numbers, bank details, medical details or ID documents.
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
    "",
    "MOVE DETAILS RECEIVED:",
    params.moveRoute ? `Route: ${params.moveRoute}` : "",
    params.departureMonth ? `Expected departure: ${params.departureMonth}` : "",
    params.concerns ? `Main concerns: ${params.concerns}` : "",
    "",
    "YOUR STUDENT MOVE PACK INCLUDES:",
    "- 90-day route-aware project plan guidance",
    "- First 7 days setup guide",
    "- India SIM/OTP continuity checklist where relevant",
    "- Packing and bring-vs-buy checklist",
    "- Parent/student question checklist",
    "- Provider research scripts",
    "- Services research starter",
    "- Email support for access and payment questions",
    "",
    "START HERE:",
    "https://settlemap.app",
    "Build your route plan: https://settlemap.app/#route-planner",
    "Route Library: https://settlemap.app/countries",
    "Services Directory: https://settlemap.app/services",
    "AI Assistant: https://settlemap.app/#ai-assistant",
    "",
    firstStep ? `SUGGESTED FIRST STEP: ${firstStep}` : "",
    "",
    "SUGGESTED STEPS:",
    "1. Build the route plan at settlemap.app",
    "2. Review documents and official-source reminders",
    "3. Check first 7 days actions",
    "4. Review accommodation and service research sections",
    "5. Prepare parent/student handover checklist",
    "",
    "If you need help, reply with your payment email and route.",
    "",
    "Do not send: passport numbers, visa numbers, bank details, medical details or ID documents.",
    "",
    "SettleMap provides planning support only. Not legal, immigration, financial, property, insurance, medical, school or government advice.",
    "",
    "Regards, Ash",
    "SettleMap | support@settlemap.app",
  ];

  return {
    subject: "Your SettleMap Student Move Pack",
    html,
    text: textLines.filter((l) => l !== undefined).join("\n"),
  };
}

// ── Internal notification builder ─────────────────────────────────────────────
function buildInternalEmail(params: {
  customerEmail: string | null;
  customerName: string | null;
  buyerRole: string | null;
  amountTotal: number;
  currency: string;
  sessionId: string;
  paymentIntentId: string;
  moveRoute: string | null;
  departureMonth: string | null;
  concerns: string | null;
  customerEmailSent: boolean;
  autofulfillEnabled: boolean;
  createdAt: number;
  fulfilledAt: string;
}): { subject: string; html: string; text: string } {
  const amount = `${(params.amountTotal / 100).toFixed(2)} ${params.currency.toUpperCase()}`;
  const ts = new Date(params.createdAt * 1000).toISOString();

  const rows: [string, string][] = [
    ["Customer email", params.customerEmail ?? "(not available)"],
    ["Buyer name", params.customerName ?? "(not provided)"],
    ["Role", params.buyerRole ?? "(not provided)"],
    ["Amount", amount],
    ["Currency", params.currency.toUpperCase()],
    ["Move route", params.moveRoute ?? "(not provided)"],
    ["Expected departure", params.departureMonth ?? "(not provided)"],
    ["Concerns", params.concerns ?? "(not provided)"],
    ["Checkout session ID", params.sessionId],
    ["Payment intent ID", params.paymentIntentId],
    ["Fulfilment email sent", params.customerEmailSent ? "yes" : "no"],
    ["Autofulfill enabled", params.autofulfillEnabled ? "yes" : "no"],
    ["Fulfilled at (UTC)", params.fulfilledAt],
    ["Checkout timestamp (UTC)", ts],
  ];

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#71717a;white-space:nowrap;font-size:13px;vertical-align:top;">${k}</td><td style="padding:6px 0;color:#18181b;font-size:13px;word-break:break-all;">${v}</td></tr>`,
    )
    .join("");

  const actionNote = !params.customerEmailSent
    ? (params.autofulfillEnabled
        ? "<div style='margin-top:16px;padding:12px 16px;background:#fee2e2;border-radius:6px;font-size:13px;color:#991b1b;'><strong>ACTION REQUIRED:</strong> Customer email was NOT sent (possible Resend error). Manual fulfilment required.</div>"
        : "<div style='margin-top:16px;padding:12px 16px;background:#fef9c3;border-radius:6px;font-size:13px;color:#713f12;'><strong>ACTION REQUIRED:</strong> Autofulfill is disabled. Send the Student Move Pack manually to this customer.</div>")
    : "<div style='margin-top:16px;padding:12px 16px;background:#f0fdf4;border-radius:6px;font-size:13px;color:#166534;'>Customer email sent automatically. No immediate action required.</div>";

  const html = `<div style="font-family:system-ui,sans-serif;padding:24px;max-width:600px;">
<h2 style="color:#059669;margin:0 0 8px 0;">New Student Move Pack Payment</h2>
<p style="color:#71717a;font-size:13px;margin:0 0 20px 0;">SettleMap · V12.9 Automated Fulfilment</p>
<table style="width:100%;border-collapse:collapse;">${tableRows}</table>
${actionNote}
</div>`;

  const textLines = [
    "NEW SETTLEMAP STUDENT MOVE PACK PAYMENT — V12.9",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    !params.customerEmailSent
      ? params.autofulfillEnabled
        ? "ACTION REQUIRED: Customer email was NOT sent. Manual fulfilment required."
        : "ACTION REQUIRED: Autofulfill disabled. Send Student Move Pack manually."
      : "Customer email sent automatically. No immediate action required.",
  ];

  return {
    subject: `New paid Student Move Pack — ${params.customerEmail ?? "email unknown"}`,
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
  // 1. Raw body — must NOT use request.json()
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    console.error("[webhook] Failed to read request body");
    return new Response("Bad request", { status: 400 });
  }

  // 2. Signature header
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
    console.error("[webhook] Stripe init error:", err instanceof Error ? err.message : "unknown");
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
    console.error("[webhook] Signature verification failed:", err instanceof Error ? err.message : "unknown");
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
    console.warn("[webhook] payment_status not paid:", session.payment_status, "session.id:", session.id);
    return NextResponse.json({ received: true });
  }
  if (session.amount_total !== 1900) {
    console.warn("[webhook] Unexpected amount_total:", session.amount_total, "session.id:", session.id);
    return NextResponse.json({ received: true });
  }
  if (session.currency !== "sgd") {
    console.warn("[webhook] Unexpected currency:", session.currency, "session.id:", session.id);
    return NextResponse.json({ received: true });
  }

  // 8. Validate product metadata
  const sessionMetadata = session.metadata ?? {};
  // V12.9 sessions store product in payment_intent_data.metadata, not session.metadata directly.
  // We check both session metadata and PaymentIntent metadata below.

  // 9. Resolve PaymentIntent ID
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent as Stripe.PaymentIntent | null)?.id ?? null;

  if (!paymentIntentId) {
    console.warn("[webhook] No payment_intent on session:", session.id);
    return NextResponse.json({ received: true });
  }

  // 10. Retrieve PaymentIntent (idempotency check + V12.9 metadata)
  let paymentIntent: Stripe.PaymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (err) {
    console.error("[webhook] Failed to retrieve PaymentIntent:", paymentIntentId, err instanceof Error ? err.message : "unknown");
    return new Response("PaymentIntent retrieval failed", { status: 500 });
  }

  // 11. Product check — must be student_move_pack (V12.9 sessions) or no product key (V12.8 legacy)
  const piMeta = paymentIntent.metadata ?? {};
  const isV129 = piMeta.settlemap_product === "student_move_pack";
  const isV128Legacy = !piMeta.settlemap_product && !sessionMetadata.settlemap_product;
  if (!isV129 && !isV128Legacy) {
    console.log("[webhook] Not a student_move_pack — ignoring. session.id:", session.id, "product:", piMeta.settlemap_product);
    return NextResponse.json({ received: true });
  }

  // 12. Idempotency check
  if (piMeta.settlemap_fulfilled_at) {
    console.log("[webhook] Already fulfilled — skipping. session.id:", session.id, "fulfilled_at:", piMeta.settlemap_fulfilled_at);
    return NextResponse.json({ received: true });
  }

  // 13. Extract V12.9 metadata fields (fall back gracefully for V12.8 legacy sessions)
  const customerEmail = session.customer_details?.email ?? null;
  const customerNameFromDetails = session.customer_details?.name ?? null;
  const buyerName = piMeta.buyer_name || customerNameFromDetails || null;
  const buyerRole = piMeta.buyer_role || null;
  const moveRoute = piMeta.move_route || null;
  const departureMonth = piMeta.departure_month || null;
  const concerns = piMeta.concerns || null;

  // 14. Feature flag
  const autofulfillEnabled = process.env.STUDENT_PACK_AUTOFULFILL_ENABLED !== "false";

  // 15. Init Resend
  let resend: Resend;
  try {
    resend = getResend();
  } catch (err) {
    console.error("[webhook] Resend init error:", err instanceof Error ? err.message : "unknown");
    return new Response("Email service not configured", { status: 500 });
  }

  const fromEmail = process.env.SETTLEMAP_FROM_EMAIL ?? "SettleMap <support@settlemap.app>";
  const supportEmail = process.env.SETTLEMAP_SUPPORT_EMAIL ?? "support@settlemap.app";
  const fulfilledAt = new Date().toISOString();
  let customerEmailSent = false;

  // 16. Send customer fulfilment email (or skip if autofulfill disabled)
  if (autofulfillEnabled) {
    if (customerEmail) {
      const { subject, html, text } = buildCustomerEmail({
        customerName: buyerName,
        moveRoute,
        departureMonth,
        concerns,
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
        console.error(
          "[webhook] Customer email send failed. error.name:",
          (sendError as { name?: string }).name ?? "unknown",
          "session.id:", session.id,
        );
        // Return 500 — Stripe will retry
        return new Response("Customer email send failed", { status: 500 });
      }

      customerEmailSent = true;
      const emailDomain = customerEmail.split("@")[1] ?? "unknown";
      console.log("[webhook] Customer email sent. domain:", emailDomain, "session.id:", session.id);
    } else {
      console.warn("[webhook] No customer email on session — skipping customer email. session.id:", session.id);
    }
  } else {
    console.log("[webhook] STUDENT_PACK_AUTOFULFILL_ENABLED=false — skipping customer email. session.id:", session.id);
  }

  // 17. Update PaymentIntent metadata (idempotency marker)
  let metadataUpdated = false;
  try {
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        settlemap_product: "student_move_pack",
        settlemap_fulfilled_at: fulfilledAt,
        settlemap_fulfilment_email_sent: customerEmailSent ? "true" : "false",
        settlemap_fulfilment_version: "V12.9",
        // Preserve V12.9 intake fields (keep existing if already set)
        buyer_name: buyerName ?? piMeta.buyer_name ?? "",
        buyer_role: buyerRole ?? piMeta.buyer_role ?? "",
        move_route: moveRoute ?? piMeta.move_route ?? "",
        departure_month: departureMonth ?? piMeta.departure_month ?? "",
        concerns: concerns ?? piMeta.concerns ?? "",
        fulfilment_version: "V12.9",
      },
    });
    metadataUpdated = true;
    console.log("[webhook] PaymentIntent metadata updated. paymentIntentId:", paymentIntentId);
  } catch (err) {
    // Non-fatal
    console.error(
      "[webhook] Failed to update PaymentIntent metadata. paymentIntentId:", paymentIntentId,
      err instanceof Error ? err.message : "unknown",
    );
  }

  // 18. Send internal notification
  const internalEmail = buildInternalEmail({
    customerEmail,
    customerName: buyerName,
    buyerRole,
    amountTotal: session.amount_total ?? 0,
    currency: session.currency ?? "sgd",
    sessionId: session.id,
    paymentIntentId,
    moveRoute,
    departureMonth,
    concerns,
    customerEmailSent,
    autofulfillEnabled,
    createdAt: session.created,
    fulfilledAt,
  });

  const { error: internalError } = await resend.emails.send({
    from: fromEmail,
    to: supportEmail,
    subject: internalEmail.subject,
    html: internalEmail.html,
    text: internalEmail.text,
  });

  if (internalError) {
    console.error(
      "[webhook] Internal notification failed. error.name:",
      (internalError as { name?: string }).name ?? "unknown",
      "session.id:", session.id,
    );
  } else {
    console.log("[webhook] Internal notification sent. session.id:", session.id);
  }

  console.log(
    "[webhook] Fulfilment complete. session.id:", session.id,
    "customerEmailSent:", customerEmailSent,
    "autofulfillEnabled:", autofulfillEnabled,
    "metadataUpdated:", metadataUpdated,
  );

  return NextResponse.json({ received: true });
}
