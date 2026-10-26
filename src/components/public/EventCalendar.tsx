"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { APP_TZ, cn, inTz } from "@/lib/utils";
import { EventStatus } from '@prisma/client';

type CalEvent = {
  title: string;
  slug: string;
  date: Date;
  status: EventStatus;
}

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function EventCalendar({ events }: { events: CalEvent[] }) {
  const today = inTz(new Date());
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const firstDay = new Date(Date.UTC(cursor.year, cursor.month, 1));
  const startWeekday = (firstDay.getUTCDay() + 6) % 7; // lunes = 0
  const daysInMonth = new Date(Date.UTC(cursor.year, cursor.month + 1, 0)).getUTCDate();

  const byDay = new Map<number, CalEvent[]>();
  for (const e of events) {
    const d = inTz(e.date);
    if (d.getFullYear() === cursor.year && d.getMonth() === cursor.month) {
      const list = byDay.get(d.getDate()) ?? [];
      list.push(e);
      byDay.set(d.getDate(), list);
    }
  }

  const move = (delta: number) => {
    const m = cursor.month + delta;
    setCursor({ year: cursor.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 });
  };

  return (
    <div className="rounded-3xl border border-line bg-surface p-5 md:p-8" data-testid="event-calendar">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => move(-1)} className="btn btn-ghost !px-3 !py-2" aria-label="Mes anterior" data-testid="calendar-prev"><ChevronLeft className="h-4 w-4" /></button>
        <p className="font-display text-3xl font-bold uppercase" data-testid="calendar-title">{MONTHS[cursor.month]} {cursor.year}</p>
        <button onClick={() => move(1)} className="btn btn-ghost !px-3 !py-2" aria-label="Mes siguiente" data-testid="calendar-next"><ChevronRight className="h-4 w-4" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
        {WEEKDAYS.map((d) => <span key={d} className="py-2">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startWeekday }).map((_, i) => <span key={`b-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const list = byDay.get(day) ?? [];
          const isToday = today.getFullYear() === cursor.year && today.getMonth() === cursor.month && today.getDate() === day;
          return (
            <div key={day} className={cn("min-h-[64px] rounded-lg border p-1.5 text-left text-xs", isToday ? "border-cyan" : "border-line/60")} data-testid={`calendar-day-${day}`}>
              <span className={cn("font-mono", isToday ? "text-cyan" : "text-muted")}>{day}</span>
              {list.map((e) => (
                <Link
                  key={e.slug}
                  href={`/eventos/${e.slug}`}
                  title={e.title}
                  className={cn(
                    "mt-1 block truncate rounded px-1 py-0.5 text-[10px] font-semibold",
                    e.status === "CANCELLED" ? "bg-red-500/20 text-red-300 line-through" : "bg-magenta/20 text-magenta",
                  )}
                >
                  {e.title}
                </Link>
              ))}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-muted">Zona horaria: {APP_TZ.replace("_", " ")}</p>
    </div>
  );
}