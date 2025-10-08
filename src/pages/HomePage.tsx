import { Plus } from 'lucide-react';

import TravelCard from '../components/TravelCard';
import { Button } from '../components/ui/button';
import { travels } from '../data/travels';

const HomePage = () => {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-12">
      <header className="flex flex-col justify-between gap-6 rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-background p-8 shadow-sm sm:flex-row sm:items-center">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-primary">Travel Studio</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Explora tus experiencias guardadas</h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Elige un destino para ver el itinerario completo. Muy pronto podrás agregar nuevas aventuras desde este mismo panel.
          </p>
        </div>
        <Button type="button" size="icon" variant="secondary" disabled className="h-14 w-14 rounded-full text-primary shadow-inner">
          <Plus className="h-6 w-6" aria-hidden />
          <span className="sr-only">Agregar nuevo viaje</span>
        </Button>
      </header>

      <section aria-label="Viajes planificados" className="grid gap-6 md:grid-cols-2">
        {travels.map((travel) => (
          <TravelCard key={travel.id} travel={travel} />
        ))}
      </section>
    </main>
  );
};

export default HomePage;
