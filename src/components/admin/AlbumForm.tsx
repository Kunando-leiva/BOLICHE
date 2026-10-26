"use client";

import { saveAlbum } from "@/actions/admin/gallery";
import { Checkbox, Field } from "@/components/admin/Field";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { useActionForm } from "@/components/admin/useActionForm";

type Album = { id: string; title: string; date: string; coverUrl: string | null; eventId: string | null; featured: boolean; published: boolean };

export function AlbumForm({ album, events }: { album?: Album; events: { id: string; title: string }[] }) {
  const { pending, formRef, onSubmit } = useActionForm(saveAlbum);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2" data-testid="album-form">
      {album && <input type="hidden" name="id" value={album.id} />}
      <Field label="Título del álbum" name="title" defaultValue={album?.title} required />
      <Field label="Fecha" name="date" type="date" defaultValue={album?.date} required />
      <label className="md:col-span-2">
        <span className="field-label">Evento asociado (opcional)</span>
        <select name="eventId" defaultValue={album?.eventId ?? ""} className="field" data-testid="field-eventId">
          <option value="">Sin evento</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </label>
      <div className="md:col-span-2"><MediaUploadField name="cover" label="Portada" defaultUrl={album?.coverUrl} /></div>
      <div className="flex flex-wrap gap-8 md:col-span-2">
        <Checkbox label="Publicado" name="published" defaultChecked={album?.published ?? true} />
        <Checkbox label="Destacado" name="featured" defaultChecked={album?.featured} />
      </div>
      <div className="md:col-span-2"><SubmitButton pending={pending} testId="album-form-submit-btn">{album ? "Guardar cambios" : "Crear álbum"}</SubmitButton></div>
    </form>
  );
}