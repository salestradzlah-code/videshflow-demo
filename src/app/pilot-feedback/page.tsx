"use client";

import { FormEvent, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

type ProductTested = "Student Move Pack" | "Premium Relocation Pack";
const inputClass = "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

export default function PilotFeedbackPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    productTested: "Student Move Pack" as ProductTested,
    routeTested: "",
    paymentWorked: "",
    receiptArrived: "",
    packEmailArrived: "",
    worthPrice: "",
    mostUseful: "",
    confusing: "",
    missing: "",
    recommend: "",
    followUpPermission: "",
  });

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`SettleMap private pilot feedback - ${form.productTested}`);
    const body = encodeURIComponent([
      "SettleMap Private Pilot Feedback",
      "",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Product tested: ${form.productTested}`,
      `Route tested: ${form.routeTested}`,
      "",
      `Did payment work?: ${form.paymentWorked}`,
      `Did the receipt arrive?: ${form.receiptArrived}`,
      `Did the SettleMap pack email arrive?: ${form.packEmailArrived}`,
      `Was the pack worth the price?: ${form.worthPrice}`,
      "",
      `What was most useful?: ${form.mostUseful}`,
      `What was confusing?: ${form.confusing}`,
      `What was missing?: ${form.missing}`,
      `Would you recommend this to a student, family, or friend?: ${form.recommend}`,
      `Permission to contact for follow-up?: ${form.followUpPermission}`,
      "",
      "Safety note: I have not included passport numbers, visa numbers, bank details, medical details, or ID documents.",
    ].join("\n"));
    return `mailto:support@settlemap.app?subject=${subject}&body=${body}`;
  }, [form]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = mailtoHref;
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Private pilot
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            SettleMap Private Pilot Feedback
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Thank you for testing SettleMap. Your feedback helps improve the planning pack.
          </p>
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Please do not submit passport numbers, visa numbers, bank details, medical details, or ID documents.
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name">
                <input value={form.name} onChange={(e) => updateField("name", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Email">
                <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Product tested">
                <select value={form.productTested} onChange={(e) => updateField("productTested", e.target.value)} className={inputClass}>
                  <option>Student Move Pack</option>
                  <option>Premium Relocation Pack</option>
                </select>
              </Field>
              <Field label="Route tested">
                <input value={form.routeTested} onChange={(e) => updateField("routeTested", e.target.value)} placeholder="Example: India to UK" className={inputClass} />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField label="Did payment work?" value={form.paymentWorked} onChange={(value) => updateField("paymentWorked", value)} />
              <SelectField label="Did the receipt arrive?" value={form.receiptArrived} onChange={(value) => updateField("receiptArrived", value)} />
              <SelectField label="Did the SettleMap pack email arrive?" value={form.packEmailArrived} onChange={(value) => updateField("packEmailArrived", value)} />
              <SelectField label="Was the pack worth the price?" value={form.worthPrice} onChange={(value) => updateField("worthPrice", value)} />
              <SelectField label="Would you recommend this to a student, family, or friend?" value={form.recommend} onChange={(value) => updateField("recommend", value)} />
              <SelectField label="Permission to contact for follow-up" value={form.followUpPermission} onChange={(value) => updateField("followUpPermission", value)} />
            </div>

            <Field label="What was most useful?">
              <textarea value={form.mostUseful} onChange={(e) => updateField("mostUseful", e.target.value)} rows={4} className={inputClass} />
            </Field>
            <Field label="What was confusing?">
              <textarea value={form.confusing} onChange={(e) => updateField("confusing", e.target.value)} rows={4} className={inputClass} />
            </Field>
            <Field label="What was missing?">
              <textarea value={form.missing} onChange={(e) => updateField("missing", e.target.value)} rows={4} className={inputClass} />
            </Field>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-600">
              This form opens an email to SettleMap support. No database is used, and no passport, visa, bank, medical, or ID document data is requested.
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                Send feedback by email <Mail className="ml-2 h-4 w-4" />
              </button>
              <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:border-zinc-400">
                Back to pricing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-800">
      {label}
      {children}
    </label>
  );
}

function SelectField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        <option value="">Select</option>
        <option>Yes</option>
        <option>No</option>
        <option>Partly</option>
        <option>Not sure</option>
      </select>
    </Field>
  );
}
