import * as React from "react";
import { ImageOff } from "lucide-react";

export type ImagePlaceholderProps = {
  size?: number;
};

const ImagePlaceholder = ({ size = 32 }: ImagePlaceholderProps) => {
  const dimension = `${size / 4}rem`;

  return (
    <div
      className="bg-muted flex items-center justify-center p-3"
      style={{ height: dimension, width: dimension }}
    >
      <ImageOff size={size * 2} />
    </div>
  );
};

export { ImagePlaceholder };
