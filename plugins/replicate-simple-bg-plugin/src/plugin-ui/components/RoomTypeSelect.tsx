import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  useLazyQuery,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import { useFormContext } from "react-hook-form";
import { translationNS } from "../translation-ns";
import { z } from "zod";
import { formSchema } from "../types";
import { getSimpleBgRoomTypeQuery } from "../graphql/queries";
import React, { useEffect, useState } from "react";

export function RoomTypeSelect() {
  const { t } = useTranslation(translationNS);
  const [getRoomTypes] = useLazyQuery(getSimpleBgRoomTypeQuery);
  const { setValue, watch } = useFormContext<z.infer<typeof formSchema>>();
  const value = watch("room_type_enum") || { value: "", label: "" };
  const [roomTypes, setRoomTypes] = useState<
    { value: string; label: string }[] | null
  >(null);

  useEffect(() => {
    getRoomTypes().then((data) => {
      return setRoomTypes(
        Array.isArray(data.getSimpleBgRoomType)
          ? data.getSimpleBgRoomType.filter(
              (item): item is { value: string; label: string } =>
                !!item.value && !!item.label,
            )
          : [],
      );
    });
  }, [getRoomTypes]);

  return (
    <Select
      value={value.label}
      onValueChange={(newValue) =>
        setValue("room_type_enum", { value: newValue, label: newValue })
      }
    >
      <SelectTrigger id="room-type">
        <SelectValue placeholder={t("select_room_type")} />
      </SelectTrigger>
      <SelectContent>
        {roomTypes?.map((roomType) => (
          <SelectItem key={roomType.value} value={roomType.value}>
            {t(roomType.label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
