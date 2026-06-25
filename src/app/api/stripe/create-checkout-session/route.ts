import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  getCheckoutBlockedMessage,
  getPaidProductRuntime,
  type PaidProductSlug,
} from "@/lib/paidProducts";

export const dynamic = "force-dynamic";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Stripe(key, { apiVersion: "2024-11-20.acacia" as any });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function textField(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
}

function booleanField(body: Record<string, unknown>, key: string): boolean {
  return body[key] === true;
}

function productSlug(body: Record<string, unknown>): PaidProductSlug | null {
  const value = body.productType;
  if (value === undefined || value === null || value === "") {
    return "student_move_pack";
  }
  if (
    value === "premium_relocation_pack" ||
    value === "voice_guide" ||
    value === "student_move_pack"
  ) {
    return value;
  }

  return null;
}

function missingFields(fields: Record<string, boolean>): string[] {
  return Object.entries(fields)
    .filter(([, valid]) => !valid)
    .map(([field]) => field);
}

function baseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "https://settlemap.app";
}

function stripeMetadata(values: Record<string, string | null | undefined>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      String(value ?? "").slice(0, 500),
    ]),
  );
}

async function createPricedCheckoutSession(params: {
  stripe: Stripe;
  productSlug: PaidProductSlug;
  title: string;
  stripePriceId: string;
  buyerEmail: string;
  metadata: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  return params.stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: params.buyerEmail,
    line_items: [{ price: params.stripePriceId, quantity: 1 }],
    payment_intent_data: {
      metadata: params.metadata,
    },
    success_url: `${baseUrl()}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl()}/payment-cancelled`,
  });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const slug = productSlug(body);
  if (!slug) {
    return NextResponse.json({ error: "Invalid product type." }, { status: 400 });
  }
  const runtime = getPaidProductRuntime(slug);

  if (!runtime.checkoutReady) {
    return NextResponse.json(
      { error: getCheckoutBlockedMessage(runtime), missingEnvVars: runtime.missingEnvVars },
      { status: 503 },
    );
  }

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

  if (slug === "premium_relocation_pack") {
    const buyerEmail = textField(body, "buyerEmail");
    const buyerName = textField(body, "buyerName");
    const origin = textField(body, "origin");
    const destination = textField(body, "destination");
    const moveReason = textField(body, "moveReason");
    const whoIsMoving = textField(body, "whoIsMoving");
    const timingMonth = textField(body, "timingMonth");
    const modules = textField(body, "modules");
    const concerns = textField(body, "concerns");

    const missing = missingFields({
      buyerEmail: isValidEmail(buyerEmail),
      buyerName: Boolean(buyerName),
      origin: Boolean(origin),
      destination: Boolean(destination),
      moveReason: Boolean(moveReason),
      whoIsMoving: Boolean(whoIsMoving),
      timingMonth: Boolean(timingMonth),
      concerns: Boolean(concerns),
    });

    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
    }
    if (!booleanField(body, "consentPlanning") || !booleanField(body, "consentSensitive")) {
      return NextResponse.json({ error: "Both consent confirmations are required." }, { status: 400 });
    }
    if (!runtime.stripePriceId) {
      return NextResponse.json(
        { error: getCheckoutBlockedMessage(runtime), missingEnvVars: runtime.missingEnvVars },
        { status: 503 },
      );
    }

    try {
      const session = await createPricedCheckoutSession({
        stripe,
        productSlug: slug,
        title: runtime.title,
        stripePriceId: runtime.stripePriceId,
        buyerEmail,
        metadata: stripeMetadata({
          settlemap_product: "premium_relocation_pack",
          productType: "premium_relocation_pack",
          packType: "premium_relocation_pack",
          routeSummary: `${origin} to ${destination}`,
          userEmail: buyerEmail,
          userName: buyerName,
          buyer_name: buyerName,
          origin,
          destination,
          move_reason: moveReason,
          who_is_moving: whoIsMoving,
          timing_month: timingMonth,
          modules,
          concerns,
          fulfilment_version: "V12.12.2",
        }),
      });

      if (!session.url) {
        console.error("[checkout-premium] No URL returned. session.id:", session.id);
        return NextResponse.json({ error: "Payment setup error. Please try again." }, { status: 500 });
      }

      console.log("[checkout-premium] Session created. session.id:", session.id, "route:", `${origin} to ${destination}`);
      return NextResponse.json({ url: session.url });
    } catch (err) {
      console.error("[checkout-premium] Stripe session create failed:", err instanceof Error ? err.message : "unknown");
      return NextResponse.json(
        { error: "Payment setup is temporarily unavailable. Please try again or contact support@settlemap.app." },
        { status: 500 },
      );
    }
  }

  if (slug === "voice_guide") {
    const buyerEmail = textField(body, "buyerEmail");
    const buyerName = textField(body, "buyerName");
    const origin = textField(body, "origin");
    const destination = textField(body, "destination");
    const moveReason = textField(body, "moveReason");
    const whoIsMoving = textField(body, "whoIsMoving");
    const timingMonth = textField(body, "timingMonth");
    const concerns = textField(body, "concerns");

    const missing = missingFields({
      buyerEmail: isValidEmail(buyerEmail),
      buyerName: Boolean(buyerName),
      origin: Boolean(origin),
      destination: Boolean(destination),
      moveReason: Boolean(moveReason),
      whoIsMoving: Boolean(whoIsMoving),
      timingMonth: Boolean(timingMonth),
    });

    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
    }
    if (!booleanField(body, "consentPlanning") || !booleanField(body, "consentSensitive")) {
      return NextResponse.json({ error: "Both consent confirmations are required." }, { status: 400 });
    }
    if (!runtime.stripePriceId) {
      return NextResponse.json(
        { error: getCheckoutBlockedMessage(runtime), missingEnvVars: runtime.missingEnvVars },
        { status: 503 },
      );
    }

    try {
      const session = await createPricedCheckoutSession({
        stripe,
        productSlug: slug,
        title: runtime.title,
        stripePriceId: runtime.stripePriceId,
        buyerEmail,
        metadata: stripeMetadata({
          settlemap_product: "voice_guide",
          productType: "voice_guide",
          packType: "voice_guide",
          routeSummary: `${origin} to ${destination}`,
          userEmail: buyerEmail,
          userName: buyerName,
          buyer_name: buyerName,
          origin,
          destination,
          move_reason: moveReason,
          who_is_moving: whoIsMoving,
          timing_month: timingMonth,
          concerns,
          fulfilment_version: "V12.12.2",
        }),
      });

      if (!session.url) {
        console.error("[checkout-voice] No URL returned. session.id:", session.id);
        return NextResponse.json({ error: "Payment setup error. Please try again." }, { status: 500 });
      }

      console.log("[checkout-voice] Session created. session.id:", session.id, "route:", `${origin} to ${destination}`);
      return NextResponse.json({ url: session.url });
    } catch (err) {
      console.error("[checkout-voice] Stripe session create failed:", err instanceof Error ? err.message : "unknown");
      return NextResponse.json(
        { error: "Payment setup is temporarily unavailable. Please try again or contact support@settlemap.app." },
        { status: 500 },
      );
    }
  }

  const buyerEmail = textField(body, "buyerEmail");
  const buyerName = textField(body, "buyerName");
  const role = textField(body, "role");
  const moveRoute = textField(body, "moveRoute");
  const otherRoute = textField(body, "otherRoute");
  const departureMonth = textField(body, "departureMonth");
  const concerns = textField(body, "concerns");

  const missing = missingFields({
    buyerEmail: isValidEmail(buyerEmail),
    buyerName: Boolean(buyerName),
    role: Boolean(role),
    moveRoute: Boolean(moveRoute),
    otherRoute: moveRoute !== "Other route" || Boolean(otherRoute),
    departureMonth: Boolean(departureMonth),
    concerns: Boolean(concerns),
  });

  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
  }
  if (!booleanField(body, "consentPlanning") || !booleanField(body, "consentSensitive")) {
    return NextResponse.json({ error: "Both consent confirmations are required." }, { status: 400 });
  }

  const effectiveRoute = moveRoute === "Other route" ? otherRoute || "Other route" : moveRoute;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: buyerEmail,
      line_items: [
        {
          price_data: {
            currency: "sgd",
            unit_amount: runtime.amountCents,
            product_data: {
              name: "SettleMap Student Move Pack",
              description: `Route: ${effectiveRoute} · Departure: ${departureMonth}`,
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: stripeMetadata({
          settlemap_product: "student_move_pack",
          productType: "student_move_pack",
          packType: "student_move_pack",
          routeSummary: effectiveRoute,
          userEmail: buyerEmail,
          userName: buyerName,
          buyer_name: buyerName,
          buyer_role: role,
          move_route: effectiveRoute,
          other_route: moveRoute === "Other route" ? otherRoute : "",
          departure_month: departureMonth,
          concerns,
          fulfilment_version: "V12.12.2",
        }),
      },
      success_url: `${baseUrl()}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl()}/payment-cancelled`,
    });

    if (!session.url) {
      console.error("[checkout] Stripe session created but no URL returned. session.id:", session.id);
      return NextResponse.json({ error: "Payment setup error. Please try again." }, { status: 500 });
    }

    console.log("[checkout] Session created. session.id:", session.id, "route:", effectiveRoute);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Stripe session create failed:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json(
      { error: "Payment setup is temporarily unavailable. Please try again or contact support@settlemap.app." },
      { status: 500 },
    );
  }
}
