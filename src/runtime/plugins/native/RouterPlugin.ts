import { IPlugin } from "../IPlugin.ts";

export type RouterPluginDeps = {
  navigate: (path: string, options?: { replace?: boolean }) => void;
  getParams: () => Record<string, string>;
  getSearchParams: () => Record<string, string>;
};

export function createRouterPlugin(routerDeps: RouterPluginDeps): IPlugin {
  return {
    name: "router",

    install({ ctx }) {
      const obj = ctx.newObject();

      // router.push("/path")
      const push = ctx.newFunction("push", (pathHandle) => {
        const path = ctx.dump(pathHandle) as string;
        pathHandle.dispose();
        routerDeps.navigate(path);
      });

      // router.replace("/path")
      const replace = ctx.newFunction("replace", (pathHandle) => {
        const path = ctx.dump(pathHandle) as string;
        pathHandle.dispose();
        routerDeps.navigate(path, { replace: true });
      });

      // router.back()
      const back = ctx.newFunction("back", () => {
        routerDeps.navigate(-1 as unknown as string);
      });

      // router.getParam("id") → string | undefined
      const getParam = ctx.newFunction("getParam", (keyHandle) => {
        const key = ctx.dump(keyHandle) as string;
        keyHandle.dispose();
        const value = routerDeps.getParams()[key];
        return value !== undefined ? ctx.newString(value) : ctx.undefined;
      });

      // router.getSearchParam("tab") → string | undefined
      const getSearchParam = ctx.newFunction("getSearchParam", (keyHandle) => {
        const key = ctx.dump(keyHandle) as string;
        keyHandle.dispose();
        const value = routerDeps.getSearchParams()[key];
        return value !== undefined ? ctx.newString(value) : ctx.undefined;
      });

      ctx.setProp(obj, "push", push);
      ctx.setProp(obj, "replace", replace);
      ctx.setProp(obj, "back", back);
      ctx.setProp(obj, "getParam", getParam);
      ctx.setProp(obj, "getSearchParam", getSearchParam);
      ctx.setProp(ctx.global, "router", obj);

      push.dispose();
      replace.dispose();
      back.dispose();
      getParam.dispose();
      getSearchParam.dispose();
      obj.dispose();
    },
  };
}
