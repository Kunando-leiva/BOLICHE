"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ExternalLink, Images, Inbox, LayoutDashboard, LogOut, Settings, Sofa } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/galeria", label: "Galería", icon: Images },
  { href: "/admin/salon", label: "Salón", icon: Sofa },
  { href: "/admin/consultas", label: "Consultas", icon: Inbox },
  { href: "/admin/ajustes", label: "Ajustes", icon: Settings },
];

export function Sidebar({ email, pending }: { email: string; pending: number }) {
  const pathname = usePathname();
  return (
    <aside className="border-b border-line bg-surface md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r" data-testid="admin-sidebar">
      <div className="flex h-full flex-col gap-6 p-5">
        <Link href="/admin" className="font-display text-2xl font-black uppercase"><span className="text-neon-magenta">LUNA</span> Admin</Link>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} data-testid={`admin-nav-${label.toLowerCase()}`} className={cn("flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", active ? "bg-magenta/15 text-magenta" : "text-muted hover:bg-surface-2 hover:text-fog")}>
                <Icon className="h-4 w-4" /> {label}
                {label === "Consultas" && pending > 0 && <span className="ml-auto rounded-full bg-magenta px-2 text-xs font-bold text-ink" data-testid="pending-inquiries-badge">{pending}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-auto md:block md:space-y-3">
          <Link href="/" target="_blank" className="flex items-center gap-2 text-xs text-muted hover:text-cyan" data-testid="admin-view-site-link"><ExternalLink className="h-3.5 w-3.5" /> Ver sitio</Link>
          <p className="hidden truncate text-xs text-muted md:block">{email}</p>
          <form action={logoutAction}>
            <button className="flex items-center gap-2 text-sm text-muted hover:text-red-400" data-testid="admin-logout-btn"><LogOut className="h-4 w-4" /> Salir</button>
          </form>
        </div>
      </div>
    </aside>
  );
}