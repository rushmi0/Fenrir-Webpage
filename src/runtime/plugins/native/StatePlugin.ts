import React from "react";
import { QuickJSContext } from "quickjs-emscripten";
import { JsValue, ScreenState } from "../../../core/ui-tree/types.ts";
import { IPlugin } from "../IPlugin.ts";
import { ViewModelStore } from "../../ViewModelStore.ts";

function jsValueToHandle(ctx: QuickJSContext, value: JsValue) {
  if (typeof value === "number") return ctx.newNumber(value);
  if (typeof value === "boolean") return value ? ctx.true : ctx.false;
  if (typeof value === "string") return ctx.newString(value);
  return ctx.null;
}

export type SharedStateStore = {
  get: (key: string) => JsValue;
  set: (key: string, value: JsValue) => void;
};

export type StatePluginDeps = {
  screenPath: string;
  localState: React.RefObject<ScreenState>;
  setLocalState: (updater: (prev: ScreenState) => ScreenState) => void;
  sharedStore: SharedStateStore;
};

export function createStatePlugin(deps: StatePluginDeps): IPlugin {
  return {
    name: "state",

    install({ ctx }) {
      const obj = ctx.newObject();

      const get = ctx.newFunction("get", (keyHandle) => {
        const key = ctx.dump(keyHandle) as string;
        keyHandle.dispose();
        const value = deps.localState.current[key];
        return jsValueToHandle(ctx, value);
      });

      const set = ctx.newFunction("set", (keyHandle, valueHandle) => {
        const key = ctx.dump(keyHandle) as string;
        const value = ctx.dump(valueHandle) as JsValue;
        keyHandle.dispose();
        valueHandle.dispose();

        deps.setLocalState((prev) => ({ ...prev, [key]: value }));
        deps.localState.current = { ...deps.localState.current, [key]: value };
      });

      const share = ctx.newFunction("share", (keyHandle, valueHandle) => {
        const key = ctx.dump(keyHandle) as string;
        const value = ctx.dump(valueHandle) as JsValue;
        keyHandle.dispose();
        valueHandle.dispose();
        deps.sharedStore.set(key, value);
      });

      const getShared = ctx.newFunction("getShared", (keyHandle) => {
        const key = ctx.dump(keyHandle) as string;
        keyHandle.dispose();
        return jsValueToHandle(ctx, deps.sharedStore.get(key));
      });

      const viewmodelObj = ctx.newObject();

      // viewmodel.setActive(0 | 1)
      const setActive = ctx.newFunction("setActive", (flagHandle) => {
        const flag = ctx.dump(flagHandle) as 0 | 1;
        flagHandle.dispose();
        ViewModelStore.setActive(deps.screenPath, flag);
      });

      // viewmodel.getFromScreen("/counter", "count")
      const getFromScreen = ctx.newFunction(
        "getFromScreen",
        (pathHandle, keyHandle) => {
          const path = ctx.dump(pathHandle) as string;
          const key = ctx.dump(keyHandle) as string;
          pathHandle.dispose();
          keyHandle.dispose();

          const vm = ViewModelStore.get(path);
          if (!vm) return ctx.null;
          return jsValueToHandle(ctx, vm.screenState[key]);
        },
      );

      ctx.setProp(viewmodelObj, "setActive", setActive);
      ctx.setProp(viewmodelObj, "getFromScreen", getFromScreen);

      setActive.dispose();
      getFromScreen.dispose();

      ctx.setProp(obj, "get", get);
      ctx.setProp(obj, "set", set);
      ctx.setProp(obj, "share", share);
      ctx.setProp(obj, "getShared", getShared);
      ctx.setProp(obj, "viewmodel", viewmodelObj);
      ctx.setProp(ctx.global, "state", obj);

      get.dispose();
      set.dispose();
      share.dispose();
      getShared.dispose();
      viewmodelObj.dispose();
      obj.dispose();
    },
  };
}
