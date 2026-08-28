import { describe, expect, it } from "vitest";
import en from "./locales/en/inpost.json";
import pl from "./locales/pl/inpost.json";

const leafKeys = (value: object, prefix = ""): string[] =>
  Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object"
      ? leafKeys(child as object, path)
      : [path];
  });

describe("InPost admin translations", () => {
  it("keeps English and Polish locale keys in parity", () => {
    expect(leafKeys(en).sort()).toEqual(leafKeys(pl).sort());
  });

  it("registers every select placeholder requested by the runtime", () => {
    expect(en["inpost-plugin"]["organization-select-placeholder"]).toBeTruthy();
    expect(en["inpost-plugin"]["service-select-placeholder"]).toBeTruthy();
    expect(pl["inpost-plugin"]["organization-select-placeholder"]).toBeTruthy();
    expect(pl["inpost-plugin"]["service-select-placeholder"]).toBeTruthy();
  });

  it("uses the English save label in the English locale", () => {
    expect(en["inpost-plugin"].save).toBe("Save");
  });
});
