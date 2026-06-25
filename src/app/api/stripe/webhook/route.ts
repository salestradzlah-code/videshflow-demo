import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { generateStudentMovePack, buildPackEmail } from "@/lib/studentMovePack";
import { generatePremiumRelocationPack, buildPremiumPackEmail } from "@/lib/premiumRelocationPack";
import { generateVoiceGuide, buildVoiceGuideEmail } from "@/lib/voiceGuide";

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
  product: string;
  amountTotal: number;
  currency: string;
  sessionId: string;
  paymentIntentId: string;
  route: string | null;
  timing: string | null;
  customerEmailSent: boolean;
  packGenerated: boolean;
  autofulfillEnabled: boolean;
  fulfilledAt: string;
}): { subject: string; html: string; text: string } {
  const amount = `${(params.amountTotal / 100).toFixed(2)} ${params.currency.toUpperCase()}`;

  const rows: [string, string][] = [
    ["Product", params.product],
    ["Customer email", params.customerEmail ?? "(not available)"],
    ["Buyer name", params.buyerName ?? "(not provided)"],
    ["Amount", amount],
    ["Route / timing", `${params.route ?? "(not provided)"} · ${params.timing ?? ""}`],
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

  const isPremium = params.product === "premium_relocation_pack";
  const isVoice = params.product === "voice_guide";
  const accentColor = isPremium ? "#7c3aed" : isVoice ? "#0f766e" : "#059669";
  const productLabel = isPremium
    ? "Premium Relocation Pack"
    : isVoice
      ? "SettleMap Voice Guide"
      : "Student Move Pack";

  const actionNote = !params.customerEmailSent
    ? params.autofulfillEnabled
      ? `<div style="margin-top:16px;padding:12px 16px;background:#fee2e2;border-radius:6px;font-size:13px;color:#991b1b;"><strong>ACTION REQUIRED:</strong> Customer email was NOT sent. Use the resend-fulfilment endpoint or send manually.</div>`
      : `<div style="margin-top:16px;padding:12px 16px;background:#fef9c3;border-radius:6px;font-size:13px;color:#713f12;"><strong>ACTION REQUIRED:</strong> Autofulfill disabled. Send pack manually.</div>`
    : `<div style="margin-top:16px;padding:12px 16px;background:#f0fdf4;border-radius:6px;font-size:13px;color:#166534;">Customer email sent with full pack content. No immediate action required.</div>`;

  const html = `<div style="font-family:system-ui,sans-serif;padding:24px;max-width:600px;">
<h2 style="color:${accentColor};margin:0 0 8px 0;">New ${productLabel} Payment</h2>
<p style="color:#71717a;font-size:13px;margin:0 0 20px 0;">SettleMap · V12.12 Automated Fulfilment</p>
<table style="width:100%;border-collapse:collapse;">${tableRows}</table>
${actionNote}
</div>`;

  return {
    subject: `New paid ${productLabel} — ${params.customerEmail ?? "email unknown"}`,
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
  const settlemapProduct = piMeta.settlemap_product ?? "";

  // Route by product
  if (
    settlemapProduct !== "student_move_pack" &&
    settlemapProduct !== "premium_relocation_pack" &&
    settlemapProduct !== "voice_guide"
  ) {
    return NextResponse.json({ received: true });
  }

  // Idempotency
  if (piMeta.settlemap_fulfilled_at) {
    console.log("[webhook] Already fulfilled. session.id:", session.id);
    return NextResponse.json({ received: true });
  }

  const customerEmail = session.customer_details?.email ?? null;
  const buyerName = piMeta.buyer_name || session.customer_details?.name || null;

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
  let packGenerated = false;
  let routeLabel: string | null = null;
  let timingLabel: string | null = null;

  // ── Premium Relocation Pack ────────────────────────────────────────────────
  if (settlemapProduct === "voice_guide") {
    const autofulfillEnabled = process.env.VOICE_GUIDE_AUTOFULFILL_ENABLED === "true";

    const origin = piMeta.origin || null;
    const destination = piMeta.destination || null;
    const moveReason = piMeta.move_reason || null;
    const whoIsMoving = piMeta.who_is_moving || null;
    const timingMonth = piMeta.timing_month || null;
    const concerns = piMeta.concerns || null;

    routeLabel = origin && destination ? `${origin} to ${destination}` : null;
    timingLabel = timingMonth;

    const guide = generateVoiceGuide({
      origin,
      destination,
      moveReason,
      whoIsMoving,
      timingMonth,
      concerns,
      buyerName,
    });
    packGenerated = true;

    if (autofulfillEnabled && customerEmail) {
      const { subject, html, text } = buildVoiceGuideEmail(
        guide,
        buyerName,
        timingMonth,
        concerns,
      );

      const { error: sendError } = await resend.emails.send({
        from: fromEmail,
        to: customerEmail,
        replyTo: supportEmail,
        subject,
        html,
        text,
      });

      if (sendError) {
        console.error("[webhook-voice] Customer email failed:", (sendError as { name?: string }).name ?? "unknown");
        return new Response("Customer email send failed", { status: 500 });
      }

      customerEmailSent = true;
      console.log("[webhook-voice] Voice Guide email sent. domain:", customerEmail.split("@")[1] ?? "unknown");
    } else if (!autofulfillEnabled) {
      console.log("[webhook-voice] Autofulfill disabled. session.id:", session.id);
    }

    try {
      await stripe.paymentIntents.update(paymentIntentId, {
        metadata: {
          settlemap_product: "voice_guide",
          settlemap_fulfilled_at: fulfilledAt,
          settlemap_fulfilment_email_sent: customerEmailSent ? "true" : "false",
          settlemap_fulfilment_version: "V12.12",
          buyer_name: buyerName ?? "",
          origin: origin ?? "",
          destination: destination ?? "",
          move_reason: moveReason ?? "",
          who_is_moving: whoIsMoving ?? "",
          timing_month: timingMonth ?? "",
          concerns: concerns ?? "",
        },
      });
    } catch (err) {
      console.error("[webhook-voice] Metadata update failed:", err instanceof Error ? err.message : "unknown");
    }

    const internal = buildInternalEmail({
      customerEmail,
      buyerName,
      product: "voice_guide",
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? "sgd",
      sessionId: session.id,
      paymentIntentId,
      route: routeLabel,
      timing: timingLabel,
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
    if (internalError) console.error("[webhook-voice] Internal notification failed");

    console.log("[webhook-voice] Done. session.id:", session.id, "emailSent:", customerEmailSent);
    return NextResponse.json({ received: true });
  }

  if (settlemapProduct === "premium_relocation_pack") {
    const autofulfillEnabled = process.env.PREMIUM_PACK_AUTOFULFILL_ENABLED === "true";

    const origin = piMeta.origin || null;
    const destination = piMeta.destination || null;
    const moveReason = piMeta.move_reason || null;
    const whoIsMoving = piMeta.who_is_moving || null;
    const timingMonth = piMeta.timing_month || null;
    const modules = piMeta.modules || null;
    const concerns = piMeta.concerns || null;

    routeLabel = origin && destination ? `${origin} to ${destination}` : null;
    timingLabel = timingMonth;

    const pack = generatePremiumRelocationPack({
      origin, destination, moveReason, whoIsMoving, timingMonth, modules, concerns, buyerName,
    });
    packGenerated = true;

    if (autofulfillEnabled && customerEmail) {
      const { subject, html, text } = buildPremiumPackEmail(pack, buyerName, timingMonth, modules);

      const { error: sendError } = await resend.emails.send({
        from: fromEmail,
        to: customerEmail,
        replyTo: supportEmail,
        subject,
        html,
        text,
      });

      if (sendError) {
        console.error("[webhook-premium] Customer email failed:", (sendError as { name?: string }).name ?? "unknown");
        return new Response("Customer email send failed", { status: 500 });
      }

      customerEmailSent = true;
      console.log("[webhook-premium] Premium pack email sent. domain:", customerEmail.split("@")[1] ?? "unknown");
    } else if (!autofulfillEnabled) {
      console.log("[webhook-premium] Autofulfill disabled. session.id:", session.id);
    }

    try {
      await stripe.paymentIntents.update(paymentIntentId, {
        metadata: {
          settlemap_product: "premium_relocation_pack",
          settlemap_fulfilled_at: fulfilledAt,
          settlemap_fulfilment_email_sent: customerEmailSent ? "true" : "false",
          settlemap_fulfilment_version: "V12.12",
          buyer_name: buyerName ?? "",
          origin: origin ?? "",
          destination: destination ?? "",
          move_reason: moveReason ?? "",
          who_is_moving: whoIsMoving ?? "",
          timing_month: timingMonth ?? "",
          modules: modules ?? "",
          concerns: concerns ?? "",
        },
      });
    } catch (err) {
      console.error("[webhook-premium] Metadata update failed:", err instanceof Error ? err.message : "unknown");
    }

    const internal = buildInternalEmail({
      customerEmail, buyerName, product: "premium_relocation_pack",
      amountTotal: session.amount_total ?? 0, currency: session.currency ?? "sgd",
      sessionId: session.id, paymentIntentId, route: routeLabel, timing: timingLabel,
      customerEmailSent, packGenerated, autofulfillEnabled, fulfilledAt,
    });

    const { error: internalError } = await resend.emails.send({
      from: fromEmail, to: supportEmail,
      subject: internal.subject, html: internal.html, text: internal.text,
    });
    if (internalError) console.error("[webhook-premium] Internal notification failed");

    console.log("[webhook-premium] Done. session.id:", session.id, "emailSent:", customerEmailSent);
    return NextResponse.json({ received: true });
  }

  // ── Student Move Pack ──────────────────────────────────────────────────────
  const autofulfillEnabled = process.env.STUDENT_PACK_AUTOFULFILL_ENABLED !== "false";
  const buyerRole = piMeta.buyer_role || null;
  const moveRoute = piMeta.move_route || null;
  const departureMonth = piMeta.departure_month || null;
  const concerns = piMeta.concerns || null;

  routeLabel = moveRoute;
  timingLabel = departureMonth;

  const pack = generateStudentMovePack({ moveRoute, otherRoute: piMeta.other_route, departureMonth, concerns, buyerRole, buyerName });
  packGenerated = true;

  if (autofulfillEnabled && customerEmail) {
    const { subject, html, text } = buildPackEmail(pack, buyerName, departureMonth, concerns);

    const { error: sendError } = await resend.emails.send({
      from: fromEmail, to: customerEmail, replyTo: supportEmail, subject, html, text,
    });

    if (sendError) {
      console.error("[webhook] Customer email failed:", (sendError as { name?: string }).name ?? "unknown");
      return new Response("Customer email send failed", { status: 500 });
    }

    customerEmailSent = true;
    console.log("[webhook] Pack email sent. domain:", customerEmail.split("@")[1] ?? "unknown");
  } else if (!autofulfillEnabled) {
    console.log("[webhook] Autofulfill disabled. session.id:", session.id);
  }

  try {
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        settlemap_product: "student_move_pack",
        settlemap_fulfilled_at: fulfilledAt,
        settlemap_fulfilment_email_sent: customerEmailSent ? "true" : "false",
        settlemap_fulfilment_version: "V12.12",
        buyer_name: buyerName ?? "",
        buyer_role: buyerRole ?? "",
        move_route: moveRoute ?? "",
        departure_month: departureMonth ?? "",
        concerns: concerns ?? "",
        fulfilment_version: "V12.12",
      },
    });
  } catch (err) {
    console.error("[webhook] Metadata update failed:", err instanceof Error ? err.message : "unknown");
  }

  const internal = buildInternalEmail({
    customerEmail, buyerName, product: "student_move_pack",
    amountTotal: session.amount_total ?? 0, currency: session.currency ?? "sgd",
    sessionId: session.id, paymentIntentId, route: routeLabel, timing: timingLabel,
    customerEmailSent, packGenerated, autofulfillEnabled, fulfilledAt,
  });

  const { error: internalError } = await resend.emails.send({
    from: fromEmail, to: supportEmail,
    subject: internal.subject, html: internal.html, text: internal.text,
  });
  if (internalError) console.error("[webhook] Internal notification failed:", (internalError as { name?: string }).name ?? "unknown");

  console.log("[webhook] Done. session.id:", session.id, "emailSent:", customerEmailSent);
  return NextResponse.json({ received: true });
}
