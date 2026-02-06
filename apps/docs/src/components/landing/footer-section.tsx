"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { t, type Lang } from "./translations";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  );
}

export function FooterSection({ lang = "en" }: { lang?: Lang }) {
  const text = t("footer", lang);
  const linkPrefix = `/${lang}`;
  const year = new Date().getFullYear();

  const footerLinks = {
    [text.platform]: [
      { label: text.features, href: "#features", anchor: true },
      { label: text.documentation, href: `${linkPrefix}/docs` },
      {
        label: text.changelog,
        href: "https://github.com/aexol-studio/deenruv/releases",
      },
    ],
    [text.resources]: [
      {
        label: text.gettingStarted,
        href: `${linkPrefix}/docs/guides/getting-started/installation`,
      },
      {
        label: text.apiReference,
        href: `${linkPrefix}/docs/guides/developer-guide/the-api-layer`,
      },
      {
        label: text.plugins,
        href: `${linkPrefix}/docs/guides/developer-guide/plugins`,
      },
    ],
    [text.company]: [
      {
        label: text.license,
        href: "https://github.com/aexol-studio/deenruv/blob/main/LICENSE",
      },
    ],
  };

  return (
    <footer className="border-t border-zinc-800">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        {/* Main footer content */}
        <div className="grid gap-8 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={linkPrefix} className="flex items-center gap-2.5 mb-4">
              <img src="/logo-filled.svg" alt="Deenruv" className="h-9 w-9" />
              <span className="text-lg font-semibold text-white">Deenruv</span>
            </Link>
            <p className="text-sm text-zinc-400 mb-6 max-w-xs">
              {text.description}
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/aexol-studio/deenruv"
                target="_blank"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://discord.gg/udyZAJPa"
                target="_blank"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <DiscordIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {"anchor" in link && link.anchor ? (
                      <button
                        onClick={() => {
                          document
                            .getElementById("features")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        target={
                          link.href.startsWith("http") ? "_blank" : undefined
                        }
                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">
            &copy; {year} Deenruv. {text.allRightsReserved}
          </p>
          <p className="text-sm text-zinc-500">
            {text.madeWith} ❤️ {text.by}{" "}
            <Link
              href="https://aexol.com"
              target="_blank"
              className="text-zinc-400 hover:text-white"
            >
              Aexol
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
