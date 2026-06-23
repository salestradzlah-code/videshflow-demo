import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import {
  TALLY_FORM_URL,
  PAYMENT_READINESS_NOTE,
  SUPPORT_CONTACT_NOTE,
  PRICING_BOUNDARY_SHORT,
  PAID_NOT_INCLUDED,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing",
  description: "SettleMap plans and pilot pricing signals. No payments are active yet.",
};

const plans = [
  {
    key: "free",
    label: "Current free product",
    title: "Free relocation project plan",
    price: "Free",
    features: [
      "Route planner",
      "Project task tracker",
      "Saved browser progress",
      "Tenant Bio where applicable",
      "Action links and scripts",
    ],
    cta: "Start free plan",
    href: "/#route-selector",
  },
  {
    key: "personalised",
    label: "Pilot interest list",
    title: "Personalised route plan",
    price: "From S$19",
    features: [
      "Automated route-specific plan",
      "90-day checklist",
      "Official-source reminders",
      "Housing / document / first-30-days steps",
      "Copy-ready scripts",
      "Download/print-ready format planned",
    ],
    cta: "Join pilot interest list",
    href: "/early-access",
  },
  {
    key: "premium",
    label: "Pilot interest list",
    title: "Premium relocation pack",
    price: "From S$49",
    features: [
      "Everything in personalised route plan",
      "Detailed move checklist",
      "Budget and document templates",
      "First-week setup plan",
      "Family / student / pet / senior add-ons where relevant",
      "Extra copy-ready scripts",
    ],
    cta: "Join pilot interest list",
    href: "/early-access",
  },
  {
    key: "concierge",
    label: "Limited future pilot — not active yet",
    title: "Concierge planning call",
    price: "From S$79",
    features: [
      "Limited future pilot",
      "Planning walkthrough",
      "Q&A on using SettleMap",
      "Not active yet",
      "No guarantee of availability",
    ],
    cta: "Request concierge interest",
    href: TALLY_FORM_URL,
  },
];

export default function PricingPage() {
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Plans and pilots</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">Pricing</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
          SettleMap's project planner is free today. The plans below are pilot interest lists and price signals only — nothing
          here charges a card.
        </p>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
          <p className="text-sm leading-6 font-medium">{PAYMENT_READINESS_NOTE}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const isExternal = plan.href.startsWith("http");
            return (
              <div key={plan.key} className="flex flex-col rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{plan.label}</p>
                <h2 className="mt-3 text-lg font-semibold text-zinc-900">{plan.title}</h2>
                <p className="mt-1 text-2xl font-semibold text-zinc-900">{plan.price}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm leading-6 text-zinc-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 flex-none rounded-full bg-emerald-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {isExternal ? (
                  <a
                    href={plan.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-emerald-700"
                  >
                    {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={plan.href}
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-emerald-700"
                  >
                    {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Not included in any paid pilot yet</p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-zinc-600 sm:grid-cols-2">
            {PAID_NOT_INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 flex-none rounded-full bg-zinc-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <p className="text-sm leading-7 text-zinc-700">{PRICING_BOUNDARY_SHORT}</p>
          <Link href="/disclaimer" className="mt-2 inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            Read the full disclaimer <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>

        <p className="mt-6 text-sm text-zinc-500">{SUPPORT_CONTACT_NOTE}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/refund-policy" className="rounded-full border border-black/10 bg-white px-6 py-3 text-center text-sm font-semibold text-[#123638] hover:bg-slate-50">
            Read refund policy
          </Link>
          <Link href="/early-access" className="rounded-full border border-black/10 bg-white px-6 py-3 text-center text-sm font-semibold text-[#123638] hover:bg-slate-50">
            Go to early access
          </Link>
        </div>

        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
