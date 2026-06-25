"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// ── Feature flag ──────────────────────────────────────────────────────────────
const PAYMENTS_ENABLED =
  process.env.NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED !== "false";

// ── Constants ─────────────────────────────────────────────────────────────────
const ROUTE_OPTIONS = [
  "India to UK",
  "India to Germany / EU",
  "India to Singapore",
  "India to US",
  "India to Australia",
  "India to Canada",
  "Other route",
];

const DEPARTURE_OPTIONS = [
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2026",
  "October 2026",
  "Later / not fixed",
];

const CONCERN_OPTIONS = [
  "Accommodation",
  "Packing",
  "India SIM/OTP",
  "Banking",
  "First 7 days",
  "Insurance / healthcare research",
  "Campus arrival",
  "Parent checklist",
  "Budget planning",
  "Provider questions",
];

const ROLE_OPTIONS = ["Student", "Parent", "Family member"];

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormState {
  buyerEmail: string;
  buyerName: string;
  role: string;
  moveRoute: string;
  otherRoute: string;
  departureMonth: string;
  concerns: string[];
  consentPlanning: boolean;
  consentSensitive: boolean;
}

const INITIAL_FORM: FormState = {
  buyerEmail: "",
  buyerName: "",
  role: "",
  moveRoute: "",
  otherRoute: "",
  departureMonth: "",
  concerns: [],
  consentPlanning: false,
  consentSensitive: false,
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function StudentMovePackPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // ── Field helpers ────────────────────────────────────────────────────────
  function setText(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function toggleConcern(concern: string) {
    setForm((f) => {
      const current = f.concerns;
      const updated = current.includes(concern)
        ? current.filter((c) => c !== concern)
        : [...current, concern];
      return { ...f, concerns: updated };
    });
    setErrors((e) => { const n = { ...e }; delete n.concerns; return n; });
  }

  // ── Validation ───────────────────────────────────────────────────────────
  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.buyerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.buyerEmail))
      errs.buyerEmail = "Enter a valid email address.";
    if (!form.buyerName.trim())
      errs.buyerName = "Enter the student or parent name.";
    if (!form.role)
      errs.role = "Select who this pack is for.";
    if (!form.moveRoute)
      errs.moveRoute = "Select a move route.";
    if (form.moveRoute === "Other route" && !form.otherRoute.trim())
      errs.otherRoute = "Enter your move route.";
    if (!form.departureMonth)
      errs.departureMonth = "Select an expected departure month.";
    if (form.concerns.length === 0)
      errs.concerns = "Select at least one main concern.";
    if (!form.consentPlanning)
      errs.consentPlanning = "You must confirm this to continue.";
    if (!form.consentSensitive)
      errs.consentSensitive = "You must confirm this to continue.";
    return errs;
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstErrorKey = Object.keys(errs)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerEmail: form.buyerEmail.trim(),
          buyerName: form.buyerName.trim(),
          role: form.role,
          moveRoute: form.moveRoute,
          otherRoute: form.otherRoute.trim(),
          departureMonth: form.departureMonth,
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

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setServerError(
        "Payment setup is temporarily unavailable. Please try again or contact support@settlemap.app.",
      );
      setSubmitting(false);
    }
  }

  // ── Payments disabled state ──────────────────────────────────────────────
  if (!PAYMENTS_ENABLED) {
    return (
      <section className="min-h-[60vh] bg-zinc-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <AlertCircle className="h-7 w-7 text-amber-600" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900">Payments temporarily paused</h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Student Move Pack payments are temporarily paused while we complete testing. You can still use the free route planner.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/#route-selector" className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
              Start free plan <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:border-zinc-400">
              Back to pricing
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ── Main form ────────────────────────────────────────────────────────────
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Student Move Pack · S$19 one-time</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Tell us about your move</h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Tell us a few details so SettleMap can prepare the right Student Move Pack before you pay.
        </p>

        {serverError && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-7">

          {/* Buyer email */}
          <div>
            <label htmlFor="buyerEmail" className="block text-sm font-semibold text-zinc-800">
              Your email address <span className="text-red-500">*</span>
            </label>
            <p className="mt-0.5 text-xs text-zinc-500">Your Student Move Pack will be sent to this address.</p>
            <input
              id="buyerEmail"
              type="email"
              autoComplete="email"
              value={form.buyerEmail}
              onChange={(e) => setText("buyerEmail", e.target.value)}
              className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.buyerEmail ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}
              placeholder="you@email.com"
            />
            {errors.buyerEmail && <p className="mt-1.5 text-xs text-red-600">{errors.buyerEmail}</p>}
          </div>

          {/* Buyer name */}
          <div>
            <label htmlFor="buyerName" className="block text-sm font-semibold text-zinc-800">
              Student or parent name <span className="text-red-500">*</span>
            </label>
            <input
              id="buyerName"
              type="text"
              autoComplete="name"
              value={form.buyerName}
              onChange={(e) => setText("buyerName", e.target.value)}
              className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.buyerName ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}
              placeholder="First name or full name"
            />
            {errors.buyerName && <p className="mt-1.5 text-xs text-red-600">{errors.buyerName}</p>}
          </div>

          {/* Role */}
          <div id="role">
            <p className="block text-sm font-semibold text-zinc-800">
              Who is this for? <span className="text-red-500">*</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {ROLE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => { setForm((f) => ({ ...f, role: option })); setErrors((e) => { const n = { ...e }; delete n.role; return n; }); }}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    form.role === option
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-emerald-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.role && <p className="mt-1.5 text-xs text-red-600">{errors.role}</p>}
          </div>

          {/* Move route */}
          <div id="moveRoute">
            <label htmlFor="moveRouteSelect" className="block text-sm font-semibold text-zinc-800">
              Move route <span className="text-red-500">*</span>
            </label>
            <select
              id="moveRouteSelect"
              value={form.moveRoute}
              onChange={(e) => { setText("moveRoute", e.target.value); if (e.target.value !== "Other route") setErrors((er) => { const n = { ...er }; delete n.otherRoute; return n; }); }}
              className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.moveRoute ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}
            >
              <option value="">Select your move route…</option>
              {ROUTE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.moveRoute && <p className="mt-1.5 text-xs text-red-600">{errors.moveRoute}</p>}
          </div>

          {/* Other route */}
          {form.moveRoute === "Other route" && (
            <div>
              <label htmlFor="otherRoute" className="block text-sm font-semibold text-zinc-800">
                Enter your route <span className="text-red-500">*</span>
              </label>
              <input
                id="otherRoute"
                type="text"
                value={form.otherRoute}
                onChange={(e) => setText("otherRoute", e.target.value)}
                className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.otherRoute ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}
                placeholder="e.g. India to Ireland"
              />
              {errors.otherRoute && <p className="mt-1.5 text-xs text-red-600">{errors.otherRoute}</p>}
            </div>
          )}

          {/* Departure month */}
          <div id="departureMonth">
            <label htmlFor="departureMonthSelect" className="block text-sm font-semibold text-zinc-800">
              Expected departure month <span className="text-red-500">*</span>
            </label>
            <select
              id="departureMonthSelect"
              value={form.departureMonth}
              onChange={(e) => setText("departureMonth", e.target.value)}
              className={`mt-2 block w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.departureMonth ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}
            >
              <option value="">Select departure month…</option>
              {DEPARTURE_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.departureMonth && <p className="mt-1.5 text-xs text-red-600">{errors.departureMonth}</p>}
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
                    onClick={() => toggleConcern(concern)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      selected
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-emerald-400"
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

          {/* Consent checkboxes */}
          <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">Before you continue</p>

            <label className={`flex items-start gap-3 cursor-pointer ${errors.consentPlanning ? "text-red-700" : "text-zinc-700"}`}>
              <input
                id="consentPlanning"
                type="checkbox"
                checked={form.consentPlanning}
                onChange={(e) => { const checked = e.target.checked; setForm((f) => ({ ...f, consentPlanning: checked })); setErrors((er) => { const n = { ...er }; delete n.consentPlanning; return n; }); }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-400 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm leading-6">
                I understand SettleMap provides planning support only and is not legal, immigration, financial, property, insurance, medical, school/admission or government advice.
              </span>
            </label>
            {errors.consentPlanning && <p className="text-xs text-red-600">{errors.consentPlanning}</p>}

            <label className={`flex items-start gap-3 cursor-pointer ${errors.consentSensitive ? "text-red-700" : "text-zinc-700"}`}>
              <input
                id="consentSensitive"
                type="checkbox"
                checked={form.consentSensitive}
                onChange={(e) => { const checked = e.target.checked; setForm((f) => ({ ...f, consentSensitive: checked })); setErrors((er) => { const n = { ...er }; delete n.consentSensitive; return n; }); }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-400 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm leading-6">
                I will not enter or email passport numbers, visa numbers, bank details, medical details or ID documents to SettleMap.
              </span>
            </label>
            {errors.consentSensitive && <p className="text-xs text-red-600">{errors.consentSensitive}</p>}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up checkout…
                </>
              ) : (
                <>
                  Continue to secure payment — S$19
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-3 text-xs text-zinc-500">
              You will be redirected to Stripe for secure payment. SettleMap does not see or store your card details.
            </p>
            <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs leading-5 text-zinc-600">
              <span className="font-semibold">Payment failed or card declined?</span> Check that international online payments are enabled on your card, approve any OTP or 3D Secure prompt from your bank, try another card, or contact{" "}
              <a href="mailto:support@settlemap.app" className="font-semibold text-emerald-700 underline">support@settlemap.app</a>. SettleMap does not see or store your card details.
            </div>
          </div>

        </form>

        {/* Free plan fallback */}
        <div className="mt-10 border-t border-zinc-200 pt-6 text-sm text-zinc-500">
          Just exploring?{" "}
          <Link href="/#route-selector" className="font-semibold text-emerald-700 underline hover:text-emerald-800">
            Start the free route plan
          </Link>{" "}
          — no payment needed.
        </div>
      </div>
    </section>
  );
}
