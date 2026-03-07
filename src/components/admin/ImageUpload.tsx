"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
}

type CloudinaryUploadResult = {
  info?: {
    secure_url?: string;
  };
};

export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "panenhub_uploads";

  const cloudinaryReady =
    !!cloudName &&
    cloudName !== "your_cloud_name" &&
    !!uploadPreset &&
    uploadPreset !== "your_upload_preset";

  const onCloudinaryUpload = (result: unknown) => {
    const uploadResult = result as CloudinaryUploadResult;
    console.log("[ImageUpload] upload result:", result);
    try {
      const url = uploadResult?.info?.secure_url;
      if (url) {
        setUploadError(null);
        onChange(url);
      } else {
        console.error("[ImageUpload] upload did not return secure_url", result);
        setUploadError("Upload gagal. Coba lagi atau gunakan upload lokal.");
      }
    } catch (err) {
      console.error("[ImageUpload] onUpload error", err);
      setUploadError("Terjadi kesalahan saat upload gambar.");
    }
  };

  const uploadLocalFile = async (file: File) => {
    setUploadError(null);

    if (!file.type.startsWith("image/")) {
      setUploadError("File harus berupa gambar (jpg, png, webp, dll).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran gambar maksimal 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result?.url) {
        throw new Error(result?.error || "Upload gambar gagal");
      }

      onChange(result.url);
    } catch (error) {
      console.error("[ImageUpload] local upload error", error);
      setUploadError(
        error instanceof Error ? error.message : "Terjadi kesalahan saat upload gambar."
      );
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleLocalPick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value && (
          <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(value)}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={value} />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            uploadLocalFile(file);
          }
        }}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          disabled={disabled || isUploading}
          variant="secondary"
          onClick={handleLocalPick}
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload dari Komputer"}
        </Button>

        {cloudinaryReady && (
        <CldUploadWidget
          onUpload={onCloudinaryUpload}
          uploadPreset={uploadPreset}
          cloudName={cloudName}
          onError={(error) => {
            console.error("[ImageUpload] cloudinary error", error);
            setUploadError("Upload Cloudinary gagal. Gunakan upload dari komputer.");
          }}
        >
          {({ open }) => {
            const onClick = () => {
              console.log("[ImageUpload] opening Cloudinary widget", {
                cloudName,
                uploadPreset,
              });
              open();
            };

            return (
              <Button
                type="button"
                disabled={disabled || isUploading}
                variant="outline"
                onClick={onClick}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                Upload via Cloudinary
              </Button>
            );
          }}
        </CldUploadWidget>
        )}
      </div>
      {!cloudinaryReady && (
        <p className="mt-2 text-xs text-muted-foreground">
          Upload lokal aktif. Untuk Cloudinary, isi env Cloudinary dengan nilai yang valid.
        </p>
      )}
      {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
    </div>
  );
}
