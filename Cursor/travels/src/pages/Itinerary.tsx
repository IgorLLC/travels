import { DayCard } from "@/components/DayCard";
import { MapMini } from "@/components/MapMini";
import { UberButton } from "@/components/UberButton";
import { useTripStore } from "@/store/useTripStore";
import { formatDate } from "@/lib/format";

export function Itinerary() {
  const days = useTripStore((state) => state.days);
  const details = useTripStore((state) => state.details);

  const hotelMap = details.hotel.coords;

  return (
    <div className="space-y-6 pb-20">
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-500">
          Hospedaje
        </h2>
        <p className="mt-2 text-lg font-semibold text-slate-900">{details.hotel.name}</p>
        <p className="text-sm text-slate-500">{details.hotel.location}</p>
        <p className="mt-1 text-xs text-slate-400">
          {formatDate(details.hotel.check_in)} · {formatDate(details.hotel.check_out)}
        </p>
        <p className="mt-2 text-xs text-slate-400">Fuente: {details.hotel.source}</p>
        {hotelMap && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <UberButton lat={hotelMap.lat} lng={hotelMap.lng} label={details.hotel.name} />
              <a
                className="text-sm font-semibold text-violet-600 underline"
                href={`https://www.google.com/maps/search/?api=1&query=${hotelMap.lat},${hotelMap.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                Ver en Google Maps
              </a>
            </div>
            <MapMini lat={hotelMap.lat} lng={hotelMap.lng} title={details.hotel.name} />
          </div>
        )}
      </section>

      <div className="space-y-6">
        {days.map((day) => (
          <DayCard key={day.date} {...day} />
        ))}
      </div>
    </div>
  );
}

