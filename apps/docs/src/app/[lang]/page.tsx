import type { Metadata } from "next";
import {
  Navigation,
  HeroSection,
  TechLogos,
  FeaturesSection,
  WorkflowSection,
  SecuritySection,
  TestimonialsSection,
  CtaSection,
  FooterSection,
  JsonLd,
} from "@/components/landing";
import type { Lang } from "@/components/landing/translations";
import { i18n } from "@/lib/i18n";

const seoContent = {
  en: {
    title: "Deenruv - Open Source Headless E-commerce Platform for Developers",
    description:
      "Build modern e-commerce with Deenruv. TypeScript-first, GraphQL-native, plugin-based headless platform. Open source, enterprise-ready, infinitely extensible.",
    keywords:
      "headless e-commerce, open source e-commerce, TypeScript e-commerce, GraphQL e-commerce, headless commerce platform, NestJS e-commerce, React admin panel, plugin architecture, multi-tenant e-commerce, developer-first e-commerce, Deenruv",
  },
  pl: {
    title:
      "Deenruv - Open Source Platforma E-commerce Headless dla Deweloperów",
    description:
      "Buduj nowoczesny e-commerce z Deenruv. TypeScript-first, natywny GraphQL, architektura wtyczek. Open source, gotowy na enterprise, nieskończenie rozszerzalny.",
    keywords:
      "headless e-commerce, open source e-commerce, platforma e-commerce, TypeScript, GraphQL, NestJS, React panel admina, architektura wtyczek, multi-tenant, Deenruv",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const validLang = (["en", "pl"].includes(lang) ? lang : "en") as "en" | "pl";
  const seo = seoContent[validLang];
  const baseUrl = "https://deenruv.com";

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: "Aexol", url: "https://aexol.com" }],
    creator: "Aexol",
    publisher: "Deenruv",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "technology",
    alternates: {
      canonical: `${baseUrl}/${validLang}`,
      languages: {
        en: `${baseUrl}/en`,
        pl: `${baseUrl}/pl`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${validLang}`,
      siteName: "Deenruv",
      locale: validLang === "pl" ? "pl_PL" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = (
    (["en", "pl"] as string[]).includes(lang) ? lang : "en"
  ) as Lang;

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      <JsonLd lang={validLang} />
      <Navigation lang={validLang} />
      <HeroSection lang={validLang} />
      <TechLogos lang={validLang} />
      <FeaturesSection lang={validLang} />
      <WorkflowSection lang={validLang} />
      <SecuritySection lang={validLang} />
      <TestimonialsSection lang={validLang} />
      <CtaSection lang={validLang} />
      <FooterSection lang={validLang} />
    </div>
  );
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
