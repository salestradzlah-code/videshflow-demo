import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { SECURITY_DATA_POINTS, SUPPORT_EMAIL, SUPPORT_EMAIL_SAFETY_NOTE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Security and Data Handling",
  description: "How SettleMap handles your planning data, feedback, and payments during early access.",
};

export default function SecurityAndDataPage() {
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Trust and safety</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">Security and data</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
          SettleMap is an early feedback prototype. Here is a practical, plain summary of how planning data,
          feedback, and any future payments are handled.
        </p>

        <div className="mt-8 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-7">
          <ul className="space-y-4">
            {SECURITY_DATA_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-7 text-zinc-700">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <p className="text-sm leading-6 text-zinc-600">
            Questions about security or data? Email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-emerald-700 hover:text-emerald-800">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{SUPPORT_EMAIL_SAFETY_NOTE}</p>
        </div>

        <p className="mt-6 text-xs leading-5 text-zinc-500">
          This page describes current practice during early access and may be updated as SettleMap adds features. It
          is not a substitute for a full privacy policy or terms of service, which will be published before paid
          launch.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/privacy" className="rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
            Read privacy policy
          </Link>
          <Link href="/disclaimer" className="rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
            Read the disclaimer
          </Link>
        </div>
      </div>
    </section>
  );
}
