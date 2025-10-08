import type { Activity } from "@/store/useTripStore";
import { ActivityItem } from "./ActivityItem";
import { CalendarDays } from "lucide-react";

type DayCardProps = {
  date: string;
  label: string;
  activities: Activity[];
};

export function DayCard({ date, label, activities }: DayCardProps) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
            <CalendarDays className="h-5 w-5 text-violet-600" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">{date}</p>
            <h2 className="text-lg font-semibold text-slate-900">{label}</h2>
          </div>
        </div>
        <span className="text-xs font-medium uppercase text-slate-400">
          {activities.length} plan{activities.length === 1 ? "" : "es"}
        </span>
      </header>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <ActivityItem key={`${activity.title}-${index}`} activity={activity} day={date} index={index} />
        ))}
      </div>
    </section>
  );
}

