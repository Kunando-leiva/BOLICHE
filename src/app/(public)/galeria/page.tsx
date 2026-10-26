import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/public/PageHero";
import { fmt } from "@/lib/utils";

export const metadata: Metadata = { title: "Galería" };

export default async function GalleryPage() {
  const albums = await prisma.galleryAlbum.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { date: "desc" }],
    include: { _count: { select: { items: true } } },
  });

  return (
    <>
      <PageHero eyebrow="Galería" title="Las noches" intro="Fotos y videos de cada fecha. Buscate." />
      <section className="mx-auto grid max-w-7xl gap-6 px-5 sm:grid-cols-2 md:px-10" data-testid="albums-grid">
        {albums.map((a, i) => (
          <Link
            key={a.id}
            href={`/galeria/${a.slug}`}
            className={`group relative overflow-hidden rounded-3xl border border-line rise ${i % 3 === 0 ? "sm:col-span-2 aspect-[16/8]" : "aspect-[4/3]"}`}
            style={{ animationDelay: `${i * 80}ms` }}
            data-testid={`album-card-${a.slug}`}
          >
            {a.coverUrl && <Image src={a.coverUrl} alt={a.title} fill sizes="(max-width: 640px) 100vw, 66vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">{fmt(a.date, "dd MMM yyyy")}{a.featured ? " · Destacado" : ""}</p>
                <h2 className="mt-2 font-display text-4xl font-black uppercase md:text-5xl">{a.title}</h2>
              </div>
              <span className="font-mono text-xs text-muted">{a._count.items} archivos</span>
            </div>
          </Link>
        ))}
        {albums.length === 0 && <p className="text-muted" data-testid="no-albums">Todavía no hay álbumes publicados.</p>}
      </section>
    </>
  );
}