import { AlertTriangle } from "lucide-react";
import { DISCLAIMER_SHORT } from "@/lib/constants";

export function DisclaimerBox({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950 shadow-sm">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
        <div>
          <p className="font-semibold">Important boundary</p>
          <p className={compact ? "mt-1" : "mt-2"}>{DISCLAIMER_SHORT}</p>
        </div>
      </div>
    </div>
  );
}
