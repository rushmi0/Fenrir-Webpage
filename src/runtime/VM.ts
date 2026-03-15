import { useEffect, useRef, useCallback } from "react";
import { getQuickJS, QuickJSContext } from "quickjs-emscripten";
import React from "react";

import { RuntimeBlueprint, UINode } from "../core/ui-tree/types";

import { createHostBridge } from "./HostBridge";
import { DEFAULT_ENGINE_CONFIG, EngineConfig } from "./EngineConfig.ts";

type UseRuntimeOptions = {
  blueprint: RuntimeBlueprint;
  treeRef: React.RefObject<UINode>;
  setTree: React.Dispatch<React.SetStateAction<UINode>>;
  config?: EngineConfig;
};

export function VM({ blueprint, treeRef, setTree, config }: UseRuntimeOptions) {
  const ctxRef = useRef<QuickJSContext | null>(null);
  const aliveRef = useRef(false);

  const treeRefRef = useRef(treeRef);
  const setTreeRef = useRef(setTree);

  const configRef = useRef({
    ...DEFAULT_ENGINE_CONFIG,
    ...config,
  });

  useEffect(() => {
    treeRefRef.current = treeRef;
    setTreeRef.current = setTree;
    configRef.current = {
      ...DEFAULT_ENGINE_CONFIG,
      ...config,
    };
  });

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const QuickJS = await getQuickJS();
      if (!mounted) return;

      const ctx = QuickJS.newContext();

      ctxRef.current = ctx;
      aliveRef.current = true;

      const bridge = createHostBridge({
        ctx,
        treeRef: treeRefRef.current,
        setTree: setTreeRef.current,
        plugins: configRef.current.plugins,
      });

      bridge.installAll();

      const result = ctx.evalCode(blueprint.script);

      if (result.error) {
        console.error("[Runtime]", ctx.dump(result.error));
        result.error.dispose();
      } else {
        result.dispose();
      }
    };

    init().catch((err: unknown) => {
      console.error("[Runtime] init failed:", err);
    });

    return () => {
      mounted = false;
      aliveRef.current = false;
      ctxRef.current?.dispose();
      ctxRef.current = null;
    };
  }, [blueprint.script]);

  const triggerEvent = useCallback((id?: string) => {
    if (!id) return;

    if (!aliveRef.current || !ctxRef.current) {
      return;
    }

    const ctx = ctxRef.current;

    const result = ctx.evalCode(
      `(() => {
        const f = globalThis["__onClick_${id}"];
        if (f) f();
      })()`,
    );

    if (result.error) {
      console.error(ctx.dump(result.error));
      result.error.dispose();
    } else {
      result.dispose();
    }
  }, []);

  return { triggerEvent };
}
