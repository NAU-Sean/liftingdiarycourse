import { format, parseISO } from "date-fns";
import Link from "next/link";
import { LogWorkoutForm } from "./LogWorkoutForm";

export default async function LogWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const date = dateParam ?? format(new Date(), "yyyy-MM-dd");
  const displayDate = format(parseISO(date), "do MMM yyyy");

  return (
    <main className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard?date=${date}`}
          className="inline-flex shrink-0 items-center justify-center rounded-lg px-2.5 h-7 text-[0.8rem] font-medium text-foreground hover:bg-muted whitespace-nowrap transition-all"
        >
          ← Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Log Workout</h1>
          <p className="text-muted-foreground text-sm">{displayDate}</p>
        </div>
      </div>

      <LogWorkoutForm date={date} />
    </main>
  );
}
