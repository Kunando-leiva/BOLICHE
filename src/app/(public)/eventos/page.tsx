import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPastEvents, getUpcomingEvents } from "@/lib/data";
import { EventCard } from "@/components/public/EventCard";
import { PageHero } from "@/components/public/PageHero";
import { EventCalendar } from "@/components/public/EventCalendar";
import { fmt } from "@/lib/utils";

export const metadata: Metadata = { title: "Eventos" };

export default async function EventsPage() {
  const [upcoming, past, calendarEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
    prisma.event.findMany({
      where: { status: { in: ["PUBLISHED", "CANCELLED"] }, date: { gte: new Date(Date.now() - 31 * 86400_000) } },
      select: { slug: true, title: true, date: true, status: true },
      orderBy: { date: "asc" },
    }),
  ]);

  return (
    <>
      <PageHero eyebrow="Agenda" title="Eventos" intro="Todas las fechas confirmadas. Entrá al detalle de cada noche para ver el line-up y las entradas." />

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10" data-testid="events-calendar-section">
        <p className="eyebrow mb-6">Calendario</p>
        <EventCalendar events={calendarEvents} />
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-10" data-testid="upcoming-events">
        {upcoming.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
          </div>
        ) : (
          <p className="text-muted" data-testid="no-upcoming-events">No hay fechas confirmadas por ahora. Seguinos en redes.</p>
        )}
      </section>

      {past.length > 0 && (
        <section className="mx-auto mt-28 max-w-7xl px-5 md:px-10" data-testid="past-events">
          <p className="eyebrow mb-6">Ya pasaron</p>
          <ul className="divide-y divide-line border-y border-line">
            {past.map((e) => (
              <li key={e.id}>
                <Link href={`/eventos/${e.slug}`} className="group flex items-baseline justify-between gap-6 py-6" data-testid={`past-event-${e.slug}`}>
                  <span className="font-display text-3xl font-bold uppercase text-muted transition-colors group-hover:text-fog md:text-4xl">{e.title}</span>
                  <span className="shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-muted">{fmt(e.date, "dd MMM yyyy")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}