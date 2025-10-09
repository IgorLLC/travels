import { useMemo, useState } from "react";
import { useTripStore } from "@/store/useTripStore";
import {
  MapPin,
  Navigation,
  Phone,
  Globe,
  Calendar,
  Instagram as InstagramIcon,
  Filter,
} from "lucide-react";

type PlaceOfInterest = {
  name: string;
  category: string;
  address: string;
  phone: string | null;
  website: string | null;
  reservation_link: string | null;
  instagram: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
};

function PlaceCard({ place }: { place: PlaceOfInterest }) {
  const [imageError, setImageError] = useState(false);
  
  const handleNavigate = () => {
    if (place.latitude && place.longitude) {
      const url = `https://maps.google.com/?q=${place.latitude},${place.longitude}`;
      window.open(url, "_blank");
    }
  };

  const categoryColors: Record<string, string> = {
    restaurant: "bg-rose-100 text-rose-700 border-rose-200",
    bar: "bg-purple-100 text-purple-700 border-purple-200",
    museum: "bg-blue-100 text-blue-700 border-blue-200",
    attraction: "bg-emerald-100 text-emerald-700 border-emerald-200",
    tour: "bg-amber-100 text-amber-700 border-amber-200",
    shop: "bg-pink-100 text-pink-700 border-pink-200",
    market: "bg-cyan-100 text-cyan-700 border-cyan-200",
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "restaurant":
        return "🍽️";
      case "bar":
        return "🍺";
      case "museum":
        return "🏛️";
      case "attraction":
        return "🎢";
      case "tour":
        return "🎭";
      case "shop":
        return "🛍️";
      case "market":
        return "🏪";
      default:
        return "📍";
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl">
      {/* Imagen del lugar */}
      {place.image_url && (
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-violet-100 to-purple-100">
          {!imageError ? (
            <>
              <img
                src={place.image_url}
                alt={place.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={() => setImageError(true)}
                crossOrigin="anonymous"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <div className="text-6xl">{getCategoryIcon(place.category)}</div>
                <p className="mt-2 text-sm font-medium text-slate-600">{place.category}</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm ${getCategoryColor(place.category)}`}
            >
              {place.category}
            </span>
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Título */}
        <h3 className="text-xl font-bold text-slate-900">{place.name}</h3>

        {/* Dirección */}
        <div className="mt-2 flex items-start gap-2 text-sm text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-500" />
          <p>{place.address}</p>
        </div>

        {/* Acciones rápidas */}
        <div className="mt-4 flex flex-wrap gap-2">
          {place.phone && (
            <a
              href={`tel:${place.phone}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
            >
              <Phone className="h-4 w-4" />
              Llamar
            </a>
          )}

          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
            >
              <Globe className="h-4 w-4" />
              Web
            </a>
          )}

          {place.reservation_link && (
            <a
              href={place.reservation_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
            >
              <Calendar className="h-4 w-4" />
              Reservar
            </a>
          )}

          {place.instagram && (
            <a
              href={place.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700"
            >
              <InstagramIcon className="h-4 w-4" />
              Instagram
            </a>
          )}

          {place.latitude && place.longitude && (
            <button
              onClick={handleNavigate}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              <Navigation className="h-4 w-4" />
              Navegar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function PlacesOfInterest() {
  const details = useTripStore((state) => state.details);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  // Obtener lugares de interés
  const places: PlaceOfInterest[] = useMemo(() => {
    return (details as any).places_of_interest || [];
  }, [details]);

  // Extraer todas las categorías únicas
  const allCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    places.forEach((place) => {
      categoriesSet.add(place.category);
    });
    return ["Todos", ...Array.from(categoriesSet).sort()];
  }, [places]);

  // Filtrar lugares por categoría
  const filteredPlaces = useMemo(() => {
    if (selectedCategory === "Todos") return places;
    return places.filter((place) => place.category === selectedCategory);
  }, [places, selectedCategory]);

  // Agrupar por categoría
  const placesByCategory = useMemo(() => {
    const grouped: Record<string, PlaceOfInterest[]> = {};
    filteredPlaces.forEach((place) => {
      const cat = place.category;
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(place);
    });
    return grouped;
  }, [filteredPlaces]);

  const categoryLabels: Record<string, string> = {
    restaurant: "Restaurantes",
    bar: "Bares",
    tour: "Tours",
    museum: "Museos",
    shop: "Tiendas",
    attraction: "Atracciones",
    market: "Mercados",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 p-6 text-white shadow-lg">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-90">Explorar</h2>
        <p className="mt-2 text-2xl font-bold">Lugares de Interés</p>
        <p className="mt-1 text-sm opacity-90">
          {details.trip.city} • {places.length} lugares
        </p>
      </section>

      {/* Filtros */}
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter className="h-4 w-4" />
          <span>Categorías</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-violet-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat === "Todos" ? cat : categoryLabels[cat] || cat}
              {cat !== "Todos" && (
                <span className="ml-1.5 text-xs opacity-75">
                  ({places.filter((p) => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Lista de lugares */}
      {selectedCategory === "Todos" ? (
        // Vista agrupada por categoría
        <div className="space-y-8">
          {Object.entries(placesByCategory)
            .sort(([catA], [catB]) => catA.localeCompare(catB))
            .map(([category, placesInCategory]) => (
              <section key={category}>
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {categoryLabels[category] || category}
                  </h3>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
                    {placesInCategory.length}
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {placesInCategory.map((place, idx) => (
                    <PlaceCard key={`${place.name}-${idx}`} place={place} />
                  ))}
                </div>
              </section>
            ))}
        </div>
      ) : (
        // Vista filtrada
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlaces.map((place, idx) => (
            <PlaceCard key={`${place.name}-${idx}`} place={place} />
          ))}
        </div>
      )}

      {filteredPlaces.length === 0 && (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
          <MapPin className="mx-auto h-16 w-16 text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">
            No hay lugares en esta categoría
          </p>
          <button
            onClick={() => setSelectedCategory("Todos")}
            className="mt-4 text-sm text-violet-600 hover:text-violet-700"
          >
            Ver todos los lugares
          </button>
        </div>
      )}
    </div>
  );
}
