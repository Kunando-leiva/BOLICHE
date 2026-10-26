"use client";

import { loginAction } from "@/actions/auth";
import { Field } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { useActionForm } from "@/components/admin/useActionForm";

export function LoginForm() {
  const { state, pending, formRef, onSubmit } = useActionForm(loginAction);
  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-5" data-testid="login-form">
      <Field label="Email" name="email" type="email" required placeholder="admin@lunaclub.com" />
      <Field label="Contraseña" name="password" type="password" required />
      {state.error && <p className="text-sm text-red-400" data-testid="login-error-msg">{state.error}</p>}
      <SubmitButton pending={pending} testId="login-submit-btn">Ingresar</SubmitButton>
    </form>
  );
}