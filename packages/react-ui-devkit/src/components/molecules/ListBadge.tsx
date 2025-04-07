import { Badge, BadgeProps } from "@/components/atoms/badge.js";
import React from "react";

export const ListBadge = (props: BadgeProps) => {
  return (
    <Badge
      {...props}
      className={`text-muted-foreground flex w-fit items-center justify-center whitespace-nowrap rounded-md py-1 ${props.className}`}
      variant="outline"
    />
  );
};

export default ListBadge;
