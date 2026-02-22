import { QuickJSContext } from "quickjs-emscripten";
import { findValue, updateValue } from "../ui-engine/treeUtils";
import { UINode } from "../ui-engine/types";
import React from "react";

type NativeDeps = {
  ctx: QuickJSContext;
  treeRef: React.RefObject<UINode>;
  setTree: React.Dispatch<React.SetStateAction<UINode>>;
};

export function createNativeModule({ ctx, treeRef, setTree }: NativeDeps) {
  function registerConsole() {
    const consoleObj = ctx.newObject();

    const log = ctx.newFunction("log", (...args) => {
      const values = args.map((h) => {
        const v = ctx.dump(h);
        h.dispose();
        return v;
      });
      console.log(...values);
    });

    ctx.setProp(consoleObj, "log", log);
    ctx.setProp(ctx.global, "console", consoleObj);

    log.dispose();
    consoleObj.dispose();
  }

  function createComponent(id: string) {
    const component = ctx.newObject();

    const getValue = ctx.newFunction("getValue", () => {
      const value = findValue(treeRef.current, id);

      if (typeof value === "number") return ctx.newNumber(value);
      if (typeof value === "boolean") return value ? ctx.true : ctx.false;
      if (typeof value === "string") return ctx.newString(value);

      return ctx.undefined;
    });

    const setValue = ctx.newFunction("setValue", (handle) => {
      const value = ctx.dump(handle);
      handle.dispose();

      setTree((prev) => {
        const updated = updateValue(prev, id, value);
        treeRef.current = updated;
        return updated;
      });
    });

    const onClick = ctx.newFunction("onClick", (fnHandle) => {
      const fnName = "__fn_" + id;
      ctx.setProp(ctx.global, fnName, fnHandle);
      fnHandle.dispose();
    });

    ctx.setProp(component, "getValue", getValue);
    ctx.setProp(component, "setValue", setValue);
    ctx.setProp(component, "onClick", onClick);

    getValue.dispose();
    setValue.dispose();
    onClick.dispose();

    return component;
  }

  function registerUI() {
    const uiObj = ctx.newObject();

    const inflate = ctx.newFunction("inflate", (idHandle) => {
      const id = ctx.dump(idHandle) as string;
      idHandle.dispose();
      return createComponent(id);
    });

    ctx.setProp(uiObj, "inflate", inflate);
    ctx.setProp(ctx.global, "fragment", uiObj);

    inflate.dispose();
    uiObj.dispose();
  }

  return {
    register() {
      registerConsole();
      registerUI();
    },
  };
}
