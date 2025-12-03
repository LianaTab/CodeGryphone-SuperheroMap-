# syntax=docker/dockerfile:1.5

FROM node:20-alpine AS base

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production

WORKDIR /app

RUN apk add --no-cache libc6-compat python3 make g++ \
  && corepack enable

# Dependencies layer (install only backend deps)
FROM base AS deps

WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/backend/package.json apps/backend/package.json
RUN pnpm install --filter backend... --prod=false --ignore-scripts

# Build layer
FROM base AS builder

WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm --filter backend build

# Production runtime
FROM base AS production

ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY package.json pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
RUN pnpm install --filter backend --prod --ignore-scripts
EXPOSE 3000
CMD ["node", "apps/backend/dist/main.js"]

# Development image used by docker-compose
FROM base AS development

ENV NODE_ENV=development
WORKDIR /app
COPY . .
CMD ["pnpm", "--filter", "backend", "dev"]
