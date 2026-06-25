"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// ── Feature flag ──────────────────────────────────────────────────────────────
const PAYMENTS_ENABLED =
  process.env.NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED === "true" ||
  process.env.NEXT_PUBLIC_PREMIUM_PACK_PAYMENTS_ENABLED === "true";

// ── Constants ─────────────────────────────────────────────────────────────────
const ORIGIN_OPTIONS = [
  "India",
  "Singapore",
  "UK",
  "US",
  "Australia",
  "Canada",
  "Germany / EU",
  "Other origin",
];

const DESTINATION_OPTIONS = [
  "UK",
  "Germany / EU",
  "Singapore",
  "Australia",
  "Canada",
  "US",
  "New Zealand",
  "Other destination",
];

const MOVE_REASON_OPTIONS = [
  "Work / job offer",
  "Corporate / employer transfer",
  "Partner / spouse move",
  "Family move",
  "Returning home",
  "Solo move",
  "Other",
];

const WHO_IS_MOVING_OPTIONS = [
  "Solo",
  "Couple",
  "Family with children",
  "Corporate / employer-sponsored",
  "Returning resident",
];

const DEPARTURE_OPTIONS = [
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2026",
  "October 2026",
  "November 2026",
  "December 2026",
  "2027 or later",
  "Not yet decided",
];

const MODULE_OPTIONS = [
  { key: "family", label: "Family with children" },
  { key: "couple", label: "Couple" },
  { key: "solo", label: "Solo mover" },
  { key: "corporate", label: "Corporate / employer transfer" },
  { key: "returning", label: "Returning home" },
  { key: "pet", label: "Relocating with pets" },
  { key: "student", label: "Student in family" },
];

const CONCERN_OPTIONS = [
  "Visa and permits",
  "Housing and rental",
  "Banking and finance",
  "Health insurance",
  "School / childcare",
  "Shipping and moving",
  "Tax and payroll",
  "SIM and internet",
  "Pets",
  "Document preparation",
  "Budget planning",
  "First week setup",
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormState {
  buyerEmail: string;
  buyerName: string;
  origin: string;
  otherOrigin: string;
  destination: string;
  otherDestination: string;
  moveReason: string;
  whoIsMoving: string;
  timingMonth: string;
  modules: string[];
  concerns: string[];
  consentPlanning: boolean;
  consentSensitive: boolean;
}

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
  modules: [],
  concerns: [],
  consentPlanning: false,
  consentSensitive: false,
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function PremiumRelocationPackPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function setText(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function toggleMulti(field: "modules" | "concerns", value: string) {
    setForm((f) => {
      const current = f[field] as string[];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...f, [field]: updated };
    });
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.buyerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.buyerEmail))
      errs.buyerEmail = "Enter a valid email address.";
    if (!form.buyerName.trim())
      errs.buyerName = "Enter your name.";
    if (!form.origin)
      errs.origin = "Select your origin country.";
    if (form.origin === "Other origin" && !form.otherOrigin.trim())
      errs.otherOrigin = "Enter your origin country.";
    if (!form.destination)
      errs.destination = "Select your destination country.";
    if (form.destination === "Other destination" && !form.otherDestination.trim())
      errs.otherDestination = "Enter your destination country.";
    if (!form.moveReason)
      errs.moveReason = "Select your move reason.";
    if (!form.whoIsMoving)
      errs.whoIsMoving = "Select who is moving.";
    if (!form.timingMonth)
      errs.timingMonth = "Select your planned move month.";
    if (form.concerns.length === 0)
      errs.concerns = "Select at least one area of concern.";
    if (!form.consentPlanning)
      errs.consentPlanning = "You must confirm this to continue.";
    if (!form.consentSensitive)
      errs.consentSensitive = "You must confirm this to continue.";
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      const el = document.getElementById(firstKey);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);

    const effectiveOrigin =
      form.origin === "Other origin" ? form.otherOrigin.trim() : form.origin;
    const effectiveDestination =
      form.destination === "Other destination"
        ? form.otherDestination.trim()
        : form.destination;

    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType: "premium_relocation_pack",
          buyerEmail: form.buyerEmail.trim(),
          buyerName: form.buyerName.trim(),
          origin: effectiveOrigin,
          destination: effectiveDestination,
          moveReason: form.moveReason,
          whoIsMoving: form.whoIsMoving,
          timingMonth: form.timingMonth,
          modules: form.modules.join(","),
          concerns: form.concerns.join(", "),
          consentPlanning: form.consentPlanning,
          consentSensitive: form.consentSensitive,
        }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setServerError(
          data.error ??
            "Payment setup is temporarily unavailable. Please try again or contact support@settlemap.app.",
        );
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setServerError(
        "Payment setup is temporarily unavailable. Please try again or contact support@settlemap.app.",
      );
      setSubmitting(false);
    }
  }

  // ── Payments disabled ─────────────────────────────────────────────────────
  if (!PAYMENTS_ENABLED) {
    return (
      <section className="min-h-[60vh] bg-zinc-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
            <AlertCircle className="h-7 w-7 text-violet-600" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900">
            Premium pack checkout coming soon
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Premium Relocation Pack checkout is currently paused. Register your
            interest or contact support@settlemap.app if you were invited to test checkout.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/early-access"
              className="inline-flex items-center rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Register interest <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:border-zinc-400"
            >
              Back to pricing
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
          Premium Relocation Pack · S$49 one-time
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Tell us about your move
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Fill in your move details so SettleMap can prepare the right Premium
          Relocation Pack for you before you pay.
        </p>

        {serverError && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-7">

          {/* Email */}
          <div>
            <label htmlFor="buyerEmail" className="block text-sm font-semibold text-zinc-800">
              Your email address <span className="text-red-500">*</span>
            </label>
            <p className="mt-0.5 text-xs text-zinc-500">
              Your Premium Relocation Pack will be sent to this address.
            </p>
            <input
              id="buyerEmail"
              type="email"
              autoComplete="email"
              value={form.buyerEmail}
              onChange={(e) => setText("buyerEmail", e.target.value)}
              className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${errors.buyerEmail ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}
              placeholder="you@email.com"
            />
            {errors.buyerEmail && (
              <p className="mt-1.5 text-xs text-red-600">{errors.buyerEmail}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="buyerName" className="block text-sm font-semibold text-zinc-800">
              Your name <span className="text-red-500">*</span>
            </label>
            <input
              id="buyerName"
              type="text"
              autoComplete="name"
              value={form.buyerName}
              onChange={(e) => setText("buyerName", e.target.value)}
              className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${errors.buyerName ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}
              placeholder="First name or full name"
            />
            {errors.buyerName && (
              <p className="mt-1.5 text-xs text-red-600">{errors.buyerName}</p>
            )}
          </div>

          {/* Origin */}
          <div id="origin">
            <label htmlFor="originSelect" className="block text-sm font-semibold text-zinc-800">
              Moving from <span className="text-red-500">*</span>
            </label>
            <select
              id="originSelect"
              value={form.origin}
              onChange={(e) => {
                setText("origin", e.target.value);
                if (e.target.value !== "Other origin")
                  setErrors((er) => { const n = { ...er }; delete n.otherOrigin; return n; });
              }}
              className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500 ${errors.origin ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}
            >
              <option value="">Select origin country…</option>
              {ORIGIN_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            {errors.origin && <p className="mt-1.5 text-xs text-red-600">{errors.origin}</p>}
          </div>

          {form.origin === "Other origin" && (
            <div>
              <label htmlFor="otherOrigin" className="block text-sm font-semibold text-zinc-800">
                Enter your origin country <span className="text-red-500">*</span>
              </label>
              <input
                id="otherOrigin"
                type="text"
                value={form.otherOrigin}
                onChange={(e) => setText("otherOrigin", e.target.value)}
                className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${errors.otherOrigin ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}
                placeholder="e.g. South Africa"
              />
              {errors.otherOrigin && <p className="mt-1.5 text-xs text-red-600">{errors.otherOrigin}</p>}
            </div>
          )}

          {/* Destination */}
          <div id="destination">
            <label htmlFor="destinationSelect" className="block text-sm font-semibold text-zinc-800">
              Moving to <span className="text-red-500">*</span>
            </label>
            <select
              id="destinationSelect"
              value={form.destination}
              onChange={(e) => {
                setText("destination", e.target.value);
                if (e.target.value !== "Other destination")
                  setErrors((er) => { const n = { ...er }; delete n.otherDestination; return n; });
              }}
              className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500 ${errors.destination ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}
            >
              <option value="">Select destination country…</option>
              {DESTINATION_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.destination && <p className="mt-1.5 text-xs text-red-600">{errors.destination}</p>}
          </div>

          {form.destination === "Other destination" && (
            <div>
              <label htmlFor="otherDestination" className="block text-sm font-semibold text-zinc-800">
                Enter your destination country <span className="text-red-500">*</span>
              </label>
              <input
                id="otherDestination"
                type="text"
                value={form.otherDestination}
                onChange={(e) => setText("otherDestination", e.target.value)}
                className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${errors.otherDestination ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}
                placeholder="e.g. Netherlands"
              />
              {errors.otherDestination && <p className="mt-1.5 text-xs text-red-600">{errors.otherDestination}</p>}
            </div>
          )}

          {/* Move reason */}
          <div id="moveReason">
            <p className="block text-sm font-semibold text-zinc-800">
              Reason for moving <span className="text-red-500">*</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {MOVE_REASON_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, moveReason: option }));
                    setErrors((e) => { const n = { ...e }; delete n.moveReason; return n; });
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    form.moveReason === option
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-violet-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.moveReason && <p className="mt-1.5 text-xs text-red-600">{errors.moveReason}</p>}
          </div>

          {/* Who is moving */}
          <div id="whoIsMoving">
            <p className="block text-sm font-semibold text-zinc-800">
              Who is moving? <span className="text-red-500">*</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {WHO_IS_MOVING_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, whoIsMoving: option }));
                    setErrors((e) => { const n = { ...e }; delete n.whoIsMoving; return n; });
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    form.whoIsMoving === option
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-violet-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.whoIsMoving && <p className="mt-1.5 text-xs text-red-600">{errors.whoIsMoving}</p>}
          </div>

          {/* Timing */}
          <div id="timingMonth">
            <label htmlFor="timingSelect" className="block text-sm font-semibold text-zinc-800">
              Planned move month <span className="text-red-500">*</span>
            </label>
            <select
              id="timingSelect"
              value={form.timingMonth}
              onChange={(e) => setText("timingMonth", e.target.value)}
              className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500 ${errors.timingMonth ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}
            >
              <option value="">Select move month…</option>
              {DEPARTURE_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.timingMonth && <p className="mt-1.5 text-xs text-red-600">{errors.timingMonth}</p>}
          </div>

          {/* Add-on modules */}
          <div id="modules">
            <p className="block text-sm font-semibold text-zinc-800">
              Add-on modules
              <span className="ml-2 font-normal text-zinc-500">Optional — select all that apply</span>
            </p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Each selected module adds a tailored planning section to your pack.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {MODULE_OPTIONS.map(({ key, label }) => {
                const selected = form.modules.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleMulti("modules", key)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      selected
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-violet-400"
                    }`}
                  >
                    {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main concerns */}
          <div id="concerns">
            <p className="block text-sm font-semibold text-zinc-800">
              Main concerns <span className="text-red-500">*</span>
              <span className="ml-2 font-normal text-zinc-500">Select all that apply</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CONCERN_OPTIONS.map((concern) => {
                const selected = form.concerns.includes(concern);
                return (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => toggleMulti("concerns", concern)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      selected
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-violet-400"
                    }`}
                  >
                    {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {concern}
                  </button>
                );
              })}
            </div>
            {errors.concerns && <p className="mt-1.5 text-xs text-red-600">{errors.concerns}</p>}
          </div>

          {/* Consent */}
          <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
              Before you continue
            </p>

            <label className={`flex items-start gap-3 cursor-pointer ${errors.consentPlanning ? "text-red-700" : "text-zinc-700"}`}>
              <input
                id="consentPlanning"
                type="checkbox"
                checked={form.consentPlanning}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setForm((f) => ({ ...f, consentPlanning: checked }));
                  setErrors((er) => { const n = { ...er }; delete n.consentPlanning; return n; });
                }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-400 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm leading-6">
                I understand SettleMap provides planning support only and is not legal, immigration,
                financial, property, insurance, medical, school/admission or government advice.
              </span>
            </label>
            {errors.consentPlanning && (
              <p className="text-xs text-red-600">{errors.consentPlanning}</p>
            )}

            <label className={`flex items-start gap-3 cursor-pointer ${errors.consentSensitive ? "text-red-700" : "text-zinc-700"}`}>
              <input
                id="consentSensitive"
                type="checkbox"
                checked={form.consentSensitive}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setForm((f) => ({ ...f, consentSensitive: checked }));
                  setErrors((er) => { const n = { ...er }; delete n.consentSensitive; return n; });
                }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-400 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm leading-6">
                I will not enter or email passport numbers, visa numbers, bank details, medical
                details or ID documents to SettleMap.
              </span>
            </label>
            {errors.consentSensitive && (
              <p className="text-xs text-red-600">{errors.consentSensitive}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up checkout…
                </>
              ) : (
                <>
                  Continue to secure payment — S$49
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-3 text-xs text-zinc-500">
              You will be redirected to Stripe for secure payment. SettleMap does
              not see or store your card details.
            </p>
            <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs leading-5 text-zinc-600">
              <span className="font-semibold">Payment failed or card declined?</span>{" "}
              Check that international online payments are enabled on your card, approve any OTP or
              3D Secure prompt from your bank, try another card, or contact{" "}
              <a
                href="mailto:support@settlemap.app"
                className="font-semibold text-violet-700 underline"
              >
                support@settlemap.app
              </a>
              . SettleMap does not see or store your card details.
            </div>
          </div>
        </form>

        {/* Free plan fallback */}
        <div className="mt-10 border-t border-zinc-200 pt-6 text-sm text-zinc-500">
          Just exploring?{" "}
          <Link
            href="/#route-selector"
            className="font-semibold text-violet-700 underline hover:text-violet-800"
          >
            Start the free route plan
          </Link>{" "}
          — no payment needed.
        </div>
      </div>
    </section>
  );
}
