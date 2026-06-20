# Préréglage global de l'application à build
ARG APP
ARG NODE_VERSION=20.13.0

# --- Étape 1 : Prune du Monorepo ---
FROM node:${NODE_VERSION}-slim AS pruner
RUN npm i -g turbo
WORKDIR /app
COPY . .
ARG APP
RUN turbo prune $APP --docker

# --- Étape 2 : Installation des dépendances ---
FROM node:${NODE_VERSION}-slim AS installer
RUN npm i -g pnpm
WORKDIR /app

COPY --from=pruner /app/out/json .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# --- Étape 3 : Build de l'application ---
FROM installer AS builder
WORKDIR /app
ARG APP
COPY --from=pruner /app/out/full .
RUN pnpm turbo run build --filter=$APP

# --- Étape 4 : Runtime de Production (Léger et Sécurisé) ---
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app

LABEL maintainer="buni-team"
LABEL description="Buni - African Pattern & Design System"
LABEL version="1.0.0"

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

ARG APP
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/static ./apps/${APP}/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/public ./apps/${APP}/public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["sh", "-c", "node apps/${APP}/server.js"]