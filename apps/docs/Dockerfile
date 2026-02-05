ARG docker_io_image_prefix=docker.io/library
FROM ${docker_io_image_prefix}/node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy only the docs app package.json (no workspace context)
COPY apps/docs/package.json ./

# Install dependencies directly without workspace
RUN pnpm install --ignore-workspace

# Build stage
FROM base AS builder
WORKDIR /app

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy the docs app source
COPY apps/docs/ ./

# Debug: show what was copied
RUN ls -la && ls -la src/ && ls -la src/lib/ && ls -la content/ || true

# Generate .source directory (fumadocs-mdx codegen)
RUN npx fumadocs-mdx

# Debug: verify .source was generated
RUN ls -la .source/ || echo ".source not found!"

# Build the docs app
RUN pnpm build

# Production stage
FROM ${docker_io_image_prefix}/node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output (standalone outputs to root, not nested)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Fix permissions for cache directory
RUN chown -R nextjs:nodejs ./.next

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
