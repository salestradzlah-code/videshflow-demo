import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

export function InfoBanner({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50 p-4 text-sm leading-6 text-zinc-600 sm:p-5">
      <span className="mt-0.5 shrink-0 text-zinc-400">{icon ?? <ShieldAlert className="h-5 w-5" />}</span>
      <div>{children}</div>
    </div>
  );
}
