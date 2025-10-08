import { create } from "zustand";
import tripSeed from "@/data/itinerary.json";
import { formatDayHeading } from "@/lib/format";

export type TripData = typeof tripSeed;

export type ActivityCategory =
  | "Transporte"
  | "Comida"
  | "Cultura"
  | "Experiencia"
  | "Otro";

export type Coordinates = {
  lat: number;
  lng: number;
  label?: string;
};

export type Activity = {
  time?: string;
  title: string;
  category: ActivityCategory;
  notes?: string;
  source?: string;
  confirmation?: string;
  address?: string;
  link?: string;
  coords?: Coordinates;
};

export type Day = {
  date: string;
  label: string;
  activities: Activity[];
};

type TripState = {
  details: TripData;
  days: Day[];
  addActivity: (date: string, activity: Activity) => void;
  updateActivity: (date: string, index: number, patch: Partial<Activity>) => void;
  removeActivity: (date: string, index: number) => void;
  resetDays: () => void;
};

const STORAGE_KEY = "trip-days";

const inferCategory = (item: string): ActivityCategory => {
  const txt = item.toLowerCase();
  if (txt.includes("vuelo") || txt.includes("traslado")) return "Transporte";
  if (
    txt.includes("brunch") ||
    txt.includes("cena") ||
    txt.includes("almuerzo") ||
    txt.includes("dinner") ||
    txt.includes("breakfast")
  )
    return "Comida";
  if (txt.includes("tour") || txt.includes("museum") || txt.includes("speakeasy")) return "Cultura";
  if (txt.includes("aquarium") || txt.includes("zoo") || txt.includes("insectarium")) return "Experiencia";
  return "Otro";
};

const cleanseParenthetical = (value: string) => {
  const match = value.match(/\(([^)]+)\)\s*$/);
  if (!match) {
    return { title: value.trim(), notes: undefined as string | undefined };
  }

  const notes = match[1];
  const title = value.replace(match[0], "").trim();
  return { title, notes };
};

const extractConfirmation = (text?: string) => {
  if (!text) return undefined;
  const match = text.match(/confirmaci[óo]n:\s*([^,]+)/i);
  return match?.[1]?.trim();
};

const removeConfirmationFromNotes = (text?: string) => {
  if (!text) return undefined;
  const cleaned = text.replace(/confirmaci[óo]n:\s*[^,]+/i, "").replace(/\(.*\)/, "").trim();
  return cleaned.length ? cleaned : undefined;
};

const parseItineraryItems = (data: TripData): Day[] => {
  const entries = Object.entries(data.itinerary ?? {});
  return entries.map(([date, info]) => {
    const activities = info.items.map((item) => {
      const [rawTime, ...rest] = item.split(" – ");
      const remainder = rest.length ? rest.join(" – ") : rawTime;
      const { title: cleanedTitle, notes } = cleanseParenthetical(remainder);
      const confirmation = extractConfirmation(notes);
      const normalizedNotes = removeConfirmationFromNotes(notes);

      return {
        time: rest.length ? rawTime : undefined,
        title: cleanedTitle,
        category: inferCategory(item),
        notes: normalizedNotes,
        confirmation,
      } satisfies Activity;
    });

    return {
      date,
      label: formatDayHeading(date, info.day),
      activities,
    } satisfies Day;
  });
};

const loadPersistedDays = (): Day[] | null => {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as Day[];
  } catch (error) {
    console.error("Error cargando días persistidos", error);
    return null;
  }
};

const persistDays = (days: Day[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
};

const createInitialState = (): { details: TripData; days: Day[] } => {
  const transformed = parseItineraryItems(tripSeed);
  const persisted = loadPersistedDays();
  return {
    details: tripSeed,
    days: persisted ?? transformed,
  };
};

export const useTripStore = create<TripState>((set, get) => ({
  ...createInitialState(),
  addActivity: (date, activity) => {
    const { days } = get();
    const updated = days.map((day) =>
      day.date === date ? { ...day, activities: [...day.activities, activity] } : day
    );
    persistDays(updated);
    set({ days: updated });
  },
  updateActivity: (date, index, patch) => {
    const { days } = get();
    const updated = days.map((day) =>
      day.date === date
        ? {
            ...day,
            activities: day.activities.map((activity, i) =>
              i === index ? { ...activity, ...patch } : activity
            ),
          }
        : day
    );
    persistDays(updated);
    set({ days: updated });
  },
  removeActivity: (date, index) => {
    const { days } = get();
    const updated = days.map((day) =>
      day.date === date
        ? {
            ...day,
            activities: day.activities.filter((_, i) => i !== index),
          }
        : day
    );
    persistDays(updated);
    set({ days: updated });
  },
  resetDays: () => {
    const { details } = get();
    const days = parseItineraryItems(details);
    persistDays(days);
    set({ days });
  },
}));

