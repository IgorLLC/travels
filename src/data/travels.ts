export type Activity = {
  time: string;
  title: string;
  category: string;
};

export type DayPlan = {
  date: string;
  label: string;
  activities: Activity[];
};

export type Travel = {
  id: string;
  title: string;
  city: string;
  country: string;
  dateRange: string;
  description: string;
  timezone: string;
  hotel: {
    name: string;
    address: string;
    checkIn: string;
    checkOut: string;
  };
  highlights: string[];
  days: DayPlan[];
};

export const travels: Travel[] = [
  {
    id: 'new-orleans',
    title: 'Nueva Orleans – 7–11 nov 2025',
    city: 'New Orleans, Louisiana',
    country: 'United States',
    dateRange: '7 – 11 noviembre 2025',
    description:
      'Un fin de semana largo enfocado en la escena culinaria, cultura vibrante y experiencias únicas en la cuna del jazz.',
    timezone: 'America/Chicago',
    hotel: {
      name: 'Hotel de la Poste – French Quarter',
      address: '316 Chartres St, New Orleans, LA 70130',
      checkIn: '2025-11-07T15:00:00',
      checkOut: '2025-11-11T11:00:00'
    },
    highlights: [
      'Brunch imperdible en Willa Jean',
      'Cocteles artesanales en French 75 Bar',
      'Museo de Farmacia y magia en Haus of Hoodoo'
    ],
    days: [
      {
        date: '2025-11-07',
        label: 'Viernes – Llegada',
        activities: [
          { time: '17:16', title: 'Llegada a MSY', category: 'Transporte' },
          {
            time: '20:00',
            title: 'Cena en Arnaud’s + French 75 Bar',
            category: 'Comida'
          }
        ]
      },
      {
        date: '2025-11-08',
        label: 'Sábado – Brunch, Cultura y Vibes',
        activities: [
          { time: '09:00', title: 'Brunch en Willa Jean', category: 'Comida' },
          { time: '11:00', title: 'Pharmacy Museum', category: 'Museo' },
          { time: '15:00', title: 'Haus of Hoodoo', category: 'Cultura' }
        ]
      }
    ]
  },
  {
    id: 'lisbon',
    title: 'Lisboa Creativa',
    city: 'Lisbon, Portugal',
    country: 'Portugal',
    dateRange: '18 – 23 marzo 2026',
    description:
      'Explora miradores, cafés históricos y un circuito de arte urbano en la capital portuguesa.',
    timezone: 'Europe/Lisbon',
    hotel: {
      name: 'Casa do Bairro Loft',
      address: 'Travessa do Caldeira 19, 1200-088 Lisboa',
      checkIn: '2026-03-18T15:00:00',
      checkOut: '2026-03-23T11:00:00'
    },
    highlights: ['Tram 28 al atardecer', 'Pastéis de nata en Belém', 'Tour de arte urbano con guía local'],
    days: []
  },
  {
    id: 'kyoto',
    title: 'Kyoto Slow Travel',
    city: 'Kyoto',
    country: 'Japan',
    dateRange: '9 – 15 abril 2026',
    description:
      'Templos, jardines zen y experiencias culinarias que celebran la tradición japonesa.',
    timezone: 'Asia/Tokyo',
    hotel: {
      name: 'Ryokan Sakura',
      address: 'Higashiyama-ku, Kyoto',
      checkIn: '2026-04-09T15:00:00',
      checkOut: '2026-04-15T11:00:00'
    },
    highlights: ['Ceremonia del té en Gion', 'Sendero de la Filosofía', 'Cena kaiseki con ingredientes locales'],
    days: []
  }
];
