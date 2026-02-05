'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
}

const stats: StatItem[] = [
  {
    value: 10000,
    suffix: '+',
    label: 'Developers',
  },
  {
    value: 1,
    suffix: 'M+',
    label: 'API Calls/Month',
  },
  {
    value: 99.9,
    suffix: '%',
    label: 'Uptime',
  },
  {
    value: 50,
    suffix: '+',
    label: 'Countries',
  },
];

function AnimatedCounter({
  value,
  suffix,
  prefix = '',
  isInView,
}: {
  value: number;
  suffix: string;
  prefix?: string;
  isInView: boolean;
}) {
  const [hasAnimated, setHasAnimated] = useState(false);

  const springValue = useSpring(0, {
    damping: 30,
    stiffness: 100,
    duration: 2000,
  });

  const displayValue = useTransform(springValue, (latest: number) => {
    if (value % 1 !== 0) {
      return latest.toFixed(1);
    }
    return Math.round(latest).toLocaleString();
  });

  const [displayText, setDisplayText] = useState('0');

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value);
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated, springValue, value]);

  useEffect(() => {
    const unsubscribe = displayValue.on('change', (latest: string) => {
      setDisplayText(latest);
    });
    return () => unsubscribe();
  }, [displayValue]);

  return (
    <span className="tabular-nums">
      {prefix}
      {displayText}
      {suffix}
    </span>
  );
}

function StatItemComponent({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-50px',
    amount: 0.5,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
      className="text-center"
    >
      <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 text-fd-primary">
        <AnimatedCounter
          value={stat.value}
          suffix={stat.suffix}
          prefix={stat.prefix}
          isInView={isInView}
        />
      </h3>
      <p className="text-fd-muted-foreground">{stat.label}</p>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className="py-24 md:py-32 border-y border-fd-border/40 bg-fd-muted/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Trusted by developers worldwide
          </h2>
          <p className="text-fd-muted-foreground">
            Building the future with modern e-commerce
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatItemComponent key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
