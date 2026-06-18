"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, ClipboardCheck, Globe2, Home, Luggage, Plane, Route, SearchCheck, ShieldCheck, UsersRound } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";

type Destination = {
  label: string;
  shortLabel: string;
  href?: string;
  status: "ready" | "coming-soon";
  note: string;
};

type Reason = {
  label: string;
  guidance: string[];
};

type Profile = {
  label: string;
  guidance: string[];
};

const destinations: Destination[] = [
  { label: "Singapore", shortLabel: "Singapore", href: "/countries/singapore", status: "ready", note: "Deep guide available with cost, rent, school, SIM, groceries, and first month setup." },
  { label: "United Kingdom", shortLabel: "UK", href: "/countries/united-kingdom", status: "ready", note: "Starter guide available for NHS, banking, rent, first week setup, and official links." },
  { label: "United States", shortLabel: "US", href: "/countries/united-states", status: "ready", note: "Starter guide available with state specific caution, SSN, banking, credit, and setup reminders." },
  { label: "Canada", shortLabel: "Canada", status: "coming-soon", note: "Starter kit coming soon. Use the general relocation checklist for now." },
  { label: "UAE", shortLabel: "UAE", href: "/countries/united-arab-emirates", status: "ready", note: "Starter guide available for Dubai, Abu Dhabi, family setup, rent, school, and first month basics." },
  { label: "Australia", shortLabel: "Australia", href: "/countries/australia", status: "ready", note: "Starter guide available for skilled migrants, PR holders, students, and families." },
  { label: "Germany / EU", shortLabel: "Germany / EU", href: "/countries/germany-eu", status: "ready", note: "Starter guide available for language, appointments, housing, registration, and official source checks." },
  { label: "Saudi Arabia / Gulf", shortLabel: "Gulf", status: "coming-soon", note: "Starter kit coming soon. Use Before You Fly and Services Directory for now." },
  { label: "Other", shortLabel: "Other", status: "coming-soon", note: "Use the general checklists and service categories while country specific content is added." },
];

const reasons: Reason[] = [
  { label: "Job offer", guidance: ["Salary and cost reality", "Rental research and commute", "Office clothing and banking", "First 90 days planning"] },
  { label: "Corporate transfer", guidance: ["Employer relocation package", "Temporary stay", "Movers and shipping", "School planning and spouse setup"] },
  { label: "Student move", guidance: ["University documents", "Accommodation", "Local SIM and banking", "Student budget and local transport"] },
  { label: "Family move", guidance: ["Schooling and childcare", "Rental house and groceries", "Healthcare and safety", "Community and playgroups"] },
  { label: "PR / migration", guidance: ["Long term settlement", "Documents and shipping", "Housing and children", "Banking and community"] },
  { label: "Business / startup", guidance: ["Business setup links", "Banking", "Local network and office setup", "Tax caution and official sources"] },
  { label: "Short assignment", guidance: ["Temporary stay", "Light packing", "Local SIM and transport", "Food and expense tracking"] },
  { label: "Already landed", guidance: ["First 7 days", "Local SIM, bank, and house search", "WiFi and groceries", "Emergency contacts"] },
];

const profiles: Profile[] = [
  { label: "Solo", guidance: ["Cost", "Temporary stay", "Transport", "Banking and SIM"] },
  { label: "Couple", guidance: ["Housing", "Spouse setup", "Budget", "Groceries and community"] },
  { label: "Family with child", guidance: ["School and childcare", "Healthcare", "Rental size and safety", "Commute and playgroups"] },
  { label: "Family with children", guidance: ["School calendars", "Larger rental", "Childcare and healthcare", "Playgroups and community"] },
  { label: "Student", guidance: ["Accommodation", "Budget", "Documents", "Local SIM and student life"] },
  { label: "With parents / seniors", guidance: ["Medical access", "Accessibility", "Transport", "Medicines and emergency contacts"] },
];

const nextSteps = [
  { title: "Country starter kit", text: "Open the destination guide first so the advice feels relevant to your move.", href: "/countries", icon: Globe2 },
  { title: "Before accepting the offer", text: "Review cost, rent, commute, school, family budget, and destination fit before deciding.", href: "/start#reason-guidance", icon: SearchCheck },
  { title: "Before you fly from India", text: "Prepare documents, clothes, medicines, driving papers, baggage, SIM, and digital backups.", href: "/before-you-fly", icon: Plane },
  { title: "First 7 days", text: "Focus on SIM, transport, temporary stay, food, key documents, and immediate admin.", href: "/ai-assistant", icon: CheckCircle2 },
  { title: "First 30 days home setup", text: "Plan keys, inspection, WiFi, utilities, furniture, appliances, groceries, and commute tests.", href: "/home-setup", icon: Home },
  { title: "Services to research", text: "Compare movers, temporary stay, SIM, rentals, schools, medical prep, banking, and groceries.", href: "/services", icon: ClipboardCheck },
  { title: "Reference links", text: "Use public resources and platforms for flights, stays, shopping, transport, and official sources.", href: "/reference-links", icon: Route },
  { title: "Ask future AI assistant", text: "The AI assistant will later use your destination, move reason, and family profile for better checklists.", href: "/ai-assistant", icon: Bot },
];

export function StartPathClient() {
  const [destination, setDestination] = useState(destinations[0]);
  const [reason, setReason] = useState(reasons[0]);
  const [profile, setProfile] = useState(profiles[2]);

  const destinationHref = destination.href ?? "/countries";

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Start your path</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">
            Start Your Relocation Path
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
            Choose your destination, move reason, and family profile. VideshFlow will point you to the most relevant country kit, checklist, service categories, reference links, and future AI guidance.
          </p>
          <div className="mt-8 grid gap-4 rounded-3xl bg-[#f8f6f1] p-5 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a6a20]">Destination</p>
              <p className="mt-2 text-lg font-semibold text-[#123638]">{destination.label}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a6a20]">Move reason</p>
              <p className="mt-2 text-lg font-semibold text-[#123638]">{reason.label}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a6a20]">Profile</p>
              <p className="mt-2 text-lg font-semibold text-[#123638]">{profile.label}</p>
            </div>
          </div>
        </div>

        <SelectorSection
          eyebrow="Step 1"
          title="Where are you moving?"
          description="Start with the destination so the site does not feel like a generic relocation ocean."
        >
          {destinations.map((item) => (
            <button
              key={item.label}
              onClick={() => setDestination(item)}
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${destination.label === item.label ? "border-[#123638] bg-[#123638] text-white" : "border-black/5 bg-white text-[#172326]"}`}
            >
              <span className="text-sm font-semibold">{item.label}</span>
              <span className={`mt-2 block text-xs ${destination.label === item.label ? "text-white/75" : "text-slate-500"}`}>{item.status === "ready" ? "Starter kit ready" : "Coming soon"}</span>
            </button>
          ))}
        </SelectorSection>

        <SelectorSection
          eyebrow="Step 2"
          title="Why are you moving?"
          description="A job offer, student move, corporate transfer, and family move need different checklists."
          id="reason-guidance"
        >
          {reasons.map((item) => (
            <button
              key={item.label}
              onClick={() => setReason(item)}
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${reason.label === item.label ? "border-[#123638] bg-[#123638] text-white" : "border-black/5 bg-white text-[#172326]"}`}
            >
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </SelectorSection>

        <SelectorSection
          eyebrow="Step 3"
          title="Who is moving?"
          description="Solo movers, students, couples, families with children, and parents need different support."
        >
          {profiles.map((item) => (
            <button
              key={item.label}
              onClick={() => setProfile(item)}
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${profile.label === item.label ? "border-[#123638] bg-[#123638] text-white" : "border-black/5 bg-white text-[#172326]"}`}
            >
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </SelectorSection>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-[2rem] bg-[#123638] p-8 text-white shadow-sm sm:p-10">
            <UsersRound className="h-8 w-8 text-[#f2c56b]" />
            <h2 className="mt-5 text-2xl font-semibold">Your selected path</h2>
            <p className="mt-4 text-sm leading-7 text-white/75">
              India to {destination.shortLabel} + {reason.label.toLowerCase()} + {profile.label.toLowerCase()}.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/75">{destination.note}</p>
            <div className="mt-7 flex flex-col gap-3">
              <Link href={destinationHref} className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#123638]">
                {destination.href ? "Open country starter kit" : "Open general country library"} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/get-help" className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Share this move stage later
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <GuidanceCard title={`${reason.label} focus`} items={reason.guidance} icon={<Luggage className="h-6 w-6 text-[#123638]" />} />
            <GuidanceCard title={`${profile.label} focus`} items={profile.guidance} icon={<UsersRound className="h-6 w-6 text-[#123638]" />} />
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Recommended next steps</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#172326]">Follow the right sequence, not a random ocean of links</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {nextSteps.map((step) => (
              <Link key={step.title} href={step.title === "Country starter kit" ? destinationHref : step.href} className="group rounded-3xl border border-black/5 bg-[#f8f6f1] p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <step.icon className="h-7 w-7 text-[#123638]" />
                <h3 className="mt-5 text-lg font-semibold text-[#172326]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
                <span className="mt-5 inline-flex items-center text-sm font-semibold text-[#123638]">Open <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-dashed border-[#123638]/25 bg-[#123638]/5 p-8 sm:p-10">
          <ShieldCheck className="h-7 w-7 text-[#123638]" />
          <h2 className="mt-5 text-2xl font-semibold text-[#172326]">Planning boundary</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            This path selector provides practical planning guidance only. It does not provide legal, immigration, tax, financial, medical, insurance, housing, school admission, travel, or vendor advice. Always verify current requirements with official sources and qualified professionals.
          </p>
        </div>

        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}

function SelectorSection({ eyebrow, title, description, children, id }: { eyebrow: string; title: string; description: string; children: ReactNode; id?: string }) {
  return (
    <div id={id} className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#172326]">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

function GuidanceCard({ title, items, icon }: { title: string; items: string[]; icon: ReactNode }) {
  return (
    <div className="rounded-[2rem] bg-white p-8 shadow-sm">
      {icon}
      <h2 className="mt-5 text-2xl font-semibold text-[#172326]">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm font-medium text-slate-700">{item}</div>
        ))}
      </div>
    </div>
  );
}

