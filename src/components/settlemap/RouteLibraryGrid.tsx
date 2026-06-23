"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

type Complexity = "Low" | "Medium" | "High";

type Corridor = {
  id: string;
  route: string;
  whoFor: string;
  moveType: string;
  category: string;
  processingSpeed: string;
  complexity: Complexity;
  focus: string[];
  href: string;
};

const FILTERS = ["All Corridors", "Corporate Transfers", "Student Moves", "Family Moves", "Returning Home", "Domestic Moves", "Retirement"] as const;

const corridors: Corridor[] = [
  {
    id: "india-singapore",
    route: "India to Singapore",
    whoFor: "Tech professionals, EP and Dependant Pass families",
    moveType: "Corporate transfer / job offer",
    category: "Corporate Transfers",
    processingSpeed: "4 to 8 weeks",
    complexity: "Low",
    focus: ["Work pass", "Rental search", "School research", "Banking"],
    href: "/start?from=india&to=singapore&reason=job",
  },
  {
    id: "singapore-india",
    route: "Singapore to India",
    whoFor: "Returning professionals and families",
    moveType: "Returning home",
    category: "Returning Home",
    processingSpeed: "3 to 6 weeks",
    complexity: "Medium",
    focus: ["NRI paperwork", "Banking", "Home setup", "School transfer"],
    href: "/start?from=singapore&to=india&reason=returning",
  },
  {
    id: "singapore-australia",
    route: "Singapore to Australia",
    whoFor: "Corporate transfers with school-age children",
    moveType: "Corporate transfer",
    category: "Corporate Transfers",
    processingSpeed: "6 to 10 weeks",
    complexity: "Medium",
    focus: ["Visa class", "Rental competition", "School zones", "Medicare"],
    href: "/start?from=singapore&to=australia&reason=corporate",
  },
  {
    id: "usa-india",
    route: "USA to India",
    whoFor: "Returning founders and senior professionals",
    moveType: "Returning home",
    category: "Returning Home",
    processingSpeed: "4 to 8 weeks",
    complexity: "Medium",
    focus: ["Tax residency", "Banking", "Home setup", "Reverse logistics"],
    href: "/start?from=united-states&to=india&reason=returning",
  },
  {
    id: "uk-uae",
    route: "UK to UAE",
    whoFor: "Finance and tech professionals, families",
    moveType: "Corporate transfer / job offer",
    category: "Corporate Transfers",
    processingSpeed: "3 to 6 weeks",
    complexity: "Low",
    focus: ["Residence visa", "Housing deposits", "School fees", "Insurance"],
    href: "/start?from=united-kingdom&to=united-arab-emirates&reason=corporate",
  },
  {
    id: "usa-domestic",
    route: "USA domestic move",
    whoFor: "Solo movers, couples and families changing states",
    moveType: "Domestic move",
    category: "Domestic Moves",
    processingSpeed: "2 to 4 weeks",
    complexity: "Low",
    focus: ["Lease handover", "Movers", "Address changes", "School transfer"],
    href: "/start?from=united-states&to=united-states&reason=domestic",
  },
  {
    id: "singapore-domestic",
    route: "Singapore domestic move",
    whoFor: "Renters and families relocating within Singapore",
    moveType: "Domestic move",
    category: "Domestic Moves",
    processingSpeed: "1 to 3 weeks",
    complexity: "Low",
    focus: ["Lease handover", "Movers", "Utilities", "Local registrations"],
    href: "/start?from=singapore&to=singapore&reason=domestic",
  },
  {
    id: "canada-portugal",
    route: "Canada to Portugal",
    whoFor: "Retirees and lifestyle movers",
    moveType: "Retirement / lifestyle move",
    category: "Retirement",
    processingSpeed: "8 to 14 weeks",
    complexity: "High",
    focus: ["Residence route", "Healthcare access", "NIF and banking", "Pension planning"],
    href: "/start?from=canada&to=portugal&reason=retirement",
  },
  {
    id: "india-uk",
    route: "India to UK",
    whoFor: "Skilled workers, students and families",
    moveType: "Student move / job offer",
    category: "Student Moves",
    processingSpeed: "6 to 10 weeks",
    complexity: "Medium",
    focus: ["Visa and BRP", "NHS registration", "Rental deposits", "School catchments"],
    href: "/start?from=india&to=united-kingdom&reason=student",
  },
  {
    id: "india-uae",
    route: "India to UAE",
    whoFor: "Families and professionals",
    moveType: "Family move",
    category: "Family Moves",
    processingSpeed: "3 to 6 weeks",
    complexity: "Low",
    focus: ["Residence visa", "School fees", "Rental deposits", "Medical insurance"],
    href: "/start?from=india&to=united-arab-emirates&reason=family",
  },
  {
    id: "india-germany",
    route: "India to Germany / EU",
    whoFor: "Skilled workers and students",
    moveType: "Student move",
    category: "Student Moves",
    processingSpeed: "8 to 12 weeks",
    complexity: "High",
    focus: ["Visa route", "City registration", "Health insurance", "Language"],
    href: "/start?from=india&to=germany-eu&reason=student",
  },
  {
    id: "india-australia",
    route: "India to Australia",
    whoFor: "Skilled migrants, PR holders and families",
    moveType: "Family move / PR migration",
    category: "Family Moves",
    processingSpeed: "8 to 16 weeks",
    complexity: "Medium",
    focus: ["Visa route", "City selection", "School zones", "Banking"],
    href: "/start?from=india&to=australia&reason=family",
  },
  {
    id: "india-canada",
    route: "India to Canada",
    whoFor: "Families with school-age children planning a move together",
    moveType: "Family move",
    category: "Family Moves",
    processingSpeed: "8 to 16 weeks",
    complexity: "Medium",
    focus: ["Housing research", "School timing", "Healthcare setup", "Official source checks"],
    href: "/start?from=india&to=canada&reason=family",
  },
];

const complexityStyles: Record<Complexity, string> = {
  Low: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-rose-50 text-rose-700",
};

export function RouteLibraryGrid() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All Corridors");

  const filtered = useMemo(() => {
    if (activeFilter === "All Corridors") return corridors;
    return corridors.filter((corridor) => corridor.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Filter by category</p>
        <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={
                activeFilter === filter
                  ? "rounded-full bg-emerald-600 px-4 py-2 text-left text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out lg:rounded-xl"
                  : "rounded-full border border-zinc-200/80 bg-white px-4 py-2 text-left text-sm font-semibold text-zinc-600 transition-all duration-200 ease-in-out hover:border-zinc-300 lg:rounded-xl"
              }
            >
              {filter}
            </button>
          ))}
        </div>
      </aside>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((corridor) => (
          <article key={corridor.id} className="flex flex-col rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500">{corridor.category}</span>
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${complexityStyles[corridor.complexity]}`}>{corridor.complexity} complexity</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-zinc-900">{corridor.route}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{corridor.whoFor}</p>
            <dl className="mt-4 space-y-1.5 text-xs text-zinc-500">
              <div className="flex justify-between gap-3">
                <dt className="font-semibold text-zinc-400">Move type</dt>
                <dd className="text-right text-zinc-600">{corridor.moveType}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="font-semibold text-zinc-400">Processing speed</dt>
                <dd className="text-right text-zinc-600">{corridor.processingSpeed}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              {corridor.focus.map((item) => (
                <span key={item} className="rounded-full bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-500">{item}</span>
              ))}
            </div>
            <Link
              href={corridor.href}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-emerald-700"
            >
              Open route plan <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
