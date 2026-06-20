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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3 text-zinc-900">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Map className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="leading-none">
            <span className="block text-lg font-bold tracking-tight">SettleMap</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 sm:block">
              Map your move. Settle with confidence.
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-zinc-600 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors duration-200 hover:text-emerald-700">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#route-selector"
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-emerald-700"
        >
          Build my move plan
        </Link>
      </div>
    </header>
  );
}
