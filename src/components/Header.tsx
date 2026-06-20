import Link from "next/link";
import { Map } from "lucide-react";

const navItems = [
  { href: "/countries", label: "Route Library" },
  { href: "/ai-assistant", label: "AI Assistant" },
  { href: "/services", label: "Services" },
  { href: "/share-story", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 text-zinc-900">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Map className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="leading-none">
            <span className="block text-base font-bold tracking-tight">SettleMap</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 2xl:block">
              Map your move. Settle with confidence.
            </span>
          </span>
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-3 text-sm font-medium whitespace-nowrap text-zinc-600 xl:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors duration-200 hover:text-emerald-700">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#route-selector"
          className="shrink-0 whitespace-nowrap rounded-full bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-emerald-700 sm:px-4"
        >
          Build my move plan
        </Link>
      </div>
    </header>
  );
}
