"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { InquiryStatus } from "@prisma/client";
import { updateInquiryStatus } from "@/actions/admin/site";
import { INQUIRY_STATUS } from "@/lib/utils";

export function StatusSelect({ id, status }: { id: string; status: InquiryStatus }) {
  const [pending, start] = useTransition();
  return (
    <select
      defaultValue={status}
      disabled={pending}
      className="field !w-auto !py-2 text-sm"
      data-testid={`inquiry-status-${id}`}
      onChange={(e) =>
        start(async () => {
          await updateInquiryStatus(id, e.target.value as InquiryStatus);
          toast.success("Estado actualizado");
        })
      }
    >
      {Object.entries(INQUIRY_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
    </select>
  );
}