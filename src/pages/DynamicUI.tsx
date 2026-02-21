import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { getQuickJS, QuickJSContext } from "quickjs-emscripten";
import * as React from "react";

type NativeModule = (ctx: QuickJSContext) => void;

function registerModule(ctx: QuickJSContext) {
    const makeMethod = (method: keyof Console) =>
        ctx.newFunction(method, (...args) => {
            const values = args.map((h) => {
                const v = ctx.dump(h);
                h.dispose();
                return v;
            });

            (console[method] as (...args: unknown[]) => void)(...values);
        });

    const consoleObj = ctx.newObject();

    const log = makeMethod("log");
    const error = makeMethod("error");
    const warn = makeMethod("warn");

    ctx.setProp(consoleObj, "log", log);
    ctx.setProp(consoleObj, "error", error);
    ctx.setProp(consoleObj, "warn", warn);

    ctx.setProp(ctx.global, "console", consoleObj);

    log.dispose();
    error.dispose();
    warn.dispose();
    consoleObj.dispose();
}

const nativeModules: NativeModule[] = [registerModule];


type BaseNode = {
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
    bind: string;
};

type ButtonNode = BaseNode & {
    type: "button";
    text: string;
    onClick: string;
};

type UINode = ColumnNode | RowNode | TextNode | ButtonNode;

type UIConfig = ColumnNode & {
    logic: string;
};

function useQuickJS<TState extends Record<string, unknown>>(logic: string) {
    const ctxRef = useRef<QuickJSContext | null>(null);
    const [state, setState] = useState<TState | null>(null);

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            const QuickJS = await getQuickJS();
            if (!mounted) return;

            const ctx = QuickJS.newContext();
            ctxRef.current = ctx;

            nativeModules.forEach((register) => register(ctx));

            ctx.evalCode(logic);
            run("getState()");
        };

        init();

        return () => {
            mounted = false;
            ctxRef.current?.dispose();
        };
    }, [logic]);

    const run = (code: string) => {
        const ctx = ctxRef.current;
        if (!ctx) return;

        const result = ctx.evalCode(code);

        if (result.error) {
            console.error(ctx.dump(result.error));
            result.error.dispose();
            return;
        }

        const value = ctx.dump(result.value) as TState;
        result.value.dispose();

        setState(value);
    };

    return { state, run };
}


type RenderProps = {
    blueprint: string;
};

function RenderUI({ blueprint }: RenderProps) {
    const parsed: UIConfig = useMemo(() => JSON.parse(blueprint), [blueprint]);
    const { state, run } = useQuickJS<Record<string, unknown>>(parsed.logic);

    const renderNode = (node: UINode, key: number): JSX.Element => {
        switch (node.type) {
            case "column":
                return (
                    <div
                        key={key}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            ...node.style,
                        }}
                    >
                        {node.children.map((child, index) =>
                            renderNode(child, index)
                        )}
                    </div>
                );

            case "row":
                return (
                    <div
                        key={key}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            ...node.style,
                        }}
                    >
                        {node.children.map((child, index) =>
                            renderNode(child, index)
                        )}
                    </div>
                );

            case "text":
                return (
                    <div key={key} style={node.style}>
                        {state ? String(state[node.bind] ?? "") : ""}
                    </div>
                );

            case "button":
                return (
                    <button
                        key={key}
                        onClick={() => run(node.onClick)}
                        style={node.style}
                    >
                        {node.text}
                    </button>
                );
        }
    };

    return renderNode(parsed, 0);
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
        background: "#935cd1",
    },
    children: [
        {
            type: "text",
            bind: "counter",
            style: {
                fontSize: 64,
                fontWeight: "bold",
                color: "white",
            },
        },
        {
            type: "row",
            style: {
                gap: 16,
            },
            children: [
                {
                    type: "button",
                    text: "+",
                    onClick: "increment()",
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
                    text: "-",
                    onClick: "decrement()",
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
      globalThis.state = { counter: 0 };

      globalThis.increment = function() {
        state.counter += 1;
        console.log("counter =", state.counter);
        return state;
      }

      globalThis.decrement = function() {
        state.counter -= 1;
        console.warn("counter =", state.counter);
        return state;
      }

      globalThis.getState = function() {
        return state;
      }
    `,
});

export const DynamicUI = () => {
    return <RenderUI blueprint={blueprint} />;
};