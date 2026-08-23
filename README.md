# PathPilot AI

Your AI-powered Student Success Operating System.

PathPilot AI is a long-term guidance platform for Indian students, from choosing a stream after Class 10 through landing a first job. It keeps a persistent profile and decision history, explains every recommendation using the student's own inputs, and turns goals into trackable missions.

## Stack

- Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4
- shadcn/ui source components, Framer Motion, Lucide icons
- Clerk authentication with Supabase Third-Party Auth
- Supabase Postgres, pgvector-ready data model, Prisma 7
- LangGraph-ready agent contracts

## Local development

```bash
pnpm install
copy .env.example .env.local
pnpm db:generate
pnpm dev
```

Without credentials, the app runs in an explicitly labeled local preview mode. Connected environments use Clerk route protection and Clerk session tokens for Supabase RLS.

## Quality checks

```bash
pnpm check
```

See `docs/IMPLEMENTATION_ROADMAP.md` for milestone scope and module sequencing.
