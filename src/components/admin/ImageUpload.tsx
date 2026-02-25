"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
}

export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "panenhub_uploads";

  const onUpload = (result: any) => {
    console.log("[ImageUpload] upload result:", result);
    try {
      const url = result?.info?.secure_url;
      if (url) {
        onChange(url);
      } else {
        console.error("[ImageUpload] upload did not return secure_url", result);
      }
    } catch (err) {
      console.error("[ImageUpload] onUpload error", err);
    }
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
      {!cloudName ? (
        <div className="p-2 text-sm text-red-600">Konfigurasi Cloudinary belum di-set. Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` di .env.local</div>
      ) : (
        <CldUploadWidget onUpload={onUpload} uploadPreset={uploadPreset} cloudName={cloudName}>
          {({ open }) => {
            const onClick = () => {
              console.log("[ImageUpload] opening Cloudinary widget", { cloudName, uploadPreset });
              open();
            };

            return (
              <Button
                type="button"
                disabled={disabled}
                variant="secondary"
                onClick={onClick}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                Upload an Image
              </Button>
            );
          }}
        </CldUploadWidget>
      )}
    </div>
  );
}
