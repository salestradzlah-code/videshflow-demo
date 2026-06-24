import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment cancelled — SettleMap",
  description: "Your payment was not completed. No charge was made.",
};

export default function PaymentCancelledPage() {
  return (
    <section className="min-h-[60vh] bg-zinc-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
          <XCircle className="h-9 w-9 text-zinc-400" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">Payment not completed</h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          No charge was made by SettleMap from this cancelled checkout attempt. You can try again whenever you are ready.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/student-move-pack"
            className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700"
          >
            Try again — Student Move Pack <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/#route-selector"
            className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-400"
          >
            Start free plan <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <Link href="/pricing" className="text-sm font-semibold text-emerald-700 underline hover:text-emerald-800">
            Back to pricing
          </Link>
          <span className="hidden text-zinc-300 sm:block">·</span>
          <a href="mailto:support@settlemap.app" className="text-sm text-zinc-500 hover:text-zinc-700">
            support@settlemap.app
          </a>
        </div>

        <p className="mt-8 text-xs leading-6 text-zinc-400">
          No payment was taken. Stripe handles all card processing securely — SettleMap does not store card details.
        </p>
      </div>
    </section>
  );
}
