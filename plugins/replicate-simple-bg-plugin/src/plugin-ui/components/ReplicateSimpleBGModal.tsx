import {
  DialogContent,
  useLazyQuery,
  useMutation,
  Button,
  DialogTitle,
  useTranslation,
  Input,
  useDetailView,
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
import { useLocation } from "react-router-dom";
import { getLastPathSegment } from "./ReplicateSimpleBGUtilities.js";
import { LoadingMask } from "./ReplicateSimpleBGUtilities.js";

interface PredictionModalProps {
  onClose: () => void;
  initPpredictionEntityID: string;
}
const MAX_RETRIES = 200;
export const ResplicateSimpleBGModal: React.FC<PredictionModalProps> = ({
  onClose,
  initPpredictionEntityID,
}) => {
  const { t } = useTranslation(translationNS);
  const {
    entity,
    setEntity,
    markAsDirty,
    form: {
      base: { state, setField },
    },
  } = useDetailView("products-detail-view");
  const [startGenerateSimpleBg] = useMutation(startGenerateSimpleBgMutation);
  const [roomType, setRoomType] = useState<string | null>(null);
  const [roomStyle, setRoomStyle] = useState<string | null>(null);
  const [predictionEntityID, setPredictionEntityID] = useState<string | null>(
    null,
  );
  const [prompt, setPrompt] = useState("");
  const [isPolling, setIsPolling] = useState(true);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] =
    useState<ReplicatePredictionListType["image"]>("");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const [getPredictionID] = useLazyQuery(getPredictionSimpleBGIDQuery);
  const [getPredictionItem] = useLazyQuery(getSimpleBgItemQuery);

  const [assignPredictionToProduct] = useMutation(
    assignPredictionToProductMutation,
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  const location = useLocation();
  const productId = getLastPathSegment(location.pathname);

  useEffect(() => {
    setPredictionEntityID(initPpredictionEntityID);
  }, [initPpredictionEntityID]);

  useEffect(() => {
    if (!predictionEntityID || !isPolling) return;

    setLoading(true);
    intervalRef.current = setInterval(() => {
      if (retryCountRef.current >= MAX_RETRIES) {
        console.warn("Max retries reached. Stopping polling.");
        clearInterval(intervalRef.current as NodeJS.Timeout);
        setIsPolling(false);
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
  }, [predictionEntityID, isPolling]);

  const fetchPrediction = (predictionID: string) => {
    getPredictionItem({ id: predictionID })
      .then((response) => {
        if (response?.getSimpleBgItem) {
          const status = response.getSimpleBgItem.status;
          if (status === PredictionSimpleBgStatus.succeeded) {
            setPrediction(response.getSimpleBgItem.image);
            setRoomStyle(response.getSimpleBgItem.roomStyle ?? null);
            setRoomType(response.getSimpleBgItem.roomType ?? null);
            setIsPolling(false);
            setLoading(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
          } else if (status === PredictionSimpleBgStatus.failed) {
            console.error("Prediction failed.");
            setIsPolling(false);
            setLoading(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching prediction:", error);
      });
  };

  const assignPredicitonInToProduct = async () => {
    const asset = await assignPredictionToProduct({
      input: {
        predictionId: predictionEntityID ?? "",
        productId: productId,
      },
    });

    if (asset?.assignPredictionToProduct) {
      if (entity) {
        const newAsset = asset.assignPredictionToProduct;

        // const updatedEntity = {
        //   ...entity,
        //   assets: Array.isArray(entity.assets)
        //     ? [...entity.assets, newAsset]
        //     : [newAsset],
        // };

        if (state.assetIds?.value) {
          setField("assetIds", [...state.assetIds.value, newAsset.id]);
        }
        setSelectedAssetId(newAsset.id);
        markAsDirty();
      }
    }
  };

  const onSubmit = async () => {
    const assetId = entity?.featuredAsset?.id;
    setLoading(true);
    setIsPolling(true);

    if (assetId) {
      const response = await startGenerateSimpleBg({
        input: {
          assetId: assetId,
          roomType: roomType,
          roomStyle: roomStyle,
          prompt: prompt,
        },
      });
      const predictionEntityId = response.startGenerateSimpleBg;
      if (predictionEntityId) {
        setPredictionEntityID(predictionEntityId);
      }
    }
  };

  return (
    <DialogContent className="min-w-[500px] sm:max-w-[600px]">
      <DialogTitle>{t("modal.title")}</DialogTitle>
      <div className="flex flex-col">
        <div className="border rounded-md p-4 mb-4 flex flex-col">
          <div className="flex-grow mb-4 max-h-[600px] overflow-hidden">
            {loading ? (
              <LoadingMask />
            ) : (
              <img
                src={prediction || "/placeholder.svg"}
                alt="Prediction"
                className="w-full h-auto object-contain max-h-[350px]"
              />
            )}
          </div>

          <div className="mt-auto">
            <div className="mb-4">
              <Input
                type="text"
                placeholder={t("modal.input_prompt")}
                value={prompt}
                onChange={(e) => setPrompt(e.currentTarget.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={onSubmit}>{t("modal.run_model_again")}</Button>
              <Button onClick={() => assignPredicitonInToProduct()}>
                {t("modal.assign_prediction_to_product")}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={entity?.assets.length === 0}
          >
            {t("modal.close")}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};
