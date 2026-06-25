import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// ── Runtime config ────────────────────────────────────────────────────────────
export const dynamic = "force-dynamic";

// ── Helpers ───────────────────────────────────────────────────────────────────
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Stripe(key, { apiVersion: "2024-11-20.acacia" as any });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // 1. Parse body
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const productType =
    typeof body.productType === "string" ? body.productType : "student_move_pack";

  // ── Premium Relocation Pack ─────────────────────────────────────────────────
  if (productType === "premium_relocation_pack") {
    const checkoutEnabled = process.env.PREMIUM_PACK_CHECKOUT_ENABLED !== "false";
    if (!checkoutEnabled) {
      return NextResponse.json(
        { error: "Premium Relocation Pack checkout is temporarily unavailable. Contact support@settlemap.app." },
        { status: 503 },
      );
    }

    const { buyerEmail, buyerName, origin, destination, moveReason, whoIsMoving,
            timingMonth, modules, concerns, consentPlanning, consentSensitive } = body;

    const missing: string[] = [];
    if (!buyerEmail || typeof buyerEmail !== "string" || !isValidEmail(buyerEmail)) missing.push("buyerEmail");
    if (!buyerName || typeof buyerName !== "string" || !buyerName.trim()) missing.push("buyerName");
    if (!origin || typeof origin !== "string") missing.push("origin");
    if (!destination || typeof destination !== "string") missing.push("destination");
    if (!moveReason || typeof moveReason !== "string") missing.push("moveReason");
    if (!whoIsMoving || typeof whoIsMoving !== "string") missing.push("whoIsMoving");
    if (!timingMonth || typeof timingMonth !== "string") missing.push("timingMonth");
    if (!concerns || typeof concerns !== "string" || !concerns.trim()) missing.push("concerns");

    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
    }
    if (consentPlanning !== true || consentSensitive !== true) {
      return NextResponse.json({ error: "Both consent confirmations are required." }, { status: 400 });
    }

    let stripe: Stripe;
    try {
      stripe = getStripe();
    } catch (err) {
      console.error("[checkout-premium] Stripe init failed:", err instanceof Error ? err.message : "unknown");
      return NextResponse.json({ error: "Payment setup is temporarily unavailable. Please try again." }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://settlemap.app";
    const premiumPriceId = process.env.STRIPE_PREMIUM_PRICE_ID;

    let session: Stripe.Checkout.Session;
    try {
      const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = premiumPriceId
        ? { price: premiumPriceId, quantity: 1 }
        : {
            price_data: {
              currency: "sgd",
              unit_amount: 4900,
              product_data: {
                name: "SettleMap Premium Relocation Pack",
                description: `Route: ${origin as string} to ${destination as string} · ${timingMonth as string}`,
              },
            },
            quantity: 1,
          };

      session = await stripe.checkout.sessions.create({
        mode: "payment",
        currency: "sgd",
        customer_email: buyerEmail as string,
        line_items: [lineItem],
        payment_intent_data: {
          metadata: {
            settlemap_product: "premium_relocation_pack",
            buyer_name: (buyerName as string).trim(),
            origin: (origin as string).slice(0, 200),
            destination: (destination as string).slice(0, 200),
            move_reason: (moveReason as string).slice(0, 200),
            who_is_moving: (whoIsMoving as string).slice(0, 200),
            timing_month: timingMonth as string,
            modules: typeof modules === "string" ? (modules as string).slice(0, 500) : "",
            concerns: (concerns as string).slice(0, 500),
            fulfilment_version: "V12.12",
          },
        },
        success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/payment-cancelled`,
      });
    } catch (err) {
      console.error("[checkout-premium] Stripe session create failed:", err instanceof Error ? err.message : "unknown");
      return NextResponse.json(
        { error: "Payment setup is temporarily unavailable. Please try again or contact support@settlemap.app." },
        { status: 500 },
      );
    }

    if (!session.url) {
      console.error("[checkout-premium] No URL returned. session.id:", session.id);
      return NextResponse.json({ error: "Payment setup error. Please try again." }, { status: 500 });
    }

    console.log("[checkout-premium] Session created. session.id:", session.id, "route:", `${origin as string} to ${destination as string}`);
    return NextResponse.json({ url: session.url });
  }

  // ── Student Move Pack (default) ─────────────────────────────────────────────
  const checkoutEnabled = process.env.STUDENT_PACK_CHECKOUT_ENABLED !== "false";
  if (!checkoutEnabled) {
    return NextResponse.json(
      { error: "Student Move Pack checkout is temporarily unavailable. Contact support@settlemap.app." },
      { status: 503 },
    );
  }

  const {
    buyerEmail,
    buyerName,
    role,
    moveRoute,
    otherRoute,
    departureMonth,
    concerns,
    consentPlanning,
    consentSensitive,
  } = body;

  const missing: string[] = [];
  if (!buyerEmail || typeof buyerEmail !== "string" || !isValidEmail(buyerEmail)) missing.push("buyerEmail");
  if (!buyerName || typeof buyerName !== "string" || !buyerName.trim()) missing.push("buyerName");
  if (!role || typeof role !== "string") missing.push("role");
  if (!moveRoute || typeof moveRoute !== "string") missing.push("moveRoute");
  if (moveRoute === "Other route" && (!otherRoute || typeof otherRoute !== "string" || !(otherRoute as string).trim()))
    missing.push("otherRoute");
  if (!departureMonth || typeof departureMonth !== "string") missing.push("departureMonth");
  if (!concerns || typeof concerns !== "string" || !concerns.trim()) missing.push("concerns");

  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
  }
  if (consentPlanning !== true || consentSensitive !== true) {
    return NextResponse.json({ error: "Both consent confirmations are required." }, { status: 400 });
  }

  const effectiveRoute =
    moveRoute === "Other route"
      ? ((otherRoute as string).trim() || "Other route")
      : (moveRoute as string);

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    console.error("[checkout] Stripe init failed:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json(
      { error: "Payment setup is temporarily unavailable. Please try again." },
      { status: 500 },
    );
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "sgd",
      customer_email: buyerEmail as string,
      line_items: [
        {
          price_data: {
            currency: "sgd",
            unit_amount: 1900,
            product_data: {
              name: "SettleMap Student Move Pack",
              description: `Route: ${effectiveRoute} · Departure: ${departureMonth as string}`,
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          settlemap_product: "student_move_pack",
          buyer_name: (buyerName as string).trim(),
          buyer_role: role as string,
          move_route: effectiveRoute,
          other_route: moveRoute === "Other route" ? (otherRoute as string).trim() : "",
          departure_month: departureMonth as string,
          concerns: (concerns as string).slice(0, 500),
          fulfilment_version: "V12.12",
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://settlemap.app"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://settlemap.app"}/payment-cancelled`,
    });
  } catch (err) {
    console.error("[checkout] Stripe session create failed:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json(
      { error: "Payment setup is temporarily unavailable. Please try again or contact support@settlemap.app." },
      { status: 500 },
    );
  }

  if (!session.url) {
    console.error("[checkout] Stripe session created but no URL returned. session.id:", session.id);
    return NextResponse.json({ error: "Payment setup error. Please try again." }, { status: 500 });
  }

  console.log("[checkout] Session created. session.id:", session.id, "route:", effectiveRoute);
  return NextResponse.json({ url: session.url });
}
