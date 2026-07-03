# Préréglage global de l'application à build
ARG APP
ARG APP_DIR
ARG NODE_VERSION=22.17.0

# --- Étape 1 : Prune du Monorepo ---
FROM node:${NODE_VERSION}-slim AS pruner
RUN echo NODE_VERSION=${NODE_VERSION} > /build-args.txt
RUN npm i -g turbo
WORKDIR /app
COPY . .
ARG APP
RUN turbo prune $APP --docker

# --- Étape 2 : Installation des dépendances ---
FROM node:${NODE_VERSION}-slim AS installer
RUN npm i -g pnpm turbo
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml .
COPY --from=pruner /app/out/pnpm-workspace.yaml .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --recursive

# --- Étape 3 : Build de l'application ---
FROM installer AS builder
WORKDIR /app

ARG APP
COPY --from=pruner /app/out/full .

# 💡 CORRECTION 1 : On garde uniquement le tsconfig global qui avait bien été trouvé
COPY --from=pruner /app/tsconfig.base.json ./

# 💡 CORRECTION 2 : On utilise pnpm avec les "..." AVANT la variable de l'application.
# Cela indique à pnpm de build l'application ET toutes ses dépendances internes d'abord.
RUN pnpm --filter ...$APP build

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

# 🟢 REPRISE DE L'ARGUMENT ET PERSISTANCE POUR LE RUNTIME
ARG APP_DIR
ENV APP_DIR=${APP_DIR}

COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_DIR}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_DIR}/.next/static ./apps/${APP_DIR}/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_DIR}/public ./apps/${APP_DIR}/public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Remplacer l'ancien CMD par celui-ci :
CMD ["sh", "-c", "exec node apps/${APP_DIR}/server.js"]