import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "About",
  description: "About SettleMap and why it exists.",
};

const covers = [
  "Route planning by country, city, move reason and family profile",
  "A 90-day adaptive task timeline with progress tracking",
  "Document checklists by move reason and profile",
  "Neutral service categories to research",
  "Mock AI assistant for checklist-style planning questions",
];

const doesNotCover = [
  "Legal, immigration, tax or financial advice",
  "Medical, insurance, housing, or school admission advice",
  "Travel, pet import, or vendor advice",
  "Guarantees of visa, job, housing, or admission outcomes",
  "Real provider bookings or payments",
];

const roadmap = [
  {
    label: "Now",
    items: ["Route wizard and 90-day timeline", "Route library and starter kits", "Mock AI assistant and service directory"],
  },
  {
    label: "Next",
    items: ["Personal checklist memory across sessions", "Document checklist reminders", "More route starter kits"],
  },
  {
    label: "Later",
    items: ["Real AI assistant with route context", "Optional account and saved plans", "Verified provider partnerships"],
  },
];

export default function AboutPage() {
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="About SettleMap" title="Built for the messy middle of relocation" description="A visa approval or move date is only one part of relocating. The harder part is everything that follows." />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200/80 bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">The problem</p>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              People and families relocating across countries and cities need to manage documents, banking, SIM continuity, rentals, school questions, groceries, healthcare and first-month setup — usually with advice scattered across forums, agents and outdated blog posts.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">The product</p>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              SettleMap turns a route, a move reason and a family profile into a structured 90-day plan: tasks, documents, service categories and checklist-style guidance, with official sources kept visible at every step.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Why now</p>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              Cross-border moves keep increasing for work, study, family and retirement, while the planning experience has not caught up. This prototype tests whether a route-first, checklist-first approach actually reduces relocation stress.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Early feedback stage</p>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              This is an early feedback prototype, not a finished product. We are starting with a focused route library, an adaptive planning wizard, and safe public-source guidance — more routes and features will follow based on tester feedback.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200/80 bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">What SettleMap covers</p>
            <ul className="mt-4 space-y-3">
              {covers.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-6 text-zinc-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">What it does not do</p>
            <ul className="mt-4 space-y-3">
              {doesNotCover.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-6 text-zinc-700">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Roadmap</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            {roadmap.map((column) => (
              <div key={column.label} className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{column.label}</span>
                <ul className="mt-4 space-y-2.5">
                  {column.items.map((item) => (
                    <li key={item} className="text-sm leading-6 text-zinc-600">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/countries" className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-emerald-700">
            Explore the route library <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/share-story" className="inline-flex items-center justify-center rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all duration-200 ease-in-out hover:border-zinc-300">
            Share your feedback
          </Link>
        </div>
      </div>
    </section>
  );
}
