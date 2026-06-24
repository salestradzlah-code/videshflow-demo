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
  // 1. Feature flag checks
  const checkoutEnabled = process.env.STUDENT_PACK_CHECKOUT_ENABLED !== "false";
  if (!checkoutEnabled) {
    return NextResponse.json(
      { error: "Student Move Pack checkout is temporarily unavailable. Contact support@settlemap.app." },
      { status: 503 },
    );
  }

  // 2. Parse body
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
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

  // 3. Validate required fields
  const missing: string[] = [];
  if (!buyerEmail || typeof buyerEmail !== "string" || !isValidEmail(buyerEmail))
    missing.push("buyerEmail");
  if (!buyerName || typeof buyerName !== "string" || !buyerName.trim())
    missing.push("buyerName");
  if (!role || typeof role !== "string")
    missing.push("role");
  if (!moveRoute || typeof moveRoute !== "string")
    missing.push("moveRoute");
  if (moveRoute === "Other route" && (!otherRoute || typeof otherRoute !== "string" || !(otherRoute as string).trim()))
    missing.push("otherRoute");
  if (!departureMonth || typeof departureMonth !== "string")
    missing.push("departureMonth");
  if (!concerns || typeof concerns !== "string" || !concerns.trim())
    missing.push("concerns");

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  // 4. Validate consent
  if (consentPlanning !== true || consentSensitive !== true) {
    return NextResponse.json(
      { error: "Both consent confirmations are required." },
      { status: 400 },
    );
  }

  // 5. Resolve effective route label
  const effectiveRoute =
    moveRoute === "Other route"
      ? ((otherRoute as string).trim() || "Other route")
      : (moveRoute as string);

  // 6. Init Stripe
  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    console.error(
      "[checkout] Stripe init failed:",
      err instanceof Error ? err.message : "unknown",
    );
    return NextResponse.json(
      { error: "Payment setup is temporarily unavailable. Please try again." },
      { status: 500 },
    );
  }

  // 7. Create Checkout Session
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
          concerns: (concerns as string).slice(0, 500), // Stripe metadata 500 char limit per key
          fulfilment_version: "V12.9",
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://settlemap.app"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://settlemap.app"}/payment-cancelled`,
    });
  } catch (err) {
    console.error(
      "[checkout] Stripe session create failed:",
      err instanceof Error ? err.message : "unknown",
    );
    return NextResponse.json(
      { error: "Payment setup is temporarily unavailable. Please try again or contact support@settlemap.app." },
      { status: 500 },
    );
  }

  if (!session.url) {
    console.error("[checkout] Stripe session created but no URL returned. session.id:", session.id);
    return NextResponse.json(
      { error: "Payment setup error. Please try again." },
      { status: 500 },
    );
  }

  console.log("[checkout] Session created. session.id:", session.id, "route:", effectiveRoute);

  return NextResponse.json({ url: session.url });
}
