type TripsHeroProps = {
  city: string;
  dateRange: string;
  travelers: string[];
};

export function TripsHero({ city, dateRange, travelers }: TripsHeroProps) {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 p-[1px] shadow-lg">
      <div className="rounded-3xl bg-white p-6">
        <p className="text-xs uppercase tracking-widest text-violet-500">Próxima aventura</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          {city}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{dateRange}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          {travelers.map((traveler) => (
            <span
              key={traveler}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1"
            >
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              {traveler}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

