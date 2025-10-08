import { MapPin, CalendarDays, Globe2, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Travel } from '../data/travels';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

type TravelCardProps = {
  travel: Travel;
};

const metaItems: Array<{
  icon: LucideIcon;
  label: string;
  getValue: (travel: Travel) => string;
}> = [
  { icon: CalendarDays, label: 'Fechas', getValue: (travel: Travel) => travel.dateRange },
  { icon: MapPin, label: 'Ciudad', getValue: (travel: Travel) => travel.city },
  { icon: Globe2, label: 'País', getValue: (travel: Travel) => travel.country },
];

const TravelCard = ({ travel }: TravelCardProps) => {
  const { id, title, description, highlights } = travel;

  return (
    <Link
      to={`/travels/${id}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`Abrir itinerario ${title}`}
    >
      <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
            {metaItems.map(({ icon: Icon, label, getValue }) => (
              <li key={label} className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/50 px-3 py-2">
                <Icon className="h-4 w-4 text-primary" aria-hidden />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground/80">{label}</p>
                  <p className="font-medium text-foreground">{getValue(travel)}</p>
                </div>
              </li>
            ))}
          </ul>
          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {highlights.map((highlight) => (
                <Badge key={highlight} variant="outline" className="border-border bg-background text-sm">
                  {highlight}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default TravelCard;
