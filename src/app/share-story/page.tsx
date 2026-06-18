import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { STORY_FORM_URL } from "@/lib/constants";
import { DisclaimerBox } from "@/components/DisclaimerBox";

export const metadata: Metadata = {
  title: "Share Your Relocation Story",
  description: "Contribute a real relocation story to help Indian professionals and families moving abroad.",
};

const questions = [
  "What was the most stressful part before your move?",
  "Which document or admin step surprised you?",
  "How did you manage Indian bank OTPs after landing?",
  "What hidden cost appeared in the first 30 days?",
  "What would you do differently if you moved again?",
];

export default function ShareStoryPage() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-8 rounded-[2rem] bg-white p-8 shadow-sm sm:p-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Contributor stories</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">Share the move lessons you wish someone had told you</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Your experience can help the next Indian family avoid confusion around documents, SIM cards, OTPs, rent, school, healthcare, banking, and first-month setup.
            </p>
            <div className="mt-8 grid gap-3">
              {questions.map((question) => (
                <div key={question} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm font-medium text-slate-700">{question}</div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={STORY_FORM_URL} className="rounded-full bg-[#123638] px-6 py-3 text-center text-sm font-semibold text-white hover:bg-[#0c2829]">
                Open story form
              </Link>
              <Link href="/disclaimer" className="rounded-full border border-black/10 bg-white px-6 py-3 text-center text-sm font-semibold text-[#123638] hover:bg-slate-50">
                Read contributor boundaries
              </Link>
            </div>
            <div id="story-form-coming-soon" className="mt-8 rounded-3xl border border-dashed border-[#123638]/30 bg-[#123638]/5 p-5">
              <p className="font-semibold text-[#172326]">Story form coming soon</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The Tally story form will be connected here. Until then, this button stays on the page instead of opening a broken external form link.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-[#f8f6f1] shadow-sm">
            <Image
              src="/images/share_story_laptop.png"
              alt="Laptop showing a relocation story form with passport, luggage tag, and practical move icons"
              width={1672}
              height={941}
              className="h-auto w-full object-cover"
              sizes="(min-width: 1024px) 48vw, 100vw"
            />
          </div>
        </div>
        <div className="mt-8"><DisclaimerBox /></div>
      </div>
    </section>
  );
}
