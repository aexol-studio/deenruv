import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  Button,
  useDetailView,
  useMutation,
  Dialog,
  useTranslation,
  CardContent,
  cn,
  useQuery,
  DialogContent,
  DialogHeader,
  DialogTitle,
  LoadingMask,
  CardTitle,
  useLazyQuery,
  Textarea,
} from "@deenruv/react-ui-devkit";
import { translationNS } from "../translation-ns";
import {
  getPredictionAssetMutation,
  startGenerateSimpleBgMutation,
} from "../graphql/mutations.js";
import { ChevronDown, Image, Loader2 } from "lucide-react";
import {
  getPredictionSimpleBGIDQuery,
  getSimpleBgItemQuery,
  getSimpleBgRoomOptions,
} from "../graphql/queries.js";
import { toast } from "sonner";
import { RoomStyleSelect } from "../components/RoomStyleSelect.js";
import { RoomTypeSelect } from "../components/RoomTypeSelect.js";

export const ReplicateProductSidebar: React.FC = () => {
  const { t } = useTranslation(translationNS);
  const {
    id: productId,
    entity,
    markAsDirty,
    form: {
      base: { state, setField },
    },
  } = useDetailView("products-detail-view");
  const [form, setForm] = useState<{
    roomType?: string;
    roomStyle?: string;
    prompt: string | null;
  }>({ roomType: undefined, roomStyle: undefined, prompt: null });
  const { data } = useQuery(getSimpleBgRoomOptions);
  const [
    getPredictionItem,
    { data: predictionItem, setData: setPredictionItem },
  ] = useLazyQuery(getSimpleBgItemQuery);
  const [getPredictionID] = useLazyQuery(getPredictionSimpleBGIDQuery);
  const [getPredictionAsset] = useMutation(getPredictionAssetMutation);
  const [startGenerateSimpleBg, { loading: gettingInitialID }] = useMutation(
    startGenerateSimpleBgMutation,
  );
  const [predictionEntityID, setPredictionEntityID] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const contentRef = useRef<HTMLDivElement>(null);
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
      setIsDialogVisible(true);
      setLoading(false);
    }
  }, [predictionItem?.getSimpleBgItem.status]);

  const handleClose = () => {
    if (loading) {
      toast.error(t("error.loading"));
      return;
    }
    setIsDialogVisible(false);
    setPredictionEntityID(null);
    setForm({ roomType: undefined, roomStyle: undefined, prompt: null });
  };

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, contentRef.current, data?.getSimpleBgOptions]);

  const runModel = async () => {
    const assetId = entity?.featuredAsset?.id;

    if (assetId) {
      const { roomStyle, roomType, prompt } = form;
      const response = await startGenerateSimpleBg({
        input: { assetId, roomType, roomStyle, prompt },
      });
      const id = response.startGenerateSimpleBg;
      if (!id) {
        toast.error(t("error.start_model_run"));
        return;
      }
      setPredictionEntityID(id);
    }
  };

  const assignPredictionToProduct = async () => {
    if (!productId || !predictionEntityID) return;
    const asset = await getPredictionAsset({
      input: { predictionId: predictionEntityID, productId: productId },
    });
    if (!asset || !entity) return;
    const newAsset = asset.getPredictionAsset;
    if (state.assetIds?.value) {
      setField("assetIds", [...state.assetIds.value, newAsset.id]);
    }
    markAsDirty();
    setIsDialogVisible(false);
    setPredictionEntityID(null);
    setForm({ roomType: undefined, roomStyle: undefined, prompt: null });
    setLoading(false);
    toast.success(t("success.asset_assigned"));
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <Card className="overflow-hidden rounded-lg border bg-card border-l-orange-200 duration-200 hover:shadow h-full border-l-4">
          <CardHeader
            className="p-4 flex flex-row items-center justify-between cursor-pointer select-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-white/70" />
              <span className="font-semibold tracking-tight text-lg">
                {t("generate_new_background")}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-white/70 transition-transform duration-300 ease-in-out",
                isOpen && "transform -rotate-180",
              )}
            />
          </CardHeader>

          <div
            ref={contentRef}
            style={{ height: height !== undefined ? `${height}px` : undefined }}
            className={cn(
              "transition-all duration-300 ease-in-out p-2",
              !isOpen && "opacity-0",
            )}
          >
            <CardContent className="pt-0 pb-4 px-4">
              <div className="flex flex-col gap-4">
                <RoomStyleSelect
                  selectedValue={form.roomStyle}
                  roomThemes={data?.getSimpleBgOptions.roomThemes}
                  onSelect={(value: string) =>
                    setForm((prev) => ({
                      ...prev,
                      roomStyle: value,
                    }))
                  }
                />
                <RoomTypeSelect
                  roomTypes={data?.getSimpleBgOptions.roomTypes}
                  selectedValue={form.roomType}
                  onValueChange={(newValue) => {
                    setForm((prev) => ({
                      ...prev,
                      roomType: newValue,
                    }));
                  }}
                />

                <Button
                  className="mt-2 relative"
                  disabled={
                    (!form.roomType || !form.roomStyle || loading) &&
                    !isDialogVisible
                  }
                  onClick={runModel}
                >
                  <span
                    className={cn("transition-opacity", loading && "opacity-0")}
                  >
                    {t("run_model")}
                  </span>
                  {loading && (
                    <div className="absolute inset-0 flex items-center gap-2 justify-center">
                      <Loader2
                        className="animate-spin"
                        size={16}
                        strokeWidth={2}
                      />
                      <span>{t("generating_asset")}</span>
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
      <Dialog open={isDialogVisible} onOpenChange={handleClose}>
        <DialogContent
          className="w-full lg:max-w-[900px] xl:max-w-[1100px] h-[600px] grid-rows-[auto_1fr_auto]"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{t("modal.title")}</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full relative grid md:grid-cols-[1fr_auto] gap-2">
            <div className="flex flex-col gap-2 h-full">
              <div className="relative w-full min-h-[300px] grow overflow-hidden rounded-lg">
                {predictionItem?.getSimpleBgItem.image ? (
                  <img
                    className="absolute inset-0 w-full h-full object-contain rounded-md"
                    src={predictionItem?.getSimpleBgItem.image}
                    alt="Generated Room"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-[300px]">
              <Card className="w-full h-full flex-col flex justify-between">
                <div className="flex flex-col gap-2 h-full">
                  <CardHeader>
                    <CardTitle>{t("prediction_details")}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-2 h-full">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold">
                          {t("room_type")}:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t(
                            form.roomType?.toLowerCase() ||
                              predictionItem?.getSimpleBgItem.roomType ||
                              "",
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold">
                          {t("room_style")}:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t(
                            form.roomStyle?.toLowerCase() ||
                              predictionItem?.getSimpleBgItem.roomStyle ||
                              "",
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold">{t("status")}:</p>
                        <p className="text-sm text-muted-foreground">
                          {t(
                            form.roomType?.toLowerCase() ||
                              predictionItem?.getSimpleBgItem.status ||
                              "",
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold">{t("prompt")}:</p>
                        <Textarea
                          className="w-full h-24 resize-none"
                          value={form.prompt || ""}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              prompt: e.target.value,
                            }))
                          }
                          placeholder={t("modal.prompt_placeholder")}
                          disabled={loading}
                        />
                      </div>
                      <div className="w-full h-full flex flex-col justify-end">
                        <Button
                          variant="secondary"
                          onClick={async () => {
                            setPredictionEntityID(null);
                            setPredictionItem(null);
                            await runModel();
                          }}
                          disabled={loading || gettingInitialID}
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <Loader2
                                className="animate-spin"
                                size={16}
                                strokeWidth={2}
                              />
                              {t("generating_asset")}
                            </div>
                          ) : (
                            t("modal.run_model_again")
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
              <div className="flex justify-end">
                <Button
                  onClick={assignPredictionToProduct}
                  disabled={!predictionItem?.getSimpleBgItem.image}
                >
                  {t("modal.assign_prediction_to_product")}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
