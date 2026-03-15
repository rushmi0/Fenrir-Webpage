import { IPlugin } from "./IPlugin";
import { findNodeValue, updateNodeValue } from "../../core/ui-tree/treeUtils";
import { JsValue } from "../../core/ui-tree/types";

export const FragmentPlugin: IPlugin = {
  name: "fragment",

  install({ ctx, treeRef, setTree }) {

    function createComponentBinding(id: string) {
      const component = ctx.newObject();

      const getValue = ctx.newFunction("getValue", () => {
        const value: JsValue = findNodeValue(treeRef.current, id);

        if (typeof value === "number")  return ctx.newNumber(value);
        if (typeof value === "boolean") return value ? ctx.true : ctx.false;
        if (typeof value === "string")  return ctx.newString(value);
        return ctx.undefined;
      });

      const setValue = ctx.newFunction("setValue", (handle) => {
        const value = ctx.dump(handle);
        handle.dispose();

        setTree((prev) => {
          const updated = updateNodeValue(prev, id, value);
          treeRef.current = updated;
          return updated;
        });
      });

      const onClick = ctx.newFunction("onClick", (fnHandle) => {
        ctx.setProp(ctx.global, `__onClick_${id}`, fnHandle);
        fnHandle.dispose();
      });

      ctx.setProp(component, "getValue", getValue);
      ctx.setProp(component, "setValue", setValue);
      ctx.setProp(component, "onClick",  onClick);

      getValue.dispose();
      setValue.dispose();
      onClick.dispose();

      return component;
    }

    const fragmentObj = ctx.newObject();

    const inflate = ctx.newFunction("inflate", (idHandle) => {
      const id = ctx.dump(idHandle) as string;
      idHandle.dispose();
      return createComponentBinding(id);
    });

    ctx.setProp(fragmentObj, "inflate", inflate);
    ctx.setProp(ctx.global, "fragment", fragmentObj);

    inflate.dispose();
    fragmentObj.dispose();
  },
};