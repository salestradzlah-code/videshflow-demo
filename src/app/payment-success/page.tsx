import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, ExternalLink, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment confirmed — SettleMap",
  description: "Your Student Move Pack payment has been received through Stripe.",
};

export default function PaymentSuccessPage() {
  return (
    <section className="min-h-[60vh] bg-zinc-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">Payment confirmed</h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Thank you. Your Student Move Pack payment has been received and confirmed by Stripe.
          </p>
        </div>

        {/* Automated delivery notice */}
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <Clock className="h-4 w-4 shrink-0 text-emerald-600" />
          Your Student Move Pack email is being sent automatically — check within 15 minutes.
        </div>

        {/* Next steps */}
        <div className="mt-5 rounded-xl border border-zinc-200/80 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">What to do next</p>
          <ol className="mt-4 space-y-3">
            {[
              "Check your Stripe receipt email — it confirms the payment and amount.",
              "Check the Student Move Pack email from SettleMap — this is sent automatically within minutes.",
              "Open SettleMap and start building your route plan while you wait.",
              "Did not receive the SettleMap email within 15 minutes? Check your spam folder, then email support@settlemap.app with your payment email.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-6 text-zinc-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[11px] leading-5 text-zinc-500">
            SettleMap uses Stripe-hosted checkout. If you paid via Stripe Link, the Stripe receipt may go to the email saved in your Stripe Link account rather than the one you typed during checkout.
          </p>
        </div>

        {/* If you contact support */}
        <div className="mt-5 rounded-xl border border-zinc-200/80 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">If you contact support, include</p>
          <ul className="mt-3 space-y-2">
            {[
              "The email address used at Stripe checkout",
              "Student or parent name",
              "Move route (for example: India to UK)",
              "Expected departure month",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-6 text-zinc-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-[11px] leading-5 text-amber-800">
              Do not send: passport number, visa number, bank details, medical details or ID documents.
            </p>
          </div>
        </div>

        {/* Support email */}
        <div className="mt-5 flex items-center gap-2 text-sm text-zinc-500">
          <Mail className="h-4 w-4 shrink-0" />
          Questions?{" "}
          <a href="mailto:support@settlemap.app" className="font-semibold text-emerald-700 underline hover:text-emerald-800">
            support@settlemap.app
          </a>
        </div>

        {/* CTAs */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/#route-selector"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700"
          >
            Build my move plan <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <a
            href="mailto:support@settlemap.app"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-400"
          >
            Contact support <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>

        <p className="mt-8 text-xs leading-6 text-zinc-400">
          SettleMap provides planning checklists and research guides only. It does not provide immigration, legal, tax, financial, property, insurance, medical, school admission or government advice. Always verify requirements with official sources and qualified professionals.
        </p>
      </div>
    </section>
  );
}
