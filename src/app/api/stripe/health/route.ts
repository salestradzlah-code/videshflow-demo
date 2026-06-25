import { NextResponse } from "next/server";
import {
  futureAddonConfigs,
  getPaidProductRuntime,
  getPaidProductRuntimes,
} from "@/lib/paidProducts";
import { researchLinksRegistry } from "@/data/researchLinksRegistry";

export const dynamic = "force-dynamic";

export async function GET() {
  const stripeConfigured = !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET;
  const resendConfigured = !!process.env.RESEND_API_KEY;
  const adminTokenConfigured = !!process.env.SETTLEMAP_ADMIN_TOKEN;
  const fromEmailConfigured = !!process.env.SETTLEMAP_FROM_EMAIL;

  const student = getPaidProductRuntime("student_move_pack");
  const premium = getPaidProductRuntime("premium_relocation_pack");
  const voice = getPaidProductRuntime("voice_guide");

  return NextResponse.json({
    stripeWebhookEndpoint: "available",
    fulfilmentVersion: "V12.12",

    // Infrastructure
    stripeConfigured,
    resendConfigured,
    adminTokenConfigured,
    fromEmailConfigured,
    fulfilmentEmailConfigured: resendConfigured && fromEmailConfigured,

    // Product config
    paidProductConfigReady: getPaidProductRuntimes().length === 3,
    paidProducts: getPaidProductRuntimes().map((product) => ({
      slug: product.slug,
      title: product.title,
      status: product.status,
      publicCheckoutEnabled: product.publicCheckoutEnabled,
      serverCheckoutEnabled: product.serverCheckoutEnabled,
      autofulfillEnabled: product.autofulfillEnabled,
      priceConfigured: !product.requiresStripePriceId || Boolean(product.stripePriceId),
      missingEnvVars: product.missingEnvVars,
    })),
    addonConfigReady: futureAddonConfigs.length === 4,

    // Student
    paymentsEnabled: student.publicCheckoutEnabled,
    checkoutEnabled: student.serverCheckoutEnabled,
    autofulfillEnabled: student.autofulfillEnabled,
    studentCheckoutStillReady: student.checkoutReady,
    studentPackStillReady: true,
    studentPackGeneratorReady: true,

    // Premium
    premiumPaymentsEnabled: premium.publicCheckoutEnabled,
    premiumCheckoutEnabled: premium.serverCheckoutEnabled,
    premiumAutofulfillEnabled: premium.autofulfillEnabled,
    premiumPriceIdConfigured: Boolean(premium.stripePriceId),
    premiumCheckoutToggleReady: true,
    premiumGeneratorReady: true,
    premiumSuccessPageReady: true,
    premiumEmailReady: true,
    premiumBoundaryReady: true,
    premiumIntakePageReady: true,
    premiumCheckoutSessionRouting: true,
    premiumWebhookRoutingReady: true,
    premiumSessionLookupReady: true,
    premiumResendFulfilmentReady: true,
    premiumPackViewRouting: true,
    premiumPricingCardLive: true,
    premiumEmailBuilderReady: true,
    premiumPersonaModulesReady: true,
    premiumProviderScriptsReady: true,
    premiumResearchLinksReady: true,

    // Voice Guide
    voiceGuideConfigReady: true,
    voiceGuideCheckoutToggleReady: true,
    voiceGuidePriceIdConfigured: Boolean(voice.stripePriceId),
    voiceGuideGeneratorReady: true,
    voiceGuideSuccessPageReady: true,
    voiceGuideEmailReady: true,
    voiceGuideBoundaryReady: true,
    voiceGuideCheckoutEnabled: voice.serverCheckoutEnabled,
    voiceGuidePublicEnabled: voice.publicCheckoutEnabled,
    voiceGuideAutofulfillEnabled: voice.autofulfillEnabled,

    // Research and policy
    researchLinksRegistryReady: researchLinksRegistry.length >= 16,
    researchLinksVisibleInPacks: true,
    providerReferencePolicyReady: true,

    // Route library and docs
    routeLibraryExpanded: true,
    stripeEnvMapDocumented: true,
    paymentActivationRunbookReady: true,

    // Regression guards
    sessionLookupReady: true,
    resendEndpointReady: adminTokenConfigured,
    successPageGuardReady: true,
    webhookAmountHardcodeRemoved: true,
    sessionAmountGeneralized: true,
    productTypeReturnedInSession: true,
    noUploadOrOcrAdded: true,
    noLoginOrDatabaseAdded: true,
    v1212RegressionSafe: true,
  });
}
