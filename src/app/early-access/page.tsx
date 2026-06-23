import type { Metadata } from "next";
import { EarlyAccessClient } from "@/app/early-access/EarlyAccessClient";

export const metadata: Metadata = {
  title: "SettleMap early access",
  description: "Tell us about your route and what you would pay for so SettleMap can prioritise what to build next.",
};

export default function EarlyAccessPage() {
  return <EarlyAccessClient />;
}
