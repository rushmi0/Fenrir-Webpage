import { RouteObject } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { NotFoundPage } from "./pages/NotFound";

// ── static routes ──
export const staticRoutes: RouteObject[] = [
  { path: "/",    element: <LandingPage /> },
  { path: "*",    element: <NotFoundPage /> },
];