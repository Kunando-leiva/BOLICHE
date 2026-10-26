"use client";

import { useRouter } from "next/navigation";
import { CldUploadWidget, type CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { addMediaItem } from "@/actions/admin/gallery";

export function AlbumUploader({ albumId }: { albumId: string }) {
  const router = useRouter();
  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary/sign"
      options={{ folder: `luna-club/galeria/${albumId}`, multiple: true, maxFiles: 50, resourceType: "auto", sources: ["local", "url", "camera"] }}
      onSuccess={async (result) => {
        const info = result.info as CloudinaryUploadWidgetInfo;
        await addMediaItem(albumId, { url: info.secure_url, publicId: info.public_id, type: info.resource_type === "video" ? "VIDEO" : "IMAGE" });
        router.refresh();
      }}
      onQueuesEnd={() => toast.success("Archivos subidos")}
    >
      {({ open }) => (
        <button type="button" className="btn btn-cyan" onClick={() => open()} data-testid="album-upload-btn">
          <Upload className="h-4 w-4" /> Subir fotos y videos
        </button>
      )}
    </CldUploadWidget>
  );
}