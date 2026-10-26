"use client";

import { Loader2 } from "lucide-react";

export function SubmitButton({ children, testId, pending, variant = "primary" }: { children: React.ReactNode; testId: string; pending: boolean; variant?: "primary" | "cyan" }) {
  return (
    <button type="submit" disabled={pending} className={`btn btn-${variant}`} data-testid={testId}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}