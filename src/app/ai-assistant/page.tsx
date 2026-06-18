import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bell, Bot, CalendarCheck, ClipboardCheck, Home, Languages, PackageCheck, Route, ShieldCheck } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";

export const metadata: Metadata = {
  title: "AI Relocation Assistant",
  description: "Future AI assistant for practical relocation questions, checklists, reminders, and official source routing.",
};

const promptChips = [
  "Is this Singapore salary enough for a family of 3?",
  "What should I do in my first 7 days after landing?",
  "How do I keep my Indian SIM active for OTPs?",
  "What should I check before renting a house?",
  "What should I pack before leaving India?",
  "What services should I research before moving?",
];

const roadmap = [
  { icon: ClipboardCheck, title: "Personal relocation checklist generator" },
  { icon: CalendarCheck, title: "First 7, 30, 90 day timeline" },
  { icon: PackageCheck, title: "Delivery and mover tracking reminder" },
  { icon: Bell, title: "Calendar reminders for appointments" },
  { icon: ClipboardCheck, title: "Document checklist memory" },
  { icon: Home, title: "Rental viewing checklist" },
  { icon: Route, title: "School and childcare planning checklist" },
  { icon: PackageCheck, title: "Packing and baggage planner" },
  { icon: CalendarCheck, title: "Timezone and world clock helper" },
  { icon: Route, title: "Service request routing" },
  { icon: Languages, title: "Multilingual question answering" },
];


const languageExamples = [
  "Singapore madhe family sathi rent kiti yel?",
  "UK la first week madhe kay karaycha?",
  "Mala Indian SIM OTP sathi kay plan karaycha?",
  "Kids schooling Singapore madhe kasa plan karaycha?",
];

export default function AiAssistantPage() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">AI relocation assistant</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">Ask practical relocation questions in one place</h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
            VideshFlow is being prepared for an AI-first relocation assistant that can guide users through planning questions, country guides, service categories, future reminders, and official-source routing.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Cost of living and offer planning",
              "First 7, 30, and 90 day checklists",
              "Documents, packing, medicine, and Indian SIM OTP continuity",
              "Rental research, school planning, groceries, community, and home setup",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm font-semibold text-[#123638]">{item}</div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[2rem] bg-[#123638] p-8 text-white shadow-sm sm:p-10">
            <Bot className="h-9 w-9 text-[#f2c56b]" />
            <h2 className="mt-5 text-2xl font-semibold">AI assistant coming soon</h2>
            <p className="mt-4 text-sm leading-7 text-white/75">
              For now, explore country guides or submit a relocation help request. The assistant will provide experience-based planning guidance, keep answers checklist based, and route users back to official sources where rules are involved.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/countries" className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#123638]">
                Explore guides <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/get-help" className="inline-flex items-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Get help
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
            <ShieldCheck className="h-8 w-8 text-[#123638]" />
            <h2 className="mt-5 text-2xl font-semibold text-[#172326]">AI safety boundary</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The AI assistant will not provide legal, immigration, tax, financial, medical, insurance, housing, school admission, or vendor advice. It will help users prepare better questions, build checklists, and verify rule-sensitive topics with official sources or qualified professionals.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-[#172326]">Suggested questions</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">These are the type of checklist-based questions the future AI assistant should answer.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {promptChips.map((prompt) => (
              <span key={prompt} className="rounded-full border border-black/10 bg-[#f8f6f1] px-4 py-2 text-sm font-semibold text-[#123638]">{prompt}</span>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Future AI planner features</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#172326]">Designed to help users think, plan, and remember</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            In future, VideshFlow can help users remember relocation tasks such as mover delivery dates, key collection, rental inspection, school appointments, SIM activation, WiFi setup, and document follow-ups. Users should still verify directly with service providers and official sources.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roadmap.map((item) => (
              <div key={item.title} className="rounded-2xl border border-black/5 bg-[#f8f6f1] p-5">
                <item.icon className="h-6 w-6 text-[#123638]" />
                <p className="mt-4 text-sm font-semibold leading-6 text-[#172326]">{item.title}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#9a6a20]">Coming soon</p>
              </div>
            ))}
          </div>
        </div>


        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
          <Route className="h-8 w-8 text-[#123638]" />
          <h2 className="mt-5 text-2xl font-semibold text-[#172326]">Personalised by path later</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The future AI assistant will use destination, move reason, and family profile to generate more relevant checklist-style answers instead of giving generic relocation text.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "India to Singapore + job offer + family with child",
              "India to UK + student move + solo",
              "India to UAE + corporate transfer + family",
              "India to Canada + PR migration + couple",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm font-semibold text-[#123638]">{item}</div>
            ))}
          </div>
          <Link href="/start" className="mt-7 inline-flex items-center rounded-full bg-[#123638] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0c2829]">
            Start your relocation path <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
          <Languages className="h-8 w-8 text-[#123638]" />
          <h2 className="mt-5 text-2xl font-semibold text-[#172326]">Language support approach</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Prefer another language? You can use your browser translate feature to view this page in your preferred language. The future AI assistant is planned to support English, Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati, Malayalam, Punjabi, and Hinglish-style questions.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {languageExamples.map((example) => (
              <div key={example} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm font-semibold text-[#123638]">“{example}”</div>
            ))}
          </div>
        </div>

        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
