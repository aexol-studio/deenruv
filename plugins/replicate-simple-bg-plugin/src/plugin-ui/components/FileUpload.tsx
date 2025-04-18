import React, { useCallback, useState } from "react";
import { X, Upload } from "lucide-react";
import { Button, cn } from "@deenruv/react-ui-devkit";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
  error?: string;
}

export function FileUpload({
  value,
  onChange,
  accept = { "image/*": [] },
  maxSize = 5 * 1024 * 1024,
  className,
  error,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        const file = acceptedFiles[0];
        onChange(file);

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple: false,
    });

  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    onChange(null);
  };

  // Show file rejection errors
  const fileRejectionError = fileRejections[0]?.errors[0]?.message;

  return (
    <div className="space-y-2">
      {!value && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20 hover:border-primary/50",
            className,
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium">
              {isDragActive
                ? "Drop the image here"
                : "Drag & drop an image here, or click to select"}
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPEG, PNG, WebP (Max {maxSize / (1024 * 1024)}
              MB)
            </p>
          </div>
        </div>
      )}

      {value && preview && (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
            onClick={removeFile}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {(error || fileRejectionError) && (
        <p className="text-sm text-destructive">
          {error || fileRejectionError}
        </p>
      )}
    </div>
  );
}
