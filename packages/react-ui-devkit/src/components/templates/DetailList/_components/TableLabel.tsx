import React, { PropsWithChildren } from "react";

export const TABLE_LABEL_STYLES =
  "whitespace-nowrap text-[11px] font-semibold uppercase leading-none tracking-[0.04em] text-muted-foreground";

export const TableLabel: React.FC<PropsWithChildren> = ({ children }) => (
  <span className={TABLE_LABEL_STYLES}>{children}</span>
);
