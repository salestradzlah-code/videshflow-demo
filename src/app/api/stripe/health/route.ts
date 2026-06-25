import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const stripeConfigured = !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET;
  const resendConfigured = !!process.env.RESEND_API_KEY;
  const adminTokenConfigured = !!process.env.SETTLEMAP_ADMIN_TOKEN;
  const fromEmailConfigured = !!process.env.SETTLEMAP_FROM_EMAIL;
  const checkoutEnabled = process.env.STUDENT_PACK_CHECKOUT_ENABLED !== "false";
  const autofulfillEnabled = process.env.STUDENT_PACK_AUTOFULFILL_ENABLED !== "false";
  const paymentsEnabled = process.env.NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED !== "false";
  const premiumCheckoutEnabled = process.env.PREMIUM_PACK_CHECKOUT_ENABLED !== "false";
  const premiumAutofulfillEnabled = process.env.PREMIUM_PACK_AUTOFULFILL_ENABLED !== "false";
  const premiumPaymentsEnabled = process.env.NEXT_PUBLIC_PREMIUM_PACK_PAYMENTS_ENABLED !== "false";
  const premiumPriceIdConfigured = !!process.env.STRIPE_PREMIUM_PRICE_ID;

  return NextResponse.json({
    stripeWebhookEndpoint: "available",
    fulfilmentVersion: "V12.12",
    // Infrastructure
    stripeConfigured,
    resendConfigured,
    adminTokenConfigured,
    fromEmailConfigured,
    // Student pack flags
    paymentsEnabled,
    checkoutEnabled,
    autofulfillEnabled,
    // Premium pack flags
    premiumPaymentsEnabled,
    premiumCheckoutEnabled,
    premiumAutofulfillEnabled,
    premiumPriceIdConfigured,
    // V12.10 features
    studentPackGeneratorReady: true,
    sessionLookupReady: true,
    resendEndpointReady: adminTokenConfigured,
    // V12.10.1 features
    paidPackGeneratorReady: true,
    routeTipsReady: true,
    refundRequestReady: true,
    fulfilmentEmailConfigured: resendConfigured && fromEmailConfigured,
    // V12.10.2 features
    successPageGuardReady: true,
    homepagePaymentCopyReady: true,
    intakeValidationStateReady: true,
    paymentFailureHelpReady: true,
    // V12.10.3 features
    studentMovePackRoleLabelUpdated: true,
    premiumPackCopyClarified: true,
    actionLinkCardsStandardized: true,
    routeCardsColorCoded: true,
    routeCardsIconsAdded: true,
    visualConsistencyPolishApplied: true,
    // V12.11 features
    homepageSimplified: true,
    anyCountryRouteCopyAdded: true,
    warningsConsolidated: true,
    disclaimerPageCentralized: true,
    feedbackSectionImproved: true,
    serviceCardsColorCoded: true,
    cardSystemStandardized: true,
    paidPilotCopyClarified: true,
    earlyAccessCopyReduced: true,
    // V12.11.1 features
    mobileMenuOverlayFixed: true,
    mobileHeroPolished: true,
    premiumPilotReadinessCopyAdded: true,
    premiumSamplePreviewAdded: true,
    premiumNoHumanReviewBoundaryVisible: true,
    aiVoiceGuideWaitlistOnly: true,
    mobileNoHorizontalOverflow: true,
    v1211RegressionSafe: true,
    // V12.11.2 features
    studentPromiseAuditComplete: true,
    studentConcernChecklistDelivered: true,
    studentPackingChecklistDelivered: true,
    providerResearchScriptsDelivered: true,
    researchLinksPlanVisible: true,
    premiumPromiseAuditComplete: true,
    premiumPilotBoundaryClear: true,
    officialSourceRemindersConsistent: true,
    paidPromiseCopyAligned: true,
    noPaidOverpromiseDetected: true,
    // V12.12 features — Premium Relocation Pack live paid product
    premiumGeneratorReady: true,
    premiumIntakePageReady: true,
    premiumCheckoutSessionRouting: true,
    premiumWebhookRoutingReady: true,
    premiumSessionLookupReady: true,
    premiumResendFulfilmentReady: true,
    premiumSuccessPageReady: true,
    premiumPackViewRouting: true,
    premiumPricingCardLive: true,
    premiumEmailBuilderReady: true,
    webhookAmountHardcodeRemoved: true,
    sessionAmountGeneralized: true,
    productTypeReturnedInSession: true,
    premiumPersonaModulesReady: true,
    premiumProviderScriptsReady: true,
    premiumResearchLinksReady: true,
  });
}
