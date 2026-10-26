import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettings, getUpcomingEvents, getVenue } from "@/lib/data";
import { EventCard } from "@/components/public/EventCard";
import { fmt } from "@/lib/utils";

export default async function HomePage() {
  const [settings, venue, featured, upcoming, photos] = await Promise.all([
    getSettings(),
    getVenue(),
    getUpcomingEvents(3, true),
    getUpcomingEvents(8),
    prisma.mediaItem.findMany({ where: { type: "IMAGE", album: { published: true } }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const highlights = featured.length ? featured : upcoming.slice(0, 3);
  const [first, ...rest] = settings.clubName.split(" ");

  return (
    <>
      <section className="relative flex min-h-[100svh] items-end overflow-hidden" data-testid="home-hero">
        {settings.heroVideoUrl ? (
          <video src={settings.heroVideoUrl} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          settings.heroImageUrl && <Image src={settings.heroImageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 md:px-10 md:pb-28">
          <p className="eyebrow rise" data-testid="hero-next-event">
            {upcoming[0] ? `Próxima noche · ${fmt(upcoming[0].date, "EEEE d 'de' MMMM")} · ${upcoming[0].title}` : "Nuevas fechas muy pronto"}
          </p>
          <h1 className="mt-4 font-display font-black uppercase leading-[0.8] rise" style={{ animationDelay: "100ms" }}>
            <span className="block text-[22vw] text-neon-magenta md:text-[15vw] lg:text-[13rem]">{first}</span>
            {rest.length > 0 && <span className="block text-outline text-[16vw] md:text-[10vw] lg:text-[9rem]">{rest.join(" ")}</span>}
          </h1>
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between rise" style={{ animationDelay: "220ms" }}>
            <p className="max-w-md text-base text-fog/80 md:text-lg">{settings.tagline}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/eventos" className="btn btn-primary" data-testid="hero-events-btn">Ver eventos <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/contacto" className="btn btn-ghost" data-testid="hero-contact-btn">Alquilar el salón</Link>
            </div>
          </div>
        </div>
      </section>

      {upcoming.length > 0 && (
        <div className="overflow-hidden border-y border-line bg-surface py-4" data-testid="events-marquee">
          <div className="marquee flex w-max gap-12 whitespace-nowrap font-display text-2xl font-bold uppercase">
            {[...upcoming, ...upcoming].map((e, i) => (
              <span key={`${e.id}-${i}`} className="flex items-center gap-12">
                <span className="text-cyan">{fmt(e.date, "dd.MM")}</span> {e.title} <span className="text-magenta">✦</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-5 py-28 md:px-10" data-testid="home-featured-events">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Próximas noches</p>
            <h2 className="mt-3 font-display text-5xl font-black uppercase md:text-7xl">Agenda</h2>
          </div>
          <Link href="/eventos" className="btn btn-ghost hidden sm:inline-flex" data-testid="home-all-events-link">Toda la agenda</Link>
        </div>
        {highlights.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
          </div>
        ) : (
          <p className="text-muted" data-testid="home-no-events">Pronto anunciamos nuevas fechas.</p>
        )}
      </section>

      {photos.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-10" data-testid="home-gallery-preview">
          <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[240px] md:grid-cols-4">
            {photos.map((p, i) => (
              <div key={p.id} className={`relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                <Image src={p.url} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
          <Link href="/galeria" className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-cyan hover:text-magenta" data-testid="home-gallery-link">
            Ver la galería completa <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-28 md:grid-cols-2 md:items-center md:px-10" data-testid="home-venue-teaser">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line">
          {venue.heroUrl && <Image src={venue.heroUrl} alt={venue.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />}
        </div>
        <div>
          <p className="eyebrow">El salón</p>
          <h2 className="mt-3 font-display text-5xl font-black uppercase leading-[0.9] md:text-6xl">{venue.title}</h2>
          <p className="mt-6 text-muted">{venue.description}</p>
          {venue.capacity > 0 && (
            <p className="mt-8 font-display text-7xl font-black text-neon-cyan">
              {venue.capacity.toLocaleString("es-AR")}<span className="ml-3 align-middle font-mono text-xs uppercase tracking-[0.2em] text-muted">personas</span>
            </p>
          )}
          <Link href="/salon" className="btn btn-ghost mt-8" data-testid="home-venue-link">Conocer el salón</Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-magenta/40 bg-surface p-10 md:p-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-magenta/30 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-cyan/20 blur-[120px]" />
          <p className="eyebrow relative">Eventos privados · Cumpleaños · Empresas</p>
          <h2 className="relative mt-4 max-w-3xl font-display text-5xl font-black uppercase leading-[0.9] md:text-7xl">Alquilá el salón</h2>
          <Link href="/contacto" className="btn btn-primary relative mt-10" data-testid="home-cta-contact-btn">Consultar disponibilidad</Link>
        </div>
      </section>
    </>
  );
}