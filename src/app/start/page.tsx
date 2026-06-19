import type { Metadata } from "next";
import { ExecutiveDemoHome } from "@/components/demo/ExecutiveDemoHome";

export const metadata: Metadata = {
  title: "Plan Your Global Relocation Route",
  description: "Choose moving from, moving to, move reason, and family profile to get a SettleMap route plan.",
};

export default function StartPage() {
  return <ExecutiveDemoHome />;
}
