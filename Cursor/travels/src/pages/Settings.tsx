import { useState } from "react";
import { useTripStore } from "@/store/useTripStore";
import { formatDate } from "@/lib/format";

export function Settings() {
  const details = useTripStore((state) => state.details);
  const days = useTripStore((state) => state.days);
  const resetDays = useTripStore((state) => state.resetDays);
  const [timezone, setTimezone] = useState(details.trip.timezone);

  const resetItinerary = () => {
    resetDays();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-500">
          Información del viaje
        </h2>
        <dl className="mt-4 space-y-3 text-sm text-slate-600">
          <div className="flex justify-between">
            <dt className="font-medium text-slate-500">Ciudad</dt>
            <dd className="text-slate-900">{details.trip.city}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-slate-500">Fechas</dt>
            <dd className="text-slate-900">
              {formatDate(details.trip.dates.start)} — {formatDate(details.trip.dates.end)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="font-medium text-slate-500">Zona horaria</dt>
            <dd>
              <input
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-1 text-sm"
              />
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-500">
          Datos y sincronización
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Tu itinerario se guarda automáticamente en este dispositivo con localStorage.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={resetItinerary}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
          >
            Restaurar desde plantilla
          </button>
          <span className="text-xs text-slate-400">
            {days.length} días, {days.reduce((total, day) => total + day.activities.length, 0)} actividades
          </span>
        </div>
      </section>
    </div>
  );
}

