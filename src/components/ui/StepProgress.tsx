export function StepProgress({
  step,
  totalSteps,
  labels,
}: {
  step: number;
  totalSteps: number;
  labels: readonly string[];
}) {
  const pct = (step / totalSteps) * 100;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-emerald-700">Route setup</p>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Step {step} of {totalSteps}
        </p>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-1 rounded-full bg-emerald-600 transition-all duration-300 ease-in-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        {labels.map((label, index) => {
          const id = index + 1;
          const active = id === step;
          const done = id < step;
          return (
            <div
              key={label}
              className={
                active
                  ? "rounded-lg border border-emerald-600 bg-emerald-600 p-2.5 text-center text-xs font-semibold text-white"
                  : done
                  ? "rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-center text-xs font-semibold text-emerald-700"
                  : "rounded-lg border border-zinc-200/80 bg-white p-2.5 text-center text-xs font-semibold text-zinc-400"
              }
            >
              {done ? "✓ " : ""}
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
