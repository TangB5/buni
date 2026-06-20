# Préréglage global de l'application à build
ARG APP

# --- Étape 1 : Prune du Monorepo ---
FROM node:20-slim AS pruner
RUN npm i -g turbo
WORKDIR /app
COPY . .
ARG APP
RUN turbo prune $APP --docker

# --- Étape 2 : Installation des dépendances ---
FROM node:20-slim AS installer
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
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

ARG APP
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/static ./apps/${APP}/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/public ./apps/${APP}/public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENV APP_NAME=${APP}

CMD ["sh", "-c", "node apps/${APP_NAME}/server.js"]