type EmptyPlaceholderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyPlaceholder({ title, description, action }: EmptyPlaceholderProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-violet-500">Sin actividades</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

