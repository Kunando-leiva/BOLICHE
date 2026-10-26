import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { MediaGrid } from "@/components/public/MediaGrid";
import { fmt } from "@/lib/utils";

async function getAlbum(slug: string) {
  return prisma.galleryAlbum.findFirst({ where: { slug, published: true }, include: { items: { orderBy: { order: "asc" } } } });
}

export async function generateMetadata({ params }: PageProps<"/galeria/[slug]">): Promise<Metadata> {
  const album = await getAlbum((await params).slug);
  return { title: album?.title ?? "Galería" };
}

export default async function AlbumPage({ params }: PageProps<"/galeria/[slug]">) {
  const album = await getAlbum((await params).slug);
  if (!album) notFound();

  return (
    <section className="mx-auto max-w-7xl px-5 pt-32 md:px-10 md:pt-40" data-testid="album-detail">
      <Link href="/galeria" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-cyan" data-testid="album-back-link">
        <ArrowLeft className="h-4 w-4" /> Galería
      </Link>
      <p className="eyebrow mt-10">{fmt(album.date, "EEEE d 'de' MMMM yyyy")}</p>
      <h1 className="mb-12 mt-4 font-display text-6xl font-black uppercase leading-[0.85] md:text-8xl" data-testid="album-title">{album.title}</h1>
      {album.items.length ? <MediaGrid items={album.items} /> : <p className="text-muted">Este álbum todavía no tiene archivos.</p>}
    </section>
  );
}