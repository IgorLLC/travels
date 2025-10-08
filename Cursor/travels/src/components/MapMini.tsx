type MapMiniProps = {
  lat: number;
  lng: number;
  title?: string;
  height?: number;
  zoom?: number;
};

export function MapMini({ lat, lng, title, height = 176, zoom = 15 }: MapMiniProps) {
  return (
    <iframe
      title={title ?? "Ubicación"}
      src={`https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`}
      className="w-full rounded-2xl border border-slate-200 shadow-sm"
      style={{ height: `${height}px` }}
      loading="lazy"
      allowFullScreen
    />
  );
}

