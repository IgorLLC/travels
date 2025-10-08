import { Car } from "lucide-react";

type UberButtonProps = {
  lat: number;
  lng: number;
  label?: string;
  className?: string;
};

export function UberButton({ lat, lng, label = "Abrir Uber", className }: UberButtonProps) {
  const link = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(label)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 text-sm font-semibold text-white shadow ${className ?? ""}`}
    >
      <Car className="h-4 w-4" />
      Uber
    </a>
  );
}

