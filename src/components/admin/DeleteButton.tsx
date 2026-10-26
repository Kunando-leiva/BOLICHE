"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function DeleteButton({ action, confirmText = "¿Seguro que querés eliminarlo?", testId }: { action: () => Promise<void>; confirmText?: string; testId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="btn btn-danger"
      data-testid={testId}
      onClick={() => {
        if (!confirm(confirmText)) return;
        start(async () => {
          await action();
          toast.success("Eliminado");
        });
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}