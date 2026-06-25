"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, FileText } from "lucide-react";

type ChecklistItem = { id: string; label: string; note?: string };
type ChecklistCategory = { title: string; color: string; items: ChecklistItem[] };

const CHECKLIST: ChecklistCategory[] = [
  {
    title: "Identity & Travel",
    color: "emerald",
    items: [
      { id: "passport", label: "Valid passport (check minimum validity for destination)", note: "Many countries require 6 months validity beyond your planned stay." },
      { id: "passport_photos", label: "Passport-sized photos (digital and printed)", note: "Typically 2x2 inches or 35x45mm. Check destination requirements." },
      { id: "national_id", label: "National ID / Aadhaar / NRIC or equivalent" },
      { id: "birth_certificate", label: "Birth certificate (original + certified copy)" },
      { id: "marriage_certificate", label: "Marriage certificate if applicable (original + certified copy)" },
      { id: "visa_permit", label: "Entry visa / work permit / student pass (when issued)", note: "Verify issuance process via official immigration portal for your destination." },
      { id: "flight_tickets", label: "Flight tickets or travel itinerary" },
      { id: "travel_insurance_doc", label: "Travel insurance policy document" },
    ],
  },
  {
    title: "Education & Work",
    color: "blue",
    items: [
      { id: "offer_letter", label: "Employment offer letter or contract" },
      { id: "admission_letter", label: "School / university admission or enrolment letter" },
      { id: "degree_certificates", label: "Degree and diploma certificates", note: "May need certified translation or apostille for the destination country." },
      { id: "transcripts", label: "Academic transcripts" },
      { id: "reference_letters", label: "Reference or recommendation letters" },
      { id: "professional_certs", label: "Professional certifications or licences" },
      { id: "cv_resume", label: "Updated CV / résumé" },
      { id: "payslips", label: "Last 3–6 months payslips or salary statements" },
    ],
  },
  {
    title: "Money & Setup",
    color: "violet",
    items: [
      { id: "bank_statements", label: "Bank statements (last 3–6 months)", note: "Often required for visa applications." },
      { id: "bank_letter", label: "Bank confirmation or good-standing letter" },
      { id: "tax_returns", label: "Tax returns (last 1–2 years) if required" },
      { id: "proof_of_funds", label: "Proof of sufficient funds for destination requirements" },
      { id: "credit_cards", label: "Credit / debit cards that work internationally" },
      { id: "forex_plan", label: "Plan for initial cash or forex on arrival day" },
      { id: "remittance_setup", label: "International remittance or transfer service set up" },
    ],
  },
  {
    title: "Housing",
    color: "amber",
    items: [
      { id: "temp_accommodation", label: "Temporary accommodation booked for arrival (minimum 2 weeks)" },
      { id: "tenancy_agreement", label: "Tenancy agreement / lease (when signed)", note: "Do not sign a lease remotely without verifying the property is real." },
      { id: "landlord_contact", label: "Landlord or property agent contact details saved" },
      { id: "address_proof", label: "Proof of address for the destination (once confirmed)" },
      { id: "utility_setup_list", label: "List of utilities to set up after arrival (electricity, gas, broadband)" },
    ],
  },
  {
    title: "Healthcare",
    color: "rose",
    items: [
      { id: "health_insurance_doc", label: "Health insurance policy document (personal or employer-provided)" },
      { id: "vaccination_records", label: "Vaccination records / immunisation history" },
      { id: "prescription_letters", label: "Prescription letters for regular medications", note: "Ask your doctor for a letter listing medicines by generic name, not brand name." },
      { id: "medication_supply", label: "Medication supply for transition period (check import rules)" },
      { id: "medical_records", label: "Summary medical records / GP letter if needed" },
      { id: "dental_records", label: "Dental records if transferring dental care" },
      { id: "optician_prescription", label: "Optician prescription (glasses / contact lenses)" },
    ],
  },
  {
    title: "Family",
    color: "pink",
    items: [
      { id: "childrens_passports", label: "Children's passports (check validity)" },
      { id: "childrens_birth_certs", label: "Children's birth certificates" },
      { id: "school_records", label: "Children's school records, reports and transfer letters" },
      { id: "custody_documents", label: "Custody or parental consent documents if applicable" },
      { id: "emergency_contacts", label: "Emergency contacts list (local and origin country)" },
      { id: "dependant_visa", label: "Dependant visa or family entry permits when issued" },
      { id: "childcare_research", label: "Childcare or school options researched in destination" },
    ],
  },
  {
    title: "Pets",
    color: "teal",
    items: [
      { id: "pet_microchip", label: "Pet microchip confirmed and ISO-compliant", note: "Verify microchip standard required by your destination country." },
      { id: "pet_vaccinations", label: "Pet vaccination records (especially rabies)", note: "Many countries require rabies vaccination within a specific time window." },
      { id: "pet_health_certificate", label: "Veterinary health certificate (issued close to travel date)", note: "Must typically be issued within 10 days of travel. Check exact rules." },
      { id: "pet_import_permit", label: "Pet import permit for destination country (when issued)" },
      { id: "pet_airline_approval", label: "Airline or cargo approval confirmed for pet transport" },
      { id: "pet_quarantine_plan", label: "Quarantine plan confirmed if destination requires it" },
      { id: "vet_destination", label: "Vet contact researched in destination city" },
    ],
  },
];

const COLOR_CLASSES: Record<string, { header: string; badge: string; check: string; checked: string; unchecked: string }> = {
  emerald: {
    header: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800",
    check: "text-emerald-600",
    checked: "border-emerald-500 bg-emerald-50 text-zinc-900",
    unchecked: "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300",
  },
  blue: {
    header: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-800",
    check: "text-blue-600",
    checked: "border-blue-500 bg-blue-50 text-zinc-900",
    unchecked: "border-zinc-200 bg-white text-zinc-700 hover:border-blue-300",
  },
  violet: {
    header: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-800",
    check: "text-violet-600",
    checked: "border-violet-500 bg-violet-50 text-zinc-900",
    unchecked: "border-zinc-200 bg-white text-zinc-700 hover:border-violet-300",
  },
  amber: {
    header: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-800",
    check: "text-amber-600",
    checked: "border-amber-500 bg-amber-50 text-zinc-900",
    unchecked: "border-zinc-200 bg-white text-zinc-700 hover:border-amber-300",
  },
  rose: {
    header: "bg-rose-50 border-rose-200",
    badge: "bg-rose-100 text-rose-800",
    check: "text-rose-600",
    checked: "border-rose-500 bg-rose-50 text-zinc-900",
    unchecked: "border-zinc-200 bg-white text-zinc-700 hover:border-rose-300",
  },
  pink: {
    header: "bg-pink-50 border-pink-200",
    badge: "bg-pink-100 text-pink-800",
    check: "text-pink-600",
    checked: "border-pink-500 bg-pink-50 text-zinc-900",
    unchecked: "border-zinc-200 bg-white text-zinc-700 hover:border-pink-300",
  },
  teal: {
    header: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-800",
    check: "text-teal-600",
    checked: "border-teal-500 bg-teal-50 text-zinc-900",
    unchecked: "border-zinc-200 bg-white text-zinc-700 hover:border-teal-300",
  },
};

const ALL_ITEM_IDS = CHECKLIST.flatMap((cat) => cat.items.map((item) => item.id));
const TOTAL = ALL_ITEM_IDS.length;

export default function DocumentReadinessChecklistPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function markAllInCategory(category: ChecklistCategory, check: boolean) {
    setChecked((prev) => {
      const next = new Set(prev);
      for (const item of category.items) {
        if (check) next.add(item.id);
        else next.delete(item.id);
      }
      return next;
    });
  }

  function reset() {
    setChecked(new Set());
  }

  const totalDone = checked.size;
  const pct = TOTAL > 0 ? Math.round((totalDone / TOTAL) * 100) : 0;

  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
            <FileText className="h-6 w-6 text-emerald-700" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">SettleMap</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Document readiness checklist</h1>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              Tick off documents as you gather or prepare them. Progress is saved in this browser session only — no upload, no account required.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Planning support only.</strong> This checklist is a self-serve planning tool. It does not constitute immigration, legal, financial, medical or any other professional advice. Always verify document requirements with official sources or a qualified professional for your specific situation.
        </div>

        {/* Progress */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-800">Overall progress</p>
              <p className="mt-0.5 text-xs text-zinc-500">{totalDone} of {TOTAL} items ticked</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-emerald-700">{pct}%</span>
              <button
                onClick={reset}
                className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:border-zinc-400 hover:text-zinc-800"
              >
                Reset all
              </button>
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mt-8 space-y-8">
          {CHECKLIST.map((category) => {
            const colors = COLOR_CLASSES[category.color] ?? COLOR_CLASSES.emerald;
            const catDone = category.items.filter((item) => checked.has(item.id)).length;
            const catTotal = category.items.length;
            const allCatDone = catDone === catTotal;

            return (
              <div key={category.title} className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className={`flex items-center justify-between border-b px-5 py-4 ${colors.header}`}>
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-semibold text-zinc-900">{category.title}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.badge}`}>
                      {catDone}/{catTotal}
                    </span>
                  </div>
                  <button
                    onClick={() => markAllInCategory(category, !allCatDone)}
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-800"
                  >
                    {allCatDone ? "Untick all" : "Tick all"}
                  </button>
                </div>

                <ul className="divide-y divide-zinc-100">
                  {category.items.map((item) => {
                    const isChecked = checked.has(item.id);
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => toggle(item.id)}
                          className={`flex w-full items-start gap-3 px-5 py-4 text-left transition-colors ${isChecked ? colors.checked : colors.unchecked}`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${colors.check}`} />
                          ) : (
                            <Circle className="mt-0.5 h-5 w-5 shrink-0 text-zinc-300" />
                          )}
                          <div>
                            <p className={`text-sm font-medium leading-snug ${isChecked ? "line-through opacity-60" : ""}`}>
                              {item.label}
                            </p>
                            {item.note && (
                              <p className="mt-0.5 text-xs leading-snug text-zinc-500">{item.note}</p>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Footer links */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/student-move-pack"
            className="inline-flex items-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Get your Student Move Pack <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/premium-relocation-pack"
            className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:border-zinc-400"
          >
            Premium Relocation Pack
          </Link>
          <Link
            href="/disclaimer"
            className="text-sm text-zinc-500 underline hover:text-zinc-700 sm:ml-2"
          >
            Disclaimer
          </Link>
        </div>

        <p className="mt-6 text-xs text-zinc-400">
          Checklist items are for general planning reference only. Requirements vary by country, visa category and individual circumstances. Verify all requirements with official government sources or a qualified professional.
        </p>
      </div>
    </section>
  );
}
