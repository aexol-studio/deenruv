import { Card, CardContent } from "@deenruv/react-ui-devkit";
import React from "react";
import { UpsellSelect } from "../components/UpsellSelect";

export const ExtrasPage = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <UpsellSelect />
      </CardContent>
    </Card>
  );
};
