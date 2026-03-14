import { RouteObject } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { DynamicUIPage } from "./pages/DynamicUIPage";
import { NotFoundPage } from "./pages/NotFound";

export const routes: RouteObject[] = [
  { path: "/", element: <LandingPage /> },
  { path: "/home", element: <DynamicUIPage /> },
  { path: "*", element: <NotFoundPage /> },
];
