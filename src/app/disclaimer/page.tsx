import type { Metadata } from "next";
import { PAID_SERVICES_DISCLAIMER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "SettleMap safety, advice, and content boundaries.",
};

const sections = [
  {
    id: "prototype-status",
    title: "1. Prototype status",
    body: "SettleMap is an early feedback prototype, not a finished product. Features, data, and wording may change without notice as we learn from tester feedback.",
  },
  {
    id: "no-professional-advice",
    title: "2. No professional advice",
    body: "SettleMap is not a travel agency, not an immigration adviser, not a property agent, not a financial adviser, not an insurance adviser, not a medical adviser, not a school or admission adviser, and not a government website. Nothing on SettleMap is legal, immigration, tax, financial, medical, insurance, housing, school admission, travel, pet import, or vendor advice. Content is for general planning convenience only.",
  },
  {
    id: "immigration-legal",
    title: "3. Immigration and legal matters",
    body: "Visa categories, residency routes, and legal requirements change frequently and vary by nationality, route, and circumstance. Always verify current rules directly with official immigration authorities or a licensed legal professional before acting.",
  },
  {
    id: "tax-financial",
    title: "4. Tax and financial matters",
    body: "Tax residency, banking, and financial planning guidance on this platform is general and illustrative only. Speak with a qualified accountant or financial advisor about your specific situation before making decisions.",
  },
  {
    id: "insurance",
    title: "5. Insurance",
    body: "SettleMap does not sell or advise on insurance. Any insurance category shown is for research convenience only — compare policies and verify terms directly with licensed insurers or brokers.",
  },
  {
    id: "medical-healthcare",
    title: "6. Medical and healthcare matters",
    body: "Healthcare, medication, and clinic information is general planning guidance only. Always confirm prescriptions, vaccination requirements, and medical coverage with qualified healthcare professionals.",
  },
  {
    id: "housing-schooling",
    title: "7. Housing and schooling",
    body: "Rental, housing, and school admission information is for research orientation only. SettleMap does not guarantee rental approval, housing availability, or school admission outcomes — verify directly with landlords, agents, or admissions offices.",
  },
  {
    id: "vendors-services",
    title: "8. Vendors and services",
    body: "Service categories and listings shown on SettleMap are not endorsements, guarantees, or promises of quality, pricing, licensing, availability, or outcomes. Compare and verify any provider directly before engaging them.",
  },
  {
    id: "official-source-verification",
    title: "9. Official source verification",
    body: "Relocation rules and costs change, sometimes without notice. Always cross-check requirements against official government, embassy, or institutional sources before making a decision or commitment.",
  },
  {
    id: "user-responsibility",
    title: "10. User responsibility",
    body: "You are responsible for verifying information before acting on it and for any decisions made using this platform. SettleMap and its operators are not liable for outcomes resulting from reliance on prototype content.",
  },
  {
    id: "paid-services",
    title: "11. Paid services (pilot)",
    body: PAID_SERVICES_DISCLAIMER + " Any future paid plan or AI Voice Guide pilot will provide AI-generated, self-serve planning support and templates only, with no human review. It will not replace licensed professional advice.",
  },
];

export default function DisclaimerPage() {
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Trust and safety</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">Disclaimer</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
          SettleMap is an experience-backed relocation planning prototype. It is designed to help users ask better questions, prepare practical checklists, and find official sources faster — not to replace professional advice.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
          <nav className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">On this page</p>
            <ul className="mt-3 space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-sm text-zinc-600 transition-colors duration-200 hover:text-emerald-700">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-5">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-24 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-7">
                <h2 className="text-lg font-semibold text-zinc-900">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
