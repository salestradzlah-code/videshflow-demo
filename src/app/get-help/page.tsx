import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LifeBuoy, ShieldAlert } from "lucide-react";
import {
  TALLY_FORM_URL,
  SUPPORT_CONTACT_NOTE,
  SUPPORT_CAN_HELP_LATER,
  SUPPORT_CANNOT_HELP,
  SUPPORT_CURRENT_STATUS_NOTE,
  AI_ASSISTANT_DISCLAIMER,
  LANGUAGE_HELP_PAGE_NOTE,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Get Help",
  description: "How to reach SettleMap with billing, technical, or feedback questions. SettleMap does not provide legal, immigration, tax, financial, insurance, medical, property, or school-admission advice.",
};

export default function GetHelpPage() {
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Support</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">Get Help</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
          SettleMap is an early feedback prototype, not a manual consulting service. The fastest way to reach us today
          is the feedback form below.
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">{SUPPORT_CURRENT_STATUS_NOTE}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={TALLY_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-emerald-700"
          >
            <LifeBuoy className="h-4 w-4" /> Give feedback
          </a>
          <a
            href={TALLY_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300"
          >
            Report an issue <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            href="/early-access"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300"
          >
            Join pilot interest <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300"
          >
            Explore service categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">We can help with</p>
            <ul className="mt-4 space-y-2">
              {SUPPORT_CAN_HELP_LATER.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm leading-6 text-zinc-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">We cannot help with</p>
            <ul className="mt-4 space-y-2">
              {SUPPORT_CANNOT_HELP.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm leading-6 text-zinc-700">
                  <ShieldAlert className="mt-0.5 h-4 w-4 flex-none text-zinc-400" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-5 text-zinc-500">{AI_ASSISTANT_DISCLAIMER}</p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <p className="text-sm leading-6 text-zinc-600">{SUPPORT_CONTACT_NOTE}</p>
          <p className="mt-3 text-xs leading-5 text-zinc-500">{LANGUAGE_HELP_PAGE_NOTE}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/pricing" className="rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
            Back to pricing
          </Link>
          <Link href="/disclaimer" className="rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
            Read the disclaimer
          </Link>
        </div>
      </div>
    </section>
  );
}
