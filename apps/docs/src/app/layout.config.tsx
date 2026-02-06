import { Github } from "lucide-react";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <img src="/logo-filled.svg" alt="Deenruv" className="h-6 w-auto" />
        <span className="font-semibold">Deenruv</span>
      </>
    ),
    url: "/",
  },
  links: [
    {
      text: "Documentation",
      url: "/docs",
      active: "nested-url",
    },
    {
      type: "icon",
      label: "GitHub",
      icon: <Github />,
      text: "GitHub",
      url: "https://github.com/aexol-studio/deenruv",
    },
  ],
};
