'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Install Deenruv',
    description: 'Quick setup with npx or clone the starter template',
  },
  {
    number: '02',
    title: 'Configure Plugins',
    description: 'Add payments, shipping, and custom features via plugins',
  },
  {
    number: '03',
    title: 'Build Your Store',
    description: 'Use GraphQL API to create your custom storefront',
  },
  {
    number: '04',
    title: 'Deploy & Scale',
    description: 'Enterprise-ready infrastructure that grows with you',
  },
];

export function HowItWorksSection() {
  return (
    <section
      className="relative py-32 md:py-40 lg:py-48 overflow-hidden"
      id="how-it-works"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-bold tracking-[-0.04em] text-4xl sm:text-5xl md:text-6xl leading-[0.95]"
          >
            How It Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 md:mt-8 text-lg md:text-xl text-fd-foreground/60 max-w-2xl mx-auto leading-relaxed"
          >
            From zero to production-ready e-commerce in four simple steps
          </motion.p>
        </div>

        {/* Flow diagram - horizontal on desktop, vertical on mobile */}
        <div className="max-w-6xl mx-auto">
          {/* Desktop: Horizontal flow */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative"
                >
                  {/* Connecting line (except last item) */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{
                        duration: 0.5,
                        delay: 0.3 + index * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="absolute top-8 left-full w-full h-px bg-fd-foreground/10 origin-left"
                      style={{ transform: 'translateX(-50%)' }}
                    />
                  )}

                  {/* Step content */}
                  <div className="flex flex-col">
                    {/* Number */}
                    <span className="font-bold text-5xl tracking-[-0.04em] text-fd-foreground/15">
                      {step.number}
                    </span>

                    {/* Title */}
                    <h3 className="mt-4 font-semibold text-xl tracking-[-0.02em] text-fd-foreground">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-base text-fd-foreground/50 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet: Vertical flow */}
          <div className="lg:hidden">
            <div className="flex flex-col gap-12">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative flex gap-6"
                >
                  {/* Vertical connector */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{
                        duration: 0.4,
                        delay: 0.2 + index * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="absolute left-6 top-16 w-px h-[calc(100%+48px)] bg-fd-foreground/10 origin-top"
                    />
                  )}

                  {/* Number */}
                  <div className="flex-shrink-0 w-12">
                    <span className="font-bold text-3xl tracking-[-0.04em] text-fd-foreground/15">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col pt-1">
                    <h3 className="font-semibold text-lg tracking-[-0.02em] text-fd-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-base text-fd-foreground/50 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto mt-20 md:mt-28 text-center"
        >
          <p className="text-lg md:text-xl text-fd-foreground/40 leading-relaxed">
            <span className="text-fd-foreground/70">Your idea</span>
            <span className="mx-3 text-fd-foreground/20">&rarr;</span>
            <span className="text-fd-foreground/70">Deenruv backend</span>
            <span className="mx-3 text-fd-foreground/20">&rarr;</span>
            <span className="text-fd-foreground/70">Production store</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
