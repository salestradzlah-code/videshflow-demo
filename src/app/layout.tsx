import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Practical Relocation Starter Kits for Indians`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Real relocation stories, practical checklists, official links, and first 7, 30, and 90 day guidance for Indians moving abroad.",
  openGraph: {
    title: `${SITE_NAME} | Practical Relocation Starter Kits for Indians`,
    description:
      "Experience-backed country playbooks for Indian professionals and families moving abroad.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
