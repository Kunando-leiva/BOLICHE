"use server";

import { revalidatePath } from "next/cache";
import type { InquiryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { sectionSchema, settingsSchema, venueSchema } from "@/lib/validations";
import { firstError, formObject, type ActionState } from "@/lib/utils";

export async function saveVenue(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = venueSchema.safeParse(formObject(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };
  await prisma.venueInfo.upsert({ where: { id: "main" }, create: { id: "main", ...parsed.data }, update: parsed.data });
  revalidatePath("/", "layout");
  return { ok: true, message: "Salón actualizado" };
}

export async function saveSection(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = sectionSchema.safeParse(formObject(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };
  const data = { ...parsed.data, capacity: parsed.data.capacity ?? null };
  const id = formData.get("id") as string | null;
  if (id) await prisma.venueSection.update({ where: { id }, data });
  else await prisma.venueSection.create({ data });
  revalidatePath("/", "layout");
  return { ok: true, message: id ? "Sector actualizado" : "Sector creado" };
}

export async function deleteSection(id: string) {
  await requireAdmin();
  await prisma.venueSection.delete({ where: { id } });
  revalidatePath("/", "layout");
}

export async function saveSettings(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(formObject(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };
  await prisma.siteSettings.upsert({ where: { id: "main" }, create: { id: "main", ...parsed.data }, update: parsed.data });
  revalidatePath("/", "layout");
  return { ok: true, message: "Ajustes guardados" };
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  await requireAdmin();
  await prisma.rentalInquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin", "layout");
}

export async function deleteInquiry(id: string) {
  await requireAdmin();
  await prisma.rentalInquiry.delete({ where: { id } });
  revalidatePath("/admin", "layout");
}