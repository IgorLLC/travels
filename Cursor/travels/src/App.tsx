import {
  NavLink,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import { Home } from "@/pages/Home";
import { Itinerary } from "@/pages/Itinerary";
import { MapView } from "@/pages/Map";
import { Settings } from "@/pages/Settings";
import { useTripStore } from "@/store/useTripStore";
import { formatDate } from "@/lib/format";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "itinerary", element: <Itinerary /> },
      { path: "map", element: <MapView /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

const tabs = [
  { path: "/", label: "Inicio" },
  { path: "/itinerary", label: "Itinerario" },
  { path: "/map", label: "Mapa" },
  { path: "/settings", label: "Ajustes" },
];

function Layout() {
  const { details } = useTripStore();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-violet-500">
              {details.trip.city}
            </p>
            <h1 className="text-lg font-semibold text-slate-900">
              {formatDate(details.trip.dates.start, "d MMM")} —
              {" "}
              {formatDate(details.trip.dates.end, "d MMM yyyy")}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Hotel</p>
            <p className="text-sm font-medium text-slate-700">{details.hotel.name}</p>
          </div>
        </div>
        <nav className="mx-auto flex max-w-4xl gap-2 px-4 pb-3">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const baseClass = "flex-1 rounded-full px-4 py-2 text-center text-sm font-medium transition";
            return (
              <NavLink
                end={tab.path === "/"}
                key={tab.path}
                to={tab.path}
                className={
                  isActive
                    ? `${baseClass} bg-violet-100 text-violet-700`
                    : `${baseClass} text-slate-500 hover:bg-slate-100`
                }
              >
                {tab.label}
              </NavLink>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

