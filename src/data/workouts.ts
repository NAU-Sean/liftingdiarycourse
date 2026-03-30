import { db } from "@/db";
import { workouts, workoutExercises, exercises, sets } from "@/db/schema";
import { eq, and, gte, lt, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getWorkoutsForDate(date: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      workoutCreatedAt: workouts.createdAt,
      exerciseName: exercises.name,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.createdAt, start),
        lt(workouts.createdAt, end)
      )
    )
    .orderBy(workouts.createdAt, workoutExercises.order);

  // Group rows into workouts with their exercise names
  const map = new Map<string, { id: string; name: string; createdAt: Date; exercises: string[] }>();
  for (const row of rows) {
    if (!map.has(row.workoutId)) {
      map.set(row.workoutId, {
        id: row.workoutId,
        name: row.workoutName,
        createdAt: row.workoutCreatedAt,
        exercises: [],
      });
    }
    if (row.exerciseName) {
      map.get(row.workoutId)!.exercises.push(row.exerciseName);
    }
  }

  return Array.from(map.values());
}

export async function createWorkout(input: {
  name: string;
  date: Date;
  exercises: Array<{
    name: string;
    order: number;
    sets: Array<{
      setNumber: number;
      reps?: number;
      weightLbs?: number;
      durationSeconds?: number;
    }>;
  }>;
}): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const createdAt = new Date(input.date);
  createdAt.setHours(12, 0, 0, 0);

  const [workout] = await db
    .insert(workouts)
    .values({ userId, name: input.name, createdAt })
    .returning({ id: workouts.id });

  for (const ex of input.exercises) {
    // Upsert exercise by name
    await db
      .insert(exercises)
      .values({ name: ex.name })
      .onConflictDoNothing();

    const [exercise] = await db
      .select({ id: exercises.id })
      .from(exercises)
      .where(eq(exercises.name, ex.name));

    const [workoutEx] = await db
      .insert(workoutExercises)
      .values({ workoutId: workout.id, exerciseId: exercise.id, order: ex.order })
      .returning({ id: workoutExercises.id });

    if (ex.sets.length > 0) {
      await db.insert(sets).values(
        ex.sets.map((s) => ({
          workoutExerciseId: workoutEx.id,
          setNumber: s.setNumber,
          reps: s.reps ?? null,
          weightLbs: s.weightLbs ?? null,
          durationSeconds: s.durationSeconds ?? null,
        }))
      );
    }
  }
}
