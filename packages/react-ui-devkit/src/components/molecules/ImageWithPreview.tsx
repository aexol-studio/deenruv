import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  useTranslation,
} from "@/index.js";
import { cn } from "@/lib/utils.js";
import { ImageOff } from "lucide-react";
import { Portal } from "@radix-ui/react-portal";
import React from "react";
interface Props extends Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  "className"
> {
  imageClassName?: string;
  previewClassName?: string;
}

export const ImageWithPreview: React.FC<Props> = ({
  imageClassName,
  previewClassName,
  src,
  ...props
}) => {
  const { t } = useTranslation("common");

  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer" asChild>
        {src ? (
          <img className={cn("size-14", imageClassName)} src={src} {...props} />
        ) : (
          <div
            className={cn(
              "flex size-14 items-center justify-center bg-gray-100",
              imageClassName,
            )}
          >
            <ImageOff />
          </div>
        )}
      </HoverCardTrigger>
      <Portal>
        <HoverCardContent
          className={cn("w-80 rounded border p-0", previewClassName)}
        >
          {src ? (
            <img className="object-cover" src={src} {...props} />
          ) : (
            <p className="m-3">{t("noImage")}</p>
          )}
        </HoverCardContent>
      </Portal>
    </HoverCard>
  );
};
