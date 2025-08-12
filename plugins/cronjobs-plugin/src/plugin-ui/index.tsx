import { createDeenruvUIPlugin } from "@deenruv/react-ui-devkit";
import pl from "./locales/pl/translations.json";
import en from "./locales/en/translations.json";
import { TimerIcon } from "lucide-react";
import { CronJobsPage } from "./pages/CronJobsPage.js";
import React from "react";
import { TRANSLATION_NAMESPACE } from "./constants";

export const CronJobsPluginUI = createDeenruvUIPlugin({
  version: "1.0.0",
  name: "CronJobs Plugin",
  translations: {
    ns: TRANSLATION_NAMESPACE,
    data: { en, pl },
  },
  navMenuLinks: [
    {
      groupId: "settings-group",
      href: "",
      icon: TimerIcon,
      id: "cronjobs-link",
      labelId: "cronjobs-link",
    },
  ],
  pages: [{ element: <CronJobsPage />, path: "" }],
});
