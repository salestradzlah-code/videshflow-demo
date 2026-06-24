import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "AI Planning Assistant",
  description: "Build a route-aware relocation checklist and use SettleMap's limited AI planning assistant pilot.",
};

export default function AiAssistantPage() {
  redirect("/start");
}
