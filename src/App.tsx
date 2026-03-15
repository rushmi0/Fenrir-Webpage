import { useRoutes, RouteObject, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { NotFoundPage } from "./pages/NotFound";
import { UIRenderer } from "./core/renderer/UIRenderer";
import { appBlueprint } from "./pages/DynamicUIPage";
import "./App.css";

const blueprintRoutes: RouteObject[] = appBlueprint.screens.map((screen) => ({
  path:    screen.header.path,
  element: (
      <UIRenderer
          key={screen.header.path}
          blueprint={JSON.stringify(screen)}
          appBlueprint={appBlueprint}
      />
  ),
}));

const routes: RouteObject[] = [
  { path: "/", element: <LandingPage /> },
  {
    path:    "/app",
    element: <Navigate to={appBlueprint.meta.initialPath} replace />,
  },
  ...blueprintRoutes,
  { path: "*", element: <NotFoundPage /> },
];

function App() {
  return useRoutes(routes);
}

export default App;
