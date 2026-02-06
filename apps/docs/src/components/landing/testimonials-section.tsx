"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { t, type Lang } from "./translations";
import { usePageVisible } from "./use-page-visible";

const STAT_ICONS = [TrendingUp, Globe];

export function TestimonialsSection({ lang = "en" }: { lang?: Lang }) {
  const [active, setActive] = useState(0);
  const text = t("testimonials", lang);
  const studies = text.caseStudies;
  const pageVisible = usePageVisible();

  useEffect(() => {
    // Don't run the carousel timer when page is hidden
    if (!pageVisible) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % studies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [studies.length, pageVisible]);

  const prev = () => setActive((active - 1 + studies.length) % studies.length);
  const next = () => setActive((active + 1) % studies.length);

  const study = studies[active];
  const StatIcon = STAT_ICONS[active] ?? TrendingUp;

  return (
    <section className="relative py-24 lg:py-32">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-cyan-400">
            {text.badge}
          </p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {text.title}
          </h2>
        </div>

        {/* Carousel */}
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 lg:p-12">
            {/* Company */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                {study.company[0].toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-white text-lg">
                  {study.company}
                </div>
                <div className="text-sm text-zinc-400">{study.industry}</div>
              </div>
            </div>

            {/* Stat */}
            <div className="flex items-center gap-4 mb-8">
              <StatIcon className="h-8 w-8 text-cyan-400" />
              <div>
                <div className="text-4xl lg:text-5xl font-bold text-cyan-400">
                  {study.statValue}
                </div>
                <div className="text-zinc-400">{study.statLabel}</div>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="mb-8">
              <p className="text-xl text-zinc-300 leading-relaxed">
                &ldquo;{study.quote}&rdquo;
              </p>
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                {study.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="font-medium text-white">{study.author}</div>
                <div className="text-sm text-zinc-400">
                  {study.role}, {study.company}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {studies.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === active
                      ? "w-8 bg-cyan-400"
                      : "w-2 bg-zinc-700 hover:bg-zinc-600"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
