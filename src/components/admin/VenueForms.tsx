"use client";

import type { VenueInfo, VenueSection } from "@prisma/client";
import { saveSection, saveVenue } from "@/actions/admin/site";
import { Field } from "@/components/admin/Field";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { useActionForm } from "@/components/admin/useActionForm";

export function VenueForm({ venue }: { venue: VenueInfo }) {
  const { pending, formRef, onSubmit } = useActionForm(saveVenue);
  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2" data-testid="venue-form">
      <Field label="Título" name="title" defaultValue={venue.title} required className="md:col-span-2" />
      <Field label="Descripción" name="description" textarea rows={4} defaultValue={venue.description} className="md:col-span-2" />
      <Field label="Capacidad total" name="capacity" type="number" defaultValue={venue.capacity} />
      <Field label="Dirección" name="address" defaultValue={venue.address} />
      <Field label="URL del mapa (embed de Google Maps)" name="mapEmbedUrl" defaultValue={venue.mapEmbedUrl} className="md:col-span-2" hint="Google Maps → Compartir → Insertar mapa → copiar el src del iframe" />
      <Field label="Servicios" name="amenities" textarea rows={4} defaultValue={venue.amenities.join("\n")} hint="Uno por línea" className="md:col-span-2" />
      <Field label="Tipos de evento" name="eventTypes" textarea rows={4} defaultValue={venue.eventTypes.join("\n")} hint="Uno por línea" className="md:col-span-2" />
      <div className="md:col-span-2"><MediaUploadField name="hero" label="Imagen principal" defaultUrl={venue.heroUrl} /></div>
      <div><SubmitButton pending={pending} testId="venue-form-submit-btn">Guardar salón</SubmitButton></div>
    </form>
  );
}

export function SectionForm({ section, children }: { section?: VenueSection; children?: React.ReactNode }) {
  const { pending, formRef, onSubmit } = useActionForm(saveSection, { resetOnSuccess: !section });
  const key = section?.id ?? "new";
  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-line bg-surface p-5 md:grid-cols-[1fr_1fr_120px_90px]" data-testid={`section-form-${key}`}>
      {section && <input type="hidden" name="id" value={section.id} />}
      <Field label="Nombre" name="name" defaultValue={section?.name} required />
      <Field label="Descripción" name="description" defaultValue={section?.description} />
      <Field label="Capacidad" name="capacity" type="number" defaultValue={section?.capacity} />
      <Field label="Orden" name="order" type="number" defaultValue={section?.order ?? 0} />
      <div className="md:col-span-2"><MediaUploadField name="image" label="Imagen" defaultUrl={section?.imageUrl} /></div>
      <div className="flex items-end justify-end gap-2 md:col-span-2">
        <SubmitButton pending={pending} testId={`section-save-btn-${key}`}>{section ? "Guardar" : "Agregar"}</SubmitButton>
        {children}
      </div>
    </form>
  );
}