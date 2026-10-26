import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteEvent } from "@/actions/admin/events";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { EVENT_STATUS, cn, fmt } from "@/lib/utils";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { date: "desc" } });
  return (
    <>
      <AdminHeader title="Eventos">
        <Link href="/admin/eventos/nuevo" className="btn btn-primary" data-testid="new-event-btn">Nuevo evento</Link>
      </AdminHeader>
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-left text-sm" data-testid="events-table">
          <thead className="bg-surface font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            <tr><th className="p-4">Fecha</th><th className="p-4">Título</th><th className="p-4">Estado</th><th className="p-4" /></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {events.map((e) => (
              <tr key={e.id} data-testid={`event-row-${e.slug}`}>
                <td className="whitespace-nowrap p-4 text-muted">{fmt(e.date, "dd/MM/yyyy HH:mm")}</td>
                <td className="p-4 font-medium">{e.title}</td>
                <td className="p-4 text-xs">
                  <span className={cn(e.status === "PUBLISHED" && "text-cyan", e.status === "CANCELLED" && "text-red-400", e.status === "DRAFT" && "text-muted")}>{EVENT_STATUS[e.status]}</span>
                  {e.featured && <span className="ml-2 text-magenta">· Destacado</span>}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/eventos/${e.id}`} className="btn btn-ghost !px-3 !py-2" data-testid={`edit-event-${e.slug}`}><Pencil className="h-3.5 w-3.5" /></Link>
                    <DeleteButton action={deleteEvent.bind(null, e.id)} testId={`delete-event-${e.slug}`} confirmText={`¿Eliminar "${e.title}"?`} />
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan={4} className="p-6 text-muted">No hay eventos.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}