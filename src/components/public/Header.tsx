"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/eventos", label: "Eventos" },
  { href: "/galeria", label: "Galería" },
  { href: "/salon", label: "El Salón" },
  { href: "/contacto", label: "Contacto" },
];

export function Header({ clubName }: { clubName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 glass border-b border-line/60" data-testid="site-header">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
        <Link href="/" className="font-display text-2xl font-black uppercase tracking-wider" data-testid="header-logo-link">
          <span className="text-neon-magenta flicker">{clubName.split(" ")[0]}</span>
          <span className="ml-1 text-fog">{clubName.split(" ").slice(1).join(" ")}</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-testid={`nav-${l.href.slice(1)}-link`}
              className={cn(
                "font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:text-cyan",
                pathname.startsWith(l.href) ? "text-cyan" : "text-muted",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/contacto" className="btn btn-primary !py-2.5" data-testid="header-contact-btn">
            Alquilar el salón
          </Link>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menú" data-testid="mobile-menu-toggle">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-line/60 px-5 py-4 md:hidden" data-testid="mobile-menu">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 font-display text-3xl uppercase" data-testid={`mobile-nav-${l.href.slice(1)}-link`}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}