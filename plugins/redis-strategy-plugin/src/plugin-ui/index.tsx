import { createDeenruvUIPlugin, DEENRUV_UI_VERSION } from "@deenruv/react-ui-devkit";

export const UIPlugin = createDeenruvUIPlugin<{}>({
  version: DEENRUV_UI_VERSION,
  name: "UI Plugin",
  pages: [],
  navMenuLinks: [],
});
