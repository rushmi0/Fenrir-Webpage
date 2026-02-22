import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { getQuickJS, QuickJSContext } from "quickjs-emscripten";
import * as React from "react";

type JsValue = string | number | boolean | null | undefined;

type BaseNode = {
  id?: string;
  style?: React.CSSProperties;
};

type ColumnNode = BaseNode & {
  type: "column";
  children: UINode[];
};

type RowNode = BaseNode & {
  type: "row";
  children: UINode[];
};

type TextNode = BaseNode & {
  type: "text";
  text: string;
  value?: JsValue;
};

type ButtonNode = BaseNode & {
  type: "button";
  text: string;
};

type UINode = ColumnNode | RowNode | TextNode | ButtonNode;

type UIConfig = ColumnNode & {
  logic: string;
};

function updateValue(node: UINode, id: string, value: JsValue): UINode {
  if (node.id === id && node.type === "text") {
    return {
      ...node,
      value,
      text: String(value),
    };
  }

  if (node.type === "column" || node.type === "row") {
    return {
      ...node,
      children: node.children.map((c) => updateValue(c, id, value)),
    };
  }

  return node;
}

function findValue(node: UINode, id: string): JsValue {
  if (node.id === id && node.type === "text") {
    return node.value;
  }

  if (node.type === "column" || node.type === "row") {
    for (const c of node.children) {
      const result = findValue(c, id);
      if (result !== undefined) return result;
    }
  }

  return undefined;
}

type NativeDeps = {
  ctx: QuickJSContext;
  treeRef: React.MutableRefObject<UINode>;
  setTree: React.Dispatch<React.SetStateAction<UINode>>;
};

function createNativeModule({ ctx, treeRef, setTree }: NativeDeps) {
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

      if (typeof value === "number") {
        return ctx.newNumber(value);
      }

      if (typeof value === "boolean") {
        return ctx.newNumber(value ? 1 : 0);
      }

      if (typeof value === "string") {
        return ctx.newString(value);
      }

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
    registerModule() {
      registerConsole();
      registerUI();
    },
  };
}

function useQuickJSUI(
  blueprint: UIConfig,
  treeRef: React.MutableRefObject<UINode>,
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

      native.registerModule();
      ctx.evalCode(blueprint.logic);
    };

    init();

    return () => {
      mounted = false;
      ctxRef.current?.dispose();
    };
  }, [blueprint.logic, setTree, treeRef]);

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

function RenderUI({ blueprint }: { blueprint: string }) {
  const parsed: UIConfig = useMemo(() => JSON.parse(blueprint), [blueprint]);
  const [tree, setTree] = useState<UINode>(parsed);
  const treeRef = useRef<UINode>(tree);

  useEffect(() => {
    treeRef.current = tree;
  }, [tree]);

  const { trigger } = useQuickJSUI(parsed, treeRef, setTree);

  const renderNode = (node: UINode, key: number): JSX.Element => {
    switch (node.type) {
      case "column":
        return (
          <div
            key={key}
            style={{ display: "flex", flexDirection: "column", ...node.style }}
          >
            {node.children.map((c, i) => renderNode(c, i))}
          </div>
        );
      case "row":
        return (
          <div
            key={key}
            style={{ display: "flex", flexDirection: "row", ...node.style }}
          >
            {node.children.map((c, i) => renderNode(c, i))}
          </div>
        );
      case "text":
        return (
          <div key={key} style={node.style}>
            {node.text}
          </div>
        );
      case "button":
        return (
          <button key={key} style={node.style} onClick={() => trigger(node.id)}>
            {node.text}
          </button>
        );
    }
  };

  return renderNode(tree, 0);
}

const blueprint = JSON.stringify({
  type: "column",
  style: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    fontFamily: "sans-serif",
    background: "#fdf6e9",
  },
  children: [
    {
      type: "text",
      id: "textView",
      text: "0",
      value: 0,
      style: {
        fontSize: 64,
        fontWeight: "bold",
        color: "#222",
      },
    },
    {
      type: "row",
      style: { gap: 16 },
      children: [
        {
          type: "button",
          id: "btnPlus",
          text: "+",
          style: {
            padding: "12px 24px",
            fontSize: 20,
            borderRadius: 8,
            background: "#222",
            color: "white",
            border: "none",
            cursor: "pointer",
          },
        },
        {
          type: "button",
          id: "btnMinus",
          text: "-",
          style: {
            padding: "12px 24px",
            fontSize: 20,
            borderRadius: 8,
            background: "#999",
            color: "white",
            border: "none",
            cursor: "pointer",
          },
        },
      ],
    },
  ],
  logic: `
        const text = fragment.inflate("textView");
        const plus = fragment.inflate("btnPlus");
        const minus = fragment.inflate("btnMinus");

        plus.onClick(() => {
          const value = text.getValue();
          console.log("on plus", value);
          text.setValue(value + 1);
        });

        minus.onClick(() => {
          const value = text.getValue();
          console.log("on minus", value);
          text.setValue(value - 1);
        });
  `,
});

export const DynamicUI = () => {
  return <RenderUI blueprint={blueprint} />;
};
