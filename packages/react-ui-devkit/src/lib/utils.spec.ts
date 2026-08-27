import { afterEach, describe, expect, it, vi } from "vitest";

import { formatDate } from "./utils";

const date = new Date("2026-08-27T14:35:00.000Z");

describe("formatDate", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("formats dateStyle and timeStyle options without adding component defaults", () => {
    const consoleError = vi
      .spyOn(globalThis.console, "error")
      .mockImplementation(() => {});
    const options: Intl.DateTimeFormatOptions = {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    };

    expect(formatDate(date, { locale: "en-US", ...options })).toBe(
      new Intl.DateTimeFormat("en-US", options).format(date),
    );
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("retains the default date components when styles are omitted", () => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    };

    expect(formatDate(date, { locale: "en-US", timeZone: "UTC" })).toBe(
      new Intl.DateTimeFormat("en-US", options).format(date),
    );
  });

  it("preserves explicit component options and passes locale separately", () => {
    const dateTimeFormat = vi.spyOn(Intl, "DateTimeFormat");
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      timeZone: "UTC",
    };

    expect(formatDate(date, { locale: "en-GB", ...options })).toBe(
      new Intl.DateTimeFormat("en-GB", options).format(date),
    );
    expect(dateTimeFormat).toHaveBeenNthCalledWith(1, "en-GB", options);
    expect(dateTimeFormat.mock.calls[0]?.[1]).not.toHaveProperty("locale");
  });
});
