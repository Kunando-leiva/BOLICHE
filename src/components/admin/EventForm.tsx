"use client";

import { saveEvent } from "@/actions/admin/events";
import { Checkbox, Field, Select } from "@/components/admin/Field";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { useActionForm } from "@/components/admin/useActionForm";
import { EVENT_STATUS } from "@/lib/utils";

export type EventFormValues = {
  id: string;
  title: string;
  description: string;
  date: string;
  endTime: string | null;
  doorsOpen: string | null;
  category: string | null;
  lineup: string;
  price: string | null;
  ticketUrl: string | null;
  flyerUrl: string | null;
  flyerPublicId: string | null;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED";
};

export function EventForm({ event }: { event?: EventFormValues }) {
  const { state, pending, formRef, onSubmit } = useActionForm(saveEvent);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid max-w-4xl gap-6 md:grid-cols-2" data-testid="event-form">
      {event && <input type="hidden" name="id" value={event.id} />}
      <Field label="Título" name="title" defaultValue={event?.title} required className="md:col-span-2" />
      <Field label="Fecha y hora" name="date" type="datetime-local" defaultValue={event?.date} required />
      <Field label="Hora de fin (opcional)" name="endTime" defaultValue={event?.endTime} placeholder="06:00" />
      <Field label="Apertura de puertas" name="doorsOpen" defaultValue={event?.doorsOpen} placeholder="00:00" />
      <Field label="Categoría (opcional)" name="category" defaultValue={event?.category} placeholder="Fiesta, Show, Aniversario" />
      <Field label="Precio" name="price" defaultValue={event?.price} placeholder="$8.000 anticipada" />
      <Field label="Link de entradas" name="ticketUrl" type="url" defaultValue={event?.ticketUrl} placeholder="https://..." />
      <Field label="Descripción" name="description" textarea rows={5} defaultValue={event?.description} required className="md:col-span-2" />
      <Field label="Line-up" name="lineup" textarea rows={4} defaultValue={event?.lineup} hint="Un artista por línea" className="md:col-span-2" />
      <div className="md:col-span-2">
        <MediaUploadField name="flyer" label="Flyer" defaultUrl={event?.flyerUrl} defaultPublicId={event?.flyerPublicId} withPublicId />
      </div>
      <Select
        label="Estado"
        name="status"
        defaultValue={event?.status ?? "PUBLISHED"}
        options={Object.entries(EVENT_STATUS).map(([value, label]) => ({ value, label }))}
      />
      <div className="flex flex-wrap gap-8 md:col-span-2">
        <Checkbox label="Destacado en el inicio" name="featured" defaultChecked={event?.featured} />
      </div>
      {state.error && <p className="text-sm text-red-400 md:col-span-2" data-testid="event-form-error">{state.error}</p>}
      <div className="md:col-span-2"><SubmitButton pending={pending} testId="event-form-submit-btn">Guardar evento</SubmitButton></div>
    </form>
  );
}