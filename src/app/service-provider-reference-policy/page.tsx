import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";

export const metadata: Metadata = {
  title: "Service Provider Reference Policy",
  description: "How SettleMap handles official links, provider references, commercial links and user verification.",
};

const policyPoints = [
  "Official links appear first where available and reviewed.",
  "Commercial providers, apps or websites are for research convenience only.",
  "SettleMap does not recommend, verify, rank or endorse providers.",
  "SettleMap does not guarantee price, availability, licensing, quality, suitability or outcomes.",
  "Users must verify requirements, credentials, fees, terms, reviews and licensing directly before acting.",
  "Affiliate or partner links, if added later, must be clearly labelled.",
  "SettleMap does not contact providers, book services, submit applications or make payments on behalf of users today.",
];

export default function ServiceProviderReferencePolicyPage() {
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-12">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
            <ShieldCheck className="h-7 w-7 text-emerald-700" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Provider reference policy</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            How SettleMap handles provider references
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-600">
            SettleMap is a planning and research support tool. It may show categories, scripts and reference links to help users organise their own research, but it is not a marketplace, concierge, adviser, agent or provider-ranking service.
          </p>

          <div className="mt-8 space-y-3">
            {policyPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                <p className="text-sm leading-6 text-zinc-700">{point}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            Planning support only. SettleMap does not provide legal, immigration, tax, financial, property, insurance, medical, school admission, government or vendor advice. Always verify important details with official sources or qualified professionals.
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/reference-links" className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
              View research links <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/services" className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:border-zinc-400">
              View service categories
            </Link>
          </div>
        </div>

        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
