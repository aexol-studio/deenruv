import React, { useState } from "react";
import {
  Button,
  DialogComponentProps,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@deenruv/react-ui-devkit";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "../constants";
import { toast } from "sonner";

export function UniversalSelectDialog<T extends string>({
  close,
  resolve,
  data: {
    title,
    description,
    defaultValue,
    options,
    selectLabel,
    selectPlaceholder,
  },
}: DialogComponentProps<
  { value: T; label: string },
  {
    title: string;
    selectLabel: string;
    selectPlaceholder: string;
    options: { value: T; label: string }[];
    description?: string;
    defaultValue?: T;
  }
>) {
  const [value, setValue] = useState<T | undefined>(
    defaultValue ? defaultValue : undefined,
  );
  const { t } = useTranslation(TRANSLATION_NAMESPACE, {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  const onSubmit = () => {
    const option = options.find((o) => o.value === value);
    if (!option) {
      toast.error(t("dialog.selectError"));
      return;
    }
    resolve({ value: option.value, label: option.label });
  };

  return (
    <>
      <DialogHeader className="pb-4 border-b">
        <DialogTitle className="text-xl font-bold">
          {title}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </DialogTitle>
      </DialogHeader>
      <div>
        <Select
          value={value}
          onValueChange={(value) => setValue(value as T)}
          defaultValue={defaultValue}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={selectPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{selectLabel}</SelectLabel>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="pt-4 border-t mt-4">
        <Button variant="outline" onClick={close}>
          {t("dialog.cancel")}
        </Button>
        <Button onClick={onSubmit}>{t("dialog.submit")}</Button>
      </DialogFooter>
    </>
  );
}
