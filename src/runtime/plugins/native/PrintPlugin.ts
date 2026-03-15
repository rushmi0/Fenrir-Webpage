import {
  QuickJSContext,
  QuickJSHandle,
} from "quickjs-emscripten";
import { IPlugin } from "../IPlugin.ts";


export const PrintPlugin: IPlugin = {
  name: "print",

  install({ ctx }: { ctx: QuickJSContext }) {

    function dumpArgs(
      ctx: QuickJSContext,
      args: QuickJSHandle[]
    ): unknown[] {

      const values: unknown[] = [];

      for (const h of args) {
        const v = ctx.dump(h);
        h.dispose();
        values.push(v);
      }

      return values;
    }


    const printFn = ctx.newFunction(
      "print",
      (...args: QuickJSHandle[]) => {

        const values = dumpArgs(ctx, args);

        console.log(...values);

      }
    );


    const printlnFn = ctx.newFunction(
      "println",
      (...args: QuickJSHandle[]) => {

        const values = dumpArgs(ctx, args);

        console.log(...values, "\n");

      }
    );


    ctx.setProp(ctx.global, "print", printFn);
    ctx.setProp(ctx.global, "println", printlnFn);


    printFn.dispose();
    printlnFn.dispose();
  },
};