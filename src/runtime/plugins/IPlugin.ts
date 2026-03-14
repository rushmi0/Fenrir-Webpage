import { QuickJSContext } from "quickjs-emscripten";
import React from "react";
import { UINode } from "../../core/ui-tree/types";

export type HostBindingDeps = {
  ctx: QuickJSContext;
  treeRef: React.RefObject<UINode>;
  setTree: React.Dispatch<React.SetStateAction<UINode>>;
};

export interface IPlugin {
  readonly name: string;
  install(deps: HostBindingDeps): void;
}