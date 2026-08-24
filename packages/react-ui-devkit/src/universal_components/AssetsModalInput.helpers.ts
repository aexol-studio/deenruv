export type AssetPageItem = number | "ellipsis";

export class RequestGenerationGate {
  private generation = 0;

  begin() {
    this.generation += 1;
    return this.generation;
  }

  invalidate() {
    this.generation += 1;
  }

  isCurrent(generation: number) {
    return generation === this.generation;
  }
}

export class AssetDraftRequestGate {
  private mode: "closed" | "sync" | "manual" | "upload" = "closed";
  private uploadGate = new RequestGenerationGate();

  syncFromValue(open: boolean) {
    this.uploadGate.invalidate();
    this.mode = open ? "sync" : "closed";
  }

  open() {
    this.uploadGate.invalidate();
    this.mode = "sync";
  }

  close() {
    this.uploadGate.invalidate();
    this.mode = "closed";
  }

  manualSelection() {
    this.uploadGate.invalidate();
    this.mode = "manual";
  }

  beginUpload() {
    this.mode = "upload";
    return this.uploadGate.begin();
  }

  canApplyValue(open: boolean) {
    return open && this.mode === "sync";
  }

  canApplyUpload(generation: number, open: boolean) {
    return (
      open && this.mode === "upload" && this.uploadGate.isCurrent(generation)
    );
  }
}

export const clampAssetPage = (page: number, totalPages: number) =>
  totalPages === 0 ? 1 : Math.min(Math.max(page, 1), totalPages);

export const getAssetResultRange = (
  page: number,
  perPage: number,
  totalItems: number,
) => {
  if (totalItems === 0) return { from: 0, to: 0 };

  const totalPages = Math.ceil(totalItems / perPage);
  const clampedPage = clampAssetPage(page, totalPages);
  return {
    from: (clampedPage - 1) * perPage + 1,
    to: Math.min(clampedPage * perPage, totalItems),
  };
};

const range = (start: number, stop: number) =>
  Array.from(
    { length: Math.max(0, stop - start + 1) },
    (_, index) => start + index,
  );

export const getAssetPageItems = (
  page: number,
  totalPages: number,
): AssetPageItem[] => {
  if (totalPages === 0) return [];
  const currentPage = clampAssetPage(page, totalPages);

  if (totalPages <= 7) return range(1, totalPages);
  if (currentPage < 4) return [...range(1, 5), "ellipsis", totalPages];
  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", ...range(totalPages - 4, totalPages)];
  }
  return [
    1,
    "ellipsis",
    ...range(currentPage - 1, currentPage + 1),
    "ellipsis",
    totalPages,
  ];
};

export const formatAssetFileSize = (bytes?: number | null) => {
  if (bytes === undefined || bytes === null || bytes < 0) return undefined;
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
};

export const getAssetMetadata = (asset: {
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  fileSize?: number | null;
}) =>
  [
    asset.mimeType || undefined,
    asset.width && asset.height ? `${asset.width}×${asset.height}` : undefined,
    formatAssetFileSize(asset.fileSize),
  ].filter((value): value is string => Boolean(value));
