"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bot, CheckCircle2, ChevronRight, ClipboardCheck, Clock3, FileSearch, Globe2, Home, Luggage, MessageSquareText, Plane, Route, SearchCheck, ShieldCheck, Sparkles, UploadCloud, UsersRound } from "lucide-react";
import { destinations, documentCategories, moveReasons, platformStats, profiles, realStories, serviceCategories, type DestinationKey, type MoveReasonKey, type ProfileKey } from "@/data/demoPlatform";
import { buildTimeline, calculateProgress, groupByPhase } from "@/lib/relocationTimeline";
import { DISCLAIMER_SHORT } from "@/lib/constants";

const storageKey = "videshflow-demo-progress-v1";

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ExecutiveDemoHome() {
  const [destinationKey, setDestinationKey] = useState<DestinationKey>("singapore");
  const [reasonKey, setReasonKey] = useState<MoveReasonKey>("job");
  const [profileKey, setProfileKey] = useState<ProfileKey>("familyChild");
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const destination = destinations.find((item) => item.key === destinationKey) ?? destinations[0];
  const reason = moveReasons.find((item) => item.key === reasonKey) ?? moveReasons[0];
  const profile = profiles.find((item) => item.key === profileKey) ?? profiles[2];
  const timeline = useMemo(() => buildTimeline(destinationKey, reasonKey, profileKey), [destinationKey, reasonKey, profileKey]);
  const grouped = useMemo(() => groupByPhase(timeline), [timeline]);
  const progress = calculateProgress(timeline, completedIds);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setCompletedIds(JSON.parse(stored));
    } catch {
      setCompletedIds([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedIds));
    } catch {}
  }, [completedIds]);

  function toggleTask(id: string) {
    setCompletedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function resetProgress() {
    setCompletedIds([]);
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <Hero destination={destination.label} reason={reason.label} profile={profile.label} progress={progress} />

      <section id="selector" className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-black/5 bg-white/80 p-6 shadow-xl shadow-black/5 backdrop-blur sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">First click router</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">Tell VideshFlow where this journey starts</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Choose destination, move reason, and family profile. The demo instantly reshapes the 90-day plan, starter kit, document checklist, and AI prompt context without forcing login.
              </p>
              <div className="mt-6 rounded-3xl bg-[var(--cream-soft)] p-5">
                <p className="text-sm font-semibold text-[var(--teal)]">Selected path</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">{destination.route}</p>
                <p className="mt-1 text-sm text-slate-600">{reason.label} + {profile.label}</p>
              </div>
            </div>

            <div className="grid gap-5">
              <ChoiceGroup title="Where are you moving?" items={destinations} selected={destinationKey} onSelect={(key) => setDestinationKey(key as DestinationKey)} />
              <ChoiceGroup title="Why are you moving?" items={moveReasons} selected={reasonKey} onSelect={(key) => setReasonKey(key as MoveReasonKey)} />
              <ChoiceGroup title="Who is moving?" items={profiles} selected={profileKey} onSelect={(key) => setProfileKey(key as ProfileKey)} />
            </div>
          </div>
        </div>
      </section>

      <Dashboard destination={destination} reason={reason} profile={profile} progress={progress} completed={completedIds.length} total={timeline.length} />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.28fr_0.72fr]">
          <TimelineBoard grouped={grouped} completedIds={completedIds} onToggle={toggleTask} onReset={resetProgress} progress={progress} />
          <DestinationKit destination={destination} reasonFocus={reason.focus} profileFocus={profile.focus} />
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <DocumentAuditor destination={destination.label} reasonKey={reasonKey} profileKey={profileKey} />
          <ChatbotMock destination={destination.label} reason={reason.label} profile={profile.label} />
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionEyebrow eyebrow="Human proof" title="Real stories grid" description="An executive demo layer showing how community insights can become searchable, anonymised relocation wisdom." />
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

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[var(--teal)] p-8 text-white shadow-xl shadow-black/10 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">Demo architecture</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Built for executive storytelling now, scalable architecture later</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">This prototype uses mock AI, local progress state, and static data panels so leadership can see the operating model: plan, track, audit, ask, route, and learn. Later phases can bolt on auth, database, OCR, AI API, CRM, calendar and provider integrations.</p>
              <p className="mt-5 rounded-2xl bg-white/10 p-4 text-xs leading-6 text-white/70">{DISCLAIMER_SHORT}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "No forced login for first value",
                "Mock OCR for demo speed",
                "API-ready chatbot UI",
                "90-day local progress state",
                "Destination-specific panels",
                "Safe provider research language",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-semibold text-white/85">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-[var(--gold)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

type SelectItem = { key: string; label: string };

function ChoiceGroup({ title, items, selected, onSelect }: { title: string; items: SelectItem[]; selected: string; onSelect: (key: string) => void }) {
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

function Hero({ destination, reason, profile, progress }: { destination: string; reason: string; profile: string; progress: number }) {
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_12%_12%,rgba(212,175,55,0.32),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(0,77,77,0.18),transparent_30%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--teal)] shadow-sm">
            <Sparkles className="h-4 w-4 text-[var(--gold-dark)]" />
            Executive demo, AI-first 360° relocation platform
          </div>
          <h1 className="mt-7 text-5xl font-semibold tracking-tight text-[var(--ink)] sm:text-6xl lg:text-7xl">VideshFlow Command Centre</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">A premium relocation operating prototype for Indian professionals and families, combining destination starter kits, 90-day tracking, mock document audit, AI chatbot UI, and real story intelligence.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#selector" className="rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--teal-dark)]">Start demo flow</a>
            <a href="#timeline" className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-[var(--teal)] shadow-sm hover:bg-slate-50">View 90-day timeline</a>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <MiniStat label="Current path" value={destination} />
            <MiniStat label="Move reason" value={reason} />
            <MiniStat label="Profile" value={profile} />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-[var(--gold)]/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-2 shadow-2xl shadow-black/10">
            <Image src="/images/hero_family_world_map.png" alt="Indian family and professionals preparing for relocation" width={1672} height={941} priority className="w-full rounded-[1.5rem] object-cover" />
            <div className="absolute bottom-5 left-5 right-5 rounded-3xl bg-white/90 p-5 shadow-lg backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-dark)]">90-day readiness</p>
                  <p className="mt-1 text-2xl font-semibold text-[var(--ink)]">{progress}% complete</p>
                </div>
                <div className="h-16 w-16 rounded-full border-8 border-[var(--cream-soft)]" style={{ background: `conic-gradient(var(--teal) ${progress * 3.6}deg, transparent 0deg)` }} />
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-[var(--teal)] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{value}</p>
    </div>
  );
}

function Dashboard({ destination, reason, profile, progress, completed, total }: { destination: { label: string; route: string; headline: string; climate: string }; reason: { label: string; focus: string[] }; profile: { label: string; focus: string[] }; progress: number; completed: number; total: number }) {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionEyebrow eyebrow="Interactive dashboard" title="Relocation project view" description="A project-style dashboard that shows the selected move, progress, practical focus areas, and next recommended actions." />
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-[2rem] bg-[var(--teal)] p-7 text-white shadow-xl shadow-black/10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">Selected relocation path</p>
            <h3 className="mt-4 text-3xl font-semibold">{destination.route}</h3>
            <p className="mt-3 text-sm leading-7 text-white/75">{destination.headline}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-white/60">Reason</p>
                <p className="mt-1 font-semibold">{reason.label}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-white/60">Profile</p>
                <p className="mt-1 font-semibold">{profile.label}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {platformStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
                <stat.icon className="h-6 w-6 text-[var(--teal)]" />
                <p className="mt-5 text-2xl font-semibold text-[var(--ink)]">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:col-span-2 xl:col-span-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">Timeline progress</p>
                  <p className="mt-1 text-sm text-slate-500">{completed} of {total} tasks completed</p>
                </div>
                <p className="text-3xl font-semibold text-[var(--teal)]">{progress}%</p>
              </div>
              <div className="mt-4 h-3 rounded-full bg-[var(--cream-soft)]">
                <div className="h-3 rounded-full bg-[var(--gold)] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <FocusCard title="Move reason focus" items={reason.focus} />
          <FocusCard title="Family profile focus" items={profile.focus} />
          <FocusCard title="Weather and culture note" items={[destination.climate]} />
        </div>
      </div>
    </section>
  );
}

function FocusCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
      <p className="font-semibold text-[var(--ink)]">{title}</p>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 flex-none text-[var(--gold-dark)]" />{item}</li>
        ))}
      </ul>
    </div>
  );
}

function TimelineBoard({ grouped, completedIds, onToggle, onReset, progress }: { grouped: ReturnType<typeof groupByPhase>; completedIds: string[]; onToggle: (id: string) => void; onReset: () => void; progress: number }) {
  const phases = Object.keys(grouped) as Array<keyof typeof grouped>;
  return (
    <div id="timeline" className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">Dynamic logic</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">First 90 Days timeline</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">Tasks are generated from destination, reason, and family profile, then grouped into phases. This is the core “relocation as a project” demo.</p>
        </div>
        <button onClick={onReset} className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--teal)] hover:bg-[var(--cream-soft)]">Reset demo</button>
      </div>
      <div className="mt-6 rounded-3xl bg-[var(--cream-soft)] p-4">
        <div className="flex items-center justify-between text-sm font-semibold text-[var(--ink)]">
          <span>Project progress</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-white">
          <div className="h-2 rounded-full bg-[var(--teal)] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="mt-7 space-y-7">
        {phases.map((phase) => (
          <div key={phase}>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--teal)] text-white"><Clock3 className="h-4 w-4" /></div>
              <h3 className="text-xl font-semibold text-[var(--ink)]">{phase}</h3>
            </div>
            <div className="space-y-3">
              {grouped[phase].map((task) => {
                const done = completedIds.includes(task.id);
                return (
                  <button key={task.id} onClick={() => onToggle(task.id)} className={classNames("w-full rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md", done ? "border-[var(--gold)] bg-[var(--gold)]/10" : "border-black/5 bg-white")}> 
                    <div className="flex gap-4">
                      <div className={classNames("mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full border", done ? "border-[var(--teal)] bg-[var(--teal)] text-white" : "border-slate-300 bg-white")}>{done && <CheckCircle2 className="h-4 w-4" />}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[var(--cream-soft)] px-3 py-1 text-xs font-semibold text-[var(--teal)]">{task.day}</span>
                          <span className={classNames("rounded-full px-3 py-1 text-xs font-semibold", task.priority === "Critical" ? "bg-red-50 text-red-700" : task.priority === "High" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600")}>{task.priority}</span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{task.category}</span>
                        </div>
                        <h4 className="mt-3 text-lg font-semibold text-[var(--ink)]">{task.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {task.tools.map((tool) => <span key={tool} className="rounded-full border border-black/5 bg-white px-3 py-1 text-xs font-medium text-slate-500">{tool}</span>)}
                        </div>
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

function DestinationKit({ destination, reasonFocus, profileFocus }: { destination: { label: string; route: string; headline: string; starterPath?: string; focus: string[]; serviceLinks: string[]; climate: string }; reasonFocus: string[]; profileFocus: string[] }) {
  return (
    <aside className="space-y-6">
      <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl shadow-black/5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">Starter kit panel</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--ink)]">{destination.route}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">{destination.headline}</p>
        {destination.starterPath ? (
          <Link href={destination.starterPath} className="mt-5 inline-flex items-center rounded-full bg-[var(--teal)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--teal-dark)]">Open country kit <ArrowRight className="ml-2 h-4 w-4" /></Link>
        ) : (
          <div className="mt-5 rounded-2xl bg-[var(--cream-soft)] p-4 text-sm font-semibold text-[var(--teal)]">Starter kit coming soon. Use general checklists and reference links for now.</div>
        )}
      </div>
      <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
        <p className="font-semibold text-[var(--ink)]">Country focus</p>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          {destination.focus.map((item) => <li key={item} className="flex gap-2"><ChevronRight className="mt-1 h-4 w-4 flex-none text-[var(--gold-dark)]" />{item}</li>)}
        </ul>
      </div>
      <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
        <p className="font-semibold text-[var(--ink)]">Service categories to research</p>
        <div className="mt-4 grid gap-3">
          {serviceCategories.map((service) => <div key={service.label} className="flex items-center gap-3 rounded-2xl bg-[var(--cream-soft)] p-3 text-sm font-semibold text-[var(--teal)]"><service.icon className="h-4 w-4" />{service.label}</div>)}
        </div>
      </div>
      <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
        <p className="font-semibold text-[var(--ink)]">Reference link style</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">Use links as research convenience only. No endorsement, no guarantee, no official partnership claim.</p>
        <div className="mt-4 space-y-2">
          {destination.serviceLinks.map((link) => <p key={link} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 ring-1 ring-black/5">{link}</p>)}
        </div>
      </div>
    </aside>
  );
}

function DocumentAuditor({ destination, reasonKey, profileKey }: { destination: string; reasonKey: MoveReasonKey; profileKey: ProfileKey }) {
  const [checked, setChecked] = useState<string[]>(["passport"]);
  const [fileName, setFileName] = useState("");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done">("idle");

  const docs = documentCategories.filter((doc) => doc.requiredFor.includes("all") || doc.requiredFor.includes(reasonKey) || doc.requiredFor.includes(profileKey));
  const score = Math.round((checked.length / docs.length) * 100);

  function toggle(id: string) {
    setChecked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function handleFile(file?: File) {
    if (!file) return;
    setFileName(file.name);
    setScanState("scanning");
    window.setTimeout(() => {
      setChecked((current) => Array.from(new Set([...current, "passport", "offer", "medical", "finance"])));
      setScanState("done");
    }, 900);
  }

  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">Mock OCR</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">AI document checklist</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">Upload a sample file to simulate OCR extraction. This demo never sends files anywhere.</p>
        </div>
        <div className="rounded-3xl bg-[var(--cream-soft)] p-4 text-center">
          <p className="text-3xl font-semibold text-[var(--teal)]">{score}%</p>
          <p className="text-xs font-semibold text-slate-500">ready</p>
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--teal)]/30 bg-[var(--cream-soft)] p-7 text-center hover:border-[var(--teal)]">
        <UploadCloud className="h-8 w-8 text-[var(--teal)]" />
        <span className="mt-3 text-sm font-semibold text-[var(--ink)]">Upload passport, offer letter, rental PDF, or mover quote</span>
        <span className="mt-1 text-xs text-slate-500">Mock OCR only, API connection later</span>
        <input type="file" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
      </label>

      {fileName && (
        <div className="mt-4 rounded-2xl bg-white p-4 text-sm ring-1 ring-black/5">
          <p className="font-semibold text-[var(--ink)]">{scanState === "scanning" ? "Scanning mock document..." : "Mock scan completed"}</p>
          <p className="mt-1 text-slate-600">File: {fileName}</p>
          {scanState === "done" && <p className="mt-2 text-[var(--teal)]">Detected passport, offer letter indicators, medical note, and financial proof keywords.</p>}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {docs.map((doc) => {
          const active = checked.includes(doc.id);
          return (
            <button key={doc.id} onClick={() => toggle(doc.id)} className={classNames("flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition", active ? "border-[var(--gold)] bg-[var(--gold)]/10" : "border-black/5 bg-white hover:bg-[var(--cream-soft)]")}> 
              <div className={classNames("flex h-9 w-9 items-center justify-center rounded-2xl", active ? "bg-[var(--teal)] text-white" : "bg-[var(--cream-soft)] text-[var(--teal)]")}><doc.icon className="h-5 w-5" /></div>
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">{doc.label}</p>
                <p className="mt-1 text-xs text-slate-500">Needed for {destination} planning, verify official requirements directly.</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChatbotMock({ destination, reason, profile }: { destination: string; reason: string; profile: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([
    { role: "ai", text: `Hi, I am the VideshFlow relocation assistant demo. I am using your selected context: ${destination}, ${reason}, ${profile}. Ask about cost, rent, SIM OTP, documents, schools, or first 7 days.` },
  ]);

  function mockAnswer(question: string) {
    const q = question.toLowerCase();
    if (q.includes("cost") || q.includes("salary") || q.includes("budget")) return `For ${destination}, split costs into rent, school or childcare, groceries, utilities, transport, deposits, medical, and first-month setup. Treat this as planning guidance only, then verify current prices with live rental listings, school fee pages, and official sources.`;
    if (q.includes("rent") || q.includes("house") || q.includes("lease")) return `Before choosing a rental in ${destination}, compare commute, school route, groceries, safety comfort, deposit, furniture status, and contract terms. Never transfer advance money to an unverified party.`;
    if (q.includes("sim") || q.includes("otp") || q.includes("bank")) return `Keep your Indian SIM active for bank and investment OTPs, arrange roaming or SMS access, and activate a local SIM after landing. Add backup email and phone recovery options before leaving India.`;
    if (q.includes("school") || q.includes("child")) return `For children, start with school calendar, curriculum transition, fee range, commute, vaccination records, and rental area alignment. School admission rules must be checked directly with schools or official portals.`;
    if (q.includes("document") || q.includes("passport") || q.includes("upload")) return `Create one physical folder and one cloud folder for passport, offer/admission, family certificates, medical prescriptions, school records, driving papers, mover quotes, and official appointment instructions.`;
    return `Here is a safe checklist-style response for ${destination}: confirm official requirements, list your next 7 days, check service categories to research, avoid unverified providers, and use VideshFlow to track the 90-day plan. I do not provide legal, tax, immigration, medical, housing, school admission, or vendor advice.`;
  }

  function send(text = input) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { role: "user", text: trimmed }, { role: "ai", text: mockAnswer(trimmed) }]);
    setInput("");
  }

  const chips = ["Is this salary enough?", "What should I do first 7 days?", "How to keep Indian SIM OTP?", "What should I check before renting?", "Kids schooling kasa plan karaycha?"];

  return (
    <div className="rounded-[2rem] border border-black/5 bg-[var(--teal)] p-6 text-white shadow-xl shadow-black/10 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">API-ready UI</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">AI chatbot interface</h2>
      <p className="mt-3 text-sm leading-7 text-white/75">Mocked for demo speed. Later connect to OpenAI / Claude / Gemini with retrieval, safety guardrails, official source routing, multilingual responses, and provider triage.</p>
      <div className="mt-6 h-[26rem] overflow-y-auto rounded-3xl bg-white/10 p-4">
        <div className="space-y-3">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={classNames("rounded-2xl p-4 text-sm leading-6", message.role === "ai" ? "mr-8 bg-white text-slate-700" : "ml-8 bg-[var(--gold)] text-[var(--ink)]")}> 
              {message.text}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((chip) => <button key={chip} onClick={() => send(chip)} className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/20">{chip}</button>)}
      </div>
      <div className="mt-4 flex gap-2">
        <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") send(); }} placeholder="Ask relocation question..." className="min-w-0 flex-1 rounded-full border border-white/10 bg-white px-5 py-3 text-sm text-slate-800 outline-none" />
        <button onClick={() => send()} className="rounded-full bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-[var(--ink)]">Send</button>
      </div>
    </div>
  );
}

function SectionEyebrow({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>}
    </div>
  );
}
