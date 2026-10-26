"use client";

import type { SiteSettings } from "@prisma/client";
import { saveSettings } from "@/actions/admin/site";
import { Field } from "@/components/admin/Field";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { useActionForm } from "@/components/admin/useActionForm";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const { pending, formRef, onSubmit } = useActionForm(saveSettings);
  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid max-w-4xl gap-6 md:grid-cols-2" data-testid="settings-form">
      <Field label="Nombre del boliche" name="clubName" defaultValue={settings.clubName} required />
      <Field label="Frase / tagline" name="tagline" defaultValue={settings.tagline} />
      <Field label="WhatsApp" name="whatsapp" defaultValue={settings.whatsapp} hint="Solo números con código de país, ej: 5491123456789" />
      <Field label="Email de contacto" name="email" type="email" defaultValue={settings.email} />
      <Field label="Instagram (usuario)" name="instagram" defaultValue={settings.instagram} />
      <Field label="TikTok (usuario)" name="tiktok" defaultValue={settings.tiktok} />
      <Field label="Horarios" name="hours" textarea rows={4} defaultValue={settings.hours} className="md:col-span-2" hint="Una línea por día" />
      <MediaUploadField name="heroImage" label="Imagen de portada" defaultUrl={settings.heroImageUrl} />
      <MediaUploadField name="heroVideo" label="Video de portada (opcional)" defaultUrl={settings.heroVideoUrl} resourceType="video" />
      <div className="md:col-span-2"><SubmitButton pending={pending} testId="settings-form-submit-btn">Guardar ajustes</SubmitButton></div>
    </form>
  );
}