import type { Metadata } from "next";
import Link from "next/link";
import { TALLY_FORM_URL, SUPPORT_EMAIL, SUPPORT_CONTACT_NOTE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "SettleMap refund policy for the Student Move Pack and future paid products.",
};

const sections = [
  {
    id: "early-access",
    title: "1. Student Move Pack — early access refunds",
    body: "During early access, refund requests for the Student Move Pack are reviewed case by case. To request a review, use the refund request page or email support@settlemap.app with your payment email and receipt number. Refunds are not based on visa, admission, housing, bank, insurance, tax, legal or third-party outcomes because SettleMap does not provide or guarantee those outcomes.",
    refundLink: true,
  },
  {
    id: "delivered-digital-products",
    title: "2. Delivered digital products and plans",
    body: "Digital products and personalised plans are normally non-refundable once delivered. Early access requests are reviewed individually — see section 1.",
    refundLink: false,
  },
  {
    id: "undelivered-plans",
    title: "3. Plans not yet delivered",
    body: "If a paid plan has not yet been delivered, the customer may request cancellation or a refund within 7 days of payment.",
    refundLink: false,
  },
  {
    id: "voice-guide-pilot",
    title: "4. SettleMap Voice Guide pilot",
    body: "If a future SettleMap Voice Guide pilot session is scheduled, it may be rescheduled once if requested at least 24 hours in advance. Completed sessions are non-refundable. The Voice Guide is not available today.",
    refundLink: false,
  },
  {
    id: "non-delivery",
    title: "5. If SettleMap cannot deliver",
    body: "If SettleMap is unable to deliver a paid service that was purchased, a refund will be offered.",
    refundLink: false,
  },
  {
    id: "refund-method",
    title: "6. How refunds are returned",
    body: "Refunds, if approved, are returned to the original payment method used at checkout. SettleMap does not auto-refund through this site — all refunds are processed manually after review.",
    refundLink: false,
  },
  {
    id: "contact",
    title: "7. Contact",
    body: SUPPORT_CONTACT_NOTE,
    refundLink: false,
  },
];

export default function RefundPolicyPage() {
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Trust and safety</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">Refund Policy</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
          The Student Move Pack is now available at S$19 early access. This policy describes how refunds work for all SettleMap paid products.
        </p>

        <div className="mt-10 space-y-5">
          {sections.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-24 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="text-lg font-semibold text-zinc-900">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{section.body}</p>
              {section.refundLink && (
                <div className="mt-4">
                  <Link
                    href="/refund-request"
                    className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Request a refund review
                  </Link>
                </div>
              )}
              {section.id === "contact" && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Email {SUPPORT_EMAIL}
                  </a>
                  <a
                    href={TALLY_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-slate-50"
                  >
                    Reach us via the feedback form
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/pricing" className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-slate-50">
            Back to pricing
          </Link>
          <Link href="/refund-request" className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-slate-50">
            Request a refund review
          </Link>
        </div>
      </div>
    </section>
  );
}
