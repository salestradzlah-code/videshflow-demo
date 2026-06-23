import type { Metadata } from "next";
import Link from "next/link";
import { TALLY_FORM_URL, SUPPORT_CONTACT_NOTE, PAYMENT_READINESS_NOTE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "SettleMap refund policy for future paid plans and concierge pilots.",
};

const sections = [
  {
    id: "delivered-digital-products",
    title: "1. Delivered digital products and plans",
    body: "Digital products and personalised plans are normally non-refundable once delivered.",
  },
  {
    id: "undelivered-plans",
    title: "2. Plans not yet delivered",
    body: "If a paid plan has not yet been delivered, the customer may request cancellation or a refund within 7 days of payment.",
  },
  {
    id: "concierge-calls",
    title: "3. Concierge calls",
    body: "Concierge calls may be rescheduled once if requested at least 24 hours before the scheduled call. Completed calls are non-refundable.",
  },
  {
    id: "non-delivery",
    title: "4. If SettleMap cannot deliver",
    body: "If SettleMap is unable to deliver a paid service that was purchased, a refund will be offered.",
  },
  {
    id: "refund-method",
    title: "5. How refunds are returned",
    body: "Refunds, if approved, are returned to the original payment method used at checkout.",
  },
  {
    id: "contact",
    title: "6. Contact",
    body: SUPPORT_CONTACT_NOTE,
  },
];

export default function RefundPolicyPage() {
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Trust and safety</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">Refund Policy</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
          SettleMap does not have live paid plans yet. This policy describes how refunds will work once paid pilots
          launch, so early-access users know what to expect in advance.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">{PAYMENT_READINESS_NOTE}</p>

        <div className="mt-10 space-y-5">
          {sections.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-24 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="text-lg font-semibold text-zinc-900">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{section.body}</p>
              {section.id === "contact" && (
                <a
                  href={TALLY_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#123638] hover:bg-slate-50"
                >
                  Reach us via the feedback form
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/pricing" className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-[#123638] hover:bg-slate-50">
            Back to pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
