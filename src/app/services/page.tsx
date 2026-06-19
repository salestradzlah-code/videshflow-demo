import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, SearchCheck, ShieldAlert, Tags } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { DIRECTORY_DISCLAIMER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services Directory",
  description: "Neutral relocation service categories to research before and after moving.",
};

const serviceCategories = [
  { title: "International movers and excess baggage", text: "Research packers, movers, boxes, air freight, sea freight, customs handling, and excess baggage options." },
  { title: "Immigration consultants and legal firms", text: "Use only licensed or qualified providers where formal immigration or legal advice is needed." },
  { title: "Temporary accommodation", text: "Compare hotels, serviced apartments, long-stay apartments, and employer-provided temporary stay options." },
  { title: "Rental search support", text: "Research property portals, agents, neighbourhoods, commute, deposits, and rental scam warning signs." },
  { title: "Schooling and childcare support", text: "Understand school options, childcare, calendars, curriculum transition, fees, and waitlist realities." },
  { title: "Banking, account access and forex", text: "Research account access, home SIM OTP continuity, remittance providers, and professional advice where needed." },
  { title: "SIM, roaming and connectivity", text: "Plan home SIM continuity, local SIM, roaming backup, broadband, and mobile app setup." },
  { title: "Travel, health and expat insurance", text: "Compare travel and health coverage directly with providers and understand exclusions before purchase." },
  { title: "Medical and dental preparation", text: "Plan dental checks, eye checks, prescriptions, vaccinations, and destination medicine rules before departure." },
  { title: "Driving licence, IDP, cab and rental car", text: "Research IDP, local licence conversion, airport transfer, taxi apps, public transport, and rental car requirements." },
  { title: "Home setup, WiFi, electricity, furniture and appliances", text: "Plan the first apartment setup, broadband, utilities, household supplies, furniture, appliances, and delivery timelines." },
  { title: "Pet relocation and local services", text: "Research pet import rules, vaccination and microchip needs, pet-friendly transport, and local vet options." },
  { title: "Cultural food, faith, community and groups", text: "Find supermarkets, specialty shops, dietary options, places of worship, regional community groups, and kids playgroups." },
];

const directoryLayers = [
  { icon: SearchCheck, title: "Service categories to research", label: "Research only", text: "Use this to understand what type of help you may need before and after moving." },
  { icon: Tags, title: "Public platforms to compare", label: "Verify directly", text: "Compare prices, reviews, availability, and rules directly on provider websites." },
  { icon: ShieldAlert, title: "Provider options to verify", label: "No guarantee", text: "Listings are not endorsements, approvals, or promises of quality or outcome." },
  { icon: BriefcaseBusiness, title: "Future partner listings", label: "Disclosed later", text: "SettlePath may include affiliate or referral links in future where clearly disclosed." },
];

export default function ServicesPage() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-8 rounded-[2rem] bg-white p-8 shadow-sm sm:p-12 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Services directory</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">Service categories to research before moving</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              SettlePath is not a full marketplace at launch. This page gives users a safe, neutral structure for the services they may need to research before and after relocation.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/get-help" className="inline-flex items-center rounded-full bg-[#123638] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0c2829]">
                Request help <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/reference-links" className="inline-flex items-center rounded-full border border-black/10 px-6 py-3 text-sm font-semibold text-[#123638] hover:bg-slate-50">
                Explore reference links
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-[#f8f6f1] shadow-sm">
            <Image
              src="/images/relocation_app_toolbox.png"
              alt="Generic relocation app and service category icons without logos"
              width={1672}
              height={941}
              className="h-auto w-full object-cover"
              sizes="(min-width: 1024px) 34vw, 100vw"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {directoryLayers.map((layer) => (
            <div key={layer.title} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <layer.icon className="h-7 w-7 text-[#123638]" />
              <span className="mt-5 inline-flex rounded-full bg-[#f2c56b]/25 px-3 py-1 text-xs font-semibold text-[#80520e]">{layer.label}</span>
              <h2 className="mt-4 text-lg font-semibold text-[#172326]">{layer.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{layer.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-[#f2c56b]/70 bg-[#fff8df] p-6 text-sm leading-6 text-[#68420c]">
          <strong>Directory safety wording:</strong> {DIRECTORY_DISCLAIMER} SettlePath may include affiliate or referral links in future where disclosed.
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((category) => (
            <div key={category.title} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#172326]">{category.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{category.text}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#123638]/10 px-3 py-1 text-xs font-semibold text-[#123638]">Research only</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Verify directly</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">No guarantee</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
