import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteAlbum } from "@/actions/admin/gallery";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AlbumForm } from "@/components/admin/AlbumForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { fmt } from "@/lib/utils";

export default async function AdminGalleryPage() {
  const [albums, events] = await Promise.all([
    prisma.galleryAlbum.findMany({ orderBy: { date: "desc" }, include: { _count: { select: { items: true } } } }),
    prisma.event.findMany({ orderBy: { date: "desc" }, select: { id: true, title: true } }),
  ]);

  return (
    <>
      <AdminHeader title="Galería" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" data-testid="admin-albums-grid">
        {albums.map((a) => (
          <div key={a.id} className="overflow-hidden rounded-2xl border border-line bg-surface" data-testid={`admin-album-${a.slug}`}>
            <Link href={`/admin/galeria/${a.id}`} className="relative block aspect-video bg-surface-2">
              {a.coverUrl && <Image src={a.coverUrl} alt={a.title} fill sizes="33vw" className="object-cover" />}
            </Link>
            <div className="flex items-center justify-between gap-3 p-4">
              <Link href={`/admin/galeria/${a.id}`} className="min-w-0">
                <p className="truncate font-medium">{a.title}</p>
                <p className="text-xs text-muted">{fmt(a.date, "dd/MM/yyyy")} · {a._count.items} archivos{!a.published ? " · Oculto" : ""}{a.featured ? " · Destacado" : ""}</p>
              </Link>
              <DeleteButton action={deleteAlbum.bind(null, a.id)} testId={`delete-album-${a.slug}`} confirmText="¿Eliminar el álbum y todos sus archivos?" />
            </div>
          </div>
        ))}
      </div>
      <h2 className="mb-6 mt-14 font-display text-3xl font-bold uppercase">Nuevo álbum</h2>
      <div className="max-w-3xl"><AlbumForm events={events} /></div>
    </>
  );
}