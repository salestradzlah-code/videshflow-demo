import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment confirmed — SettleMap",
  description: "Your Student Move Pack payment was received. Check your email for delivery details.",
};

export default function PaymentSuccessPage() {
  return (
    <section className="min-h-[60vh] bg-zinc-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">Payment confirmed</h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Thank you — your Student Move Pack purchase was received. You will get a confirmation and delivery email at the address used at checkout within 1 business day.
        </p>

        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">What happens next</p>
          <ul className="mt-4 space-y-3">
            {[
              "Check your inbox (and spam folder) for a confirmation email.",
              "Your Student Move Pack will be delivered by email within 1 business day.",
              "If you have not received it after 24 hours, email support@settlemap.app with your payment reference.",
            ].map((step) => (
              <li key={step} className="flex items-start gap-3 text-sm leading-6 text-zinc-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-zinc-500">
          <Mail className="h-4 w-4 shrink-0" />
          Questions? Email{" "}
          <a href="mailto:support@settlemap.app" className="font-semibold text-emerald-700 underline hover:text-emerald-800">
            support@settlemap.app
          </a>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700"
          >
            Go to SettleMap <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/get-help"
            className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-400"
          >
            Get help
          </Link>
        </div>

        <p className="mt-8 text-xs leading-6 text-zinc-400">
          SettleMap provides planning checklists and research guides only. It does not provide immigration, legal, tax, financial, property, insurance, medical, school admission or government advice. Always verify requirements with official sources and qualified professionals.
        </p>
      </div>
    </section>
  );
}
