import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About SettlePath and why it exists.",
};

export default function AboutPage() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">About SettlePath</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">Built for the messy middle of relocation</h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
          <p>
            A visa or move date is only one part of relocating. The harder part often begins after that, when people and families need to manage documents, banking, SIM continuity, rentals, school questions, groceries, healthcare, and first-month setup.
          </p>
          <p>
            SettlePath turns real relocation experiences into practical route starter kits for people and families planning relocation across countries, cities, and life stages. It keeps official links visible, separates personal experience from formal advice, and focuses on the first 7, 30, and 90 days.
          </p>
          <p>
            The first version is intentionally small: a clean route library, contributor stories, practical checklists, and safe public-source guidance.
          </p>
          <p className="text-sm text-slate-500">
            VideshFlow may later become the India and diaspora route track inside SettlePath.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/countries" className="rounded-full bg-[#123638] px-6 py-3 text-center text-sm font-semibold text-white hover:bg-[#0c2829]">Explore countries</Link>
          <Link href="/share-story" className="rounded-full border border-black/10 px-6 py-3 text-center text-sm font-semibold text-[#123638] hover:bg-slate-50">Share your story</Link>
        </div>
      </div>
    </section>
  );
}
