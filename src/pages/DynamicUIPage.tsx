import { UIRenderer } from "../core/renderer/UIRenderer";

const blueprint = JSON.stringify({
  header: {
    type: "screen",
    title: "Counter Screen",
    className: "flex flex-col w-screen h-screen bg-amber-50",
  },
  detail: {
    children: [
      {
        type: "column",
        className: "flex flex-col items-center justify-center flex-1 gap-6",

        children: [
          {
            type: "text",
            id: "textView",
            text: "0",
            value: 0,
            className: "text-5xl font-bold text-black",
          },

          {
            type: "row",
            className: "flex gap-4",

            children: [
              {
                type: "button",
                id: "btnPlus",
                text: "+",
                className: "px-6 py-3 text-xl bg-black text-white rounded-lg",
              },

              {
                type: "button",
                id: "btnMinus",
                text: "-",
                className:
                  "px-6 py-3 text-xl bg-gray-400 text-white rounded-lg",
              },
            ],
          },
        ],
      },
    ],

    script: `
      const text  = fragment.inflate("textView");
      const plus  = fragment.inflate("btnPlus");
      const minus = fragment.inflate("btnMinus");

      plus.onClick(() => {
        const value = text.getValue();
        print(" on plus: ", value + 1);
        text.setValue(value + 1);
      });

      minus.onClick(() => {
        const value = text.getValue();
        print(" on minus: ", value - 1);
        text.setValue(value - 1);
      });
    `,
  },
});

export function DynamicUIPage() {
  return <UIRenderer blueprint={blueprint} />;
}
