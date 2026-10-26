import { prisma } from "@/lib/prisma";
import { getVenue } from "@/lib/data";
import { deleteSection } from "@/actions/admin/site";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SectionForm, VenueForm } from "@/components/admin/VenueForms";

export default async function AdminVenuePage() {
  const [venue, sections] = await Promise.all([getVenue(), prisma.venueSection.findMany({ orderBy: { order: "asc" } })]);
  return (
    <>
      <AdminHeader title="Salón" />
      <div className="max-w-4xl"><VenueForm venue={venue} /></div>
      <h2 className="mb-6 mt-14 font-display text-3xl font-bold uppercase">Sectores</h2>
      <div className="max-w-5xl space-y-4" data-testid="admin-sections">
        {sections.map((s) => (
          <SectionForm key={s.id} section={s}>
            <DeleteButton action={deleteSection.bind(null, s.id)} testId={`delete-section-${s.id}`} />
          </SectionForm>
        ))}
        <p className="eyebrow pt-6">Agregar sector</p>
        <SectionForm />
      </div>
    </>
  );
}