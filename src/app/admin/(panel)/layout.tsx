import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const pending = await prisma.rentalInquiry.count({ where: { status: "PENDING" } });
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar email={session.user.email ?? ""} pending={pending} />
      <main className="flex-1 px-5 py-10 md:px-12">{children}</main>
    </div>
  );
}