import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, Clock, Ticket } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { fmt, startOfToday } from "@/lib/utils";

async function getEvent(slug: string) {
  return prisma.event.findFirst({
    where: { slug, status: { in: ["PUBLISHED", "CANCELLED"] } },
    include: { albums: { where: { published: true } } },
  });
}

export async function generateMetadata({ params }: PageProps<"/eventos/[slug]">): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  return {
    title: event?.title ?? "Evento",
    description: event?.description.slice(0, 150),
    openGraph: event?.flyerUrl ? { images: [event.flyerUrl] } : undefined,
  };
}

export default async function EventDetailPage({ params }: PageProps<"/eventos/[slug]">) {
  const event = await getEvent((await params).slug);
  if (!event) notFound();
  const isPast = event.date < startOfToday();
  const cancelled = event.status === "CANCELLED";

  return (
    <article className="mx-auto grid max-w-7xl gap-12 px-5 pt-32 md:grid-cols-[5fr_6fr] md:px-10 md:pt-40" data-testid="event-detail">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line rise">
        {event.flyerUrl && <Image src={event.flyerUrl} alt={event.title} fill priority sizes="(max-width: 768px) 100vw, 45vw" className={cancelled ? "object-cover grayscale" : "object-cover"} />}
      </div>
      <div className="md:pt-6">
        <Link href="/eventos" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-cyan" data-testid="event-back-link">
          <ArrowLeft className="h-4 w-4" /> Agenda
        </Link>
        {cancelled && (
          <p className="mt-8 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" data-testid="event-cancelled-banner">
            <AlertTriangle className="h-4 w-4" /> Este evento fue cancelado.
          </p>
        )}
        <p className="eyebrow mt-10 rise">{fmt(event.date, "EEEE d 'de' MMMM")}</p>
        <h1 className="mt-4 font-display text-6xl font-black uppercase leading-[0.85] md:text-8xl rise" style={{ animationDelay: "80ms" }} data-testid="event-title">
          {event.title}
        </h1>
        <div className="mt-8 flex flex-wrap gap-6 font-mono text-xs uppercase tracking-[0.15em] text-muted">
          <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-cyan" /> Puertas {event.doorsOpen ?? fmt(event.date, "HH:mm")} h{event.endTime ? ` · hasta ${event.endTime}` : ""}</span>
          {event.price && <span className="flex items-center gap-2" data-testid="event-price"><Ticket className="h-4 w-4 text-magenta" /> {event.price}</span>}
        </div>
        <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-fog/80">{event.description}</p>
        {event.lineup.length > 0 && (
          <div className="mt-10" data-testid="event-lineup">
            <p className="eyebrow mb-4">Line-up</p>
            <ul className="space-y-1">
              {event.lineup.map((artist) => <li key={artist} className="font-display text-4xl font-bold uppercase">{artist}</li>)}
            </ul>
          </div>
        )}
        <div className="mt-12 flex flex-wrap gap-3">
          {!isPast && !cancelled && event.ticketUrl && (
            <a href={event.ticketUrl} target="_blank" rel="noreferrer" className="btn btn-primary" data-testid="event-tickets-btn">Comprar entradas</a>
          )}
          {event.albums.map((a) => (
            <Link key={a.id} href={`/galeria/${a.slug}`} className="btn btn-cyan" data-testid={`event-album-link-${a.slug}`}>Ver fotos</Link>
          ))}
        </div>
      </div>
    </article>
  );
}