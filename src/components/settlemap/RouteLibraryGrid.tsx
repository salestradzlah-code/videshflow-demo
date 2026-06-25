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

const corridorSeeds: Array<Omit<Corridor, "id" | "href">> = [
  // Corporate Transfers
  { route: "India to Singapore", whoFor: "Tech, finance and operations professionals with employer or job-offer moves", moveType: "Corporate transfer / job offer", category: "Corporate Transfers", processingSpeed: "4 to 8 weeks", complexity: "Low", focus: ["Work pass", "Temporary stay", "Banking", "Family setup"], studentChips: ["Pass timing", "Rental deposit", "Local SIM", "School research"] },
  { route: "Singapore to Australia", whoFor: "Corporate transferees and families relocating to Australian cities", moveType: "Corporate transfer", category: "Corporate Transfers", processingSpeed: "6 to 10 weeks", complexity: "Medium", focus: ["Visa subclass", "Rental competition", "School zones", "Healthcare"], studentChips: ["Medicare/cover", "School zones", "Pet rules"] },
  { route: "UK to UAE", whoFor: "Finance, consulting, aviation and technology professionals", moveType: "Corporate transfer / job offer", category: "Corporate Transfers", processingSpeed: "3 to 6 weeks", complexity: "Low", focus: ["Residence visa", "Housing deposits", "Insurance", "School fees"], studentChips: ["Employer documents", "Rental cheques", "School availability"] },
  { route: "India to UAE", whoFor: "Professionals and families moving for Gulf employment", moveType: "Corporate transfer / job offer", category: "Corporate Transfers", processingSpeed: "3 to 6 weeks", complexity: "Low", focus: ["Employment visa", "Medical test", "Housing", "Banking"], studentChips: ["Attestation", "Insurance", "School fees"] },
  { route: "USA to Singapore", whoFor: "Regional HQ transfers, founders and senior operators", moveType: "Corporate transfer", category: "Corporate Transfers", processingSpeed: "4 to 8 weeks", complexity: "Medium", focus: ["Work pass", "Tax exit", "Housing", "School research"], studentChips: ["Tax residency", "Shipping", "Dependent pass"] },
  { route: "Germany to Netherlands", whoFor: "EU professionals and families changing work location", moveType: "Corporate transfer", category: "Corporate Transfers", processingSpeed: "2 to 5 weeks", complexity: "Low", focus: ["Municipal registration", "Healthcare", "Lease handover", "Payroll"], studentChips: ["Address registration", "Health insurance", "Payroll ID"] },
  { route: "India to Germany", whoFor: "Skilled workers, blue-card applicants and employer-sponsored movers", moveType: "Corporate transfer / job offer", category: "Corporate Transfers", processingSpeed: "8 to 14 weeks", complexity: "High", focus: ["Visa appointment", "Anmeldung", "Health insurance", "Language"], studentChips: ["Blocked timeline", "City registration", "Rental proof"] },
  { route: "Philippines to Singapore", whoFor: "Healthcare, domestic, hospitality and corporate workers", moveType: "Corporate transfer / job offer", category: "Corporate Transfers", processingSpeed: "4 to 8 weeks", complexity: "Medium", focus: ["Work pass", "Employer docs", "Temporary stay", "Remittance"], studentChips: ["Pass status", "Accommodation", "Banking"] },

  // Student Moves
  { route: "India to UK", whoFor: "Students and parents preparing a UK university move", moveType: "Student move", category: "Student Moves", processingSpeed: "6 to 10 weeks", complexity: "Medium", focus: ["Student visa", "CAS", "Accommodation", "Banking"], studentChips: ["SIM/OTP", "BRP/eVisa", "NHS", "Packing"] },
  { route: "India to Australia", whoFor: "Students preparing for Australian university intake", moveType: "Student move", category: "Student Moves", processingSpeed: "8 to 16 weeks", complexity: "Medium", focus: ["Student visa", "OSHC", "Housing", "Arrival setup"], studentChips: ["CoE", "OSHC", "Rental bond", "Campus arrival"] },
  { route: "India to Canada", whoFor: "Students and parents planning Canadian intake", moveType: "Student move", category: "Student Moves", processingSpeed: "8 to 16 weeks", complexity: "Medium", focus: ["Study permit", "Housing", "Healthcare wait", "Banking"], studentChips: ["GIC", "Permit letters", "Winter packing", "SIN"] },
  { route: "India to USA", whoFor: "F-1 students and families preparing US arrival", moveType: "Student move", category: "Student Moves", processingSpeed: "8 to 14 weeks", complexity: "High", focus: ["F-1 visa", "SEVIS", "Housing", "Health insurance"], studentChips: ["I-20", "SSN eligibility", "Campus health", "Banking"] },
  { route: "China to Australia", whoFor: "International students and families preparing Australian study", moveType: "Student move", category: "Student Moves", processingSpeed: "8 to 14 weeks", complexity: "Medium", focus: ["Student visa", "OSHC", "Accommodation", "Banking"], studentChips: ["CoE", "Student services", "SIM", "Rental bond"] },
  { route: "Malaysia to Singapore", whoFor: "Students crossing into Singapore schools, polytechnics or universities", moveType: "Student move", category: "Student Moves", processingSpeed: "3 to 8 weeks", complexity: "Low", focus: ["Student pass", "Accommodation", "Transport", "Banking"], studentChips: ["ICA/MOM checks", "Daily transport", "SIM", "Hostel"] },
  { route: "Indonesia to Singapore", whoFor: "Students and families preparing a Singapore campus move", moveType: "Student move", category: "Student Moves", processingSpeed: "4 to 8 weeks", complexity: "Medium", focus: ["Student pass", "Housing", "Banking", "Healthcare"], studentChips: ["IPA", "Accommodation", "Local guardian", "SIM"] },
  { route: "Vietnam to Germany", whoFor: "Students preparing German university and language-school moves", moveType: "Student move", category: "Student Moves", processingSpeed: "10 to 18 weeks", complexity: "High", focus: ["Visa appointment", "Blocked account", "Insurance", "Anmeldung"], studentChips: ["APS/checks", "Blocked account", "Language", "Housing proof"] },
  { route: "Singapore to UK", whoFor: "Students leaving Singapore for UK university", moveType: "Student move", category: "Student Moves", processingSpeed: "6 to 10 weeks", complexity: "Medium", focus: ["Student visa", "Accommodation", "NHS", "Banking"], studentChips: ["CAS", "eVisa", "Packing", "Bank card"] },
  { route: "Singapore to Australia", whoFor: "Students preparing Australian university or foundation study", moveType: "Student move", category: "Student Moves", processingSpeed: "6 to 12 weeks", complexity: "Medium", focus: ["Student visa", "OSHC", "Housing", "Arrival setup"], studentChips: ["CoE", "OSHC", "Rental bond", "Local SIM"] },

  // Family Moves
  { route: "India to Canada", whoFor: "Families planning school, housing and healthcare setup", moveType: "Family move", category: "Family Moves", processingSpeed: "10 to 18 weeks", complexity: "High", focus: ["School timing", "Healthcare", "Housing", "Budget"], studentChips: ["School records", "Winter clothing", "Family doctor", "Banking"] },
  { route: "India to Australia", whoFor: "Families moving for work, PR or long-term settlement", moveType: "Family move", category: "Family Moves", processingSpeed: "8 to 16 weeks", complexity: "Medium", focus: ["Visa route", "School zones", "Rental bond", "Healthcare"], studentChips: ["School catchment", "Medicare/cover", "Pet rules"] },
  { route: "Singapore to Canada", whoFor: "Families relocating for work, study or long-term settlement", moveType: "Family move", category: "Family Moves", processingSpeed: "8 to 16 weeks", complexity: "Medium", focus: ["Housing", "School entry", "Healthcare", "Tax exit"], studentChips: ["School transfer", "Health card", "Winter setup"] },
  { route: "UK to Australia", whoFor: "Families and couples moving to Australian cities", moveType: "Family move", category: "Family Moves", processingSpeed: "8 to 16 weeks", complexity: "Medium", focus: ["Visa subclass", "School zones", "Shipping", "Healthcare"], studentChips: ["Rental competition", "School enrolment", "Pet quarantine"] },
  { route: "USA to Canada", whoFor: "Cross-border families and professionals", moveType: "Family move", category: "Family Moves", processingSpeed: "4 to 10 weeks", complexity: "Medium", focus: ["Status", "Healthcare", "Tax", "Shipping"], studentChips: ["Tax residency", "Health coverage", "School records"] },
  { route: "UAE to UK", whoFor: "Families returning or relocating from Gulf to UK", moveType: "Family move", category: "Family Moves", processingSpeed: "6 to 12 weeks", complexity: "Medium", focus: ["UKVI route", "School catchment", "NHS", "Housing"], studentChips: ["School place", "NHS", "Deposit", "Weather prep"] },
  { route: "India to New Zealand", whoFor: "Families and skilled migrants planning New Zealand setup", moveType: "Family move", category: "Family Moves", processingSpeed: "10 to 18 weeks", complexity: "High", focus: ["Visa route", "Housing", "Schooling", "Healthcare"], studentChips: ["School zones", "Health cover", "Shipping timeline"] },
  { route: "South Africa to Australia", whoFor: "Families moving for work, study or settlement", moveType: "Family move", category: "Family Moves", processingSpeed: "8 to 16 weeks", complexity: "Medium", focus: ["Visa route", "School zones", "Pet rules", "Shipping"], studentChips: ["Rental proof", "School records", "Pet import"] },

  // Returning Home
  { route: "Singapore to India", whoFor: "Returning professionals, families and students", moveType: "Returning home", category: "Returning Home", processingSpeed: "3 to 6 weeks", complexity: "Medium", focus: ["NRI banking", "Tax status", "Home setup", "School transfer"], studentChips: ["KYC", "SIM reactivation", "School transfer"] },
  { route: "USA to India", whoFor: "Returning founders, professionals and families", moveType: "Returning home", category: "Returning Home", processingSpeed: "4 to 8 weeks", complexity: "Medium", focus: ["Tax residency", "Banking", "Shipping", "Local ID"], studentChips: ["Foreign assets", "Bank KYC", "Phone number"] },
  { route: "UK to India", whoFor: "Returning residents and families moving back to India", moveType: "Returning home", category: "Returning Home", processingSpeed: "4 to 8 weeks", complexity: "Medium", focus: ["Tax exit", "Banking", "School records", "Shipping"], studentChips: ["NRE/NRO", "GP records", "School transfer"] },
  { route: "Australia to India", whoFor: "Returning families, students and professionals", moveType: "Returning home", category: "Returning Home", processingSpeed: "4 to 8 weeks", complexity: "Medium", focus: ["Tax exit", "Shipping", "Banking", "Housing"], studentChips: ["Super/tax", "Bank cards", "Local address"] },
  { route: "UAE to India", whoFor: "Gulf professionals and families returning to India", moveType: "Returning home", category: "Returning Home", processingSpeed: "3 to 6 weeks", complexity: "Low", focus: ["Banking", "School transfer", "Tenancy close", "Shipping"], studentChips: ["End of service", "School records", "Phone number"] },
  { route: "Canada to India", whoFor: "Returning families and professionals", moveType: "Returning home", category: "Returning Home", processingSpeed: "4 to 8 weeks", complexity: "Medium", focus: ["Tax exit", "Healthcare records", "Banking", "Shipping"], studentChips: ["CRA/tax", "Health records", "KYC"] },
  { route: "Singapore to Malaysia", whoFor: "Cross-border returners and families", moveType: "Returning home", category: "Returning Home", processingSpeed: "2 to 5 weeks", complexity: "Low", focus: ["Address change", "Banking", "Transport", "School transfer"], studentChips: ["Customs", "Phone plans", "School records"] },
  { route: "Hong Kong to Singapore", whoFor: "Returning Singapore residents and regional professionals", moveType: "Returning home", category: "Returning Home", processingSpeed: "3 to 6 weeks", complexity: "Low", focus: ["Housing", "Banking", "Schooling", "Tax"], studentChips: ["CPF/tax", "School entry", "Rental timing"] },

  // Domestic Moves
  { route: "USA domestic move", whoFor: "State-to-state solo movers, couples and families", moveType: "Domestic move", category: "Domestic Moves", processingSpeed: "2 to 4 weeks", complexity: "Low", focus: ["Lease handover", "Movers", "Address changes", "Utilities"], studentChips: ["DMV", "School transfer", "Utilities"] },
  { route: "India domestic metro move", whoFor: "Families and professionals moving between Indian metros", moveType: "Domestic move", category: "Domestic Moves", processingSpeed: "1 to 4 weeks", complexity: "Low", focus: ["Packers", "Rental deposit", "School transfer", "Utilities"], studentChips: ["KYC address", "Internet", "Local transport"] },
  { route: "Australia interstate move", whoFor: "Families and professionals changing Australian states", moveType: "Domestic move", category: "Domestic Moves", processingSpeed: "2 to 5 weeks", complexity: "Low", focus: ["Rental bond", "Medicare details", "Licence", "Movers"], studentChips: ["School zones", "Driver licence", "Utilities"] },
  { route: "UK city to city move", whoFor: "Renters, students and families moving within the UK", moveType: "Domestic move", category: "Domestic Moves", processingSpeed: "1 to 4 weeks", complexity: "Low", focus: ["Council tax", "GP", "Tenancy", "Utilities"], studentChips: ["Council tax", "GP registration", "School catchment"] },
  { route: "Canada province to province move", whoFor: "Families and workers changing provinces", moveType: "Domestic move", category: "Domestic Moves", processingSpeed: "2 to 6 weeks", complexity: "Medium", focus: ["Health card", "Driver licence", "School records", "Lease"], studentChips: ["Healthcare wait", "School board", "Licence swap"] },
  { route: "Germany city move", whoFor: "Renters and families relocating within Germany", moveType: "Domestic move", category: "Domestic Moves", processingSpeed: "1 to 4 weeks", complexity: "Low", focus: ["Anmeldung", "Lease", "Utilities", "Insurance"], studentChips: ["City registration", "Internet setup", "Deposit"] },
  { route: "UAE Dubai to Abu Dhabi move", whoFor: "Professionals and families relocating within UAE", moveType: "Domestic move", category: "Domestic Moves", processingSpeed: "1 to 3 weeks", complexity: "Low", focus: ["Tenancy", "Utilities", "School bus", "Transport"], studentChips: ["Ejari/Tawtheeq", "DEWA/ADDC", "School commute"] },
  { route: "Singapore local move", whoFor: "Renters and families relocating within Singapore", moveType: "Domestic move", category: "Domestic Moves", processingSpeed: "1 to 3 weeks", complexity: "Low", focus: ["Lease handover", "Movers", "Utilities", "Address updates"], studentChips: ["HDB/URA rules", "SP utilities", "School commute"] },

  // Retirement
  { route: "Canada to Portugal", whoFor: "Retirees and lifestyle movers researching Portugal setup", moveType: "Retirement / lifestyle move", category: "Retirement", processingSpeed: "8 to 14 weeks", complexity: "High", focus: ["Residence route", "Healthcare", "NIF/banking", "Housing"], studentChips: ["Pension timing", "Healthcare access", "Tax advice"] },
  { route: "UK to Spain", whoFor: "Retirees and second-home movers", moveType: "Retirement / lifestyle move", category: "Retirement", processingSpeed: "6 to 12 weeks", complexity: "Medium", focus: ["Residence", "Healthcare", "Banking", "Housing"], studentChips: ["Healthcare access", "Tax residency", "Driving licence"] },
  { route: "USA to Mexico", whoFor: "Retirees and remote lifestyle movers", moveType: "Retirement / lifestyle move", category: "Retirement", processingSpeed: "4 to 10 weeks", complexity: "Medium", focus: ["Residence", "Healthcare", "Banking", "Housing"], studentChips: ["US tax", "Medical cover", "Local banking"] },
  { route: "Singapore to Malaysia", whoFor: "Retirees and lifestyle movers near family or lower-cost cities", moveType: "Retirement / lifestyle move", category: "Retirement", processingSpeed: "4 to 10 weeks", complexity: "Medium", focus: ["Long-stay route", "Healthcare", "Banking", "Housing"], studentChips: ["Healthcare", "Car/transport", "Banking"] },
  { route: "Australia to New Zealand", whoFor: "Retirees and family-linked movers", moveType: "Retirement / lifestyle move", category: "Retirement", processingSpeed: "4 to 8 weeks", complexity: "Low", focus: ["Residence rights", "Healthcare", "Pension", "Housing"], studentChips: ["Pension rules", "Healthcare", "Shipping"] },
  { route: "UK to Portugal", whoFor: "Retirees and lifestyle movers researching Portugal", moveType: "Retirement / lifestyle move", category: "Retirement", processingSpeed: "8 to 14 weeks", complexity: "High", focus: ["Residence route", "Healthcare", "NIF/banking", "Tax"], studentChips: ["Pension", "Tax advice", "Healthcare"] },
  { route: "Germany to Spain", whoFor: "EU retirees and lifestyle movers", moveType: "Retirement / lifestyle move", category: "Retirement", processingSpeed: "4 to 8 weeks", complexity: "Low", focus: ["Registration", "Healthcare", "Banking", "Housing"], studentChips: ["EU healthcare", "Municipal registration", "Tax"] },
  { route: "USA to Portugal", whoFor: "Retirees and remote lifestyle movers researching Portugal", moveType: "Retirement / lifestyle move", category: "Retirement", processingSpeed: "8 to 14 weeks", complexity: "High", focus: ["Residence route", "Healthcare", "Banking", "Tax"], studentChips: ["US tax", "Healthcare", "NIF"] },
];

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function reasonFor(category: string): string {
  if (category === "Student Moves") return "student";
  if (category === "Family Moves") return "family";
  if (category === "Returning Home") return "returning";
  if (category === "Domestic Moves") return "domestic";
  if (category === "Retirement") return "retirement";
  return "corporate";
}

function hrefFor(route: string, category: string): string {
  if (route.includes(" to ")) {
    const [from, to] = route.split(" to ");
    return `/start?from=${slugify(from)}&to=${slugify(to)}&reason=${reasonFor(category)}`;
  }
  const base = route.replace(/ domestic move| domestic metro move| interstate move| city to city move| province to province move| city move| local move/gi, "");
  return `/start?from=${slugify(base)}&to=${slugify(base)}&reason=${reasonFor(category)}`;
}

const corridors: Corridor[] = corridorSeeds.map((seed) => ({
  ...seed,
  id: `${slugify(seed.category)}-${slugify(seed.route)}`,
  href: hrefFor(seed.route, seed.category),
}));

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
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-teal-600">Stress points</p>
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
