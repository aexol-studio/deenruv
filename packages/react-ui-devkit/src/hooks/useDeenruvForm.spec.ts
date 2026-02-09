import { describe, it, expect } from "vitest";

// Hook tests for useDeenruvForm require @testing-library/react (renderHook).
// These will be added once @testing-library/react is added as a devDependency.
//
// Planned test cases:
// 1. Basic form creation — returns expected shape (control, formState, setField, etc.)
// 2. setField — calling setField('name', 'value') updates the form value
// 3. Validation — invalid values produce errors, valid values clear errors
// 4. isFormValid — reflects validation state
// 5. hasErrors — reflects error state
// 6. reset — resets to default values
// 7. Mode: onTouched — validates on blur by default

describe("useDeenruvForm", () => {
  it("module exports are importable", async () => {
    const mod = await import("./useDeenruvForm");
    expect(mod.useDeenruvForm).toBeDefined();
    expect(typeof mod.useDeenruvForm).toBe("function");
  });

  it("re-exports z from zod", async () => {
    const mod = await import("./useDeenruvForm");
    expect(mod.z).toBeDefined();
    expect(mod.z.object).toBeDefined();
    expect(mod.z.string).toBeDefined();
  });
});
