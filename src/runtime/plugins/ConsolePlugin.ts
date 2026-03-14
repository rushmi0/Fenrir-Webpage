import { IPlugin } from "./IPlugin";

export const ConsolePlugin: IPlugin = {
  name: "console",

  install({ ctx }) {
    const obj = ctx.newObject();

    const log = ctx.newFunction("log", (...args) => {
      const values = args.map((h) => {
        const v = ctx.dump(h);
        h.dispose();
        return v;
      });
      console.log("[INFO]", ...values);
    });

    const warn = ctx.newFunction("warn", (...args) => {
      const values = args.map((h) => {
        const v = ctx.dump(h);
        h.dispose();
        return v;
      });
      console.warn("[WARN]", ...values);
    });

    const error = ctx.newFunction("error", (...args) => {
      const values = args.map((h) => {
        const v = ctx.dump(h);
        h.dispose();
        return v;
      });
      console.error("[ERROR]", ...values);
    });

    ctx.setProp(obj, "log", log);
    ctx.setProp(obj, "warn", warn);
    ctx.setProp(obj, "error", error);
    ctx.setProp(ctx.global, "console", obj);

    log.dispose();
    warn.dispose();
    error.dispose();
    obj.dispose();
  },
};
