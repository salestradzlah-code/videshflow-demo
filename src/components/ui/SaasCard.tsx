import type { ReactNode } from "react";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SaasCard({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={classNames(
        "rounded-xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300",
        padded && "p-6 sm:p-7",
        className
      )}
    >
      {children}
    </div>
  );
}
