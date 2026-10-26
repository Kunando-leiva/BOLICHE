"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";

type Item = { id: string; type: "IMAGE" | "VIDEO"; url: string; caption: string | null };

export function MediaGrid({ items }: { items: Item[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const move = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, move]);

  const current = index !== null ? items[index] : null;

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3" data-testid="media-grid">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setIndex(i)}
            data-testid={`media-item-${i}`}
            className="group relative mb-4 block w-full overflow-hidden rounded-2xl border border-line rise"
            style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}
          >
            {item.type === "VIDEO" ? (
              <div className="relative">
                <video src={item.url} muted playsInline preload="metadata" className="w-full" />
                <Play className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-fog drop-shadow-lg" />
              </div>
            ) : (
              <Image src={item.url} alt={item.caption ?? "Foto"} width={800} height={1000} sizes="(max-width: 640px) 100vw, 33vw" className="h-auto w-full transition-transform duration-700 group-hover:scale-105" />
            )}
          </button>
        ))}
      </div>

      {current && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-4 backdrop-blur" onClick={() => setIndex(null)} data-testid="lightbox">
          <button className="absolute right-5 top-5 text-fog hover:text-magenta" onClick={() => setIndex(null)} aria-label="Cerrar" data-testid="lightbox-close-btn"><X className="h-8 w-8" /></button>
          <button className="absolute left-3 text-fog hover:text-cyan md:left-8" onClick={(e) => { e.stopPropagation(); move(-1); }} aria-label="Anterior" data-testid="lightbox-prev-btn"><ChevronLeft className="h-10 w-10" /></button>
          <div className="relative max-h-[85vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {current.type === "VIDEO" ? (
              <video src={current.url} controls autoPlay className="max-h-[85vh] rounded-xl" />
            ) : (
              <Image src={current.url} alt={current.caption ?? "Foto"} width={1600} height={1200} className="h-auto max-h-[85vh] w-auto rounded-xl object-contain" />
            )}
            {current.caption && <p className="mt-3 text-center text-sm text-muted">{current.caption}</p>}
          </div>
          <button className="absolute right-3 text-fog hover:text-cyan md:right-8" onClick={(e) => { e.stopPropagation(); move(1); }} aria-label="Siguiente" data-testid="lightbox-next-btn"><ChevronRight className="h-10 w-10" /></button>
        </div>
      )}
    </>
  );
}