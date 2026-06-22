"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Banknote,
  Car,
  FileX2,
  GraduationCap,
  HeartPulse,
  Home,
  Luggage,
  MapPin,
  PawPrint,
  ShieldCheck,
  Sofa,
  Tv,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { InfoBanner } from "@/components/ui/InfoBanner";
import { DIRECTORY_DISCLAIMER } from "@/lib/constants";
import { ACTION_LINKS_NOT_ENDORSEMENT, actionLinkCategories, singaporeOfficialLinkCategories } from "@/data/demoPlatform";

type ServiceGroup = "Housing" | "Moving and goods" | "Connectivity and utilities" | "Money and insurance" | "Health and family" | "Transport and admin";

type ServiceCategory = {
  title: string;
  icon: LucideIcon;
  group: ServiceGroup;
  description: string;
  examples: string[];
  whenToResearch: string;
};

const GROUPS: ServiceGroup[] = ["Housing", "Moving and goods", "Connectivity and utilities", "Money and insurance", "Health and family", "Transport and admin"];

const categories: ServiceCategory[] = [
  {
    title: "International movers",
    icon: Luggage,
    group: "Moving and goods",
    description: "Packing, shipping, customs handling and destination delivery for your belongings.",
    examples: ["Door-to-door movers", "Air and sea freight", "Excess baggage services"],
    whenToResearch: "8 to 12 weeks before your move date.",
  },
  {
    title: "Temporary stay",
    icon: Home,
    group: "Housing",
    description: "Short-term accommodation to bridge the gap before a long-term rental is signed.",
    examples: ["Serviced apartments", "Extended-stay hotels", "Corporate housing"],
    whenToResearch: "As soon as your arrival date is confirmed.",
  },
  {
    title: "Long-term housing",
    icon: Home,
    group: "Housing",
    description: "Rental or purchase research, including neighbourhoods, commute and lease terms.",
    examples: ["Rental portals", "Letting agents", "Neighbourhood comparisons"],
    whenToResearch: "Once you have a temporary stay booked and know your work or school location.",
  },
  {
    title: "SIM / eSIM and internet",
    icon: Wifi,
    group: "Connectivity and utilities",
    description: "Local mobile connectivity and home broadband options for your destination.",
    examples: ["Prepaid and postpaid SIM plans", "eSIM providers", "Home broadband packages"],
    whenToResearch: "Before arrival, so you can activate connectivity on day one.",
  },
  {
    title: "TV / cable / WiFi setup",
    icon: Tv,
    group: "Connectivity and utilities",
    description: "Home entertainment and WiFi installation once a lease is signed.",
    examples: ["Cable and streaming bundles", "Router and installation services"],
    whenToResearch: "Once your new address is confirmed.",
  },
  {
    title: "Utilities",
    icon: Zap,
    group: "Connectivity and utilities",
    description: "Electricity, water and gas setup, transfer or cancellation at each address.",
    examples: ["New connection applications", "Final meter readings", "Transfer to new occupant"],
    whenToResearch: "When giving notice at your old address and signing at the new one.",
  },
  {
    title: "Banking and remittance",
    icon: Banknote,
    group: "Money and insurance",
    description: "Local account access, home-country OTP continuity and international transfers.",
    examples: ["Local bank accounts", "Remittance and FX providers", "Home SIM OTP continuity plans"],
    whenToResearch: "Before you travel and again within your first two weeks.",
  },
  {
    title: "Insurance",
    icon: ShieldCheck,
    group: "Money and insurance",
    description: "Travel, health, renter, vehicle and pet insurance compared directly with providers.",
    examples: ["Travel and health insurance", "Renter's or home insurance", "Vehicle insurance"],
    whenToResearch: "Before departure for travel cover, then again after you settle into a home.",
  },
  {
    title: "Healthcare and medicines",
    icon: HeartPulse,
    group: "Health and family",
    description: "Clinic registration, prescription continuity and emergency care access.",
    examples: ["GP or clinic registration", "Prescription transfer", "Emergency contact numbers"],
    whenToResearch: "Within your first two weeks, sooner for ongoing prescriptions.",
  },
  {
    title: "Schooling and childcare",
    icon: GraduationCap,
    group: "Health and family",
    description: "School admission timelines, childcare options and curriculum transition.",
    examples: ["School admission portals", "Childcare and nursery options", "Curriculum transcripts"],
    whenToResearch: "As early as possible — admission windows and waitlists move fast.",
  },
  {
    title: "Pets",
    icon: PawPrint,
    group: "Health and family",
    description: "Import rules, vaccination records and pet-friendly housing and transport.",
    examples: ["Import and quarantine rules", "Vaccination and microchip records", "Pet-friendly rentals"],
    whenToResearch: "8 to 12 weeks before travel — import rules can take time to satisfy.",
  },
  {
    title: "Vehicle and driving",
    icon: Car,
    group: "Transport and admin",
    description: "Licence conversion, IDP requirements and car rental or purchase.",
    examples: ["Driving licence conversion", "International driving permit", "Car rental or lease"],
    whenToResearch: "Before you need to drive — conversion rules vary widely by destination.",
  },
  {
    title: "Furniture and appliances",
    icon: Sofa,
    group: "Moving and goods",
    description: "First-home setup, delivery timing and appliance compatibility.",
    examples: ["Furniture rental or purchase", "Appliance voltage compatibility", "Delivery scheduling"],
    whenToResearch: "Once your lease is signed and key collection date is known.",
  },
  {
    title: "Contract termination",
    icon: FileX2,
    group: "Transport and admin",
    description: "Closing out leases, subscriptions and service contracts at your old address.",
    examples: ["Lease termination notice", "Subscription cancellations", "Final billing confirmation"],
    whenToResearch: "As soon as your move date is confirmed, to meet notice periods.",
  },
  {
    title: "Official links",
    icon: MapPin,
    group: "Transport and admin",
    description: "Government and embassy sources for visa, tax, healthcare and residency rules.",
    examples: ["Immigration department portals", "Embassy and consulate pages", "Tax authority guidance"],
    whenToResearch: "Throughout your move — always verify rules directly before acting.",
  },
];

export function ServicesDirectory() {
  const [activeGroup, setActiveGroup] = useState<"All" | ServiceGroup>("All");

  const filtered = useMemo(() => {
    if (activeGroup === "All") return categories;
    return categories.filter((category) => category.group === activeGroup);
  }, [activeGroup]);

  return (
    <div>
      <InfoBanner icon={<BadgeCheck className="h-5 w-5" />}>{DIRECTORY_DISCLAIMER}</InfoBanner>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["All", ...GROUPS] as const).map((group) => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className={
              activeGroup === group
                ? "rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out"
                : "rounded-full border border-zinc-200/80 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 transition-all duration-200 ease-in-out hover:border-zinc-300"
            }
          >
            {group}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((category) => (
          <div key={category.title} className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
            <category.icon className="h-6 w-6 text-emerald-600" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-900">{category.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{category.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.examples.map((example) => (
                <span key={example} className="rounded-full bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-500">{example}</span>
              ))}
            </div>
            <p className="mt-4 border-t border-zinc-100 pt-3 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">
              When to research: <span className="font-medium text-zinc-600">{category.whenToResearch}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-zinc-200/80 pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Action links</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Where to start for each category</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">{ACTION_LINKS_NOT_ENDORSEMENT}</p>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {actionLinkCategories.map((category) => (
            <div key={category.key} className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-zinc-900">{category.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{category.whatToDo}</p>
              <p className="mt-3 border-t border-zinc-100 pt-3 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">
                Where to start: <span className="font-medium text-zinc-600">{category.whereToStart}</span>
              </p>
              <p className="mt-2 text-xs text-zinc-400">Verify from official website. Not an endorsement.</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Singapore official links</p>
          <h3 className="mt-2 text-lg font-semibold text-zinc-900">If your move involves Singapore</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {singaporeOfficialLinkCategories.map((category) => (
              <div key={category.key} className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-zinc-900">{category.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{category.whatToDo}</p>
                <p className="mt-3 border-t border-zinc-100 pt-3 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">
                  Where to start: <span className="font-medium text-zinc-600">{category.whereToStart}</span>
                </p>
                <p className="mt-2 text-xs text-zinc-400">Verify from official website. Not an endorsement.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
