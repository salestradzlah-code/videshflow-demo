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
  "Would you pay S$19 for an AI-generated route plan?",
  "Would you pay S$49 for a premium AI relocation pack?",
  "Interested in the SettleMap Voice Guide waitlist?",
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
            We have not built paid AI plans, the Voice Guide, or partner listings yet. This page captures interest so we know
            what to prioritise first. There is no backend here, so every link below opens the same short feedback form.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
            Dedicated early access forms are coming soon. For now, use the general SettleMap feedback form and mention whether you are interested in AI route plan, Premium pack or Voice Guide.
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

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6a20]">AI route plan interest</p>
            <h3 className="mt-2 text-lg font-semibold text-[#172326]">AI-generated route plan (from S$19)</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Register interest in the future self-serve AI-generated route plan. This is the current feedback form — no payment is collected here.</p>
            <a
              href={EARLY_ACCESS_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openForm("paid_plan_interest_clicked", { source: "early_access_page", plan: "ai-route-plan" })}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#123638] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0c2829]"
            >
              Register interest in AI route plan <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6a20]">Premium AI relocation pack interest</p>
            <h3 className="mt-2 text-lg font-semibold text-[#172326]">Premium AI relocation pack (from S$49)</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Register interest in the future premium pack. This is the current feedback form — no payment is collected here.</p>
            <a
              href={EARLY_ACCESS_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openForm("paid_plan_interest_clicked", { source: "early_access_page", plan: "premium-ai-pack" })}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#123638] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0c2829]"
            >
              Register interest in Premium AI relocation pack <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6a20]">SettleMap Voice Guide waitlist</p>
            <h3 className="mt-2 text-lg font-semibold text-[#172326]">SettleMap Voice Guide</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Join the waitlist for the future voice-guided walkthrough. Not available today — this is the current waitlist/feedback form.</p>
            <a
              href={EARLY_ACCESS_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openForm("voice_guide_interest_clicked", { source: "early_access_page" })}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#123638] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0c2829]"
            >
              Join Voice Guide waitlist <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">General feedback</p>
            <h3 className="mt-2 text-lg font-semibold text-[#172326]">Help shape SettleMap</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Have a different question, idea, or issue? Use the same current feedback form below.</p>
            <a
              href={EARLY_ACCESS_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openForm("early_access_clicked", { source: "early_access_page", type: "general_feedback" })}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#123638] hover:bg-slate-50"
            >
              Give product feedback <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-xs leading-6 text-slate-500">
          Partner or referral interest? Use the <a href="/partner-with-us" className="font-semibold text-[#123638] underline hover:no-underline">Partner With Us</a> page instead of this form.
        </p>

        <p className="mt-8 max-w-3xl text-xs leading-6 text-slate-500">{COMMERCIAL_LINKS_NOTE}</p>
        <div className="mt-6"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
