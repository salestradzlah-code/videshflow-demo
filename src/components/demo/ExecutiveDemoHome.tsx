"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowRight, Bot, CalendarDays, CheckCircle2, Clock3, FileSearch, Globe2, Plane, RefreshCcw, Route, Sparkles, UploadCloud } from "lucide-react";
import { addOnOptions, destinations, documentCategories, moveReasons, petOptions, platformStats, profiles, realStories, serviceCategories, type AddOnKey, type Destination, type DestinationKey, type MoveReason, type MoveReasonKey, type PetKey, type Profile, type ProfileKey, type TimelineTask } from "@/data/demoPlatform";
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
  addOns: AddOnKey[];
};

const initialSelection: RouteSelection = {
  fromKey: null,
  fromCity: "",
  toKey: null,
  toCity: "",
  reasonKey: null,
  profileKey: null,
  petKey: "none",
  addOns: [],
};

const WIZARD_STEPS = [
  { id: 1, label: "Route" },
  { id: 2, label: "Reason" },
  { id: 3, label: "Profile" },
  { id: 4, label: "Add-ons" },
] as const;

export function ExecutiveDemoHome() {
  const [selection, setSelection] = useState<RouteSelection>(initialSelection);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  const isRouteReady = Boolean(selection.fromKey && selection.toKey && selection.reasonKey && selection.profileKey);
  const showDashboard = confirmed && isRouteReady;
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
  const addOnsKey = [...selection.addOns].sort().join(",");
  const progressStorageKey = isRouteReady ? `settlemap-progress-v6-${selection.fromKey}-${selection.toKey}-${selection.reasonKey}-${selection.profileKey}-${selection.petKey}-${addOnsKey}` : "settlemap-progress-v6-draft";

  const timeline = useMemo(() => {
    if (!isRouteReady || !selection.fromKey || !selection.toKey || !selection.reasonKey || !selection.profileKey) return [];
    return buildTimeline(selection.fromKey, selection.toKey, selection.reasonKey, selection.profileKey, selection.petKey, selection.addOns);
  }, [isRouteReady, selection.fromKey, selection.toKey, selection.reasonKey, selection.profileKey, selection.petKey, addOnsKey]);

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
    try {
      localStorage.removeItem(progressStorageKey);
    } catch {}
  }

  function toggleAddOn(key: AddOnKey) {
    setSelection((current) => ({
      ...current,
      addOns: current.addOns.includes(key) ? current.addOns.filter((item) => item !== key) : [...current.addOns, key],
    }));
  }

  function scrollTo(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToStep(next: number) {
    setStep(Math.min(4, Math.max(1, next)));
  }

  function editRoute() {
    setConfirmed(false);
    setStep(1);
    setTimeout(() => scrollTo("route-selector"), 50);
  }

  function confirmRoute() {
    setConfirmed(true);
  }

  useEffect(() => {
    if (!showDashboard) return;
    const timeout = setTimeout(() => scrollTo("dashboard-top"), 150);
    return () => clearTimeout(timeout);
  }, [showDashboard]);

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <Hero />

      <section id="route-selector" className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-black/5 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur sm:p-8">
          {!showDashboard ? (
            <>
              <WizardStepper step={step} />

              {step === 1 && (
                <WizardStep
                  eyebrow="Step 1 of 4"
                  title="Where are you moving from and to?"
                  description="Cities are optional. SettleMap covers international routes and domestic moves within the same country."
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ChoiceGroup title="Moving from country" items={destinations} selected={selection.fromKey} onSelect={(key) => updateSelection("fromKey", key as DestinationKey)} />
                    <CityField label="Moving from city (optional)" value={selection.fromCity} onChange={(value) => updateSelection("fromCity", value)} />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <ChoiceGroup title="Moving to country" items={destinations} selected={selection.toKey} onSelect={(key) => updateSelection("toKey", key as DestinationKey)} />
                    <CityField label="Moving to city (optional)" value={selection.toCity} onChange={(value) => updateSelection("toCity", value)} />
                  </div>
                </WizardStep>
              )}

              {step === 2 && (
                <WizardStep eyebrow="Step 2 of 4" title="What is the reason for your move?" description="This shapes which tasks and documents show up in your plan.">
                  <ChoiceGroup title="Move reason" items={moveReasons} selected={selection.reasonKey} onSelect={(key) => updateSelection("reasonKey", key as MoveReasonKey)} />
                </WizardStep>
              )}

              {step === 3 && (
                <WizardStep eyebrow="Step 3 of 4" title="Who is part of this move?" description="We use life-stage bands only — never an exact date of birth.">
                  <ChoiceGroup title="Household profile" items={profiles} selected={selection.profileKey} onSelect={(key) => updateSelection("profileKey", key as ProfileKey)} />
                </WizardStep>
              )}

              {step === 4 && (
                <WizardStep eyebrow="Step 4 of 4" title="Any add-ons or special needs?" description="Select any that apply. This is optional and can be changed later.">
                  <MultiChoiceGroup title="Add-ons" items={addOnOptions} selected={selection.addOns} onToggle={(key) => toggleAddOn(key as AddOnKey)} />
                  {selection.addOns.includes("pets") && (
                    <div className="mt-4">
                      <ChoiceGroup title="Pet type" items={petOptions} selected={selection.petKey} onSelect={(key) => updateSelection("petKey", key as PetKey)} />
                    </div>
                  )}
                </WizardStep>
              )}

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => goToStep(step - 1)}
                  disabled={step === 1}
                  className={classNames("rounded-full border px-5 py-3 text-sm font-semibold", step === 1 ? "cursor-not-allowed border-black/5 text-slate-300" : "border-black/10 text-[var(--ink)] hover:border-[var(--teal)] hover:text-[var(--teal)]")}
                >
                  Back
                </button>
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => goToStep(step + 1)}
                    disabled={(step === 1 && !(selection.fromKey && selection.toKey)) || (step === 2 && !selection.reasonKey) || (step === 3 && !selection.profileKey)}
                    className={classNames(
                      "rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm",
                      (step === 1 && !(selection.fromKey && selection.toKey)) || (step === 2 && !selection.reasonKey) || (step === 3 && !selection.profileKey)
                        ? "cursor-not-allowed bg-slate-300"
                        : "bg-[var(--teal)] hover:bg-[var(--teal-dark,var(--teal))]"
                    )}
                  >
                    Next <ArrowRight className="ml-2 inline h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={confirmRoute}
                    disabled={!isRouteReady}
                    className={classNames("rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm", isRouteReady ? "bg-[var(--teal)] hover:bg-[var(--teal-dark,var(--teal))]" : "cursor-not-allowed bg-slate-300")}
                  >
                    Build my move plan <ArrowRight className="ml-2 inline h-4 w-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <RouteReadyCard
              isReady={isRouteReady}
              isDomestic={isDomestic}
              routeLabel={routeLabel}
              routeMeta={routeMeta}
              onViewPlan={() => scrollTo("timeline-dashboard")}
              onEditRoute={editRoute}
            />
          )}
        </div>
      </section>

      {!showDashboard && <PreSelectionGuide />}

      {showDashboard && origin && destination && reason && profile && (
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
            SettleMap · Map your move. Settle with confidence.
          </div>
          <h1 className="mt-7 text-5xl font-semibold tracking-tight text-[var(--ink)] sm:text-6xl lg:text-7xl">Map your move. Settle with confidence.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            SettleMap helps you plan your relocation in 90 days — from country, city, reason, family needs, pets, documents, housing, money, health, and settling in. This is an early feedback demo.
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
              Explore sample routes
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

function WizardStepper({ step }: { step: number }) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-[var(--teal)]">Route setup wizard</p>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Step {step} of 4</p>
      </div>
      <div className="mt-4 h-2 rounded-full bg-[var(--cream-soft)]">
        <div className="h-2 rounded-full bg-[var(--teal)] transition-all" style={{ width: `${(step / 4) * 100}%` }} />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        {WIZARD_STEPS.map((item) => (
          <div key={item.id} className={classNames("rounded-2xl border p-3 text-center text-xs font-semibold", item.id === step ? "border-[var(--teal)] bg-[var(--teal)] text-white" : item.id < step ? "border-[var(--teal)] bg-white text-[var(--teal)]" : "border-black/5 bg-white/50 text-slate-500")}>
            {item.id < step ? "✓ " : ""}{item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function WizardStep({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function MultiChoiceGroup({ title, items, selected, onToggle }: { title: string; items: readonly SelectItem[]; selected: string[]; onToggle: (key: string) => void }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-[var(--ink)]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected.includes(item.key);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onToggle(item.key)}
              className={classNames(
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                active ? "border-[var(--teal)] bg-[var(--teal)] text-white shadow-sm" : "border-black/10 bg-white text-slate-700 hover:border-[var(--teal)] hover:text-[var(--teal)]"
              )}
            >
              {item.label}
            </button>
          );
        })}
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

function RouteReadyCard({ isReady, isDomestic, routeLabel, routeMeta, onViewPlan, onEditRoute }: { isReady: boolean; isDomestic: boolean; routeLabel: string; routeMeta: string; onViewPlan: () => void; onEditRoute: () => void }) {
  return (
    <div className={classNames("rounded-[2rem] border p-6", isReady ? "border-[var(--teal)] bg-[var(--teal)] text-white" : "border-black/5 bg-[var(--cream-soft)] text-[var(--ink)]")}>
      {isReady ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">{isDomestic ? "Your domestic relocation plan is ready" : "Your international relocation plan is ready"}</p>
            <h3 className="mt-2 text-2xl font-semibold">{routeLabel} · {routeMeta}</h3>
            <p className="mt-2 text-sm text-white/75">Progress baseline: 0% ready. Start ticking tasks once you begin planning.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={onViewPlan} className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--teal)] shadow-sm hover:bg-[var(--cream)]">
              View my plan <ArrowRight className="ml-2 inline h-4 w-4" />
            </button>
            <button onClick={onEditRoute} className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Edit route
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
    <section id="dashboard-top" className="scroll-mt-24 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionEyebrow eyebrow="Interactive dashboard" title={isDomestic ? "Domestic relocation plan" : "International relocation plan"} description="Your dashboard, built the moment your route is selected." />
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
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
          Open route starter kit <ArrowRight className="ml-2 h-4 w-4" />
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
