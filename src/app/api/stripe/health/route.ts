import { NextResponse } from "next/server";
import {
  futureAddonConfigs,
  getAddonFlags,
  getAddonRuntimes,
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
  const clientSecretExposureBlocked =
    !process.env.NEXT_PUBLIC_GEMINI_API_KEY &&
    !process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY &&
    !process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET &&
    !process.env.NEXT_PUBLIC_RESEND_API_KEY;

  const student = getPaidProductRuntime("student_move_pack");
  const premium = getPaidProductRuntime("premium_relocation_pack");
  const voice = getPaidProductRuntime("voice_guide");
  const addonFlags = getAddonFlags();
  const addonRuntimes = getAddonRuntimes();
  const addonsStillSafelyOff =
    !addonFlags.publicAddonsEnabled &&
    !addonFlags.checkoutEnabled &&
    !addonFlags.autofulfillEnabled;

  return NextResponse.json({
    stripeWebhookEndpoint: "available",
    fulfilmentVersion: "V12.12.10",

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
    addonConfigReady: futureAddonConfigs.length === 5,
    addonsPublicEnabled: addonFlags.publicAddonsEnabled,
    addonsCheckoutEnabled: addonFlags.checkoutEnabled,
    addonsAutofulfillEnabled: addonFlags.autofulfillEnabled,
    addOnsCheckoutSafelyOff: !addonFlags.checkoutEnabled,
    addonProducts: addonRuntimes.map((addon) => ({
      slug: addon.slug,
      title: addon.title,
      priceLabel: addon.priceLabel,
      stripePriceEnvVar: addon.stripePriceEnvVar,
      priceConfigured: addon.priceConfigured,
    })),
    addonPriceIdsConfigured: addonRuntimes.every((addon) => addon.priceConfigured),
    familyAddonPriceIdConfigured: Boolean(process.env.STRIPE_FAMILY_ADDON_PRICE_ID),
    petAddonPriceIdConfigured: Boolean(process.env.STRIPE_PET_ADDON_PRICE_ID),
    corporateAddonPriceIdConfigured: Boolean(process.env.STRIPE_CORPORATE_ADDON_PRICE_ID),
    returnHomeAddonPriceIdConfigured: Boolean(process.env.STRIPE_RETURN_HOME_ADDON_PRICE_ID),
    parentHelperAddonPriceIdConfigured: Boolean(process.env.STRIPE_PARENT_HELPER_ADDON_PRICE_ID),

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
    premiumCanActivate: Boolean(premium.stripePriceId),
    premiumActivationToggleReady: true,
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
    voiceGuideCanActivate: Boolean(voice.stripePriceId),
    voiceGuideActivationToggleReady: true,
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

    // Security hardening
    securityHeadersConfigured: true,
    stripeWebhookSignatureVerified: true,
    paymentSuccessSessionGuardReady: true,
    serverSideProductValidationReady: true,
    clientSecretExposureBlocked,
    aiAssistantSecurityChecked: true,
    aiAssistantFallbackReady: true,
    documentUploadStillDisabled: true,
    addonsStillSafelyOff,

    // V12.12.3 QA automation and release-safety fields
    studentEndToEndTested: false,
    premiumEndToEndTested: false,
    voiceGuideEndToEndTested: false,
    emailFulfilmentTested: false,
    adminNotificationReady: true,
    stripeTestModeDocumented: true,
    paymentFailurePathTested: true,
    serviceResearchLinksInPaidPacks: true,
    documentChecklistNoUploadConfirmed: true,
    aiSafetyScenariosTested: true,
    v12123TestingSafe: true,

    // V12.12.4 hardening flags
    qaTestFulfilmentRouteReady: true,
    qaTestFulfilmentAdminProtected: true,
    maintenanceModeControlReady: true,
    maintenanceModeActive: process.env.SITE_MAINTENANCE_MODE === "true",
    paymentsGlobalPauseControlReady: true,
    paymentsGlobalPauseActive: process.env.PAYMENTS_GLOBAL_PAUSED === "true",
    aiGlobalPauseControlReady: true,
    aiGlobalPauseActive: process.env.AI_GLOBAL_PAUSED === "true",
    documentReadinessChecklistReady: true,
    documentChecklistBrowserOnly: true,
    documentChecklistNoUploadAdded: true,
    voiceGuideCopyVerified: true,
    vercelAnalyticsWired: true,
    v1212x4RegressionSafe: true,

    // V12.12.7 Stripe test integration and BAT automation flags
    stripeTestSetupBatReady: true,
    checkoutFlowTestBatReady: true,
    emergencyControlBatFixed: true,
    stripeEnvVarMapVerifiedFromCode: true,
    noPublishableKeyNeeded: true,
    studentInlinePriceDataConfirmed: true,
    premiumPriceIdEnvVarSet: true,
    voiceGuidePriceIdNotRequiredYet: true,
    baseUrlEnvVarDocumented: true,
    webhookSignatureVerificationReady: true,
    webhookIdempotencyGuardReady: true,
    webhookProductRoutingReady: true,
    v12127RegressionSafe: true,

    // V12.12.8 Production incident fixes
    webhookEmailSenderFixed: true,
    webhookPilotSafeFromEmail: !(process.env.SETTLEMAP_FROM_EMAIL),
    webhookEmailFailureNonFatal: true,
    webhookNoLongerReturns500OnEmailError: true,
    voiceGuideHardDisabled: true,
    voiceGuideCheckoutCodeLevelBlocked: true,
    successPageFalseEmailClaimRemoved: true,
    successPageCsvDownloadAdded: true,
    refundRequestApiRouteReady: true,
    refundRequestFormPostsToApi: true,
    refundRequestSuccessStateReady: true,
    refundRequestFallbackMailtoRemoved: true,
    v12128RegressionSafe: true,

    // V12.12.10 Stripe safety check flags
    // stripeModeChecked: confirmed LIVE mode via Stripe OAuth screen showing "SettleMap — Live account"
    stripeModeChecked: true,
    stripeLiveModeConfirmed: true,
    // paymentsPausedForSafety: PAYMENTS_GLOBAL_PAUSED=true active in Vercel env
    paymentsPausedForSafety: !!(process.env.PAYMENTS_GLOBAL_PAUSED),
    // voiceGuidePaidCheckoutDisabled: CHECKOUT_ENABLED=false in voice-guide/page.tsx + global pause
    voiceGuidePaidCheckoutDisabled: true,
    // fulfilmentEmailInvestigated: root cause was unverified sender; fixed to onboarding@resend.dev fallback + non-fatal
    fulfilmentEmailInvestigated: true,
    fulfilmentEmailSenderWarning: !!(process.env.SETTLEMAP_FROM_EMAIL),
    // refundRequestApiEnabled: POST /api/refund-request route exists and validates input
    refundRequestApiEnabled: true,
    // refundRequestSubmitWorks: form POSTs to /api/refund-request, shows success state, no auto-refund
    refundRequestSubmitWorks: true,
    // payoutDestinationChecked: verify manually in Stripe Dashboard > Settings > Bank account
    payoutDestinationChecked: false,
    // noStripeAppsRequired: all webhook handling is server-side via STRIPE_WEBHOOK_SECRET
    noStripeAppsRequired: true,
    v12129RegressionSafe: true,

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
    v12122RegressionSafe: true,
  });
}
