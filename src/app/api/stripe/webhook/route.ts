import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { generateStudentMovePack, buildPackEmail } from "@/lib/studentMovePack";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

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

function buildInternalEmail(params: {
  customerEmail: string | null;
  buyerName: string | null;
  buyerRole: string | null;
  amountTotal: number;
  currency: string;
  sessionId: string;
  paymentIntentId: string;
  moveRoute: string | null;
  departureMonth: string | null;
  concerns: string | null;
  customerEmailSent: boolean;
  packGenerated: boolean;
  autofulfillEnabled: boolean;
  fulfilledAt: string;
}): { subject: string; html: string; text: string } {
  const amount = `${(params.amountTotal / 100).toFixed(2)} ${params.currency.toUpperCase()}`;

  const rows: [string, string][] = [
    ["Customer email", params.customerEmail ?? "(not available)"],
    ["Buyer name", params.buyerName ?? "(not provided)"],
    ["Role", params.buyerRole ?? "(not provided)"],
    ["Amount", amount],
    ["Move route", params.moveRoute ?? "(not provided)"],
    ["Expected departure", params.departureMonth ?? "(not provided)"],
    ["Concerns", params.concerns ?? "(not provided)"],
    ["Checkout session ID", params.sessionId],
    ["Payment intent ID", params.paymentIntentId],
    ["Fulfilment email sent", params.customerEmailSent ? "yes" : "no"],
    ["Pack generated", params.packGenerated ? "yes" : "no"],
    ["Autofulfill enabled", params.autofulfillEnabled ? "yes" : "no"],
    ["Fulfilled at (UTC)", params.fulfilledAt],
  ];

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#71717a;font-size:13px;vertical-align:top;white-space:nowrap;">${k}</td><td style="padding:6px 0;color:#18181b;font-size:13px;word-break:break-all;">${v}</td></tr>`,
    )
    .join("");

  const actionNote = !params.customerEmailSent
    ? params.autofulfillEnabled
      ? `<div style="margin-top:16px;padding:12px 16px;background:#fee2e2;border-radius:6px;font-size:13px;color:#991b1b;"><strong>ACTION REQUIRED:</strong> Customer email was NOT sent. Use the resend-fulfilment endpoint or send manually.</div>`
      : `<div style="margin-top:16px;padding:12px 16px;background:#fef9c3;border-radius:6px;font-size:13px;color:#713f12;"><strong>ACTION REQUIRED:</strong> Autofulfill disabled. Send Student Move Pack manually.</div>`
    : `<div style="margin-top:16px;padding:12px 16px;background:#f0fdf4;border-radius:6px;font-size:13px;color:#166534;">Customer email sent with full pack content. No immediate action required.</div>`;

  const html = `<div style="font-family:system-ui,sans-serif;padding:24px;max-width:600px;">
<h2 style="color:#059669;margin:0 0 8px 0;">New Student Move Pack Payment</h2>
<p style="color:#71717a;font-size:13px;margin:0 0 20px 0;">SettleMap · V12.10 Automated Fulfilment</p>
<table style="width:100%;border-collapse:collapse;">${tableRows}</table>
${actionNote}
</div>`;

  return {
    subject: `New paid Student Move Pack — ${params.customerEmail ?? "email unknown"}`,
    html,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n") + "\n\n" + (params.customerEmailSent ? "Email sent with full pack." : "ACTION REQUIRED: Email not sent."),
  };
}

const FULFIL_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
]);
const IGNORE_EVENTS = new Set([
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
]);

export async function GET() {
  return new Response("SettleMap Stripe webhook endpoint is available.", { status: 200 });
}

export async function POST(request: NextRequest) {
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const signature = request.headers.get("stripe-signature") ?? "";
  if (!signature) return new Response("Missing stripe-signature header", { status: 400 });

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch {
    return new Response("Server configuration error", { status: 500 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return new Response("Server configuration error", { status: 500 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature failed:", err instanceof Error ? err.message : "unknown");
    return new Response("Invalid signature", { status: 400 });
  }

  console.log("[webhook] event.id:", event.id, "event.type:", event.type);

  if (IGNORE_EVENTS.has(event.type)) return NextResponse.json({ received: true });
  if (!FULFIL_EVENTS.has(event.type)) return NextResponse.json({ received: true });

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== "paid") return NextResponse.json({ received: true });
  if (session.amount_total !== 1900) return NextResponse.json({ received: true });
  if (session.currency !== "sgd") return NextResponse.json({ received: true });

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent as Stripe.PaymentIntent | null)?.id ?? null;

  if (!paymentIntentId) return NextResponse.json({ received: true });

  let paymentIntent: Stripe.PaymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch {
    return new Response("PaymentIntent retrieval failed", { status: 500 });
  }

  const piMeta = paymentIntent.metadata ?? {};

  // Product check
  if (piMeta.settlemap_product && piMeta.settlemap_product !== "student_move_pack") {
    return NextResponse.json({ received: true });
  }

  // Idempotency
  if (piMeta.settlemap_fulfilled_at) {
    console.log("[webhook] Already fulfilled. session.id:", session.id);
    return NextResponse.json({ received: true });
  }

  // Extract metadata
  const customerEmail = session.customer_details?.email ?? null;
  const buyerName = piMeta.buyer_name || session.customer_details?.name || null;
  const buyerRole = piMeta.buyer_role || null;
  const moveRoute = piMeta.move_route || null;
  const departureMonth = piMeta.departure_month || null;
  const concerns = piMeta.concerns || null;

  // Feature flag
  const autofulfillEnabled = process.env.STUDENT_PACK_AUTOFULFILL_ENABLED !== "false";

  // Generate pack
  const pack = generateStudentMovePack({ moveRoute, otherRoute: piMeta.other_route, departureMonth, concerns, buyerRole, buyerName });
  const packGenerated = true;

  let resend: Resend;
  try {
    resend = getResend();
  } catch {
    return new Response("Email service not configured", { status: 500 });
  }

  const fromEmail = process.env.SETTLEMAP_FROM_EMAIL ?? "SettleMap <support@settlemap.app>";
  const supportEmail = process.env.SETTLEMAP_SUPPORT_EMAIL ?? "support@settlemap.app";
  const fulfilledAt = new Date().toISOString();
  let customerEmailSent = false;

  if (autofulfillEnabled && customerEmail) {
    const { subject, html, text } = buildPackEmail(pack, buyerName, departureMonth, concerns);

    const { error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: customerEmail,
      replyTo: supportEmail,
      subject,
      html,
      text,
    });

    if (sendError) {
      console.error("[webhook] Customer email failed:", (sendError as { name?: string }).name ?? "unknown");
      return new Response("Customer email send failed", { status: 500 });
    }

    customerEmailSent = true;
    console.log("[webhook] Pack email sent. domain:", customerEmail.split("@")[1] ?? "unknown");
  } else if (!autofulfillEnabled) {
    console.log("[webhook] Autofulfill disabled — skipping customer email. session.id:", session.id);
  }

  // Update PI metadata
  try {
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        settlemap_product: "student_move_pack",
        settlemap_fulfilled_at: fulfilledAt,
        settlemap_fulfilment_email_sent: customerEmailSent ? "true" : "false",
        settlemap_fulfilment_version: "V12.10",
        buyer_name: buyerName ?? "",
        buyer_role: buyerRole ?? "",
        move_route: moveRoute ?? "",
        departure_month: departureMonth ?? "",
        concerns: concerns ?? "",
        fulfilment_version: "V12.10",
      },
    });
  } catch (err) {
    console.error("[webhook] Metadata update failed:", err instanceof Error ? err.message : "unknown");
  }

  // Internal notification
  const internal = buildInternalEmail({
    customerEmail,
    buyerName,
    buyerRole,
    amountTotal: session.amount_total ?? 0,
    currency: session.currency ?? "sgd",
    sessionId: session.id,
    paymentIntentId,
    moveRoute,
    departureMonth,
    concerns,
    customerEmailSent,
    packGenerated,
    autofulfillEnabled,
    fulfilledAt,
  });

  const { error: internalError } = await resend.emails.send({
    from: fromEmail,
    to: supportEmail,
    subject: internal.subject,
    html: internal.html,
    text: internal.text,
  });

  if (internalError) {
    console.error("[webhook] Internal notification failed:", (internalError as { name?: string }).name ?? "unknown");
  }

  console.log("[webhook] Done. session.id:", session.id, "emailSent:", customerEmailSent);
  return NextResponse.json({ received: true });
}
