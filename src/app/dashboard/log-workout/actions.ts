"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";
import { redirect } from "next/navigation";
import { format } from "date-fns";

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
  const { name, date, exercises } = LogWorkoutSchema.parse(input);

  await createWorkout({ name, date, exercises });

  redirect(`/dashboard?date=${format(date, "yyyy-MM-dd")}`);
}
