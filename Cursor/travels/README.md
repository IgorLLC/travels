# 🧭 Travel Companion – Nueva Orleans 2025

Aplicación móvil en React + Vite diseñada para gestionar un itinerario real del viaje a Nueva Orleans (7–11 nov 2025). Integra vuelos, hotel, reservas gastronómicas, tickets y agenda diaria, con persistencia local y vistas adaptadas a mobile.

## 🚀 Tecnologías

- React + TypeScript (Vite)
- Zustand para estado global
- TailwindCSS para UI mobile-first
- React Router DOM v7
- date-fns para formato de fechas
- Lucide React para íconos

## 📁 Estructura

```
src/
 ├─ components/
 ├─ data/
 ├─ lib/
 ├─ pages/
 ├─ store/
 ├─ App.tsx
 └─ main.tsx
```

## 🔄 Datos de referencia

`src/data/itinerary.json` contiene el modelo principal:

- `trip`: ciudad, fechas, viajeros
- `flights`: itinerarios de ida/vuelta, códigos
- `hotel`: hospedaje y fuente de la reserva
- `reservations`: restaurantes confirmados
- `tickets`: pases comprados
- `itinerary`: agenda diaria textual (la app la transforma a actividades)
- `notes`: recordatorios relevantes

## 📱 Vistas

- **Inicio**: hero del viaje + vuelos, reservas, tickets, agenda filtrable y notas.
- **Itinerario**: tarjetas por día con actividades y mapa del hotel.
- **Mapa**: puntos georreferenciados (requieren coords en actividades).
- **Ajustes**: metadatos del viaje y restauración de agenda.

## 🧠 Estado

`useTripStore`:

- carga `itinerary.json`, deriva las actividades diarias y persiste cambios en `localStorage`.
- permite agregar, editar y eliminar actividades por día.
- expone `setTripData` y `resetDays` para futuras fuentes de datos.

## ▶️ Scripts

```bash
npm install
npm run dev      # servidor local
npm run lint     # análisis ESLint
npm run build    # bundle de producción
```

## 🗺️ Extensiones futuras

- Enriquecer actividades con coordenadas para mejorar el mapa.
- Integrar proveedores externos (Google Calendar, Uber, Mapbox).
- Sincronizar cambios entre viajeros (backend o Supabase).
- Modo offline / PWA.

## ✅ Estado actual

- Datos cargan según el JSON especificado.
- UI adaptada y funcional en vistas principales.
- Persistencia local y build sin errores (`npm run lint`, `npm run build`).


