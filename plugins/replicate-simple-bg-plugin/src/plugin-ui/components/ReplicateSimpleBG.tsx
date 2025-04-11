import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormLabel,
  cn,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  useMutation,
  useLazyQuery,
  apiUploadClient,
  ScrollArea,
  Badge,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import { translationNS } from "../translation-ns";
import { startGenerateSimpleBgMutation } from "../graphql/mutations.js";
import {
  getPredictionSimpleBGIDQuery,
  getSimpleBgItemQuery,
  getSimpleBgPredictionsQuery,
} from "../graphql/queries.js";
import { PredictionSimpleBgStatus } from "../zeus/index.js";
import { z } from "zod";
import { $, SortOrder } from "@deenruv/admin-types";
import { ReplicatePredictionListType } from "../graphql/selectors.js";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CustomFileInput,
  LoadingMask,
  ReplicateSimpleBGOutput,
  getQueryParams,
} from "./ReplicateSimpleBGUtilities.js";
import { RoomTypeSelect } from "./RoomTypeSelect.js";
import { RoomThemeSelect } from "./RoomThemeSelect.js";
import { getStatusColor } from "../constants.js";
import { formSchema, useReplicateForm } from "../types.js";

const MAX_RETRIES = 200;
export const ReplicateSimpleBGInput = () => {
  const { t } = useTranslation(translationNS);
  const form = useReplicateForm();
  const { handleSubmit } = form;
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = getQueryParams(location.search);
  const replicateId = queryParams.replicateId;

  const previewRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const retryPredictionCountRef = useRef(0);

  const [items, setItems] = useState<
    Array<{ id: string; status: string; finishedAt?: string }>
  >([]);
  const [prediction, setPrediction] =
    useState<ReplicatePredictionListType["image"]>("");
  const [predictionID, setPredictionID] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [predictionEntityID, setPredictionEntityID] = useState<string | null>(
    null,
  );
  const [activePredictionId, setActivePredictionId] = useState<string | null>(
    replicateId || null,
  );
  const [loading, setLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(true);
  const [isPollingPrediction, setIsPollingPrediction] = useState(true);

  const [startGenerateSimpleBg] = useMutation(startGenerateSimpleBgMutation);

  const [getPredictionID] = useLazyQuery(getPredictionSimpleBGIDQuery);
  const [getReplicatePredictions] = useLazyQuery(getSimpleBgPredictionsQuery);
  const [getPredictionItem] = useLazyQuery(getSimpleBgItemQuery);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    form.setValue("file", file);
    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);
    previewRef.current = previewURL;
  };

  useEffect(() => {
    if (activePredictionId) {
      const newUrl = `${location.pathname}?replicateId=${activePredictionId}`;
      navigate(newUrl);
    }
  }, [activePredictionId, navigate, location.pathname]);

  useEffect(() => {
    if (replicateId && predictionID) {
      setActivePredictionId(replicateId);
      fetchPrediction(predictionID);
    }
  }, [prediction]);

  useEffect(() => {
    if (!predictionEntityID || !isPolling) return;

    intervalRef.current = setInterval(() => {
      if (retryCountRef.current >= MAX_RETRIES) {
        console.warn("Max retries reached. Stopping polling.");
        clearInterval(intervalRef.current as NodeJS.Timeout);
        setIsPolling(false);
        return;
      }
      getPredictionID({
        prediction_simple_bg_entity_id: predictionEntityID,
      })
        .then((response) => {
          if (response?.getSimpleBgID) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsPolling(false);
            setPredictionID(response.getSimpleBgID);
            setActivePredictionId(response.getSimpleBgID);
          } else {
            retryCountRef.current += 1;
          }
        })
        .catch((error) => {
          console.error("Error fetching prediction:", error);
          retryCountRef.current += 1;
        });
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [predictionEntityID, isPolling]);

  useEffect(() => {
    if (!predictionID || !isPollingPrediction) return;

    const interval = setInterval(() => {
      fetchPrediction(predictionID);
    }, 10000);

    return () => clearInterval(interval);
  }, [predictionID, isPollingPrediction]);

  function fetchList() {
    getReplicatePredictions({
      options: { sort: { finishedAt: SortOrder.DESC } },
    }).then((response) => {
      if (response?.getSimpleBgPredictions) {
        const predictions = response.getSimpleBgPredictions.items;
        setItems(
          predictions.map((item) => ({
            ...item,
            finishedAt: item.finishedAt ?? undefined,
          })),
        );

        const startingPredictions = predictions.filter(
          (item) => item.status === PredictionSimpleBgStatus.starting,
        );
        startingPredictions.forEach((prediction) => {
          getPredictionItem({
            id: prediction.id,
          }).then((response) => {
            if (response?.getSimpleBgItem) {
              fetchList();
              setActivePredictionId(prediction.id);
            }
          });
        });
      }
    });
  }

  useEffect(() => {
    fetchList();
  }, []);

  function fetchPrediction(predictionID: string) {
    if (!predictionID) return;
    setActivePredictionId(predictionID);

    getPredictionItem({
      id: predictionID,
    })
      .then((response) => {
        if (response?.getSimpleBgItem) {
          if (
            response.getSimpleBgItem.status ===
            PredictionSimpleBgStatus.succeeded
          ) {
            setPrediction(response.getSimpleBgItem.image);
            setLoading(false);
            setIsPollingPrediction(false);
          } else if (
            response.getSimpleBgItem.status === PredictionSimpleBgStatus.failed
          ) {
            setPrediction("");
            setLoading(false);
            setIsPollingPrediction(false);
          } else if (
            response.getSimpleBgItem.status ===
            PredictionSimpleBgStatus.starting
          ) {
            setPredictionID(predictionID);
            retryPredictionCountRef.current = 0;
          }
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching prediction:", error);
      });
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const file = data.file;

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

      setPredictionID(null);
      setPredictionEntityID(null);
      setIsPolling(true);
      retryCountRef.current = 0;
      retryPredictionCountRef.current = 0;
      setLoading(true);

      const response = await startGenerateSimpleBg({
        input: {
          assetId: asset.id,
          roomType: data.room_type_enum.value,
          roomStyle: data.room_style_enum.value,
        },
      });

      await setPredictionEntityID(response.startGenerateSimpleBg);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <div className="flex w-full flex-col gap-8 p-16">
        <div className="flex w-full justify-between gap-8">
          <Card className="w-full p-10">
            <CardHeader>
              <div className="flex w-full flex-row items-center justify-between">
                <CardTitle>{t("input")}</CardTitle>
                <Button onClick={handleSubmit((data) => onSubmit(data))}>
                  {t("run_model")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion
                type="single"
                collapsible
                defaultValue="image_upload"
                className="w-full p-10"
              >
                <div className="flex flex-col gap-2">
                  <div className="mt-2 flex flex-col gap-1">
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="w-full"
                    >
                      <AccordionItem value="image_upload">
                        <AccordionTrigger>
                          {t("upload_furniture_image")}
                        </AccordionTrigger>
                        <AccordionContent>
                          <FormControl>
                            <FormField
                              control={form.control}
                              name="file"
                              render={() => (
                                <CustomFileInput onChange={handleFileChange} />
                              )}
                            />
                          </FormControl>
                          {preview && (
                            <div className="mt-6">
                              <Card className="overflow-hidden">
                                <CardHeader className="p-4">
                                  <CardTitle className="text-sm">
                                    {t("original_room")}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                  <div className="relative aspect-square w-full">
                                    <img
                                      src={preview || "/placeholder.svg"}
                                      alt="Preview"
                                      className="size-full object-contain"
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </form>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="mt-2 flex flex-col gap-1">
                    <AccordionItem value="room_type_and_theme">
                      <AccordionTrigger>
                        {t("choose_room_type_and_theme")}
                      </AccordionTrigger>
                      <AccordionContent>
                        <FormLabel>{t("select_room_type")}</FormLabel>
                        <FormControl className="mt-6">
                          <RoomTypeSelect />
                        </FormControl>
                        <div className="mt-2">
                          <FormLabel>{t("select_room_theme")}</FormLabel>
                        </div>
                        <FormControl>
                          <RoomThemeSelect theme_preview={true} />
                        </FormControl>
                      </AccordionContent>
                    </AccordionItem>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="mt-2 flex flex-col gap-1">
                    <AccordionItem value="previous_predictions">
                      <AccordionTrigger>
                        {t("previous_predictions")}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ScrollArea className="h-96">
                          <div className="flex flex-col gap-3">
                            {items.map((item, index) => (
                              <Card
                                key={index}
                                className={cn(
                                  "border hover:border-primary transition-colors",
                                  activePredictionId === item.id
                                    ? "border-black border-2"
                                    : "",
                                )}
                                onClick={() => fetchPrediction(item.id)}
                              >
                                <CardContent className="py-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                      <div className="mt-1 flex items-center gap-2">
                                        <span className="max-w-[200px] truncate text-sm font-medium">
                                          #{item.id}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className={cn(
                                            "text-xs",
                                            getStatusColor(item.status),
                                          )}
                                        >
                                          {t(item.status)}
                                        </Badge>
                                        <span className="max-w-[200px] truncate text-sm font-medium">
                                          {item.finishedAt
                                            ? new Date(
                                                item.finishedAt as string,
                                              ).toLocaleString()
                                            : " "}
                                        </span>
                                      </div>
                                    </div>
                                    {item.status ===
                                      PredictionSimpleBgStatus.succeeded && (
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="size-8"
                                        onClick={() => fetchPrediction(item.id)}
                                        title={t("Fetch predictions")}
                                      >
                                        <ArrowRight className="size-4" />
                                      </Button>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      </AccordionContent>
                    </AccordionItem>
                  </div>
                </div>
              </Accordion>
            </CardContent>
          </Card>
          <Card className="w-full p-10">
            <CardHeader>
              <div className="flex flex-col items-start justify-between">
                <CardTitle>{t("output")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-6">
                <Card className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">
                      {t("generated_room")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative aspect-square w-full border border-dashed border-gray-300">
                      {loading ? (
                        <LoadingMask />
                      ) : (
                        <ReplicateSimpleBGOutput
                          image={prediction || "placeholder.svg"}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Form>
  );
};
