import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RouteLibraryGrid } from "@/components/settlemap/RouteLibraryGrid";

export const metadata: Metadata = {
  title: "Route Library",
  description: "Browse SettleMap route starter kits for people and families planning relocation across countries, cities, and life stages.",
};

export default function CountriesPage() {
  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Route library"
          title="Relocation routes by corridor"
          description="Each corridor card summarises who it is for, move type, processing speed and complexity. Deep route starter kits are linked where available."
        />
        <div className="mt-10">
          <RouteLibraryGrid />
        </div>
      </div>
    </section>
  );
}
