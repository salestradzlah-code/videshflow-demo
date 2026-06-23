// Lightweight, vendor-free event tracking placeholder.
//
// This does NOT call any external analytics provider and does NOT store or
// transmit personal data. It is a safe hook point so that a real analytics
// vendor (or first-party logging) can be wired in later without touching
// call sites across the app. If nothing is wired up, calling trackEvent is
// a no-op aside from a console.debug line in development.

export type SettleMapEvent =
  | "route_started"
  | "project_plan_created"
  | "tenant_bio_copied"
  | "action_link_clicked"
  | "early_access_clicked"
  | "paid_plan_interest_clicked"
  | "concierge_interest_clicked"
  | "partner_interest_clicked";

export type SettleMapEventProps = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(event: SettleMapEvent, props?: SettleMapEventProps): void {
  if (typeof window === "undefined") return;

  try {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("[settlemap:event]", event, props ?? {});
    }

    // Placeholder hook point for a future analytics vendor or first-party
    // logging endpoint. Intentionally not implemented yet — no external
    // network call is made here.
  } catch {
    // Tracking must never break the product experience.
  }
}
