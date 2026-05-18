ARG docker_io_image_prefix=docker.io/library
FROM ${docker_io_image_prefix}/node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy only the docs app package.json (no workspace context)
COPY --parents package.json apps/*/package.json packages/*/package.json plugins/*/package.json pnpm-lock.yaml pnpm-workspace.yaml .

# Install dependencies directly without workspace
RUN pnpm install

# Build stage
FROM base AS builder
WORKDIR /app

# Copy installed dependencies
COPY --from=deps --parents /app/node_modules /app/apps/docs/node_modules /

# Copy the docs app source
COPY apps/docs/ ./apps/docs

WORKDIR /app/apps/docs

# Generate .source directory (fumadocs-mdx codegen)
RUN npx fumadocs-mdx

COPY --parents package.json apps/*/package.json packages/*/package.json plugins/*/package.json pnpm-lock.yaml pnpm-workspace.yaml ../..
# Build the docs app
RUN pnpm build 

# Production stage
FROM ${docker_io_image_prefix}/node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output (standalone outputs to root, not nested)
COPY --from=builder /app/apps/docs/.next/standalone ./
COPY --from=builder /app/apps/docs/.next/static ./.next/static
COPY --from=builder /app/apps/docs/public ./public

# Fix permissions for cache directory
RUN chown -R nextjs:nodejs ./.next

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["sh", "-c", "HOSTNAME=:: node server.js"]
