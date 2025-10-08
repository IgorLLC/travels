import { useMemo } from "react";
import { useTripStore } from "@/store/useTripStore";
import { MapPin } from "lucide-react";
import { formatDate } from "@/lib/format";

export function MapView() {
  const days = useTripStore((state) => state.days);
  const details = useTripStore((state) => state.details);

  const spots = useMemo(() => {
    return days.flatMap((day) =>
      day.activities
        .filter((activity) => activity.coords)
        .map((activity) => ({
          day: day.date,
          label: day.label,
          ...activity,
        }))
    );
  }, [days]);

  const mapSrc = spots.length
    ? spots
        .map((spot) => `markers=color:0x7c3aed|${spot.coords!.lat},${spot.coords!.lng}`)
        .join("&")
    : null;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-500">
          Panorama
        </h2>
        <p className="mt-2 text-lg font-semibold text-slate-900">
          Actividades en {details.trip.city}
        </p>
        <p className="text-sm text-slate-500">
          Visualiza tu itinerario sobre el mapa para planear tu ruta diaria.
        </p>
      </section>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <iframe
          className="h-96 w-full rounded-2xl border border-slate-200"
          src={
            mapSrc
              ? `https://maps.google.com/maps?q=New%20Orleans&output=embed&${mapSrc}`
              : `https://www.google.com/maps?q=New%20Orleans&z=12&output=embed`
          }
          title="Mapa principal"
          loading="lazy"
          allowFullScreen
        />
      </div>

      <div className="grid gap-3 rounded-3xl bg-white p-5 shadow-sm">
        {spots.map((spot) => (
          <article key={`${spot.title}-${spot.time}`} className="flex items-start gap-3">
            <div className="mt-1 h-9 w-9 rounded-full bg-violet-100 text-violet-600">
              <MapPin className="m-2 h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {formatDate(spot.day, "EEEE d MMM")} {spot.time && `· ${spot.time}`}
              </p>
              <p className="text-sm font-semibold text-slate-900">{spot.title}</p>
              {spot.address && <p className="text-xs text-slate-500">{spot.address}</p>}
            </div>
          </article>
        ))}
        {!spots.length && (
          <p className="text-sm text-slate-500">
            Añade coordenadas en tus actividades para visualizar los puntos clave del viaje.
          </p>
        )}
      </div>
    </div>
  );
}

