import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function signParams(params: Record<string, string | number>) {
  return cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET as string);
}

export async function destroyAsset(publicId: string | null | undefined, type: "image" | "video" = "image") {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: type }).catch(() => null);
}