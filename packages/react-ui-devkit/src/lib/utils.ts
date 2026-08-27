import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type FormatDateOptions = Intl.DateTimeFormatOptions & {
  locale?: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  opts: FormatDateOptions = {},
) {
  const browserLocale =
    typeof globalThis.navigator !== "undefined"
      ? globalThis.navigator.language
      : "en-US";
  if (!date) return "-";
  try {
    const { locale, ...formatOptions } = opts;
    const hasStyleOption =
      formatOptions.dateStyle !== undefined ||
      formatOptions.timeStyle !== undefined;
    const resolvedOptions = hasStyleOption
      ? formatOptions
      : {
          month: formatOptions.month ?? "long",
          day: formatOptions.day ?? "numeric",
          year: formatOptions.year ?? "numeric",
          ...formatOptions,
        };
    const result = new Intl.DateTimeFormat(
      locale ?? browserLocale,
      resolvedOptions,
    ).format(new Date(date));
    return result;
  } catch (e) {
    globalThis.console.error("Error formatting date:", e);
    if (typeof date === "string") {
      return date;
    }
    if (typeof date === "number") {
      return new Date(date).toString();
    }
    return date.toString();
  }
}

export function generateColorFromString(name: string): string {
  const hashCode = (str: string): number => {
    return str.split("").reduce((hash, char) => {
      return char.charCodeAt(0) + ((hash << 5) - hash);
    }, 0);
  };

  const hash = hashCode(name);
  const hue = Math.abs(hash) % 360;

  return `hsl(${hue}, 32%, 36%)`;
}
