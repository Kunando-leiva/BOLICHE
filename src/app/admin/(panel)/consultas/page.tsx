import Link from "next/link";
import type { InquiryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { deleteInquiry } from "@/actions/admin/site";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { INQUIRY_STATUS, INQUIRY_TYPES, cn, fmt } from "@/lib/utils";

export default async function AdminInquiriesPage({ searchParams }: PageProps<"/admin/consultas">) {
  const { estado } = await searchParams;
  const status = typeof estado === "string" && estado in INQUIRY_STATUS ? (estado as InquiryStatus) : undefined;
  const inquiries = await prisma.rentalInquiry.findMany({ where: status ? { status } : {}, orderBy: { createdAt: "desc" } });
  const filters = [{ key: undefined, label: "Todas" }, ...Object.entries(INQUIRY_STATUS).map(([key, label]) => ({ key, label }))];

  return (
    <>
      <AdminHeader title="Consultas">
        <div className="flex flex-wrap gap-2" data-testid="inquiry-filters">
          {filters.map((f) => (
            <Link key={f.label} href={f.key ? `?estado=${f.key}` : "?"} className={cn("rounded-full border px-4 py-1.5 text-xs", status === f.key ? "border-magenta text-magenta" : "border-line text-muted hover:text-fog")} data-testid={`filter-${f.key ?? "all"}`}>
              {f.label}
            </Link>
          ))}
        </div>
      </AdminHeader>
      <div className="space-y-3" data-testid="inquiries-list">
        {inquiries.map((r) => (
          <div key={r.id} className="grid gap-4 rounded-2xl border border-line bg-surface p-5 md:grid-cols-[1.4fr_1fr_auto] md:items-center" data-testid={`inquiry-${r.id}`}>
            <div>
              <p className="font-medium">{r.name} <span className="ml-2 font-mono text-[11px] uppercase text-cyan">{INQUIRY_TYPES[r.type]}</span></p>
              <p className="mt-1 text-sm text-muted">
                <a href={`mailto:${r.email}`} className="hover:text-fog">{r.email}</a> · <a href={`https://wa.me/${r.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="hover:text-fog">{r.phone}</a>
              </p>
              {r.message && <p className="mt-2 text-sm text-fog/80">“{r.message}”</p>}
            </div>
            <div className="text-sm">
              <p>{fmt(r.date, "EEEE d MMM")} · {r.guests} personas</p>
              <p className="text-xs text-muted">Recibida {fmt(r.createdAt, "dd/MM HH:mm")}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusSelect id={r.id} status={r.status} />
              <DeleteButton action={deleteInquiry.bind(null, r.id)} testId={`delete-inquiry-${r.id}`} />
            </div>
          </div>
        ))}
        {inquiries.length === 0 && <p className="text-sm text-muted">No hay consultas.</p>}
      </div>
    </>
  );
}