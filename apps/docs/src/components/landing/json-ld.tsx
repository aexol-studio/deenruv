import type { Lang } from "./translations";

export function JsonLd({ lang }: { lang: Lang }) {
  const baseUrl = "https://deenruv.com";

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Deenruv",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      lang === "pl"
        ? "Open-source platforma headless e-commerce stworzona dla deweloperow."
        : "Open-source headless e-commerce platform built for developers.",
    sameAs: ["https://github.com/aexol-studio/deenruv"],
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Deenruv",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux",
    description:
      lang === "pl"
        ? "Open-source platforma headless e-commerce z TypeScript, GraphQL i architektura wtyczek."
        : "Open-source headless e-commerce platform with TypeScript, GraphQL, and plugin architecture.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "TypeScript-first development",
      "GraphQL-native API",
      "Plugin architecture",
      "Multi-tenant support",
      "React admin panel",
      "Enterprise security (RBAC)",
      "Redis caching",
      "Headless by design",
    ],
    downloadUrl: "https://www.npmjs.com/package/@deenruv/core",
    installUrl: `${baseUrl}/${lang}/docs/guides/getting-started/installation`,
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity:
      lang === "pl"
        ? [
            {
              "@type": "Question",
              name: "Czym jest Deenruv?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Deenruv to open-source platforma headless e-commerce zbudowana na NestJS i GraphQL. Jest zaprojektowana dla deweloperow, z pelnym bezpieczenstwem typow TypeScript i architektura wtyczek.",
              },
            },
            {
              "@type": "Question",
              name: "Czy Deenruv jest darmowy?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Tak, Deenruv jest w pelni open source i darmowy do uzytku komercyjnego i osobistego.",
              },
            },
            {
              "@type": "Question",
              name: "Jak zainstalowac Deenruv?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Mozesz zainstalowac Deenruv za pomoca npx: npx create-deenruv-app@latest. Szczegoly znajdziesz w dokumentacji.",
              },
            },
          ]
        : [
            {
              "@type": "Question",
              name: "What is Deenruv?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Deenruv is an open-source headless e-commerce platform built on NestJS and GraphQL. It is designed for developers with full TypeScript type safety and a plugin architecture.",
              },
            },
            {
              "@type": "Question",
              name: "Is Deenruv free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, Deenruv is fully open source and free for both commercial and personal use.",
              },
            },
            {
              "@type": "Question",
              name: "How do I install Deenruv?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "You can install Deenruv using npx: npx create-deenruv-app@latest. See the documentation for detailed instructions.",
              },
            },
          ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Deenruv",
    url: baseUrl,
    description:
      lang === "pl"
        ? "Open-source platforma headless e-commerce dla deweloperow"
        : "Open-source headless e-commerce platform for developers",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/${lang}/docs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplication),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
