import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink, GraduationCap, ShieldCheck } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import {
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
  description: "SettleMap Student Move Pack — S$19 early access. Route-aware 90-day plan, SIM/OTP checklist, packing guide, parent handover checklist and provider scripts.",
};

const STRIPE_LINK =
  process.env.NEXT_PUBLIC_STRIPE_STUDENT_MOVE_PACK_PAYMENT_LINK ??
  "https://buy.stripe.com/bJe7sKcJs90l7csgrK1gs00";

const studentPackFeatures = [
  "90-day route-aware project plan",
  "First 7 days setup guide",
  "India SIM/OTP continuity checklist",
  "Packing and bring-vs-buy checklist",
  "Parent/student question checklist",
  "Provider research scripts",
  "Downloadable checklist (PDF where available)",
  "Support by email: support@settlemap.app",
];

const freeFeatures = [
  "Route-aware move plan",
  "First 7 days checklist",
  "Document readiness categories",
  "Services research starting points",
  "AI planning pilot with built-in fallback",
  "Copy-ready scripts",
  "Browser-saved progress (no login)",
];

export default function PricingPage() {
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[3fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Plans and pricing</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">Pricing</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
              The route planner is free. The Student Move Pack is S$19 early access — pay securely via Stripe, no account needed.
            </p>
          </div>
          <div className="hidden lg:block">
            <SuitcaseIllustration className="w-full max-w-[200px] justify-self-end" />
          </div>
        </div>

        {/* Plan cards */}
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          {/* Free plan */}
          <div className="flex flex-col rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Available now · Free</p>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900">Free route plan</h2>
            <p className="mt-1 text-2xl font-bold text-zinc-900">Free</p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">Plan your move with a route-aware project tracker, scripts and checklists — no login or card required.</p>
            <ul className="mt-4 flex-1 space-y-2">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/#route-selector"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-emerald-700"
            >
              Start free plan <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Student Move Pack — ACTIVE */}
          <div className="relative flex flex-col rounded-xl border-2 border-emerald-400 bg-white p-6 shadow-md">
            <div className="absolute -top-3 left-6">
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">Early access · Open now</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Student move · India outbound</p>
            </div>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900">Student Move Pack</h2>
            <p className="mt-1 text-2xl font-bold text-zinc-900">S$19 <span className="text-sm font-normal text-zinc-500">one-time</span></p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">A focused planning pack for students moving abroad — India to UK, Germany, Singapore, US, Australia or Canada. Includes scripts, packing guides and a parent/student handover checklist.</p>
            <ul className="mt-4 flex-1 space-y-2">
              {studentPackFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2">
              <a
                href={STRIPE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-emerald-700"
              >
                Pay securely with Stripe <ExternalLink className="ml-2 h-4 w-4" />
              </a>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
                <ShieldCheck className="h-3 w-3" />
                Secure payment via Stripe · No SettleMap account needed
              </div>
            </div>
            <p className="mt-3 border-t border-zinc-100 pt-3 text-[11px] leading-5 text-zinc-500">
              After payment you will receive an email at the address used at checkout. Delivery is by email within 1 business day.{" "}
              <Link href="/refund-policy" className="underline hover:text-zinc-700">Refund policy</Link>.
            </p>
          </div>

          {/* Premium Pack — coming later */}
          <div className="flex flex-col rounded-xl border border-zinc-200/80 bg-zinc-50 p-6 shadow-sm opacity-70">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Coming later</p>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900">Premium Relocation Pack</h2>
            <p className="mt-1 text-2xl font-bold text-zinc-500">From S$49</p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">Everything in the Student Move Pack plus a detailed move checklist, budget template, document tracker, first-week setup plan, and family/student/pet add-ons.</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-zinc-500">
              {["Everything in Student Move Pack", "Budget worksheet starter", "Document tracker", "Housing comparison template", "Family/student/pet/senior add-ons"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 flex-none rounded-full bg-zinc-300" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/early-access"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-600 transition-all duration-200 ease-in-out hover:border-zinc-400"
            >
              Register interest <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Voice Guide — waitlist only */}
          <div className="flex flex-col rounded-xl border border-zinc-200/80 bg-zinc-50 p-6 shadow-sm opacity-70">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Waitlist only · No pricing yet</p>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900">SettleMap Voice Guide</h2>
            <p className="mt-1 text-sm font-semibold text-zinc-400">Pricing to be decided</p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">A future AI-guided voice walkthrough that helps you understand your relocation plan, ask planning questions and prepare checklist notes. Not available today.</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-zinc-500">
              {["Voice-guided plan walkthrough", "Guided planning questions", "Next-step summary", "Official-source reminders"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 flex-none rounded-full bg-zinc-300" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/early-access"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-600 transition-all duration-200 ease-in-out hover:border-zinc-400"
            >
              Join Voice Guide waitlist <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* What is included / not included */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">What SettleMap helps with</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-600">
              {SETTLEMAP_HELPS_WITH.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
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
                  <span className="mt-2 h-1 w-1 flex-none rounded-full bg-zinc-300" />
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
          <Link href="/get-help" className="rounded-full border border-black/10 bg-white px-6 py-3 text-center text-sm font-semibold text-[#123638] hover:bg-slate-50">
            Get help with pricing questions
          </Link>
        </div>

        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
