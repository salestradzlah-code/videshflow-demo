"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flag, MessageSquareText, Route as RouteIcon, Star, UserPlus } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import {
  TALLY_FORM_URL,
  FEEDBACK_WHO_IS_MOVING_OPTIONS,
  FEEDBACK_USEFUL_OPTIONS,
  FEEDBACK_MISSING_OPTIONS,
  FEEDBACK_PLAN_INTEREST_OPTIONS,
} from "@/lib/constants";

// V11.5 Parts 5 & 6 — "Help shape SettleMap" now leads with direct actions instead of ambiguous
// copy-to-clipboard question buttons, and previews the short structured fields the real feedback
// form asks (rating, checkboxes, short fields) instead of five long free-text prompts. The actual
// form lives on Tally — this page is a guide to it, not a second place data is stored.
const directActions = [
  { label: "Open feedback form", description: "Full structured feedback form on Tally.", icon: MessageSquareText, href: TALLY_FORM_URL, external: true },
  { label: "Rate SettleMap", description: "Give a quick 1-5 rating via the same form.", icon: Star, href: TALLY_FORM_URL, external: true },
  { label: "Suggest a route", description: "Tell us a route you wish SettleMap covered.", icon: RouteIcon, href: TALLY_FORM_URL, external: true },
  { label: "Join early access", description: "Get pilot updates and pricing first.", icon: UserPlus, href: "/early-access", external: false },
  { label: "Report an issue", description: "Flag something broken or confusing.", icon: Flag, href: TALLY_FORM_URL, external: true },
];

export function ShareStoryClient() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-8 rounded-[2rem] bg-white p-8 shadow-sm sm:p-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Feedback request</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">Help shape SettleMap</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              This is an early feedback prototype. The form below takes about two minutes — mostly ratings and
              checkboxes, one short text field at the end. Your input helps the next family avoid confusion around
              documents, SIM cards, OTPs, rent, school, healthcare, banking, and first-month setup.
            </p>

            <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {directActions.map((action) =>
                action.external ? (
                  <a
                    key={action.label}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:border-[#123638]/30 hover:bg-[#f8f6f1]"
                  >
                    <action.icon className="mt-0.5 h-4 w-4 flex-none text-[#123638]" />
                    <span>
                      <span className="block text-sm font-semibold text-[#172326]">{action.label}</span>
                      <span className="block text-xs leading-5 text-slate-500">{action.description}</span>
                    </span>
                  </a>
                ) : (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:border-[#123638]/30 hover:bg-[#f8f6f1]"
                  >
                    <action.icon className="mt-0.5 h-4 w-4 flex-none text-[#123638]" />
                    <span>
                      <span className="block text-sm font-semibold text-[#172326]">{action.label}</span>
                      <span className="block text-xs leading-5 text-slate-500">{action.description}</span>
                    </span>
                  </Link>
                )
              )}
            </div>

            <a
              href={TALLY_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#123638] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0c2829]"
            >
              Open feedback form <ArrowRight className="h-4 w-4" />
            </a>

            <div className="mt-8 rounded-3xl border border-dashed border-[#123638]/30 bg-[#123638]/5 p-5">
              <p className="font-semibold text-[#172326]">What the form asks — preview</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Short fields only. Nothing here is submitted from this page — it opens on Tally.</p>
              <ul className="mt-4 space-y-2.5 text-sm leading-6 text-slate-700">
                <li><span className="font-semibold">Overall rating</span> — 1 to 5</li>
                <li><span className="font-semibold">Who is moving</span> — {FEEDBACK_WHO_IS_MOVING_OPTIONS.join(", ")}</li>
                <li><span className="font-semibold">Route</span> — one short field (e.g. India → Singapore)</li>
                <li><span className="font-semibold">What was useful</span> — {FEEDBACK_USEFUL_OPTIONS.join(", ")}</li>
                <li><span className="font-semibold">What was missing</span> — {FEEDBACK_MISSING_OPTIONS.join(", ")}</li>
                <li><span className="font-semibold">Did the plan feel clear</span> — 1 to 5</li>
                <li><span className="font-semibold">Would you use it</span> — Yes / Maybe / No</li>
                <li><span className="font-semibold">Would you pay for a detailed plan</span> — Yes / Maybe / No</li>
                <li><span className="font-semibold">Which plan interests you</span> — {FEEDBACK_PLAN_INTEREST_OPTIONS.join(", ")}</li>
                <li><span className="font-semibold">Optional final comment</span> — one text box, optional</li>
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/disclaimer" className="rounded-full border border-black/10 bg-white px-6 py-3 text-center text-sm font-semibold text-[#123638] hover:bg-slate-50">
                Read contributor boundaries
              </Link>
              <Link href="/security-and-data" className="rounded-full border border-black/10 bg-white px-6 py-3 text-center text-sm font-semibold text-[#123638] hover:bg-slate-50">
                How feedback is handled
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-[#f8f6f1] shadow-sm">
            <Image
              src="/images/share_story_laptop.png"
              alt="Laptop showing a relocation story form with passport, luggage tag, and practical move icons"
              width={1672}
              height={941}
              className="h-auto w-full object-cover"
              sizes="(min-width: 1024px) 48vw, 100vw"
            />
          </div>
        </div>
        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
