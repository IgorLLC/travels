import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export const formatDate = (value: string, pattern = "PPP") =>
  format(parseISO(value), pattern, { locale: es });

export const formatTime = (value?: string) => {
  if (!value) return "";
  try {
    return format(parseISO(value), "p", { locale: es });
  } catch {
    return value;
  }
};

export const formatDayHeading = (date: string, label?: string) => {
  const prefix = label ? `${label} · ` : "";
  return `${prefix}${formatDate(date, "EEEE d 'de' MMMM")}`;
};

export const formatCurrency = (value?: number, currency = "USD") => {
  if (!value || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("es-US", {
    style: "currency",
    currency,
  }).format(value);
};

export const formatAirportLeg = (leg: {
  from: string;
  to: string;
  depart_local: string;
  arrive_local: string;
}) => {
  const departTime = formatTime(leg.depart_local);
  const arriveTime = formatTime(leg.arrive_local);
  return `${leg.from} ${departTime} → ${leg.to} ${arriveTime}`;
};

