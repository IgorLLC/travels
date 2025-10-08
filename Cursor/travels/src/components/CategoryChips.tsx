import { useMemo } from "react";
import { cn } from "@/lib/utils";

type CategoryChipsProps = {
  categories: string[];
  active?: string;
  onSelect?: (category: string | null) => void;
};

export function CategoryChips({ categories, active, onSelect }: CategoryChipsProps) {
  const items = useMemo(() => ["Todas", ...categories], [categories]);

  return (
    <div className="flex snap-x items-center gap-2 overflow-auto pb-3">
      {items.map((category) => {
        const isActive = category === active || (!active && category === "Todas");
        return (
          <button
            key={category}
            className={cn(
              "snap-start rounded-full border px-4 py-1 text-sm font-medium transition",
              isActive
                ? "border-violet-500 bg-violet-500 text-white shadow"
                : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-600"
            )}
            onClick={() => onSelect?.(category === "Todas" ? null : category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

