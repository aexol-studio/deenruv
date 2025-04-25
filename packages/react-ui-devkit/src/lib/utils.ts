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
    try {
      const result = new Intl.DateTimeFormat(opts.locale ?? browserLocale, {
        month: opts.month ?? 'long',
        day: opts.day ?? 'numeric',
        year: opts.year ?? 'numeric',
        ...opts,
      }).format(new Date(date))
      return result
    } catch (e) {
      console.error('Error formatting date:', e);
      if (typeof date === 'string') {
        return date;
      }
      if (typeof date === 'number') {
        return new Date(date).toString();
      }
      return date.toString();
    }
}

export function generateColorFromString(name: string): string {
    const hashCode = (str: string): number => {
      return str.split('').reduce((hash, char) => {
        return char.charCodeAt(0) + ((hash << 5) - hash);
      }, 0);
    };
  
    const hashToHex = (hash: number): string => {
      const r = (hash & 0xff0000) >> 16;
      const g = (hash & 0x00ff00) >> 8;
      const b = hash & 0x0000ff;
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };
  
    const hash = hashCode(name);
    return hashToHex(hash);
  }
  