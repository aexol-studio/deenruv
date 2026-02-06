import { i18n } from "@/lib/i18n";
import { Github } from "lucide-react";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    i18n,
    nav: {
      title: (
        <>
          <img src="/logo-filled.svg" alt="Deenruv" className="h-6 w-auto" />
          <span className="font-semibold">Deenruv</span>
        </>
      ),
      url: `/${locale}`,
    },
    links: [
      {
        text: locale === "pl" ? "Dokumentacja" : "Documentation",
        url: `/${locale}/docs`,
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
}
