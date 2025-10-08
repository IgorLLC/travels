import { CalendarRange, Clock, Hotel, MapPin, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { travels } from '../data/travels';
import { format } from '../utils/format';

const TravelDetailPage = () => {
  const { travelId } = useParams<{ travelId: string }>();
  const travel = travels.find((t) => t.id === travelId);

  if (!travel) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-16 pt-12">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80"
        >
          ← Volver
        </Link>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Itinerario no disponible</CardTitle>
            <CardDescription>
              No encontramos ese itinerario. Vuelve a la página principal para seleccionar uno de tus viajes planificados.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const { title, city, country, timezone, hotel, highlights, days, description, dateRange } = travel;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-20 pt-12">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80"
        >
          ← Volver a viajes
        </Link>
        <Badge variant="outline" className="rounded-full border-primary/40 bg-primary/5 text-primary">
          {dateRange}
        </Badge>
      </div>

      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-transparent bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          <MapPin className="h-4 w-4" aria-hidden /> {city}, {country}
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{description}</p>
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">Basic Information</h2>
          <Sparkles className="h-5 w-5 text-primary" aria-hidden />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-dashed">
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" aria-hidden /> Zona horaria
              </CardTitle>
              <CardDescription className="text-base text-foreground">{timezone}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Hotel className="h-5 w-5 text-primary" aria-hidden /> Hotel
              </CardTitle>
              <CardDescription className="text-sm">
                {hotel.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Nombre</p>
                <p className="text-base font-medium text-foreground">{hotel.name}</p>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Check-in</p>
                  <p className="font-medium text-foreground">{format.datetime(hotel.checkIn)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Check-out</p>
                  <p className="font-medium text-foreground">{format.datetime(hotel.checkOut)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {highlights.length > 0 && (
            <Card className="md:col-span-3">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarRange className="h-5 w-5 text-primary" aria-hidden /> Highlights
                </CardTitle>
                <CardDescription>Momentos que no te puedes perder durante el viaje.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {highlights.map((highlight) => (
                  <Badge key={highlight} variant="accent" className="text-sm">
                    {highlight}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">Itinerario</h2>
          <CalendarRange className="h-5 w-5 text-primary" aria-hidden />
        </div>
        {days.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Aún no hay actividades</CardTitle>
              <CardDescription>
                Usa el botón “+” en la pantalla principal para comenzar a planificar este viaje cuando la función esté disponible.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6">
            {days.map((day) => (
              <Card key={day.date} className="overflow-hidden">
                <CardHeader className="border-b bg-muted/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-xl">{day.label}</CardTitle>
                      <CardDescription className="text-sm font-medium text-foreground">
                        {format.date(day.date)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-background text-xs uppercase tracking-wide">
                      {day.activities.length} actividades
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <ol className="space-y-3">
                    {day.activities.map((activity) => (
                      <li
                        key={`${day.date}-${activity.time}-${activity.title}`}
                        className="flex flex-col justify-between gap-3 rounded-lg border bg-card/60 p-4 text-sm shadow-sm sm:flex-row sm:items-center"
                      >
                        <div className="space-y-1">
                          <p className="text-base font-semibold text-foreground">{activity.title}</p>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">{activity.category}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                          <Clock className="h-4 w-4" aria-hidden />
                          {activity.time}
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default TravelDetailPage;
