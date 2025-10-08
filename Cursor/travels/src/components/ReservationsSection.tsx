import { formatDate, formatTime } from "@/lib/format";
import type { TripData } from "@/store/useTripStore";
import { UtensilsCrossed } from "lucide-react";

type ReservationsSectionProps = {
  reservations: TripData["reservations"];
};

export function ReservationsSection({ reservations }: ReservationsSectionProps) {
  if (!reservations?.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-rose-500 p-3 text-white">
          <UtensilsCrossed className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Reservas</h2>
          <p className="text-xs text-slate-500">Confirmadas vía OpenTable</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {reservations.map((reservation) => (
          <article
            key={`${reservation.date}-${reservation.restaurant}`}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {formatDate(reservation.date, "EEEE d MMM")}
                </p>
                <h3 className="text-base font-semibold text-slate-900">
                  {reservation.restaurant}
                </h3>
                <p className="text-xs text-slate-500">
                  {reservation.type} · {formatTime(reservation.time)}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                {reservation.party_size} personas
              </span>
            </header>
            <div className="mt-3 space-y-1 text-xs text-slate-500">
              <p>{reservation.address}</p>
              <p>Confirmación: {reservation.confirmation_number}</p>
              <p>Fuente: {reservation.source}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

