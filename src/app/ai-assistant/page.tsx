import type { Metadata } from "next";
import { AiAssistantClient } from "./AiAssistantClient";

export const metadata: Metadata = {
  title: "AI Relocation Assistant",
  description: "Interactive demo of an AI assistant for practical relocation questions, checklists, reminders, and official source routing.",
};

export default function AiAssistantPage() {
  return <AiAssistantClient />;
}
