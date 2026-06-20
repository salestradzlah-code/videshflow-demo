"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, ShieldAlert, Sparkles, User } from "lucide-react";
import { AI_ASSISTANT_DISCLAIMER } from "@/lib/constants";
import { InfoBanner } from "@/components/ui/InfoBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";

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

const contextChips = [
  "Cost of living and offer planning",
  "First 7, 30, and 90 day checklists",
  "Documents, packing, medicine and SIM OTP continuity",
  "Rental research, school planning and home setup",
];

const plannedNext = [
  "Personal relocation checklist generator",
  "First 7, 30, 90 day timeline sync",
  "Document checklist memory",
  "Multilingual question answering",
];

type TimelineEntry = { prompt: string; answer: string[] };

export function AIAssistantWorkspace() {
  const [history, setHistory] = useState<TimelineEntry[]>([demoQuestions[0]]);

  function ask(question: DemoQuestion) {
    setHistory((current) => [...current, question]);
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="AI relocation assistant"
          title="Ask practical relocation questions in one place"
          description="A demo of how SettleMap's AI-first assistant will guide planning questions, route guides, and service categories. Click a question to add a sample checklist-style answer to the conversation."
        />

        <div className="mt-6">
          <InfoBanner icon={<ShieldAlert className="h-5 w-5" />}>{AI_ASSISTANT_DISCLAIMER}</InfoBanner>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_3fr]">
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Context</p>
              <div className="mt-4 flex flex-col gap-2">
                {contextChips.map((chip) => (
                  <span key={chip} className="rounded-xl bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700">{chip}</span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Try a question</p>
              <div className="mt-4 flex flex-col gap-2">
                {demoQuestions.map((item) => (
                  <button
                    key={item.prompt}
                    type="button"
                    onClick={() => ask(item)}
                    className="rounded-xl border border-zinc-200/80 px-4 py-3 text-left text-sm font-semibold text-zinc-700 transition-all duration-200 ease-in-out hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700"
                  >
                    {item.prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Planned next</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {plannedNext.map((item) => (
                  <span key={item} className="rounded-full bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-500">{item}</span>
                ))}
              </div>
              <Link href="/about" className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                See the full roadmap <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              <Sparkles className="h-4 w-4" /> Conversation
            </div>
            <div className="mt-5 space-y-5">
              {history.map((entry, index) => (
                <div key={`${entry.prompt}-${index}`} className="space-y-3">
                  <div className="flex items-start justify-end gap-3">
                    <div className="max-w-[85%] rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-sm">{entry.prompt}</div>
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500"><User className="h-4 w-4" /></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"><Bot className="h-4 w-4" /></span>
                    <div className="max-w-[85%] rounded-xl border border-zinc-200/80 bg-zinc-50 p-4">
                      <ul className="space-y-2.5">
                        {entry.answer.map((line) => (
                          <li key={line} className="flex gap-2.5 text-sm leading-6 text-zinc-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row">
              <Link href="/countries" className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-emerald-700">
                Explore route library <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/get-help" className="inline-flex items-center justify-center rounded-full border border-zinc-200/80 px-5 py-3 text-sm font-semibold text-zinc-700 transition-all duration-200 ease-in-out hover:border-zinc-300">
                Get help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
