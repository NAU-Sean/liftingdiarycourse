"use server";

import { createWorkout } from "@/data/workouts";
import { redirect } from "next/navigation";
import { format, parseISO } from "date-fns";

export async function logWorkoutAction(formData: FormData): Promise<void> {
  const name = formData.get("workoutName") as string;
  const dateStr = formData.get("date") as string;
  const exercisesJson = formData.get("exercises") as string;

  if (!name || !dateStr || !exercisesJson) {
    throw new Error("Missing required fields");
  }

  const date = parseISO(dateStr);
  const exercises = JSON.parse(exercisesJson) as Array<{
    name: string;
    order: number;
    sets: Array<{
      setNumber: number;
      reps?: number;
      weightLbs?: number;
      durationSeconds?: number;
    }>;
  }>;

  await createWorkout({ name, date, exercises });

  redirect(`/dashboard?date=${format(date, "yyyy-MM-dd")}`);
}
