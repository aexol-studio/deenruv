import { format } from "date-fns";
import { enGB, pl } from "date-fns/locale";

export const formatCustomMetricDate = (date: Date, language: string) =>
  format(date, "PPP", { locale: language.startsWith("pl") ? pl : enGB });

export const formatVariantId = (label: string, id: string) =>
  `(${label}: ${id})`;
