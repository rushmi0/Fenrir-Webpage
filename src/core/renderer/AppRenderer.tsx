import { useMemo } from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import { AppBlueprint, ScreenBlueprint } from "../ui-tree/types";
import { UIRenderer } from "./UIRenderer";

export function AppRenderer({ blueprint }: { blueprint: AppBlueprint }) {
  const routes: RouteObject[] = useMemo(
    () => [
      {
        index: true,
        element: <Navigate to={blueprint.meta.initialPath} replace />,
      },
      ...blueprint.screens.map(
        (screen: ScreenBlueprint): RouteObject => ({
          path: screen.header.path,
          element: (
            <UIRenderer
              key={screen.header.path}
              blueprint={JSON.stringify(screen)}
              appBlueprint={blueprint}
            />
          ),
        }),
      ),
    ],
    [blueprint],
  );

  return useRoutes(routes);
}
