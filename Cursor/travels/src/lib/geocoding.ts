// Servicio de geocodificación usando Nominatim (OpenStreetMap) - gratuito y sin API key
// https://nominatim.org/release-docs/latest/api/Search/

const CACHE_KEY = "geocode-cache";
const CACHE_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

type CachedCoords = {
  lat: number;
  lng: number;
  timestamp: number;
};

type GeocodeCache = {
  [address: string]: CachedCoords;
};

// Obtener cache desde localStorage
const getCache = (): GeocodeCache => {
  if (typeof window === "undefined") return {};
  try {
    const cached = window.localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

// Guardar en cache
const setCache = (cache: GeocodeCache) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Error guardando cache de geocodificación:", error);
  }
};

// Limpiar cache expirado
const cleanExpiredCache = (cache: GeocodeCache): GeocodeCache => {
  const now = Date.now();
  const cleaned: GeocodeCache = {};
  
  for (const [address, coords] of Object.entries(cache)) {
    if (now - coords.timestamp < CACHE_DURATION_MS) {
      cleaned[address] = coords;
    }
  }
  
  return cleaned;
};

/**
 * Geocodifica una dirección usando Nominatim (OpenStreetMap)
 * @param address - Dirección completa a geocodificar
 * @returns Coordenadas {lat, lng} o null si no se encuentra
 */
export const geocodeAddress = async (
  address: string
): Promise<{ lat: number; lng: number } | null> => {
  // Normalizar dirección para cache
  const normalizedAddress = address.trim().toLowerCase();
  
  // Verificar cache
  let cache = getCache();
  cache = cleanExpiredCache(cache);
  
  if (cache[normalizedAddress]) {
    const cached = cache[normalizedAddress];
    return { lat: cached.lat, lng: cached.lng };
  }

  try {
    // Llamar a Nominatim API
    // Nota: Nominatim requiere un User-Agent válido
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.append("q", address);
    url.searchParams.append("format", "json");
    url.searchParams.append("limit", "1");

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "TripApp/1.0", // Requerido por Nominatim
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding falló: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.warn(`No se encontraron coordenadas para: ${address}`);
      return null;
    }

    const result = data[0];
    const coords = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    };

    // Guardar en cache
    cache[normalizedAddress] = {
      ...coords,
      timestamp: Date.now(),
    };
    setCache(cache);

    // Respetar límite de rate de Nominatim (máx 1 req/segundo)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return coords;
  } catch (error) {
    console.error(`Error geocodificando "${address}":`, error);
    return null;
  }
};

/**
 * Geocodifica múltiples direcciones en lote
 * @param addresses - Array de direcciones
 * @returns Array de coordenadas (o null si falla)
 */
export const geocodeAddresses = async (
  addresses: string[]
): Promise<Array<{ lat: number; lng: number } | null>> => {
  const results: Array<{ lat: number; lng: number } | null> = [];

  for (const address of addresses) {
    const coords = await geocodeAddress(address);
    results.push(coords);
  }

  return results;
};

