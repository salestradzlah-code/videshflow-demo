import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_URL, BETA_NOTE } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  title: {
    default: `${SITE_NAME} | Map your move. Settle with confidence.`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Real relocation stories, practical checklists, official links, and first 7, 30, and 90 day guidance for people and families planning relocation across countries, cities, and life stages.",
  openGraph: {
    title: `${SITE_NAME} | Map your move. Settle with confidence.`,
    description:
      "Experience-backed relocation playbooks for people, families, students, professionals, retirees, and pet owners moving across countries, cities, and life stages.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-zinc-50 text-zinc-900">
        <Header />
        <div className="bg-emerald-50 px-4 py-2 text-center text-xs font-semibold text-emerald-800 sm:px-6 lg:px-8">
          {BETA_NOTE}
        </div>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
