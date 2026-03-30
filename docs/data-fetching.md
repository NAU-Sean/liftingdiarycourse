# Data Fetching

## 🚨 RULE: Server Components Only

**ALL data fetching MUST be done exclusively in React Server Components.**

- **NEVER** fetch data in Client Components (`"use client"`)
- **NEVER** fetch data in Route Handlers (`src/app/api/`)
- **NEVER** use `useEffect` + `fetch` patterns
- **NEVER** use SWR, React Query, or any client-side fetching library

If you need data in a Client Component, fetch it in a Server Component parent and pass it down as props.

## 🚨 RULE: Helper Functions in `/data`

**ALL database queries MUST go through helper functions in the `/data` directory.**

- Helper functions use Drizzle ORM — **NEVER write raw SQL**
- No direct `db` queries outside of `/data`
- One file per domain (e.g., `data/workouts.ts`, `data/exercises.ts`)

### Structure

```
src/
  data/
    workouts.ts
    exercises.ts
    ...
```

### Helper Function Pattern

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getWorkoutsForCurrentUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

### Usage in a Server Component

```tsx
// src/app/dashboard/page.tsx
import { getWorkoutsForCurrentUser } from "@/data/workouts";

export default async function DashboardPage() {
  const workouts = await getWorkoutsForCurrentUser();
  return <WorkoutList workouts={workouts} />;
}
```

## 🚨 RULE: Users Can Only Access Their Own Data

Every helper function that returns user data **MUST**:

1. Call `auth()` from `@clerk/nextjs/server` to get the current `userId`
2. Throw (or redirect) immediately if `userId` is null
3. Filter all queries by `userId` — **never** return rows belonging to other users

**Wrong:**
```ts
// ❌ No user scoping — exposes all users' data
export async function getWorkout(id: number) {
  return db.select().from(workouts).where(eq(workouts.id, id));
}
```

**Correct:**
```ts
// ✅ Always scope to the authenticated user
export async function getWorkout(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [workout] = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)));

  return workout ?? null;
}
```

This applies to **every query** — single record lookups, lists, counts, aggregations — without exception.
