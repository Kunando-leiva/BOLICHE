"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { destroyAsset } from "@/lib/cloudinary";
import { uniqueSlug } from "@/lib/data";
import { eventSchema } from "@/lib/validations";
import { firstError, formBool, formObject, slugify, type ActionState } from "@/lib/utils";

export async function saveEvent(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = eventSchema.safeParse({
    ...formObject(formData),
    featured: formBool(formData, "featured"),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const id = formData.get("id") as string | null;
  if (id) {
    const prev = await prisma.event.findUnique({ where: { id } });
    if (prev?.flyerPublicId && prev.flyerPublicId !== parsed.data.flyerPublicId) await destroyAsset(prev.flyerPublicId);
    await prisma.event.update({ where: { id }, data: parsed.data });
  } else {
    const slug = await uniqueSlug(slugify(parsed.data.title), async (s) => !!(await prisma.event.findUnique({ where: { slug: s } })));
    await prisma.event.create({ data: { ...parsed.data, slug } });
  }
  revalidatePath("/", "layout");
  redirect("/admin/eventos");
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  const event = await prisma.event.delete({ where: { id } });
  await destroyAsset(event.flyerPublicId);
  revalidatePath("/", "layout");
}