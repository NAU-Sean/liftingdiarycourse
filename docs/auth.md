# Authentication Coding Standards

## Package

This app uses **Clerk** (`@clerk/nextjs` v7) for all authentication. Do not use any other auth library or roll custom auth.

## Middleware

Clerk middleware must be configured in `src/middleware.ts` at the project root using `clerkMiddleware()`:

```ts
// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

- **NEVER** use the deprecated `authMiddleware()` — it has been removed in v7.

## Server-Side Auth

Use `auth()` from `@clerk/nextjs/server` in Server Components, Server Actions, and `/data` helper functions:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");
```

- `auth()` is **async** — always `await` it.
- Always check for a null `userId` and throw or redirect immediately if missing.
- Never pass `userId` in from the client — always derive it server-side via `auth()`.

## Client-Side Auth

Use Clerk's React components in Client Components only. Never use these in Server Components.

```tsx
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/nextjs";
```

- Wrap the app in `<ClerkProvider>` in the root layout (`src/app/layout.tsx`).
- Use `<SignedIn>` / `<SignedOut>` to conditionally render UI based on auth state.
- Use `<UserButton>` for the user avatar/menu.
- Use `<SignInButton>` to trigger sign-in.

## Environment Variables

Clerk keys live in `.env.local` only — **never commit real keys**.

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is safe to expose to the browser.
- `CLERK_SECRET_KEY` is server-only — never reference it in client code.

## Protecting Routes

To protect a route server-side, call `auth()` and redirect if unauthenticated:

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const { userId } = await auth();
if (!userId) redirect("/sign-in");
```

For broad route protection (e.g., all `/dashboard` routes), configure `clerkMiddleware` with route matchers instead of repeating the check in every page.

## What NOT to Do

- **NEVER** use `authMiddleware()` — deprecated and removed in v7
- **NEVER** fetch the current user from the client and pass it to a Server Action
- **NEVER** store Clerk keys in `.env` or any committed file
- **NEVER** skip the `userId` null-check after calling `auth()`
- **NEVER** use `getAuth()` from older Clerk versions — use `auth()` from `@clerk/nextjs/server`
