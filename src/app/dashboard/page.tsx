"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockWorkouts = [
  {
    id: 1,
    name: "Morning Push",
    exercises: ["Bench Press", "Overhead Press", "Tricep Dips"],
    duration: "45 min",
  },
  {
    id: 2,
    name: "Evening Cardio",
    exercises: ["Treadmill", "Jump Rope"],
    duration: "30 min",
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <main className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">View your workouts by date</p>
      </div>

      {/* Date Picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className={buttonVariants({ variant: "outline", className: "w-full justify-start gap-2" })}>
          <CalendarIcon className="h-4 w-4" />
          {format(date, "do MMM yyyy")}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selected) => {
              if (selected) {
                setDate(selected);
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Workout List */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Workouts — {format(date, "do MMM yyyy")}
        </h2>

        {mockWorkouts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No workouts logged for this date.</p>
        ) : (
          mockWorkouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                  <Badge variant="secondary">{workout.duration}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {workout.exercises.map((exercise) => (
                    <Badge key={exercise} variant="outline">
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
