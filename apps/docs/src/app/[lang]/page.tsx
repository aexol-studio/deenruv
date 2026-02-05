import Link from 'next/link';

export default async function HomePage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;

  return (
    <main className="min-h-screen bg-gradient-to-b from-fd-background to-fd-muted">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-fd-border bg-fd-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <img src="/logo.webp" alt="Deenruv" className="h-8 w-auto" />
            <span className="text-xl font-bold">Deenruv</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              {lang === 'pl' ? 'Funkcje' : 'Features'}
            </Link>
            <Link
              href={`/${lang}/docs`}
              className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              {lang === 'pl' ? 'Dokumentacja' : 'Docs'}
            </Link>
            <Link
              href={`/${lang}/docs/guides/getting-started/installation`}
              className="rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors"
            >
              {lang === 'pl' ? 'Rozpocznij' : 'Get Started'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-fd-primary to-purple-500 bg-clip-text text-transparent">
              Deenruv
            </span>
          </h1>
          <p className="mt-4 text-2xl font-medium text-fd-muted-foreground sm:text-3xl">
            {lang === 'pl' ? 'Nowoczesna Platforma E-commerce' : 'Modern E-commerce Platform'}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-fd-muted-foreground">
            {lang === 'pl'
              ? 'Elastyczny, headless framework e-commerce zbudowany na NestJS i GraphQL. Gotowy dla enterprise, przyjazny deweloperom, nieskończenie rozszerzalny.'
              : 'A flexible, headless e-commerce framework built on NestJS and GraphQL. Enterprise-ready, developer-friendly, infinitely extensible.'}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${lang}/docs/guides/getting-started/installation`}
              className="inline-flex items-center justify-center rounded-lg bg-fd-primary px-8 py-3 text-lg font-medium text-fd-primary-foreground shadow-lg hover:bg-fd-primary/90 transition-all hover:scale-105"
            >
              {lang === 'pl' ? 'Rozpocznij' : 'Get Started'}
            </Link>
            <Link
              href={`/${lang}/docs`}
              className="inline-flex items-center justify-center rounded-lg border border-fd-border px-8 py-3 text-lg font-medium hover:bg-fd-muted transition-colors"
            >
              {lang === 'pl' ? 'Czytaj dokumentację' : 'Read Docs'}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          {lang === 'pl' ? 'Stworzony dla Nowoczesnego Handlu' : 'Built for Modern Commerce'}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-fd-muted-foreground">
          {lang === 'pl'
            ? 'Wszystko, czego potrzebujesz do budowania światowej klasy doświadczeń e-commerce'
            : 'Everything you need to build world-class e-commerce experiences'}
        </p>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {getFeatures(lang).map((feature, i) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-fd-border bg-fd-card p-6 transition-all hover:shadow-lg hover:border-fd-primary/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary font-bold">
                0{i + 1}
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-fd-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-fd-border bg-fd-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            {lang === 'pl' ? 'Zaufany przez deweloperów na całym świecie' : 'Trusted by developers worldwide'}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-fd-muted-foreground">
            {lang === 'pl' ? 'Budujemy przyszłość z nowoczesnym e-commerce' : 'Building the future with modern e-commerce'}
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {getStats(lang).map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-fd-primary">{stat.value}</div>
                <div className="mt-2 text-fd-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            {lang === 'pl' ? 'Gotowy budować z Deenruv?' : 'Ready to build with Deenruv?'}
          </h2>
          <p className="mt-4 text-lg text-fd-muted-foreground">
            {lang === 'pl'
              ? 'Zacznij budować swój następny projekt e-commerce już dziś.'
              : 'Start building your next e-commerce project today.'}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${lang}/docs/guides/getting-started/installation`}
              className="inline-flex items-center justify-center rounded-lg bg-fd-primary px-8 py-3 text-lg font-medium text-fd-primary-foreground shadow-lg hover:bg-fd-primary/90 transition-all"
            >
              {lang === 'pl' ? 'Rozpocznij' : 'Get Started'}
            </Link>
            <Link
              href={`/${lang}/docs`}
              className="inline-flex items-center justify-center rounded-lg border border-fd-border px-8 py-3 text-lg font-medium hover:bg-fd-muted transition-colors"
            >
              {lang === 'pl' ? 'Czytaj dokumentację' : 'Read Docs'}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-fd-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <img src="/logo.webp" alt="Deenruv" className="h-6 w-auto" />
              <span className="font-semibold">Deenruv</span>
            </div>
            <div className="flex gap-6 text-sm text-fd-muted-foreground">
              <Link href={`/${lang}/docs`} className="hover:text-fd-foreground transition-colors">
                {lang === 'pl' ? 'Dokumentacja' : 'Documentation'}
              </Link>
              <Link
                href="https://github.com/aexol-studio/deenruv"
                className="hover:text-fd-foreground transition-colors"
              >
                GitHub
              </Link>
            </div>
            <p className="text-sm text-fd-muted-foreground">
              © {new Date().getFullYear()} Deenruv.{' '}
              {lang === 'pl' ? 'Wszelkie prawa zastrzeżone.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function getFeatures(lang: string) {
  if (lang === 'pl') {
    return [
      {
        title: 'GraphQL First',
        description: 'Potężne API GraphQL z pełnym bezpieczeństwem typów i doskonałym doświadczeniem deweloperskim.',
      },
      {
        title: 'Architektura Wtyczek',
        description: 'Rozszerzaj funkcjonalność za pomocą wtyczek. Dodawaj płatności, wysyłkę lub własne funkcje.',
      },
      {
        title: 'Multi-channel',
        description: 'Zarządzaj wieloma sklepami, walutami i językami z jednego backendu.',
      },
      {
        title: 'Panel Admina',
        description: 'Piękny, rozszerzalny interfejs admina zbudowany w React. Dostosuj wszystko.',
      },
    ];
  }
  return [
    {
      title: 'GraphQL First',
      description: 'Powerful GraphQL API with full type safety and excellent developer experience.',
    },
    {
      title: 'Plugin Architecture',
      description: 'Extend functionality with plugins. Add payments, shipping, or custom features.',
    },
    {
      title: 'Multi-channel',
      description: 'Manage multiple storefronts, currencies, and languages from one backend.',
    },
    {
      title: 'Admin Dashboard',
      description: 'Beautiful, extensible admin UI built with React. Customize everything.',
    },
  ];
}

function getStats(lang: string) {
  if (lang === 'pl') {
    return [
      { value: '10K+', label: 'Deweloperów' },
      { value: '1M+', label: 'Wywołań API/Miesiąc' },
      { value: '99.9%', label: 'Uptime' },
      { value: '50+', label: 'Krajów' },
    ];
  }
  return [
    { value: '10K+', label: 'Developers' },
    { value: '1M+', label: 'API Calls/Month' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50+', label: 'Countries' },
  ];
}
