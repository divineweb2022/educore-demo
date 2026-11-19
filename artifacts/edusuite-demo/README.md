# EduSuite Demo

Client-facing, French-first education SaaS demo built with Next.js App Router. The app exports static files and is intended to be deployed on Vercel.

## Run locally

From the workspace root:

```sh
pnpm --filter @workspace/edusuite-demo run dev
```

Build the static Next.js output:

```sh
pnpm --filter @workspace/edusuite-demo run build
```

## Deploy on Vercel

Import the repository into Vercel and set the project root to `artifacts/edusuite-demo`. Select the Next.js framework preset and use `pnpm run build` as the build command. The static output is generated in `out/`. No environment variables are required for this demo.

## Demo boundaries

Institution profiles, learners, staff, payments, assistant responses, and activity are fictional. Browser-local interactions demonstrate the intended workflows; they do not provide production authentication, tenant isolation, server-side permissions, payment processing, AI services, or real offline synchronization.
