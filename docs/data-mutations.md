# Data Mutations Coding Standards

## 🚨 RULE: Mutations Go Through `/data` Helper Functions

**ALL database mutations MUST go through helper functions in `src/data/`.**

- Use Drizzle ORM for all queries — **NEVER write raw SQL**
- No direct `db` calls outside of `src/data/`
- One file per domain (e.g., `data/workouts.ts`, `data/exercises.ts`)
- Mutation helpers must call `auth()` and verify `userId` before writing — never trust input to scope the user

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function createWorkout(input: CreateWorkoutInput): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.insert(workouts).values({ userId, ...input });
}
```

## 🚨 RULE: Server Actions Only — No Route Handlers

**ALL data mutations MUST be triggered via Next.js Server Actions.**

- **NEVER** use `src/app/api/` route handlers for mutations
- Server Actions must be in files named **`actions.ts`**, collocated with the page or feature that uses them:

```
src/app/
  dashboard/
    log-workout/
      actions.ts      ← server actions for this feature
      page.tsx
```

- Every `actions.ts` file must have `"use server"` at the top.

```ts
// src/app/dashboard/log-workout/actions.ts
"use server";

import { createWorkout } from "@/data/workouts";
```

## 🚨 RULE: Typed Params — No FormData

**Server action parameters MUST be explicitly typed. `FormData` is NEVER an acceptable parameter type.**

Parse and validate all form inputs in the Client Component before calling the action, then pass structured typed objects.

**Wrong:**
```ts
// ❌ FormData param — never do this
export async function logWorkoutAction(formData: FormData) {
  const name = formData.get("workoutName") as string;
  ...
}
```

**Correct:**
```ts
// ✅ Typed param
export async function logWorkoutAction(input: LogWorkoutInput): Promise<void> {
  ...
}
```

## 🚨 RULE: Validate All Inputs with Zod

**Every server action MUST validate its arguments with Zod before doing anything else.**

- Define a Zod schema for each action's input
- Parse with `.parse()` (throws on invalid) or `.safeParse()` (returns result object)
- Throw or return an error immediately if validation fails — never proceed with unvalidated data

```ts
// src/app/dashboard/log-workout/actions.ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const SetSchema = z.object({
  setNumber: z.number().int().positive(),
  reps: z.number().int().positive().optional(),
  weightLbs: z.number().positive().optional(),
  durationSeconds: z.number().positive().optional(),
});

const ExerciseSchema = z.object({
  name: z.string().min(1),
  order: z.number().int().nonnegative(),
  sets: z.array(SetSchema),
});

const LogWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
  exercises: z.array(ExerciseSchema).min(1),
});

type LogWorkoutInput = z.infer<typeof LogWorkoutSchema>;

export async function logWorkoutAction(input: LogWorkoutInput): Promise<void> {
  const parsed = LogWorkoutSchema.parse(input);

  await createWorkout(parsed);
}
```

## Summary of Rules

| Rule | Requirement |
|------|-------------|
| Database access | Drizzle ORM via `src/data/` helpers only |
| Mutation trigger | Server Actions only — no API route handlers |
| File naming | `actions.ts`, collocated with the feature |
| Parameter types | Explicit TypeScript types — never `FormData` |
| Input validation | Zod schema, validated at the top of every action |
| User scoping | `auth()` called inside the `/data` helper, never trusted from input |

## What NOT to Do

- **NEVER** write raw SQL — use Drizzle ORM
- **NEVER** call `db` directly outside of `src/data/`
- **NEVER** use `FormData` as a server action parameter
- **NEVER** skip Zod validation in a server action
- **NEVER** use route handlers (`src/app/api/`) for mutations
- **NEVER** trust a `userId` passed as a parameter — always derive it via `auth()`
