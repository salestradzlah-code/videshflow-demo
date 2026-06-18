import type { Metadata } from "next";
import Link from "next/link";
import { Handshake, ShieldCheck } from "lucide-react";
import { PARTNER_FORM_URL } from "@/lib/constants";
import { DisclaimerBox } from "@/components/DisclaimerBox";

export const metadata: Metadata = {
  title: "Partner With Us",
  description: "Service providers can express interest in future VideshFlow listings and referral leads.",
};

const providerFields = [
  "Company name",
  "Service category",
  "Countries served",
  "Website",
  "Contact person",
  "Email or WhatsApp",
  "Do you accept referral leads?",
  "Short description of service",
];

export default function PartnerWithUsPage() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Partner with VideshFlow</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">For relocation service providers</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            VideshFlow may later list service categories and provider options for users to research. Providers can express interest in future listings or referral lead discussions.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={PARTNER_FORM_URL} className="rounded-full bg-[#123638] px-6 py-3 text-center text-sm font-semibold text-white hover:bg-[#0c2829]">
              Submit provider interest
            </Link>
            <Link href="/services" className="rounded-full border border-black/10 px-6 py-3 text-center text-sm font-semibold text-[#123638] hover:bg-slate-50">
              View service categories
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div id="partner-form-coming-soon" className="rounded-[2rem] border border-dashed border-[#123638]/30 bg-[#123638]/5 p-8">
            <Handshake className="h-7 w-7 text-[#123638]" />
            <h2 className="mt-5 text-2xl font-semibold text-[#172326]">Partner form coming soon</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              A Tally or CRM form will be connected here. Until then, this CTA remains on-page and does not open a broken external link.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#172326]">Planned provider fields</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {providerFields.map((field) => (
                <div key={field} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm font-medium text-slate-700">{field}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
          <div className="flex gap-3">
            <ShieldCheck className="mt-1 h-6 w-6 flex-none" />
            <div>
              <h2 className="text-lg font-semibold">Provider listing disclaimer</h2>
              <p className="mt-2 text-sm leading-7">
                Submitting provider details does not guarantee listing, partnership, endorsement, or lead volume. VideshFlow may review providers before publishing any listing.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
