# Travel Studio

Aplicación React (Vite + TypeScript) que muestra una colección de viajes planeados. La pantalla principal enseña tarjetas con los destinos guardados y permite abrir el itinerario detallado del viaje a Nueva Orleans.

La interfaz está maquetada con [Tailwind CSS](https://tailwindcss.com/) y componentes de [shadcn/ui](https://ui.shadcn.com/), lo que facilita mantener un estilo moderno y consistente.

## 🚀 Scripts

> Requiere Node.js 18 o superior.

```bash
npm install
npm run dev
```

La app se expone en `http://localhost:5173`.

## 🧭 Características

- Tarjetas de viajes con fechas, ciudad y highlights principales.
- Navegación con React Router hacia la vista de detalle.
- Vista "Basic Information" para Nueva Orleans con hotel, zona horaria y destacados.
- Sección de itinerario que agrupa las actividades por día.
- Botón flotante de “+” listo para futuras expansiones.

Los datos se encuentran en [`src/data/travels.ts`](src/data/travels.ts) y pueden ampliarse con nuevos destinos y actividades.
