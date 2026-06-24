"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { generateStudentMovePack, type PackSection } from "@/lib/studentMovePack";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SessionData {
  paid: boolean;
  customerEmail: string | null;
  buyerName: string | null;
  buyerRole: string | null;
  moveRoute: string | null;
  otherRoute: string | null;
  departureMonth: string | null;
  concerns: string | null;
  amountTotal: number | null;
  currency: string | null;
}

// ── Collapsible section ───────────────────────────────────────────────────────
function PackSectionCard({ section, defaultOpen = false }: { section: PackSection; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-zinc-800">{section.title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-zinc-400" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
        )}
      </button>
      {open && (
        <ul className="space-y-2 border-t border-zinc-100 px-5 pb-5 pt-4">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-6 text-zinc-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Full paid pack view ───────────────────────────────────────────────────────
function PaidPackView({ data }: { data: SessionData }) {
  const pack = generateStudentMovePack({
    moveRoute: data.moveRoute,
    otherRoute: data.otherRoute,
    departureMonth: data.departureMonth,
    concerns: data.concerns,
    buyerRole: data.buyerRole,
    buyerName: data.buyerName,
  });

  const allSections: PackSection[] = [
    pack.ninetyDayPlan,
    pack.firstSevenDays,
    ...pack.concernSections.filter(
      (s) =>
        s.title !== pack.firstSevenDays.title &&
        s.title !== pack.ninetyDayPlan.title,
    ),
    pack.officialSourceReminder,
  ];

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">
          Payment confirmed
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Your Student Move Pack is ready below.
        </p>
      </div>

      {/* Move details */}
      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
          Your move details
        </p>
        <div className="mt-3 grid gap-1.5 text-sm text-zinc-700">
          {data.buyerName && (
            <p>
              <span className="font-medium">Name:</span> {data.buyerName}
            </p>
          )}
          <p>
            <span className="font-medium">Route:</span> {pack.effectiveRoute}
          </p>
          {data.departureMonth && (
            <p>
              <span className="font-medium">Expected departure:</span>{" "}
              {data.departureMonth}
            </p>
          )}
          {data.concerns && (
            <p>
              <span className="font-medium">Main concerns:</span> {data.concerns}
            </p>
          )}
        </div>
        <div className="mt-3 rounded-lg bg-white/60 px-4 py-3 text-sm text-emerald-800">
          {pack.routeSummary}
        </div>
      </div>

      {/* Email notice */}
      <div className="mt-4 flex items-start gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <span>
          A copy of this pack has been emailed to your checkout email. If you do not receive it within 15 minutes, use the plan below and contact{" "}
          <a href="mailto:support@settlemap.app" className="font-semibold text-emerald-700 underline">
            support@settlemap.app
          </a>
          .
        </span>
      </div>

      {/* Pack sections */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
          Your Student Move Pack
        </p>
        <div className="mt-3 space-y-3">
          {allSections.map((section, i) => (
            <PackSectionCard key={section.title} section={section} defaultOpen={i === 0} />
          ))}
        </div>
      </div>

      {/* Safety note */}
      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-5 text-amber-800">
        {pack.safetyBoundaryNote}
      </div>

      {/* CTAs */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/#route-selector"
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700"
        >
          Build my move plan <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <a
          href="mailto:support@settlemap.app"
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-400"
        >
          Contact support <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </div>

      {/* Do not send */}
      <div className="mt-5 flex items-start gap-2 rounded-xl border border-zinc-200 bg-white p-4 text-xs text-zinc-500">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
        Do not send: passport numbers, visa numbers, bank details, medical details or ID documents.
      </div>
    </div>
  );
}

// ── Fallback (no session_id or session lookup failed) ─────────────────────────
function FallbackView({ reason }: { reason: "no-session" | "lookup-failed" }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="h-9 w-9 text-emerald-600" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">
        Payment confirmed
      </h1>
      <p className="mt-4 text-base leading-7 text-zinc-600">
        Your Stripe receipt confirms your payment. Your Student Move Pack email should arrive within 15 minutes.
      </p>
      {reason === "lookup-failed" && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 text-left">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          We could not load your pack summary right now. Your payment was successful — the email copy will include your full pack.
        </div>
      )}
      <div className="mt-6 rounded-xl border border-zinc-200/80 bg-white p-5 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          If you do not receive your email within 15 minutes
        </p>
        <ul className="mt-3 space-y-2 text-sm text-zinc-600">
          {[
            "Check your spam or junk folder.",
            "Email support@settlemap.app with your payment email and move route.",
            "Include your Stripe receipt as confirmation of payment.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/#route-selector"
          className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Build my move plan <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <a
          href="mailto:support@settlemap.app"
          className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:border-zinc-400"
        >
          <Mail className="mr-2 h-4 w-4" />
          support@settlemap.app
        </a>
      </div>
    </div>
  );
}

// ── Main content (inside Suspense) ────────────────────────────────────────────
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(!!sessionId);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [lookupFailed, setLookupFailed] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Session lookup failed");
        const data = (await res.json()) as SessionData;
        if (!data.paid) throw new Error("Not paid");
        setSessionData(data);
      })
      .catch(() => {
        setLookupFailed(true);
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-4 text-sm text-zinc-500">Loading your Student Move Pack…</p>
        </div>
      </div>
    );
  }

  if (sessionData?.paid) {
    return <PaidPackView data={sessionData} />;
  }

  return (
    <FallbackView reason={lookupFailed ? "lookup-failed" : "no-session"} />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PaymentSuccessPage() {
  return (
    <section className="min-h-[60vh] bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </section>
  );
}
