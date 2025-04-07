import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

export type ImagePlaceholderProps = {
  size?: number;
};

const ImagePlaceholder = ({ size = 32 }: ImagePlaceholderProps) => {
  return (
    <div
      className={`bg-muted h- flex items-center justify-center p-3${size} w-${size}`}
    >
      <ImageOff size={size * 2} />
    </div>
  );
};

export { ImagePlaceholder };
