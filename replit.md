# EduSuite Demo

A French-first, Vercel-ready Next.js demonstration of a configurable education SaaS for schools, school groups, and universities.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/edusuite-demo run dev` — run the Next.js demo
- `pnpm --filter @workspace/edusuite-demo run build` — build the static Next.js export for Vercel
- `pnpm --filter @workspace/edusuite-demo run typecheck` — typecheck the demo
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- The demo uses sample data only; the existing API and database scaffold are not connected to it.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Demo: Next.js App Router with static export for Vercel
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/edusuite-demo/app/` — Next.js App Router entry points and metadata
- `artifacts/edusuite-demo/src/` — interactive demo interface and theme
- `lib/api-spec/openapi.yaml` — API contract source of truth (currently health check only)
- `lib/db/src/schema/` — database schema source (currently empty)

## Architecture decisions

- The demo is a static Next.js export so it can be presented from Vercel without provisioning backend services.
- Sample interactions run in the browser and must not be presented as production persistence, authentication, tenant isolation, or synchronization.
- Education-level-specific experiences should hide irrelevant modules, while the product vision continues to cover the full K–12 and university scope.

## Product

- Present the multi-tenant, multi-institution product vision with institution profiles from nursery through university.
- Demonstrate adapted academic, finance, HR, family, learner, school-service, AI-assistant, international-configuration, and SaaS-control-center views.
- Show the planned offline-first workflow as a demo state; authoritative records and conflict-safe synchronization remain future backend work.

## User preferences

- Preserve the international, modular education SaaS requirements from the shared project conversation.
- The user selected the flexible organization model: standalone institutions and multi-institution groups.
- Build the client-facing demo with Next.js for Vercel.

## Gotchas

- Keep the demo sample-only until real tenant security, identity, audit, and synchronization services exist.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
