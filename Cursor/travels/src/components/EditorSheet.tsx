import { useState } from "react";
import { useTripStore } from "@/store/useTripStore";
import type { Activity, ActivityCategory } from "@/store/useTripStore";

type EditorSheetProps = {
  date: string;
  initial?: Activity;
  index?: number;
  onClose?: () => void;
};

const categories: ActivityCategory[] = ["Transporte", "Comida", "Cultura", "Experiencia", "Otro"];

export function EditorSheet({ date, initial, index, onClose }: EditorSheetProps) {
  const [activity, setActivity] = useState<Activity>(
    initial ?? {
      title: "",
      time: "",
      category: "Comida",
      notes: "",
    }
  );

  const updateActivity = useTripStore((state) => state.updateActivity);
  const addActivity = useTripStore((state) => state.addActivity);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (index != null && initial) {
      updateActivity(date, index, activity);
    } else {
      addActivity(date, activity);
    }

    onClose?.();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-medium text-slate-700">Título</label>
        <input
          required
          value={activity.title}
          onChange={(event) => setActivity({ ...activity, title: event.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="Nueva actividad"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-slate-700">Hora</label>
          <input
            value={activity.time}
            onChange={(event) => setActivity({ ...activity, time: event.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="09:30"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Categoría</label>
          <select
            value={activity.category}
            onChange={(event) =>
              setActivity({ ...activity, category: event.target.value as ActivityCategory })
            }
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Notas</label>
        <textarea
          value={activity.notes ?? ""}
          onChange={(event) => setActivity({ ...activity, notes: event.target.value })}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="Detalles opcionales"
        />
      </div>

      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="text-sm font-medium text-slate-700">Coordenadas (opcional)</legend>
        <input
          type="number"
          step="any"
          value={activity.coords?.lat ?? ""}
          onChange={(event) =>
            setActivity({
              ...activity,
              coords: {
                lat: Number(event.target.value),
                lng: activity.coords?.lng ?? 0,
              },
            })
          }
          placeholder="Latitud"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          type="number"
          step="any"
          value={activity.coords?.lng ?? ""}
          onChange={(event) =>
            setActivity({
              ...activity,
              coords: {
                lat: activity.coords?.lat ?? 0,
                lng: Number(event.target.value),
              },
            })
          }
          placeholder="Longitud"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </fieldset>

      <button
        type="submit"
        className="w-full rounded-full bg-violet-600 py-2 text-sm font-semibold text-white shadow hover:bg-violet-700"
      >
        {index != null ? "Guardar cambios" : "Agregar actividad"}
      </button>
    </form>
  );
}

