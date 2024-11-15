import React, { useState } from "react";
import { BadgeType } from "./Badges";
import { LanguageCode } from "../zeus";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Button,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
} from "@deenruv/react-ui-devkit";
import { translationNS } from "../translation-ns";
import { createClient } from "../client";

type Props = {
  productId: string;
  lang: LanguageCode;
  closeHandler: () => void;
  onSuccess?: () => Promise<unknown>;
  badge?: BadgeType;
};

export const BadgesModal = ({
  onSuccess,
  closeHandler,
  productId,
  badge,
  lang,
}: Props) => {
  const { t } = useTranslation(translationNS);
  const [text, setText] = useState(badge?.name || "");
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(badge?.color || "#000000");

  const client = createClient(lang);
  const mode = badge ? "edit" : "add";

  const submitHandler = async () => {
    if (!text) {
      toast.error(t("modal.text-error"));
      return;
    }
    try {
      setLoading(true);
      const input = {
        color,
        translations: [{ languageCode: lang, name: text }],
      };

      if (mode === "edit") {
        await client("mutation")({
          editBadge: [
            {
              input: {
                id: badge!.id,
                ...input,
              },
            },
            { id: true },
          ],
        });
      }
      if (mode === "add") {
        await client("mutation")({
          createBadge: [
            {
              input: {
                productId,
                ...input,
              },
            },
            { id: true },
          ],
        });
      }
      toast.success(t(`modal.${mode}.success`));
      await onSuccess?.();
      closeHandler();
    } catch (err) {
      console.log(err);
      toast.error(t(`modal.${mode}.error`));
    } finally {
      setLoading(false);
    }
  };

  if (!productId) return null;
  return (
    <DialogContent className="max-h-[80vh] max-w-[400px] overflow-auto">
      <DialogHeader>
        <DialogTitle>{t(`modal.${mode}.title`)}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center gap-2">
          <div className="flex-1">
            <Input
              label="text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="w-14">
            <Input
              label="color"
              className="cursor-pointer"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="secondary" onClick={closeHandler}>
            {t("modal.cancel")}
          </Button>
          <Button variant="action" disabled={loading} onClick={submitHandler}>
            {t(`modal.${mode}.action`)}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};
