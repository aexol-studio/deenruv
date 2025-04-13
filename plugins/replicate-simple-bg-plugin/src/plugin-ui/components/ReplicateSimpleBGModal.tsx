import {
  DialogContent,
  useLazyQuery,
  useMutation,
  Button,
  DialogTitle,
  useTranslation,
  Input,
  useDetailView,
  DialogFooter,
  DialogHeader,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@deenruv/react-ui-devkit";
import {
  assignPredictionToProductMutation,
  startGenerateSimpleBgMutation,
} from "../graphql/mutations.js";
import {
  getPredictionSimpleBGIDQuery,
  getSimpleBgItemQuery,
} from "../graphql/queries.js";
import React, { useState, useEffect, useRef } from "react";
import { translationNS } from "../translation-ns.js";
import { ReplicatePredictionListType } from "../graphql/selectors.js";
import { PredictionSimpleBgStatus } from "../zeus/index.js";
import { LoadingMask } from "./ReplicateSimpleBGUtilities.js";

interface PredictionModalProps {
  onClose: () => void;
  initPredictionEntityID: string;
}
const MAX_RETRIES = 200;
export const ReplicateSimpleBGModal: React.FC<PredictionModalProps> = ({
  onClose,
  initPredictionEntityID,
}) => {
  const { t } = useTranslation(translationNS);
  const {
    id: productId,
    entity,
    markAsDirty,
    form: {
      base: { state, setField },
    },
  } = useDetailView("products-detail-view");
  const [startGenerateSimpleBg] = useMutation(startGenerateSimpleBgMutation);
  const [roomType, setRoomType] = useState<string | null>(null);
  const [roomStyle, setRoomStyle] = useState<string | null>(null);
  const [predictionEntityID, setPredictionEntityID] = useState<string>(
    initPredictionEntityID,
  );
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] =
    useState<ReplicatePredictionListType["image"]>("");

  const [getPredictionID] = useLazyQuery(getPredictionSimpleBGIDQuery);
  const [getPredictionItem] = useLazyQuery(getSimpleBgItemQuery);
  const [assignPredictionToProduct] = useMutation(
    assignPredictionToProductMutation,
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    if (!predictionEntityID || !loading) return;

    setLoading(true);
    intervalRef.current = setInterval(() => {
      if (retryCountRef.current >= MAX_RETRIES) {
        console.warn("Max retries reached. Stopping polling.");
        clearInterval(intervalRef.current as NodeJS.Timeout);
        setLoading(false);
        return;
      }

      getPredictionID({
        prediction_simple_bg_entity_id: predictionEntityID,
      })
        .then((response) => {
          if (response?.getSimpleBgID) {
            fetchPrediction(response.getSimpleBgID);
          } else {
            retryCountRef.current += 1;
          }
        })
        .catch((error) => {
          console.error("Error fetching prediction ID:", error);
          retryCountRef.current += 1;
        });
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [predictionEntityID, loading]);

  const fetchPrediction = (predictionID: string) => {
    getPredictionItem({ id: predictionID })
      .then((response) => {
        if (response?.getSimpleBgItem) {
          const status = response.getSimpleBgItem.status;
          if (status === PredictionSimpleBgStatus.succeeded) {
            setPrediction(response.getSimpleBgItem.image);
            setRoomStyle(response.getSimpleBgItem.roomStyle ?? null);
            setRoomType(response.getSimpleBgItem.roomType ?? null);
            setLoading(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
          } else if (status === PredictionSimpleBgStatus.failed) {
            console.error("Prediction failed.");
            setLoading(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching prediction:", error);
      });
  };

  const assignPredictionInToProduct = async () => {
    if (!productId || !predictionEntityID) return;
    const asset = await assignPredictionToProduct({
      input: {
        predictionId: predictionEntityID ?? "",
        productId: productId,
      },
    });
    if (!asset || !entity) return;
    const newAsset = asset.assignPredictionToProduct;
    if (state.assetIds?.value) {
      setField("assetIds", [...state.assetIds.value, newAsset.id]);
    }
    markAsDirty();
    onClose();
    setPredictionEntityID("");
    setLoading(false);
  };

  const onSubmit = async () => {
    const assetId = entity?.featuredAsset?.id;
    setLoading(true);

    if (!assetId) return;
    const response = await startGenerateSimpleBg({
      input: {
        assetId: assetId,
        roomType: roomType,
        roomStyle: roomStyle,
        prompt: prompt,
      },
    });
    const predictionEntityId = response.startGenerateSimpleBg;
    if (!predictionEntityId) return;
    setPredictionEntityID(predictionEntityId);
  };

  return (
    <DialogContent className="w-full lg:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>{t("modal.title")}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col">
        <div className="border rounded-md p-4 mb-4 flex flex-col">
          <div className="flex-grow mb-4 max-h-[600px] overflow-hidden">
            {loading ? (
              <LoadingMask />
            ) : (
              <div className="w-full h-full flex gap-4 justify-between items-start">
                <div className="w-2/3 relative h-[350px]">
                  <img
                    src={prediction || "/placeholder.svg"}
                    alt="Prediction"
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                  />
                </div>
                <Card className="w-1/3">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">
                        {t("modal.prediction")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-gray-500">
                        {t("modal.room_type")}: {roomType}
                      </span>
                      <span className="text-sm text-gray-500">
                        {t("modal.room_style")}: {roomStyle}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          <div className="flex gap-4 items-center justify-between">
            <Input
              type="text"
              placeholder={t("modal.input_prompt")}
              value={prompt}
              onChange={(e) => setPrompt(e.currentTarget.value)}
            />
            <Button onClick={onSubmit}>{t("modal.run_model_again")}</Button>
          </div>
        </div>
      </div>
      <DialogFooter className="flex items-center gap-2 justify-end">
        <Button onClick={assignPredictionInToProduct}>
          {t("modal.assign_prediction_to_product")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
