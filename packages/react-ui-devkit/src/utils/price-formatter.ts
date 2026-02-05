import { CurrencyCode } from "@deenruv/admin-types";

/**
 * @param price - price to format
 * @param currencyCode - currency code e.g. USD
 */
export function priceFormatter<T>(
  price: number | { from: number; to: number },
  code?: T extends CurrencyCode ? CurrencyCode : T,
): string {
  // Default to USD as the most widely recognized international currency fallback
  const currencyCode = code || CurrencyCode.USD;
  const translations: Partial<Record<CurrencyCode, { country: string }>> = {
    [CurrencyCode.USD]: {
      country: "en-US",
    },
    [CurrencyCode.EUR]: {
      country: "de-DE",
    },
    [CurrencyCode.PLN]: {
      country: "pl-PL",
    },
    [CurrencyCode.CZK]: {
      country: "cs-CZ",
    },
  };
  const converted = translations[code as CurrencyCode];
  if (!converted) {
    const formatterCode = new Intl.NumberFormat("en-US", {
      style: "currency",
      currencyDisplay: "narrowSymbol",
      currency: "USD",
    });
    if (typeof price === "number") {
      return formatterCode.format(price / 100);
    } else {
      return (
        formatterCode.format(price.from / 100) +
        " - " +
        formatterCode.format(price.to / 100)
      );
    }
  }
  const formatterCode = new Intl.NumberFormat(converted.country, {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    currency: currencyCode as string,
  });
  if (typeof price === "number") {
    return formatterCode.format(price / 100);
  } else {
    return (
      formatterCode.format(price.from / 100) +
      " - " +
      formatterCode.format(price.to / 100)
    );
  }
}
