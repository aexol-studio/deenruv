import React from "react";

import { usePluginStore } from "@/plugins/plugin-context";
import { DetailLocationID, DetailLocationSidebarID } from "@/types";

export const Renderer: React.FC<{
  position: DetailLocationID | DetailLocationSidebarID;
  tab?: string;
}> = ({ position, tab }) => {
  const { getSurfaceComponents } = usePluginStore();
  const entries = getSurfaceComponents(position, tab);

  return (
    <>
      {entries.map(({ key, component: Component }) => (
        <React.Fragment key={key}>
          <Component />
        </React.Fragment>
      ))}
    </>
  );
};
