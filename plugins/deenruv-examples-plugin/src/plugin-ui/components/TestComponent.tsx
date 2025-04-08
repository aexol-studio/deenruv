import React from "react";
import { translationNS } from "../translation-ns";
import {
  useTranslation,
  Card,
  CardContent,
  CardHeader,
} from "@deenruv/react-ui-devkit";

export const TestComponent = () => {
  const { t } = useTranslation(translationNS);
  return (
    <Card>
      <CardHeader>
        <div>Some Test Component from plugin</div>
      </CardHeader>
      <CardContent>
        <div>{t("nav.link")}</div>
      </CardContent>
    </Card>
  );
};
