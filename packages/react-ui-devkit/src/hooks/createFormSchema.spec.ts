import { describe, it, expect } from "vitest";
import { z } from "zod";
import { createFormSchema } from "./createFormSchema";

describe("createFormSchema", () => {
  it("creates a valid Zod object schema", () => {
    const schema = createFormSchema({
      name: z.string().min(1),
      code: z.string(),
    });

    expect(schema).toBeDefined();
    expect(schema instanceof z.ZodObject).toBe(true);
  });

  it("validates correct data", () => {
    const schema = createFormSchema({
      name: z.string().min(1, "Name is required"),
      price: z.number().min(0),
    });

    const result = schema.safeParse({ name: "Product", price: 10 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: "Product", price: 10 });
    }
  });

  it("rejects invalid data", () => {
    const schema = createFormSchema({
      name: z.string().min(1, "Name is required"),
      price: z.number().min(0, "Must be positive"),
    });

    const result = schema.safeParse({ name: "", price: -1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues.length).toBe(2);
      expect(issues[0].message).toBe("Name is required");
      expect(issues[1].message).toBe("Must be positive");
    }
  });

  it("handles optional fields", () => {
    const schema = createFormSchema({
      name: z.string().min(1),
      description: z.string().optional(),
    });

    const result = schema.safeParse({ name: "Product" });
    expect(result.success).toBe(true);
  });

  it("handles customFields pattern", () => {
    const schema = createFormSchema({
      name: z.string().min(1),
      customFields: z.record(z.unknown()).optional(),
    });

    const result = schema.safeParse({
      name: "Product",
      customFields: { color: "red", size: 42 },
    });
    expect(result.success).toBe(true);
  });
});
