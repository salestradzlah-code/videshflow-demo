"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Briefcase, GraduationCap, Heart, Home, Map, MapPin, Users } from "lucide-react";

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
  studentChips?: string[];
};

type FilterEntry = {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const FILTERS: FilterEntry[] = [
  { label: "All Corridors", Icon: Map },
  { label: "Corporate Transfers", Icon: Briefcase },
  { label: "Student Moves", Icon: GraduationCap },
  { label: "Family Moves", Icon: Users },
  { label: "Returning Home", Icon: Home },
  { label: "Domestic Moves", Icon: MapPin },
  { label: "Retirement", Icon: Heart },
];

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
    studentChips: ["SIM/OTP", "Student pass", "Accommodation", "Banking", "Health/insurance", "Parents checklist"],
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
    whoFor: "Students and skilled workers on Tier 4 and Skilled Worker visas",
    moveType: "Student move / job offer",
    category: "Student Moves",
    processingSpeed: "6 to 10 weeks",
    complexity: "Medium",
    focus: ["Visa and BRP", "NHS registration", "Rental deposits", "School catchments"],
    href: "/start?from=india&to=united-kingdom&reason=student",
    studentChips: ["SIM/OTP", "Accommodation", "Packing", "Campus arrival", "Banking", "Health/insurance", "Parents checklist"],
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
    whoFor: "Students and skilled workers on national D-visa",
    moveType: "Student move",
    category: "Student Moves",
    processingSpeed: "8 to 12 weeks",
    complexity: "High",
    focus: ["Visa route", "City registration", "Health insurance", "Language"],
    href: "/start?from=india&to=germany-eu&reason=student",
    studentChips: ["SIM/OTP", "Accommodation", "Packing", "Campus arrival", "Banking", "Health/insurance", "Parents checklist"],
  },
  {
    id: "india-australia",
    route: "India to Australia",
    whoFor: "Students, skilled migrants, PR holders and families",
    moveType: "Student move / family move",
    category: "Student Moves",
    processingSpeed: "8 to 16 weeks",
    complexity: "Medium",
    focus: ["Visa route", "City selection", "School zones", "Banking"],
    href: "/start?from=india&to=australia&reason=student",
    studentChips: ["SIM/OTP", "Accommodation", "Packing", "Campus arrival", "Banking", "Health/insurance", "Parents checklist"],
  },
  {
    id: "india-canada",
    route: "India to Canada",
    whoFor: "Students and families with school-age children",
    moveType: "Student move / family move",
    category: "Student Moves",
    processingSpeed: "8 to 16 weeks",
    complexity: "Medium",
    focus: ["Housing research", "School timing", "Healthcare setup", "Official source checks"],
    href: "/start?from=india&to=canada&reason=student",
    studentChips: ["SIM/OTP", "Accommodation", "Packing", "Campus arrival", "Banking", "Health/insurance", "Parents checklist"],
  },
  {
    id: "india-usa",
    route: "India to USA",
    whoFor: "Students on F-1 visa and professionals on H-1B",
    moveType: "Student move / job offer",
    category: "Student Moves",
    processingSpeed: "8 to 14 weeks",
    complexity: "High",
    focus: ["F-1 or H-1B", "SSN process", "Housing", "Health insurance"],
    href: "/start?from=india&to=united-states&reason=student",
    studentChips: ["SIM/OTP", "Accommodation", "Packing", "Campus arrival", "Banking", "Health/insurance", "Parents checklist"],
  },
];

const complexityStyles: Record<Complexity, string> = {
  Low: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-rose-50 text-rose-700",
};

const categoryStyles: Record<string, string> = {
  "Corporate Transfers": "bg-sky-50 text-sky-700",
  "Student Moves": "bg-emerald-50 text-emerald-700",
  "Family Moves": "bg-violet-50 text-violet-700",
  "Returning Home": "bg-amber-50 text-amber-700",
  "Domestic Moves": "bg-zinc-100 text-zinc-600",
  "Retirement": "bg-rose-50 text-rose-700",
};

const categoryBorderLeft: Record<string, string> = {
  "Corporate Transfers": "border-l-sky-400",
  "Student Moves": "border-l-emerald-400",
  "Family Moves": "border-l-violet-400",
  "Returning Home": "border-l-amber-400",
  "Domestic Moves": "border-l-slate-400",
  "Retirement": "border-l-rose-400",
};

// Derive category → icon from FILTERS so there is one source of truth
const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = Object.fromEntries(
  FILTERS.filter((f) => f.label !== "All Corridors").map((f) => [f.label, f.Icon])
);

const studentChipStyle = "rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700 border border-teal-200";

export function RouteLibraryGrid() {
  const [activeFilter, setActiveFilter] = useState<string>("All Corridors");

  const filtered = useMemo(() => {
    if (activeFilter === "All Corridors") return corridors;
    return corridors.filter((corridor) => corridor.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Filter by category</p>
        <div className="mt-3 hidden flex-col gap-1.5 lg:flex">
          {FILTERS.map(({ label, Icon }) => (
            <button
              key={label}
              onClick={() => setActiveFilter(label)}
              className={
                activeFilter === label
                  ? "flex items-center gap-2.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-left text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out"
                  : "flex items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-left text-sm font-semibold text-zinc-600 transition-all duration-200 ease-in-out hover:border-zinc-300"
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>
        {/* Mobile scroll chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {FILTERS.map(({ label, Icon }) => (
            <button
              key={label}
              onClick={() => setActiveFilter(label)}
              className={
                activeFilter === label
                  ? "flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all"
                  : "flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-600 transition-all hover:border-zinc-300"
              }
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </aside>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((corridor) => (
          <article key={corridor.id} className={`flex flex-col rounded-xl border border-zinc-200/80 border-l-4 ${categoryBorderLeft[corridor.category] ?? "border-l-zinc-300"} bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md`}>
            <div className="flex items-center justify-between gap-3">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${categoryStyles[corridor.category] ?? "bg-zinc-100 text-zinc-500"}`}>
                {(() => { const CatIcon = categoryIconMap[corridor.category]; return CatIcon ? <CatIcon className="h-3 w-3 shrink-0" /> : null; })()}
                {corridor.category}
              </span>
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${complexityStyles[corridor.complexity]}`}>{corridor.complexity}</span>
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
            {corridor.studentChips && corridor.studentChips.length > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-teal-600">Student stress points</p>
                <div className="flex flex-wrap gap-1.5">
                  {corridor.studentChips.map((chip) => (
                    <span key={chip} className={studentChipStyle}>{chip}</span>
                  ))}
                </div>
              </div>
            )}
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
