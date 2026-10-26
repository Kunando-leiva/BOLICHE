import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteMediaItem, setAlbumCover } from "@/actions/admin/gallery";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AlbumForm } from "@/components/admin/AlbumForm";
import { AlbumUploader } from "@/components/admin/AlbumUploader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { toInputDay } from "@/lib/utils";

export default async function AdminAlbumPage({ params }: PageProps<"/admin/galeria/[id]">) {
  const { id } = await params;
  const [album, events] = await Promise.all([
    prisma.galleryAlbum.findUnique({ where: { id }, include: { items: { orderBy: { order: "asc" } } } }),
    prisma.event.findMany({ orderBy: { date: "desc" }, select: { id: true, title: true } }),
  ]);
  if (!album) notFound();

  return (
    <>
      <Link href="/admin/galeria" className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-cyan" data-testid="admin-album-back-link"><ArrowLeft className="h-4 w-4" /> Álbumes</Link>
      <AdminHeader title={album.title}>
        <AlbumUploader albumId={album.id} />
      </AdminHeader>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5" data-testid="admin-media-grid">
        {album.items.map((item) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl border border-line" data-testid={`admin-media-${item.id}`}>
            {item.type === "VIDEO" ? (
              <video src={item.url} muted className="h-full w-full object-cover" />
            ) : (
              <Image src={item.url} alt="" fill sizes="20vw" className="object-cover" />
            )}
            {album.coverUrl === item.url && <span className="absolute left-2 top-2 rounded-full bg-magenta px-2 py-0.5 text-[10px] font-bold uppercase text-ink">Portada</span>}
            <div className="absolute inset-x-2 bottom-2 flex justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
              {item.type === "IMAGE" && album.coverUrl !== item.url && (
                <form action={setAlbumCover.bind(null, album.id, item.url)}>
                  <button className="btn btn-ghost glass !px-3 !py-2" title="Usar como portada" data-testid={`set-cover-${item.id}`}><Star className="h-3.5 w-3.5" /></button>
                </form>
              )}
              <div className="glass rounded-full"><DeleteButton action={deleteMediaItem.bind(null, item.id)} testId={`delete-media-${item.id}`} /></div>
            </div>
          </div>
        ))}
        {album.items.length === 0 && <p className="col-span-full text-sm text-muted">Todavía no hay archivos. Subí las fotos y videos de la noche.</p>}
      </div>

      <h2 className="mb-6 mt-14 font-display text-3xl font-bold uppercase">Datos del álbum</h2>
      <div className="max-w-3xl">
        <AlbumForm key={album.coverUrl ?? "no-cover"} album={{ ...album, date: toInputDay(album.date) }} events={events} />
      </div>
    </>
  );
}