"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, Clock3, Copy, RefreshCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { singaporeOfficialLinkCategories, type MoveDateKey } from "@/data/demoPlatform";
import {
  buildEnrichedTasks,
  getNextDueTask,
  TASK_STAGES,
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

  const grouped = useMemo(() => {
    const map = new Map<TaskStage, EnrichedTask[]>();
    for (const stage of TASK_STAGES) map.set(stage, []);
    for (const task of filtered) {
      const list = map.get(task.stage) ?? [];
      list.push(task);
      map.set(task.stage, list);
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
      <div className="mt-6 flex flex-wrap gap-2">
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

      {/* Desktop table */}
      <div className="mt-7 hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Task</th>
              <th className="py-2 pr-3">Stage</th>
              <th className="py-2 pr-3">Priority</th>
              <th className="py-2 pr-3">Due</th>
              <th className="py-2 pr-3">Owner</th>
              <th className="py-2 pr-3">Category</th>
              <th className="py-2 pr-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {TASK_STAGES.map((stage) => {
              const stageTasks = grouped.get(stage) ?? [];
              if (stageTasks.length === 0) return null;
              return (
                <RowsForStage key={stage} stage={stage} tasks={stageTasks} onStatusChange={onStatusChange} onNoteChange={onNoteChange} scripts={scripts} />
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="py-6 text-sm text-zinc-500">No tasks match this filter.</p>}
      </div>

      {/* Mobile cards */}
      <div className="mt-7 space-y-7 md:hidden">
        {TASK_STAGES.map((stage) => {
          const stageTasks = grouped.get(stage) ?? [];
          if (stageTasks.length === 0) return null;
          return (
            <div key={stage}>
              <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
                <Clock3 className="h-4 w-4 text-emerald-600" /> {stage}
              </h3>
              <div className="mt-3 space-y-3">
                {stageTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} onNoteChange={onNoteChange} scripts={scripts} />
                ))}
              </div>
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

function RowsForStage({
  stage,
  tasks,
  onStatusChange,
  onNoteChange,
  scripts,
}: {
  stage: TaskStage;
  tasks: EnrichedTask[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onNoteChange: (id: string, note: string) => void;
  scripts: Record<string, TaskScript>;
}) {
  return (
    <>
      <tr>
        <td colSpan={8} className="pb-1 pt-5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">{stage}</td>
      </tr>
      {tasks.map((task) => (
        <tr key={task.id} className="border-b border-zinc-100 align-top">
          <td className="py-3 pr-3">
            <StatusSelect status={task.status} onChange={(status) => onStatusChange(task.id, status)} />
          </td>
          <td className="max-w-xs py-3 pr-3">
            <p className="font-semibold text-zinc-900">{task.title}</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">{task.description}</p>
          </td>
          <td className="py-3 pr-3 text-xs text-zinc-600">{task.stage}</td>
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
      ))}
    </>
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
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="break-words font-semibold text-zinc-900">{task.title}</p>
        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">{task.priority}</span>
      </div>
      <p className="mt-2 break-words text-xs leading-5 text-zinc-500">{task.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
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
        <TaskAction task={task} onNoteChange={onNoteChange} onStatusChange={onStatusChange} scripts={scripts} />
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
          "appearance-none rounded-full border px-3 py-1.5 pr-7 text-xs font-semibold outline-none",
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
}: {
  task: EnrichedTask;
  onNoteChange: (id: string, note: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  scripts: Record<string, TaskScript>;
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
    return (
      <div className="space-y-1.5">
        {task.ruleSensitive && <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-800">Research option — not an endorsement</span>}
        <button type="button" onClick={handleCopy} className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 ease-in-out hover:bg-emerald-700">
          {copied ? (
            <>
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy script
            </>
          )}
        </button>
      </div>
    );
  }

  if (task.actionType === "Start research" && task.actionTarget) {
    return (
      <div className="space-y-1.5">
        <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-800">Research option — not an endorsement</span>
        <Link href={task.actionTarget} className="block text-xs font-semibold text-emerald-700 underline hover:text-emerald-800">
          Start research
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
        className="w-full max-w-[220px] rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1.5 text-xs text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500/20"
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
          "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ease-in-out",
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
      {!task.ruleSensitive && <p className="text-xs text-zinc-500">Plan this step.</p>}
      <ShieldCheck className="hidden h-0 w-0" />
    </div>
  );
}
