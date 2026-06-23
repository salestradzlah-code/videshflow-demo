"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Map, Menu, X } from "lucide-react";

const navItems = [
  { href: "/countries", label: "Route Library" },
  { href: "/ai-assistant", label: "AI Assistant" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/early-access", label: "Early Access" },
  { href: "/share-story", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 rounded-lg">
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
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md transition-colors duration-200 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#route-selector"
            className="hidden shrink-0 whitespace-nowrap rounded-full bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:px-4 xl:inline-flex"
          >
            Build my move plan
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200/80 bg-white p-2.5 text-zinc-700 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 xl:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-200 ease-in-out xl:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className="absolute inset-0 bg-zinc-900/40"
          onClick={() => setMenuOpen(false)}
        />
        <div
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-200 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200/80 px-5 py-4">
            <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 text-zinc-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Map className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-base font-bold tracking-tight">SettleMap</span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200/80 bg-white p-2.5 text-zinc-700 transition-all duration-200 ease-in-out hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-auto px-5 py-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-semibold text-zinc-800 transition-colors duration-200 ease-in-out hover:bg-zinc-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-zinc-200/80 px-5 py-5">
            <Link
              href="/#route-selector"
              onClick={() => setMenuOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              Build my move plan
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
