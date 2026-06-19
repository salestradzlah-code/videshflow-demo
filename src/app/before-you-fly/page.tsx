import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, FileCheck2, Luggage, Pill, Shirt, Stethoscope } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";

export const metadata: Metadata = {
  title: "Before You Move",
  description: "A practical pre-departure checklist for people and families planning relocation across countries, cities, and life stages.",
};

const sections = [
  { icon: FileCheck2, title: "Documents and backups", items: ["Passport, visas or pass instructions, employment letters, marriage and birth certificates", "Kids school records and vaccination records", "Document organiser folder for printed copies", "Digital backup of passport, certificates, prescriptions, and key confirmations"] },
  { icon: Shirt, title: "Clothes and office wear", items: ["Buy formal office wear if cheaper at home before departure", "Business suits, ties, formal shirts, belts, and formal shoes", "Weather clothing based on destination, including winter wear, rainwear, or breathable tropical clothing", "Comfortable walking shoes for commute and arrival errands"] },
  { icon: Stethoscope, title: "Medical, dental, and eye checks", items: ["Dental check before travel", "Eye check and spare glasses", "Full medical check where needed", "Vaccination records and doctor notes where useful"] },
  { icon: Pill, title: "Medicines and prescriptions", items: ["Regular medicines with prescriptions", "Doctor letter for long-term medicines where needed", "Check destination medicine and customs rules", "Avoid packing restricted medicines or food items without checking rules"] },
  { icon: BriefcaseBusiness, title: "Driving, money, and phone", items: ["Driving licence and IDP research", "Forex, cards, and emergency cash planning", "Home SIM, OTP, and bank access plan", "Backup phone or eSIM research where useful"] },
  { icon: Luggage, title: "Packing and baggage", items: ["Universal adapters and destination voltage check", "Luggage weighing scale to avoid surprise fees", "Airline baggage rule reminder before packing", "Kitchen basics, kids comfort items, and food customs caution"] },
];

export default function BeforeYouFlyPage() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Preparation hub</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">Before You Move</h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
            A practical pre-departure checklist for documents, clothes, medicines, driving, phone OTPs, baggage, and family records before relocating.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/countries" className="inline-flex items-center rounded-full bg-[#123638] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0c2829]">
              Open route guides <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/reference-links" className="inline-flex items-center rounded-full border border-black/10 px-6 py-3 text-sm font-semibold text-[#123638] hover:bg-slate-50">
              Research reference links
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <div key={section.title} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <section.icon className="h-7 w-7 text-[#123638]" />
              <h2 className="mt-5 text-xl font-semibold text-[#172326]">{section.title}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#123638]" />{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-[#f2c56b]/70 bg-[#fff8df] p-6 text-sm leading-6 text-[#68420c]">
          This is a planning checklist. Check destination country customs, airline baggage rules, prescription medicine rules, and official sources before packing or travelling.
        </div>

        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
