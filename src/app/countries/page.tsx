import type { Metadata } from "next";
import { CountryCard } from "@/components/CountryCard";
import { SectionHeader } from "@/components/SectionHeader";
import { countries } from "@/data/countries";

export const metadata: Metadata = {
  title: "Route Library",
  description: "Browse SettleMap route starter kits for people and families planning relocation across countries, cities, and life stages.",
};

export default function CountriesPage() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Route library"
          title="Relocation starter kits by route"
          description="Each route guide follows the same practical structure: who it is for, official links, first 7 days, first 30 days, first 90 days, family tips, and common mistakes."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => <CountryCard key={country.slug} country={country} />)}
        </div>
      </div>
    </section>
  );
}
