"use client";

import { Fragment, useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Clock3, Copy, Download, RefreshCcw, ShieldCheck, Info } from "lucide-react";
import Link from "next/link";
import { singaporeOfficialLinkCategories, type MoveDateKey, type PlanSection } from "@/data/demoPlatform";
import {
  buildEnrichedTasks,
  getNextDueTask,
  PLAN_SECTION_DEFAULT_EXPANDED,
  PLAN_SECTION_ORDER,
  TASK_STATUSES,
  type EnrichedTask,
  type TaskScript,
  type TaskStage,
  type TaskStatus,
} from "@/lib/projectPlan";
import type { TimelineTask } from "@/data/demoPlatform";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type FilterKey = "All" | "High priority" | "Before move" | "Arrival week" | "First 30 days" | "Waiting" | "Not started" | "Done";

const FILTERS: FilterKey[] = ["All", "High priority", "Before move", "Arrival week", "First 30 days", "Waiting", "Not started", "Done"];

const PRIVACY_COPY =
  "SettleMap helps you plan and track. It does not verify service providers, official rules, contracts, fees, visas, taxes, schools, insurance, healthcare or housing eligibility. Always verify rule-sensitive matters with official sources.";

// V11.3 — plain-text checklist export. Client-side only (Blob + temporary link), no server
// round trip, so this stays quick and safe to ship alongside the rest of the plan.
function downloadPlanChecklist(tasks: EnrichedTask[], format: "csv" | "md") {
  const rows = tasks.map((task) => ({
    section: task.resolvedSection,
    title: task.title,
    tier: task.resolvedTier,
    stage: task.stage,
    priority: task.priority,
    owner: task.owner,
    nextStep: task.nextStep ?? "Plan this step.",
  }));

  let content: string;
  let mime: string;
  let extension: string;

  if (format === "csv") {
    const header = ["Section", "Title", "Tier", "Stage", "Priority", "Owner", "Next step"];
    const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    content = [header, ...rows.map((row) => [row.section, row.title, row.tier, row.stage, row.priority, row.owner, row.nextStep])]
      .map((row) => row.map((cell) => escapeCell(String(cell))).join(","))
      .join("\n");
    mime = "text/csv;charset=utf-8";
    extension = "csv";
  } else {
    const bySection = new Map<string, typeof rows>();
    for (const row of rows) {
      const list = bySection.get(row.section) ?? [];
      list.push(row);
      bySection.set(row.section, list);
    }
    const lines: string[] = ["# SettleMap relocation checklist", ""];
    for (const [section, sectionRows] of bySection) {
      lines.push(`## ${section}`, "");
      for (const row of sectionRows) {
        lines.push(`- [ ] **${row.title}** (${row.tier}, ${row.priority} priority, owner: ${row.owner}) — ${row.nextStep}`);
      }
      lines.push("");
    }
    content = lines.join("\n");
    mime = "text/markdown;charset=utf-8";
    extension = "md";
  }

  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `settlemap-checklist.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function ProjectPlanBoard({
  tasks,
  taskStatuses,
  taskNotes,
  onStatusChange,
  onNoteChange,
  onReset,
  moveDateType,
  moveDateValue,
  scripts,
}: {
  tasks: TimelineTask[];
  taskStatuses: Record<string, TaskStatus>;
  taskNotes: Record<string, string>;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onNoteChange: (id: string, note: string) => void;
  onReset: () => void;
  moveDateType: MoveDateKey | null;
  moveDateValue: string;
  scripts: Record<string, TaskScript>;
}) {
  const [filter, setFilter] = useState<FilterKey>("All");
  const [expandedSections, setExpandedSections] = useState<Record<PlanSection, boolean>>(PLAN_SECTION_DEFAULT_EXPANDED);

  function toggleSection(section: PlanSection) {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  const enriched = useMemo(
    () => buildEnrichedTasks(tasks, taskStatuses, taskNotes, moveDateType, moveDateValue),
    [tasks, taskStatuses, taskNotes, moveDateType, moveDateValue]
  );

  const total = enriched.length;
  const doneCount = enriched.filter((task) => task.status === "Done").length;
  const inProgressCount = enriched.filter((task) => task.status === "In progress").length;
  const waitingCount = enriched.filter((task) => task.status === "Waiting").length;
  const highPriorityOpen = enriched.filter((task) => task.priority === "High" && task.status !== "Done" && task.status !== "Not applicable").length;
  const nextDue = getNextDueTask(enriched);
  const progressPercent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const filtered = useMemo(() => {
    switch (filter) {
      case "All":
        return enriched;
      case "High priority":
        return enriched.filter((task) => task.priority === "High");
      case "Waiting":
        return enriched.filter((task) => task.status === "Waiting");
      case "Not started":
        return enriched.filter((task) => task.status === "Not started");
      case "Done":
        return enriched.filter((task) => task.status === "Done");
      default:
        return enriched.filter((task) => task.stage === (filter as TaskStage));
    }
  }, [enriched, filter]);

  // V11.3 — the action plan is now grouped into named, collapsible sections (Start here,
  // Official checks, Documents, Housing, Money and banking, Arrival week, First 30 days,
  // Optional extras) so the user never sees the full task list at once.
  const groupedBySection = useMemo(() => {
    const map = new Map<PlanSection, EnrichedTask[]>();
    for (const section of PLAN_SECTION_ORDER) map.set(section, []);
    for (const task of filtered) {
      const list = map.get(task.resolvedSection) ?? [];
      list.push(task);
      map.set(task.resolvedSection, list);
    }
    return map;
  }, [filtered]);

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Relocation project plan</p>
          <h2 className="mt-2 text-3xl font-semibold text-zinc-900">Relocation project plan</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">Track each relocation task by stage, priority, due date, owner and status. Saved in this browser only.</p>
        </div>
        <button onClick={onReset} className="rounded-full border border-zinc-200/80 px-4 py-2 text-sm font-semibold text-emerald-700 transition-all duration-200 ease-in-out hover:border-zinc-300">
          <RefreshCcw className="mr-2 inline h-4 w-4" /> Reset
        </button>
      </div>

      {/* Progress summary */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <SummaryStat label="Total" value={String(total)} />
        <SummaryStat label="Done" value={String(doneCount)} />
        <SummaryStat label="In progress" value={String(inProgressCount)} />
        <SummaryStat label="Waiting" value={String(waitingCount)} />
        <SummaryStat label="High priority open" value={String(highPriorityOpen)} />
        <SummaryStat label="Next due task" value={nextDue ? nextDue.title : "All caught up"} small />
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
        <div className="h-1.5 rounded-full bg-emerald-600 transition-all duration-300 ease-in-out" style={{ width: `${progressPercent}%` }} />
      </div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">{progressPercent}% done</p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={classNames(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ease-in-out",
                filter === item ? "bg-emerald-600 text-white shadow-sm" : "border border-zinc-200/80 bg-white text-zinc-600 hover:border-zinc-300"
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => downloadPlanChecklist(enriched, "csv")}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-all duration-200 ease-in-out hover:border-zinc-300"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button
            type="button"
            onClick={() => downloadPlanChecklist(enriched, "md")}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-all duration-200 ease-in-out hover:border-zinc-300"
          >
            <Download className="h-3.5 w-3.5" /> Markdown
          </button>
        </div>
      </div>

      {/* Desktop table — grouped into collapsible sections */}
      <div className="mt-7 hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Task</th>
              <th className="py-2 pr-3">Tier</th>
              <th className="py-2 pr-3">Priority</th>
              <th className="py-2 pr-3">Due</th>
              <th className="py-2 pr-3">Owner</th>
              <th className="py-2 pr-3">Category</th>
              <th className="py-2 pr-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {PLAN_SECTION_ORDER.map((section) => {
              const sectionTasks = groupedBySection.get(section) ?? [];
              if (sectionTasks.length === 0) return null;
              const isExpanded = expandedSections[section];
              return (
                <RowsForSection
                  key={section}
                  section={section}
                  tasks={sectionTasks}
                  expanded={isExpanded}
                  onToggle={() => toggleSection(section)}
                  onStatusChange={onStatusChange}
                  onNoteChange={onNoteChange}
                  scripts={scripts}
                />
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="py-6 text-sm text-zinc-500">No tasks match this filter.</p>}
      </div>

      {/* Mobile cards — same collapsible sections */}
      <div className="mt-7 space-y-5 md:hidden">
        {PLAN_SECTION_ORDER.map((section) => {
          const sectionTasks = groupedBySection.get(section) ?? [];
          if (sectionTasks.length === 0) return null;
          const isExpanded = expandedSections[section];
          return (
            <div key={section} className="rounded-xl border border-zinc-200/80">
              <button
                type="button"
                onClick={() => toggleSection(section)}
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
              >
                <span className="flex items-center gap-2 text-base font-semibold text-zinc-900">
                  <Clock3 className="h-4 w-4 text-emerald-600" /> {section}
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                    {sectionTasks.length} {sectionTasks.length === 1 ? "task" : "tasks"}
                  </span>
                </span>
                {isExpanded ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronRight className="h-4 w-4 text-zinc-500" />}
              </button>
              {isExpanded && (
                <div className="space-y-3 border-t border-zinc-100 px-4 py-3">
                  {sectionTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} onNoteChange={onNoteChange} scripts={scripts} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-sm text-zinc-500">No tasks match this filter.</p>}
      </div>

      <p className="mt-7 border-t border-zinc-100 pt-5 text-xs leading-6 text-zinc-500">{PRIVACY_COPY}</p>
    </div>
  );
}

function SummaryStat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="rounded-xl bg-zinc-50 p-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className={classNames("mt-1.5 font-semibold text-zinc-900", small ? "truncate text-sm" : "text-xl")}>{value}</p>
    </div>
  );
}

function RowsForSection({
  section,
  tasks,
  expanded,
  onToggle,
  onStatusChange,
  onNoteChange,
  scripts,
}: {
  section: PlanSection;
  tasks: EnrichedTask[];
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onNoteChange: (id: string, note: string) => void;
  scripts: Record<string, TaskScript>;
}) {
  const [openDrawers, setOpenDrawers] = useState<Record<string, boolean>>({});
  const toggleDrawer = (id: string) => setOpenDrawers((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <tr>
        <td colSpan={8} className="pb-1 pt-5">
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center gap-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700"
          >
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            {section}
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-emerald-700">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </button>
        </td>
      </tr>
      {expanded &&
        tasks.map((task) => {
          const hasDrawer = Boolean(task.whereToGo || task.howTo || (task.whatToPrepare && task.whatToPrepare.length) || (task.providerQuestions && task.providerQuestions.length) || task.doThisBefore || task.dependsOn || task.whyItMatters);
          const drawerOpen = Boolean(openDrawers[task.id]);
          return (
            <Fragment key={task.id}>
              <tr className="border-b border-zinc-100 align-top">
                <td className="py-3 pr-3">
                  <StatusSelect status={task.status} onChange={(status) => onStatusChange(task.id, status)} />
                </td>
                <td className="max-w-xs py-3 pr-3">
                  <p className="font-semibold text-zinc-900">{task.title}</p>
                  {task.nextStep && <p className="mt-1 text-xs font-semibold text-emerald-700">Next: {task.nextStep}</p>}
                  {hasDrawer && (
                    <button
                      type="button"
                      onClick={() => toggleDrawer(task.id)}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-emerald-700"
                    >
                      {drawerOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      How to do this
                    </button>
                  )}
                </td>
                <td className="py-3 pr-3">
                  <TierBadge tier={task.resolvedTier} />
                </td>
                <td className="py-3 pr-3">
                  <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">{task.priority}</span>
                </td>
                <td className="py-3 pr-3 text-xs text-zinc-600">
                  {task.dueLabel}
                  {task.dueDate ? <span className="block text-[11px] text-zinc-400">{task.dueDate}</span> : null}
                </td>
                <td className="py-3 pr-3 text-xs text-zinc-600">{task.owner}</td>
                <td className="py-3 pr-3">
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-700">{task.category}</span>
                </td>
                <td className="py-3 pr-3">
                  <TaskAction task={task} onNoteChange={onNoteChange} onStatusChange={onStatusChange} scripts={scripts} />
                </td>
              </tr>
              {drawerOpen && (
                <tr className="border-b border-zinc-100 bg-zinc-50/60">
                  <td colSpan={8} className="px-3 py-4">
                    <HowToDrawer task={task} />
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
    </>
  );
}

function HowToDrawer({ task }: { task: EnrichedTask }) {
  return (
    <div className="grid gap-3 text-xs leading-5 text-zinc-600 sm:grid-cols-2">
      <p className="sm:col-span-2 text-zinc-700">{task.description}</p>
      {task.whereToGo && (
        <div>
          <p className="font-semibold text-zinc-900">Where to go</p>
          <p className="mt-0.5">{task.whereToGo}</p>
        </div>
      )}
      {task.howTo && (
        <div>
          <p className="font-semibold text-zinc-900">How to do it</p>
          <p className="mt-0.5">{task.howTo}</p>
        </div>
      )}
      {task.whatToPrepare && task.whatToPrepare.length > 0 && (
        <div>
          <p className="font-semibold text-zinc-900">What to prepare</p>
          <ul className="mt-0.5 list-disc space-y-0.5 pl-4">
            {task.whatToPrepare.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {task.providerQuestions && task.providerQuestions.length > 0 && (
        <div>
          <p className="font-semibold text-zinc-900">Questions to ask the provider</p>
          <ul className="mt-0.5 list-disc space-y-0.5 pl-4">
            {task.providerQuestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {task.aiAssistIdea && (
        <div className="sm:col-span-2 rounded-lg border border-dashed border-zinc-300 bg-white p-2.5">
          <p className="flex items-center gap-1.5 font-semibold text-zinc-500">
            <Info className="h-3.5 w-3.5" /> Future AI assist idea
          </p>
          <p className="mt-0.5">{task.aiAssistIdea}</p>
        </div>
      )}
      {(task.doThisBefore || task.dependsOn || task.whyItMatters) && (
        <div className="sm:col-span-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-amber-900">
          <p className="font-semibold">This task depends on something else</p>
          {task.doThisBefore && (
            <p className="mt-1">
              <span className="font-semibold">Do this before:</span> {task.doThisBefore}
            </p>
          )}
          {task.dependsOn && (
            <p className="mt-1">
              <span className="font-semibold">Depends on:</span> {task.dependsOn}
            </p>
          )}
          {task.whyItMatters && (
            <p className="mt-1">
              <span className="font-semibold">Why this matters:</span> {task.whyItMatters}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function TierBadge({ tier }: { tier: EnrichedTask["resolvedTier"] }) {
  return (
    <span
      className={classNames(
        "rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]",
        tier === "Core" ? "bg-zinc-900 text-white" : tier === "Recommended" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
      )}
    >
      {tier}
    </span>
  );
}

function TaskCard({
  task,
  onStatusChange,
  onNoteChange,
  scripts,
}: {
  task: EnrichedTask;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onNoteChange: (id: string, note: string) => void;
  scripts: Record<string, TaskScript>;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hasDrawer = Boolean(task.whereToGo || task.howTo || (task.whatToPrepare && task.whatToPrepare.length) || (task.providerQuestions && task.providerQuestions.length) || task.doThisBefore || task.dependsOn || task.whyItMatters);
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="break-words font-semibold text-zinc-900">{task.title}</p>
        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">{task.priority}</span>
      </div>
      {task.nextStep && <p className="mt-1.5 text-xs font-semibold text-emerald-700">Next: {task.nextStep}</p>}
      {hasDrawer && (
        <button
          type="button"
          onClick={() => setDrawerOpen((open) => !open)}
          className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-emerald-700"
        >
          {drawerOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          How to do this
        </button>
      )}
      {drawerOpen && (
        <div className="mt-2 rounded-lg bg-zinc-50/80 p-3">
          <HowToDrawer task={task} />
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <TierBadge tier={task.resolvedTier} />
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-700">{task.category}</span>
        <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">{task.owner}</span>
        <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
          Due {task.dueLabel}
          {task.dueDate ? ` (${task.dueDate})` : ""}
        </span>
      </div>
      <div className="mt-3">
        <StatusSelect status={task.status} onChange={(status) => onStatusChange(task.id, status)} />
      </div>
      <div className="mt-3">
        <TaskAction task={task} onNoteChange={onNoteChange} onStatusChange={onStatusChange} scripts={scripts} fullWidth />
      </div>
    </div>
  );
}

function StatusSelect({ status, onChange }: { status: TaskStatus; onChange: (status: TaskStatus) => void }) {
  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={(event) => onChange(event.target.value as TaskStatus)}
        className={classNames(
          // V10.1 Fix 4 — min-h-[2.5rem] keeps the tap target comfortable on mobile (~40px) without
          // changing the visual size on desktop, where the padding alone already clears 44px hit area.
          "min-h-[2.5rem] appearance-none rounded-full border px-3 py-1.5 pr-7 text-xs font-semibold outline-none",
          status === "Done"
            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
            : status === "In progress"
            ? "border-amber-300 bg-amber-50 text-amber-700"
            : status === "Waiting"
            ? "border-sky-300 bg-sky-50 text-sky-700"
            : status === "Not applicable"
            ? "border-zinc-200 bg-zinc-50 text-zinc-400"
            : "border-zinc-200/80 bg-white text-zinc-600"
        )}
      >
        {TASK_STATUSES.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
    </div>
  );
}

function TaskAction({
  task,
  onNoteChange,
  onStatusChange,
  scripts,
  fullWidth,
}: {
  task: EnrichedTask;
  onNoteChange: (id: string, note: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  scripts: Record<string, TaskScript>;
  fullWidth?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  if (task.actionType === "Open official link" && task.officialLinkKeys && task.officialLinkKeys.length > 0) {
    const links = singaporeOfficialLinkCategories.filter((category) => task.officialLinkKeys?.includes(category.key));
    return (
      <div className="space-y-1.5">
        <span className="inline-block rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white">Official source</span>
        {links.map((category) =>
          category.url ? (
            <a key={category.key} href={category.url} target="_blank" rel="noopener noreferrer" className="block text-xs font-semibold text-emerald-700 underline hover:text-emerald-800">
              Verify directly · {category.title}
            </a>
          ) : (
            <p key={category.key} className="text-xs font-semibold text-zinc-500">Verify from official website · {category.title}</p>
          )
        )}
      </div>
    );
  }

  if (task.actionType === "Copy script" && task.scriptKey && scripts[task.scriptKey]) {
    const script = scripts[task.scriptKey];
    async function handleCopy() {
      try {
        await navigator.clipboard.writeText(script.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopied(false);
      }
    }
    const showResearchBadge = task.sourceType === "Research option" || (!task.sourceType && task.ruleSensitive);
    return (
      <div className="space-y-1.5">
        {showResearchBadge && <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-800">Research option — not an endorsement</span>}
        <button type="button" onClick={handleCopy} className="inline-flex min-h-[2.5rem] items-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 ease-in-out hover:bg-emerald-700">
          {copied ? (
            <>
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5" /> {task.buttonLabel ?? "Copy script"}
            </>
          )}
        </button>
      </div>
    );
  }

  if (task.actionType === "Start research" && task.actionTarget) {
    return (
      <div className="space-y-1.5">
        <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-800">
          {task.sourceType ?? "Research option"} — not an endorsement
        </span>
        <Link href={task.actionTarget} className="block text-xs font-semibold text-emerald-700 underline hover:text-emerald-800">
          {task.buttonLabel ?? "Start research"}
        </Link>
      </div>
    );
  }

  if (task.actionType === "Add note") {
    return (
      <textarea
        value={task.note}
        onChange={(event) => onNoteChange(task.id, event.target.value)}
        placeholder="Add a note"
        rows={2}
        className={classNames(
          "w-full rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1.5 text-xs text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500/20",
          fullWidth ? "" : "max-w-[220px]",
        )}
      />
    );
  }

  if (task.actionType === "Mark done") {
    return (
      <button
        type="button"
        onClick={() => onStatusChange(task.id, "Done")}
        disabled={task.status === "Done"}
        className={classNames(
          "inline-flex min-h-[2.5rem] items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ease-in-out",
          task.status === "Done" ? "cursor-not-allowed bg-zinc-100 text-zinc-400" : "bg-emerald-600 text-white hover:bg-emerald-700"
        )}
      >
        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Mark done
      </button>
    );
  }

  // Plan action — rule-sensitive with no safe link, or a generic catch-all.
  return (
    <div className="space-y-1.5">
      {task.ruleSensitive && (
        <>
          <span className="inline-block rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white">Official source</span>
          <p className="text-xs font-semibold text-zinc-500">Verify from official website</p>
        </>
      )}
      {!task.ruleSensitive && <p className="text-xs text-zinc-500">{task.nextStep ?? "Plan this step."}</p>}
      <ShieldCheck className="hidden h-0 w-0" />
    </div>
  );
}
