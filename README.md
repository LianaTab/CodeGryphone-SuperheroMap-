# SuperheroMap

SuperheroMap is a cross-platform productivity assistant that unites personal news, tasks, calendar, focus practices, sport micro-workouts, and an AI-powered question hub. The project runs as a pnpm-powered monorepo that serves the **mobile app (Expo/React Native)**, **web app (Next.js)**, and **backend service (NestJS)** while sharing UI kits, SDKs, and typings.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Feature Scope](#feature-scope)
- [Tech Stack](#tech-stack)
- [Monorepo Layout](#monorepo-layout)
- [Development Workflow](#development-workflow)
- [Running with Docker Compose](#running-with-docker-compose)
- [Environment Variables](#environment-variables)
- [Continuous Integration](#continuous-integration)
- [Coding Standards](#coding-standards)
- [Localization](#localization)
- [Next Steps](#next-steps)

## Architecture Overview
The system consists of multiple deployable units that communicate through HTTP/WebSocket APIs and shared data stores:

| Layer      | Responsibilities |
|------------|------------------|
| Backend (NestJS) | Authentication (email / phone / Apple ID), user settings sync, cron-driven content aggregation (news/tasks/focus/sport), Redis-backed caching, and PostgreSQL persistence. |
| Web App (Next.js) | Browser client with left navigation layout, calm light UI palette (#FFF8DC base), full coverage of News/Tasks/Calendar/Focus/Sport/Questions modules, and bilingual UI. |
| Mobile App (Expo) | Native client sharing business logic and UI primitives with the web build, optimized for short-form content experience and offline-friendly behavior. |
| Shared Packages | Common domain models, i18n dictionaries, SDK for API calls, and reusable UI kit components. |
| Data Stores | PostgreSQL for strong consistency, Redis for sessions/caching/rate limits. |

## Feature Scope
- **Authorization**: JWT + refresh tokens, multi-factor-friendly, synced user preferences.
- **News**: Personalized daily digest (max 50 articles) refreshed at the user’s local 06:00, sourced from top 10 providers per topic and filtered by up to 3 user-defined keywords.
- **Tasks**: Multiplan views (Day/Week/Month/Year) with reminders, recurring tasks, traffic-light priorities, calendar sync.
- **Calendar**: Day/week/month layouts with colored priorities aligned with tasks/events.
- **Focus**: Short meditations/affirmations (≤7 minutes) aggregated from external links/APIs.
- **Sport**: Equipment-free workouts (≤10 minutes) linked/streamed via aggregated providers.
- **Questions**: Built-in AI chat proxied through an internal AI gateway.
- **Localization**: Russian and English for UI and aggregated content whenever possible.

## Tech Stack
- **Runtime**: Node.js ≥ 18.18 with pnpm workspaces.
- **Backend**: NestJS, PostgreSQL, Redis, cron jobs, WebSockets.
- **Web**: Next.js (React 18), TypeScript, shared UI kit.
- **Mobile**: Expo (React Native), React Navigation, shared modules via packages.
- **Testing**: Jest (unit), Playwright (web e2e), Detox (mobile e2e).
- **Tooling**: ESLint, Prettier, Husky + lint-staged, Commitlint, Docker, GitHub Actions CI.

## Monorepo Layout
```
apps/
  backend/   # NestJS service (API, cron workers)
  web/       # Next.js application
  mobile/    # Expo application
packages/
  shared/    # Domain types, DTOs, constants, utilities
  ui/        # Cross-platform UI components & themes
  i18n/      # i18next config and locale dictionaries
  services/  # API clients/SDK shared by apps
.husky/      # Git hooks (pre-commit, commit-msg)
.github/     # CI workflows (GitHub Actions)
```

## Development Workflow
1. **Install prerequisites**: Node.js ≥ 18.18, pnpm ≥ 8.15, Docker Desktop (for containerized workflows).
2. **Bootstrap dependencies**:
   ```bash
   pnpm install
   ```
3. **Run local dev servers** (exact scripts will be added as each app is implemented):
   ```bash
   pnpm --filter backend dev   # NestJS backend in watch mode
   pnpm --filter web dev       # Next.js dev server
   pnpm --filter mobile start  # Expo dev client
   ```
4. **Code quality gates**:
   ```bash
   pnpm lint         # ESLint
   pnpm format       # Prettier (write)
   pnpm typecheck    # TypeScript project refs
   pnpm test         # Jest / future suites
   pnpm check        # Aggregated lint + typecheck + test
   ```
5. **Git hooks**: Husky runs `pnpm lint-staged` on pre-commit and Commitlint on commit messages.

## Running with Docker Compose
A Docker-based workflow is available for parity across environments.

```bash
# Copy env defaults and adjust values
cp .env.example .env

# Build images
docker compose build

# Start full stack
docker compose up
```

Services defined in `docker-compose.yml`:
- `postgres`: Persistent PostgreSQL 15 with mounted volume `postgres_data`.
- `redis`: Redis 7 for caching, rate limiting, and queues.
- `backend`: NestJS service built from `apps/backend/Dockerfile` (depends on postgres/redis).
- `web`: Next.js app (depends on backend).
- `mobile`: Expo web build for quick previews; native builds are handled via Expo CLI on host machines.

Each Node-based service mounts source code for live reload during local development.

## Environment Variables
Use `.env` (based on `.env.example`) at the project root. Key values:

| Variable | Description |
|----------|-------------|
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Database credentials shared between docker compose and backend service. |
| `POSTGRES_PORT` | Host port exposed for local tools (default 5432). |
| `REDIS_PORT` | Redis host port (default 6379). |
| `BACKEND_PORT` | NestJS HTTP API port (default 3000). |
| `WEB_PORT` | Next.js port (default 3001). |
| `MOBILE_PORT` | Expo web preview port (default 3002). |
| `JWT_SECRET`, `JWT_REFRESH_SECRET` | Secrets for token signing; replace in production. |
| `NEWS_API_KEY`, `AI_GATEWAY_URL`, … | Placeholders for upcoming integrations. |

Document any new variables inside `.env.example` when features are implemented.

## Continuous Integration
GitHub Actions workflow (`.github/workflows/ci.yml`) performs:
1. Checkout and setup of pnpm/Node.
2. Dependency installation with a frozen lockfile.
3. `pnpm check` to execute lint, typecheck, and tests.

The workflow ensures pull requests stay green before merging.

## Coding Standards
- **Linting**: Project-wide ESLint config for TypeScript, React/React Native, imports, and unused imports.
- **Formatting**: Prettier enforced via lint-staged on commit.
- **Commit conventions**: Conventional Commits enforced through Commitlint.
- **Type safety**: Strict TypeScript options defined in `tsconfig.base.json`.

## Localization
Shared `packages/i18n` will host i18next configuration and translation dictionaries for **Russian** and **English**. All UI copy and relevant content metadata must be localized; aggregated external content should include localized fields where available. Continue expanding translation coverage as new UI sections arrive.

## Next Steps
1. **Backend foundations**: bootstrap NestJS modules, database entities, and cron jobs.
2. **Shared packages**: types, SDK, UI kit, and i18n scaffolding.
3. **App shells**: Next.js + Expo navigation/layout with shared components.
4. **Testing harness**: configure Jest, Playwright, Detox.
5. **DevOps**: secrets management, deployment strategy, observability stack.

Contributions should follow the roadmap above while keeping the system production-ready, secure, and fully localized.
