import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "SettleMap safety, advice, and content boundaries.",
};

const boundaries = [
  "We do not provide visa, immigration, legal, tax, financial, medical, insurance, housing, school admission, or vendor advice.",
  "We do not guarantee visas, jobs, housing, banking, school admission, tax outcomes, insurance outcomes, vendor quality, or official approvals.",
  "Relocation rules, costs, and local processes change. Always verify current requirements with official government sources and qualified professionals.",
  "Contributor stories are personal experiences, not universal instructions.",
  "External links are provided for convenience and should be checked directly before taking action.",
  "Service provider listings or categories are not endorsements, guarantees, or official recommendations.",
  "The future AI assistant should provide checklist-style planning guidance only and must route rule-sensitive topics to official sources or qualified professionals.",
];

export default function DisclaimerPage() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-8 rounded-[2rem] bg-white p-8 shadow-sm sm:p-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-[#f8f6f1] shadow-sm lg:order-2">
          <Image
            src="/images/official_links_trust.png"
            alt="Trust shield, checklist, and official source link icons representing SettleMap content boundaries"
            width={1448}
            height={1086}
            className="h-auto w-full object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Trust and safety</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">Disclaimer</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            SettleMap is an experience-backed relocation information product. It is designed to help users ask better questions, prepare practical checklists, and find official sources faster.
          </p>
          <div className="mt-8 space-y-4">
            {boundaries.map((item) => (
              <div key={item} className="rounded-2xl bg-[#f8f6f1] p-5 text-sm leading-6 text-slate-700">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
