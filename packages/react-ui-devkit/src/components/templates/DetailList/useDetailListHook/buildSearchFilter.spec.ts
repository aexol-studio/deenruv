import { describe, expect, it } from "vitest";
import {
  buildDetailListSearchParams,
  buildSearchFilter,
} from "./buildSearchFilter";

describe("buildSearchFilter", () => {
  it("searches a single token across all configured fields", () => {
    expect(buildSearchFilter("shoe", ["name", "slug"])).toEqual({
      _and: [
        {
          _or: [{ name: { contains: "shoe" } }, { slug: { contains: "shoe" } }],
        },
      ],
    });
  });

  it("requires every token while allowing each token in any configured field", () => {
    expect(buildSearchFilter("red shoe", ["name", "slug"])).toEqual({
      _and: [
        {
          _or: [{ name: { contains: "red" } }, { slug: { contains: "red" } }],
        },
        {
          _or: [{ name: { contains: "shoe" } }, { slug: { contains: "shoe" } }],
        },
      ],
    });
  });

  it("normalizes repeated surrounding and internal whitespace", () => {
    expect(buildSearchFilter("  red  \t shoe \n ", ["name"])).toEqual({
      _and: [
        { _or: [{ name: { contains: "red" } }] },
        { _or: [{ name: { contains: "shoe" } }] },
      ],
    });
  });

  it("combines search with existing filters without overwriting them", () => {
    expect(
      buildSearchFilter("red shoe", ["name"], {
        enabled: { eq: true },
        _and: [{ stockOnHand: { gt: 0 } }],
      }),
    ).toEqual({
      enabled: { eq: true },
      _and: [
        { stockOnHand: { gt: 0 } },
        { _or: [{ name: { contains: "red" } }] },
        { _or: [{ name: { contains: "shoe" } }] },
      ],
    });
  });
});

describe("buildDetailListSearchParams", () => {
  it("uses the existing tokenized filter transport by default mode", () => {
    expect(
      buildDetailListSearchParams("red shoe", ["name"], {
        enabled: { eq: true },
      }),
    ).toEqual({
      filter: {
        enabled: { eq: true },
        _and: [
          { _or: [{ name: { contains: "red" } }] },
          { _or: [{ name: { contains: "shoe" } }] },
        ],
      },
    });
  });

  it("passes normalized raw search separately without changing structured filters", () => {
    const filter = {
      enabled: { eq: true },
      _and: [{ slug: { contains: "sale" } }],
    };

    expect(
      buildDetailListSearchParams(
        "  red  \t shoe \n ",
        ["name", "sku"],
        filter,
        "searchTerm",
      ),
    ).toEqual({ filter, searchTerm: "red shoe" });
  });

  it("omits an empty backend search term", () => {
    expect(
      buildDetailListSearchParams(" \t ", ["name"], undefined, "searchTerm"),
    ).toEqual({ filter: {}, searchTerm: undefined });
  });
});
