export function AdminHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <h1 className="font-display text-5xl font-black uppercase" data-testid="admin-page-title">{title}</h1>
      {children}
    </div>
  );
}