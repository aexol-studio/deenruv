import React, { useState, useRef, useEffect } from "react";
import { RoomTypeSelect } from "./RoomTypeSelect.js";
import { RoomThemeSelect } from "./RoomThemeSelect.js";
import { formSchema, useReplicateForm } from "../types.js";
import {
  Form,
  Card,
  CardHeader,
  Button,
  useDetailView,
  useMutation,
  Dialog,
  useTranslation,
  CardContent,
  cn,
} from "@deenruv/react-ui-devkit";
import { translationNS } from "../translation-ns";
import { ReplicateSimpleBGModal } from "./ReplicateSimpleBGModal.js";
import { z } from "zod";
import { startGenerateSimpleBgMutation } from "../graphql/mutations.js";
import { ChevronDown, Image } from "lucide-react";

export const ReplicateSimpleBGProduct: React.FC = () => {
  const { t } = useTranslation(translationNS);
  const { entity } = useDetailView("products-detail-view");
  const form = useReplicateForm();

  const [startGenerateSimpleBg] = useMutation(startGenerateSimpleBgMutation);
  const [predictionEntityID, setPredictionEntityID] = useState<string | null>(
    null,
  );
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const assetId = entity?.featuredAsset?.id;
    if (assetId) {
      const response = await startGenerateSimpleBg({
        input: {
          assetId: assetId,
          roomType: data.room_type_enum.value,
          roomStyle: data.room_style_enum.value,
          prompt: null,
        },
      });
      const predictionEntityId = response.startGenerateSimpleBg;
      if (predictionEntityId) {
        setPredictionEntityID(predictionEntityId);
        setIsDialogVisible(true);
      }
    }
  };

  return (
    <>
      <Form {...form}>
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
              style={{
                height: height !== undefined ? `${height}px` : undefined,
              }}
              className={cn(
                "transition-all duration-300 ease-in-out p-2",
                !isOpen && "opacity-0",
              )}
            >
              <CardContent className="pt-0 pb-4 px-4">
                <div className="flex flex-col gap-4">
                  <RoomTypeSelect />
                  <RoomThemeSelect theme_preview={false} />
                  <Button
                    disabled={
                      !form.watch("room_type_enum")?.value ||
                      !form.watch("room_style_enum")?.value ||
                      form.formState.isSubmitting
                    }
                    onClick={async () => {
                      try {
                        await onSubmit(form.getValues());
                      } catch (error) {
                        console.error("Error submitting form:", error);
                      }
                    }}
                  >
                    {t("run_model")}
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </Form>
      {isDialogVisible && predictionEntityID && (
        <Dialog open={isDialogVisible} onOpenChange={setIsDialogVisible}>
          <ReplicateSimpleBGModal
            onClose={() => setIsDialogVisible(false)}
            initPredictionEntityID={predictionEntityID || ""}
          />
        </Dialog>
      )}
    </>
  );
};
