import { useMemo, useState } from "react";
import { useTripStore } from "@/store/useTripStore";
import { MapPin, Navigation, ChevronDown, ChevronUp, Filter } from "lucide-react";

type PlaceOfInterest = {
  name: string;
  type: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  notes: string;
};

function PlaceCard({ place }: { place: PlaceOfInterest }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNavigate = () => {
    if (place.latitude && place.longitude) {
      const url = `https://maps.google.com/?q=${place.latitude},${place.longitude}`;
      window.open(url, "_blank");
    }
  };

  const typeColors: Record<string, string> = {
    Restaurant: "bg-rose-100 text-rose-700",
    Brunch: "bg-amber-100 text-amber-700",
    Bar: "bg-purple-100 text-purple-700",
    Museum: "bg-blue-100 text-blue-700",
    Attraction: "bg-emerald-100 text-emerald-700",
    Shopping: "bg-pink-100 text-pink-700",
    Cultural: "bg-indigo-100 text-indigo-700",
    Landmark: "bg-cyan-100 text-cyan-700",
  };

  const getTypeColor = (type: string) => {
    for (const [key, color] of Object.entries(typeColors)) {
      if (type.includes(key)) return color;
    }
    return "bg-slate-100 text-slate-700";
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-violet-300 hover:shadow-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-start gap-4 text-left"
      >
        <div className="mt-0.5 h-12 w-12 flex-shrink-0 rounded-full bg-violet-100 text-violet-600">
          <MapPin className="m-3 h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900">{place.name}</h3>
          <div className="mt-1 flex flex-wrap gap-2">
            {place.type.split(" / ").map((t, idx) => (
              <span
                key={idx}
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTypeColor(t)}`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 text-slate-400">
          {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
          <div className="ml-16">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Dirección
            </p>
            <p className="mt-1 text-sm text-slate-700">{place.address}</p>
          </div>

          {place.notes && (
            <div className="ml-16">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notas</p>
              <p className="mt-1 text-sm text-slate-700">{place.notes}</p>
            </div>
          )}

          {place.latitude && place.longitude && (
            <div className="ml-16">
              <button
                onClick={handleNavigate}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
              >
                <Navigation className="h-4 w-4" />
                Cómo llegar
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export function PlacesOfInterest() {
  const details = useTripStore((state) => state.details);
  const [selectedType, setSelectedType] = useState<string>("Todos");

  // Obtener lugares de interés
  const places: PlaceOfInterest[] = useMemo(() => {
    return (details as any).places_of_interest || [];
  }, [details]);

  // Extraer todos los tipos únicos
  const allTypes = useMemo(() => {
    const typesSet = new Set<string>();
    places.forEach((place) => {
      place.type.split(" / ").forEach((t) => typesSet.add(t.trim()));
    });
    return ["Todos", ...Array.from(typesSet).sort()];
  }, [places]);

  // Filtrar lugares por tipo
  const filteredPlaces = useMemo(() => {
    if (selectedType === "Todos") return places;
    return places.filter((place) => place.type.includes(selectedType));
  }, [places, selectedType]);

  // Agrupar por tipo principal
  const placesByType = useMemo(() => {
    const grouped: Record<string, PlaceOfInterest[]> = {};
    filteredPlaces.forEach((place) => {
      const mainType = place.type.split(" / ")[0];
      if (!grouped[mainType]) {
        grouped[mainType] = [];
      }
      grouped[mainType].push(place);
    });
    return grouped;
  }, [filteredPlaces]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-500">
          Explorar
        </h2>
        <p className="mt-2 text-lg font-semibold text-slate-900">
          Lugares de Interés en {details.trip.city}
        </p>
        <p className="text-sm text-slate-500">
          Descubre restaurantes, atracciones y puntos clave para tu viaje.
        </p>
      </section>

      {/* Filtros */}
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter className="h-4 w-4" />
          <span>Filtrar por tipo:</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {allTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedType === type
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {filteredPlaces.length} {filteredPlaces.length === 1 ? "lugar" : "lugares"}{" "}
          {selectedType !== "Todos" && `en la categoría "${selectedType}"`}
        </p>
      </section>

      {/* Lista de lugares agrupados por tipo */}
      {Object.entries(placesByType)
        .sort(([typeA], [typeB]) => typeA.localeCompare(typeB))
        .map(([type, placesInType]) => (
          <section key={type} className="space-y-4 rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold uppercase tracking-wide text-slate-700">
              {type}
              <span className="ml-2 text-xs font-normal text-slate-500">
                ({placesInType.length})
              </span>
            </h3>
            <div className="grid gap-3">
              {placesInType.map((place, idx) => (
                <PlaceCard key={`${place.name}-${idx}`} place={place} />
              ))}
            </div>
          </section>
        ))}

      {filteredPlaces.length === 0 && (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <MapPin className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            No hay lugares en esta categoría. Prueba con otro filtro.
          </p>
        </div>
      )}
    </div>
  );
}

