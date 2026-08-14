import { describe, expect, it } from "vitest";
import { Permission } from "@deenruv/admin-types";
import { hasDetailDropdownActions, matchesPermissions } from "./access.js";

describe("matchesPermissions", () => {
  it("matches any permission by default", () => {
    expect(
      matchesPermissions(
        [Permission.CreateCatalog],
        [Permission.CreateProduct, Permission.CreateCatalog],
      ),
    ).toBe(true);
  });

  it("supports explicit all matching", () => {
    const requirement = {
      requiredPermissions: [Permission.CreateProduct, Permission.CreateCatalog],
      permissionMatch: "all" as const,
    };
    expect(matchesPermissions([Permission.CreateCatalog], requirement)).toBe(
      false,
    );
    expect(
      matchesPermissions(
        [Permission.CreateCatalog, Permission.CreateProduct],
        requirement,
      ),
    ).toBe(true);
  });

  it("gives row and bulk deletion the same alternative semantics", () => {
    const alternatives = [Permission.DeleteProduct, Permission.DeleteCatalog];
    const granted = [Permission.DeleteCatalog];
    expect(matchesPermissions(granted, alternatives)).toBe(true);
    expect(matchesPermissions(granted, alternatives)).toBe(true);
  });

  it.each([
    [Permission.CreateProduct, Permission.CreateCatalog],
    [Permission.UpdateProduct, Permission.UpdateCatalog],
    [Permission.DeleteProduct, Permission.DeleteCatalog],
  ])(
    "grants CRUD with either entity-specific %s or umbrella %s permission",
    (entityPermission, umbrellaPermission) => {
      const alternatives = [entityPermission, umbrellaPermission];
      expect(matchesPermissions([entityPermission], alternatives)).toBe(true);
      expect(matchesPermissions([umbrellaPermission], alternatives)).toBe(true);
    },
  );
});

describe("hasDetailDropdownActions", () => {
  it("keeps extension actions available without delete permission", () => {
    expect(
      hasDetailDropdownActions({
        canDelete: false,
        dropdownActionCount: 1,
        hasEntity: true,
      }),
    ).toBe(true);
  });

  it("does not render an empty dropdown or one for an unsaved entity", () => {
    expect(
      hasDetailDropdownActions({
        canDelete: false,
        dropdownActionCount: 0,
        hasEntity: true,
      }),
    ).toBe(false);
    expect(
      hasDetailDropdownActions({
        canDelete: true,
        dropdownActionCount: 0,
        hasEntity: false,
      }),
    ).toBe(false);
  });
});
