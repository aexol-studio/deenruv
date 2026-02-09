import { describe, it, expect } from "vitest";
import { setInArrayBy } from "./setInArrayBy";

describe("setInArrayBy", () => {
  it("replaces a matching element", () => {
    const items = [
      { id: 1, name: "A" },
      { id: 2, name: "B" },
      { id: 3, name: "C" },
    ];

    const result = setInArrayBy(items, (item) => item.id === 2, {
      id: 2,
      name: "Updated",
    });

    expect(result).toEqual([
      { id: 1, name: "A" },
      { id: 2, name: "Updated" },
      { id: 3, name: "C" },
    ]);
  });

  it("adds element to end when no match found", () => {
    const items = [
      { id: 1, name: "A" },
      { id: 2, name: "B" },
    ];

    const result = setInArrayBy(items, (item) => item.id === 3, {
      id: 3,
      name: "C",
    });

    expect(result).toEqual([
      { id: 1, name: "A" },
      { id: 2, name: "B" },
      { id: 3, name: "C" },
    ]);
  });

  it("returns a new array (immutability)", () => {
    const items = [
      { id: 1, name: "A" },
      { id: 2, name: "B" },
    ];

    const result = setInArrayBy(items, (item) => item.id === 1, {
      id: 1,
      name: "Updated",
    });

    expect(result).not.toBe(items);
    // Original array should be unchanged
    expect(items[0].name).toBe("A");
  });

  it("replaces the first matching element only", () => {
    const items = [
      { id: 1, name: "A" },
      { id: 1, name: "B" },
      { id: 2, name: "C" },
    ];

    const result = setInArrayBy(items, (item) => item.id === 1, {
      id: 1,
      name: "Updated",
    });

    expect(result).toEqual([
      { id: 1, name: "Updated" },
      { id: 1, name: "B" },
      { id: 2, name: "C" },
    ]);
  });

  it("works with an empty array", () => {
    const items: { id: number; name: string }[] = [];

    const result = setInArrayBy(items, (item) => item.id === 1, {
      id: 1,
      name: "New",
    });

    expect(result).toEqual([{ id: 1, name: "New" }]);
  });

  it("works with primitive types", () => {
    const items = [1, 2, 3, 4, 5];

    const result = setInArrayBy(items, (item) => item === 3, 99);

    expect(result).toEqual([1, 2, 99, 4, 5]);
  });
});
