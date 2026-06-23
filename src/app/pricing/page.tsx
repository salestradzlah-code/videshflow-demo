import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import {
  PAYMENT_READINESS_NOTE,
  SUPPORT_CONTACT_NOTE,
  PRICING_BOUNDARY_SHORT,
  FUTURE_BOOKING_LINKS_TITLE,
  FUTURE_BOOKING_LINKS_NOTE,
  SETTLEMAP_HELPS_WITH,
  SETTLEMAP_DOES_NOT_DO,
} from "@/lib/constants";
import { SuitcaseIllustration } from "@/components/illustrations/RelocationIllustrations";

export const metadata: Metadata = {
  title: "Pricing",
  description: "SettleMap plans and pilot pricing signals. AI-first and self-serve. No human review, no payments active yet.",
};

const plans = [
  {
    key: "free",
    label: "Available now",
    title: "Free relocation project plan",
    price: "Free",
    copy: "Plan your move with a route-aware project tracker, saved browser progress, Tenant Bio where applicable, action links and copy-ready scripts.",
    features: [
      "Route-aware project tracker",
      "Saved browser progress",
      "Tenant Bio where applicable",
      "Action links and copy-ready scripts",
    ],
    cta: "Start free plan",
    href: "/#route-selector",
  },
  {
    key: "ai-route-plan",
    label: "Coming soon / pilot interest",
    title: "AI-generated route plan",
    price: "From S$19",
    copy: "Future self-serve AI-generated route-specific plan for your selected move.",
    features: [
      "AI-generated route-specific plan",
      "90-day task timeline",
      "Official-source reminders",
      "Housing, documents and first-30-days checklist",
      "Copy-ready scripts",
      "Printable/downloadable format planned",
    ],
    cta: "Register interest in AI route plan",
    href: "/early-access",
  },
  {
    key: "premium-ai-pack",
    label: "Coming soon / pilot interest",
    title: "Premium AI relocation pack",
    price: "From S$49",
    copy: "Future premium AI pack with templates, scripts and planning tools.",
    features: [
      "Everything in AI-generated route plan",
      "Budget worksheet",
      "Document tracker",
      "Housing comparison template",
      "First-week setup plan",
      "Additional scripts",
      "Family/student/pet/senior add-ons where relevant",
    ],
    cta: "Register interest in Premium AI relocation pack",
    href: "/early-access",
  },
  {
    key: "voice-guide",
    label: "Coming soon / waitlist only",
    title: "SettleMap Voice Guide",
    price: "Coming soon, or pilot pricing to be decided",
    copy: "A future AI-guided voice walkthrough that helps you understand your relocation plan, ask planning questions, prioritise next steps and prepare checklist notes.",
    features: [
      "Voice-guided plan walkthrough",
      "Guided planning questions",
      "Next-step summary",
      "Script ideas",
      "Official-source reminders",
    ],
    cta: "Join Voice Guide waitlist",
    href: "/early-access",
  },
];

export default function PricingPage() {
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[3fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Plans and pilots</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">Pricing</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
              SettleMap's project planner is free today. Paid plans below are AI-first, self-serve, and fully automated by
              design — there is no human review and no manual fulfilment. Pricing signals are research-stage interest lists
              only — nothing here charges a card.
            </p>
          </div>
          <div className="hidden lg:block">
            <SuitcaseIllustration className="w-full max-w-[200px] justify-self-end" />
          </div>
        </div>

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
                <p className="mt-3 text-sm leading-6 text-zinc-600">{plan.copy}</p>
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

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">What SettleMap helps with</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-600">
              {SETTLEMAP_HELPS_WITH.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 flex-none rounded-full bg-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">What SettleMap does not do</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-600">
              {SETTLEMAP_DOES_NOT_DO.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 flex-none rounded-full bg-zinc-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{FUTURE_BOOKING_LINKS_TITLE}</p>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{FUTURE_BOOKING_LINKS_NOTE}</p>
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
