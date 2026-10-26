"use client";

import { createInquiry } from "@/actions/inquiries";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { useActionForm } from "@/components/admin/useActionForm";
import { INQUIRY_TYPES } from "@/lib/utils";

export function InquiryForm({ minDate }: { minDate: string }) {
  const { state, pending, formRef, onSubmit } = useActionForm(createInquiry, { resetOnSuccess: true });

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" data-testid="inquiry-form">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="sm:col-span-2">
        <span className="field-label">Tipo de evento</span>
        <select name="type" className="field" defaultValue="PRIVATE_EVENT" data-testid="inquiry-type-select">
          {Object.entries(INQUIRY_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>
      <label>
        <span className="field-label">Nombre</span>
        <input name="name" required className="field" placeholder="Tu nombre" data-testid="inquiry-name-input" />
      </label>
      <label>
        <span className="field-label">Teléfono</span>
        <input name="phone" required className="field" placeholder="+54 9 11 ..." data-testid="inquiry-phone-input" />
      </label>
      <label className="sm:col-span-2">
        <span className="field-label">Email</span>
        <input name="email" type="email" required className="field" placeholder="vos@email.com" data-testid="inquiry-email-input" />
      </label>
      <label>
        <span className="field-label">Fecha estimada</span>
        <input name="date" type="date" min={minDate} required className="field" data-testid="inquiry-date-input" />
      </label>
      <label>
        <span className="field-label">Cantidad de personas</span>
        <input name="guests" type="number" min={1} max={500} defaultValue={50} required className="field" data-testid="inquiry-guests-input" />
      </label>
      <label className="sm:col-span-2">
        <span className="field-label">Mensaje (opcional)</span>
        <textarea name="message" rows={4} className="field" placeholder="Contanos qué tenés en mente" data-testid="inquiry-message-input" />
      </label>
      {state.ok && <p className="text-sm text-cyan sm:col-span-2" data-testid="inquiry-success-msg">{state.message}</p>}
      {state.error && <p className="text-sm text-red-400 sm:col-span-2" data-testid="inquiry-error-msg">{state.error}</p>}
      <div className="sm:col-span-2">
        <SubmitButton pending={pending} testId="inquiry-submit-btn">Enviar consulta</SubmitButton>
      </div>
    </form>
  );
}