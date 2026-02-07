import { Github } from "lucide-react";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

const version = process.env.NEXT_PUBLIC_DEENRUV_VERSION;

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <img src="/logo-filled.svg" alt="Deenruv" className="h-6 w-auto" />
        <span className="font-semibold">Deenruv</span>
        {version && (
          <span className="ml-1 rounded bg-fd-muted px-1.5 py-0.5 text-[10px] font-medium text-fd-muted-foreground">
            v{version}
          </span>
        )}
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
