import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import {
  RESEARCH_LINKS_BOUNDARY_COPY,
  researchLinksRegistry,
} from "@/data/researchLinksRegistry";

export const metadata: Metadata = {
  title: "Research Links",
  description: "Neutral SettleMap research links and official-source starting points for relocation planning.",
};

export default function ReferenceLinksPage() {
  const officialLinks = researchLinksRegistry.filter((link) => link.official);
  const researchOptions = researchLinksRegistry.filter((link) => !link.official);

  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Research links</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">Reference Links</h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-zinc-600">
            Use these as starting points for relocation research. Official links appear first where SettleMap has a reviewed source; otherwise the registry gives safe search guidance without inventing URLs.
          </p>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            {RESEARCH_LINKS_BOUNDARY_COPY}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-700" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Official first</p>
                <h2 className="text-xl font-semibold text-zinc-900">Official and authority sources</h2>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {officialLinks.slice(0, 12).map((link) => (
                <div key={link.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-sm font-semibold text-zinc-900">{link.title}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-emerald-700">{link.country} · {link.category}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{link.description}</p>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">{link.verificationNote}</p>
                  {link.url && (
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                      Open official source <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Research options</p>
            <h2 className="mt-2 text-xl font-semibold text-zinc-900">Categories to compare directly</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Commercial providers, apps and websites may be useful for research convenience, but SettleMap does not recommend, verify, rank or endorse them.
            </p>
            <div className="mt-5 space-y-3">
              {researchOptions.map((link) => (
                <div key={link.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-sm font-semibold text-zinc-900">{link.title}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">{link.category}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{link.description}</p>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">{link.verificationNote}</p>
                  {link.isCommercial && (
                    <p className="mt-2 rounded-lg bg-white px-3 py-2 text-xs leading-5 text-zinc-500">
                      {link.commercialDisclosure}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-zinc-950 p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Provider reference policy</p>
          <h2 className="mt-3 text-2xl font-semibold">How SettleMap treats provider references</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
            Official links appear first where available. Commercial providers, apps or websites are for research convenience only. Affiliate or partner links, if added later, must be clearly labelled.
          </p>
          <Link href="/service-provider-reference-policy" className="mt-6 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950">
            Read provider policy <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
