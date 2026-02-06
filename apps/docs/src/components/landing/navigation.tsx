"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Github, Globe, Menu, Star, X } from "lucide-react";
import { t, type Lang } from "./translations";

export function Navigation({ lang = "en" }: { lang?: Lang }) {
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const text = t("navigation", lang);
  const linkPrefix = `/${lang}`;
  const otherLang = lang === "en" ? "pl" : "en";

  const [starCount, setStarCount] = useState<number>(9);

  useEffect(() => {
    fetch("https://api.github.com/repos/aexol-studio/deenruv")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (typeof data.stargazers_count === "number") {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {
        // Fallback already set to 9
      });
  }, []);

  const navLinks = [
    { href: "#features", label: text.features, anchor: true },
    { href: `${linkPrefix}/docs`, label: text.docs },
  ];

  const onScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
      setVisible(true);
    } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      setVisible(false);
      setMobileMenuOpen(false);
    }

    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={`mx-auto max-w-7xl px-4 py-4 transition-all duration-300 ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl px-5 py-3 lg:px-8">
          {/* Logo */}
          <Link href={linkPrefix} className="flex items-center gap-2.5">
            <img src="/logo-filled.svg" alt="Deenruv" className="h-9 w-9" />
            <span className="text-base font-semibold text-white">Deenruv</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.anchor ? (
                <button
                  key={link.href}
                  onClick={() => {
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-5 py-2.5 text-base text-zinc-400 hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-5 py-2.5 text-base text-zinc-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* GitHub */}
            <Link
              href="https://github.com/aexol-studio/deenruv"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="inline-flex items-center gap-0.5 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                {starCount}
              </span>
            </Link>

            {/* Language switcher */}
            <Link
              href={`/${otherLang}`}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
              title={otherLang === "pl" ? "Polski" : "English"}
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="uppercase font-medium">{otherLang}</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-zinc-400 hover:text-white"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* CTA */}
            <Link
              href={`${linkPrefix}/docs/guides/getting-started/installation`}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-base font-medium text-zinc-900 hover:bg-zinc-200 transition-colors"
            >
              {text.getStarted}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mt-2 rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl p-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) =>
                link.anchor ? (
                  <button
                    key={link.href}
                    onClick={() => {
                      document
                        .getElementById("features")
                        ?.scrollIntoView({ behavior: "smooth" });
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-left text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ),
              )}

              {/* Mobile language switcher */}
              <Link
                href={`/${otherLang}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <Globe className="h-4 w-4" />
                {otherLang === "pl" ? "Polski" : "English"}
              </Link>

              {/* Mobile GitHub */}
              <Link
                href="https://github.com/aexol-studio/deenruv"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub
                <span className="inline-flex items-center gap-0.5 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {starCount}
                </span>
              </Link>

              <Link
                href={`${linkPrefix}/docs/guides/getting-started/installation`}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-zinc-900"
              >
                {text.getStarted}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
