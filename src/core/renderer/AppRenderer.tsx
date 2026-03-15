import { useMemo } from "react";
import { RouteObject, useRoutes } from "react-router-dom";

import {
  AppBlueprint,
  ScreenBlueprint,
} from "../ui-tree/types";

import { UIRenderer } from "./UIRenderer";


type AppRendererProps = {
  blueprint: AppBlueprint;
};


export function AppRenderer({
  blueprint,
}: AppRendererProps) {

  const routes: RouteObject[] = useMemo(() => {

    return blueprint.application.map(
      (screen: ScreenBlueprint): RouteObject => ({
        path: screen.header.path,
        element: (
          <UIRenderer
            blueprint={JSON.stringify(screen)}
          />
        ),
      }),
    );

  }, [blueprint]);


  return useRoutes(routes);
}