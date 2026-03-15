import { JsValue } from "../core/ui-tree/types";
import { SharedStateStore } from "./plugins/native/StatePlugin.ts";

const cache: Record<string, JsValue> = {};

export const screenCache: SharedStateStore = {
  get: (key) => cache[key],
  set: (key, value) => {
    cache[key] = value;
  },
};
