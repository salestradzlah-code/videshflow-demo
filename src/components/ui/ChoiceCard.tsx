import { Check } from "lucide-react";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ChoiceCard({
  label,
  description,
  active,
  onClick,
}: {
  label: string;
  description?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "relative flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 ease-in-out focus:ring-2 focus:ring-emerald-500/20",
        active ? "border-emerald-600 bg-emerald-50" : "border-zinc-200/80 bg-white hover:border-zinc-300"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className={classNames("text-sm font-semibold", active ? "text-emerald-800" : "text-zinc-900")}>{label}</p>
        {description && <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>}
      </div>
      <div
        className={classNames(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          active ? "border-emerald-600 bg-emerald-600 text-white" : "border-zinc-300 bg-white text-transparent"
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}
