import { CircleCheck, CircleX } from "lucide-react";
import React from "react";

export const BooleanCell: React.FC<{ value: boolean }> = ({ value }) => {
  const size = 20;
  return value ? (
    <CircleCheck className="text-green-600" {...{ size }} />
  ) : (
    <CircleX className="text-red-600" {...{ size }} />
  );
};
