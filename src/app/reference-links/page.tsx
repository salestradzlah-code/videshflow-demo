import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";

export const metadata: Metadata = {
  title: "Reference Links",
  description: "Reference links are being reviewed. The Singapore route will be added first.",
};

const comingSoonCategories = [
  "Immigration",
  "Housing - HDB and private rental",
  "Healthcare",
  "Schooling",
  "Tax",
  "Banking",
  "Insurance",
  "Transport",
  "Pets",
];

const singaporeFirst = [
  "Groceries and cultural provision stores",
  "Rental portals and neighbourhood research",
  "Local SIM, broadband, and transport apps",
  "Supermarkets and online shopping",
  "Community groups and family support",
];

export default function ReferenceLinksPage() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Research links</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">Reference Links</h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
            Reference Links are being reviewed. The Singapore route will be added first.
          </p>
          <div className="mt-6 rounded-3xl border border-[#f2c56b]/70 bg-[#fff8df] p-5 text-sm leading-6 text-[#68420c]">
            These links are provided for convenience and research only. They are not endorsements, recommendations, guarantees, or official partnerships. Users must verify pricing, rules, availability, reviews, licensing, and terms directly before taking action.
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex items-start gap-4">
            <Clock className="mt-1 h-7 w-7 flex-none text-[#9a6a20]" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Coming soon</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#172326]">Categories planned for review</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Each category below is being reviewed for accuracy before publishing. Nothing here is final, and no links are live yet outside the Singapore section.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {comingSoonCategories.map((category) => (
                  <span key={category} className="rounded-full bg-[#123638]/5 px-4 py-2 text-sm font-medium text-[#123638]">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] bg-[#123638] p-8 text-white shadow-sm sm:p-10">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 h-8 w-8 flex-none text-[#f2c56b]" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2c56b]">Singapore first</p>
              <h2 className="mt-3 text-2xl font-semibold">Singapore specific links will be reviewed first</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
                SettleMap will start with Singapore because the move is highly practical: rent, commute, SIM, groceries, schools, temporary stay, and first-month home setup matter immediately.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {singaporeFirst.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-medium text-white/85">{item}</div>
                ))}
              </div>
              <Link href="/countries/singapore" className="mt-7 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#123638]">
                Open Singapore guide <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
