import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Stripe(key, { apiVersion: "2024-11-20.acacia" as any });
}

const VALID_AMOUNTS = [1900, 4900];

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

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment not confirmed.", paid: false }, { status: 402 });
  }
  if (!VALID_AMOUNTS.includes(session.amount_total ?? 0)) {
    return NextResponse.json({ error: "Unexpected amount.", paid: false }, { status: 400 });
  }
  if (session.currency !== "sgd") {
    return NextResponse.json({ error: "Unexpected currency.", paid: false }, { status: 400 });
  }

  const pi = session.payment_intent as Stripe.PaymentIntent | null;
  const piMeta = pi?.metadata ?? {};

  const settlemapProduct = piMeta.settlemap_product ?? "student_move_pack";

  if (settlemapProduct !== "student_move_pack" && settlemapProduct !== "premium_relocation_pack") {
    return NextResponse.json({ error: "Unrecognised product.", paid: false }, { status: 400 });
  }

  const productType: "student" | "premium" =
    settlemapProduct === "premium_relocation_pack" ? "premium" : "student";

  if (productType === "premium") {
    return NextResponse.json({
      paid: true,
      productType: "premium",
      customerEmail: session.customer_details?.email ?? null,
      buyerName: piMeta.buyer_name || session.customer_details?.name || null,
      origin: piMeta.origin || null,
      destination: piMeta.destination || null,
      moveReason: piMeta.move_reason || null,
      whoIsMoving: piMeta.who_is_moving || null,
      timingMonth: piMeta.timing_month || null,
      modules: piMeta.modules || null,
      concerns: piMeta.concerns || null,
      amountTotal: session.amount_total,
      currency: session.currency,
      product: settlemapProduct,
      created: session.created,
    });
  }

  // Student
  return NextResponse.json({
    paid: true,
    productType: "student",
    customerEmail: session.customer_details?.email ?? null,
    buyerName: piMeta.buyer_name || session.customer_details?.name || null,
    buyerRole: piMeta.buyer_role || null,
    moveRoute: piMeta.move_route || null,
    otherRoute: piMeta.other_route || null,
    departureMonth: piMeta.departure_month || null,
    concerns: piMeta.concerns || null,
    amountTotal: session.amount_total,
    currency: session.currency,
    product: settlemapProduct,
    created: session.created,
  });
}
