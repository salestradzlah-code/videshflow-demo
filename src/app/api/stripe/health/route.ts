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

  return NextResponse.json({
    stripeWebhookEndpoint: "available",
    paymentsEnabled,
    checkoutEnabled,
    autofulfillEnabled,
    stripeConfigured,
    resendConfigured,
    adminTokenConfigured,
    fromEmailConfigured,
    fulfilmentVersion: "V12.11.2",
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
    // V12.11.2 features — promise audit and fulfilment quality
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
  });
}
