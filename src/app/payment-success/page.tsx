"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Printer,
  Copy,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { generateStudentMovePack, type PackSection } from "@/lib/studentMovePack";
import { generatePremiumRelocationPack } from "@/lib/premiumRelocationPack";
import { generateVoiceGuide } from "@/lib/voiceGuide";

// ── Types ─────────────────────────────────────────────────────────────────────
type SuccessState =
  | "loading"
  | "verifiedPaid"
  | "missingSession"
  | "invalidSession"
  | "notPaid"
  | "error";

interface SessionData {
  paid: boolean;
  productType: "student" | "premium" | "voice";
  customerEmail: string | null;
  buyerName: string | null;
  // Student fields
  buyerRole?: string | null;
  moveRoute?: string | null;
  otherRoute?: string | null;
  departureMonth?: string | null;
  // Premium fields
  origin?: string | null;
  destination?: string | null;
  moveReason?: string | null;
  whoIsMoving?: string | null;
  timingMonth?: string | null;
  modules?: string | null;
  // Shared
  concerns: string | null;
  amountTotal: number | null;
  currency: string | null;
}

function VoiceGuideView({ data }: { data: SessionData }) {
  const [copied, setCopied] = useState(false);

  const guide = generateVoiceGuide({
    origin: data.origin,
    destination: data.destination,
    moveReason: data.moveReason,
    whoIsMoving: data.whoIsMoving,
    timingMonth: data.timingMonth,
    concerns: data.concerns,
    buyerName: data.buyerName,
  });

  const allSections: PackSection[] = [
    guide.routeSummary,
    guide.topSevenFocus,
    guide.firstSevenDays,
    guide.checklistWalkthrough,
    guide.documentsToPrepare,
    guide.providerQuestions,
    guide.researchLinks,
    guide.commonMistakes,
    guide.boundaryNote,
  ];

  function buildCopyText(): string {
    const lines: string[] = [
      "SettleMap Voice Guide",
      `Route: ${guide.effectiveRoute}`,
      data.timingMonth ? `Planned timing: ${data.timingMonth}` : "",
      data.concerns ? `Main concerns: ${data.concerns}` : "",
      "",
    ];

    for (const section of allSections) {
      lines.push(section.title.toUpperCase());
      for (const item of section.items) lines.push(`- ${item}`);
      lines.push("");
    }

    lines.push(guide.safetyBoundaryNote);
    lines.push("");
    lines.push("SettleMap | support@settlemap.app | settlemap.app");
    return lines.filter((line) => line !== undefined).join("\n");
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildCopyText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {/* silent */});
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
          <CheckCircle2 className="h-9 w-9 text-teal-700" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">
          Payment confirmed
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Your SettleMap Voice Guide script and walkthrough is ready below.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-teal-200 bg-teal-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-teal-700">
          Voice-style walkthrough
        </p>
        <div className="mt-3 grid gap-1.5 text-sm text-zinc-700">
          {data.buyerName && <p><span className="font-medium">Name:</span> {data.buyerName}</p>}
          <p><span className="font-medium">Route:</span> {guide.effectiveRoute}</p>
          {data.moveReason && <p><span className="font-medium">Move reason:</span> {data.moveReason}</p>}
          {data.timingMonth && <p><span className="font-medium">Timing:</span> {data.timingMonth}</p>}
          {data.concerns && <p><span className="font-medium">Main concerns:</span> {data.concerns}</p>}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
        <span>
          This version provides a written conversational walkthrough, not generated audio and not a human call. If autofulfilment is enabled, an email copy is also sent to your checkout email address.
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
        >
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </button>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
        >
          {copied ? (
            <><CheckCircle2 className="h-4 w-4 text-teal-700" /> Copied!</>
          ) : (
            <><Copy className="h-4 w-4" /> Copy guide</>
          )}
        </button>
        <a
          href="mailto:support@settlemap.app"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
        >
          <Mail className="h-4 w-4" />
          Email support
        </a>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
          Your SettleMap Voice Guide
        </p>
        <div className="mt-3 space-y-3">
          {allSections.map((section, i) => (
            <PackSectionCard key={section.title} section={section} defaultOpen={i === 0} accentColor="emerald" />
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-5 text-amber-800">
        {guide.safetyBoundaryNote}
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/#route-selector"
          className="inline-flex items-center justify-center rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-teal-800"
        >
          Build my move plan <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <Link
          href="/refund-request"
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-400"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Need a refund review?
        </Link>
      </div>
    </div>
  );
}

// ── Collapsible section ───────────────────────────────────────────────────────
function PackSectionCard({ section, defaultOpen = false, accentColor = "emerald" }: { section: PackSection; defaultOpen?: boolean; accentColor?: "emerald" | "violet" }) {
  const [open, setOpen] = useState(defaultOpen);
  const checkClass = accentColor === "violet" ? "text-violet-500" : "text-emerald-500";
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
              <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${checkClass}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Premium pack view ─────────────────────────────────────────────────────────
function PremiumPackView({ data }: { data: SessionData }) {
  const [copied, setCopied] = useState(false);

  const pack = generatePremiumRelocationPack({
    origin: data.origin,
    destination: data.destination,
    moveReason: data.moveReason,
    whoIsMoving: data.whoIsMoving,
    timingMonth: data.timingMonth,
    modules: data.modules,
    concerns: data.concerns,
    buyerName: data.buyerName,
  });

  const allSections: PackSection[] = [
    pack.routeSnapshot,
    pack.detailedChecklist,
    pack.budgetTemplate,
    pack.documentTracker,
    pack.firstWeekPlan,
    ...pack.personaModules,
    pack.providerScripts,
    pack.researchLinks,
    pack.officialSourceReminder,
  ];

  function buildCopyText(): string {
    const lines: string[] = [
      "SettleMap Premium Relocation Pack",
      `Route: ${pack.effectiveRoute}`,
      data.timingMonth ? `Planned timing: ${data.timingMonth}` : "",
      data.concerns ? `Main concerns: ${data.concerns}` : "",
      "",
    ];
    for (const section of allSections) {
      lines.push(section.title.toUpperCase());
      for (const item of section.items) lines.push(`- ${item}`);
      lines.push("");
    }
    lines.push(pack.safetyBoundaryNote);
    lines.push("");
    lines.push("SettleMap | support@settlemap.app | settlemap.app");
    return lines.filter((l) => l !== undefined).join("\n");
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildCopyText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {/* silent */});
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
          <CheckCircle2 className="h-9 w-9 text-violet-600" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">
          Payment confirmed
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Your Premium Relocation Pack is ready below.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-700">
          Your move details
        </p>
        <div className="mt-3 grid gap-1.5 text-sm text-zinc-700">
          {data.buyerName && <p><span className="font-medium">Name:</span> {data.buyerName}</p>}
          <p><span className="font-medium">Route:</span> {pack.effectiveRoute}</p>
          {data.timingMonth && <p><span className="font-medium">Planned timing:</span> {data.timingMonth}</p>}
          {data.modules && <p><span className="font-medium">Add-on modules:</span> {data.modules.split(",").join(", ")}</p>}
          {data.concerns && <p><span className="font-medium">Main concerns:</span> {data.concerns}</p>}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
        <span>
          Your Premium pack is shown below. An email copy is also being sent to your checkout email address. If it does not arrive within 15 minutes, contact{" "}
          <a href="mailto:support@settlemap.app" className="font-semibold text-violet-700 underline">
            support@settlemap.app
          </a>.
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
        >
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </button>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
        >
          {copied ? (
            <><CheckCircle2 className="h-4 w-4 text-violet-600" /> Copied!</>
          ) : (
            <><Copy className="h-4 w-4" /> Copy pack summary</>
          )}
        </button>
        <a
          href="mailto:support@settlemap.app"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
        >
          <Mail className="h-4 w-4" />
          Email support
        </a>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
          Your Premium Relocation Pack
        </p>
        <div className="mt-3 space-y-3">
          {allSections.map((section, i) => (
            <PackSectionCard key={section.title} section={section} defaultOpen={i === 0} accentColor="violet" />
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-5 text-amber-800">
        {pack.safetyBoundaryNote}
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/#route-selector"
          className="inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-700"
        >
          Build my move plan <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <Link
          href="/refund-request"
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-400"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Need a refund review?
        </Link>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl border border-zinc-200 bg-white p-4 text-xs text-zinc-500">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
        Do not send: passport numbers, visa numbers, bank details, medical details or ID documents.
      </div>
    </div>
  );
}

// ── Student pack view ─────────────────────────────────────────────────────────
function PaidPackView({ data }: { data: SessionData }) {
  const [copied, setCopied] = useState(false);

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
        s.title !== pack.ninetyDayPlan.title &&
        s.title !== pack.researchLinksSection.title,
    ),
    pack.researchLinksSection,
    pack.officialSourceReminder,
  ];

  function buildCopyText(): string {
    const lines: string[] = [
      "SettleMap Student Move Pack",
      `Route: ${pack.effectiveRoute}`,
      data.departureMonth ? `Expected departure: ${data.departureMonth}` : "",
      data.concerns ? `Main concerns: ${data.concerns}` : "",
      "",
      `Route tip: ${pack.routeSummary}`,
      "",
    ];
    for (const section of allSections) {
      lines.push(section.title.toUpperCase());
      for (const item of section.items) lines.push(`- ${item}`);
      lines.push("");
    }
    lines.push(pack.safetyBoundaryNote);
    lines.push("");
    lines.push("SettleMap | support@settlemap.app | settlemap.app");
    return lines.filter((l) => l !== undefined).join("\n");
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildCopyText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {/* silent */});
  }

  return (
    <div className="mx-auto max-w-2xl">
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

      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
          Your move details
        </p>
        <div className="mt-3 grid gap-1.5 text-sm text-zinc-700">
          {data.buyerName && <p><span className="font-medium">Name:</span> {data.buyerName}</p>}
          <p><span className="font-medium">Route:</span> {pack.effectiveRoute}</p>
          {data.departureMonth && <p><span className="font-medium">Expected departure:</span> {data.departureMonth}</p>}
          {data.concerns && <p><span className="font-medium">Main concerns:</span> {data.concerns}</p>}
        </div>
        <div className="mt-3 rounded-lg bg-white/60 px-4 py-3 text-sm text-emerald-800">
          {pack.routeSummary}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <span>
          Your paid pack is shown below. The email copy is also being sent to your checkout email. If it does not arrive within 15 minutes, use the plan shown here and contact{" "}
          <a href="mailto:support@settlemap.app" className="font-semibold text-emerald-700 underline">
            support@settlemap.app
          </a>.
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
        >
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </button>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
        >
          {copied ? (
            <><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Copied!</>
          ) : (
            <><Copy className="h-4 w-4" /> Copy pack summary</>
          )}
        </button>
        <a
          href="mailto:support@settlemap.app"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
        >
          <Mail className="h-4 w-4" />
          Email support
        </a>
      </div>

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

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-5 text-amber-800">
        {pack.safetyBoundaryNote}
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/#route-selector"
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700"
        >
          Build my move plan <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <Link
          href="/refund-request"
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-400"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Need a refund review?
        </Link>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl border border-zinc-200 bg-white p-4 text-xs text-zinc-500">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
        Do not send: passport numbers, visa numbers, bank details, medical details or ID documents.
      </div>
    </div>
  );
}

// ── Neutral error view ────────────────────────────────────────────────────────
function NeutralView({ state }: { state: SuccessState }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
        <AlertCircle className="h-9 w-9 text-zinc-400" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">
        Payment status unavailable
      </h1>
      <p className="mt-4 text-base leading-7 text-zinc-600">
        We could not verify a payment from this page. If you completed payment, please check your Stripe receipt email or contact{" "}
        <a href="mailto:support@settlemap.app" className="font-semibold text-emerald-700 underline">
          support@settlemap.app
        </a>.
      </p>
      {state === "invalidSession" && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 text-left">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          The payment session link appears to be invalid or expired. Please use the link from your Stripe confirmation email.
        </div>
      )}
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/pricing"
          className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Return to pricing <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <a
          href="mailto:support@settlemap.app"
          className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:border-zinc-400"
        >
          <Mail className="mr-2 h-4 w-4" />
          Contact support
        </a>
      </div>
    </div>
  );
}

// ── Not paid view ─────────────────────────────────────────────────────────────
function NotPaidView() {
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
        <XCircle className="h-9 w-9 text-amber-500" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">
        Payment not confirmed
      </h1>
      <p className="mt-4 text-base leading-7 text-zinc-600">
        We could not confirm a completed payment for this session. If your card was charged, please contact{" "}
        <a href="mailto:support@settlemap.app" className="font-semibold text-emerald-700 underline">
          support@settlemap.app
        </a>{" "}
        with your Stripe receipt as confirmation.
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/pricing"
          className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Return to pricing <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <a
          href="mailto:support@settlemap.app"
          className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:border-zinc-400"
        >
          <Mail className="mr-2 h-4 w-4" />
          Contact support
        </a>
      </div>
    </div>
  );
}

// ── Main content ──────────────────────────────────────────────────────────────
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [state, setState] = useState<SuccessState>(
    sessionId ? "loading" : "missingSession",
  );
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setState("missingSession");
      return;
    }

    setState("loading");

    fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        if (res.status === 402 || res.status === 403) { setState("notPaid"); return; }
        if (!res.ok) { setState("invalidSession"); return; }
        const data = (await res.json()) as SessionData;
        if (!data.paid) { setState("notPaid"); return; }
        setSessionData(data);
        setState("verifiedPaid");
      })
      .catch(() => setState("error"));
  }, [sessionId]);

  if (state === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-4 text-sm text-zinc-500">Loading your pack…</p>
        </div>
      </div>
    );
  }

  if (state === "verifiedPaid" && sessionData) {
    if (sessionData.productType === "premium") {
      return <PremiumPackView data={sessionData} />;
    }
    if (sessionData.productType === "voice") {
      return <VoiceGuideView data={sessionData} />;
    }
    return <PaidPackView data={sessionData} />;
  }

  if (state === "notPaid") return <NotPaidView />;

  return <NeutralView state={state} />;
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
