'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '/docs', label: 'Docs' },
  { href: '#how-it-works', label: 'How it Works' },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 100);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: scrolled ? 1 : 0,
          y: scrolled ? 0 : -20,
          pointerEvents: scrolled ? 'auto' : 'none',
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`flex h-14 w-full max-w-5xl items-center justify-between rounded-full px-4 md:px-6 transition-colors ${
          scrolled
            ? 'border border-fd-border/40 bg-fd-background/80 backdrop-blur-xl shadow-lg'
            : ''
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <img
            src="/logo.webp"
            alt="Deenruv"
            className="h-7 w-7 transition-transform duration-200 group-hover:scale-[1.02]"
          />
          <span className="text-sm font-semibold uppercase tracking-[0.08em] text-fd-foreground">
            Deenruv
          </span>
        </Link>

        {/* Center Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-3 py-2 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground group"
            >
              <span>{link.label}</span>
              <span className="absolute inset-x-3 -bottom-px h-px bg-fd-foreground scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Primary CTA */}
          <Link
            href="/docs/guides/getting-started/installation"
            className="group relative hidden sm:inline-flex items-center gap-2 h-9 px-5 text-sm font-semibold text-fd-primary-foreground bg-fd-primary rounded-full overflow-hidden transition-all duration-200 hover:bg-fd-primary/90"
            style={{
              boxShadow:
                '0 1px 2px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* Subtle inner shine */}
            <span className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5 pointer-events-none" />
            <span className="relative z-10">Get Started</span>
            <ArrowRight
              className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed inset-x-4 top-20 p-4 rounded-2xl border border-fd-border bg-fd-background/95 backdrop-blur-xl shadow-xl md:hidden"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/docs/guides/getting-started/installation"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-fd-primary-foreground bg-fd-primary rounded-lg"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
