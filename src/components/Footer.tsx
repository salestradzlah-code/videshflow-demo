import Link from "next/link";
import { AFFILIATE_DISCLOSURE_NOTE, DISCLAIMER_SHORT, OPERATOR_LINE, TALLY_FORM_URL, LANGUAGE_TRANSLATE_NOTE, SUPPORT_EMAIL } from "@/lib/constants";

const exploreLinks = [
  { href: "/", label: "Build My Move Plan" },
  { href: "/countries", label: "Route Library" },
  { href: "/ai-assistant", label: "AI Assistant" },
  { href: "/get-help", label: "Get Help" },
  { href: "/services", label: "Services Directory" },
  { href: "/faq", label: "FAQ" },
  { href: "/reference-links", label: "Reference Links" },
  { href: "/service-provider-reference-policy", label: "Provider Policy" },
  { href: "/early-access", label: "Early Access" },
];

const planningLinks = [
  { href: "/before-you-fly", label: "Before You Move" },
  { href: "/home-setup", label: "Home Setup" },
  { href: "/pricing", label: "Pricing" },
  { href: "/pilot-feedback", label: "Pilot Feedback" },
  { href: "/voice-guide", label: "Voice Guide" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/partner-with-us", label: "Partner With Us" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/security-and-data", label: "Security and data" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-lg font-semibold">SettleMap</p>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Map your move. Settle with confidence. Practical route planning for people and families relocating across
            countries, cities, and life stages, built from checklists, public sources, service categories, and real
            stories.
          </p>
          <p className="mt-4 max-w-2xl text-xs leading-5 text-zinc-500">{DISCLAIMER_SHORT}</p>
          <p className="mt-3 max-w-2xl text-xs leading-5 text-zinc-500">{LANGUAGE_TRANSLATE_NOTE}</p>
          <p className="mt-4 max-w-2xl text-xs leading-5 text-zinc-500">{OPERATOR_LINE}</p>
          <p className="mt-3 max-w-2xl text-xs leading-5 text-zinc-500">
            Support: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-zinc-300 hover:text-white">{SUPPORT_EMAIL}</a>
          </p>
          <p className="mt-3 max-w-2xl text-xs leading-5 text-zinc-500">{AFFILIATE_DISCLOSURE_NOTE}</p>
        </div>
        <div>
          <p className="font-semibold">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-zinc-400">
            {exploreLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
            <a href={TALLY_FORM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Help shape SettleMap
            </a>
          </div>
        </div>
        <div>
          <p className="font-semibold">Trust and planning</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-zinc-400">
            {planningLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
