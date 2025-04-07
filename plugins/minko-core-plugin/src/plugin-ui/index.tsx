import { BASE_GROUP_ID, createDeenruvUIPlugin } from "@deenruv/react-ui-devkit";
import { BarChart, Camera, LanguagesIcon } from "lucide-react";
import { translationNS } from "./translation-ns";

export const UIPlugin = createDeenruvUIPlugin({
  version: "1.0.0",
  name: "Minko Core Plugin",
  // pages,
  // widgets,
  // translations: {
  //     ns: translationNS,
  //     data: { en, pl },
  // },
});
