type NotesSectionProps = {
  notes?: string[];
};

export function NotesSection({ notes }: NotesSectionProps) {
  if (!notes?.length) return null;

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Notas clave
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
        {notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </section>
  );
}

