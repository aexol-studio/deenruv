import { useState } from "react";
import { FilterInputType } from "../types";
import { ArrayInput } from "./ArrayInput";
import { Input } from "@/components";
import React from "react";
import { OperatorSelect } from "@/components/templates/DetailList/useDetailListHook/OperatorSelect.js";

type IDOperator = Omit<FilterInputType["IDOperators"], "__typename">;
const ARRAY_TYPES = ["in", "notIn"] as (keyof IDOperator)[];

type Props<T extends IDOperator> = {
  currentValue?: T;
  onSubmit: (value: T) => void;
};

export const IDOperator: React.FC<Props<IDOperator>> = ({
  currentValue,
  onSubmit,
}) => {
  const defaultType = currentValue
    ? (Object.keys(currentValue || {})[0] as keyof IDOperator)
    : "eq";
  const [type, setType] = useState(defaultType);
  const [value, setValue] = useState<string | string[] | undefined>(() => {
    if (!currentValue || !Object.keys(currentValue || {}).length)
      return undefined;
    if (ARRAY_TYPES.includes(defaultType))
      return (currentValue[defaultType] as string[]).join(",");
    else return currentValue[defaultType] as string;
  });

  return (
    <div className="flex gap-2">
      <OperatorSelect
        type="IDOperators"
        currentValue={type as keyof IDOperator}
        onChange={(e) => {
          setType(e as keyof IDOperator);
          onSubmit({ [e as keyof IDOperator]: value });
        }}
      />
      <div className="flex gap-2">
        {!ARRAY_TYPES.includes(type) ? (
          <Input
            id="string-input"
            className="h-8 w-full rounded"
            disabled={!type}
            value={value}
            onChange={(e) => {
              setValue(e.currentTarget.value);
              onSubmit({ [type as keyof IDOperator]: e.currentTarget.value });
            }}
          />
        ) : (
          <ArrayInput
            type="number"
            value={Array.isArray(value) && value.length ? value : []}
            className="h-8 w-full rounded"
            disabled={!type}
            onChange={(e) => {
              if (Array.isArray(e)) {
                setValue(e);
                onSubmit({ [type as keyof IDOperator]: e });
              } else {
                setValue([e.target.value]);
                onSubmit({ [type as keyof IDOperator]: e.target.value });
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
