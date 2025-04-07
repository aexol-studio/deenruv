import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  CardDescription,
  Input,
  Label,
  Textarea,
} from "@/components";
import { useCustomFields } from "@/custom_fields/context";
import { PlusIcon, X } from "lucide-react";
import { capitalizeFirstLetter, camelCaseToSpaces } from "@/utils";

// function generateRandomDarkBgColor() {
//     // Set hue to any random value (0 to 360) for color variety
//     const hue = Math.floor(Math.random() * 360);
//     // Set saturation to a high level (50-100%) for vibrant colors
//     const saturation = Math.floor(Math.random() * 51) + 50;
//     // Set lightness to a low value (10-30%) to keep the color dark
//     const lightness = Math.floor(Math.random() * 21) + 10;

//     return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
// }

export function DefaultSimpleListInput() {
  const { field, value, label, description, setValue, disabled } =
    useCustomFields<Array<string | number>>();
  const [inputValue, setInputValue] = useState<string | number>("");

  const isNumber = field?.type === "int" || field?.type === "float";
  const isTextArea = field?.type === "text" || field?.type === "localeText";

  const badges = useMemo(() => {
    {
      return value?.map((el: string | number) => (
        <Badge
          className="text-muted-foreground-600 bg-muted break-all"
          // style={{ color: 'white', backgroundColor: generateRandomDarkBgColor() }}
        >
          {el}
          <X
            className="ml-2 cursor-pointer"
            onClick={() =>
              setValue(value.filter((val: string | number) => el !== val))
            }
            size={14}
          />
        </Badge>
      ));
    }
  }, [value?.length]);

  return (
    <div id={field?.name} className="flex flex-col gap-2">
      <Label htmlFor={field?.name}>
        {label || capitalizeFirstLetter(camelCaseToSpaces(field?.name))}
      </Label>
      <CardDescription>{description}</CardDescription>
      <div className="flex flex-wrap gap-2">{badges}</div>
      <div className="align-center flex gap-1">
        {isTextArea ? (
          <Textarea
            id={field?.name}
            rows={2}
            value={inputValue}
            disabled={disabled ?? field?.readonly ?? undefined}
            onChange={(e) => setInputValue(e.target.value)}
          />
        ) : (
          <Input
            id={field?.name}
            type="text"
            value={inputValue}
            disabled={disabled ?? field?.readonly ?? undefined}
            onChange={(e) => {
              const val = e.target.value;

              if (isNumber) {
                const validInput = /^[0-9]*\.?[0-9]*$/;
                if (validInput.test(val)) setInputValue(val);
              } else {
                setInputValue(val);
              }
            }}
          />
        )}
        <Button
          size="icon"
          variant="secondary"
          disabled={disabled ?? field?.readonly ?? undefined}
          onClick={() => {
            setValue([
              ...(value || []),
              isNumber ? Number(inputValue) : inputValue,
            ]);
            setInputValue("");
          }}
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}
