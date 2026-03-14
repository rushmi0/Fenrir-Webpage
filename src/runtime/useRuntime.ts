import { useEffect, useRef } from "react";
import { getQuickJS, QuickJSContext } from "quickjs-emscripten";
import React from "react";
import { Blueprint, UINode } from "../core/ui-tree/types";
import { createHostBridge, DEFAULT_PLUGINS } from "./HostBridge";
import { IPlugin } from "./plugins/IPlugin";

type UseRuntimeOptions = {
  blueprint: Blueprint;
  treeRef: React.RefObject<UINode>;
  setTree: React.Dispatch<React.SetStateAction<UINode>>;
  plugins?: IPlugin[];
};

export function useRuntime({
  blueprint,
  treeRef,
  setTree,
  plugins = DEFAULT_PLUGINS,
}: UseRuntimeOptions) {
  const ctxRef = useRef<QuickJSContext | null>(null);

  const treeRefRef = useRef(treeRef);
  const setTreeRef = useRef(setTree);
  const pluginsRef = useRef(plugins);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const QuickJS = await getQuickJS();
      if (!mounted) return;

      const ctx = QuickJS.newContext();
      ctxRef.current = ctx;

      const bridge = createHostBridge({
        ctx,
        treeRef: treeRefRef.current,
        setTree: setTreeRef.current,
        plugins: pluginsRef.current,
      });

      bridge.installAll();

      const result = ctx.evalCode(blueprint.script);

      if (result.error) {
        console.error("[Runtime]", ctx.dump(result.error));
        result.error.dispose();
      }

      result.dispose();
    };

    init();

    return () => {
      mounted = false;
      ctxRef.current?.dispose();
      ctxRef.current = null;
    };
  }, [blueprint.script]);

  function triggerEvent(id?: string) {
    const ctx = ctxRef.current;

    if (!ctx) return;

    try {
      const result = ctx.evalCode(`
        (() => {
          const f = globalThis["__onClick_${id}"];
          if (f) f();
        })();
      `);

      if (result.error) {
        console.error("[Runtime trigger]", ctx.dump(result.error));
        result.error.dispose();
      }

      result.dispose();
    } catch (e) {
      console.error("Runtime dead", e);
    }
  }

  return { triggerEvent };
}
