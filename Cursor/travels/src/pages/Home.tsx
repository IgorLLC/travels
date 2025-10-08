import { useMemo, useState } from "react";
import { useTripStore } from "@/store/useTripStore";
import { CategoryChips } from "@/components/CategoryChips";
import { DayCard } from "@/components/DayCard";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { EditorSheet } from "@/components/EditorSheet";
import { Plus } from "lucide-react";
import { TripsHero } from "@/components/TripsHero";
import { formatDate } from "@/lib/format";
import { FlightsSection } from "@/components/FlightsSection";
import { ReservationsSection } from "@/components/ReservationsSection";
import { TicketsSection } from "@/components/TicketsSection";
import { NotesSection } from "@/components/NotesSection";

export function Home() {
  const days = useTripStore((state) => state.days);
  const details = useTripStore((state) => state.details);
  const [filter, setFilter] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          days.flatMap((day) => day.activities.map((activity) => activity.category))
        )
      ),
    [days]
  );

  const filteredDays = useMemo(() => {
    if (!filter) return days;
    return days
      .map((day) => ({
        ...day,
        activities: day.activities.filter((activity) => activity.category === filter),
      }))
      .filter((day) => day.activities.length > 0);
  }, [filter, days]);

  if (!days.length) {
    return (
      <EmptyPlaceholder
        title="Aún no hay actividades"
        description="Agrega tu primer plan para ver tu itinerario aquí."
      />
    );
  }

  return (
    <div className="space-y-6">
      <TripsHero
        city={details.trip.city}
        dateRange={`${formatDate(details.trip.dates.start)} → ${formatDate(details.trip.dates.end)}`}
        travelers={details.trip.travelers}
      />
      <FlightsSection flights={details.flights} />
      <ReservationsSection reservations={details.reservations} />
      <TicketsSection tickets={details.tickets} />
      <CategoryChips categories={categories} active={filter ?? undefined} onSelect={setFilter} />
      <div className="space-y-4">
        {filteredDays.map((day) => (
          <div key={day.date} className="space-y-3">
            <DayCard {...day} />
            <button
              onClick={() => setActiveDay(day.date)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-violet-300 bg-white py-2 text-sm font-semibold text-violet-600"
            >
              <Plus className="h-4 w-4" /> Añadir actividad
            </button>
            {activeDay === day.date && (
              <div className="rounded-2xl bg-white p-4 shadow">
                <EditorSheet date={day.date} onClose={() => setActiveDay(null)} />
              </div>
            )}
          </div>
        ))}
      </div>
      <NotesSection notes={details.notes} />
    </div>
  );
}

