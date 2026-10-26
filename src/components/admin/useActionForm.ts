"use client";

import { startTransition, useActionState, useEffect, useRef, type FormEvent } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/lib/utils";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

// Envía sin el reset automático de React 19, para que no se pierdan los valores si hay error de validación.
export function useActionForm(action: Action, { resetOnSuccess = false } = {}) {
  const [state, dispatch, pending] = useActionState(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    else if (state.ok) {
      toast.success(state.message ?? "Guardado");
      if (resetOnSuccess) formRef.current?.reset();
    }
  }, [state, resetOnSuccess]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => dispatch(formData));
  };

  return { state, pending, formRef, onSubmit };
}