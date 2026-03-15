import { QuickJSContext } from "quickjs-emscripten";
import React from "react";
import { UINode } from "../core/ui-tree/types";
import { IPlugin, HostBindingDeps } from "./plugins/IPlugin";
import { ConsolePlugin } from "./plugins/native/ConsolePlugin.ts";
import { FragmentPlugin } from "./plugins/native/FragmentPlugin.ts";
import { CameraPlugin } from "./plugins/native/CameraPlugin.ts";
import { PrintPlugin } from "./plugins/native/PrintPlugin.ts";


export type RuntimeEngineConfig = {
  plugins?: IPlugin[];
  debug?: boolean;
  onScriptError?: "throw" | "warn" | "silent";
};

export const DEFAULT_PLUGINS: IPlugin[] = [
  PrintPlugin,
  ConsolePlugin,
  FragmentPlugin,
  CameraPlugin,
];

export const DEFAULT_ENGINE_CONFIG: Required<RuntimeEngineConfig> = {
  plugins: DEFAULT_PLUGINS,
  debug: false,
  onScriptError: "warn",
};

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
      plugins.forEach((plugin) => plugin.install(deps));
    },
  };
}