import { RenderUI } from "../dynamic-ui/ui-engine/RenderUI.tsx";

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
          console.log("on plus value", value);
          text.setValue(value + 1);
        });

        minus.onClick(() => {
          const value = text.getValue();
          console.log("on minus value", value);
          text.setValue(value - 1);
        });
  `,
});

export const DynamicUI = () => {
  return <RenderUI blueprint={blueprint} />;
};
