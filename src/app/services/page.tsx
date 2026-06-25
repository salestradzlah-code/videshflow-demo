import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServicesDirectory } from "@/components/settlemap/ServicesDirectory";

export const metadata: Metadata = {
  title: "Services Directory",
  description: "Neutral relocation service categories to research before and after moving.",
};

export default function ServicesPage() {
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Services directory"
            title="Service categories to research before moving"
            description="SettleMap is not a marketplace. This page gives you a clean, neutral structure for what to research before and after relocation — always verify directly before engaging any provider."
          />
          <Link href="/get-help" className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-emerald-700">
            Request help <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10">
          <ServicesDirectory />
        </div>

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Official links appear first where available. Commercial providers, apps or websites are for research convenience only. SettleMap does not recommend, verify, rank or endorse providers, and does not guarantee price, availability, licensing, quality or outcomes.{" "}
          <Link href="/service-provider-reference-policy" className="font-semibold underline hover:text-amber-950">
            Read the provider reference policy
          </Link>
          .
        </div>

        <div className="mt-10">
          <Link href="/start" className="inline-flex items-center rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
            Build your route plan <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
