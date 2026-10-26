"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/validations";
import { firstError, formObject, type ActionState } from "@/lib/utils";

export async function createInquiry(_: ActionState, formData: FormData): Promise<ActionState> {
  if (formData.get("website")) return { ok: true, message: "¡Recibimos tu consulta!" };
  const parsed = inquirySchema.safeParse(formObject(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  const email = parsed.data.email.toLowerCase();
  const recent = await prisma.rentalInquiry.count({
    where: { email, createdAt: { gte: new Date(Date.now() - 60_000) } },
  });
  if (recent > 0) return { error: "Ya recibimos una consulta tuya hace instantes. Esperá un minuto para enviar otra." };

  await prisma.rentalInquiry.create({ data: { ...parsed.data, email } });
  revalidatePath("/admin", "layout");
  return { ok: true, message: "¡Recibimos tu consulta! Te contactamos en menos de 24 h." };
}