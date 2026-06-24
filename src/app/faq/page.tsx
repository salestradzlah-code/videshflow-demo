import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { SUPPORT_EMAIL, SUPPORT_EMAIL_SAFETY_NOTE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about SettleMap: what it is, what it costs, and what it does not do — including immigration, housing, and payment boundaries.",
};

// V11.7 Part 8 — short Q&A pairs only. Every answer that touches advice, payments, or
// data repeats the same no-advice / not-active-yet boundaries used elsewhere on the
// site, so this page can never accidentally imply more than SettleMap currently does.
const faqs = [
  {
    q: "What is SettleMap?",
    a: "SettleMap is an early access planning tool that helps people and families plan a relocation. It turns your route and move details into a project-style task tracker with checklists, official-source reminders, and copy-ready scripts.",
  },
  {
    q: "Is SettleMap free?",
    a: "Yes, today. The route-aware project tracker is free to use during early access. Some future AI-generated plans and the Voice Guide are pilot-priced ideas only — payments are not active yet.",
  },
  {
    q: "Is SettleMap a travel agency?",
    a: "No. SettleMap is not a travel agency, immigration adviser, property agent, financial adviser, insurance adviser, medical adviser, school or admission adviser, or government website.",
  },
  {
    q: "Does SettleMap give immigration advice?",
    a: "No. SettleMap does not provide legal, immigration, tax, financial, medical, insurance, housing, school admission, or travel advice. Always verify current requirements with official sources and qualified professionals.",
  },
  {
    q: "Does SettleMap help with housing?",
    a: "SettleMap gives research checklists, a rental safety checklist, and a ready-to-send Tenant Bio where applicable. It does not act as a property agent, does not list real listings, and does not guarantee housing availability or outcomes.",
  },
  {
    q: "Does SettleMap process payments?",
    a: "Not yet. SettleMap is in early feedback mode. No payments are active today. Early-access users will be contacted before any payment is requested, and any future payments will be handled by Stripe — SettleMap will not store card details.",
  },
  {
    q: "Can I use SettleMap for student moves?",
    a: "Yes. Choose \"Moving abroad for university\" when building your plan. SettleMap does not provide visa, immigration, or admission advice — always confirm requirements directly with your university and the relevant immigration authority.",
  },
  {
    q: "Can I use SettleMap for family moves?",
    a: "Yes. Family moves include extra planning areas such as schooling, family housing, and healthcare set-up. SettleMap does not provide school admission, medical, or immigration advice.",
  },
  {
    q: "How is my data handled?",
    a: "Planning details you enter (such as route, move type, and move date) are used only to generate your checklist and improve the product. Do not submit passport numbers, ID numbers, or sensitive medical or financial details through feedback forms. See the Security and Data and Privacy Policy pages for full detail.",
  },
  {
    q: "How do I contact support?",
    a: `Email ${SUPPORT_EMAIL} or use the feedback form linked from Get Help. ${SUPPORT_EMAIL_SAFETY_NOTE}`,
  },
];

export default function FaqPage() {
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">FAQ</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
          Short, plain answers about what SettleMap is, what it costs, and what it does not do.
        </p>

        <div className="mt-10 space-y-4">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
                <div>
                  <h2 className="text-base font-semibold text-zinc-900">{item.q}</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/disclaimer" className="rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
            Read the full disclaimer
          </Link>
          <Link href="/get-help" className="rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
            Get help
          </Link>
        </div>
      </div>
    </section>
  );
}
