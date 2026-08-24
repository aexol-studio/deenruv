import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Check, ChevronDown, CircleX } from "lucide-react";
import { apiClient } from "@/zeus_client/deenruvAPICall.js";
import { cn } from "@/lib/utils.js";
import React from "react";
import { toast } from "sonner";
import {
  AssetUploadButton,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  PaginationEllipsis,
  PaginationItem,
  ImageWithPreview,
  Skeleton,
} from "@/components";

import { assetsSelector, AssetType } from "@/selectors/AssetsSelector.js";
import {
  ASSETS_ITEMS_PER_PAGE,
  ASSETS_PER_PAGE,
  useAssets,
} from "@/hooks/useAssets.js";
import { useTranslation } from "@/hooks/useTranslation.js";
import {
  AssetDraftRequestGate,
  clampAssetPage,
  getAssetMetadata,
  getAssetPageItems,
  getAssetResultRange,
  RequestGenerationGate,
} from "./AssetsModalInput.helpers.js";

export interface AssetsModalChangeType {
  id: string;
  preview: string;
  source: string;
}

/**
 * A modal that allows the user to select an asset from a list of available assets.
 *
 * @param {AssetsModalChangeType} value - The currently selected asset.
 * @param {(value?: AssetsModalChangeType) => void} setValue - Callback invoked whenever the selected asset changes.
 */
export function AssetsModalInput({
  value,
  setValue,
}: {
  value?: { id: string; preview: string };
  setValue: (value?: { id: string; preview: string; source: string }) => void;
}) {
  const { t } = useTranslation("common");
  const [committedAsset, setCommittedAsset] = useState<AssetType>();
  const [draftAsset, setDraftAsset] = useState<AssetType>();
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<{ id: string; value: string }[]>([]);
  const openRef = useRef(false);
  const draftRequestGate = useRef(new AssetDraftRequestGate());
  const valueLookupGate = useRef(new RequestGenerationGate());
  const tagLookupGate = useRef(new RequestGenerationGate());
  const titleId = useId();
  const descriptionId = useId();
  const footerId = useId();
  const {
    assets,
    error,
    isPending,
    totalItems,
    page,
    perPage,
    searchTags,
    searchTerm,
    setPage,
    setPerPage,
    setSearchTags,
    setSearchTerm,
    totalPages,
    setSkip,
    refetchData,
  } = useAssets({ skip: true });

  useLayoutEffect(() => {
    const requestGeneration = valueLookupGate.current.begin();
    draftRequestGate.current.syncFromValue(openRef.current);
    setCommittedAsset(undefined);
    setDraftAsset(undefined);

    if (!value?.id) {
      return;
    }

    void apiClient("query")({
      assets: [
        { options: { take: 1, filter: { id: { eq: value.id as string } } } },
        { items: assetsSelector },
      ],
    })
      .then(({ assets }) => {
        if (!valueLookupGate.current.isCurrent(requestGeneration)) return;
        const asset = assets.items[0];
        setCommittedAsset(asset);
        if (draftRequestGate.current.canApplyValue(openRef.current)) {
          setDraftAsset(asset);
        }
      })
      .catch(() => {
        if (!valueLookupGate.current.isCurrent(requestGeneration)) return;
        setCommittedAsset(undefined);
        if (draftRequestGate.current.canApplyValue(openRef.current)) {
          setDraftAsset(undefined);
        }
        toast.error(t("toasts.error.fetch"));
      });

    return () => valueLookupGate.current.invalidate();
  }, [t, value?.id]);

  useEffect(() => {
    const requestGeneration = tagLookupGate.current.begin();
    void apiClient("query")({
      tags: [{}, { items: { id: true, value: true } }],
    })
      .then(({ tags }) => {
        if (tagLookupGate.current.isCurrent(requestGeneration)) {
          setTags(tags.items);
        }
      })
      .catch(() => {
        if (tagLookupGate.current.isCurrent(requestGeneration)) {
          toast.error(t("toasts.error.fetch"));
        }
      });

    return () => tagLookupGate.current.invalidate();
  }, [t]);

  const pagesToShow = useMemo(
    () => getAssetPageItems(page, totalPages),
    [page, totalPages],
  );
  const resultRange = useMemo(
    () => getAssetResultRange(page, perPage, totalItems),
    [page, perPage, totalItems],
  );

  const handleUploadedAsset = useCallback(
    (asset: { id: string }) => {
      const uploadGeneration = draftRequestGate.current.beginUpload();
      setPage(1);
      void apiClient("query")({
        assets: [
          { options: { take: 1, filter: { id: { eq: asset.id } } } },
          { items: assetsSelector },
        ],
      })
        .then(({ assets }) => {
          if (
            !draftRequestGate.current.canApplyUpload(
              uploadGeneration,
              openRef.current,
            )
          ) {
            return;
          }
          const uploadedAsset = assets.items[0];
          if (uploadedAsset) {
            setDraftAsset(uploadedAsset);
          }
        })
        .catch(() => {
          if (
            draftRequestGate.current.canApplyUpload(
              uploadGeneration,
              openRef.current,
            )
          ) {
            toast.error(t("toasts.error.fetch"));
          }
        });

      return {};
    },
    [setPage, t],
  );

  useEffect(
    () => () => {
      openRef.current = false;
      draftRequestGate.current.close();
      valueLookupGate.current.invalidate();
      tagLookupGate.current.invalidate();
    },
    [],
  );

  const handleOpenChange = (nextOpen: boolean) => {
    openRef.current = nextOpen;
    setSkip(!nextOpen);
    if (nextOpen) {
      draftRequestGate.current.open();
      setDraftAsset(
        committedAsset?.id === value?.id ? committedAsset : undefined,
      );
    } else {
      draftRequestGate.current.close();
      setDraftAsset(undefined);
    }
    setOpen(nextOpen);
  };

  const handleManualAssetSelection = (asset: AssetType) => {
    draftRequestGate.current.manualSelection();
    setDraftAsset((current) => (current?.id === asset.id ? undefined : asset));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          {t("asset.dialogButton")}
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        className="grid max-h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] max-w-6xl grid-rows-[auto_minmax(0,1fr)_auto] gap-3 overflow-hidden p-4 sm:max-h-[90vh] sm:p-5"
      >
        <DialogHeader>
          <DialogTitle id={titleId}>{t("asset.dialogTitle")}</DialogTitle>
          <DialogDescription id={descriptionId}>
            {t("asset.pickerDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 w-full flex-col gap-3">
          <div className="flex flex-wrap items-end gap-2">
            <div className="w-80 max-w-full">
              <Label className="sr-only" htmlFor={`${titleId}-search`}>
                {t("asset.searchLabel")}
              </Label>
              <Input
                id={`${titleId}-search`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                placeholder={t("asset.dialogSearchPlaceholder")}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {t("search.addFilter")}{" "}
                    <ChevronDown className="ml-2 size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="max-h-[400px] overflow-y-auto"
                >
                  {tags
                    .filter((i) => !searchTags.some((a) => a === i.value))
                    .map((i) => (
                      <DropdownMenuItem
                        key={i.id}
                        onClick={() => setSearchTags((p) => [...p, i.value])}
                      >
                        {i.value}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {searchTags.map((i) => (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setSearchTags((p) => p.filter((a) => a !== i))}
                  aria-label={t("asset.removeTag", { value: i })}
                  key={i}
                >
                  {i}
                  <CircleX className="ml-1 size-3.5" aria-hidden="true" />
                </Button>
              ))}
            </div>
            <AssetUploadButton
              cb={handleUploadedAsset}
              refetch={() => {
                void refetchData();
              }}
              buttonProps={{
                className: "shrink-0",
                size: "default",
                variant: "outline",
              }}
            >
              {t("asset.uploadButton")}
            </AssetUploadButton>
          </div>
          <div className="min-h-0 w-full flex-1 overflow-y-auto pr-1">
            {isPending ? (
              <div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                role="status"
                aria-label={t("asset.loading")}
              >
                {Array.from({ length: 12 }).map((_, index) => (
                  <Skeleton className="aspect-square rounded-md" key={index} />
                ))}
              </div>
            ) : error ? (
              <div
                className="flex min-h-48 items-center justify-center text-center"
                role="alert"
              >
                <p className="text-sm text-destructive">
                  {t("asset.fetchError")}
                </p>
              </div>
            ) : assets.length === 0 ? (
              <div className="flex min-h-48 items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">
                  {t("asset.noImages")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {assets.map((asset) => {
                  const metadata = getAssetMetadata(asset);
                  const selected = draftAsset?.id === asset.id;
                  const metadataId = `${titleId}-asset-${asset.id}`;
                  return (
                    <button
                      type="button"
                      key={asset.id}
                      aria-pressed={selected}
                      aria-describedby={metadataId}
                      className={cn(
                        "group relative flex aspect-square min-w-0 flex-col overflow-hidden rounded-md border bg-card text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        selected
                          ? "border-primary ring-2 ring-primary"
                          : "hover:border-primary/60",
                      )}
                      onClick={() => handleManualAssetSelection(asset)}
                    >
                      {selected ? (
                        <span
                          className="absolute right-2 top-2 z-10 inline-flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
                          title={t("asset.selected")}
                        >
                          <Check className="size-4" aria-hidden="true" />
                          <span className="sr-only">{t("asset.selected")}</span>
                        </span>
                      ) : null}
                      <div className="min-h-0 flex-1 overflow-hidden bg-muted">
                        <ImageWithPreview
                          imageClassName="size-full object-cover transition-transform group-hover:scale-[1.02]"
                          src={asset.preview}
                          alt={asset.name}
                        />
                      </div>
                      <div className="w-full shrink-0 space-y-1 border-t p-2">
                        <div
                          className="truncate text-xs font-medium"
                          title={asset.name}
                        >
                          {asset.name}
                        </div>
                        <div
                          id={metadataId}
                          className="truncate text-[10px] text-muted-foreground"
                          title={metadata.join(" · ")}
                        >
                          {metadata.join(" · ")}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <DialogFooter
          id={footerId}
          aria-label={t("asset.actionsLabel")}
          className="min-w-0 flex-col gap-3 overflow-hidden border-t pt-3 sm:flex-row sm:items-center sm:justify-between sm:space-x-0"
        >
          <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto">
            <div className="m-auto whitespace-nowrap text-center">
              {t("asset.resultRange", {
                from: resultRange.from,
                to: resultRange.to,
                total: totalItems,
              })}
            </div>
            <Select
              value={perPage.toString()}
              onValueChange={(e) => setPerPage(parseInt(e) as ASSETS_PER_PAGE)}
            >
              <SelectTrigger className="w-full min-w-0 sm:w-[180px]">
                <SelectValue placeholder={t("perPagePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {ASSETS_ITEMS_PER_PAGE.map((i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {t("asset.perPageValue", { value: i })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <nav
              className="max-w-full overflow-x-auto"
              aria-label={t("asset.paginationLabel")}
            >
              <ul className="flex w-max items-center gap-1">
                <PaginationItem>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={page <= 1 || totalPages === 0}
                    aria-disabled={page <= 1 || totalPages === 0}
                    aria-label={t("previous")}
                    onClick={() =>
                      setPage((current) =>
                        clampAssetPage(current - 1, totalPages),
                      )
                    }
                  >
                    ‹
                  </Button>
                </PaginationItem>
                {pagesToShow.map((i, index) => (
                  <PaginationItem key={`${i}-${index}`}>
                    {i === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <Button
                        type="button"
                        variant={i === page ? "default" : "outline"}
                        size="icon"
                        aria-current={i === page ? "page" : undefined}
                        onClick={() => setPage(i)}
                      >
                        {i}
                      </Button>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={totalPages === 0 || page >= totalPages}
                    aria-disabled={totalPages === 0 || page >= totalPages}
                    aria-label={t("next")}
                    onClick={() =>
                      setPage((current) =>
                        clampAssetPage(current + 1, totalPages),
                      )
                    }
                  >
                    ›
                  </Button>
                </PaginationItem>
              </ul>
            </nav>
          </div>
          <div className="flex w-full flex-wrap justify-end gap-2 sm:w-auto">
            <DialogClose asChild>
              <Button variant="ghost">{t("asset.cancel")}</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                disabled={!draftAsset}
                onClick={() => {
                  if (draftAsset) setValue(draftAsset);
                }}
              >
                {t("asset.confirmButton")}
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
