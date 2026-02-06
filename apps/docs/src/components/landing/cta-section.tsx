"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Github, Star } from "lucide-react";
import { t, type Lang } from "./translations";

export function CtaSection({ lang = "en" }: { lang?: Lang }) {
  const text = t("cta", lang);
  const linkPrefix = `/${lang}`;

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

  return (
    <section className="relative py-16 sm:py-24 lg:py-32">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-[100px]" />
        <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-500/20 blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 sm:mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            {text.title}
          </h2>
          <p className="mx-auto mb-8 sm:mb-10 max-w-2xl text-lg sm:text-xl text-zinc-400">
            {text.subtitle}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row">
            <Link
              href={`${linkPrefix}/docs/guides/getting-started/installation`}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-zinc-900 transition-all hover:bg-zinc-200 w-full sm:w-auto justify-center"
            >
              {text.getStarted}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/aexol-studio/deenruv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:border-zinc-500 hover:bg-zinc-800/50 w-full sm:w-auto justify-center"
            >
              <Github className="h-5 w-5 shrink-0" />
              {text.starOnGitHub}
              <span className="inline-flex items-center gap-0.5 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400 shrink-0">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                {starCount}
              </span>
            </Link>
          </div>

          {/* Quick start command */}
          <div className="mt-8 sm:mt-12 inline-flex items-center gap-2 sm:gap-3 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-2 sm:px-6 sm:py-3 max-w-full overflow-hidden">
            <span className="text-green-400 shrink-0">$</span>
            <code className="text-zinc-300 text-xs sm:text-base truncate min-w-0">
              npx @deenruv/create my-store
            </code>
            <button
              className="text-zinc-500 hover:text-white transition-colors shrink-0"
              title="Copy to clipboard"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
