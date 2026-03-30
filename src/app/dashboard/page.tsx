export const dynamic = "force-dynamic";

import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardCalendar } from "./DashboardCalendar";
import { getWorkoutsForDate } from "@/data/workouts";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const date = dateParam ? parseISO(dateParam) : new Date();
  const dateStr = format(date, "yyyy-MM-dd");
  const workoutList = await getWorkoutsForDate(date);

  return (
    <main className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">View your workouts by date</p>
        </div>
        <Link
          href={`/dashboard/log-workout?date=${dateStr}`}
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-2.5 h-8 text-sm font-medium text-primary-foreground whitespace-nowrap transition-all"
        >
          + Log Workout
        </Link>
      </div>

      <DashboardCalendar selected={date} />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Workouts — {format(date, "do MMM yyyy")}
        </h2>

        {workoutList.length === 0 ? (
          <p className="text-muted-foreground text-sm">No workouts logged for this date.</p>
        ) : (
          workoutList.map((workout) => (
            <Card key={workout.id} size="sm">
              <CardHeader>
                <CardTitle>{workout.name}</CardTitle>
                <CardAction>
                  <span className="text-xs text-muted-foreground">
                    {format(workout.createdAt, "h:mm a")}
                  </span>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {workout.exercises.map((exercise) => (
                    <Badge key={exercise} variant="secondary">
                      {exercise}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
