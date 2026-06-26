"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

// V12.12.8: Hard-disabled pending product readiness. Do not remove this line to re-enable —
// set NEXT_PUBLIC_VOICE_GUIDE_CHECKOUT_ENABLED=true in Vercel AND change this line to use it.
const CHECKOUT_ENABLED = false;

const ORIGIN_OPTIONS = ["India", "Singapore", "UK", "US", "Australia", "Canada", "Germany / EU", "Other origin"];
const DESTINATION_OPTIONS = ["UK", "Germany / EU", "Singapore", "Australia", "Canada", "US", "New Zealand", "Other destination"];
const MOVE_REASON_OPTIONS = ["Work / job offer", "Corporate / employer transfer", "Student move", "Partner / spouse move", "Family move", "Returning home", "Solo move", "Other"];
const WHO_OPTIONS = ["Solo", "Couple", "Family with children", "Student", "Corporate / employer-sponsored", "Returning resident"];
const TIMING_OPTIONS = ["June 2026", "July 2026", "August 2026", "September 2026", "October 2026", "November 2026", "December 2026", "2027 or later", "Not yet decided"];
const CONCERN_OPTIONS = ["What to do first", "Documents", "Budget", "Housing", "Banking", "SIM / internet", "Healthcare", "School / university", "Pets", "First 7 days", "Provider questions"];

type FormState = {
  buyerEmail: string;
  buyerName: string;
  origin: string;
  otherOrigin: string;
  destination: string;
  otherDestination: string;
  moveReason: string;
  whoIsMoving: string;
  timingMonth: string;
  concerns: string[];
  consentPlanning: boolean;
  consentSensitive: boolean;
};

const INITIAL_FORM: FormState = {
  buyerEmail: "",
  buyerName: "",
  origin: "",
  otherOrigin: "",
  destination: "",
  otherDestination: "",
  moveReason: "",
  whoIsMoving: "",
  timingMonth: "",
  concerns: [],
  consentPlanning: false,
  consentSensitive: false,
};

export default function VoiceGuidePage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function setText(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function toggleConcern(value: string) {
    setForm((current) => ({
      ...current,
      concerns: current.concerns.includes(value)
        ? current.concerns.filter((item) => item !== value)
        : [...current.concerns, value],
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next.concerns;
      return next;
    });
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.buyerEmail.trim())) next.buyerEmail = "Enter a valid email address.";
    if (!form.buyerName.trim()) next.buyerName = "Enter your name.";
    if (!form.origin) next.origin = "Select your origin.";
    if (form.origin === "Other origin" && !form.otherOrigin.trim()) next.otherOrigin = "Enter your origin.";
    if (!form.destination) next.destination = "Select your destination.";
    if (form.destination === "Other destination" && !form.otherDestination.trim()) next.otherDestination = "Enter your destination.";
    if (!form.moveReason) next.moveReason = "Select a move reason.";
    if (!form.whoIsMoving) next.whoIsMoving = "Select who is moving.";
    if (!form.timingMonth) next.timingMonth = "Select your timing.";
    if (form.concerns.length === 0) next.concerns = "Select at least one topic.";
    if (!form.consentPlanning) next.consentPlanning = "You must confirm this to continue.";
    if (!form.consentSensitive) next.consentSensitive = "You must confirm this to continue.";
    return next;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setServerError(null);

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const origin = form.origin === "Other origin" ? form.otherOrigin.trim() : form.origin;
    const destination = form.destination === "Other destination" ? form.otherDestination.trim() : form.destination;
    setSubmitting(true);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType: "voice_guide",
          buyerEmail: form.buyerEmail.trim(),
          buyerName: form.buyerName.trim(),
          origin,
          destination,
          moveReason: form.moveReason,
          whoIsMoving: form.whoIsMoving,
          timingMonth: form.timingMonth,
          concerns: form.concerns.join(", "),
          consentPlanning: form.consentPlanning,
          consentSensitive: form.consentSensitive,
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setServerError(data.error ?? "Checkout is being configured. Please contact support@settlemap.app or try again later.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setServerError("Checkout is being configured. Please contact support@settlemap.app or try again later.");
      setSubmitting(false);
    }
  }

  if (!CHECKOUT_ENABLED) {
    return (
      <section className="min-h-[60vh] bg-zinc-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
            <AlertCircle className="h-7 w-7 text-teal-700" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900">Voice Guide checkout currently paused</h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            SettleMap Voice Guide checkout is currently paused. Join the waitlist or contact support if you need help.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/early-access" className="inline-flex items-center rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800">
              Join waitlist <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:border-zinc-400">
              Back to pricing
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">SettleMap Voice Guide · S$19 one-time</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Create your Voice Guide script</h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          This is a self-serve AI guided voice-style walkthrough. You receive a written conversational guide for your move plan, checklist, first-week setup and provider research questions. It is not generated audio or a live human call.
        </p>

        {serverError && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-7">
          <div>
            <label htmlFor="buyerEmail" className="block text-sm font-semibold text-zinc-800">Your email address <span className="text-red-500">*</span></label>
            <input id="buyerEmail" type="email" autoComplete="email" value={form.buyerEmail} onChange={(event) => setText("buyerEmail", event.target.value)} className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-600 ${errors.buyerEmail ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`} placeholder="you@email.com" />
            {errors.buyerEmail && <p className="mt-1.5 text-xs text-red-600">{errors.buyerEmail}</p>}
          </div>

          <div>
            <label htmlFor="buyerName" className="block text-sm font-semibold text-zinc-800">Your name <span className="text-red-500">*</span></label>
            <input id="buyerName" type="text" autoComplete="name" value={form.buyerName} onChange={(event) => setText("buyerName", event.target.value)} className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-600 ${errors.buyerName ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`} placeholder="First name or full name" />
            {errors.buyerName && <p className="mt-1.5 text-xs text-red-600">{errors.buyerName}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="origin" className="block text-sm font-semibold text-zinc-800">Moving from <span className="text-red-500">*</span></label>
              <select id="origin" value={form.origin} onChange={(event) => setText("origin", event.target.value)} className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-600 ${errors.origin ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}>
                <option value="">Select origin...</option>
                {ORIGIN_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              {errors.origin && <p className="mt-1.5 text-xs text-red-600">{errors.origin}</p>}
            </div>
            <div>
              <label htmlFor="destination" className="block text-sm font-semibold text-zinc-800">Moving to <span className="text-red-500">*</span></label>
              <select id="destination" value={form.destination} onChange={(event) => setText("destination", event.target.value)} className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-600 ${errors.destination ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}>
                <option value="">Select destination...</option>
                {DESTINATION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              {errors.destination && <p className="mt-1.5 text-xs text-red-600">{errors.destination}</p>}
            </div>
          </div>

          {form.origin === "Other origin" && (
            <input aria-label="Other origin" value={form.otherOrigin} onChange={(event) => setText("otherOrigin", event.target.value)} className={`block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-600 ${errors.otherOrigin ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`} placeholder="Enter origin country" />
          )}
          {form.destination === "Other destination" && (
            <input aria-label="Other destination" value={form.otherDestination} onChange={(event) => setText("otherDestination", event.target.value)} className={`block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-600 ${errors.otherDestination ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`} placeholder="Enter destination country" />
          )}

          <ChoiceGroup title="Reason for moving" options={MOVE_REASON_OPTIONS} value={form.moveReason} onSelect={(value) => setText("moveReason", value)} error={errors.moveReason} />
          <ChoiceGroup title="Who is moving?" options={WHO_OPTIONS} value={form.whoIsMoving} onSelect={(value) => setText("whoIsMoving", value)} error={errors.whoIsMoving} />

          <div>
            <label htmlFor="timingMonth" className="block text-sm font-semibold text-zinc-800">Planned move month <span className="text-red-500">*</span></label>
            <select id="timingMonth" value={form.timingMonth} onChange={(event) => setText("timingMonth", event.target.value)} className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-600 ${errors.timingMonth ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}>
              <option value="">Select timing...</option>
              {TIMING_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            {errors.timingMonth && <p className="mt-1.5 text-xs text-red-600">{errors.timingMonth}</p>}
          </div>

          <div>
            <p className="block text-sm font-semibold text-zinc-800">What should the guide focus on? <span className="text-red-500">*</span></p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CONCERN_OPTIONS.map((option) => {
                const selected = form.concerns.includes(option);
                return (
                  <button key={option} type="button" onClick={() => toggleConcern(option)} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${selected ? "border-teal-700 bg-teal-700 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-teal-500"}`}>
                    {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {option}
                  </button>
                );
              })}
            </div>
            {errors.concerns && <p className="mt-1.5 text-xs text-red-600">{errors.concerns}</p>}
          </div>

          <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">Before you continue</p>
            <label className="flex cursor-pointer items-start gap-3 text-zinc-700">
              <input type="checkbox" checked={form.consentPlanning} onChange={(event) => setForm((current) => ({ ...current, consentPlanning: event.target.checked }))} className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-400 text-teal-700 focus:ring-teal-600" />
              <span className="text-sm leading-6">I understand SettleMap provides planning support only and is not legal, immigration, financial, property, insurance, medical, school/admission, travel, vendor or government advice.</span>
            </label>
            {errors.consentPlanning && <p className="text-xs text-red-600">{errors.consentPlanning}</p>}
            <label className="flex cursor-pointer items-start gap-3 text-zinc-700">
              <input type="checkbox" checked={form.consentSensitive} onChange={(event) => setForm((current) => ({ ...current, consentSensitive: event.target.checked }))} className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-400 text-teal-700 focus:ring-teal-600" />
              <span className="text-sm leading-6">I will not enter or email passport numbers, visa numbers, bank details, medical details or ID documents to SettleMap.</span>
            </label>
            {errors.consentSensitive && <p className="text-xs text-red-600">{errors.consentSensitive}</p>}
          </div>

          <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center rounded-full bg-teal-700 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting up checkout...</> : <>Continue to secure payment — S$19 <ArrowRight className="ml-2 h-4 w-4" /></>}
          </button>
        </form>
      </div>
    </section>
  );
}

function ChoiceGroup(props: {
  title: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <p className="block text-sm font-semibold text-zinc-800">{props.title} <span className="text-red-500">*</span></p>
      <div className="mt-2 flex flex-wrap gap-2">
        {props.options.map((option) => (
          <button key={option} type="button" onClick={() => props.onSelect(option)} className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${props.value === option ? "border-teal-700 bg-teal-700 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-teal-500"}`}>
            {option}
          </button>
        ))}
      </div>
      {props.error && <p className="mt-1.5 text-xs text-red-600">{props.error}</p>}
    </div>
  );
}
