import { useMemo, useState } from "react";
import { useTripStore } from "@/store/useTripStore";
import { MapPin, Navigation, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/lib/format";

type LocationSpot = {
  name: string;
  address?: string;
  coords: { lat: number; lng: number };
  date?: string;
  time?: string;
  type?: string;
};

function LocationItem({ spot }: { spot: LocationSpot }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNavigate = () => {
    const url = `https://maps.google.com/?q=${spot.coords.lat},${spot.coords.lng}`;
    window.open(url, "_blank");
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-violet-300 hover:shadow-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-start gap-3 text-left"
      >
        <div className="mt-0.5 h-10 w-10 flex-shrink-0 rounded-full bg-violet-100 text-violet-600">
          <MapPin className="m-2.5 h-5 w-5" />
        </div>
        <div className="flex-1">
          {spot.date && (
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {formatDate(spot.date, "EEEE d MMM")} {spot.time && `· ${spot.time}`}
            </p>
          )}
          <p className="text-base font-semibold text-slate-900">{spot.name}</p>
          {spot.type && (
            <span className="mt-1 inline-block rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-600">
              {spot.type}
            </span>
          )}
        </div>
        <div className="flex-shrink-0 text-slate-400">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
          {spot.address && (
            <div className="ml-13">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Dirección
              </p>
              <p className="mt-1 text-sm text-slate-700">{spot.address}</p>
            </div>
          )}
          <div className="ml-13">
            <button
              onClick={handleNavigate}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
            >
              <Navigation className="h-4 w-4" />
              Cómo llegar
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export function MapView() {
  const days = useTripStore((state) => state.days);
  const details = useTripStore((state) => state.details);

  // Recopilar todos los lugares con coordenadas
  const allSpots = useMemo(() => {
    const spots: LocationSpot[] = [];

    // Agregar hotel
    if (details.hotel?.coords) {
      spots.push({
        name: details.hotel.name,
        address: details.hotel.location,
        coords: details.hotel.coords,
        type: "Hotel",
      });
    }

    // Agregar reservaciones
    details.reservations?.forEach((reservation) => {
      if (reservation.coords) {
        spots.push({
          name: reservation.restaurant,
          address: reservation.address,
          coords: reservation.coords,
          date: reservation.date,
          time: reservation.time,
          type: reservation.type,
        });
      }
    });

    // Agregar lugares de interés
    details.places?.forEach((place: any) => {
      if (place.coords) {
        spots.push({
          name: place.name,
          address: place.address,
          coords: place.coords,
          type: "Atracción",
        });
      }
    });

    // Agregar actividades del itinerario con coordenadas
    days.forEach((day) => {
      day.activities
        .filter((activity) => activity.coords)
        .forEach((activity) => {
          spots.push({
            name: activity.title,
            address: activity.address,
            coords: activity.coords!,
            date: day.date,
            time: activity.time,
            type: activity.category,
          });
        });
    });

    return spots;
  }, [days, details]);

  // Agrupar por fecha
  const spotsByDate = useMemo(() => {
    const grouped: { [key: string]: LocationSpot[] } = {
      general: [],
    };

    allSpots.forEach((spot) => {
      if (spot.date) {
        if (!grouped[spot.date]) {
          grouped[spot.date] = [];
        }
        grouped[spot.date].push(spot);
      } else {
        grouped.general.push(spot);
      }
    });

    return grouped;
  }, [allSpots]);

  // Generar URL del mapa con todos los marcadores
  const mapSrc = useMemo(() => {
    if (allSpots.length === 0) {
      return `https://www.google.com/maps?q=New%20Orleans&z=12&output=embed`;
    }

    const markers = allSpots
      .map((spot) => `markers=color:0x7c3aed|${spot.coords.lat},${spot.coords.lng}`)
      .join("&");

    return `https://maps.google.com/maps?q=New%20Orleans&output=embed&${markers}`;
  }, [allSpots]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-500">
          Panorama
        </h2>
        <p className="mt-2 text-lg font-semibold text-slate-900">
          Lugares en {details.trip.city}
        </p>
        <p className="text-sm text-slate-500">
          Todos tus destinos marcados en el mapa. Haz clic en cualquier lugar para ver detalles y
          obtener indicaciones.
        </p>
      </section>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <iframe
          className="h-96 w-full rounded-2xl border border-slate-200"
          src={mapSrc}
          title="Mapa principal"
          loading="lazy"
          allowFullScreen
        />
      </div>

      {/* Lugares generales (sin fecha específica) */}
      {spotsByDate.general && spotsByDate.general.length > 0 && (
        <section className="space-y-3 rounded-3xl bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Lugares clave
          </h3>
          <div className="grid gap-3">
            {spotsByDate.general.map((spot, idx) => (
              <LocationItem key={`general-${idx}`} spot={spot} />
            ))}
          </div>
        </section>
      )}

      {/* Lugares por día */}
      {Object.entries(spotsByDate)
        .filter(([date]) => date !== "general")
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, spots]) => (
          <section key={date} className="space-y-3 rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              {formatDate(date, "EEEE d MMMM")}
            </h3>
            <div className="grid gap-3">
              {spots.map((spot, idx) => (
                <LocationItem key={`${date}-${idx}`} spot={spot} />
              ))}
            </div>
          </section>
        ))}

      {allSpots.length === 0 && (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <MapPin className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            No hay lugares con coordenadas. Añade coordenadas en tus actividades para visualizar
            los puntos clave del viaje.
          </p>
        </div>
      )}
    </div>
  );
}

