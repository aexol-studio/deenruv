'use client';

import Link from 'next/link';

export function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-fd-border/50 py-16 md:py-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 md:flex-row md:items-start md:justify-between">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <img src="/logo.webp" alt="Deenruv" className="h-6 w-auto" />
            <p className="text-lg font-semibold tracking-[-0.02em] text-fd-foreground">
              Deenruv
            </p>
          </div>
          <p className="max-w-sm text-sm text-fd-muted-foreground leading-relaxed">
            Modern e-commerce platform for developers.
          </p>
        </div>

        {/* Links - minimal, just text links */}
        <div className="flex flex-col gap-4 text-sm md:flex-row md:items-center md:gap-8">
          <Link
            href="/docs"
            className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            Documentation
          </Link>
          <Link
            href="https://github.com/aexol-studio/deenruv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            GitHub
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto mt-10 max-w-5xl px-6 text-xs text-fd-muted-foreground/60">
        &copy; {year} Deenruv. All rights reserved.
      </div>
    </footer>
  );
}
