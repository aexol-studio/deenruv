import { Shield, CheckCircle } from "lucide-react";
import { t, type Lang } from "./translations";

export function SecuritySection({ lang = "en" }: { lang?: Lang }) {
  const text = t("security", lang);

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-green-500/10 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Left - Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-400 mb-6">
              <Shield className="h-4 w-4" />
              {text.badge}
            </div>

            <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {text.title}
            </h2>
            <p className="mb-8 text-lg text-zinc-400 leading-relaxed">
              {text.description}
            </p>

            <div className="space-y-4">
              {text.checks.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
                  <span className="text-zinc-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Visual card */}
          <div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-400">
                  {text.allPassed}
                </span>
              </div>

              <div className="space-y-3">
                {text.tableRows.map((item) => (
                  <div
                    key={item.resource}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3"
                  >
                    <span className="text-zinc-300">{item.resource}</span>
                    <span className="text-sm font-medium text-green-400">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">{text.lastScan}</span>
                  <span className="text-zinc-400">{text.lastScanTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
