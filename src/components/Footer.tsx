import Link from "next/link";
import { DISCLAIMER_SHORT } from "@/lib/constants";

const exploreLinks = [
  { href: "/#route-selector", label: "Plan Your Route" },
  { href: "/countries", label: "Countries" },
  { href: "/ai-assistant", label: "AI Assistant" },
  { href: "/get-help", label: "Get Help" },
  { href: "/services", label: "Services Directory" },
  { href: "/reference-links", label: "Reference Links" },
  { href: "/share-story", label: "Share Your Story" },
];

const planningLinks = [
  { href: "/before-you-fly", label: "Before You Move" },
  { href: "/home-setup", label: "Home Setup" },
  { href: "/partner-with-us", label: "Partner With Us" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#102e30] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#f2c56b]" />
            <p className="text-lg font-semibold">SettleMap</p>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
            AI-assisted route planning for people and families planning relocation across countries, cities, and life stages, built from practical checklists, public sources, service categories and real stories.
          </p>
          <p className="mt-4 max-w-2xl text-xs leading-5 text-white/55">{DISCLAIMER_SHORT}</p>
          <p className="mt-3 max-w-2xl text-xs leading-5 text-white/55">
            Prefer another language? Use your browser translation feature for now. The future AI assistant is planned to support multiple languages over time.
          </p>
          {/* Internal note: VideshFlow may later become the India and diaspora route track inside SettleMap. Not shown publicly until feedback stage is complete. */}
        </div>
        <div>
          <p className="font-semibold">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/70">
            {exploreLinks.map((link) => <Link key={link.href} href={link.href} className="hover:text-white">{link.label}</Link>)}
          </div>
        </div>
        <div>
          <p className="font-semibold">Trust and planning</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/70">
            {planningLinks.map((link) => <Link key={link.href} href={link.href} className="hover:text-white">{link.label}</Link>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
