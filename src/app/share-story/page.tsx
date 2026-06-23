import type { Metadata } from "next";
import { ShareStoryClient } from "./ShareStoryClient";

export const metadata: Metadata = {
  title: "Feedback Request",
  description: "Share your relocation experience to help shape SettleMap. Copyable feedback questions for early access feedback.",
};

export default function ShareStoryPage() {
  return <ShareStoryClient />;
}
