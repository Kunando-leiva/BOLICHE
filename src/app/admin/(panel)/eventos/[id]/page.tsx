import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EventForm } from "@/components/admin/EventForm";
import { toInputDate } from "@/lib/utils";

export default async function EditEventPage({ params }: PageProps<"/admin/eventos/[id]">) {
  const event = await prisma.event.findUnique({ where: { id: (await params).id } });
  if (!event) notFound();
  return (
    <>
      <AdminHeader title="Editar evento" />
      <EventForm event={{ ...event, date: toInputDate(event.date), lineup: event.lineup.join("\n") }} />
    </>
  );
}