import Image from "next/image";
import Link from "next/link";
import type { Event } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import { fmt } from "@/lib/utils";

export function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  return (
    <Link
      href={`/eventos/${event.slug}`}
      data-testid={`event-card-${event.slug}`}
      className="group relative block overflow-hidden rounded-3xl border border-line bg-surface rise"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {event.flyerUrl && (
          <Image
            src={event.flyerUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute left-5 top-5 rounded-2xl bg-ink/80 px-4 py-2 text-center backdrop-blur">
          <p className="font-display text-4xl font-black leading-none text-neon-magenta">{fmt(event.date, "dd")}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">{fmt(event.date, "MMM")}</p>
        </div>
        <ArrowUpRight className="absolute right-5 top-5 h-6 w-6 text-fog opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">{fmt(event.date, "EEEE · HH:mm")} h</p>
          <h3 className="mt-2 font-display text-3xl font-bold uppercase leading-[0.95]">{event.title}</h3>
          {event.lineup.length > 0 && <p className="mt-3 line-clamp-1 text-sm text-muted">{event.lineup.join(" · ")}</p>}
        </div>
      </div>
    </Link>
  );
}