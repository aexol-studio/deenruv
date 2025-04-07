import { Switch } from "@/components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FilterInputType } from "../types";
import React from "react";
import { OperatorSelect } from "@/components/templates/DetailList/useDetailListHook/OperatorSelect.js";

type BooleanOperator = Omit<FilterInputType["BooleanOperators"], "__typename">;
type Props<T extends BooleanOperator> = {
  currentValue?: T;
  onSubmit: (value: T) => void;
};

export const BooleanOperator: React.FC<Props<BooleanOperator>> = ({
  onSubmit,
  currentValue,
}) => {
  const { t } = useTranslation("table");
  const defaultType = currentValue
    ? (Object.keys(currentValue)[0] as keyof BooleanOperator)
    : "eq";
  const [currentType, setCurrentType] = useState(defaultType);
  const [value, setValue] = useState<boolean>(() => {
    if (!currentValue) return false;
    return currentValue[defaultType] as boolean;
  });

  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-4">
        <OperatorSelect
          type="BooleanOperators"
          currentValue={currentType as keyof BooleanOperator}
          onChange={(e) => {
            setCurrentType(e as keyof BooleanOperator);
            onSubmit({ [e as keyof BooleanOperator]: value });
          }}
        />
        <div className="flex w-[174px] gap-2">
          <Switch
            checked={value}
            onCheckedChange={(e) => {
              setValue(e);
              onSubmit({ [currentType]: e });
            }}
          />
          {t(value ? "true" : "false")}
        </div>
      </div>
    </div>
  );
};
