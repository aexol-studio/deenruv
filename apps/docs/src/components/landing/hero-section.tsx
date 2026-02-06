"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShoppingCart,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  Pause,
  Play,
  Smartphone,
  Monitor,
  Store,
  PackageCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { t, type Lang } from "./translations";
import { usePageVisible } from "./use-page-visible";

// ---------- Color map ----------

const colorMap: Record<
  string,
  {
    border: string;
    borderActive: string;
    bg: string;
    text: string;
    solid: string;
  }
> = {
  indigo: {
    border: "border-indigo-500/30",
    borderActive: "border-indigo-400",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    solid: "#6366f1",
  },
  blue: {
    border: "border-blue-500/30",
    borderActive: "border-blue-400",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    solid: "#3b82f6",
  },
  cyan: {
    border: "border-cyan-500/30",
    borderActive: "border-cyan-400",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    solid: "#06b6d4",
  },
  teal: {
    border: "border-teal-500/30",
    borderActive: "border-teal-400",
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    solid: "#14b8a6",
  },
  violet: {
    border: "border-violet-500/30",
    borderActive: "border-violet-400",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    solid: "#8b5cf6",
  },
  amber: {
    border: "border-amber-500/30",
    borderActive: "border-amber-400",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    solid: "#f59e0b",
  },
  emerald: {
    border: "border-emerald-500/30",
    borderActive: "border-emerald-400",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    solid: "#10b981",
  },
};

// ---------- Node definitions ----------

type HeroText = ReturnType<typeof t<"hero">>;

type IconComponent = typeof CreditCard;

interface PipelineNode {
  id: string;
  icon: IconComponent;
  label: string;
  color: string;
  x: number;
  y: number;
  size: "sm" | "md" | "lg";
  stat: { value: string; label: string };
}

type NodeGroup = "entry" | "process" | "delivery" | "exit";

function getNodes(text: HeroText): Record<NodeGroup, PipelineNode[]> {
  return {
    entry: [
      {
        id: "mobile",
        icon: Smartphone,
        label: text.mobileApp,
        color: "violet",
        x: 8,
        y: 20,
        size: "sm",
        stat: { value: text.mobileStatValue, label: text.mobileStatLabel },
      },
      {
        id: "web",
        icon: Monitor,
        label: text.webStore,
        color: "indigo",
        x: 8,
        y: 50,
        size: "sm",
        stat: { value: text.webStatValue, label: text.webStatLabel },
      },
      {
        id: "pos",
        icon: Store,
        label: text.pos,
        color: "amber",
        x: 8,
        y: 80,
        size: "sm",
        stat: { value: text.posStatValue, label: text.posStatLabel },
      },
    ],
    process: [
      {
        id: "payment",
        icon: CreditCard,
        label: text.payment,
        color: "blue",
        x: 35,
        y: 50,
        size: "md",
        stat: { value: text.paymentStatValue, label: text.paymentStatLabel },
      },
      {
        id: "fulfillment",
        icon: Package,
        label: text.fulfillment,
        color: "cyan",
        x: 55,
        y: 50,
        size: "lg",
        stat: {
          value: text.fulfillmentStatValue,
          label: text.fulfillmentStatLabel,
        },
      },
    ],
    delivery: [
      {
        id: "courier",
        icon: Truck,
        label: text.courier,
        color: "teal",
        x: 75,
        y: 30,
        size: "md",
        stat: { value: text.courierStatValue, label: text.courierStatLabel },
      },
      {
        id: "paczkomat",
        icon: PackageCheck,
        label: text.paczkomat,
        color: "emerald",
        x: 75,
        y: 70,
        size: "md",
        stat: { value: text.packStatValue, label: text.packStatLabel },
      },
    ],
    exit: [
      {
        id: "delivered",
        icon: CheckCircle,
        label: text.delivered,
        color: "cyan",
        x: 92,
        y: 50,
        size: "lg",
        stat: {
          value: text.deliveredStatValue,
          label: text.deliveredStatLabel,
        },
      },
    ],
  };
}

function allNodes(groups: Record<NodeGroup, PipelineNode[]>): PipelineNode[] {
  return [
    ...groups.entry,
    ...groups.process,
    ...groups.delivery,
    ...groups.exit,
  ];
}

// ---------- SVG path helpers ----------

/** Approximate node box half-width in SVG viewBox percentage units (0–100). */
const SIZE_OFFSET: Record<string, number> = {
  sm: 2.0,
  md: 3.0,
  lg: 3.8,
};

/** Get the x-coordinate of the left or right edge of a node box in SVG space. */
function getEdgeX(node: PipelineNode, side: "left" | "right"): number {
  const offset = SIZE_OFFSET[node.size] ?? 2;
  return side === "right" ? node.x + offset : node.x - offset;
}

/** Build a cubic bezier SVG path between two %-based coordinates */
function curvePath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1;
  const cpx1 = x1 + dx * 0.07;
  const cpx2 = x2 - dx * 0.07;
  return `M ${x1} ${y1} C ${cpx1} ${y1}, ${cpx2} ${y2}, ${x2} ${y2}`;
}

/** Quadratic bezier with a slight vertical bulge — renders visibly even under
 *  `preserveAspectRatio="none"` non-uniform scaling where pure horizontal
 *  lines become invisible. */
function subtleCurvePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  yBulge = 0.8,
): string {
  const midX = (x1 + x2) / 2;
  return `M ${x1} ${y1} Q ${midX} ${y1 - yBulge} ${x2} ${y2}`;
}

interface PathDef {
  d: string;
  from: string;
  to: string;
}

/** Build a unique SVG path id from segment endpoints. */
function pathId(from: string, to: string): string {
  return `pipe-${from}-${to}`;
}

function getPaths(groups: Record<NodeGroup, PipelineNode[]>): PathDef[] {
  const [mobile, web, pos] = groups.entry;
  const [payment, fulfillment] = groups.process;
  const [courier, paczkomat] = groups.delivery;
  const [delivered] = groups.exit;

  return [
    // Screen left edge → Entry nodes (3 straight lines)
    {
      d: subtleCurvePath(-5, mobile.y, getEdgeX(mobile, "left"), mobile.y, 0.5),
      from: "screen-left-mobile",
      to: "mobile",
    },
    {
      d: subtleCurvePath(-5, web.y, getEdgeX(web, "left"), web.y, 0.5),
      from: "screen-left-web",
      to: "web",
    },
    {
      d: subtleCurvePath(-5, pos.y, getEdgeX(pos, "left"), pos.y, 0.5),
      from: "screen-left-pos",
      to: "pos",
    },
    // Entry → Payment (3 curves) — right edge of entry → left edge of payment
    {
      d: curvePath(
        getEdgeX(mobile, "right"),
        mobile.y,
        getEdgeX(payment, "left"),
        payment.y,
      ),
      from: "mobile",
      to: "payment",
    },
    {
      d: subtleCurvePath(
        getEdgeX(web, "right"),
        web.y,
        getEdgeX(payment, "left"),
        payment.y,
      ),
      from: "web",
      to: "payment",
    },
    {
      d: curvePath(
        getEdgeX(pos, "right"),
        pos.y,
        getEdgeX(payment, "left"),
        payment.y,
      ),
      from: "pos",
      to: "payment",
    },
    // Payment → Fulfillment (straight) — right edge of payment → left edge of fulfillment
    {
      d: subtleCurvePath(
        getEdgeX(payment, "right"),
        payment.y,
        getEdgeX(fulfillment, "left"),
        fulfillment.y,
      ),
      from: "payment",
      to: "fulfillment",
    },
    // Fulfillment → Delivery (2 curves) — right edge → left edge
    {
      d: curvePath(
        getEdgeX(fulfillment, "right"),
        fulfillment.y,
        getEdgeX(courier, "left"),
        courier.y,
      ),
      from: "fulfillment",
      to: "courier",
    },
    {
      d: curvePath(
        getEdgeX(fulfillment, "right"),
        fulfillment.y,
        getEdgeX(paczkomat, "left"),
        paczkomat.y,
      ),
      from: "fulfillment",
      to: "paczkomat",
    },
    // Delivery → Delivered (2 curves) — right edge → left edge
    {
      d: curvePath(
        getEdgeX(courier, "right"),
        courier.y,
        getEdgeX(delivered, "left"),
        delivered.y,
      ),
      from: "courier",
      to: "delivered",
    },
    {
      d: curvePath(
        getEdgeX(paczkomat, "right"),
        paczkomat.y,
        getEdgeX(delivered, "left"),
        delivered.y,
      ),
      from: "paczkomat",
      to: "delivered",
    },
    // Delivered → Screen right edge (1 straight line)
    {
      d: subtleCurvePath(
        getEdgeX(delivered, "right"),
        delivered.y,
        105,
        delivered.y,
        0.5,
      ),
      from: "delivered",
      to: "screen-right",
    },
  ];
}

// ---------- Orb path generation ----------

/** Each orb cycle chooses a random entry + random delivery */
interface OrbWaypoint {
  nodeId: string;
  color: string;
}

/** A segment the orb must traverse between two adjacent waypoints. */
interface OrbSegment {
  fromId: string;
  toId: string;
  color: string;
}

interface OrbRoute {
  waypoints: OrbWaypoint[];
  segments: OrbSegment[];
}

const ENTRY_CHANNELS: Array<{ id: string; emoji: string }> = [
  { id: "mobile", emoji: "📱" },
  { id: "web", emoji: "💻" },
  { id: "pos", emoji: "🏪" },
];

function generateOrbRoute(groups: Record<NodeGroup, PipelineNode[]>): OrbRoute {
  const entryIdx = Math.floor(Math.random() * 3);
  const deliveryIdx = Math.floor(Math.random() * 2);

  const entry = groups.entry[entryIdx];
  const [payment, fulfillment] = groups.process;
  const delivery = groups.delivery[deliveryIdx];
  const [delivered] = groups.exit;

  const waypoints: OrbWaypoint[] = [
    { nodeId: `screen-left-${entry.id}`, color: entry.color }, // screen edge
    { nodeId: entry.id, color: entry.color },
    { nodeId: payment.id, color: payment.color },
    { nodeId: fulfillment.id, color: fulfillment.color },
    { nodeId: delivery.id, color: delivery.color },
    { nodeId: delivered.id, color: delivered.color },
    { nodeId: "screen-right", color: delivered.color }, // screen edge exit
  ];

  // Build segment list: each consecutive pair of waypoints forms a segment
  const segments: OrbSegment[] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    segments.push({
      fromId: waypoints[i].nodeId,
      toId: waypoints[i + 1].nodeId,
      color: waypoints[i + 1].color,
    });
  }

  return { waypoints, segments };
}

// ---------- SVG path animation utilities ----------

/** Cubic ease-in-out for smooth path traversal. */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Animate an orb along an SVG path element using requestAnimationFrame.
 * Returns a cancel function.
 */
function animateAlongPath(
  pathEl: SVGPathElement,
  durationMs: number,
  onUpdate: (x: number, y: number) => void,
  onComplete: () => void,
): () => void {
  const totalLength = pathEl.getTotalLength();
  let rafId = 0;
  let cancelled = false;
  const startTime = performance.now();

  function frame(now: number) {
    if (cancelled) return;
    const elapsed = now - startTime;
    const rawT = Math.min(elapsed / durationMs, 1);
    const eased = easeInOutCubic(rawT);
    const point = pathEl.getPointAtLength(eased * totalLength);
    // point.x / point.y are in SVG viewBox coords (0-100) → map to %
    onUpdate(point.x, point.y);
    if (rawT < 1) {
      rafId = requestAnimationFrame(frame);
    } else {
      onComplete();
    }
  }

  rafId = requestAnimationFrame(frame);

  return () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
  };
}

// ---------- useOrbRunner hook ----------

interface OrbState {
  x: number;
  y: number;
  color: string;
  key: number;
  activeNodeId: string | null;
  displayNodeId: string;
  visible: boolean;
}

interface OrbToasts {
  payment: boolean;
  paymentAmount: string;
  entry: boolean;
  entryChannel: string;
  entryEmoji: string;
}

interface FulfillmentQueue {
  waiting: Array<{ resolve: () => void; orbId: number }>;
  batchSize: number;
  maxWaitMs: number;
}

interface OrbRunnerResult extends OrbState {
  toasts: OrbToasts;
}

function useOrbRunner(
  delayMs: number,
  paused: boolean,
  nodeGroups: Record<NodeGroup, PipelineNode[]>,
  svgRef: React.RefObject<SVGSVGElement | null>,
  fulfillmentQueue: React.RefObject<FulfillmentQueue>,
  orbId: number,
): OrbRunnerResult {
  const [state, setState] = useState<OrbState>({
    x: -5,
    y: 50,
    color: colorMap.indigo.solid,
    key: 0,
    activeNodeId: null,
    displayNodeId: "web",
    visible: false,
  });
  const [showPaymentToast, setShowPaymentToast] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("299.00");
  const [showEntryToast, setShowEntryToast] = useState(false);
  const [entryChannel, setEntryChannel] = useState("Web Store");
  const [entryEmoji, setEntryEmoji] = useState("💻");

  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Track generation to invalidate stale timer chains after pause/unpause
  const generationRef = useRef(0);

  // Store nodeGroups in ref to avoid re-triggering effect
  const groupsRef = useRef(nodeGroups);
  groupsRef.current = nodeGroups;

  // Store svgRef in a stable ref so we always read the latest value
  const svgElRef = useRef(svgRef);
  svgElRef.current = svgRef;

  useEffect(() => {
    // Increment generation — invalidates ALL timers from previous effect runs
    const generation = ++generationRef.current;
    let active = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelAnim: (() => void) | null = null;

    const clearTimers = () => {
      timers.forEach((t) => clearTimeout(t));
      timers.length = 0;
      if (cancelAnim) {
        cancelAnim();
        cancelAnim = null;
      }
    };

    const isValid = () => active && generationRef.current === generation;

    const addTimer = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        if (isValid()) fn();
      }, ms);
      timers.push(id);
      return id;
    };

    const scheduleNext = (fn: () => void, ms: number) => {
      const check = () => {
        if (!isValid()) return;
        if (pausedRef.current) {
          addTimer(check, 100);
          return;
        }
        fn();
      };
      addTimer(check, ms);
    };

    /** Find an SVG <path> element by its from-to id. */
    const findPathEl = (
      fromId: string,
      toId: string,
    ): SVGPathElement | null => {
      const svg = svgElRef.current?.current;
      if (!svg) return null;
      return svg.querySelector<SVGPathElement>(`#${pathId(fromId, toId)}`);
    };

    // Reset orb to invisible state when effect re-runs (e.g. after visibility change)
    setState((prev) => ({
      ...prev,
      x: -5,
      y: 50,
      visible: false,
      activeNodeId: null,
      key: prev.key + 1,
    }));
    setShowPaymentToast(false);
    setShowEntryToast(false);

    const runCycle = () => {
      if (!isValid()) return;

      const route = generateOrbRoute(groupsRef.current);
      let segIdx = 0;

      // Find channel info for entry toast
      const entryNodeId = route.waypoints[1].nodeId;
      const channelInfo = ENTRY_CHANNELS.find((c) => c.id === entryNodeId);
      const entryNode = groupsRef.current.entry.find(
        (n) => n.id === entryNodeId,
      );

      const activateNode = (nodeId: string, stepIndex: number) => {
        if (!isValid()) return;

        // Don't activate screen-edge pseudo-nodes
        if (!nodeId.startsWith("screen-")) {
          setState((prev) => ({
            ...prev,
            activeNodeId: nodeId,
            displayNodeId: nodeId,
          }));
        }

        // Entry toast — when orb arrives at the entry node (waypoint 1)
        if (stepIndex === 1 && channelInfo && entryNode) {
          setEntryChannel(entryNode.label);
          setEntryEmoji(channelInfo.emoji);
          setShowEntryToast(true);
          addTimer(() => setShowEntryToast(false), 2400 + Math.random() * 600);
        }

        // Payment toast — when orb arrives at payment node (waypoint 2)
        if (stepIndex === 2) {
          const dollars = Math.floor(Math.random() * 400) + 49;
          const cents = Math.floor(Math.random() * 100);
          setPaymentAmount(`${dollars}.${cents.toString().padStart(2, "0")}`);
          setShowPaymentToast(true);
          addTimer(
            () => setShowPaymentToast(false),
            2800 + Math.random() * 800,
          );
        }
      };

      /** Animate along one segment, then proceed to the next. */
      const runSegment = () => {
        if (!isValid()) return;

        // Before the first segment, position the orb at the screen left edge
        if (segIdx === 0) {
          const firstWp = route.waypoints[0];
          const firstPathEl = findPathEl(
            route.segments[0].fromId,
            route.segments[0].toId,
          );
          // Position at the START of the first path (x:0, screen left edge)
          if (firstPathEl) {
            const startPt = firstPathEl.getPointAtLength(0);
            setState((prev) => ({
              ...prev,
              x: startPt.x,
              y: startPt.y,
              color: colorMap[firstWp.color]?.solid ?? colorMap.indigo.solid,
              activeNodeId: null,
              visible: true,
            }));
          } else {
            // Fallback: position at left edge at the entry node's y
            const entryN = groupsRef.current.entry.find((nd) =>
              firstWp.nodeId.endsWith(nd.id),
            );
            setState((prev) => ({
              ...prev,
              x: 0,
              y: entryN?.y ?? 50,
              color: colorMap[firstWp.color]?.solid ?? colorMap.indigo.solid,
              activeNodeId: null,
              visible: true,
            }));
          }

          // Activate screen-left pseudo-node (will be skipped by activateNode)
          addTimer(() => activateNode(firstWp.nodeId, 0), 100);
        }

        // Wait for node activation pause, then travel the segment
        const pauseDuration =
          segIdx === 0 ? 200 + Math.random() * 200 : 400 + Math.random() * 400;

        scheduleNext(() => {
          if (!isValid()) return;

          const seg = route.segments[segIdx];
          const pathEl = findPathEl(seg.fromId, seg.toId);

          const travelDuration = 1200 + Math.random() * 400;

          const onPositionUpdate = (x: number, y: number) => {
            if (!isValid()) return;
            setState((prev) => ({
              ...prev,
              x,
              y,
              color: colorMap[seg.color]?.solid ?? prev.color,
              visible: true,
            }));
          };

          const onSegmentComplete = () => {
            if (!isValid()) return;
            cancelAnim = null;

            // waypointIndex after this segment = segIdx + 1
            const waypointIdx = segIdx + 1;

            // Activate the destination node
            addTimer(
              () =>
                activateNode(route.waypoints[waypointIdx].nodeId, waypointIdx),
              200 + Math.random() * 200,
            );

            segIdx++;

            if (segIdx >= route.segments.length) {
              // All segments done — fade out and restart
              scheduleNext(
                () => {
                  setState((prev) => ({
                    ...prev,
                    x: -5,
                    y: 50,
                    color: colorMap.indigo.solid,
                    key: prev.key + 1,
                    activeNodeId: null,
                    visible: false,
                  }));
                  scheduleNext(runCycle, 1200 + Math.random() * 1800);
                },
                1000 + Math.random() * 600,
              );
            } else {
              // Check if we just arrived at fulfillment (waypointIdx === 3)
              const arrivedAtFulfillment =
                route.waypoints[waypointIdx]?.nodeId === "fulfillment";

              if (arrivedAtFulfillment && fulfillmentQueue.current) {
                // BATCH WAIT: pause here until enough orbs accumulate
                const queue = fulfillmentQueue.current;

                const waitForBatch = () => {
                  if (!isValid()) return;

                  // Create a resolve callback for this orb
                  let released = false;
                  const releaseOrb = () => {
                    if (released) return;
                    released = true;
                    // Small stagger so orbs don't all depart at exactly the same frame
                    scheduleNext(runSegment, 100 + Math.random() * 300);
                  };

                  queue.waiting.push({ resolve: releaseOrb, orbId });

                  // Check if batch is full → release all
                  if (queue.waiting.length >= queue.batchSize) {
                    const batch = queue.waiting.splice(0);
                    batch.forEach((item, i) => {
                      addTimer(() => item.resolve(), i * 150);
                    });
                  } else {
                    // Set max-wait timeout to prevent deadlock
                    addTimer(() => {
                      if (released) return;
                      // Force release this orb and any others waiting
                      const idx = queue.waiting.findIndex(
                        (w) => w.orbId === orbId,
                      );
                      if (idx >= 0) {
                        const batch = queue.waiting.splice(0);
                        batch.forEach((item, i) => {
                          addTimer(() => item.resolve(), i * 150);
                        });
                      }
                    }, queue.maxWaitMs);
                  }
                };

                // Wait a moment at fulfillment before joining queue (looks like the orb is "processing")
                scheduleNext(waitForBatch, 400 + Math.random() * 400);
              } else {
                // Normal: pause at node, then continue
                scheduleNext(runSegment, 600 + Math.random() * 600);
              }
            }
          };

          if (pathEl) {
            // Animate along the real SVG bezier path
            cancelAnim = animateAlongPath(
              pathEl,
              travelDuration,
              onPositionUpdate,
              onSegmentComplete,
            );
          } else {
            // Fallback: linear interpolation if path element not found
            const fromNode = allNodes(groupsRef.current).find(
              (n) => n.id === seg.fromId,
            );
            const toNode = allNodes(groupsRef.current).find(
              (n) => n.id === seg.toId,
            );
            if (fromNode && toNode) {
              const startX = getEdgeX(fromNode, "right");
              const startY = fromNode.y;
              const endX = getEdgeX(toNode, "left");
              const endY = toNode.y;
              const startTime = performance.now();
              let rafId = 0;
              let cancelled = false;

              const fallbackFrame = (now: number) => {
                if (cancelled || !isValid()) return;
                const rawT = Math.min((now - startTime) / travelDuration, 1);
                const eased = easeInOutCubic(rawT);
                const x = startX + (endX - startX) * eased;
                const y = startY + (endY - startY) * eased;
                onPositionUpdate(x, y);
                if (rawT < 1) {
                  rafId = requestAnimationFrame(fallbackFrame);
                } else {
                  onSegmentComplete();
                }
              };

              rafId = requestAnimationFrame(fallbackFrame);
              cancelAnim = () => {
                cancelled = true;
                cancelAnimationFrame(rafId);
              };
            } else {
              // Ultimate fallback — skip segment
              onSegmentComplete();
            }
          }
        }, pauseDuration);
      };

      runSegment();
    };

    scheduleNext(runCycle, delayMs);

    return () => {
      active = false;
      clearTimers();
      // Clean up any pending entries for this orb in the fulfillment queue
      if (fulfillmentQueue.current) {
        const queue = fulfillmentQueue.current;
        queue.waiting = queue.waiting.filter((w) => w.orbId !== orbId);
      }
    };
  }, [delayMs, paused, orbId, fulfillmentQueue]);

  return {
    ...state,
    toasts: {
      payment: showPaymentToast,
      paymentAmount,
      entry: showEntryToast,
      entryChannel,
      entryEmoji,
    },
  };
}

// ---------- Pipeline node component ----------

function PipelineNodeBox({
  node,
  isActive,
}: {
  node: PipelineNode;
  isActive: boolean;
}) {
  const colors = colorMap[node.color] ?? colorMap.indigo;

  const sizeClasses: Record<string, { box: string; icon: string }> = {
    sm: {
      box: "w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11",
      icon: "h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5",
    },
    md: {
      box: "w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 lg:w-16 lg:h-16",
      icon: "h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7",
    },
    lg: {
      box: "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20",
      icon: "h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 lg:h-10 lg:w-10",
    },
  };

  const s = sizeClasses[node.size];

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <div className="relative">
        <div
          className={`relative rounded-xl sm:rounded-2xl border-2 flex items-center justify-center backdrop-blur-sm bg-zinc-950/90 ${s.box}`}
          style={{
            borderColor: isActive ? colors.solid : `${colors.solid}30`,
            boxShadow: isActive ? `0 0 30px ${colors.solid}40` : "none",
            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <node.icon className={`${s.icon} ${colors.text}`} strokeWidth={1.5} />
        </div>
        <div
          className="absolute -bottom-6 sm:-bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] sm:text-xs font-medium hidden sm:block"
          style={{
            color: isActive ? "#ffffff" : "#71717a",
            transition: "color 0.3s ease",
          }}
        >
          {node.label}
        </div>
      </div>
    </div>
  );
}

// ---------- SVG pipeline lines ----------

function PipelineLines({
  paths,
  svgRef,
}: {
  paths: PathDef[];
  svgRef: React.Ref<SVGSVGElement>;
}) {
  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full z-[25] pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        <linearGradient id="lineGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="lineGradCenter" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="lineGradRight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="lineGradExit" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="lineGradEntry" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="lineGradExitRight"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {paths.map((p) => {
        let gradient = "url(#lineGradLeft)";
        if (p.from.startsWith("screen-left")) gradient = "url(#lineGradEntry)";
        else if (p.from === "delivered" && p.to === "screen-right")
          gradient = "url(#lineGradExitRight)";
        else if (p.from === "payment") gradient = "url(#lineGradCenter)";
        else if (p.from === "fulfillment") gradient = "url(#lineGradRight)";
        else if (p.from === "courier" || p.from === "paczkomat")
          gradient = "url(#lineGradExit)";
        return (
          <path
            key={pathId(p.from, p.to)}
            id={pathId(p.from, p.to)}
            d={p.d}
            stroke={gradient}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

// ---------- Main animation component ----------

function OrderFlowAnimation({ heroText }: { heroText: HeroText }) {
  const [userPaused, setUserPaused] = useState(false);
  const pageVisible = usePageVisible();

  // Pause when user clicks pause OR when page is not visible
  const paused = userPaused || !pageVisible;

  const nodeGroups = getNodes(heroText);
  const paths = getPaths(nodeGroups);
  const allNodesList = allNodes(nodeGroups);

  // SVG ref for path sampling (getPointAtLength)
  const svgRef = useRef<SVGSVGElement>(null);

  // Shared fulfillment queue — orbs accumulate here before proceeding to delivery
  const fulfillmentQueueRef = useRef<FulfillmentQueue>({
    waiting: [],
    batchSize: 2, // Release when 2 orbs are waiting (with 3 orbs total this is good)
    maxWaitMs: 5000, // Max wait before force-releasing (prevent deadlock)
  });

  // Three orb runners with wide staggered offsets to reduce toast spam
  const orbA = useOrbRunner(
    500,
    paused,
    nodeGroups,
    svgRef,
    fulfillmentQueueRef,
    0,
  );
  const [orbBDelay] = useState(() => 3500 + Math.random() * 2500);
  const [orbCDelay] = useState(() => 7000 + Math.random() * 3000);
  const orbB = useOrbRunner(
    500 + orbBDelay,
    paused,
    nodeGroups,
    svgRef,
    fulfillmentQueueRef,
    1,
  );
  const orbC = useOrbRunner(
    500 + orbCDelay,
    paused,
    nodeGroups,
    svgRef,
    fulfillmentQueueRef,
    2,
  );
  const orbs = [orbA, orbB, orbC];

  // Status bar: track most recently active node
  const [displayNodeId, setDisplayNodeId] = useState("web");
  useEffect(() => {
    if (orbA.activeNodeId) setDisplayNodeId(orbA.activeNodeId);
  }, [orbA.activeNodeId]);
  useEffect(() => {
    if (orbB.activeNodeId) setDisplayNodeId(orbB.activeNodeId);
  }, [orbB.activeNodeId]);
  useEffect(() => {
    if (orbC.activeNodeId) setDisplayNodeId(orbC.activeNodeId);
  }, [orbC.activeNodeId]);

  // Live counters
  const ordersRef = useRef(840);
  const [ordersCount, setOrdersCount] = useState(840);
  const [growthValue, setGrowthValue] = useState(22);

  useEffect(() => {
    if (orbA.activeNodeId || orbB.activeNodeId || orbC.activeNodeId) {
      const increment = Math.floor(Math.random() * 3) + 1;
      ordersRef.current += increment;
      setOrdersCount(ordersRef.current);
      setGrowthValue((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(18, Math.min(32, prev + delta));
      });
    }
  }, [orbA.activeNodeId, orbB.activeNodeId, orbC.activeNodeId]);

  // Collect toasts — payments LEFT, entries RIGHT
  const paymentToasts: Array<{ id: string; paymentAmount: string }> = [];
  const entryToasts: Array<{ id: string; channel: string; emoji: string }> = [];

  orbs.forEach((orb, i) => {
    if (orb.toasts.payment) {
      paymentToasts.push({
        id: `payment-${i}`,
        paymentAmount: orb.toasts.paymentAmount,
      });
    }
    if (orb.toasts.entry) {
      entryToasts.push({
        id: `entry-${i}`,
        channel: orb.toasts.entryChannel,
        emoji: orb.toasts.entryEmoji,
      });
    }
  });

  // Current node data for status bar
  const currentNode =
    allNodesList.find((n) => n.id === displayNodeId) ?? allNodesList[0];
  const currentColors = colorMap[currentNode.color] ?? colorMap.indigo;

  // Status bar progress dots — representative pipeline nodes
  const statusDots: PipelineNode[] = [
    nodeGroups.entry[1], // Web (represents entry)
    nodeGroups.process[0], // Payment
    nodeGroups.process[1], // Fulfillment
    nodeGroups.delivery[0], // Courier (represents delivery)
    nodeGroups.exit[0], // Delivered
  ];

  // Find index of displayNode in status dots (or closest match by group)
  const dotIndex = (() => {
    const idx = statusDots.findIndex((n) => n.id === displayNodeId);
    if (idx >= 0) return idx;
    // Map entry nodes to dot 0, delivery nodes to dot 3
    if (nodeGroups.entry.some((n) => n.id === displayNodeId)) return 0;
    if (nodeGroups.delivery.some((n) => n.id === displayNodeId)) return 3;
    return 0;
  })();

  return (
    <div className="relative w-full h-[280px] sm:h-[320px] md:h-[350px] lg:h-[400px]">
      {/* Pause/Play button */}
      <button
        onClick={() => setUserPaused((p) => !p)}
        className="absolute top-2 right-2 z-50 p-2 rounded-lg bg-zinc-900/80 border border-zinc-700/50 backdrop-blur-sm text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
        aria-label={userPaused ? "Play animation" : "Pause animation"}
      >
        {userPaused ? (
          <Play className="w-4 h-4" />
        ) : (
          <Pause className="w-4 h-4" />
        )}
      </button>

      {/* SVG pipeline lines */}
      <PipelineLines paths={paths} svgRef={svgRef} />

      {/* Traveling orbs — positioned via requestAnimationFrame path sampling */}
      {orbs.map((orb, i) => (
        <div
          key={`orb-${i}-${orb.key}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            opacity: orb.visible ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-3 sm:-inset-4 md:-inset-6 rounded-full blur-md sm:blur-lg md:blur-xl"
              animate={{ backgroundColor: `${orb.color}30` }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute -inset-1.5 sm:-inset-2 md:-inset-3 rounded-full blur-sm sm:blur-md"
              animate={{ backgroundColor: `${orb.color}50` }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full"
              animate={{
                backgroundColor: orb.color,
                boxShadow: `0 0 20px ${orb.color}, 0 0 40px ${orb.color}80`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      ))}

      {/* Pipeline nodes */}
      {allNodesList.map((node) => (
        <PipelineNodeBox
          key={node.id}
          node={node}
          isActive={orbs.some((orb) => orb.activeNodeId === node.id)}
        />
      ))}

      {/* Payment toasts — LEFT side */}
      <div className="absolute left-2 sm:left-6 bottom-[5rem] sm:bottom-[6.5rem] z-40 pointer-events-none flex flex-col-reverse gap-2">
        <AnimatePresence>
          {paymentToasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex items-center gap-2 sm:gap-3 rounded-lg bg-zinc-900/95 border backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 shadow-2xl pointer-events-auto"
              style={{
                borderColor: "rgba(59, 130, 246, 0.3)",
                boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.1)",
              }}
            >
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-blue-500/15">
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-semibold text-white">
                  {heroText.paymentReceived}
                </div>
                <div
                  className="text-[10px] sm:text-xs text-zinc-400"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  ${toast.paymentAmount}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Entry/Order toasts — RIGHT side */}
      <div className="absolute right-2 sm:right-6 bottom-[5rem] sm:bottom-[6.5rem] z-40 pointer-events-none flex flex-col-reverse gap-2">
        <AnimatePresence>
          {entryToasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex items-center gap-2 sm:gap-3 rounded-lg bg-zinc-900/95 border backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 shadow-2xl pointer-events-auto"
              style={{
                borderColor: "rgba(99, 102, 241, 0.3)",
                boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.1)",
              }}
            >
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-indigo-500/15">
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-semibold text-white">
                  {heroText.newOrderFrom} {toast.channel} {toast.emoji}
                </div>
                <div
                  className="text-[10px] sm:text-xs text-zinc-400"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  #ORD-{Math.floor(Math.random() * 59) + 2841} —{" "}
                  {heroText.orderItems}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Persistent status bar */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-2 sm:bottom-4 z-30 w-[calc(100%-1rem)] sm:w-auto">
        <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-sm px-4 py-3 sm:px-6 sm:py-4 md:px-8 flex items-center gap-3 sm:gap-4 md:gap-6">
          {/* Left: Current step notification */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-[120px] sm:min-w-[180px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={displayNodeId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex items-center gap-2 sm:gap-3"
              >
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${currentColors.solid}20` }}
                >
                  <currentNode.icon
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${currentColors.text}`}
                  />
                </div>
                <div>
                  <div
                    className="text-base sm:text-xl font-bold text-white"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {currentNode.stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-zinc-400">
                    {currentNode.stat.label}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="w-px h-8 sm:h-12 bg-zinc-800" />

          {/* Middle: Progress dots — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2">
            {statusDots.map((node, i) => (
              <motion.div
                key={node.id}
                className="w-2 h-2 rounded-full"
                animate={{
                  backgroundColor:
                    i <= dotIndex
                      ? (colorMap[node.color]?.solid ?? "#3f3f46")
                      : "#3f3f46",
                  scale: dotIndex === i ? 1.3 : 1,
                  opacity: dotIndex === i ? [1, 0.5, 1] : 1,
                }}
                transition={{
                  backgroundColor: { duration: 0.3, ease: "easeOut" },
                  scale: { duration: 0.3, ease: "easeOut" },
                  opacity: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />
            ))}
          </div>

          <div className="hidden sm:block w-px h-12 bg-zinc-800" />

          {/* Right: Live counters */}
          <div className="text-center">
            <motion.div
              className="text-sm sm:text-lg font-bold text-white"
              style={{ fontVariantNumeric: "tabular-nums" }}
              key={ordersCount}
              initial={{ opacity: 0.7, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {ordersCount}
            </motion.div>
            <div className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wider">
              {heroText.ordersToday}
            </div>
          </div>

          <div className="text-center">
            <motion.div
              className="text-sm sm:text-lg font-bold text-green-400"
              style={{ fontVariantNumeric: "tabular-nums" }}
              key={growthValue}
              initial={{ opacity: 0.7, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              +{growthValue}%
            </motion.div>
            <div className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wider">
              {heroText.growth}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection({ lang = "en" }: { lang?: Lang }) {
  const text = t("hero", lang);
  const linkPrefix = `/${lang}`;

  return (
    <section className="relative overflow-hidden pt-32 pb-8 lg:pt-40 lg:pb-16">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute -right-1/4 top-0 h-[600px] w-[600px] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute left-1/2 bottom-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          <motion.h1
            className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {text.title}
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              {text.titleHighlight}
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-xl text-zinc-400 lg:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {text.subtitle}
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href={`${linkPrefix}/docs/guides/getting-started/installation`}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-zinc-900 transition-all hover:bg-zinc-200"
            >
              {text.getStarted}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/aexol-studio/deenruv"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-8 py-4 text-lg font-semibold text-white transition-all hover:border-zinc-500 hover:bg-zinc-800/50"
            >
              {text.viewOnGitHub}
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-8 w-full overflow-hidden">
        <OrderFlowAnimation heroText={text} />
      </div>
    </section>
  );
}
