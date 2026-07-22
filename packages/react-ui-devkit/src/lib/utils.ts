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
  opts: FormatDateOptions = {}
) {
  const browserLocale =
    typeof navigator !== "undefined" ? navigator.language : "en-US";
  if (!date) return "-";
  try {
    const result = new Intl.DateTimeFormat(opts.locale ?? browserLocale, {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(new Date(date));
    return result;
  } catch (e) {
    console.error("Error formatting date:", e);
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
