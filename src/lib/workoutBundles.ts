export const WORKOUT_BUNDLES = [
  {
    name: "Leg Day",
    exercises: ["Squat", "Lunges", "Leg Press", "Split Squats", "Calf Raises"],
  },
  {
    name: "Push Day",
    exercises: ["Bench Press", "Overhead Press", "Tricep Pushdown", "Lateral Raise"],
  },
  {
    name: "Pull Day",
    exercises: ["Deadlift", "Pull-Ups", "Bent Over Row", "Bicep Curl", "Face Pull"],
  },
  {
    name: "Full Body",
    exercises: ["Squat", "Bench Press", "Deadlift", "Overhead Press", "Pull-Ups"],
  },
] as const;

export const ALL_EXERCISES = [
  ...new Set(WORKOUT_BUNDLES.flatMap((b) => b.exercises)),
].sort();
