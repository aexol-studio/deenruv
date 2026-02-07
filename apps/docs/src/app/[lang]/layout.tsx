import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { defineI18nUI } from "fumadocs-ui/i18n";
import { i18n } from "@/lib/i18n";
import { getMetadataBase } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });

const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: "English",
    },
    pl: {
      displayName: "Polski",
      search: "Szukaj w dokumentacji",
      searchNoResult: "Brak wyników",
      toc: "Na tej stronie",
      tocNoHeadings: "Brak nagłówków",
      lastUpdate: "Ostatnia aktualizacja",
      chooseTheme: "Wybierz motyw",
      nextPage: "Następna strona",
      previousPage: "Poprzednia strona",
      chooseLanguage: "Wybierz język",
    },
  },
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "Deenruv - Open Source Headless E-commerce",
    template: "%s | Deenruv",
  },
  description:
    "Open-source headless e-commerce platform built for developers. TypeScript-first, GraphQL-native, infinitely extensible.",
};

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <RootProvider i18n={provider(lang)}>{children}</RootProvider>
      </body>
    </html>
  );
}
