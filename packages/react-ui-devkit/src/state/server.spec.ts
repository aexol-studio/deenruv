import { describe, expect, it } from "vitest";
import { Permission } from "@deenruv/admin-types";
import { getSelectedChannelPermissions } from "../access.js";
import { useServer } from "../../dist/state/server.js";

const administrator = {
  user: {
    roles: [
      {
        channels: [{ id: "channel-a" }],
        permissions: [Permission.CreateProduct, Permission.ReadProduct],
      },
      {
        channels: [{ id: "channel-a" }],
        permissions: [Permission.ReadProduct, Permission.UpdateProduct],
      },
      {
        channels: [{ id: "channel-b" }],
        permissions: [Permission.DeleteProduct],
      },
    ],
  },
} as Parameters<typeof getSelectedChannelPermissions>[0];

describe("getSelectedChannelPermissions", () => {
  it("unions and deduplicates roles for the selected channel", () => {
    expect(getSelectedChannelPermissions(administrator, "channel-a")).toEqual([
      Permission.CreateProduct,
      Permission.ReadProduct,
      Permission.UpdateProduct,
    ]);
  });

  it("does not leak permissions from a disjoint channel", () => {
    expect(
      getSelectedChannelPermissions(administrator, "channel-a"),
    ).not.toContain(Permission.DeleteProduct);
  });

  it("replaces permissions when the selected channel changes", () => {
    expect(getSelectedChannelPermissions(administrator, "channel-b")).toEqual([
      Permission.DeleteProduct,
    ]);
  });

  it("returns empty permissions when the channel is unresolved", () => {
    expect(getSelectedChannelPermissions(administrator, undefined)).toEqual([]);
    expect(getSelectedChannelPermissions(administrator, "missing")).toEqual([]);
  });
});

describe("selected-channel permission state", () => {
  it("preserves the store and permission references for a no-op recalculation", () => {
    const userPermissions = getSelectedChannelPermissions(
      administrator,
      "channel-a",
    );
    useServer.setState({
      activeAdministrator: administrator,
      userPermissions,
      administratorAccessState: "ready",
    });
    const initialState = useServer.getState();

    initialState.setSelectedChannelPermissions("channel-a");

    expect(useServer.getState()).toBe(initialState);
    expect(useServer.getState().userPermissions).toBe(userPermissions);
    expect(useServer.getState().administratorAccessState).toBe("ready");
  });

  it("updates permissions without changing readiness for a channel transition", () => {
    useServer.getState().setSelectedChannelPermissions("channel-b");

    expect(useServer.getState().userPermissions).toEqual([
      Permission.DeleteProduct,
    ]);
    expect(useServer.getState().administratorAccessState).toBe("ready");
  });
});
