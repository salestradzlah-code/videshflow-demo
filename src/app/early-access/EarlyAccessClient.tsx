"use client";

import { ArrowRight } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { EARLY_ACCESS_FORM_URL, COMMERCIAL_LINKS_NOTE } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

const captureFields = [
  "Email",
  "Route (from / to)",
  "Moving month",
  "User segment: student, working professional, family, domestic mover, or HR/company",
  "Most painful task in your move",
  "Would you pay S$19 for a personalised plan?",
  "Would you pay S$49 for a premium plan?",
  "Interested in a concierge call?",
  "Interested in partner / service recommendations?",
];

const segments = [
  { key: "student", label: "Student" },
  { key: "professional", label: "Working professional" },
  { key: "family", label: "Family" },
  { key: "domestic", label: "Domestic mover" },
  { key: "hr", label: "HR / company" },
];

export function EarlyAccessClient() {
  function openForm(eventName: Parameters<typeof trackEvent>[0], meta?: Record<string, string>) {
    trackEvent(eventName, meta);
  }

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Early access</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">SettleMap early access</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            We have not built paid plans, concierge calls, or partner listings yet. This page captures interest so we know
            what to prioritise first. There is no backend here, so every link below opens the same short feedback form.
          </p>
          <a
            href={EARLY_ACCESS_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openForm("early_access_clicked", { source: "early_access_hero" })}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#123638] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0c2829]"
          >
            Start the early access form <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-dashed border-[#123638]/30 bg-[#123638]/5 p-8">
            <h2 className="text-2xl font-semibold text-[#172326]">Tell us your segment</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Pick the option closest to you. Each button opens the same feedback form — your selection just helps us tag
              the response.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {segments.map((segment) => (
                <a
                  key={segment.key}
                  href={EARLY_ACCESS_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => openForm("early_access_clicked", { source: "segment_chip", segment: segment.key })}
                  className="rounded-full border border-[#123638]/20 bg-white px-4 py-2 text-sm font-semibold text-[#123638] hover:bg-slate-50"
                >
                  {segment.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#172326]">What we want to learn</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {captureFields.map((field) => (
                <div key={field} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm font-medium text-slate-700">{field}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <a
            href={EARLY_ACCESS_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openForm("paid_plan_interest_clicked", { source: "early_access_page" })}
            className="rounded-2xl border border-black/10 bg-white p-5 text-center text-sm font-semibold text-[#123638] hover:bg-slate-50"
          >
            I would pay S$19 / S$49 for a plan
          </a>
          <a
            href={EARLY_ACCESS_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openForm("concierge_interest_clicked", { source: "early_access_page" })}
            className="rounded-2xl border border-black/10 bg-white p-5 text-center text-sm font-semibold text-[#123638] hover:bg-slate-50"
          >
            I want a concierge call
          </a>
          <a
            href={EARLY_ACCESS_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openForm("partner_interest_clicked", { source: "early_access_page" })}
            className="rounded-2xl border border-black/10 bg-white p-5 text-center text-sm font-semibold text-[#123638] hover:bg-slate-50"
          >
            I want partner / service recommendations
          </a>
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-6 text-slate-500">{COMMERCIAL_LINKS_NOTE}</p>
        <div className="mt-6"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
