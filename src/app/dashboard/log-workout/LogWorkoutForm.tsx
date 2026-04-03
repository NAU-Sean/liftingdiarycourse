"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { logWorkoutAction } from "./actions";
import { WORKOUT_BUNDLES, ALL_EXERCISES } from "@/lib/workoutBundles";

type SetData = {
  setNumber: number;
  reps?: number;
  weightLbs?: number;
  durationSeconds?: number;
};

type ExerciseData = {
  name: string;
  order: number;
  sets: SetData[];
};

export function LogWorkoutForm({ date }: { date: string }) {
  const [workoutName, setWorkoutName] = useState("");
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [exerciseList, setExerciseList] = useState<ExerciseData[]>([]);

  function applyBundle(bundleName: string) {
    const bundle = WORKOUT_BUNDLES.find((b) => b.name === bundleName);
    if (!bundle) return;
    setSelectedBundle(bundleName);
    setWorkoutName(bundle.name);
    setExerciseList(
      bundle.exercises.map((name, i) => ({
        name,
        order: i,
        sets: [{ setNumber: 1 }],
      }))
    );
  }

  function applyCustom() {
    setSelectedBundle("Custom");
    setWorkoutName("Custom Workout");
    setExerciseList([]);
  }

  function addCustomExercise(name: string | null) {
    if (!name || exerciseList.some((e) => e.name === name)) return;
    setExerciseList((prev) => [
      ...prev,
      { name, order: prev.length, sets: [{ setNumber: 1 }] },
    ]);
  }

  function removeExercise(index: number) {
    setExerciseList((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((e, i) => ({ ...e, order: i }))
    );
  }

  function addSet(exIndex: number) {
    setExerciseList((prev) =>
      prev.map((ex, i) =>
        i === exIndex
          ? { ...ex, sets: [...ex.sets, { setNumber: ex.sets.length + 1 }] }
          : ex
      )
    );
  }

  function removeSet(exIndex: number, setIndex: number) {
    setExerciseList((prev) =>
      prev.map((ex, i) =>
        i === exIndex
          ? {
              ...ex,
              sets: ex.sets
                .filter((_, si) => si !== setIndex)
                .map((s, si) => ({ ...s, setNumber: si + 1 })),
            }
          : ex
      )
    );
  }

  function updateSet(
    exIndex: number,
    setIndex: number,
    field: keyof Omit<SetData, "setNumber">,
    value: string
  ) {
    setExerciseList((prev) =>
      prev.map((ex, i) =>
        i === exIndex
          ? {
              ...ex,
              sets: ex.sets.map((s, si) =>
                si === setIndex
                  ? { ...s, [field]: value === "" ? undefined : Number(value) }
                  : s
              ),
            }
          : ex
      )
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await logWorkoutAction({
      name: workoutName,
      date: date,
      exercises: exerciseList,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Bundle picker */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Choose a template
        </Label>
        <div className="flex flex-wrap gap-2">
          {WORKOUT_BUNDLES.map((bundle) => (
            <Button
              key={bundle.name}
              type="button"
              variant={selectedBundle === bundle.name ? "default" : "outline"}
              size="sm"
              onClick={() => applyBundle(bundle.name)}
            >
              {bundle.name}
            </Button>
          ))}
          <Button
            type="button"
            variant={selectedBundle === "Custom" ? "default" : "outline"}
            size="sm"
            onClick={applyCustom}
          >
            Custom
          </Button>
        </div>
      </div>

      <Separator />

      {/* Workout name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="workoutName">Workout name</Label>
        <Input
          id="workoutName"
          name="workoutName"
          placeholder="e.g. Leg Day"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          required
        />
      </div>

      {/* Custom exercise picker */}
      {selectedBundle === "Custom" && (
        <div className="flex flex-col gap-1.5">
          <Label>Add exercise</Label>
          <Select onValueChange={addCustomExercise}>
            <SelectTrigger>
              <SelectValue placeholder="Select an exercise…" />
            </SelectTrigger>
            <SelectContent>
              {ALL_EXERCISES.filter(
                (ex) => !exerciseList.some((e) => e.name === ex)
              ).map((ex) => (
                <SelectItem key={ex} value={ex}>
                  {ex}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Exercise list */}
      {exerciseList.length > 0 && (
        <div className="flex flex-col gap-3">
          <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Exercises
          </Label>
          {exerciseList.map((ex, exIndex) => (
            <Card key={ex.name} size="sm">
              <CardHeader className="pb-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{ex.name}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeExercise(exIndex)}
                    className="text-destructive hover:text-destructive"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {/* Set headers */}
                <div className="grid grid-cols-[2rem_1fr_1fr_1fr_2rem] gap-1.5 text-xs text-muted-foreground px-0.5">
                  <span className="text-center">#</span>
                  <span>Reps</span>
                  <span>Weight (lbs)</span>
                  <span>Duration (s)</span>
                  <span />
                </div>
                {ex.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className="grid grid-cols-[2rem_1fr_1fr_1fr_2rem] gap-1.5 items-center"
                  >
                    <span className="text-center text-xs text-muted-foreground">
                      {set.setNumber}
                    </span>
                    <Input
                      type="number"
                      min={0}
                      placeholder="—"
                      value={set.reps ?? ""}
                      onChange={(e) =>
                        updateSet(exIndex, setIndex, "reps", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      min={0}
                      step={0.5}
                      placeholder="—"
                      value={set.weightLbs ?? ""}
                      onChange={(e) =>
                        updateSet(exIndex, setIndex, "weightLbs", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      min={0}
                      placeholder="—"
                      value={set.durationSeconds ?? ""}
                      onChange={(e) =>
                        updateSet(
                          exIndex,
                          setIndex,
                          "durationSeconds",
                          e.target.value
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeSet(exIndex, setIndex)}
                      className="text-muted-foreground"
                      disabled={ex.sets.length === 1}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addSet(exIndex)}
                  className="self-start mt-1"
                >
                  + Add set
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button
        type="submit"
        disabled={!workoutName || exerciseList.length === 0}
        className="w-full"
      >
        Save Workout
      </Button>
    </form>
  );
}
