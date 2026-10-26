import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, MapPin, PartyPopper, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getVenue } from "@/lib/data";
import { PageHero } from "@/components/public/PageHero";

export const metadata: Metadata = { title: "El Salón" };

export default async function VenuePage() {
  const [venue, sections] = await Promise.all([getVenue(), prisma.venueSection.findMany({ orderBy: { order: "asc" } })]);

  return (
    <>
      <PageHero eyebrow="El Salón" title={venue.title} intro={venue.description} />

      <section className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-[2fr_1fr] md:px-10">
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-line">
          {venue.heroUrl && <Image src={venue.heroUrl} alt={venue.title} fill priority sizes="(max-width: 768px) 100vw, 66vw" className="object-cover" />}
        </div>
        <div className="flex flex-col justify-between gap-8 rounded-3xl border border-line bg-surface p-8">
          <div>
            <Users className="h-6 w-6 text-cyan" />
            <p className="mt-4 font-display text-7xl font-black text-neon-cyan" data-testid="venue-capacity">{venue.capacity.toLocaleString("es-AR")}</p>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">capacidad total</p>
          </div>
          {venue.address && (
            <p className="flex items-start gap-3 text-sm text-fog/80" data-testid="venue-address"><MapPin className="h-5 w-5 shrink-0 text-magenta" /> {venue.address}</p>
          )}
        </div>
      </section>

      {sections.length > 0 && (
        <section className="mx-auto mt-28 max-w-7xl px-5 md:px-10" data-testid="venue-sections">
          <p className="eyebrow">Sectores</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {sections.map((s, i) => (
              <div key={s.id} className="overflow-hidden rounded-3xl border border-line bg-surface rise" style={{ animationDelay: `${i * 90}ms` }} data-testid={`venue-section-${i}`}>
                <div className="relative aspect-[4/3]">
                  {s.imageUrl && <Image src={s.imageUrl} alt={s.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />}
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-3xl font-bold uppercase">{s.name}</h3>
                    {s.capacity && <span className="font-mono text-xs text-cyan">{s.capacity} pers.</span>}
                  </div>
                  <p className="mt-3 text-sm text-muted">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {venue.amenities.length > 0 && (
        <section className="mx-auto mt-28 max-w-7xl px-5 md:px-10" data-testid="venue-amenities">
          <p className="eyebrow">Servicios</p>
          <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {venue.amenities.map((a) => (
              <li key={a} className="flex items-center gap-3 border-b border-line pb-4 text-fog/90"><Check className="h-4 w-4 text-magenta" /> {a}</li>
            ))}
          </ul>
        </section>
      )}

      {venue.eventTypes.length > 0 && (
        <section className="mx-auto mt-28 max-w-7xl px-5 md:px-10" data-testid="venue-event-types">
          <p className="eyebrow">¿Qué se puede festejar?</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {venue.eventTypes.map((t) => (
              <li key={t} className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fog/90"><PartyPopper className="h-4 w-4 text-cyan" /> {t}</li>
            ))}
          </ul>
        </section>
      )}

      {venue.mapEmbedUrl && (
        <section className="mx-auto mt-28 max-w-7xl px-5 md:px-10">
          <iframe src={venue.mapEmbedUrl} className="h-[380px] w-full rounded-3xl border border-line grayscale invert-[0.9]" loading="lazy" title="Mapa" data-testid="venue-map" />
          <Link href="/contacto" className="btn btn-primary mt-10" data-testid="venue-contact-btn">Consultar disponibilidad</Link>
        </section>
      )}
    </>
  );
}