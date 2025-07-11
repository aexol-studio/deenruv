import {
  Dialog,
  DialogTrigger,
  Button,
  DialogContent,
  DialogHeader,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
  DialogClose,
} from "@deenruv/react-ui-devkit";
import React, { useState } from "react";
import { ReviewState } from "../zeus";
import { TRANSLATION_NAMESPACE } from "../constants";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const ReviewStateChange = ({
  onSubmit,
}: {
  onSubmit: (state: ReviewState, message?: string) => Promise<void>;
}) => {
  const [state, setState] = useState<string>();
  const [message, setMessage] = useState<string>();
  const { t } = useTranslation(TRANSLATION_NAMESPACE, {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="text-xs">
          {t("detail.changeState")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>{t("detail.changeState")}</DialogHeader>
        <Select name="state" onValueChange={setState} value={state}>
          <SelectTrigger>
            <SelectValue placeholder={t("detail.selectState")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={ReviewState.ACCEPTED} value={ReviewState.ACCEPTED}>
              {t("state.accepted")}
            </SelectItem>
            <SelectItem key={ReviewState.DECLINED} value={ReviewState.DECLINED}>
              {t("state.declined")}
            </SelectItem>
          </SelectContent>
        </Select>
        <Input
          className="w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          name="message"
          placeholder={t("detail.businessResponsePlaceholder")}
        />
        <div className="flex gap-2 justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t("detail.cancel")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="action"
              disabled={!state}
              onClick={async () => {
                if (!state) {
                  toast.error(t("detail.stateRequired"));
                  return;
                }
                await onSubmit(state as ReviewState, message);
              }}
            >
              {t("detail.confirm")}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
