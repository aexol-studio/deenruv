import { addNavMenuSection, addNavMenuItem } from "@deenruv/admin-ui/core";

export default [
  addNavMenuSection(
    {
      id: "merchant-platform-integration",
      label: "Merchant Platform Integration",
      displayMode: "settings",
      collapsible: true,
      collapsedByDefault: true,
      requiresPermission: (permissions) => permissions.includes("SuperAdmin"),
      items: [],
    },
    "settings",
  ),
  addNavMenuItem(
    {
      id: "google-merchant",
      label: "Google Merchant",
      routerLink: [
        "extensions",
        "merchant-platform-integration",
        "google-merchant",
      ],
      requiresPermission: (permissions) => permissions.includes("SuperAdmin"),
    },
    "extras",
  ),
  addNavMenuItem(
    {
      id: "facebook-commerce",
      label: "Facebook Commerce",
      routerLink: [
        "extensions",
        "merchant-platform-integration",
        "facebook-commerce",
      ],
      requiresPermission: (permissions) => permissions.includes("SuperAdmin"),
    },
    "extras",
  ),
];
