import type { Metadata } from "next";
import { StartPathClient } from "./StartPathClient";

export const metadata: Metadata = {
  title: "Start Your Relocation Path",
  description: "Choose destination, move reason, and family profile to get the right VideshFlow relocation path.",
};

export default function StartPage() {
  return <StartPathClient />;
}
