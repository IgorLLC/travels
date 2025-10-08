const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const timeFormatter = new Intl.DateTimeFormat('es-ES', {
  hour: '2-digit',
  minute: '2-digit'
});

const format = {
  date: (isoDate: string) => {
    const date = new Date(isoDate);
    return dateFormatter.format(date);
  },
  time: (isoDate: string) => {
    const date = new Date(isoDate);
    return timeFormatter.format(date);
  },
  datetime: (isoDate: string) => {
    const date = new Date(isoDate);
    return `${dateFormatter.format(date)} · ${timeFormatter.format(date)}`;
  }
};

export { format };
