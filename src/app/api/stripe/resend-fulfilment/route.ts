import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { generateStudentMovePack, buildPackEmail } from "@/lib/studentMovePack";
import { generatePremiumRelocationPack, buildPremiumPackEmail } from "@/lib/premiumRelocationPack";
import { generateVoiceGuide, buildVoiceGuideEmail } from "@/lib/voiceGuide";
import { getEmailReadiness } from "@/lib/emailReadiness";

export const dynamic = "force-dynamic";

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

function safeIdSuffix(value: string | null | undefined): string {
  return value ? value.slice(-6) : "unknown";
}

export async function POST(request: NextRequest) {
  // 1. Admin token check
  const adminToken = process.env.SETTLEMAP_ADMIN_TOKEN;
  if (!adminToken) {
    console.error("[resend-fulfilment] SETTLEMAP_ADMIN_TOKEN not configured");
    return NextResponse.json({ error: "Endpoint not configured." }, { status: 503 });
  }

  const authHeader = request.headers.get("authorization") ?? "";
  const providedToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (providedToken !== adminToken) {
    console.warn("[resend-fulfilment] Unauthorized attempt");
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // 2. Parse body
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { paymentIntentId, checkoutSessionId } = body;

  if (!paymentIntentId && !checkoutSessionId) {
    return NextResponse.json(
      { error: "Provide paymentIntentId or checkoutSessionId." },
      { status: 400 },
    );
  }

  // 3. Init Stripe
  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    return NextResponse.json(
      { error: "Stripe not configured: " + (err instanceof Error ? err.message : "unknown") },
      { status: 503 },
    );
  }

  // 4. Resolve PaymentIntent
  let pi: Stripe.PaymentIntent;
  let customerEmail: string | null = null;

  if (paymentIntentId && typeof paymentIntentId === "string") {
    try {
      pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (err) {
      return NextResponse.json(
        { error: "PaymentIntent not found: " + (err instanceof Error ? err.message : "unknown") },
        { status: 404 },
      );
    }
  } else {
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(checkoutSessionId as string, {
        expand: ["payment_intent"],
      });
    } catch (err) {
      return NextResponse.json(
        { error: "Session not found: " + (err instanceof Error ? err.message : "unknown") },
        { status: 404 },
      );
    }
    customerEmail = session.customer_details?.email ?? null;
    pi = session.payment_intent as Stripe.PaymentIntent;
    if (!pi) {
      return NextResponse.json({ error: "No PaymentIntent on session." }, { status: 400 });
    }
  }

  const piMeta = pi.metadata ?? {};

  // 5. Find customer email if not already found
  if (!customerEmail) {
    try {
      const charges = await stripe.charges.list({ payment_intent: pi.id, limit: 1 });
      customerEmail = charges.data[0]?.billing_details?.email ?? null;
    } catch {
      // Non-fatal
    }
  }

  if (!customerEmail) {
    return NextResponse.json(
      { error: "No customer email found on this PaymentIntent." },
      { status: 400 },
    );
  }

  // 6. Route by product
  const settlemapProduct = piMeta.settlemap_product ?? "student_move_pack";

  let emailSubject: string;
  let emailHtml: string;
  let emailText: string;

  if (settlemapProduct === "premium_relocation_pack") {
    const pack = generatePremiumRelocationPack({
      origin: piMeta.origin,
      destination: piMeta.destination,
      moveReason: piMeta.move_reason,
      whoIsMoving: piMeta.who_is_moving,
      timingMonth: piMeta.timing_month,
      modules: piMeta.modules,
      concerns: piMeta.concerns,
      buyerName: piMeta.buyer_name,
    });
    const result = buildPremiumPackEmail(
      pack,
      piMeta.buyer_name || null,
      piMeta.timing_month || null,
      piMeta.modules || null,
    );
    emailSubject = result.subject;
    emailHtml = result.html;
    emailText = result.text;
  } else if (settlemapProduct === "voice_guide") {
    const guide = generateVoiceGuide({
      origin: piMeta.origin,
      destination: piMeta.destination,
      moveReason: piMeta.move_reason,
      whoIsMoving: piMeta.who_is_moving,
      timingMonth: piMeta.timing_month,
      concerns: piMeta.concerns,
      buyerName: piMeta.buyer_name,
    });
    const result = buildVoiceGuideEmail(
      guide,
      piMeta.buyer_name || null,
      piMeta.timing_month || null,
      piMeta.concerns || null,
    );
    emailSubject = result.subject;
    emailHtml = result.html;
    emailText = result.text;
  } else {
    const pack = generateStudentMovePack({
      moveRoute: piMeta.move_route,
      otherRoute: piMeta.other_route,
      departureMonth: piMeta.departure_month,
      concerns: piMeta.concerns,
      buyerRole: piMeta.buyer_role,
      buyerName: piMeta.buyer_name,
    });
    const result = buildPackEmail(
      pack,
      piMeta.buyer_name || null,
      piMeta.departure_month || null,
      piMeta.concerns || null,
    );
    emailSubject = result.subject;
    emailHtml = result.html;
    emailText = result.text;
  }

  // 7. Send email
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
  const supportEmail = process.env.SETTLEMAP_SUPPORT_EMAIL ?? "support@settlemap.app";

  const { error: sendError } = await resend.emails.send({
    from: fromEmail,
    to: customerEmail,
    replyTo: supportEmail,
    subject: emailSubject,
    html: emailHtml,
    text: emailText,
  });

  if (sendError) {
    console.error("[resend-fulfilment] Email send failed:", (sendError as { name?: string }).name ?? "unknown");
    return NextResponse.json({ error: "Email send failed.", detail: (sendError as { name?: string }).name }, { status: 500 });
  }

  const emailDomain = customerEmail.split("@")[1] ?? "unknown";
  console.log("[resend-fulfilment] Email resent. domain:", emailDomain, "pi:", safeIdSuffix(pi.id), "product:", settlemapProduct);

  // 8. Update metadata
  const now = new Date().toISOString();
  const resendCount = parseInt(piMeta.settlemap_resend_count ?? "0", 10) + 1;

  try {
    await stripe.paymentIntents.update(pi.id, {
      metadata: {
        settlemap_last_resend_at: now,
        settlemap_resend_count: String(resendCount),
        settlemap_fulfilment_version: "V12.12.3",
      },
    });
  } catch (err) {
    console.error("[resend-fulfilment] Metadata update failed:", err instanceof Error ? err.message : "unknown");
  }

  const productLabel =
    settlemapProduct === "premium_relocation_pack"
      ? "Premium Relocation Pack"
      : settlemapProduct === "voice_guide"
        ? "SettleMap Voice Guide"
        : "Student Move Pack";

  const { error: internalError } = await resend.emails.send({
    from: fromEmail,
    to: supportEmail,
    subject: `[Resend #${resendCount}] ${productLabel} resent — ${emailDomain}`,
    text: `Resent fulfilment email.\n\nProduct: ${settlemapProduct}\nPaymentIntent reference: ...${safeIdSuffix(pi.id)}\nResend count: ${resendCount}\nTimestamp: ${now}`,
    html: `<p><strong>Resent fulfilment email.</strong></p>
<table>
<tr><td>Product</td><td>${settlemapProduct}</td></tr>
<tr><td>PaymentIntent reference</td><td>...${safeIdSuffix(pi.id)}</td></tr>
<tr><td>Resend count</td><td>${resendCount}</td></tr>
<tr><td>Timestamp</td><td>${now}</td></tr>
</table>`,
  });

  if (internalError) {
    console.error("[resend-fulfilment] Internal notification failed");
  }

  return NextResponse.json({
    success: true,
    product: settlemapProduct,
    emailSentTo: emailDomain,
    resendCount,
    sentAt: now,
  });
}
