'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Animated background with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-fd-background via-fd-background to-fd-muted" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-fd-background/80 via-transparent to-fd-background/20" />
      </motion.div>

      {/* Main content - centered */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 w-full"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
            {/* Logo above title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <img
                src="/logo.webp"
                alt="Deenruv"
                className="h-20 w-auto md:h-24 lg:h-28"
              />
            </motion.div>

            {/* Main headline - MASSIVE with gradient effect */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-bold tracking-[-0.04em] text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-[0.85] bg-gradient-to-b from-fd-foreground via-fd-foreground/80 to-fd-foreground/40 bg-clip-text text-transparent"
            >
              Deenruv
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 md:mt-8 font-medium tracking-[-0.02em] text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-fd-foreground/80"
            >
              Modern E-commerce Platform
            </motion.p>

            {/* Description - more visible tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 md:mt-8 max-w-xl text-lg md:text-xl text-fd-foreground/70 font-medium leading-relaxed"
            >
              A flexible, headless e-commerce framework built on NestJS and GraphQL.
              Enterprise-ready, developer-friendly, infinitely extensible.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 items-center"
            >
              {/* Primary Button - Get Started */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <Link
                  href="/docs/guides/getting-started/installation"
                  className="relative flex items-center gap-3 px-10 h-14 text-base font-semibold text-fd-primary-foreground bg-fd-primary rounded-full overflow-hidden transition-all duration-200 hover:bg-fd-primary/90"
                  style={{
                    boxShadow:
                      '0 1px 2px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Subtle inner shine */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5 pointer-events-none" />

                  <span className="relative z-10">Get Started</span>
                  <ArrowRight
                    className="relative z-10 h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </motion.div>

              {/* Secondary Button - Read Docs */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <Link
                  href="/docs"
                  className="relative flex items-center justify-center gap-2 px-10 h-14 text-base font-semibold text-fd-foreground/80 rounded-full border border-fd-foreground/15 bg-fd-foreground/[0.03] overflow-hidden transition-all duration-200 hover:border-fd-foreground/25 hover:bg-fd-foreground/[0.06] hover:text-fd-foreground"
                  style={{
                    boxShadow:
                      '0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.03)',
                  }}
                >
                  <span className="relative z-10">Read Docs</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-fd-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
