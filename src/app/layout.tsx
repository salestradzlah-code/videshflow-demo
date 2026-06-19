import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Move from anywhere to home`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Real relocation stories, practical checklists, official links, and first 7, 30, and 90 day guidance for people and families planning relocation across countries, cities, and life stages.",
  openGraph: {
    title: `${SITE_NAME} | Move from anywhere to home`,
    description:
      "Experience-backed relocation playbooks for people, families, students, professionals, retirees, and pet owners moving across countries, cities, and life stages.",
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
