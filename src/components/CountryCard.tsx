import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { CountryGuide } from "@/data/countries";

export function CountryCard({ country }: { country: CountryGuide }) {
  return (
    <Link
      href={`/countries/${country.slug}`}
      className="group rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-[#f2c56b]/25 px-3 py-1 text-xs font-semibold text-[#80520e]">
          {country.depth}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
          <ShieldCheck className="h-4 w-4" /> {country.riskLevel} risk
        </span>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[#172326]">{country.route}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{country.summary}</p>
      <div className="mt-5 flex items-center text-sm font-semibold text-[#123638]">
        Open route starter kit
        <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
