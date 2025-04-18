import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import React from "react";
import { translationNS } from "../translation-ns.js";
import { ReplicateRoomType } from "../graphql/selectors.js";

export const RoomTypeSelect: React.FC<{
  roomTypes?: ReplicateRoomType[];
  onValueChange: (newValue: string) => void;
  selectedValue?: string;
}> = ({ roomTypes, onValueChange, selectedValue }) => {
  const { t } = useTranslation(translationNS);
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">{t("room_type")}</Label>
      <Select
        value={selectedValue}
        onValueChange={(newValue) => {
          const selectedOption = roomTypes?.find(
            (option) => option.value === newValue,
          );
          if (!selectedOption) return;
          const { value, label } = selectedOption;
          if (!value || !label) return;
          onValueChange(value);
        }}
      >
        <SelectTrigger id="room-type">
          <SelectValue placeholder={t("select_room_type")} />
        </SelectTrigger>
        <SelectContent>
          {roomTypes?.map(({ label, value }) => (
            <SelectItem key={value} value={value!}>
              {t(label as string)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>{" "}
    </div>
  );
};
