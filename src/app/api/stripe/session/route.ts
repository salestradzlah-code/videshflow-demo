import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Stripe(key, { apiVersion: "2024-11-20.acacia" as any });
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId || typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session_id." }, { status: 400 });
  }

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
  } catch (err) {
    console.error("[session] Failed to retrieve session:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  // Validate: paid, correct amount, currency, product
  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment not confirmed.", paid: false }, { status: 402 });
  }
  if (session.amount_total !== 1900) {
    return NextResponse.json({ error: "Unexpected amount.", paid: false }, { status: 400 });
  }
  if (session.currency !== "sgd") {
    return NextResponse.json({ error: "Unexpected currency.", paid: false }, { status: 400 });
  }

  // Extract PaymentIntent metadata (V12.9+ sessions store intake data there)
  const pi = session.payment_intent as Stripe.PaymentIntent | null;
  const piMeta = pi?.metadata ?? {};

  // Validate product
  if (piMeta.settlemap_product && piMeta.settlemap_product !== "student_move_pack") {
    return NextResponse.json({ error: "Not a Student Move Pack session.", paid: false }, { status: 400 });
  }

  // Return only safe fields — never card details, full PI object, or secret keys
  return NextResponse.json({
    paid: true,
    customerEmail: session.customer_details?.email ?? null,
    buyerName: piMeta.buyer_name || session.customer_details?.name || null,
    buyerRole: piMeta.buyer_role || null,
    moveRoute: piMeta.move_route || null,
    otherRoute: piMeta.other_route || null,
    departureMonth: piMeta.departure_month || null,
    concerns: piMeta.concerns || null,
    amountTotal: session.amount_total,
    currency: session.currency,
    product: piMeta.settlemap_product || "student_move_pack",
    created: session.created,
  });
}
