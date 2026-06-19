import Link from "next/link";
import { Globe2, Route } from "lucide-react";

const navItems = [
  { href: "/countries", label: "Countries" },
  { href: "/ai-assistant", label: "AI Assistant" },
  { href: "/services", label: "Services" },
  { href: "/share-story", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f8f6f1]/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3 text-[#123638]">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123638] text-white shadow-sm shadow-black/10 ring-1 ring-[#f2c56b]/50">
            <Globe2 className="h-5 w-5" aria-hidden="true" />
            <Route className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[#f2c56b] p-0.5 text-[#123638]" aria-hidden="true" />
          </span>
          <span className="leading-none">
            <span className="block text-lg font-bold tracking-tight">SettleMap</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a6a20] sm:block">Map your move. Settle with confidence.</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[#123638]">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#route-selector"
          className="rounded-full bg-[#123638] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c2829]"
        >
          Plan route
        </Link>
      </div>
    </header>
  );
}
