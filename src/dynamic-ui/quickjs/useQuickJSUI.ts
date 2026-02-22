import { useEffect, useRef } from "react";
import { getQuickJS, QuickJSContext } from "quickjs-emscripten";
import { UIConfig, UINode } from "../ui-engine/types";
import { createNativeModule } from "./nativeModule";

export function useQuickJSUI(
  blueprint: UIConfig,
  treeRef: React.RefObject<UINode>,
  setTree: React.Dispatch<React.SetStateAction<UINode>>,
) {
  const ctxRef = useRef<QuickJSContext | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const QuickJS = await getQuickJS();
      if (!mounted) return;

      const ctx = QuickJS.newContext();
      ctxRef.current = ctx;

      const native = createNativeModule({
        ctx,
        treeRef,
        setTree,
      });

      native.register();

      const result = ctx.evalCode(blueprint.logic);

      if (result.error) {
        console.error(ctx.dump(result.error));
        result.error.dispose();
      }

      result.dispose();
    };

    init();

    return () => {
      mounted = false;
      ctxRef.current?.dispose();
    };
  }, [blueprint.logic]);

  const trigger = (id?: string) => {
    if (!id) return;
    const ctx = ctxRef.current;
    if (!ctx) return;

    const fnName = "__fn_" + id;
    const result = ctx.evalCode(`${fnName} && ${fnName}()`);

    if (result.error) {
      console.error(ctx.dump(result.error));
      result.error.dispose();
    }

    result.dispose();
  };

  return { trigger };
}
