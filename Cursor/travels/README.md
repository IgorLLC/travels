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

## 5. Store con Zustand

`src/store/useTripStore.ts`

```ts
import { create } from 'zustand';

export type Activity = {
  time: string;
  title: string;
  category: string;
  notes?: string;
  coords?: { lat: number; lng: number };
};

export type Day = {
  date: string;
  label: string;
  activities: Activity[];
};

type TripState = {
  days: Day[];
  setDays: (days: Day[]) => void;
  addActivity: (date: string, a: Activity) => void;
  updateActivity: (date: string, idx: number, patch: Partial<Activity>) => void;
  removeActivity: (date: string, idx: number) => void;
};

export const useTripStore = create<TripState>((set) => ({
  days: [],
  setDays: (days) => set({ days }),
  addActivity: (date, a) =>
    set((s) => ({
      days: s.days.map((d) =>
        d.date === date ? { ...d, activities: [...d.activities, a] } : d
      ),
    })),
  updateActivity: (date, idx, patch) =>
    set((s) => ({
      days: s.days.map((d) =>
        d.date === date
          ? {
              ...d,
              activities: d.activities.map((x, i) =>
                i === idx ? { ...x, ...patch } : x
              ),
            }
          : d
      ),
    })),
  removeActivity: (date, idx) =>
    set((s) => ({
      days: s.days.map((d) =>
        d.date === date
          ? {
              ...d,
              activities: d.activities.filter((_, i) => i !== idx),
            }
          : d
      ),
    })),
}));
```

---

## 6. Integración de Uber y Mapas

### Enlace Profundo de Uber

```ts
export const buildUberLink = (lat: number, lng: number, name: string) =>
  `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(
    name
  )}`;
```

### Ejemplo de Google Maps Embed

```tsx
<iframe
  src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
  className="w-full h-48 rounded-xl border"
  loading="lazy"
></iframe>
```

---

## 7. Componentes Principales (Snippets)

### 7.1 `DayCard.tsx`

```tsx
import { Day } from '../store/useTripStore';
import { ActivityItem } from './ActivityItem';
import { EditorSheet } from './EditorSheet';
import { useState } from 'react';

interface DayCardProps {
  day: Day;
}

export function DayCard({ day }: DayCardProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <section className="bg-slate-50 rounded-2xl p-4 mb-6 shadow-sm">
      <header className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-semibold">{day.label}</h2>
          <p className="text-sm text-slate-500">{day.date}</p>
        </div>
        <button
          className="px-3 py-1 text-sm rounded-full bg-emerald-500 text-white"
          onClick={() => setEditingIndex(day.activities.length)}
        >
          + Actividad
        </button>
      </header>

      <div className="space-y-3">
        {day.activities.map((activity, idx) => (
          <ActivityItem
            key={`${day.date}-${idx}`}
            activity={activity}
            onEdit={() => setEditingIndex(idx)}
          />
        ))}
      </div>

      {editingIndex !== null && (
        <EditorSheet
          date={day.date}
          index={editingIndex}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </section>
  );
}
```

### 7.2 `ActivityItem.tsx`

```tsx
import { Activity } from '../store/useTripStore';
import { buildUberLink } from './UberButton';

interface ActivityItemProps {
  activity: Activity;
  onEdit: () => void;
}

export function ActivityItem({ activity, onEdit }: ActivityItemProps) {
  const uber = activity.coords
    ? buildUberLink(activity.coords.lat, activity.coords.lng, activity.title)
    : undefined;

  return (
    <article className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-start gap-3">
        <div className="space-y-2">
          <p className="font-semibold">{activity.time} – {activity.title}</p>
          {activity.notes && (
            <p className="text-xs text-slate-500">{activity.notes}</p>
          )}
        </div>
        <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
          {activity.category}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        {uber && (
          <a
            href={uber}
            className="underline text-emerald-600"
            target="_blank"
            rel="noreferrer"
          >
            Pedir Uber
          </a>
        )}
        {activity.coords && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${activity.coords.lat},${activity.coords.lng}`}
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Abrir mapa
          </a>
        )}
        <button className="text-slate-600" onClick={onEdit}>
          Editar
        </button>
      </div>
    </article>
  );
}
```

### 7.3 `CategoryChips.tsx`

```tsx
import { useMemo } from 'react';
import { useTripStore } from '../store/useTripStore';

interface CategoryChipsProps {
  activeCategory: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryChips({ activeCategory, onSelect }: CategoryChipsProps) {
  const days = useTripStore((state) => state.days);

  const categories = useMemo(() => {
    const set = new Set<string>();
    days.forEach((day) => day.activities.forEach((a) => set.add(a.category)));
    return Array.from(set).sort();
  }, [days]);

  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      <button
        className={`px-3 py-1 rounded-full border ${
          activeCategory === null
            ? 'bg-slate-900 text-white'
            : 'bg-white text-slate-600'
        }`}
        onClick={() => onSelect(null)}
      >
        Todo
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`px-3 py-1 rounded-full border ${
            activeCategory === category
              ? 'bg-emerald-500 text-white border-emerald-500'
              : 'bg-white text-slate-600'
          }`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
```

### 7.4 `MapMini.tsx`

```tsx
interface MapMiniProps {
  lat: number;
  lng: number;
  label: string;
}

export function MapMini({ lat, lng, label }: MapMiniProps) {
  return (
    <div className="rounded-xl overflow-hidden border">
      <iframe
        title={`Mapa ${label}`}
        src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
        className="w-full h-48"
        loading="lazy"
      />
    </div>
  );
}
```

### 7.5 `UberButton.tsx`

```tsx
import { Car } from 'lucide-react';

interface UberButtonProps {
  lat: number;
  lng: number;
  label: string;
}

export const buildUberLink = (lat: number, lng: number, name: string) =>
  `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(
    name
  )}`;

export function UberButton({ lat, lng, label }: UberButtonProps) {
  return (
    <a
      href={buildUberLink(lat, lng, label)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full"
    >
      <Car className="h-4 w-4" /> Llamar Uber
    </a>
  );
}
```

### 7.6 `EmptyPlaceholder.tsx`

```tsx
interface EmptyPlaceholderProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyPlaceholder({ message, actionLabel, onAction }: EmptyPlaceholderProps) {
  return (
    <div className="text-center text-slate-500 py-10">
      <p>{message}</p>
      {actionLabel && onAction && (
        <button
          className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-emerald-500 text-white"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
```

### 7.7 `EditorSheet.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Activity, useTripStore } from '../store/useTripStore';

interface EditorSheetProps {
  date: string;
  index: number;
  onClose: () => void;
}

const emptyActivity: Activity = {
  time: '',
  title: '',
  category: '',
  notes: '',
};

export function EditorSheet({ date, index, onClose }: EditorSheetProps) {
  const { days, addActivity, updateActivity } = useTripStore();
  const day = days.find((d) => d.date === date);
  const editing = day && index < day.activities.length ? day.activities[index] : undefined;
  const [form, setForm] = useState<Activity>(editing ?? emptyActivity);

  useEffect(() => {
    if (editing) setForm(editing);
  }, [editing]);

  if (!day) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editing) {
      updateActivity(date, index, form);
    } else {
      addActivity(date, form);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-t-3xl p-6 space-y-4"
      >
        <header className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {editing ? 'Editar actividad' : 'Nueva actividad'}
          </h3>
          <button type="button" onClick={onClose}>
            Cerrar
          </button>
        </header>

        <div className="grid gap-3">
          <label className="text-sm font-medium">
            Hora
            <input
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              type="time"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              required
            />
          </label>
          <label className="text-sm font-medium">
            Título
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              required
            />
          </label>
          <label className="text-sm font-medium">
            Categoría
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              required
            />
          </label>
          <label className="text-sm font-medium">
            Notas
            <textarea
              value={form.notes ?? ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              rows={3}
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-emerald-500 text-white font-semibold"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
```

---

## 8. Páginas Principales (`src/pages`)

### 8.1 `Home.tsx`

```tsx
import { useMemo, useState } from 'react';
import { CategoryChips } from '../components/CategoryChips';
import { useTripStore } from '../store/useTripStore';
import { DayCard } from '../components/DayCard';

export default function HomePage() {
  const days = useTripStore((state) => state.days);
  const [category, setCategory] = useState<string | null>(null);

  const filteredDays = useMemo(() => {
    if (!category) return days;
    return days.map((day) => ({
      ...day,
      activities: day.activities.filter((a) => a.category === category),
    }));
  }, [days, category]);

  return (
    <div className="space-y-6 pb-20">
      <CategoryChips activeCategory={category} onSelect={setCategory} />
      {filteredDays.map((day) => (
        <DayCard key={day.date} day={day} />
      ))}
    </div>
  );
}
```

### 8.2 `Itinerary.tsx`

```tsx
import { useTripStore } from '../store/useTripStore';
import { DayCard } from '../components/DayCard';

export default function ItineraryPage() {
  const days = useTripStore((state) => state.days);

  return (
    <div className="space-y-6 pb-20">
      {days.map((day) => (
        <DayCard key={day.date} day={day} />
      ))}
    </div>
  );
}
```

### 8.3 `Map.tsx`

```tsx
import { useTripStore } from '../store/useTripStore';
import { MapMini } from '../components/MapMini';

export default function MapPage() {
  const days = useTripStore((state) => state.days);

  return (
    <div className="space-y-6 pb-20">
      {days.map((day) => (
        <section key={day.date} className="space-y-3">
          <h2 className="text-lg font-semibold">{day.label}</h2>
          {day.activities
            .filter((activity) => activity.coords)
            .map((activity, idx) => (
              <div key={`${day.date}-${idx}`} className="space-y-2">
                <p className="font-medium">{activity.title}</p>
                {activity.coords && (
                  <MapMini
                    lat={activity.coords.lat}
                    lng={activity.coords.lng}
                    label={activity.title}
                  />
                )}
              </div>
            ))}
        </section>
      ))}
    </div>
  );
}
```

### 8.4 `Settings.tsx`

```tsx
import { useState } from 'react';
import { useTripStore } from '../store/useTripStore';

export default function SettingsPage() {
  const days = useTripStore((state) => state.days);
  const [mapProvider, setMapProvider] = useState<'google' | 'mapbox'>('google');

  return (
    <div className="space-y-6 pb-20">
      <section className="bg-white rounded-2xl p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Proveedor de mapas</h2>
        <div className="flex gap-3">
          {(['google', 'mapbox'] as const).map((provider) => (
            <button
              key={provider}
              onClick={() => setMapProvider(provider)}
              className={`px-3 py-1 rounded-full border ${
                mapProvider === provider ? 'bg-slate-900 text-white' : ''
              }`}
            >
              {provider === 'google' ? 'Google Maps' : 'Mapbox'}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Resumen</h2>
        <p className="text-sm text-slate-500">
          {days.length} días planeados • {days.reduce((acc, d) => acc + d.activities.length, 0)} actividades
        </p>
      </section>
    </div>
  );
}
```

---

## 9. App Shell (`App.tsx` y `main.tsx`)

### 9.1 `App.tsx`

```tsx
import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import data from './data/itinerary.json';
import { useTripStore } from './store/useTripStore';

const tabs = [
  { to: '/', label: 'Inicio' },
  { to: '/itinerary', label: 'Itinerario' },
  { to: '/map', label: 'Mapa' },
  { to: '/settings', label: 'Ajustes' },
];

export default function App() {
  const location = useLocation();
  const setDays = useTripStore((state) => state.setDays);

  useEffect(() => {
    setDays(data.days);
  }, [setDays]);

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="max-w-md mx-auto px-4 pt-6">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white border-t shadow-inner flex justify-between px-4 py-3">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className={`text-sm font-medium ${
              location.pathname === tab.to ? 'text-emerald-500' : 'text-slate-500'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
```

### 9.2 `main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import HomePage from './pages/Home';
import ItineraryPage from './pages/Itinerary';
import MapPage from './pages/Map';
import SettingsPage from './pages/Settings';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="itinerary" element={<ItineraryPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
```

---

## 10. Guardado de Cambios

Persistencia con `localStorage`.

```ts
useEffect(() => {
  const saved = localStorage.getItem('trip-days');
  if (saved) {
    setDays(JSON.parse(saved));
  }
}, [setDays]);

useEffect(() => {
  localStorage.setItem('trip-days', JSON.stringify(days));
}, [days]);
```

Integra estos efectos dentro de tu componente raíz (por ejemplo, `App.tsx`) para recordar los cambios del usuario entre sesiones.

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

## 13. ✅ Resultado Esperado

La app:

- Muestra el **itinerario de Nueva Orleans** por día y categoría.
- Permite **editar o agregar actividades** en el momento.
- Integra **Google Maps** y **enlaces de Uber** para cada actividad.
- Está pensada para ser **mobile-first**, ideal para viajes.

Este README ahora incluye snippets de los componentes clave, páginas y shell de la app para que sea una referencia autocontenida.
