"use client";

import {
  apiClient,
  apiUploadClient,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  DialogProductPicker,
  Label,
  PageBlock,
  ScrollArea,
  useLazyQuery,
  useMutation,
  useQuery,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import { useEffect, useMemo, useRef, useState } from "react";
import { translationNS } from "../translation-ns.js";
import {
  getPredictionSimpleBGIDQuery,
  getSimpleBgItemQuery,
  getSimpleBgPredictionsQuery,
  getSimpleBgRoomOptions,
} from "../graphql/queries.js";
import { SortOrder } from "../zeus/index.js";

import React from "react";
import { FileUpload } from "../components/FileUpload.js";
import { ReplicateSimpleBgEntityListType } from "../graphql/selectors.js";
import {
  getPredictionAssetMutation,
  startGenerateSimpleBgMutation,
} from "../graphql/mutations.js";
import { $ } from "@deenruv/admin-types";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { RoomStyleSelect } from "../components/RoomStyleSelect.js";
import { RoomTypeSelect } from "../components/RoomTypeSelect.js";

type UploadState = {
  file: File | null;
  room_type_enum?: string;
  room_style_enum?: string;
};

export const ReplicatePage = () => {
  const { t } = useTranslation(translationNS);

  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    room_style_enum: undefined,
    room_type_enum: undefined,
  });

  const { data } = useQuery(getSimpleBgRoomOptions);

  const [getPredictionID] = useLazyQuery(getPredictionSimpleBGIDQuery);

  const [searchParams, setSearchParams] = useSearchParams();
  const predictionEntityID = searchParams.get("predictionId");

  const [getPredictionItem, { data: predictionItem }] =
    useLazyQuery(getSimpleBgItemQuery);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [startGenerateSimpleBg] = useMutation(startGenerateSimpleBgMutation);

  const [predictions, setPredictions] =
    useState<ReplicateSimpleBgEntityListType["items"]>();
  const [getReplicatePredictions, { loading: loadingPredictions }] =
    useLazyQuery(getSimpleBgPredictionsQuery);
  const [getPredictionAsset] = useMutation(getPredictionAssetMutation);
  const [page, setPage] = useState(1);
  const [filters] = useState({
    sort: { finishedAt: SortOrder.DESC },
    filter: { status: { eq: "succeeded" } },
  });

  useEffect(() => {
    getReplicatePredictions({
      options: {
        ...filters,
        take: page * 10,
        skip: (page - 1) * 10,
      },
    }).then((res) => {
      setPredictions((prev) =>
        [...(prev || []), ...res.getSimpleBgPredictions.items].filter(
          (p, i, a) => a.findIndex((t) => t.id === p.id) === i,
        ),
      );
    });
  }, []);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (
      predictionEntityID &&
      predictionItem?.getSimpleBgItem.status !== "succeeded"
    ) {
      setLoading(true);
      intervalRef.current = setInterval(() => {
        getPredictionID({
          prediction_simple_bg_entity_id: predictionEntityID,
        }).then((res) => {
          const predictionID = res.getSimpleBgID;
          if (predictionID) {
            getPredictionItem({ id: predictionID });
          }
        });
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [predictionEntityID]);

  useEffect(() => {
    if (
      predictionItem?.getSimpleBgItem.status === "succeeded" &&
      intervalRef.current
    ) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setLoading(false);
      setPage(1);
      getReplicatePredictions({
        options: { ...filters, take: 10, skip: 0 },
      }).then((res) => {
        setPredictions(res.getSimpleBgPredictions.items);
      });
    }
  }, [predictionItem?.getSimpleBgItem.status]);

  const getReplicateItem = async (id: string) => {
    const scrollToElement = document.getElementById("scrollto");
    if (scrollToElement) {
      scrollToElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    await getPredictionItem({ id });
  };

  const generateSimpleBg = async () => {
    try {
      const { file, room_style_enum, room_type_enum } = uploadState;
      switch (true) {
        case !room_style_enum: {
          toast.error(t("no_room_style"));
          break;
        }
        case !room_type_enum: {
          toast.error(t("no_room_type"));
          break;
        }
        case !file: {
          toast.error(t("no_file"));
          break;
        }
        default: {
          setUploadLoading(true);
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
          const asset = createAssets[0];
          if (!asset || asset.__typename !== "Asset")
            throw new Error("Cannot upload image");
          const response = await startGenerateSimpleBg({
            input: {
              assetId: asset.id,
              roomStyle: room_style_enum,
              roomType: room_type_enum,
            },
          });
          setSearchParams({ predictionId: response.startGenerateSimpleBg });
        }
      }
    } catch {
    } finally {
      setUploadLoading(false);
    }
  };
  const uploadButtonDisabled = useMemo(
    () =>
      !uploadState.file ||
      !uploadState.room_style_enum ||
      !uploadState.room_type_enum,
    [uploadState.file, uploadState.room_style_enum, uploadState.room_type_enum],
  );
  return (
    <PageBlock>
      <div className="flex justify-between gap-4">
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle>{t("input")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <RoomTypeSelect
                roomTypes={data?.getSimpleBgOptions.roomTypes}
                selectedValue={uploadState.room_type_enum}
                onValueChange={(newValue) =>
                  setUploadState((prev) => ({
                    ...prev,
                    room_type_enum: newValue,
                  }))
                }
              />
              <RoomStyleSelect
                selectedValue={uploadState.room_style_enum}
                roomThemes={data?.getSimpleBgOptions.roomThemes}
                onSelect={(value: string) =>
                  setUploadState((prev) => ({
                    ...prev,
                    room_style_enum: value,
                  }))
                }
              />
              <div>
                <Label className="block text-sm font-medium mb-2">
                  {t("upload_image")}
                </Label>
                <FileUpload
                  value={uploadState.file}
                  onChange={(file) => {
                    setUploadState((prev) => ({
                      ...prev,
                      file,
                    }));
                  }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end items-center w-full">
            <Button
              className="relative"
              type="button"
              onClick={generateSimpleBg}
              disabled={uploadButtonDisabled || uploadLoading || loading}
            >
              <span
                className={cn(
                  "transition-opacity",
                  uploadLoading && "opacity-0",
                )}
              >
                {t("run_model")}
              </span>
              {uploadLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="animate-spin" size={16} strokeWidth={2} />
                </div>
              )}
            </Button>
          </CardFooter>
        </Card>
        <Card className="w-full h-[500px]">
          <CardHeader>
            <div className="flex w-full flex-row items-center justify-between">
              <CardTitle>{t("previous_predictions")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-4" id="scrollable">
              {predictions?.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">{t("no_predictions")}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {predictions?.map((prediction) => (
                    <Card
                      key={prediction.id}
                      className={cn(
                        "flex items-center justify-between p-2 cursor-pointer",
                        predictionItem?.getSimpleBgItem.id === prediction.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary hover:text-secondary-foreground",
                        loading ? "pointer-events-none" : "",
                      )}
                      onClick={async () => {
                        if (loading) return;
                        await getReplicateItem(prediction.id);
                      }}
                    >
                      {prediction.id} - {prediction.status} -{" "}
                      {prediction.finishedAt}
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-end items-center w-full">
            <Button
              type="button"
              disabled={loadingPredictions || loading}
              onClick={() => {
                setPage((prev) => prev + 1);
                getReplicatePredictions({
                  options: {
                    ...filters,
                    take: page * 10,
                    skip: (page - 1) * 10,
                  },
                }).then((res) => {
                  const scrollableElement =
                    document.getElementById("scrollable");
                  if (scrollableElement) {
                    scrollableElement.scrollTop = 0;
                  }
                  setPredictions((prev) =>
                    [
                      ...(prev || []),
                      ...res.getSimpleBgPredictions.items,
                    ].filter(
                      (p, i, a) => a.findIndex((t) => t.id === p.id) === i,
                    ),
                  );
                });
              }}
            >
              {t("refresh")}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="w-full mt-4">
        <CardHeader>
          <div className="flex w-full flex-row items-center justify-between">
            <CardTitle>{t("output")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-2 items-center justify-center h-[350px] w-full">
              <Loader2
                className="animate-spin text-primary"
                size={24}
                strokeWidth={2}
              />
              <p className="text-muted-foreground">{t("loading")}</p>
            </div>
          ) : predictionItem?.getSimpleBgItem?.image ? (
            <div className="h-[450px] w-full flex justify-between items-start gap-8">
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                <img
                  className="absolute inset-0 w-full h-full object-cover rounded-md"
                  src={
                    predictionItem.getSimpleBgItem.image || "/placeholder.svg"
                  }
                  alt="Generated Room"
                />
              </div>
              <Card className="w-full h-full flex-col flex justify-between">
                <div className="flex flex-col gap-2">
                  <CardHeader>
                    <CardTitle>{t("prediction_details")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {predictionItem.getSimpleBgItem.roomType && (
                      <div>
                        <p className="text-sm font-semibold">
                          {t("room_type")}:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {predictionItem.getSimpleBgItem.roomType}
                        </p>
                      </div>
                    )}
                    {predictionItem.getSimpleBgItem.roomStyle && (
                      <div>
                        <p className="text-sm font-semibold">
                          {t("room_style")}:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {predictionItem.getSimpleBgItem.roomStyle}
                        </p>
                      </div>
                    )}
                    {predictionItem.getSimpleBgItem.status && (
                      <div>
                        <p className="text-sm font-semibold">{t("status")}:</p>
                        <p className="text-sm text-muted-foreground">
                          {predictionItem.getSimpleBgItem.status}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </div>
                <CardFooter>
                  <DialogProductPicker
                    initialValue={""}
                    mode="product"
                    onSubmit={async ({ productId }) => {
                      const response = await apiClient("query")({
                        product: [{ id: productId }, { assets: { id: true } }],
                      });
                      const asset = await getPredictionAsset({
                        input: {
                          predictionId: predictionEntityID ?? "",
                          productId,
                        },
                      });
                      const assetIds = response.product?.assets
                        .map((asset) => asset.id)
                        .concat(asset.getPredictionAsset.id);
                      const { updateProduct } = await apiClient("mutation")({
                        updateProduct: [
                          { input: { id: productId, assetIds } },
                          { id: true },
                        ],
                      });
                      // toast(
                      //   <div className="flex gap-2 items-center">
                      //     <p className="text-sm font-semibold">
                      //       {t("prediction_assigned")}
                      //     </p>
                      //     <Link to={Routes.products.to(updateProduct.id)}>
                      //       {t("view_product")}
                      //     </Link>
                      //   </div>,
                      // );
                    }}
                  />
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[350px]">
              <p className="text-muted-foreground">{t("no_output")}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <div id="scrollto" className="h-[50px]" />
    </PageBlock>
  );
};
