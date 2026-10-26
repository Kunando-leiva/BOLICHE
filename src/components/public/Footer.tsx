import Link from "next/link";
import type { SiteSettings } from "@prisma/client";

export function Footer({ settings, address }: { settings: SiteSettings; address: string }) {
  const socials = [
    settings.instagram && { label: "Instagram", href: `https://instagram.com/${settings.instagram}` },
    settings.tiktok && { label: "TikTok", href: `https://tiktok.com/@${settings.tiktok}` },
    settings.whatsapp && { label: "WhatsApp", href: `https://wa.me/${settings.whatsapp}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="mt-32 border-t border-line" data-testid="site-footer">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[2fr_1fr_1fr] md:px-10">
        <div>
          <p className="font-display text-6xl font-black uppercase leading-none md:text-8xl">
            <span className="text-outline">{settings.clubName}</span>
          </p>
          <p className="mt-4 max-w-sm text-sm text-muted">{settings.tagline}</p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="eyebrow">Horarios</p>
          <p className="whitespace-pre-line text-muted" data-testid="footer-hours">{settings.hours || "Consultá por redes"}</p>
          {address && <p className="text-muted" data-testid="footer-address">{address}</p>}
        </div>
        <div className="space-y-3 text-sm">
          <p className="eyebrow">Seguinos</p>
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="block text-muted transition-colors hover:text-magenta" data-testid={`footer-${s.label.toLowerCase()}-link`}>
              {s.label}
            </a>
          ))}
          {settings.email && <a href={`mailto:${settings.email}`} className="block text-muted hover:text-magenta">{settings.email}</a>}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-5 pb-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted md:px-10">
        <span>© {new Date().getFullYear()} {settings.clubName} · Prohibida la venta de alcohol a menores de 18 años</span>
        <Link href="/admin" className="hover:text-cyan" data-testid="footer-admin-link">Admin</Link>
      </div>
    </footer>
  );
}