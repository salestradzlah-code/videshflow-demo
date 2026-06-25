import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, GraduationCap, ShieldCheck } from "lucide-react";
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
import { getPaidProductRuntime } from "@/lib/paidProducts";

export const metadata: Metadata = {
  title: "Pricing",
  description: "SettleMap Student Move Pack — S$19 early access. Route-aware 90-day plan, SIM/OTP checklist, packing guide, parent handover checklist and provider scripts.",
};

const studentPackFeatures = [
  "Immediate paid pack on confirmation page",
  "Email copy sent automatically after payment",
  "90-day route-aware project plan",
  "First 7 days setup guide",
  "Concern-based checklist — SIM/OTP, banking, accommodation, insurance, campus arrival and more",
  "Packing and bring-vs-buy checklist with customs reminder",
  "Parent and student handover checklist",
  "Provider research scripts — housing, banking, SIM, insurance, school admin, healthcare",
  "Research links — where to start for each category",
  "Official source reminders throughout",
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
  const studentProduct = getPaidProductRuntime("student_move_pack");
  const premiumProduct = getPaidProductRuntime("premium_relocation_pack");
  const voiceProduct = getPaidProductRuntime("voice_guide");

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

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          {/* Free plan */}
          <div className="flex flex-col rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Available now · Free</p>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900">Free route plan</h2>
            <p className="mt-1 text-2xl font-bold text-zinc-900">Free</p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">Free public route overview with starter tasks, route cards, timelines and research links. No personalised paid deliverable.</p>
            <ul className="mt-4 flex-1 space-y-2">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/#route-selector" className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-emerald-700">
              Start free plan <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Student Move Pack */}
          <div className="relative flex flex-col rounded-xl border-2 border-emerald-400 bg-white p-6 shadow-md">
            <div className="absolute -top-3 left-6">
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">Early access · Open now</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Student move · Early access</p>
            </div>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900">Student Move Pack</h2>
            <p className="mt-1 text-2xl font-bold text-zinc-900">S$19 <span className="text-sm font-normal text-zinc-500">one-time</span></p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">A paid AI-generated planning pack for student relocations — India to UK, Germany, Singapore, US, Australia, Canada or your own route. Includes concern-based checklists, packing guide, SIM/OTP continuity, banking, campus arrival, insurance research, parent handover, first-week setup and provider research scripts. Planning support only — not immigration or professional advice.</p>
            <ul className="mt-4 flex-1 space-y-2">
              {studentPackFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2">
              {studentProduct.checkoutReady ? (
                <Link href="/student-move-pack" className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-emerald-700">
                  Start Student Move Pack <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Payments temporarily paused. Contact{" "}
                  <a href="mailto:support@settlemap.app" className="underline hover:text-amber-900">support@settlemap.app</a>.
                </div>
              )}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
                <ShieldCheck className="h-3 w-3" />
                Secure payment via Stripe · No SettleMap account needed
              </div>
            </div>
            <p className="mt-3 border-t border-zinc-100 pt-3 text-[11px] leading-5 text-zinc-500">
              After payment, your paid pack appears immediately on the confirmation page. A copy is also sent by email. If email delivery is delayed, use the on-screen pack and contact{" "}
              <a href="mailto:support@settlemap.app" className="underline hover:text-zinc-700">support@settlemap.app</a>.{" "}
              Refund requests are reviewed through{" "}
              <Link href="/refund-request" className="underline hover:text-zinc-700">/refund-request</Link>.{" "}
              <Link href="/refund-policy" className="underline hover:text-zinc-700">Refund policy</Link>.
            </p>
          </div>

          {/* Premium Pack — live */}
          <div className="relative flex flex-col rounded-xl border-2 border-violet-400 bg-white p-6 shadow-md">
            <div className="absolute -top-3 left-6">
              <span className="rounded-full bg-violet-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
                {premiumProduct.checkoutReady ? "Open now · S$49" : "Ready to activate · S$49"}
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">Premium · Families, couples, corporate, returning</p>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900">Premium Relocation Pack</h2>
            <p className="mt-1 text-2xl font-bold text-zinc-900">S$49 <span className="text-sm font-normal text-zinc-500">one-time</span></p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">For families, couples, solo movers, returning residents and corporate transfers. Detailed route-aware checklist, budget template, document tracker, first-week plan, 6 specialist add-on modules and 11 provider research scripts. Planning support only — not professional advice.</p>

            {/* Module highlights */}
            <div className="mt-4 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400">Add-on modules included</p>
              {[
                { label: "Family move", desc: "School research, healthcare registration, family banking, childcare and arrival day schedule." },
                { label: "Corporate transfer", desc: "Work pass checklist, relocation allowance tracker, rental documentation and tax residency notes." },
                { label: "Pet relocation", desc: "Microchip, vaccination, import permit, quarantine rules and airline cargo checklist by route." },
                { label: "Returning home", desc: "Re-entry permit, tax filing status, local ID reinstatement, property and banking re-setup." },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5">
                  <p className="text-xs font-semibold text-zinc-700">{s.label}</p>
                  <p className="mt-0.5 text-[11px] leading-4 text-zinc-500">{s.desc}</p>
                </div>
              ))}
            </div>

            <p className="mt-4 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5 text-[11px] leading-5 text-amber-800">
              Planning support only. No human review. Not professional advice. Always verify with official sources and qualified advisers.
            </p>

            <div className="mt-5 space-y-2">
              {premiumProduct.checkoutReady ? (
                <Link href="/premium-relocation-pack" className="inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-violet-700">
                  Start Premium Relocation Pack <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                  {premiumProduct.status === "configuring"
                    ? "Checkout is being configured. Please contact support@settlemap.app or try again later."
                    : "Checkout currently paused. Join the waitlist or contact support@settlemap.app."}
                  <div className="mt-2">
                    <Link href="/early-access" className="font-semibold underline hover:text-amber-900">
                      Join waitlist
                    </Link>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
                <ShieldCheck className="h-3 w-3" />
                Secure payment via Stripe · No SettleMap account needed
              </div>
            </div>
          </div>

          {/* Voice Guide */}
          <div className="flex flex-col rounded-xl border border-teal-200/80 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              {voiceProduct.checkoutReady ? "Open now · Voice-style guide" : "Ready to activate · Voice-style guide"}
            </p>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900">SettleMap Voice Guide</h2>
            <p className="mt-1 text-2xl font-bold text-zinc-900">S$19 <span className="text-sm font-normal text-zinc-500">one-time</span></p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              A self serve AI guided voice-style walkthrough for your relocation plan, checklist, first week setup and research questions. You receive a clear conversational guide that explains what to do first, what to verify and what to prepare before moving.
            </p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-zinc-600">
              {["Voice Guide script and walkthrough", "Top 7 move priorities", "First 7 days explanation", "Documents to prepare", "Provider questions to ask", "Research links to verify", "Official-source reminders"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5 text-[11px] leading-5 text-amber-800">
              Planning support only. No human review. Not professional advice. This is not a live human call and does not include generated audio in this version.
            </p>
            <div className="mt-5">
              {voiceProduct.checkoutReady ? (
                <Link href="/voice-guide" className="inline-flex w-full items-center justify-center rounded-full bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-teal-800">
                  Start Voice Guide <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                  {voiceProduct.status === "configuring"
                    ? "Checkout being configured. Add STRIPE_VOICE_GUIDE_PRICE_ID and enable the Voice Guide flags."
                    : "Checkout currently paused. Join the waitlist or contact support@settlemap.app."}
                  <div className="mt-2">
                    <Link href="/early-access" className="font-semibold underline hover:text-amber-900">
                      Join waitlist
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

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
          <Link href="/refund-policy" className="rounded-full border border-black/10 bg-white px-6 py-3 text-center text-sm font-semibold text-emerald-900 hover:bg-slate-50">
            Read refund policy
          </Link>
          <Link href="/refund-request" className="rounded-full border border-black/10 bg-white px-6 py-3 text-center text-sm font-semibold text-emerald-900 hover:bg-slate-50">
            Request a refund review
          </Link>
          <Link href="/early-access" className="rounded-full border border-black/10 bg-white px-6 py-3 text-center text-sm font-semibold text-emerald-900 hover:bg-slate-50">
            Go to early access
          </Link>
          <Link href="/get-help" className="rounded-full border border-black/10 bg-white px-6 py-3 text-center text-sm font-semibold text-emerald-900 hover:bg-slate-50">
            Get help with pricing questions
          </Link>
        </div>

        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
