# Préréglage global de l'application à build
ARG APP

# --- Étape 1 : Prune du Monorepo ---
FROM node:20-slim AS pruner
RUN npm i -g turbo
WORKDIR /app
COPY . .
ARG APP
# Utilise la vraie commande de filtrage de turbo
RUN turbo prune $APP --docker

# --- Étape 2 : Installation des dépendances ---
FROM node:20-slim AS installer
RUN npm i -g pnpm
WORKDIR /app

# Copie uniquement les package.json pour optimiser le cache Docker
COPY --from=pruner /app/out/json .
# Utilisation du cache Docker pour le store PNPM (Builds ultra rapides)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# --- Étape 3 : Build de l'application ---
# On hérite directement de 'installer' pour garder pnpm et les node_modules
FROM installer AS builder
WORKDIR /app
ARG APP
# Copie le reste du code source élagué
COPY --from=pruner /app/out/full .
# Build de l'application Next.js cible
RUN pnpm turbo run build --filter=$APP

# --- Étape 4 : Runtime de Production (Léger et Sécurisé) ---
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
# Désactive la télémétrie Next.js en prod si tu le souhaites
ENV NEXT_TELEMETRY_DISABLED=1

# Sécurité : Création d'un utilisateur non-privilégié (Bonne pratique majeure)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

ARG APP
# Copie du build standalone (génère un serveur Node autonome découpé)
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/standalone ./
# Correction des chemins de destination (Relatifs au WORKDIR)
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/static ./apps/${APP}/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/public ./apps/${APP}/public

# Passage à l'utilisateur sécurisé
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Astuce pour injecter l'ARG de build dans une ENV de runtime
ENV APP_NAME=${APP}

# Utilisation de 'exec node' pour transmettre correctement les signaux de fermeture (SIGTERM)
CMD exec node apps/${APP_NAME}/server.js