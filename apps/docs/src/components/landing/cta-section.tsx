'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CtaSection() {
  return (
    <section className="relative py-32 md:py-40 lg:py-48 px-6">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fd-border/50 to-transparent" />

      {/* Clean background */}
      <div className="absolute inset-0 bg-fd-muted/30" />

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.1] mb-6"
          >
            Ready to build with Deenruv?
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-fd-muted-foreground mb-12"
          >
            Start building your next e-commerce project today.
          </motion.p>

          {/* CTA Buttons - matching hero style exactly */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            {/* Primary Button - matches hero */}
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

            {/* Secondary Button - matches hero */}
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
    </section>
  );
}
