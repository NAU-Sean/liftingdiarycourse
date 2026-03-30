"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export function DashboardCalendar({ selected }: { selected: Date }) {
  const router = useRouter();

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={(date) => {
        if (date) {
          router.push(`/dashboard?date=${format(date, "yyyy-MM-dd")}`);
        }
      }}
      className="rounded-xl border border-border"
    />
  );
}
