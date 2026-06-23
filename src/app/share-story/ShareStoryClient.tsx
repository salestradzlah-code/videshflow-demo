"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Copy } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { TALLY_FORM_URL } from "@/lib/constants";

const questions = [
  "Which route are you planning?",
  "Are you a student, working professional, family with children, or domestic mover?",
  "What task is most painful in this process?",
  "Would you pay for a personalised plan?",
  "Would you want concierge help?",
];

export function ShareStoryClient() {
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyQuestion = async (question: string) => {
    try {
      await navigator.clipboard.writeText(question);
      setCopiedQuestion(question);
      setTimeout(() => setCopiedQuestion((current) => (current === question ? null : current)), 2000);
    } catch {
      // Clipboard access can fail in some browsers; the question text is still visible to copy manually.
    }
  };

  const copyAllQuestions = async () => {
    try {
      await navigator.clipboard.writeText(questions.map((q, i) => `${i + 1}. ${q}`).join("\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // Clipboard access can fail in some browsers; the question text is still visible to copy manually.
    }
  };

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-8 rounded-[2rem] bg-white p-8 shadow-sm sm:p-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Feedback request</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">Help shape SettleMap</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              This is an early feedback demo. Copy any question below and submit your answer through our feedback form, or use it as a starting point for a conversation with our team. Your experience helps the next family avoid confusion around documents, SIM cards, OTPs, rent, school, healthcare, banking, and first-month setup.
            </p>
            <a
              href={TALLY_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#123638] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0c2829]"
            >
              Share feedback <ArrowRight className="h-4 w-4" />
            </a>
            <div className="mt-8 grid gap-3">
              {questions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => copyQuestion(question)}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-[#f8f6f1] p-4 text-left text-sm font-medium text-slate-700 transition hover:bg-[#f0ecdf]"
                >
                  <span>{question}</span>
                  {copiedQuestion === question ? (
                    <Check className="h-4 w-4 flex-none text-[#123638]" />
                  ) : (
                    <Copy className="h-4 w-4 flex-none text-slate-400" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={copyAllQuestions}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-[#123638] hover:bg-slate-50"
              >
                {copiedAll ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedAll ? "Copied all questions" : "Copy all questions"}
              </button>
              <Link href="/disclaimer" className="rounded-full border border-black/10 bg-white px-6 py-3 text-center text-sm font-semibold text-[#123638] hover:bg-slate-50">
                Read contributor boundaries
              </Link>
            </div>
            <div className="mt-8 rounded-3xl border border-dashed border-[#123638]/30 bg-[#123638]/5 p-5">
              <p className="font-semibold text-[#172326]">How feedback is used</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Responses may be edited, shortened, and anonymized into practical relocation guidance with your permission. We will not publish identifying details without checking with you first.
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
