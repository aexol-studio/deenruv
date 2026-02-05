import {
  Navigation,
  HeroSection,
  FeaturesSection,
  StatsSection,
  HowItWorksSection,
  CtaSection,
  FooterSection,
} from '@/components/landing';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-fd-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
