export type Lang = "en" | "pl";

export const translations = {
  navigation: {
    en: {
      features: "Features",
      docs: "Docs",
      github: "GitHub",
      getStarted: "Get started",
    },
    pl: {
      features: "Funkcje",
      docs: "Dokumentacja",
      github: "GitHub",
      getStarted: "Rozpocznij",
    },
  },
  hero: {
    en: {
      title: "The future of commerce",
      titleHighlight: "starts here",
      subtitle:
        "Headless e-commerce platform built for developers. TypeScript-first, GraphQL-native, infinitely extensible.",
      getStarted: "Get started",
      viewOnGitHub: "View on GitHub",
      // order flow animation
      newOrder: "New order received",
      orderNumber: "#ORD-2847",
      orderItems: "3 items",
      ordersToday: "Orders today",
      growth: "Growth",
      // flow nodes
      order: "Order",
      payment: "Payment",
      fulfillment: "Fulfillment",
      shipping: "Shipping",
      delivered: "Delivered",
      // flow node stat labels
      orderStatValue: "+1",
      orderStatLabel: "New order received",
      paymentStatValue: "$299.00",
      paymentStatLabel: "Payment confirmed",
      fulfillmentStatValue: "3 items",
      fulfillmentStatLabel: "Ready to ship",
      shippingStatValue: "DHL Express",
      shippingStatLabel: "In transit",
      deliveredStatValue: "Complete",
      deliveredStatLabel: "Order fulfilled",
      // Entry channels
      mobileApp: "Mobile App",
      webStore: "Web Store",
      pos: "POS",
      // Delivery methods
      courier: "Courier",
      paczkomat: "Parcel Locker",
      // Updated toast
      newOrderFrom: "New order from",
      // Stats for new nodes
      mobileStatValue: "142",
      mobileStatLabel: "Mobile orders",
      webStatValue: "389",
      webStatLabel: "Web orders",
      posStatValue: "67",
      posStatLabel: "In-store orders",
      courierStatValue: "DHL Express",
      courierStatLabel: "Express delivery",
      packStatValue: "InPost",
      packStatLabel: "Parcel locker",
      paymentReceived: "Payment received",
    },
    pl: {
      title: "Przyszlo\u015B\u0107 handlu",
      titleHighlight: "zaczyna si\u0119 tutaj",
      subtitle:
        "Platforma e-commerce headless stworzona dla programist\u00F3w. TypeScript-first, natywny GraphQL, niesko\u0144czenie rozszerzalna.",
      getStarted: "Rozpocznij",
      viewOnGitHub: "Zobacz na GitHub",
      newOrder: "Nowe zam\u00F3wienie",
      orderNumber: "#ORD-2847",
      orderItems: "3 przedmioty",
      ordersToday: "Zam\u00F3wienia dzi\u015B",
      growth: "Wzrost",
      order: "Zam\u00F3wienie",
      payment: "P\u0142atno\u015B\u0107",
      fulfillment: "Realizacja",
      shipping: "Wysy\u0142ka",
      delivered: "Dostarczono",
      orderStatValue: "+1",
      orderStatLabel: "Nowe zam\u00F3wienie",
      paymentStatValue: "$299.00",
      paymentStatLabel: "P\u0142atno\u015B\u0107 potwierdzona",
      fulfillmentStatValue: "3 przedmioty",
      fulfillmentStatLabel: "Gotowe do wysy\u0142ki",
      shippingStatValue: "DHL Express",
      shippingStatLabel: "W transporcie",
      deliveredStatValue: "Uko\u0144czono",
      deliveredStatLabel: "Zam\u00F3wienie zrealizowane",
      // Entry channels
      mobileApp: "Aplikacja mobilna",
      webStore: "Sklep WWW",
      pos: "Sklep stacjonarny",
      // Delivery methods
      courier: "Kurier",
      paczkomat: "Paczkomat",
      // Updated toast
      newOrderFrom: "Nowe zamówienie z",
      // Stats for new nodes
      mobileStatValue: "142",
      mobileStatLabel: "Zamówienia mobilne",
      webStatValue: "389",
      webStatLabel: "Zamówienia web",
      posStatValue: "67",
      posStatLabel: "Zamówienia stacjonarne",
      courierStatValue: "DHL Express",
      courierStatLabel: "Dostawa ekspresowa",
      packStatValue: "InPost",
      packStatLabel: "Paczkomat",
      paymentReceived: "Płatność otrzymana",
    },
  },
  techLogos: {
    en: { subtitle: "Built with technologies you love" },
    pl: { subtitle: "Zbudowany z technologii, kt\u00F3re kochasz" },
  },
  features: {
    en: {
      title: "Everything you need to build modern commerce",
      subtitle:
        "Deenruv equips you for power, speed, and flexibility to build any commerce experience.",
      items: [
        {
          title: "TypeScript First",
          description:
            "Complete type safety across your entire stack. IntelliSense everywhere, catch errors at compile time.",
        },
        {
          title: "GraphQL Native",
          description:
            "Powerful API gateway with full type generation, subscriptions, and blazing-fast resolvers.",
        },
        {
          title: "Plugin Architecture",
          description:
            "Add any capability with plugins \u2014 payments, shipping, search, custom logic, and more.",
        },
        {
          title: "Multi-tenant Ready",
          description:
            "Run multiple stores from a single installation with isolated data and shared resources.",
        },
        {
          title: "Blazing Fast",
          description:
            "Optimized query batching, Redis caching, and CDN-ready responses for sub-50ms API times.",
        },
        {
          title: "Enterprise Security",
          description:
            "Built-in RBAC, secure API keys, rate limiting, CORS policies, and audit logging.",
        },
        {
          title: "Headless by Design",
          description:
            "Complete freedom to build any frontend \u2014 React, Vue, Mobile, or any technology.",
        },
        {
          title: "Developer Experience",
          description:
            "Hot reload, auto-generated types, comprehensive CLI, detailed docs, and active community.",
        },
      ],
    },
    pl: {
      title: "Wszystko czego potrzebujesz do nowoczesnego handlu",
      subtitle:
        "Deenruv daje Ci moc, szybko\u015B\u0107 i elastyczno\u015B\u0107 do budowania dowolnych do\u015Bwiadcze\u0144 e-commerce.",
      items: [
        {
          title: "TypeScript First",
          description:
            "Pe\u0142ne bezpiecze\u0144stwo typ\u00F3w w ca\u0142ym stacku. IntelliSense wsz\u0119dzie, \u0142ap b\u0142\u0119dy w czasie kompilacji.",
        },
        {
          title: "Natywny GraphQL",
          description:
            "Pot\u0119\u017Cna brama API z pe\u0142n\u0105 generacj\u0105 typ\u00F3w, subskrypcjami i b\u0142yskawicznymi resolverami.",
        },
        {
          title: "Architektura Wtyczek",
          description:
            "Dodaj dowolne mo\u017Cliwo\u015Bci za pomoc\u0105 wtyczek \u2014 p\u0142atno\u015Bci, wysy\u0142ka, wyszukiwanie, w\u0142asna logika.",
        },
        {
          title: "Multi-tenant Ready",
          description:
            "Uruchom wiele sklep\u00F3w z jednej instalacji z izolowanymi danymi i wsp\u00F3\u0142dzielonymi zasobami.",
        },
        {
          title: "B\u0142yskawiczna Szybko\u015B\u0107",
          description:
            "Optymalizowane grupowanie zapyta\u0144, cache Redis i odpowiedzi gotowe na CDN poni\u017Cej 50ms.",
        },
        {
          title: "Bezpiecze\u0144stwo Enterprise",
          description:
            "Wbudowany RBAC, bezpieczne klucze API, rate limiting, polityki CORS i logowanie audytu.",
        },
        {
          title: "Headless z Natury",
          description:
            "Pe\u0142na swoboda budowania dowolnego frontendu \u2014 React, Vue, Mobile, dowolna technologia.",
        },
        {
          title: "Developer Experience",
          description:
            "Hot reload, auto-generowane typy, CLI, szczeg\u00F3\u0142owa dokumentacja i aktywna spo\u0142eczno\u015B\u0107.",
        },
      ],
    },
  },
  workflow: {
    en: {
      title: "Accelerate your entire workflow",
      subtitle: "From first line of code to production deployment.",
      tabs: [
        {
          title: "Code",
          description:
            "Get started in minutes with our CLI. Scaffold projects, generate types, and build with full IntelliSense support.",
        },
        {
          title: "Configure",
          description:
            "Customize every aspect of your store through type-safe configuration. No guesswork, just IntelliSense.",
        },
        {
          title: "Extend",
          description:
            "Build custom plugins with our powerful API. Add payments, shipping, search, or any business logic.",
        },
        {
          title: "Deploy",
          description:
            "Deploy anywhere \u2014 Docker, Kubernetes, serverless. Built for horizontal scaling and high availability.",
        },
        {
          title: "Secure",
          description:
            "Enterprise-grade security out of the box. RBAC, API keys, rate limiting, and comprehensive audit logging.",
        },
      ],
    },
    pl: {
      title: "Przyspiesz ca\u0142y sw\u00F3j workflow",
      subtitle: "Od pierwszej linii kodu do wdro\u017Cenia produkcyjnego.",
      tabs: [
        {
          title: "Koduj",
          description:
            "Zacznij w kilka minut z naszym CLI. Tw\u00F3rz projekty, generuj typy i buduj z pe\u0142nym wsparciem IntelliSense.",
        },
        {
          title: "Konfiguruj",
          description:
            "Dostosuj ka\u017Cdy aspekt sklepu przez konfiguracj\u0119 z typami. Bez zgadywania, same podpowiedzi.",
        },
        {
          title: "Rozszerzaj",
          description:
            "Buduj w\u0142asne wtyczki z naszym pot\u0119\u017Cnym API. Dodaj p\u0142atno\u015Bci, wysy\u0142k\u0119, wyszukiwanie lub dowoln\u0105 logik\u0119.",
        },
        {
          title: "Wdra\u017Caj",
          description:
            "Wdra\u017Caj gdziekolwiek \u2014 Docker, Kubernetes, serverless. Stworzony do skalowania horyzontalnego.",
        },
        {
          title: "Zabezpieczaj",
          description:
            "Bezpiecze\u0144stwo klasy enterprise od razu. RBAC, klucze API, rate limiting i pe\u0142ne logowanie audytu.",
        },
      ],
    },
  },
  security: {
    en: {
      badge: "Security",
      title: "Built-in security where found means fixed",
      description:
        "Every layer is protected by default. We believe that every security issue found should be immediately addressed, not left for later.",
      checks: [
        "Role-based access control for every user",
        "Secure password hashing with bcrypt (10,000+ rounds)",
        "SQL injection and XSS prevention built-in",
        "CORS configuration out of the box",
      ],
      tableHeaders: { resource: "Resource", status: "Status" },
      tableRows: [
        { resource: "Authentication", status: "Full suite" },
        { resource: "API endpoints", status: "Secured" },
        { resource: "Database", status: "Encrypted" },
        { resource: "File storage", status: "Private by default" },
        { resource: "Admin access", status: "RBAC enabled" },
      ],
      lastScan: "Last security scan",
      lastScanTime: "2 minutes ago",
      allPassed: "All checks passed",
    },
    pl: {
      badge: "Bezpiecze\u0144stwo",
      title: "Wbudowane bezpiecze\u0144stwo \u2014 znalezione to naprawione",
      description:
        "Ka\u017Cda warstwa jest domy\u015Blnie chroniona. Wierzymy, \u017Ce ka\u017Cdy znaleziony problem bezpiecze\u0144stwa powinien by\u0107 natychmiast naprawiony.",
      checks: [
        "Kontrola dost\u0119pu oparta na rolach dla ka\u017Cdego u\u017Cytkownika",
        "Bezpieczne hashowanie hase\u0142 z bcrypt (10 000+ rund)",
        "Wbudowana ochrona przed SQL injection i XSS",
        "Konfiguracja CORS dost\u0119pna od razu",
      ],
      tableHeaders: { resource: "Zas\u00F3b", status: "Status" },
      tableRows: [
        { resource: "Uwierzytelnianie", status: "Pe\u0142ny pakiet" },
        { resource: "Endpointy API", status: "Zabezpieczone" },
        { resource: "Baza danych", status: "Szyfrowana" },
        { resource: "Pliki", status: "Prywatne domy\u015Blnie" },
        { resource: "Panel admina", status: "RBAC w\u0142\u0105czony" },
      ],
      lastScan: "Ostatni skan bezpiecze\u0144stwa",
      lastScanTime: "2 minuty temu",
      allPassed: "Wszystkie testy przesz\u0142y",
    },
  },
  testimonials: {
    en: {
      badge: "Case Studies",
      title: "Real results from real stores",
      caseStudies: [
        {
          company: "magicznyrynek.pl",
          industry: "TCG & Board Games",
          statValue: "+4344%",
          statLabel: "Revenue Growth",
          quote:
            "After migrating to Deenruv, we saw immediate improvements in performance and developer velocity. Managing thousands of MTG and Pokémon card listings became effortless.",
          author: "Magiczny Rynek",
          role: "TCG Store, Białystok",
        },
        {
          company: "samarite.eu",
          industry: "Premium Cosmetics",
          statValue: "28",
          statLabel: "Countries Served",
          quote:
            "Deenruv powers our multi-country e-commerce with seamless localization across the EU and beyond. From our Westfield Mokotów boutique to worldwide shipping — one platform handles it all.",
          author: "Samarité",
          role: "Slavic Skincare Brand, Warsaw",
        },
      ],
    },
    pl: {
      badge: "Case Studies",
      title: "Prawdziwe wyniki z prawdziwych sklepów",
      caseStudies: [
        {
          company: "magicznyrynek.pl",
          industry: "Karty kolekcjonerskie i gry",
          statValue: "+4344%",
          statLabel: "Wzrost przychodów",
          quote:
            "Po migracji na Deenruv od razu zauważyliśmy poprawę wydajności i szybkości pracy zespołu. Zarządzanie tysiącami kart MTG i Pokémon stało się bezproblemowe.",
          author: "Magiczny Rynek",
          role: "Sklep TCG, Białystok",
        },
        {
          company: "samarite.eu",
          industry: "Kosmetyki premium",
          statValue: "28",
          statLabel: "Obsługiwanych krajów",
          quote:
            "Deenruv napędza nasz wielokrajowy e-commerce z płynną lokalizacją w całej UE i poza nią. Od butiku w Westfield Mokotów po wysyłkę na cały świat — jedna platforma obsługuje wszystko.",
          author: "Samarité",
          role: "Słowiańska marka kosmetyczna, Warszawa",
        },
      ],
    },
  },
  cta: {
    en: {
      title: "Ready to build something amazing?",
      subtitle:
        "Join thousands of developers who chose Deenruv for their e-commerce projects. Open source. Forever free to start.",
      getStarted: "Get started",
      starOnGitHub: "Leave a star",
    },
    pl: {
      title: "Gotowy zbudowa\u0107 co\u015B niesamowitego?",
      subtitle:
        "Do\u0142\u0105cz do tysi\u0119cy deweloper\u00F3w, kt\u00F3rzy wybrali Deenruv do swoich projekt\u00F3w e-commerce. Open source. Na zawsze darmowy na start.",
      getStarted: "Rozpocznij",
      starOnGitHub: "Zostaw gwiazdkę",
    },
  },
  footer: {
    en: {
      description:
        "The open-source headless e-commerce platform built for developers who demand the best.",
      platform: "Platform",
      resources: "Resources",
      company: "Company",
      legal: "Legal",
      // platform items
      features: "Features",
      documentation: "Documentation",
      changelog: "Changelog",
      // resources items
      gettingStarted: "Getting Started",
      apiReference: "API Reference",
      plugins: "Plugins",
      examples: "Examples",
      // company items
      about: "About",
      blog: "Blog",
      careers: "Careers",
      contact: "Contact",
      // legal items
      privacy: "Privacy",
      terms: "Terms",
      license: "License",
      allRightsReserved: "All rights reserved.",
      madeWith: "Made with",
      by: "by",
    },
    pl: {
      description:
        "Open-source'owa platforma headless e-commerce stworzona dla programist\u00F3w, kt\u00F3rzy wymagaj\u0105 najlepszego.",
      platform: "Platforma",
      resources: "Zasoby",
      company: "Firma",
      legal: "Prawne",
      features: "Funkcje",
      documentation: "Dokumentacja",
      changelog: "Changelog",
      gettingStarted: "Pierwsze kroki",
      apiReference: "Referencja API",
      plugins: "Wtyczki",
      examples: "Przyk\u0142ady",
      about: "O nas",
      blog: "Blog",
      careers: "Kariera",
      contact: "Kontakt",
      privacy: "Prywatno\u015B\u0107",
      terms: "Regulamin",
      license: "Licencja",
      allRightsReserved: "Wszelkie prawa zastrze\u017Cone.",
      madeWith: "Stworzone z",
      by: "przez",
    },
  },
} as const;

export function t<S extends keyof typeof translations>(
  section: S,
  lang: Lang,
): (typeof translations)[S]["en"] {
  return (translations[section][lang] ??
    translations[section]["en"]) as (typeof translations)[S]["en"];
}
