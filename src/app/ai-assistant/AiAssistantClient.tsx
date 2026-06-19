"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, Bot, CalendarCheck, ClipboardCheck, Home, Languages, PackageCheck, Route, ShieldCheck } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";

type DemoQuestion = {
  prompt: string;
  answer: string[];
};

const demoQuestions: DemoQuestion[] = [
  {
    prompt: "What should I do before leaving my current home?",
    answer: [
      "Give lease notice in writing and confirm the handover or inspection date with your landlord or agent.",
      "Cancel or transfer broadband, WiFi, TV/cable, mobile plan, and utilities — note final billing dates for each.",
      "Cancel gym, club, and other local memberships, and set up mail forwarding or an address change.",
      "If applicable: give notice to school/childcare, a domestic helper or service provider, and decide on selling, shipping, or storing your vehicle.",
    ],
  },
  {
    prompt: "What contracts should I cancel before moving?",
    answer: [
      "Broadband/WiFi, TV/streaming/cable, and mobile plan (downgrade to roaming or cancel, depending on your route).",
      "Utilities — electricity, water, gas — cancelled or transferred to the new occupant.",
      "Local subscriptions and recurring deliveries, gym/club memberships, and any insurance tied to the old address or vehicle.",
      "Keep written confirmation of every cancellation date — useful for final billing disputes.",
    ],
  },
  {
    prompt: "What insurance should I compare before moving?",
    answer: [
      "Travel insurance for the move itself, and health/medical insurance for the destination.",
      "Renter's or home insurance at the new address, and vehicle insurance if you are bringing or buying a vehicle.",
      "If applicable: pet insurance, student insurance, or an employer coverage check for job/corporate transfers.",
      "SettleMap does not sell or advise on insurance. Compare policies and verify directly with licensed professionals/providers.",
    ],
  },
  {
    prompt: "What should I do in my first 7 days?",
    answer: [
      "Day 1-2: activate a local SIM or eSIM, confirm temporary stay, and locate the nearest grocery store and pharmacy.",
      "Day 2-4: open or activate a bank account and payment apps, set up a transport card, and confirm WiFi at your stay.",
      "Day 4-7: start rental viewings if you have not signed a lease, and register for healthcare/GP and any required local services.",
      "Keep your home-country SIM active where possible for OTPs until banking and key accounts are migrated.",
    ],
  },
  {
    prompt: "What should I check if moving with a senior parent?",
    answer: [
      "Confirm medication supply and prescription continuity, plus medical records transfer to a new clinic or GP.",
      "Check accessibility at the new home and look into senior coverage or pre-existing-condition caution for insurance.",
      "Register with a local clinic early and keep emergency contacts and key documents easy to find.",
      "This is general planning guidance only — verify medical and insurance specifics with qualified professionals.",
    ],
  },
  {
    prompt: "What should I check if moving with a pet?",
    answer: [
      "Check import rules, vaccination and microchip requirements, and quarantine policies for the destination — these vary widely and change without notice.",
      "Look for pet-friendly rentals and a local vet near your new home before you arrive.",
      "Compare pet insurance options if available at the destination.",
      "Plan travel logistics (carrier rules, flight booking, layover restrictions) well ahead of the move date.",
    ],
  },
];

const roadmap = [
  { icon: ClipboardCheck, title: "Personal relocation checklist generator" },
  { icon: CalendarCheck, title: "First 7, 30, 90 day timeline" },
  { icon: PackageCheck, title: "Delivery and mover tracking reminder" },
  { icon: Bell, title: "Calendar reminders for appointments" },
  { icon: ClipboardCheck, title: "Document checklist memory" },
  { icon: Home, title: "Rental viewing checklist" },
  { icon: Route, title: "School and childcare planning checklist" },
  { icon: PackageCheck, title: "Packing and baggage planner" },
  { icon: CalendarCheck, title: "Timezone and world clock helper" },
  { icon: Route, title: "Service request routing" },
  { icon: Languages, title: "Multilingual question answering" },
];

const languageExamples = [
  "What is a realistic rent budget for a family in Singapore?",
  "What should I do in the first week in the UK?",
  "How do I keep my home SIM active for OTPs?",
  "How do I plan kids' schooling in Singapore?",
];

export function AiAssistantClient() {
  const [selected, setSelected] = useState<DemoQuestion>(demoQuestions[0]);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">AI relocation assistant</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">Ask practical relocation questions in one place</h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
            This is a demo of how SettleMap&apos;s AI-first relocation assistant will guide users through planning questions, route guides, service categories, and official-source routing. Click a question below to see a sample checklist-style answer.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Cost of living and offer planning",
              "First 7, 30, and 90 day checklists",
              "Documents, packing, medicine, and SIM OTP continuity",
              "Rental research, school planning, groceries, community, and home setup",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm font-semibold text-[#123638]">{item}</div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[2rem] bg-[#123638] p-8 text-white shadow-sm sm:p-10">
            <Bot className="h-9 w-9 text-[#f2c56b]" />
            <h2 className="mt-5 text-2xl font-semibold">Try the assistant demo</h2>
            <p className="mt-4 text-sm leading-7 text-white/75">{selected.prompt}</p>
            <div className="mt-5 space-y-3 rounded-2xl bg-white/10 p-5">
              {selected.answer.map((line) => (
                <p key={line} className="text-sm leading-6 text-white/90">{line}</p>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-white/60">
              Sample demo answer for illustration only. Not legal, immigration, tax, financial, medical, insurance, housing, school admission, travel, or vendor advice.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/countries" className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#123638]">
                Explore guides <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/get-help" className="inline-flex items-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Get help
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
            <ShieldCheck className="h-8 w-8 text-[#123638]" />
            <h2 className="mt-5 text-2xl font-semibold text-[#172326]">AI safety boundary</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The AI assistant does not provide legal, immigration, tax, financial, medical, insurance, housing, school admission, or vendor advice. It helps users prepare better questions, build checklists, and verify rule-sensitive topics with official sources or qualified professionals.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-[#172326]">Suggested questions</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Click a question to load a sample checklist-style answer in the demo panel above.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {demoQuestions.map((item) => (
              <button
                key={item.prompt}
                type="button"
                onClick={() => setSelected(item)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-sm ${
                  selected.prompt === item.prompt
                    ? "border-[#123638] bg-[#123638] text-white"
                    : "border-black/10 bg-[#f8f6f1] text-[#123638]"
                }`}
              >
                {item.prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-black/10 bg-white/60 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Later, not now</p>
          <h2 className="mt-2 text-lg font-semibold text-[#172326]">A few things on the future roadmap</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            These are not built yet. Users should still verify directly with service providers and official sources.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {roadmap.map((item) => (
              <span key={item.title} className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-[#f8f6f1] px-3 py-1.5 text-xs font-medium text-slate-500">
                <item.icon className="h-3.5 w-3.5 text-slate-400" />
                {item.title}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
          <Route className="h-8 w-8 text-[#123638]" />
          <h2 className="mt-5 text-2xl font-semibold text-[#172326]">Personalised by path later</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The AI assistant will use destination, move reason, and family profile to generate more relevant checklist-style answers instead of giving generic relocation text.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Singapore to UK + job offer + family with child",
              "India to UK + student move + solo",
              "United States to UAE + corporate transfer + family",
              "United Kingdom to Canada + PR migration + couple",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm font-semibold text-[#123638]">{item}</div>
            ))}
          </div>
          <Link href="/start" className="mt-7 inline-flex items-center rounded-full bg-[#123638] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0c2829]">
            Start your relocation path <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
          <Languages className="h-8 w-8 text-[#123638]" />
          <h2 className="mt-5 text-2xl font-semibold text-[#172326]">Language support approach</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Prefer another language? You can use your browser translate feature to view this page in your preferred language. The AI assistant is planned to support multiple languages over time.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {languageExamples.map((example) => (
              <div key={example} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm font-semibold text-[#123638]">"{example}"</div>
            ))}
          </div>
        </div>

        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
