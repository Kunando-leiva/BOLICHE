"use client";

import { useEffect, useRef, useState } from "react";
import { CldUploadWidget, type CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { ImagePlus, X } from "lucide-react";

type Props = {
  name: string;
  label: string;
  defaultUrl?: string | null;
  defaultPublicId?: string | null;
  resourceType?: "image" | "video";
  withPublicId?: boolean;
};

export function MediaUploadField({ name, label, defaultUrl, defaultPublicId, resourceType = "image", withPublicId }: Props) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [publicId, setPublicId] = useState(defaultPublicId ?? "");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    const onReset = () => {
      setUrl(defaultUrl ?? "");
      setPublicId(defaultPublicId ?? "");
    };
    form?.addEventListener("reset", onReset);
    return () => form?.removeEventListener("reset", onReset);
  }, [defaultUrl, defaultPublicId]);

  return (
    <div ref={rootRef} data-testid={`upload-field-${name}`}>
      <span className="field-label">{label}</span>
      <input type="hidden" name={`${name}Url`} value={url} />
      {withPublicId && <input type="hidden" name={`${name}PublicId`} value={publicId} />}
      <div className="flex items-start gap-4">
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-surface">
          {url ? (
            resourceType === "video" ? <video src={url} muted className="h-full w-full object-cover" /> : <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6 text-muted" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <CldUploadWidget
            signatureEndpoint="/api/cloudinary/sign"
            options={{ folder: "luna-club", multiple: false, resourceType, sources: ["local", "url", "camera"] }}
            onSuccess={(result) => {
              const info = result.info as CloudinaryUploadWidgetInfo;
              setUrl(info.secure_url);
              setPublicId(info.public_id);
            }}
          >
            {({ open }) => (
              <button type="button" className="btn btn-ghost !py-2" onClick={() => open()} data-testid={`upload-${name}-btn`}>
                {url ? "Cambiar" : "Subir"} {resourceType === "video" ? "video" : "imagen"}
              </button>
            )}
          </CldUploadWidget>
          {url && (
            <button type="button" className="inline-flex items-center gap-1 text-xs text-muted hover:text-red-400" onClick={() => { setUrl(""); setPublicId(""); }} data-testid={`remove-${name}-btn`}>
              <X className="h-3 w-3" /> Quitar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}