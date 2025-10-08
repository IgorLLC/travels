# 🧭 React Travel Itinerary App – Guía de Inicio (Ejemplo Nueva Orleans)

Esta guía describe cómo construir una **app de itinerarios de viaje móvil** con **React** y **Codex**, incorporando mapas, enlaces profundos de Uber y actividades editables.

---

## 1. Stack Tecnológico

- **React + Vite** – arranque rápido
- **TailwindCSS** – diseño mobile-first
- **Zustand** – manejo de estado sencillo
- **React Router** – navegación entre pantallas
- **Mapbox GL JS** o **Google Maps Embed API** – integración de mapas
- **date-fns** – utilidades de fechas y horas
- **lucide-react** – íconos

Opcional:

- **Vite PWA plugin** para modo offline

---

## 2. Estructura del Proyecto

```
trip-app/
├─ src/
│  ├─ data/
│  │  └─ itinerary.json
│  ├─ store/
│  │  └─ useTripStore.ts
│  ├─ components/
│  │  ├─ DayCard.tsx
│  │  ├─ ActivityItem.tsx
│  │  ├─ CategoryChips.tsx
│  │  ├─ MapMini.tsx
│  │  ├─ UberButton.tsx
│  │  ├─ EmptyPlaceholder.tsx
│  │  └─ EditorSheet.tsx
│  ├─ pages/
│  │  ├─ Home.tsx
│  │  ├─ Itinerary.tsx
│  │  ├─ Map.tsx
│  │  └─ Settings.tsx
│  ├─ App.tsx
│  └─ main.tsx
├─ index.html
├─ package.json
└─ tailwind.config.js
```

---

## 3. Comandos de Configuración

```bash
npm create vite@latest trip-app -- --template react-ts
cd trip-app
npm i zustand date-fns lucide-react react-router-dom
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Añade a `tailwind.config.js`:

```js
content: ["./index.html", "./src/**/*.{ts,tsx}"]
```

Agrega las directivas de Tailwind en `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 4. Modelo de Datos (Ejemplo: Viaje a Nueva Orleans)

Guarda este JSON en `src/data/itinerary.json`.

```json
{
  "trip": {
    "title": "Nueva Orleans – 7–11 nov 2025",
    "city": "New Orleans, LA",
    "timezone": "America/Chicago"
  },
  "hotel": {
    "name": "Hotel de la Poste – French Quarter",
    "address": "316 Chartres St, New Orleans, LA 70130",
    "lat": 29.9574,
    "lng": -90.0650,
    "checkIn": "2025-11-07T15:00:00",
    "checkOut": "2025-11-11T11:00:00"
  },
  "days": [
    {
      "date": "2025-11-07",
      "label": "Viernes – Llegada",
      "activities": [
        {"time": "17:16", "title": "Llegada a MSY", "category": "Transporte"},
        {"time": "20:00", "title": "Cena en Arnaud’s + French 75 Bar", "category": "Comida"}
      ]
    },
    {
      "date": "2025-11-08",
      "label": "Sábado – Brunch, Cultura y Vibes",
      "activities": [
        {"time": "09:00", "title": "Brunch en Willa Jean", "category": "Comida"},
        {"time": "11:00", "title": "Pharmacy Museum", "category": "Museo"},
        {"time": "15:00", "title": "Haus of Hoodoo", "category": "Cultura"}
      ]
    }
  ]
}
```

---

## 5. Configuración del Store (Zustand)

`src/store/useTripStore.ts`

```ts
import { create } from 'zustand';

type Activity = {
  time: string;
  title: string;
  category: string;
  notes?: string;
};

type Day = {
  date: string;
  label: string;
  activities: Activity[];
};

type TripState = {
  days: Day[];
  addActivity: (date: string, a: Activity) => void;
  updateActivity: (date: string, idx: number, patch: Partial<Activity>) => void;
  removeActivity: (date: string, idx: number) => void;
};

export const useTripStore = create<TripState>((set) => ({
  days: [],
  addActivity: (date, a) => set((s) => ({
    days: s.days.map(d => d.date === date ? ({...d, activities:[...d.activities, a]}) : d)
  })),
  updateActivity: (date, idx, patch) => set((s) => ({
    days: s.days.map(d => d.date === date
      ? ({...d, activities: d.activities.map((x,i)=> i===idx ? {...x, ...patch} : x)})
      : d)
  })),
  removeActivity: (date, idx) => set((s) => ({
    days: s.days.map(d => d.date === date
      ? ({...d, activities: d.activities.filter((_,i)=> i!==idx)})
      : d)
  }))
}));
```

---

## 6. Integración de Uber y Mapas

### Enlace Profundo de Uber

```ts
const uberLink = (lat:number, lng:number, name:string) =>
  `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(name)}`;
```

### Ejemplo de Google Maps Embed

```tsx
<iframe
  src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
  className="w-full h-48 rounded-xl border"
></iframe>
```

---

## 7. Resumen de Componentes

- **DayCard** – muestra el label del día y sus actividades
- **ActivityItem** – actividad individual con botones de Uber/mapa
- **EditorSheet** – formulario modal para editar o agregar actividades
- **CategoryChips** – filtros rápidos (Comida, Tour, Cultura, etc.)
- **MapMini** – mapa embebido compacto

---

## 8. Ejemplo de `ActivityItem`

```tsx
function ActivityItem({ a, onEdit }: { a: any; onEdit: () => void }) {
  const uber = a.coords ? `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${a.coords.lat}&dropoff[longitude]=${a.coords.lng}&dropoff[nickname]=${encodeURIComponent(a.title)}` : undefined;

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-3">
      <div className="flex justify-between items-center">
        <span className="font-semibold">{a.time} – {a.title}</span>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{a.category}</span>
      </div>
      <div className="mt-2 flex gap-3 text-sm">
        {uber && <a href={uber} className="underline" target="_blank">Uber</a>}
        {a.coords && <a href={`https://www.google.com/maps/search/?api=1&query=${a.coords.lat},${a.coords.lng}`} target="_blank">Mapa</a>}
        <button onClick={onEdit}>Editar</button>
      </div>
    </div>
  );
}
```

---

## 9. Vistas de Navegación

| Vista         | Descripción                         |
| ------------- | ----------------------------------- |
| **Home**      | Vista general por categorías        |
| **Itinerary** | Detalle diario (lista de DayCard)   |
| **Map**       | Mapa con todas las actividades      |
| **Settings**  | Configurar tipo de mapa y datos base|

---

## 10. Guardado de Cambios

Persistencia con `localStorage`.

```ts
useEffect(() => {
  const saved = localStorage.getItem('trip');
  if (saved) setState(JSON.parse(saved));
}, []);

useEffect(() => {
  localStorage.setItem('trip', JSON.stringify(days));
}, [days]);
```

---

## 11. UX / Tips Mobile

- Header sticky con tabs de fecha (Vie–Mar)
- Botón flotante + para agregar actividades
- Acciones swipe para Editar/Mapa/Uber
- Opcional: instalable como PWA

---

## 12. Despliegue

```bash
npm run build
# desplegar el contenido de /dist en Vercel o Netlify
```

---

## ✅ Resultado Esperado

La app:

- Muestra el **itinerario de Nueva Orleans** por día y categoría.
- Permite **editar o agregar actividades** en el momento.
- Integra **Google Maps** y **enlaces de Uber** para cada actividad.
- Está pensada para ser **mobile-first**, ideal para viajes.

¿Te gustaría que el README incluya snippets de cada componente principal (`DayCard`, `MapMini`, `UberButton`, etc.) para que sea totalmente autocontenida para Codex?


