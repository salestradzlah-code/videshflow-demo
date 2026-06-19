import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, Route, ShieldCheck } from "lucide-react";
import { HELP_FORM_URL } from "@/lib/constants";
import { DisclaimerBox } from "@/components/DisclaimerBox";

export const metadata: Metadata = {
  title: "Get Relocation Help",
  description: "Tell SettleMap what relocation help you need beyond route guides.",
};

const categories = [
  "Cost of living planning",
  "Offer decision support",
  "Rental housing research",
  "Schooling or childcare planning",
  "Temporary stay",
  "Packers and movers",
  "SIM and OTP continuity",
  "Banking and remittance",
  "Medical and dental preparation",
  "Driving licence and car rental",
  "Home setup, WiFi, utilities, furniture",
  "Cultural food, community, faith, language, and local support",
  "Full relocation checklist",
];

const steps = [
  { title: "Tell us your stage", text: "Share where you are moving, your timeline, family situation, and the help categories you need." },
  { title: "Get routed to resources", text: "SettleMap can point you to route guides, checklists, service categories, or future AI triage paths." },
  { title: "Provider connection later", text: "Where you consent, SettleMap may connect you with relevant service providers for your own review." },
];

export default function GetHelpPage() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Get relocation help</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">Tell us what you need help with</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            SettleMap is not built around manual consulting as the main model. This is a scalable request intake flow that can later connect to AI triage, planning resources, and service categories or providers for your review.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={HELP_FORM_URL} className="rounded-full bg-[#123638] px-6 py-3 text-center text-sm font-semibold text-white hover:bg-[#0c2829]">
              Request relocation help
            </Link>
            <Link href="/services" className="inline-flex items-center rounded-full border border-black/10 px-6 py-3 text-center text-sm font-semibold text-[#123638] hover:bg-slate-50">
              Explore services <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>


        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
          <Route className="h-7 w-7 text-[#123638]" />
          <h2 className="mt-5 text-2xl font-semibold text-[#172326]">The three details that make the request useful</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Destination, move reason, and family profile help SettleMap route users to the correct playbook, AI checklist, service category, or provider option for review.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { title: "Destination", text: "Where are you moving, for example Singapore, UK, UAE, Australia, Canada, or Germany." },
              { title: "Move reason", text: "Job offer, corporate transfer, student move, family move, PR migration, business, or already landed." },
              { title: "Family profile", text: "Solo, couple, family with children, student, or moving with parents and seniors." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-black/5 bg-[#f8f6f1] p-5">
                <h3 className="font-semibold text-[#172326]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
          <Link href="/start" className="mt-7 inline-flex items-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#123638] hover:bg-slate-50">
            Choose your path first <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <ClipboardList className="h-7 w-7 text-[#123638]" />
            <h2 className="mt-5 text-2xl font-semibold text-[#172326]">What help can you request?</h2>
            <div className="mt-5 grid gap-3">
              {categories.map((item) => (
                <div key={item} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm font-medium text-slate-700">{item}</div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <Route className="h-7 w-7 text-[#123638]" />
              <h2 className="mt-5 text-2xl font-semibold text-[#172326]">How SettleMap handles your request</h2>
              <div className="mt-5 grid gap-4">
                {steps.map((step) => (
                  <div key={step.title} className="rounded-2xl border border-black/5 bg-[#f8f6f1] p-5">
                    <h3 className="font-semibold text-[#172326]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="help-form-coming-soon" className="rounded-[2rem] border border-dashed border-[#123638]/30 bg-[#123638]/5 p-8">
              <ShieldCheck className="h-7 w-7 text-[#123638]" />
              <h2 className="mt-5 text-2xl font-semibold text-[#172326]">Help request form coming soon</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A Tally or CRM form will be connected here. Until then, this button safely stays on the page instead of opening a broken external link.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
