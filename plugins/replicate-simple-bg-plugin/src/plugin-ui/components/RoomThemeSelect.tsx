import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { translationNS } from "../translation-ns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
  useLazyQuery,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import { formSchema } from "../types.js";
import { getSimpleBgRoomThemeQuery } from "../graphql/queries";

export function RoomThemeSelect({ theme_preview }: { theme_preview: boolean }) {
  const { watch, setValue } = useFormContext<z.infer<typeof formSchema>>();
  const selectedTheme = watch("room_style_enum") || {
    value: "",
    label: "",
    image: "",
  };
  const { t } = useTranslation(translationNS);
  const [getRoomThemes] = useLazyQuery(getSimpleBgRoomThemeQuery);
  const [roomThemes, setRoomThemes] = useState<
    { value: string; label: string; image: string }[] | null
  >(null);

  useEffect(() => {
    getRoomThemes()
      .then((data) => {
        if (data?.getSimpleBgRoomTheme) {
          setRoomThemes(
            Array.isArray(data.getSimpleBgRoomTheme)
              ? data.getSimpleBgRoomTheme.map((theme) => ({
                  value: theme.value || "",
                  label: theme.label || "",
                  image: theme.image || "",
                }))
              : [],
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching room themes:", error);
        setRoomThemes([]);
      });
  }, [getRoomThemes]);

  const handleThemeSelect = (themeValue: string) => {
    setValue("room_style_enum", {
      value: themeValue,
      label: "",
      image: "",
    });
  };

  return theme_preview ? (
    <div
      role="radiogroup"
      aria-label="Room themes"
      style={{ transform: "scale(0.95)" }}
      className="grid grid-cols-2 md:grid-cols-2 gap-2 grid-auto-flow-dense max-w-[600px]"
    >
      {roomThemes?.map((theme) => (
        <button
          key={theme.value}
          className={cn(
            "relative aspect-square rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary",
            "transition-transform hover:scale-[1.02]",
            "w-full h-[200px] p-0.5",
            selectedTheme.value === theme.value ? "ring-2 ring-primary" : "",
          )}
          role="radio"
          aria-checked={selectedTheme.value === theme.value}
          onClick={() => handleThemeSelect(theme.value)}
        >
          <img
            src={theme.image || "/placeholder.svg"}
            alt={`${theme.label} theme preview`}
            className="object-cover w-full h-full rounded-md"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
            <span className="text-white text-sm font-medium">
              {t(theme.label)}
            </span>
          </div>
        </button>
      ))}
    </div>
  ) : (
    <Select
      value={selectedTheme.label}
      onValueChange={(newValue) =>
        setValue("room_style_enum", {
          value: newValue,
          label: newValue,
          image: "",
        })
      }
    >
      <SelectTrigger id="room-theme">
        <SelectValue placeholder={t("select_room_theme")} />
      </SelectTrigger>
      <SelectContent>
        {roomThemes?.map((theme) => (
          <SelectItem key={theme.value} value={theme.value}>
            {t(theme.label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
