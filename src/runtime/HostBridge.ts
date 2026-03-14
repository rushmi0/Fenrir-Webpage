import { QuickJSContext } from "quickjs-emscripten";
import React from "react";
import { UINode } from "../core/ui-tree/types";
import { IPlugin, HostBindingDeps } from "./plugins/IPlugin";
import { ConsolePlugin } from "./plugins/ConsolePlugin";
import { FragmentPlugin } from "./plugins/FragmentPlugin";
import { CameraPlugin } from "./plugins/CameraPlugin";

export const DEFAULT_PLUGINS: IPlugin[] = [
  ConsolePlugin,
  FragmentPlugin,
  CameraPlugin,
];

type HostBridgeOptions = {
  ctx: QuickJSContext;
  treeRef: React.RefObject<UINode>;
  setTree: React.Dispatch<React.SetStateAction<UINode>>;
  plugins?: IPlugin[];
};

export function createHostBridge({
  ctx,
  treeRef,
  setTree,
  plugins = DEFAULT_PLUGINS,
}: HostBridgeOptions) {
  const deps: HostBindingDeps = { ctx, treeRef, setTree };

  return {
    installAll() {
      plugins.forEach((plugin) => {
        plugin.install(deps);
      });
    },
  };
}