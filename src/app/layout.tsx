import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_URL, BETA_NOTE } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// V11.7 Part 5 — homepage title already matched the required SEO spec; description now
// includes the required "AI-first relocation planning tool..." phrase, and Open Graph /
// Twitter card metadata are filled in so shared links render a real preview image.
const HOMEPAGE_TITLE = `${SITE_NAME} | Map your move. Settle with confidence.`;
const HOMEPAGE_DESCRIPTION =
  "AI-first relocation planning tool for students, professionals and families. Real relocation stories, practical checklists, official links, and first 7, 30, and 90 day guidance for people and families planning relocation across countries, cities, and life stages.";
const SOCIAL_PREVIEW_IMAGE = "/images/settlemap/hero-relocation-command-centre.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  title: {
    default: HOMEPAGE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: HOMEPAGE_DESCRIPTION,
  openGraph: {
    title: HOMEPAGE_TITLE,
    description:
      "AI-first relocation planning tool for students, professionals and families. Experience-backed relocation playbooks for people, families, students, professionals, retirees, and pet owners moving across countries, cities, and life stages.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: SOCIAL_PREVIEW_IMAGE,
        width: 1200,
        height: 900,
        alt: "SettleMap relocation command centre with route map, suitcase, checklist and assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    images: [SOCIAL_PREVIEW_IMAGE],
  },
  // V11.7 Part 3 — Google Search Console verification. Reads from an env var so no
  // fake/placeholder token is ever committed. Ash must set
  // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel project settings with the real token
  // from Search Console; until then this field is simply omitted and has no effect.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
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
        <Analytics />
      </body>
    </html>
  );
}
