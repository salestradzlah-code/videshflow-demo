import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bed, ClipboardCheck, Home, PackageCheck, Phone, Wifi } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";

export const metadata: Metadata = {
  title: "First 30 Days Home Setup",
  description: "Practical home setup checklist for the first 30 days after moving into a new rental home.",
};

const moveInChecklist = [
  "Collect keys",
  "Inspect house and take photos",
  "Check meter readings where applicable",
  "Confirm mover delivery timing",
  "Track boxes and delivery tickets",
  "Set up mattress or basic sleeping arrangement first",
  "Set up WiFi request",
  "Electricity and utilities",
  "SIM and local number",
  "Groceries for first week",
  "Kitchen basics",
  "Furniture and appliances delivery planning",
  "Cleaning supplies",
  "Kids school route and play area",
  "Commute test to office and school",
  "Emergency contacts",
];

const setupSections = [
  { icon: Phone, title: "Connectivity", items: ["Local SIM and mobile plan", "Home SIM and OTP backup", "Map, transport, and local payment apps", "Important numbers saved in phone"] },
  { icon: Wifi, title: "WiFi and utilities", items: ["Broadband request", "Electricity and utilities", "TV or streaming decisions", "Billing account setup"] },
  { icon: Bed, title: "Furniture and appliances", items: ["Bed, mattress, table, chairs, and storage", "Fridge, washer, microwave, kettle, and iron", "Delivery and assembly timing", "New versus used purchase options"] },
  { icon: Home, title: "Kitchen and daily basics", items: ["Cookware, utensils, and pantry storage", "Cleaning supplies", "Dietary and food preference options", "Supermarkets and specialty shops nearby"] },
  { icon: ClipboardCheck, title: "Family routine", items: ["Kids playgroups and childcare", "School commute planning", "Parks and weekend routines", "Doctor, dentist, and emergency options"] },
  { icon: PackageCheck, title: "Deliveries and reminders", items: ["Mover delivery tickets", "Furniture delivery dates", "Appliance warranty and invoices", "Future AI reminder support planned, not live yet"] },
];

export default function HomeSetupPage() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Arrival and settlement</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">First 30 Days Home Setup</h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
            Once you move from temporary stay into your rental home, the real setup begins: keys, inspection, WiFi, electricity, furniture, appliances, SIM, groceries, school routes, helper options, pets, and community.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/get-help" className="inline-flex items-center rounded-full bg-[#123638] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0c2829]">
              Request relocation help <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/ai-assistant" className="inline-flex items-center rounded-full border border-black/10 px-6 py-3 text-sm font-semibold text-[#123638] hover:bg-slate-50">
              View future AI planner
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] bg-[#123638] p-8 text-white shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2c56b]">Move-in day checklist</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">The day you collect keys and move boxes</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {moveInChecklist.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-medium text-white/85">{item}</div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {setupSections.map((section) => (
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

        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
