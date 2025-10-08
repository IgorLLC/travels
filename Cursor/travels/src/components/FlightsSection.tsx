import { formatAirportLeg, formatDate } from "@/lib/format";
import type { TripData } from "@/store/useTripStore";
import { Plane } from "lucide-react";

type FlightsSectionProps = {
  flights: TripData["flights"];
};

const LegList = ({ legs, title }: { legs: TripData["flights"]["outbound"]; title: string }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
    <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
    <ul className="mt-3 space-y-2 text-sm text-slate-600">
      {legs.map((leg) => (
        <li key={`${leg.flight_number}-${leg.depart_local}`} className="flex flex-col">
          <span className="font-semibold text-slate-800">
            {formatAirportLeg(leg)}
          </span>
          <span className="text-xs text-slate-400">
            Vuelo {leg.flight_number} · {formatDate(leg.date, "PPPP")}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export function FlightsSection({ flights }: FlightsSectionProps) {
  if (!flights) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-slate-900 p-3 text-white">
          <Plane className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Vuelos</h2>
          <p className="text-xs text-slate-500">
            Código de confirmación {flights.confirmation_code} · {flights.source}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <LegList legs={flights.outbound} title="Salida" />
        <LegList legs={flights.return} title="Regreso" />
      </div>
    </section>
  );
}

