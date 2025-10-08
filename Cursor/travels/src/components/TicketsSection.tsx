import { formatCurrency, formatDate } from "@/lib/format";
import type { TripData } from "@/store/useTripStore";
import { Ticket } from "lucide-react";

type TicketsSectionProps = {
  tickets: TripData["tickets"];
};

export function TicketsSection({ tickets }: TicketsSectionProps) {
  if (!tickets?.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-emerald-500 p-3 text-white">
          <Ticket className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Boletos y pases</h2>
          <p className="text-xs text-slate-500">Compras anticipadas</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {tickets.map((ticket) => (
          <article
            key={ticket.confirmation_number}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {formatDate(ticket.purchase_date, "EEEE d MMM" )}
                </p>
                <h3 className="text-base font-semibold text-slate-900">{ticket.ticket_name}</h3>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {formatCurrency(ticket.total_paid_usd)}
              </span>
            </header>

            <p className="mt-2 text-xs text-slate-500">
              Incluye: {ticket.includes.join(", ")}
            </p>
            <p className="text-xs text-slate-500">Válido por {ticket.valid_days} días</p>
            <p className="mt-2 text-xs text-slate-400">
              Confirmación: {ticket.confirmation_number} · Fuente: {ticket.source}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

