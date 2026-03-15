import { useRoutes, RouteObject } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { NotFoundPage } from "./pages/NotFound";
import { UIRenderer } from "./core/renderer/UIRenderer";
import {ScreenBlueprint} from "./core/ui-tree/types.ts";
import { appBlueprint } from "./pages/DynamicUIPage";
import "./App.css";
import HomePage from "./pages/HomePage.tsx";


const dynamicRoutes: RouteObject[] = appBlueprint.application.map((screen : ScreenBlueprint) => ({
  path: screen.header.path,
  element: (
    <UIRenderer
      key={screen.header.path}
      blueprint={JSON.stringify(screen)}
    />
  ),
}));

const routes: RouteObject[] = [
  { path: "/",  element: <LandingPage /> },
  { path: "/home", element: <HomePage/> },
  ...dynamicRoutes,
  { path: "*",  element: <NotFoundPage /> },
];

function App() {
  return useRoutes(routes);
}

export default App;