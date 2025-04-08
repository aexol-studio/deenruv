import React, { PropsWithChildren } from "react";
import { Button, ButtonProps } from ".";
import { $, ModelTypes } from "@deenruv/admin-types";
import { ImageUp } from "lucide-react";
import { cn } from "@/lib";
import { toast } from "sonner";
import { apiUploadClient } from "@/zeus_client";
import { useTranslation } from "@/hooks/useTranslation.js";

type Props = {
  refetch?: () => void;
  cb?: (asset: Pick<ModelTypes["Asset"], "id">) => object;
  hideIcon?: true;
  buttonProps?: ButtonProps;
};

export const AssetUploadButton: React.FC<PropsWithChildren<Props>> = ({
  refetch,
  cb,
  hideIcon,
  children,
  buttonProps,
}) => {
  const { className, ...props } = buttonProps || {};

  const { t } = useTranslation("common");

  return (
    <Button
      size="lg"
      variant="secondary"
      className={cn("flex items-center gap-2", className)}
      {...props}
      onClick={() => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return;

          try {
            const { createAssets } = await apiUploadClient("mutation")(
              {
                createAssets: [
                  { input: $("input", "[CreateAssetInput!]!") },
                  {
                    __typename: true,
                    "...on Asset": { id: true },
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

            const asset = createAssets?.[0];

            if (asset.__typename === "Asset") {
              cb?.(asset);
              refetch?.();
              toast.success(t("toasts.success.upload"));
            } else {
              throw new Error();
            }
          } catch {
            toast.error(t("toasts.error.upload"));
          }
        };
        fileInput.click();
      }}
    >
      {!hideIcon && <ImageUp className="size-4" />}
      <span>{children}</span>
    </Button>
  );
};
