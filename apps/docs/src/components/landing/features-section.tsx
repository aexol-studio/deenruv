'use client';

import { motion } from 'framer-motion';
import { Layers, Puzzle, Globe, Layout } from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'GraphQL First',
    description:
      'Powerful GraphQL API with full type safety and excellent developer experience.',
    badge: 'Core',
  },
  {
    icon: Puzzle,
    title: 'Plugin Architecture',
    description:
      'Extend functionality with plugins. Add payments, shipping, or custom features.',
    badge: 'Extensible',
  },
  {
    icon: Globe,
    title: 'Multi-channel',
    description:
      'Manage multiple storefronts, currencies, and languages from one backend.',
    badge: 'Global',
  },
  {
    icon: Layout,
    title: 'Admin Dashboard',
    description:
      'Beautiful, extensible admin UI built with React. Customize everything.',
    badge: 'Modern UI',
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40" id="features">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-fd-primary bg-fd-primary/10 rounded-full mb-6">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Built for Modern Commerce
          </h2>
          <p className="max-w-2xl mx-auto text-fd-muted-foreground text-lg">
            Everything you need to build world-class e-commerce experiences
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl border border-fd-border bg-fd-card p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:border-fd-primary/30"
            >
              {/* Number badge */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary font-bold text-lg transition-all duration-300 group-hover:bg-fd-primary/20 group-hover:scale-110 group-hover:rotate-3">
                  <feature.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider text-fd-muted-foreground bg-fd-muted px-2.5 py-1 rounded-full">
                  {feature.badge}
                </span>
              </div>

              {/* Step number */}
              <div className="absolute top-6 right-6 text-5xl font-bold text-fd-foreground/[0.03] pointer-events-none">
                0{index + 1}
              </div>

              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-fd-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
