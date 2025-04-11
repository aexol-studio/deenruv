import React, { useRef } from "react";
import { z } from "zod";
import { translationNS } from "../translation-ns";
import { useFormContext } from "react-hook-form";
import { Button } from "@deenruv/react-ui-devkit";
import { formSchema } from "../types.js";
import { CustomFileInputProps } from "../types.js";
import { $ } from "@deenruv/admin-types";
import { apiUploadClient, useTranslation } from "@deenruv/react-ui-devkit";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const CustomFileInput: React.FC<CustomFileInputProps> = ({
  onChange,
  accept = "image/*",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation(translationNS);
  const { setValue, watch } = useFormContext<z.infer<typeof formSchema>>();
  const file = watch("file");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setValue?.("file", file);
    } else {
      setValue("file", null);
    }
    onChange(e);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        onClick={handleButtonClick}
        variant="outline"
        size="sm"
      >
        {t("choose_file")}
      </Button>
      <span className="text-sm text-muted-foreground">
        {file?.name || t("no_file_chosen")}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export function ReplicateSimpleBGOutput({ image }: { image: string }) {
  const { t } = useTranslation(translationNS);
  return (
    image && (
      <>
        <img
          src={image}
          alt="Generated Room"
          className="size-full object-contain"
        />
        <div className="mt-2 flex justify-center">
          <Button
            onClick={() => {
              fetch(image)
                .then((response) => response.blob())
                .then((blob) => {
                  const blobUrl = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  const timestamp = new Date().getTime();
                  link.href = blobUrl;
                  link.download = `generated-room-${timestamp}.png`;
                  link.style.display = "none";
                  document.body.appendChild(link);
                  link.click();

                  setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                  }, 100);
                })
                .catch((error) => {
                  console.error("Error downloading image:", error);
                  alert("Failed to download image. Please try again.");
                });
            }}
          >
            {t("download_image")}
          </Button>
        </div>
      </>
    )
  );
}

export const getQueryParams = (query: string) => {
  if (!query || query === "") return {};
  const [key, value] = query.substring(1).split("=");
  return key && value ? { [key]: value } : {};
};

export async function createAssets(file: File | null) {
  const { createAssets } = await apiUploadClient("mutation")(
    {
      createAssets: [
        { input: $("input", "[CreateAssetInput!]!") },
        {
          __typename: true,
          "...on Asset": { id: true, source: true },
          "...on MimeTypeError": {
            fileName: true,
            mimeType: true,
            errorCode: true,
            message: true,
          },
        },
      ],
    },
    { variables: { input: [{ file }] } },
  );

  return createAssets;
}

export const getLastPathSegment = (url: string) => {
  const segments = url.split("/");
  return segments.pop() || "";
};

export const LoadingMask: React.FC = () => {
  const { t } = useTranslation(translationNS);
  return (
    <motion.div
      className="absolute inset-0 z-5 flex h-full w-full items-center justify-center bg-background/90 backdrop-blur-sm"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Loader2 className="w-12 h-12e text-primary" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-lg font-medium text-foreground"
        >
          {t("loading")}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
