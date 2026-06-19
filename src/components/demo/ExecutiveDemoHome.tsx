"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bot, CalendarDays, CheckCircle2, Clock3, FileSearch, Globe2, Plane, RefreshCcw, Route, Sparkles, UploadCloud } from "lucide-react";
import { destinations, documentCategories, moveReasons, petOptions, platformStats, profiles, realStories, serviceCategories, type Destination, type DestinationKey, type MoveReason, type MoveReasonKey, type PetKey, type Profile, type ProfileKey, type TimelineTask } from "@/data/demoPlatform";
import { buildTimeline, calculateProgress, groupByPhase } from "@/lib/relocationTimeline";
import { DISCLAIMER_SHORT } from "@/lib/constants";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type SelectItem = { key: string; label: string };

type RouteSelection = {
  fromKey: DestinationKey | null;
  fromCity: string;
  toKey: DestinationKey | null;
  toCity: string;
  reasonKey: MoveReasonKey | null;
  profileKey: ProfileKey | null;
  petKey: PetKey;
};

const initialSelection: RouteSelection = {
  fromKey: null,
  fromCity: "",
  toKey: null,
  toCity: "",
  reasonKey: null,
  profileKey: null,
  petKey: "none",
};

export function ExecutiveDemoHome() {
  const [selection, setSelection] = useState<RouteSelection>(initialSelection);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const isRouteReady = Boolean(selection.fromKey && selection.toKey && selection.reasonKey && selection.profileKey);
  const origin = destinations.find((item) => item.key === selection.fromKey) ?? null;
  const destination = destinations.find((item) => item.key === selection.toKey) ?? null;
  const reason = moveReasons.find((item) => item.key === selection.reasonKey) ?? null;
  const profile = profiles.find((item) => item.key === selection.profileKey) ?? null;
  const isDomestic = Boolean(selection.fromKey && selection.toKey && selection.fromKey === selection.toKey);

  const originLabel = origin ? (selection.fromCity ? `${selection.fromCity}, ${origin.label}` : origin.label) : "";
  const destinationLabel = destination ? (selection.toCity ? `${selection.toCity}, ${destination.label}` : destination.label) : "";
  const routeLabel = isRouteReady && origin && destination
    ? isDomestic
      ? `Domestic move within ${destinationLabel}`
      : `${originLabel} to ${destinationLabel}`
    : "Choose your route";
  const routeMeta = isRouteReady && reason && profile ? `${reason.label} · ${profile.label}` : "Moving from, moving to, reason and profile";
  const progressStorageKey = isRouteReady ? `settlepath-progress-v4-${selection.fromKey}-${selection.toKey}-${selection.reasonKey}-${selection.profileKey}-${selection.petKey}` : "settlepath-progress-v4-draft";

  const timeline = useMemo(() => {
    if (!isRouteReady || !selection.fromKey || !selection.toKey || !selection.reasonKey || !selection.profileKey) return [];
    return buildTimeline(selection.fromKey, selection.toKey, selection.reasonKey, selection.profileKey, selection.petKey);
  }, [isRouteReady, selection.fromKey, selection.toKey, selection.reasonKey, selection.profileKey, selection.petKey]);

  const grouped = useMemo(() => groupByPhase(timeline), [timeline]);
  const progress = calculateProgress(timeline, completedIds);

  useEffect(() => {
    if (!isRouteReady) {
      setCompletedIds([]);
      return;
    }

    try {
      const stored = localStorage.getItem(progressStorageKey);
      setCompletedIds(stored ? JSON.parse(stored) : []);
    } catch {
      setCompletedIds([]);
    }
  }, [isRouteReady, progressStorageKey]);

  useEffect(() => {
    if (!isRouteReady) return;
    try {
      localStorage.setItem(progressStorageKey, JSON.stringify(completedIds));
    } catch {}
  }, [completedIds, isRouteReady, progressStorageKey]);

  function updateSelection<K extends keyof RouteSelection>(key: K, value: RouteSelection[K]) {
    setSelection((current) => ({ ...current, [key]: value }));
  }

  function toggleTask(id: string) {
    setCompletedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function resetProgress() {
    setCompletedIds([]);
  }

  function scrollTo(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <Hero />

      <section id="route-selector" className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-black/5 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">Step 1 · Route selector</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">Where are you moving from and to?</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                SettlePath starts with a global route, not just one destination. Choose the route, reason and who is moving first. The dashboard appears only after your path is clear.
              </p>
              <SelectionProgress selection={selection} />
            </div>

            <div className="grid gap-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <ChoiceGroup title="Moving from country" items={destinations} selected={selection.fromKey} onSelect={(key) => updateSelection("fromKey", key as DestinationKey)} />
                <CityField label="Moving from city (optional)" value={selection.fromCity} onChange={(value) => updateSelection("fromCity", value)} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <ChoiceGroup title="Moving to country" items={destinations} selected={selection.toKey} onSelect={(key) => updateSelection("toKey", key as DestinationKey)} />
                <CityField label="Moving to city (optional)" value={selection.toCity} onChange={(value) => updateSelection("toCity", value)} />
              </div>
              <ChoiceGroup title="Move reason" items={moveReasons} selected={selection.reasonKey} onSelect={(key) => updateSelection("reasonKey", key as MoveReasonKey)} />
              <ChoiceGroup title="Who is moving" items={profiles} selected={selection.profileKey} onSelect={(key) => updateSelection("profileKey", key as ProfileKey)} />
              <ChoiceGroup title="Pets" items={petOptions} selected={selection.petKey} onSelect={(key) => updateSelection("petKey", key as PetKey)} />
            </div>
          </div>

          <RouteReadyCard
            isReady={isRouteReady}
            isDomestic={isDomestic}
            routeLabel={routeLabel}
            routeMeta={routeMeta}
            onViewPlan={() => scrollTo("timeline-dashboard")}
          />
        </div>
      </section>

      {!isRouteReady && <PreSelectionGuide />}

      {isRouteReady && origin && destination && reason && profile && (
        <>
          <Dashboard origin={origin} destination={destination} reason={reason} profile={profile} progress={progress} completed={completedIds.length} total={timeline.length} routeLabel={routeLabel} isDomestic={isDomestic} />

          <section id="timeline-dashboard" className="scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.28fr_0.72fr]">
              <TimelineBoard grouped={grouped} completedIds={completedIds} onToggle={toggleTask} onReset={resetProgress} progress={progress} />
              <RouteStarterKit origin={origin} destination={destination} reasonFocus={reason.focus} profileFocus={profile.focus} routeLabel={routeLabel} isDomestic={isDomestic} />
            </div>
          </section>

          <section className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <DocumentAuditor routeLabel={routeLabel} reasonKey={reason.key} profileKey={profile.key} />
              <ChatbotMock routeLabel={routeLabel} reason={reason.label} profile={profile.label} />
            </div>
          </section>

          <ServicesSection />
          <RealStoriesSection />
          <ArchitectureSection />
        </>
      )}
    </div>
  );
}

function Hero() {
  function scrollTo(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_12%_12%,rgba(212,175,55,0.34),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(0,77,77,0.2),transparent_30%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--teal)] shadow-sm">
            <Sparkles className="h-4 w-4 text-[var(--gold-dark)]" />
            SettlePath · from anywhere to home
          </div>
          <h1 className="mt-7 text-5xl font-semibold tracking-tight text-[var(--ink)] sm:text-6xl lg:text-7xl">Move from anywhere to home.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            SettlePath helps you plan your relocation in 90 days — from country, city, reason, family needs, pets, documents, housing, money, health, and settling in.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => scrollTo("route-selector")}
              className="rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--teal-dark,var(--teal))]"
            >
              Build my move plan
            </button>
            <button
              onClick={() => scrollTo("sample-routes")}
              className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-sm hover:border-[var(--teal)] hover:text-[var(--teal)]"
            >
              See sample routes
            </button>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            {platformStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm">
                <stat.icon className="mb-3 h-5 w-5 text-[var(--teal)]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectionProgress({ selection }: { selection: RouteSelection }) {
  const steps = [
    { label: "From", done: Boolean(selection.fromKey) },
    { label: "To", done: Boolean(selection.toKey) },
    { label: "Reason", done: Boolean(selection.reasonKey) },
    { label: "Profile", done: Boolean(selection.profileKey) },
  ];
  const doneCount = steps.filter((step) => step.done).length;

  return (
    <div className="mt-6 rounded-3xl bg-[var(--cream-soft)] p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-[var(--teal)]">Route setup</p>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{doneCount}/4 complete</p>
      </div>
      <div className="mt-4 h-2 rounded-full bg-white">
        <div className="h-2 rounded-full bg-[var(--teal)] transition-all" style={{ width: `${(doneCount / 4) * 100}%` }} />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        {steps.map((step) => (
          <div key={step.label} className={classNames("rounded-2xl border p-3 text-xs font-semibold", step.done ? "border-[var(--teal)] bg-white text-[var(--teal)]" : "border-black/5 bg-white/50 text-slate-500")}>
            {step.done ? "✓ " : "○ "}{step.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChoiceGroup({ title, items, selected, onSelect }: { title: string; items: readonly SelectItem[]; selected: string | null; onSelect: (key: string) => void }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-[var(--ink)]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={classNames(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              selected === item.key
                ? "border-[var(--teal)] bg-[var(--teal)] text-white shadow-sm"
                : "border-black/10 bg-white text-slate-700 hover:border-[var(--teal)] hover:text-[var(--teal)]"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CityField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-[var(--ink)]">{label}</p>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="City name"
        className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-[var(--teal)]"
      />
    </div>
  );
}

function RouteReadyCard({ isReady, isDomestic, routeLabel, routeMeta, onViewPlan }: { isReady: boolean; isDomestic: boolean; routeLabel: string; routeMeta: string; onViewPlan: () => void }) {
  return (
    <div className={classNames("mt-8 rounded-[2rem] border p-6", isReady ? "border-[var(--teal)] bg-[var(--teal)] text-white" : "border-black/5 bg-[var(--cream-soft)] text-[var(--ink)]")}>
      {isReady ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">{isDomestic ? "Your domestic relocation plan is ready" : "Your international relocation plan is ready"}</p>
            <h3 className="mt-2 text-2xl font-semibold">{routeLabel} · {routeMeta}</h3>
            <p className="mt-2 text-sm text-white/75">Progress baseline: 0% ready. Start ticking tasks once you begin planning.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={onViewPlan} className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--teal)] shadow-sm hover:bg-[var(--cream)]">
              Build my move plan <ArrowRight className="ml-2 inline h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          <Route className="mt-1 h-6 w-6 text-[var(--teal)]" />
          <div>
            <p className="text-lg font-semibold">Complete the route choices above</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">The full dashboard, timeline, document checklist and AI mock assistant stay hidden until your route is selected. Cities and pets are optional. This keeps the first action clear.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PreSelectionGuide() {
  const cards = [
    { title: "1. Pick your route", desc: "From country or region, to country or region.", icon: Globe2 },
    { title: "2. Add your reason", desc: "Job, study, corporate transfer, family, PR, business, return home or already landed.", icon: Plane },
    { title: "3. Unlock your plan", desc: "Then view a 90-day project-style dashboard built around that context.", icon: CalendarDays },
  ];

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionEyebrow eyebrow="Before you start" title="A clearer first step, not a content ocean" description="The prototype now waits for your route before showing the full relocation command centre." />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <card.icon className="h-6 w-6 text-[var(--teal)]" />
              <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Dashboard({ origin, destination, reason, profile, progress, completed, total, routeLabel, isDomestic }: { origin: Destination; destination: Destination; reason: MoveReason; profile: Profile; progress: number; completed: number; total: number; routeLabel: string; isDomestic: boolean }) {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionEyebrow eyebrow="Interactive dashboard" title={isDomestic ? "Domestic relocation plan" : "International relocation plan"} description="The dashboard now appears only after the route is selected, so the user knows exactly what changed." />
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-[2rem] bg-[var(--teal)] p-7 text-white shadow-xl shadow-black/10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">Selected route</p>
            <h3 className="mt-4 text-3xl font-semibold">{routeLabel}</h3>
            <p className="mt-3 text-sm leading-7 text-white/75">{isDomestic ? `Before you move within ${destination.label}.` : `From ${origin.label} to ${destination.label}.`} Context: {reason.label} · {profile.label}.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoPill label="Move reason" value={reason.label} />
              <InfoPill label="Who is moving" value={profile.label} />
              <InfoPill label="To climate" value={destination.climate} />
              <InfoPill label="Progress" value={`${completed}/${total} tasks`} />
            </div>
          </div>
          <div className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold-dark)]">90-day readiness</p>
                <h3 className="mt-2 text-4xl font-semibold text-[var(--ink)]">{progress}% ready</h3>
              </div>
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-[var(--cream-soft)] text-lg font-semibold text-[var(--teal)]" style={{ background: `conic-gradient(var(--teal) ${progress * 3.6}deg, white 0deg)` }}>
                {progress}%
              </div>
            </div>
            <div className="mt-6 h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-[var(--teal)] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <MiniMetric label="Route" value={routeLabel} />
              <MiniMetric label="Starter kit" value={destination.starterPath ? "Available" : "General guide"} />
              <MiniMetric label="Demo mode" value="Local progress" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--cream-soft)] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{value}</p>
    </div>
  );
}

function TimelineBoard({ grouped, completedIds, onToggle, onReset, progress }: { grouped: Record<string, TimelineTask[]>; completedIds: string[]; onToggle: (id: string) => void; onReset: () => void; progress: number }) {
  const phases = ["Before you move", "Days 1 to 7", "Days 8 to 30", "Days 31 to 90"];

  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold-dark)]">First 90 days</p>
          <h2 className="mt-2 text-3xl font-semibold text-[var(--ink)]">Dynamic relocation timeline</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Tick tasks as your move progresses. This is a demo tracker saved only in this browser.</p>
        </div>
        <button onClick={onReset} className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--teal)] hover:bg-slate-50">
          <RefreshCcw className="mr-2 inline h-4 w-4" /> Reset
        </button>
      </div>

      <div className="mt-6 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-[var(--teal)] transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-8 space-y-7">
        {phases.map((phase) => (
          <div key={phase}>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--ink)]">
              <Clock3 className="h-5 w-5 text-[var(--teal)]" /> {phase}
            </h3>
            <div className="mt-4 space-y-3">
              {(grouped[phase] ?? []).map((task) => {
                const done = completedIds.includes(task.id);
                return (
                  <button key={task.id} onClick={() => onToggle(task.id)} className={classNames("w-full rounded-3xl border p-4 text-left transition", done ? "border-[var(--teal)] bg-[var(--cream-soft)]" : "border-black/5 bg-white hover:border-[var(--teal)]/40") }>
                    <div className="flex gap-4">
                      <div className={classNames("mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border", done ? "border-[var(--teal)] bg-[var(--teal)] text-white" : "border-slate-300 text-transparent")}>✓</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={classNames("font-semibold", done ? "text-[var(--teal)] line-through" : "text-[var(--ink)]")}>{task.title}</p>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{task.priority}</span>
                          <span className="rounded-full bg-[var(--cream-soft)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--gold-dark)]">{task.category}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{task.timing}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RouteStarterKit({ origin, destination, reasonFocus, profileFocus, routeLabel, isDomestic }: { origin: Destination; destination: Destination; reasonFocus: readonly string[]; profileFocus: readonly string[]; routeLabel: string; isDomestic: boolean }) {
  return (
    <aside className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-7">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold-dark)]">Route starter kit</p>
      <h2 className="mt-2 text-3xl font-semibold text-[var(--ink)]">{routeLabel}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">{isDomestic ? "This panel focuses on lease handover, movers, utilities and local registrations for your move." : "This panel combines origin, destination, reason and profile into a practical route view."}</p>

      <div className="mt-6 space-y-5">
        {!isDomestic && <FocusList title={`From ${origin.label}, remember`} items={origin.essentials} />}
        <FocusList title={isDomestic ? `Within ${destination.label}, prioritise` : `To ${destination.label}, prioritise`} items={destination.essentials} />
        <FocusList title="Reason focus" items={reasonFocus} />
        <FocusList title="Profile focus" items={profileFocus} />
      </div>

      {destination.starterPath ? (
        <Link href={destination.starterPath} className="mt-6 inline-flex items-center rounded-full bg-[var(--teal)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--teal-dark)]">
          Open country starter kit <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      ) : (
        <div className="mt-6 rounded-3xl bg-[var(--cream-soft)] p-4 text-sm leading-6 text-slate-600">
          Country-specific starter kit coming soon. Use the general route checklist for now and verify all requirements with official sources.
        </div>
      )}
    </aside>
  );
}

function FocusList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-[var(--cream-soft)] px-3 py-1.5 text-xs font-semibold text-slate-600">{item}</span>
        ))}
      </div>
    </div>
  );
}

function DocumentAuditor({ routeLabel, reasonKey, profileKey }: { routeLabel: string; reasonKey: MoveReasonKey; profileKey: ProfileKey }) {
  const visibleDocs = documentCategories.filter((category) => category.requiredFor.includes(reasonKey) || category.requiredFor.includes(profileKey)).slice(0, 4);

  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[var(--cream-soft)] p-3"><FileSearch className="h-6 w-6 text-[var(--teal)]" /></div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold-dark)]">Mock OCR</p>
          <h2 className="text-2xl font-semibold text-[var(--ink)]">AI document checklist</h2>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">Demo mode for {routeLabel}. Upload UI is mocked. This demo never sends files anywhere.</p>
      <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[var(--teal)]/25 bg-[var(--cream-soft)] p-6 text-center hover:border-[var(--teal)]">
        <UploadCloud className="h-8 w-8 text-[var(--teal)]" />
        <span className="mt-3 text-sm font-semibold text-[var(--ink)]">Drop passport, visa, offer, school or rental files</span>
        <span className="mt-1 text-xs text-slate-500">Mock scan only. API-ready later.</span>
        <input type="file" className="hidden" />
      </label>
      <div className="mt-6 space-y-3">
        {visibleDocs.map((category) => (
          <div key={category.title} className="rounded-3xl border border-black/5 p-4">
            <div className="flex gap-3">
              <category.icon className="h-5 w-5 shrink-0 text-[var(--teal)]" />
              <div>
                <p className="font-semibold text-[var(--ink)]">{category.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{category.items.join(", ")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatbotMock({ routeLabel, reason, profile }: { routeLabel: string; reason: string; profile: string }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "I can help you convert this relocation route into checklist-style planning guidance. I am a mock assistant in this demo." },
  ]);
  const [input, setInput] = useState("");

  function sendMessage(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText) return;
    setMessages((current) => [
      ...current,
      { from: "user", text: userText },
      { from: "bot", text: `For ${routeLabel}, ${reason}, ${profile}, I would prioritise official links, documents, money buffer, temporary stay, local connectivity and the first 90-day task sequence. This is prototype guidance only.` },
    ]);
    setInput("");
  }

  const prompts = ["What should I do first?", "Which documents matter?", "What services should I research?"];

  return (
    <div className="rounded-[2rem] border border-black/5 bg-[var(--teal)] p-6 text-white shadow-xl shadow-black/10 sm:p-7">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white/10 p-3"><Bot className="h-6 w-6 text-[var(--gold)]" /></div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">API-ready mock</p>
          <h2 className="text-2xl font-semibold">AI chatbot interface</h2>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-white/70">The future AI assistant will use route, move reason and family profile to generate more relevant checklist-style answers.</p>
      <div className="mt-6 rounded-3xl bg-white/10 p-4">
        <div className="max-h-72 space-y-3 overflow-auto pr-1">
          {messages.map((message, index) => (
            <div key={`${message.from}-${index}`} className={classNames("rounded-2xl p-3 text-sm leading-6", message.from === "bot" ? "bg-white/10 text-white/80" : "ml-auto max-w-[85%] bg-white text-[var(--teal)]")}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button key={prompt} onClick={() => sendMessage(prompt)} className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10">{prompt}</button>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a route planning question" className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none" />
          <button onClick={() => sendMessage()} className="rounded-full bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-[var(--ink)]">Send</button>
        </div>
      </div>
    </div>
  );
}

function ServicesSection() {
  return (
    <section id="services-to-research" className="scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionEyebrow eyebrow="Action layer" title="Services to research" description="Service listings are research categories only. Users must compare, verify directly and check official sources before engaging anyone." />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {serviceCategories.map((service) => (
            <div key={service.title} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <service.icon className="h-6 w-6 text-[var(--teal)]" />
              <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{service.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RealStoriesSection() {
  return (
    <section id="sample-routes" className="scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionEyebrow eyebrow="Human proof" title="Real stories grid" description="Community insights can become searchable, anonymised relocation wisdom across many global routes." />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {realStories.map((story) => (
            <article key={story.name} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-dark)]">{story.route}</p>
              <h3 className="mt-4 text-xl font-semibold text-[var(--ink)]">{story.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{story.profile}</p>
              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
                <p><span className="font-semibold text-[var(--ink)]">Stress:</span> {story.stress}</p>
                <p><span className="font-semibold text-[var(--ink)]">Lesson:</span> {story.lesson}</p>
                <p><span className="font-semibold text-[var(--ink)]">Outcome:</span> {story.outcome}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-[var(--teal)] p-8 text-white shadow-xl shadow-black/10 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">Safety and architecture</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Global route planning now, scalable integrations later</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">This prototype uses mock AI, local progress state and static data panels so leadership can see the operating model: plan, track, audit, ask, route and learn. Later phases can add auth, database, OCR, AI API, CRM, calendar and provider integrations.</p>
            <p className="mt-5 rounded-2xl bg-white/10 p-4 text-xs leading-6 text-white/70">{DISCLAIMER_SHORT}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["No forced login", "Dashboard hidden until route is selected", "Mock OCR for demo speed", "API-ready chatbot UI", "Route-first service research", "Safe non-advisory wording"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-semibold text-white/85">
                <CheckCircle2 className="mb-3 h-5 w-5 text-[var(--gold)]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionEyebrow({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}
