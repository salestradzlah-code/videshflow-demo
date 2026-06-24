import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const stripeConfigured = !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET;
  const resendConfigured = !!process.env.RESEND_API_KEY;
  const adminTokenConfigured = !!process.env.SETTLEMAP_ADMIN_TOKEN;
  const checkoutEnabled = process.env.STUDENT_PACK_CHECKOUT_ENABLED !== "false";
  const autofulfillEnabled = process.env.STUDENT_PACK_AUTOFULFILL_ENABLED !== "false";
  const paymentsEnabled = process.env.NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED !== "false";

  return NextResponse.json({
    stripeWebhookEndpoint: "available",
    paymentsEnabled,
    checkoutEnabled,
    autofulfillEnabled,
    stripeConfigured,
    resendConfigured,
    adminTokenConfigured,
    fulfilmentVersion: "V12.10",
    studentPackGeneratorReady: true,
    sessionLookupReady: true,
    resendEndpointReady: adminTokenConfigured,
  });
}
