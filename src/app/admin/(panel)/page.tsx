import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { startOfToday } from "@/lib/data";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { INQUIRY_TYPES, fmt } from "@/lib/utils";

export default async function DashboardPage() {
  const [upcoming, pending, media, latest, next] = await Promise.all([
    prisma.event.count({ where: { date: { gte: startOfToday() }, status: "PUBLISHED" } }),
    prisma.rentalInquiry.count({ where: { status: "PENDING" } }),
    prisma.mediaItem.count(),
    prisma.rentalInquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.event.findFirst({ where: { date: { gte: startOfToday() }, status: "PUBLISHED" }, orderBy: { date: "asc" } }),
  ]);

  const stats = [
    { label: "Próximos eventos", value: upcoming, href: "/admin/eventos", color: "text-neon-magenta" },
    { label: "Consultas pendientes", value: pending, href: "/admin/consultas", color: "text-neon-cyan" },
    { label: "Fotos y videos", value: media, href: "/admin/galeria", color: "text-fog" },
  ];

  return (
    <>
      <AdminHeader title="Panel">
        <Link href="/admin/eventos/nuevo" className="btn btn-primary" data-testid="dashboard-new-event-btn">Nuevo evento</Link>
      </AdminHeader>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-cyan" data-testid={`stat-${s.href.split("/").pop()}`}>
            <p className={`font-display text-6xl font-black ${s.color}`}>{s.value}</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-muted">{s.label}</p>
          </Link>
        ))}
      </div>
      {next && (
        <p className="mt-8 text-sm text-muted" data-testid="dashboard-next-event">
          Próxima fecha: <Link href={`/admin/eventos/${next.id}`} className="text-fog hover:text-cyan">{next.title}</Link> · {fmt(next.date, "EEEE d MMM, HH:mm")}
        </p>
      )}
      <h2 className="mb-4 mt-12 font-display text-3xl font-bold uppercase">Últimas consultas</h2>
      <div className="divide-y divide-line rounded-2xl border border-line" data-testid="dashboard-latest-inquiries">
        {latest.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 text-sm">
            <span className="font-medium">{r.name}</span>
            <span className="text-muted">{INQUIRY_TYPES[r.type]} · {r.guests} pers. · {fmt(r.date, "dd/MM")}</span>
          </div>
        ))}
        {latest.length === 0 && <p className="px-5 py-4 text-sm text-muted">Sin consultas todavía.</p>}
      </div>
    </>
  );
}