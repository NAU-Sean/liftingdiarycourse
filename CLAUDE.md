@AGENTS.md

## Project Overview

"liftingdiarycourse" — a Next.js 16 application built with the App Router, React 19, TypeScript, and Tailwind CSS 4. Uses Clerk for authentication, Drizzle ORM with Neon (serverless Postgres) for data, and shadcn/ui for all UI components.

## 🚨 CRITICAL: Documentation-First Development

**BEFORE generating ANY code, ALWAYS refer to the relevant documentation files in the `/docs` directory.**

1. **First** — check `/docs` for a file covering the technology/library you're working with
2. **Read** — review it thoroughly before writing a single line
3. **Apply** — generate code that strictly follows those patterns
4. **Never** — rely on general training-data knowledge without consulting project docs first

Current docs:
- /docs/ui.md — shadcn/ui component rules and date formatting (date-fns)
- /docs/data-fetching.md — data fetching rules: server components only, /data helper functions, user data scoping

## Development Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint
```

## Architecture

### App Router Structure
- App Router (`src/app/`) — not Pages Router
- Path alias `@/*` → project root

### Styling
- Tailwind CSS 4 — uses `@import "tailwindcss"` syntax, NOT `@tailwind` directives
- PostCSS via `@tailwindcss/postcss` (no standalone tailwind.config)

### Database
- Drizzle ORM + Neon serverless Postgres
- Schema lives in `src/db/`
- Config: `drizzle.config.ts`

### Authentication (Clerk)
- Package: `@clerk/nextjs` v7
- Middleware: use `clerkMiddleware()` from `@clerk/nextjs/server` — NEVER deprecated `authMiddleware()`
- Server-side: `auth()` from `@clerk/nextjs/server` (async/await)
- Client components: `<ClerkProvider>`, `<SignedIn>`, `<SignedOut>`, `<UserButton>`, `<SignInButton>`
- Keys in `.env.local` only — never commit real keys

### TypeScript
- Strict mode enabled
- Target: ES2017, module resolution: bundler
