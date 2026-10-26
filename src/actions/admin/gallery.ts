"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { destroyAsset } from "@/lib/cloudinary";
import { uniqueSlug } from "@/lib/data";
import { albumSchema, mediaSchema } from "@/lib/validations";
import { firstError, formBool, formObject, slugify, type ActionState } from "@/lib/utils";

export async function saveAlbum(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = albumSchema.safeParse({
    ...formObject(formData),
    featured: formBool(formData, "featured"),
    published: formBool(formData, "published"),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const id = formData.get("id") as string | null;
  if (id) {
    await prisma.galleryAlbum.update({ where: { id }, data: parsed.data });
    revalidatePath("/", "layout");
    return { ok: true, message: "Álbum actualizado" };
  }
  const slug = await uniqueSlug(slugify(parsed.data.title), async (s) => !!(await prisma.galleryAlbum.findUnique({ where: { slug: s } })));
  const album = await prisma.galleryAlbum.create({ data: { ...parsed.data, slug } });
  revalidatePath("/", "layout");
  redirect(`/admin/galeria/${album.id}`);
}

export async function deleteAlbum(id: string) {
  await requireAdmin();
  const items = await prisma.mediaItem.findMany({ where: { albumId: id } });
  await Promise.all(items.map((i) => destroyAsset(i.publicId, i.type === "VIDEO" ? "video" : "image")));
  await prisma.galleryAlbum.delete({ where: { id } });
  revalidatePath("/", "layout");
}

export async function addMediaItem(albumId: string, input: { url: string; publicId: string; type: "IMAGE" | "VIDEO" }) {
  await requireAdmin();
  const data = mediaSchema.parse(input);
  const count = await prisma.mediaItem.count({ where: { albumId } });
  await prisma.mediaItem.create({ data: { ...data, albumId, order: count } });
  const album = await prisma.galleryAlbum.findUnique({ where: { id: albumId } });
  if (album && !album.coverUrl && data.type === "IMAGE") {
    await prisma.galleryAlbum.update({ where: { id: albumId }, data: { coverUrl: data.url } });
  }
  revalidatePath("/", "layout");
}

export async function setAlbumCover(albumId: string, url: string) {
  await requireAdmin();
  await prisma.galleryAlbum.update({ where: { id: albumId }, data: { coverUrl: url } });
  revalidatePath("/", "layout");
}

export async function deleteMediaItem(id: string) {
  await requireAdmin();
  const item = await prisma.mediaItem.delete({ where: { id } });
  await destroyAsset(item.publicId, item.type === "VIDEO" ? "video" : "image");
  revalidatePath("/", "layout");
}