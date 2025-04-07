import {
  Checkbox,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  cn,
} from "@deenruv/react-ui-devkit";
import React from "react";
import { FacetValueData } from "./AttributesInput";

export const GroupValue = ({
  entry,
  handleFacetValueSelect,
  isValueSelected,
}: {
  entry: FacetValueData;
  handleFacetValueSelect: () => void;
  isValueSelected: boolean;
}) => {
  return (
    <div className="flex items-center gap-2 px-1">
      <Checkbox
        id={entry.id}
        checked={isValueSelected}
        onCheckedChange={handleFacetValueSelect}
      />
      <label htmlFor={entry.id}>
        <HoverCard openDelay={300}>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-2">
              {entry.imagePreview ? (
                <img
                  className="size-5 rounded-full"
                  src={entry.imagePreview || "placeholder"}
                />
              ) : (
                <div
                  className="size-5 shrink-0 rounded-full border border-[rgba(0,0,0,0.4)]"
                  style={{ backgroundColor: entry?.hexColor || "transparent" }}
                ></div>
              )}
              <div className="">{entry.name}</div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            className={cn("w-80 p-0", !entry.imagePreview && "h-40 w-40")}
          >
            {entry?.imagePreview ? (
              <img
                className="rounded object-cover"
                src={entry.imagePreview || "placeholder"}
              />
            ) : (
              <div
                className="size-40 rounded"
                style={{ backgroundColor: entry?.hexColor || "transparent" }}
              />
            )}
          </HoverCardContent>
        </HoverCard>
      </label>
    </div>
  );
};
