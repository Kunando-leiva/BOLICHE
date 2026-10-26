import { AdminHeader } from "@/components/admin/AdminHeader";
import { EventForm } from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <>
      <AdminHeader title="Nuevo evento" />
      <EventForm />
    </>
  );
}