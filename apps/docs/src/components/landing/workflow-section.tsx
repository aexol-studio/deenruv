"use client";

import { useState, useEffect, useRef } from "react";
import {
  Code2,
  Settings,
  Puzzle,
  Rocket,
  Shield,
  CheckCircle,
  CreditCard,
  Search,
  Cpu,
  Box,
  Cloud,
  BadgeCheck,
  Lock,
  ShieldCheck,
  KeyRound,
  Gauge,
  FileCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { t, type Lang } from "./translations";
import { usePageVisible } from "./use-page-visible";

const TAB_ICONS = [Code2, Settings, Puzzle, Rocket, Shield];
const TAB_IDS = ["code", "configure", "extend", "deploy", "secure"];
const TAB_COLORS = [
  "text-indigo-400",
  "text-blue-400",
  "text-cyan-400",
  "text-teal-400",
  "text-cyan-400",
];

/* ------------------------------------------------------------------ */
/*  Typing animation hook                                              */
/* ------------------------------------------------------------------ */
function useTypingAnimation(lines: string[], active: boolean) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [partialLine, setPartialLine] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const stateRef = useRef({ lineIdx: 0, charIdx: 0, active: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) {
      setDisplayedLines([]);
      setPartialLine(null);
      setDone(false);
      stateRef.current = { lineIdx: 0, charIdx: 0, active: false };
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    stateRef.current = { lineIdx: 0, charIdx: 0, active: true };

    function tick() {
      const s = stateRef.current;
      if (!s.active) return;

      if (s.lineIdx >= lines.length) {
        setDone(true);
        setPartialLine(null);
        return;
      }

      const line = lines[s.lineIdx];
      const isOutputLine =
        line.startsWith("✓") || line.startsWith("  ") || line === "";

      if (isOutputLine) {
        // Output lines appear instantly with a small stagger
        const delay = line === "" ? 200 : 120;
        timerRef.current = setTimeout(() => {
          if (!stateRef.current.active) return;
          setDisplayedLines((prev) => [...prev, line]);
          setPartialLine(null);
          s.lineIdx++;
          s.charIdx = 0;
          tick();
        }, delay);
      } else {
        // Command lines type character by character
        if (s.charIdx >= line.length) {
          // Done typing this command line — commit it
          setDisplayedLines((prev) => [...prev, line]);
          setPartialLine(null);
          s.lineIdx++;
          s.charIdx = 0;
          // Small pause after finishing a command before continuing
          timerRef.current = setTimeout(() => {
            if (!stateRef.current.active) return;
            tick();
          }, 250);
        } else {
          // Still typing — show partial text
          s.charIdx++;
          setPartialLine(line.slice(0, s.charIdx));
          timerRef.current = setTimeout(() => {
            if (!stateRef.current.active) return;
            tick();
          }, 35);
        }
      }
    }

    tick();

    return () => {
      stateRef.current.active = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, lines]);

  return { displayedLines, partialLine, done };
}

/* ------------------------------------------------------------------ */
/*  Tab 0 – Code: Terminal mockup with typing animation                */
/* ------------------------------------------------------------------ */
const TERMINAL_LINES = [
  // Phase 0: Scaffold
  "$ npx @deenruv/create my-store",
  "",
  "  ◆ Select your database:",
  "  │ ● PostgreSQL (recommended)",
  "  │ ○ MySQL",
  "  │ ○ SQLite",
  "",
  "  ◆ Select plugins to install:",
  "  │ ✔ Payments (Stripe + Mollie)",
  "  │ ✔ Email (SMTP + templates)",
  "  │ ✔ Asset Server (images + CDN)",
  "  │ ○ Elasticsearch",
  "",
  "✓ Project scaffolded",
  "✓ 12 plugins configured",
  "",
  // Phase 1: Install
  "$ cd my-store && pnpm install",
  "",
  "  ✓ Resolved 847 packages",
  "  ✓ Downloaded 212 packages",
  "  ✓ Installed in 12.4s",
  "",
  // Phase 2: Migrations
  "$ pnpm migration:run",
  "",
  "  ◆ Running migrations...",
  "  ✓ CreateUsersTable1709234567890",
  "  ✓ CreateProductsTable1709234567891",
  "  ✓ CreateOrdersTable1709234567892",
  "  ✓ 3 migrations executed successfully",
  "",
  // Phase 3: Codegen
  "$ pnpm codegen",
  "",
  "  ✓ Generating GraphQL types...",
  "  ✓ admin-api: 847 types generated",
  "  ✓ shop-api: 312 types generated",
  "",
  // Phase 4: Build & Start
  "$ pnpm start",
  "",
  "  ✓ Building server...",
  "  ✓ Compiling 234 modules",
  "",
  "  ┌───────────────────────────────────────────┐",
  "  │                                           │",
  "  │   Deenruv server is running! 🚀           │",
  "  │                                           │",
  "  │   Admin API  http://localhost:3000/admin-api",
  "  │   Shop API   http://localhost:3000/shop-api",
  "  │   Admin UI   http://localhost:3000/admin/",
  "  │                                           │",
  "  └───────────────────────────────────────────┘",
];

function CodeIllustration({ active }: { active: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { displayedLines, partialLine } = useTypingAnimation(
    TERMINAL_LINES,
    active,
  );

  // Auto-scroll to bottom as new lines appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [displayedLines, partialLine]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden font-mono text-[11px] sm:text-[13px] leading-relaxed">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 border-b border-zinc-800 bg-zinc-900/80">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500/70" />
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-500/70" />
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-zinc-500 text-xs ml-2">Terminal</span>
      </div>
      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="p-3 sm:p-4 min-h-[280px] max-h-[340px] sm:min-h-[340px] sm:max-h-[420px] overflow-y-auto"
      >
        {displayedLines.map((line, i) => (
          <TerminalLine key={i} text={line} />
        ))}
        {partialLine !== null && <TerminalLine text={partialLine} cursor />}
        {!active && <span className="text-zinc-600 animate-pulse">$ _</span>}
      </div>
    </div>
  );
}

function TerminalLine({ text, cursor }: { text: string; cursor?: boolean }) {
  if (text === "") return <div className="h-4" />;

  // Box-drawing lines (banner border)
  const isBoxBorder = /[┌┐└┘─]{2,}/.test(text);
  // Banner content lines (inside the box) – starts with "  │" but NOT a selection prompt
  const isBannerContent =
    text.trimStart().startsWith("│") &&
    !text.includes("● ") &&
    !text.includes("○ ") &&
    !text.includes("✔ ") &&
    !text.includes("◆");
  const isSuccess = text.trimStart().startsWith("✓");
  const isCommand = text.startsWith("$");
  const isPrompt = text.includes("◆");
  const isSelected = text.includes("│ ●");
  const isUnselected = text.includes("│ ○");
  const isChecked = text.includes("│ ✔");

  // Handle box-drawing border lines
  if (isBoxBorder) {
    return (
      <div className="text-zinc-700">
        {text}
        {cursor && (
          <span className="inline-block w-2 h-4 bg-indigo-400 ml-0.5 animate-pulse" />
        )}
      </div>
    );
  }

  // Handle banner content lines (URLs inside box, title inside box)
  if (isBannerContent) {
    const urlMatch = text.match(/(https?:\/\/\S+)/);
    if (urlMatch) {
      const parts = text.split(urlMatch[0]);
      return (
        <div className="text-zinc-500">
          <span className="text-zinc-700">
            {parts[0].match(/^(\s*│\s*)/)?.[0] ?? ""}
          </span>
          <span className="text-zinc-400">
            {parts[0].replace(/^(\s*│\s*)/, "")}
          </span>
          <span className="text-cyan-400 underline decoration-cyan-400/30">
            {urlMatch[0]}
          </span>
          {cursor && (
            <span className="inline-block w-2 h-4 bg-indigo-400 ml-0.5 animate-pulse" />
          )}
        </div>
      );
    }
    // Title line or spacer inside the box
    const hasEmoji = text.includes("🚀");
    return (
      <div className="text-zinc-700">
        {hasEmoji ? (
          <>
            <span className="text-zinc-700">
              {text.match(/^(\s*│\s*)/)?.[0] ?? ""}
            </span>
            <span className="text-white font-semibold">
              {text.replace(/^(\s*│\s*)/, "").replace(/\s*│\s*$/, "")}
            </span>
            <span className="text-zinc-700">
              {text.match(/(\s*│\s*)$/)?.[0] ?? ""}
            </span>
          </>
        ) : (
          text
        )}
        {cursor && (
          <span className="inline-block w-2 h-4 bg-indigo-400 ml-0.5 animate-pulse" />
        )}
      </div>
    );
  }

  let className = "text-zinc-400";
  if (isSuccess) className = "text-green-400";
  if (isCommand) className = "text-indigo-300";
  if (isPrompt) className = "text-cyan-400";
  if (isSelected) className = "text-blue-400";
  if (isUnselected) className = "text-zinc-600";
  if (isChecked) className = "text-green-400";

  // Handle URLs specially
  const urlMatch = text.match(/(https?:\/\/\S+)/);
  if (urlMatch) {
    const parts = text.split(urlMatch[0]);
    return (
      <div className={isSuccess ? "text-green-400" : className}>
        {parts[0]}
        <span className="text-cyan-400 underline decoration-cyan-400/30">
          {urlMatch[0]}
        </span>
        {parts[1]}
        {cursor && (
          <span className="inline-block w-2 h-4 bg-indigo-400 ml-0.5 animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {text}
      {cursor && (
        <span className="inline-block w-2 h-4 bg-indigo-400 ml-0.5 animate-pulse" />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 1 – Configure: Code editor with syntax highlighting            */
/* ------------------------------------------------------------------ */
const CONFIG_LINES = [
  { text: "export default defineConfig({", indent: 0 },
  { text: "apiOptions: {", indent: 1 },
  { text: "port: 3000,", indent: 2, highlight: "number" },
  { text: 'hostname: "0.0.0.0",', indent: 2, highlight: "string" },
  { text: "},", indent: 1 },
  { text: "plugins: [", indent: 1 },
  { text: "AdminUiPlugin,", indent: 2, highlight: "type" },
  { text: "AssetServerPlugin,", indent: 2, highlight: "type" },
  { text: "EmailPlugin,", indent: 2, highlight: "type" },
  { text: "],", indent: 1 },
  { text: "dbConnectionOptions: {", indent: 1 },
  { text: 'type: "postgres",', indent: 2, highlight: "string" },
  { text: "synchronize: true,", indent: 2, highlight: "boolean" },
  { text: "},", indent: 1 },
  { text: "});", indent: 0 },
];

function ConfigureIllustration({ active }: { active: boolean }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden font-mono text-[11px] sm:text-[13px] leading-relaxed">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 border-b border-zinc-800 bg-zinc-900/80">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500/70" />
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-500/70" />
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-zinc-500 text-xs ml-2">deenruv.config.ts</span>
      </div>
      {/* Editor body */}
      <div className="p-3 sm:p-4 min-h-[220px] sm:min-h-[260px]">
        {CONFIG_LINES.map((line, i) => (
          <motion.div
            key={i}
            className="flex"
            initial={active ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: active ? i * 0.07 : 0 }}
          >
            <span className="w-8 text-right pr-4 text-zinc-700 select-none shrink-0">
              {i + 1}
            </span>
            <span style={{ paddingLeft: `${line.indent * 16}px` }}>
              <ConfigToken text={line.text} highlight={line.highlight} />
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ConfigToken({
  text,
  highlight,
}: {
  text: string;
  highlight?: string;
}) {
  // Simple syntax colouring
  if (highlight === "number") {
    const parts = text.split(/(\d+)/);
    return (
      <>
        {parts.map((p, i) =>
          /\d+/.test(p) ? (
            <span key={i} className="text-amber-400">
              {p}
            </span>
          ) : (
            <span key={i} className="text-zinc-300">
              {p}
            </span>
          ),
        )}
      </>
    );
  }
  if (highlight === "string") {
    const parts = text.split(/("[^"]*")/);
    return (
      <>
        {parts.map((p, i) =>
          p.startsWith('"') ? (
            <span key={i} className="text-green-400">
              {p}
            </span>
          ) : (
            <span key={i} className="text-zinc-300">
              {p}
            </span>
          ),
        )}
      </>
    );
  }
  if (highlight === "type") {
    return <span className="text-cyan-400">{text}</span>;
  }
  if (highlight === "boolean") {
    const parts = text.split(/(true|false)/);
    return (
      <>
        {parts.map((p, i) =>
          p === "true" || p === "false" ? (
            <span key={i} className="text-amber-400">
              {p}
            </span>
          ) : (
            <span key={i} className="text-zinc-300">
              {p}
            </span>
          ),
        )}
      </>
    );
  }
  // Keywords
  const keywords = /(export|default|const)/g;
  const coloured = text.replace(keywords, "___KW___$1___KW___");
  const parts = coloured.split("___KW___");
  return (
    <>
      {parts.map((p, i) =>
        /(export|default|const)/.test(p) ? (
          <span key={i} className="text-indigo-400">
            {p}
          </span>
        ) : (
          <span key={i} className="text-zinc-300">
            {p}
          </span>
        ),
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 2 – Extend: Plugin architecture diagram                        */
/* ------------------------------------------------------------------ */
const PLUGIN_NODES = [
  { label: "Payments", icon: CreditCard, color: "indigo", x: 8, y: 10 },
  { label: "Email", icon: Rocket, color: "blue", x: 66, y: 10 },
  { label: "Search", icon: Search, color: "teal", x: 8, y: 70 },
  { label: "Custom", icon: Cpu, color: "cyan", x: 66, y: 70 },
];

const PLUGIN_COLORS: Record<
  string,
  { border: string; bg: string; text: string; glow: string }
> = {
  indigo: {
    border: "border-indigo-500/40",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    glow: "shadow-indigo-500/20",
  },
  blue: {
    border: "border-blue-500/40",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    glow: "shadow-blue-500/20",
  },
  cyan: {
    border: "border-cyan-500/40",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/20",
  },
  teal: {
    border: "border-teal-500/40",
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    glow: "shadow-teal-500/20",
  },
};

function ExtendIllustration({ active }: { active: boolean }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      <div className="relative min-h-[240px] sm:min-h-[300px] p-3 sm:p-6">
        {/* Center core node */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          initial={active ? { scale: 0 } : { scale: 1 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: active ? 0.1 : 0,
          }}
        >
          <div className="relative">
            <div className="absolute -inset-3 sm:-inset-4 rounded-full bg-cyan-500/10 blur-xl" />
            <div className="relative w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-zinc-900 border-2 border-cyan-500/50 flex flex-col items-center justify-center gap-0.5 sm:gap-1 shadow-lg shadow-cyan-500/20">
              <Puzzle className="h-4 w-4 sm:h-7 sm:w-7 text-cyan-400" />
              <span className="text-[8px] sm:text-[10px] font-semibold text-cyan-400">
                Core
              </span>
            </div>
          </div>
        </motion.div>

        {/* Connecting lines (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          preserveAspectRatio="none"
        >
          {PLUGIN_NODES.map((node, i) => (
            <motion.line
              key={node.label}
              x1="50%"
              y1="50%"
              x2={`${node.x + 5}%`}
              y2={`${node.y + 8}%`}
              stroke="currentColor"
              className="text-zinc-700"
              strokeWidth="1"
              strokeDasharray="6 4"
              initial={
                active
                  ? { pathLength: 0, opacity: 0 }
                  : { pathLength: 1, opacity: 1 }
              }
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: active ? 0.3 + i * 0.1 : 0 }}
            />
          ))}
        </svg>

        {/* Plugin nodes */}
        {PLUGIN_NODES.map((node, i) => {
          const colors = PLUGIN_COLORS[node.color];
          const Icon = node.icon;
          return (
            <motion.div
              key={node.label}
              className="absolute z-20"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              initial={
                active ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }
              }
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: active ? 0.4 + i * 0.1 : 0,
              }}
            >
              <div
                className={`w-14 sm:w-24 rounded-lg sm:rounded-xl border ${colors.border} ${colors.bg} bg-zinc-950/80 p-1.5 sm:p-3 flex flex-col items-center gap-0.5 sm:gap-1.5 shadow-lg ${colors.glow}`}
              >
                <Icon className={`h-3.5 w-3.5 sm:h-5 sm:w-5 ${colors.text}`} />
                <span
                  className={`text-[9px] sm:text-xs font-medium ${colors.text}`}
                >
                  {node.label}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Floating "+" pills */}
        <motion.div
          className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30"
          initial={active ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: active ? 0.9 : 0 }}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 sm:px-4 sm:py-2 text-[9px] sm:text-xs text-zinc-500">
            <span className="text-cyan-400 font-bold">+</span>
            <span className="truncate">Add any plugin you need</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 3 – Deploy: Pipeline stages                                    */
/* ------------------------------------------------------------------ */
const DEPLOY_STAGES = [
  { label: "Build", icon: Code2, color: "indigo" },
  { label: "Test", icon: CheckCircle, color: "blue" },
  { label: "Deploy", icon: Box, color: "cyan" },
  { label: "Live", icon: Cloud, color: "teal" },
];

const DEPLOY_COLORS: Record<
  string,
  { bg: string; text: string; border: string; barBg: string }
> = {
  indigo: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/40",
    barBg: "bg-indigo-500",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/40",
    barBg: "bg-blue-500",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/40",
    barBg: "bg-cyan-500",
  },
  teal: {
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    border: "border-teal-500/40",
    barBg: "bg-teal-500",
  },
};

function DeployIllustration({ active }: { active: boolean }) {
  const [activeStage, setActiveStage] = useState(-1);

  useEffect(() => {
    if (!active) {
      setActiveStage(-1);
      return;
    }
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < DEPLOY_STAGES.length; i++) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 800));
        if (cancelled) return;
        setActiveStage(i);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      <div className="p-3 sm:p-6 min-h-[240px] sm:min-h-[300px] flex flex-col justify-center">
        {/* Pipeline */}
        <div className="flex items-center justify-between gap-0.5 sm:gap-2 mb-5 sm:mb-8">
          {DEPLOY_STAGES.map((stage, i) => {
            const colors = DEPLOY_COLORS[stage.color];
            const Icon = stage.icon;
            const reached = i <= activeStage;
            return (
              <div
                key={stage.label}
                className="flex items-center gap-0.5 sm:gap-2 flex-1 min-w-0"
              >
                <motion.div
                  className="relative flex flex-col items-center gap-1 sm:gap-2 flex-1 min-w-0"
                  initial={
                    active ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: active ? i * 0.12 : 0 }}
                >
                  <motion.div
                    className={`w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl border-2 flex items-center justify-center shrink-0 ${
                      reached ? colors.border : "border-zinc-800"
                    } ${reached ? colors.bg : "bg-zinc-900/50"}`}
                    animate={reached ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {reached && i < activeStage ? (
                      <BadgeCheck className="h-3.5 w-3.5 sm:h-6 sm:w-6 text-green-400" />
                    ) : (
                      <Icon
                        className={`h-3.5 w-3.5 sm:h-6 sm:w-6 ${reached ? colors.text : "text-zinc-700"}`}
                      />
                    )}
                  </motion.div>
                  <span
                    className={`text-[9px] sm:text-xs font-medium ${
                      reached ? "text-zinc-300" : "text-zinc-600"
                    }`}
                  >
                    {stage.label}
                  </span>
                </motion.div>
                {i < DEPLOY_STAGES.length - 1 && (
                  <div className="h-0.5 flex-1 min-w-1 rounded-full bg-zinc-800 overflow-hidden -mt-4 sm:-mt-5">
                    <motion.div
                      className={`h-full ${DEPLOY_COLORS[stage.color].barBg}`}
                      initial={{ width: "0%" }}
                      animate={{ width: i < activeStage ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Status card */}
        <AnimatePresence mode="wait">
          {activeStage >= 0 && (
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 sm:p-4"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                <span className="text-xs sm:text-sm text-zinc-300 truncate">
                  {activeStage === 0 && "Building TypeScript project..."}
                  {activeStage === 1 && "Running test suite — 47/47 passed"}
                  {activeStage === 2 && "Deploying to Docker container..."}
                  {activeStage === 3 && "✓ Live at production — 0 downtime"}
                </span>
              </div>
              {activeStage < 3 && (
                <div className="mt-2 sm:mt-3 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${DEPLOY_COLORS[DEPLOY_STAGES[activeStage].color].barBg}`}
                    initial={{ width: "10%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Deploy targets */}
        <motion.div
          className="mt-3 sm:mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-4"
          initial={active ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: active ? 0.6 : 0 }}
        >
          {["Docker", "Kubernetes", "AWS", "Vercel"].map((target) => (
            <span
              key={target}
              className="rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-xs text-zinc-500"
            >
              {target}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 4 – Secure: Security checklist dashboard                       */
/* ------------------------------------------------------------------ */
const SECURITY_CHECKS = [
  { label: "JWT Authentication", icon: Lock, severity: "critical" },
  {
    label: "Role-based access (RBAC)",
    icon: ShieldCheck,
    severity: "critical",
  },
  { label: "CSRF protection", icon: Shield, severity: "high" },
  { label: "Rate limiting", icon: Gauge, severity: "high" },
  { label: "Data validation (Zod)", icon: FileCheck, severity: "medium" },
  { label: "API key management", icon: KeyRound, severity: "medium" },
];

function SecureIllustration({ active }: { active: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setVisibleCount(0);
      return;
    }
    let cancelled = false;
    const run = async () => {
      for (let i = 1; i <= SECURITY_CHECKS.length; i++) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 350));
        if (cancelled) return;
        setVisibleCount(i);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      <div className="p-4 sm:p-5 min-h-[260px] sm:min-h-[300px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <motion.div
            className="h-2.5 w-2.5 rounded-full"
            animate={{
              backgroundColor:
                visibleCount >= SECURITY_CHECKS.length ? "#22c55e" : "#eab308",
            }}
            transition={{ duration: 0.3 }}
          />
          <span className="text-sm font-medium text-zinc-300">
            Security Audit
          </span>
          <span className="ml-auto text-xs text-zinc-600">
            {visibleCount}/{SECURITY_CHECKS.length} checks
          </span>
        </div>

        {/* Checks */}
        <div className="space-y-1.5 sm:space-y-2">
          {SECURITY_CHECKS.map((check, i) => {
            const Icon = check.icon;
            const visible = i < visibleCount;
            return (
              <motion.div
                key={check.label}
                className="flex items-center gap-2 sm:gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-2 sm:px-4 sm:py-2.5"
                initial={active ? { opacity: 0, x: -12 } : { opacity: 1, x: 0 }}
                animate={{
                  opacity: visible || !active ? 1 : 0.3,
                  x: 0,
                }}
                transition={{ duration: 0.25, delay: active ? i * 0.05 : 0 }}
              >
                {visible ? (
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400 shrink-0" />
                ) : (
                  <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full border border-zinc-700 shrink-0" />
                )}
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-500 shrink-0" />
                <span
                  className={`text-xs sm:text-sm ${visible ? "text-zinc-300" : "text-zinc-600"} truncate`}
                >
                  {check.label}
                </span>
                <span
                  className={`ml-auto text-[9px] sm:text-[10px] uppercase tracking-wider font-medium shrink-0 ${
                    check.severity === "critical"
                      ? "text-red-400/70"
                      : check.severity === "high"
                        ? "text-amber-400/70"
                        : "text-blue-400/70"
                  }`}
                >
                  {check.severity}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Score bar */}
        <motion.div
          className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-zinc-800"
          initial={active ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: active ? 1.0 : 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500">Security score</span>
            <motion.span
              className="text-sm font-bold text-green-400"
              initial={active ? { opacity: 0 } : { opacity: 1 }}
              animate={{
                opacity: visibleCount >= SECURITY_CHECKS.length ? 1 : 0.5,
              }}
            >
              {visibleCount >= SECURITY_CHECKS.length ? "A+" : "..."}
            </motion.span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
              initial={{ width: "0%" }}
              animate={{
                width: `${(visibleCount / SECURITY_CHECKS.length) * 100}%`,
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab content router                                                 */
/* ------------------------------------------------------------------ */
function TabIllustration({
  tabIndex,
  active,
}: {
  tabIndex: number;
  active: boolean;
}) {
  switch (tabIndex) {
    case 0:
      return <CodeIllustration active={active} />;
    case 1:
      return <ConfigureIllustration active={active} />;
    case 2:
      return <ExtendIllustration active={active} />;
    case 3:
      return <DeployIllustration active={active} />;
    case 4:
      return <SecureIllustration active={active} />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */
export function WorkflowSection({ lang = "en" }: { lang?: Lang }) {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const pageVisible = usePageVisible();
  const text = t("workflow", lang);
  const activeContent = text.tabs[activeTab];

  // Animations are active only when BOTH in view AND page is visible
  const animationsActive = isInView && pageVisible;

  // IntersectionObserver — trigger once when section becomes visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // trigger once
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 lg:py-32">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute left-0 bottom-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="mx-auto mb-10 sm:mb-16 max-w-3xl text-center">
          <h2 className="mb-4 sm:mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {text.title}
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400">{text.subtitle}</p>
        </div>

        {/* Tabs - GitHub style pills */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-12">
          {text.tabs.map((tab, index) => {
            const Icon = TAB_ICONS[index];
            const color = TAB_COLORS[index];
            return (
              <button
                key={TAB_IDS[index]}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeTab === index
                    ? "bg-white text-zinc-900"
                    : "text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${activeTab === index ? "text-zinc-900" : color}`}
                />
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Text */}
            <div className="order-2 lg:order-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold text-white">
                    {activeContent.title}
                  </h3>
                  <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
                    {activeContent.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Illustration */}
            <div className="order-1 lg:order-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <TabIllustration
                    tabIndex={activeTab}
                    active={animationsActive}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
