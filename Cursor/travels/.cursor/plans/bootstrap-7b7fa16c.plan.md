<!-- 7b7fa16c-421b-4650-840e-9a210a17d009 074e3390-e3ec-4242-a384-f9c838d8fec2 -->
# Plan de Trabajo

1. Inicializar proyecto Vite React-TS en `/Users/luisviera/Cursor/travels/trip-app` y preparar dependencias base (`react-router-dom`, `zustand`, `date-fns`, `lucide-react`).
2. Configurar TailwindCSS y estilos globales (`tailwind.config.js`, `src/index.css`).
3. Crear estructura `src/data`, `src/store`, `src/components`, `src/pages`; añadir `itinerary.json` y `useTripStore.ts` con lógica de estado/localStorage.
4. Implementar componentes clave (`DayCard`, `ActivityItem`, `CategoryChips`, `MapMini`, `UberButton`, `EmptyPlaceholder`, `EditorSheet`) con funcionalidad mínima según guía.
5. Construir páginas (`Home`, `Itinerary`, `Map`, `Settings`), definir rutas en `App.tsx` y preparar `main.tsx` con providers necesarios.

### To-dos

- [ ] Generar proyecto Vite React-TS con dependencias extra y limpiar boilerplate
- [ ] Configurar TailwindCSS e index.css con directivas
- [ ] Añadir `src/data/itinerary.json` y `src/store/useTripStore.ts` con persistencia
- [ ] Implementar componentes UI principales basados en la guía
- [ ] Crear páginas y rutas en App.tsx/main.tsx