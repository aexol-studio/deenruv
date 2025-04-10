import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type FormatDateOptions = Intl.DateTimeFormatOptions & {
    locale?: string;
  };

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number, opts: FormatDateOptions = {}) {
    const browserLocale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
    
    return new Intl.DateTimeFormat(opts.locale ?? browserLocale, {
        month: opts.month ?? 'long',
        day: opts.day ?? 'numeric',
        year: opts.year ?? 'numeric',
        ...opts,
    }).format(new Date(date));
}
