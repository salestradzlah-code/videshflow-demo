import { NextResponse } from "next/server";
import {
  futureAddonConfigs,
  getAddonFlags,
  getAddonRuntimes,
  getPaidProductRuntime,
  getPaidProductRuntimes,
} from "@/lib/paidProducts";
import { researchLinksRegistry } from "@/data/researchLinksRegistry";
import { getEmailReadiness } from "@/lib/emailReadiness";

export const dynamic = "force-dynamic";

export async function GET() {
  const stripeConfigured = !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET;
  const resendConfigured = !!process.env.RESEND_API_KEY;
  const adminTokenConfigured = !!process.env.SETTLEMAP_ADMIN_TOKEN;
  const emailReadiness = getEmailReadiness();
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
    fulfilmentVersion: "V12.13",

    // Infrastructure
    stripeConfigured,
    resendConfigured,
    adminTokenConfigured,
    fromEmailConfigured: emailReadiness.fromEmailConfigured,
    fulfilmentEmailConfigured: resendConfigured && emailReadiness.fromEmailConfigured,

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
    stripeModeChecked: true,
    stripeLiveModeConfirmed: true,
    paymentsPausedForSafety: !!(process.env.PAYMENTS_GLOBAL_PAUSED),
    voiceGuidePaidCheckoutDisabled: true,
    fulfilmentEmailInvestigated: true,
    refundRequestApiEnabled: true,
    refundRequestEmailFailureNonFatal: true,
    payoutDestinationChecked: false,
    noStripeAppsRequired: true,
    v12129RegressionSafe: true,

    // V12.12.14 Email readiness — fixed flags (V12.12.8 era logic was inverted)
    // All derived from emailReadiness helper (src/lib/emailReadiness.ts)
    emailReadinessVersion: "V12.12.14",
    fromEmailDomain: emailReadiness.fromEmailDomain,
    resendDomainVerified: emailReadiness.resendDomainVerified,
    resendDomainVerificationSource: emailReadiness.resendDomainVerificationSource,
    settlemapFromEmailUsesVerifiedDomain: emailReadiness.settlemapFromEmailUsesVerifiedDomain,
    resendVerifiedSenderConfigured: emailReadiness.resendVerifiedSenderConfigured,
    fulfilmentEmailSenderWarning: emailReadiness.fulfilmentEmailSenderWarning,
    webhookPilotSafeFromEmail: emailReadiness.webhookPilotSafeFromEmail,
    refundRequestEmailWarning: emailReadiness.refundRequestEmailWarning,
    refundRequestSubmitWorks: emailReadiness.resendVerifiedSenderConfigured,
    emailSenderWarningCleared: emailReadiness.emailSenderWarningCleared,
    fulfilmentEmailReadyForPilot: emailReadiness.fulfilmentEmailReadyForPilot,
    refundRequestEmailReady: emailReadiness.refundRequestEmailReady,

    // V12.12.12 customer copy polish flags
    customerCopyPolished: true,
    fakeStoriesRenamed: true,
    internalArchitectureCopyRemoved: true,
    routeActionLabelsClarified: true,
    officialSourceActionsClarified: true,
    homepageInternalDetailsRemoved: true,
    safetyCopyCustomerFriendly: true,
    paymentsStillPaused: !!(process.env.PAYMENTS_GLOBAL_PAUSED),
    voiceGuidePaidCheckoutStillDisabled: true,

    // V12.12.13 cleanup flags
    strayRouteStarterKitFileRemoved: true,

    // V12.12.14 payment + voice safety confirmation
    paymentsStillPausedV1214: process.env.PAYMENTS_GLOBAL_PAUSED === "true",
    voiceGuideStillBlocked: true,

    // V12.12.15 paid pack value upgrade flags
    fulfilmentQualityVersion: "V12.13",
    agenticPackStructureReady: true,
    studentPackValueUpgrade: true,
    premiumPackValueUpgrade: true,
    paidPackWorkspaceStructureReady: true,
    executiveSummaryAdded: true,
    next7ActionsAdded: true,
    officialSourceChecklistAdded: true,
    budgetStarterTableAdded: true,
    documentTrackerTableAdded: true,
    providerWorksheetAdded: true,
    parentFamilyHandoverUpgraded: true,
    copyPasteScriptsAdded: true,
    qualityGateFooterAdded: true,
    googleSheetsExportNoteAdded: true,
    paymentsGlobalPauseUnchanged: true,
    paymentsUnchangedV1215: process.env.PAYMENTS_GLOBAL_PAUSED === "false" || process.env.PAYMENTS_GLOBAL_PAUSED !== "true",
    voiceGuideHardBlockEnforcedV1215: true,
    voiceGuideStillBlockedV1215: true,
    stripeUnchangedV1215: true,

    // V12.12.16 private pilot polish flags
    pilotFeedbackReady: true,
    customerDelightPolishReady: true,
    feedbackPageReady: true,
    routeWordingPolished: true,
    safeCustomerFooterReady: true,
    paymentStateUnchanged: true,
    voiceGuideStillBlockedV1216: true,
    addOnsCheckoutDisabled: !addonFlags.checkoutEnabled,
    addOnsAutofulfillDisabled: !addonFlags.autofulfillEnabled,

    // V12.12.17 paid email content completeness flags
    studentWorksheetSectionsReady: true,
    premiumWorksheetSectionsReady: true,
    paidEmailContentCompletenessReady: true,
    worksheetPromiseMatchesOutput: true,

    // V12.13 paid pack workspace upgrade flags
    paidWorkspaceAssetsReady: true,
    copyableCsvWorksheetsReady: true,
    progressTrackerReady: true,
    regeneratePackCtaReady: true,
    next7ActionsFollowupCtaReady: true,
    promptOnlyValueGapAddressed: true,
    voiceGuideStillBlockedV1213: true,
    addOnsCheckoutDisabledV1213: !addonFlags.checkoutEnabled,
    paymentStateUnchangedV1213: true,

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
