/**
 * emailReadiness.ts — Central email sender readiness helper
 *
 * V12.12.14: Single source of truth for all email sender flags.
 * Used by health endpoint, webhook, refund-request, resend-fulfilment, and qa-test-fulfilment.
 *
 * SETTLEMAP_FROM_EMAIL format accepted by Resend:
 *   "SettleMap <noreply@settlemap.app>"   ← display name + angle-bracket email
 *   "noreply@settlemap.app"               ← bare email also accepted
 *
 * Domain verification logic:
 *   1. Explicit flag: SETTLEMAP_RESEND_DOMAIN_VERIFIED=true (added to Vercel after dashboard verification)
 *   2. Fallback derivation: if sender domain === "settlemap.app" and SETTLEMAP_FROM_EMAIL is set,
 *      we treat it as verified because the operator confirmed verification in Resend dashboard.
 *   Both conditions are or'd — either alone is sufficient.
 */

const VERIFIED_DOMAIN = "settlemap.app";

/**
 * Parse the raw SETTLEMAP_FROM_EMAIL value into its components.
 * Handles "Display Name <email@domain.com>" and bare "email@domain.com".
 */
function parseFromEmail(raw: string): { address: string; domain: string } {
  const angleMatch = raw.match(/<([^>]+)>/);
  const address = angleMatch ? angleMatch[1].trim() : raw.trim();
  const atIdx = address.lastIndexOf("@");
  const domain = atIdx >= 0 ? address.slice(atIdx + 1).toLowerCase() : "";
  return { address, domain };
}

/**
 * getEmailReadiness — derive all email sender flags from env vars.
 * Call once per request; all values are read fresh from process.env.
 */
export function getEmailReadiness() {
  const rawFromEmail = process.env.SETTLEMAP_FROM_EMAIL ?? "";
  const fromEmailConfigured = rawFromEmail.length > 0;

  const { address: fromEmailAddress, domain: fromEmailDomain } = fromEmailConfigured
    ? parseFromEmail(rawFromEmail)
    : { address: "", domain: "" };

  // Explicit verification flag set by operator after Resend dashboard confirmation
  const explicitVerified = process.env.SETTLEMAP_RESEND_DOMAIN_VERIFIED === "true";

  // Derived: sender domain matches verified domain and a custom sender is configured
  const domainMatchesVerified = fromEmailConfigured && fromEmailDomain === VERIFIED_DOMAIN;

  // Domain is considered verified if either the explicit flag is set OR the domain matches
  const resendDomainVerified = explicitVerified || domainMatchesVerified;

  // Sender is fully ready when: configured + domain verified
  const resendVerifiedSenderConfigured = fromEmailConfigured && resendDomainVerified;
  const settlemapFromEmailUsesVerifiedDomain = domainMatchesVerified;

  // Derived warning/readiness flags
  const fulfilmentEmailSenderWarning = !resendVerifiedSenderConfigured;
  const webhookPilotSafeFromEmail = resendVerifiedSenderConfigured;
  const refundRequestEmailWarning = !resendVerifiedSenderConfigured;
  const refundRequestEmailReady = resendVerifiedSenderConfigured;
  const fulfilmentEmailReadyForPilot = resendVerifiedSenderConfigured;
  const emailSenderWarningCleared = resendVerifiedSenderConfigured;

  // The from-email value to use when sending (safe for all routes)
  // Falls back to onboarding@resend.dev only when no custom sender is configured
  const fromEmail = fromEmailConfigured ? rawFromEmail : "onboarding@resend.dev";
  const usingFallbackSender = !fromEmailConfigured;

  return {
    // Config
    fromEmailConfigured,
    fromEmailAddress,
    fromEmailDomain,

    // Verification
    resendDomainVerified,
    settlemapFromEmailUsesVerifiedDomain,
    resendVerifiedSenderConfigured,
    resendDomainVerificationSource: explicitVerified
      ? "SETTLEMAP_RESEND_DOMAIN_VERIFIED=true"
      : domainMatchesVerified
        ? "domain-match:settlemap.app"
        : "unverified",

    // Derived flags
    fulfilmentEmailSenderWarning,
    webhookPilotSafeFromEmail,
    refundRequestEmailWarning,
    refundRequestEmailReady,
    fulfilmentEmailReadyForPilot,
    emailSenderWarningCleared,

    // Sender value for use in Resend calls
    fromEmail,
    usingFallbackSender,
  };
}

export type EmailReadiness = ReturnType<typeof getEmailReadiness>;
