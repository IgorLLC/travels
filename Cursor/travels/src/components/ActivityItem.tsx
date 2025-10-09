import type { Activity } from "@/store/useTripStore";
import { MapPin, NotebookPen, Pencil, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityItemProps = {
  activity: Activity;
  day: string;
  index: number;
};

const categories: Record<string, string> = {
  Transporte: "bg-blue-100 text-blue-600",
  Comida: "bg-rose-100 text-rose-600",
  Cultura: "bg-amber-100 text-amber-600",
  Experiencia: "bg-sky-100 text-sky-600",
  Otro: "bg-slate-100 text-slate-600",
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const { time, title, category, notes, confirmation, source, address, link } = activity;
  const maps = link ?? (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : null);

  return (
    <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            {time && <span className="text-sm font-semibold text-slate-500">{time}</span>}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                categories[category] ?? categories.Otro
              )}
            >
              {category}
            </span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-900">{title}</h3>
          {notes && <p className="mt-1 text-sm text-slate-500">{notes}</p>}
        </div>

        <div className="flex items-center gap-2">
          {/* Botón de eliminar deshabilitado */}
          {/* <button
            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
            onClick={() => removeActivity(day, index)}
            aria-label="Eliminar actividad"
          >
            <Trash2 className="h-4 w-4" />
          </button> */}
          <button
            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
            aria-label="Editar actividad"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </div>

      {(confirmation || source || maps || address) && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {confirmation && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 font-medium">
              <Ticket className="h-3 w-3" />
              {confirmation}
            </span>
          )}
          {source && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 font-medium">
              <NotebookPen className="h-3 w-3" />
              {source}
            </span>
          )}
          {address && !maps && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {address}
            </span>
          )}
          {maps && (
            <a
              href={maps}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-violet-600 underline"
            >
              <MapPin className="h-3 w-3" /> Ver ubicación
            </a>
          )}
        </div>
      )}
    </article>
  );
}

