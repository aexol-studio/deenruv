import {
  Code2,
  Globe,
  Layers,
  Lock,
  Puzzle,
  Rocket,
  Server,
  Zap,
} from "lucide-react";
import { t, type Lang } from "./translations";

const FEATURE_ICONS = [Code2, Layers, Puzzle, Globe, Rocket, Lock, Server, Zap];
const FEATURE_STYLES = [
  { color: "text-indigo-400", bgColor: "bg-indigo-500/10" },
  { color: "text-blue-400", bgColor: "bg-blue-500/10" },
  { color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
  { color: "text-teal-400", bgColor: "bg-teal-500/10" },
  { color: "text-indigo-400", bgColor: "bg-indigo-500/10" },
  { color: "text-blue-400", bgColor: "bg-blue-500/10" },
  { color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
  { color: "text-teal-400", bgColor: "bg-teal-500/10" },
];

export function FeaturesSection({ lang = "en" }: { lang?: Lang }) {
  const text = t("features", lang);

  return (
    <section className="relative py-24 lg:py-32" id="features">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Section header - GitHub style */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {text.title}
          </h2>
          <p className="text-xl text-zinc-400">{text.subtitle}</p>
        </div>

        {/* Features grid - GitHub card style */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {text.items.map((feature, index) => {
            const Icon = FEATURE_ICONS[index];
            const style = FEATURE_STYLES[index];
            return (
              <div
                key={feature.title}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div
                  className={`mb-4 inline-flex rounded-lg p-3 ${style.bgColor}`}
                >
                  <Icon className={`h-6 w-6 ${style.color}`} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
