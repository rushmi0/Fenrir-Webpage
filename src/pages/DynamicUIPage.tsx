import { AppBlueprint } from "../core/ui-tree/types";

export const appBlueprint: AppBlueprint = {
  application: [
    {
      header: {
        type: "screen",
        path: "/counter",
        title: "Counter",
        className: "flex flex-col w-screen h-screen bg-amber-50",
      },
      state: { count: 0 },
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
                    className:
                      "px-6 py-3 text-xl bg-black text-white rounded-lg",
                  },
                  {
                    type: "button",
                    id: "btnMinus",
                    text: "-",
                    className:
                      "px-6 py-3 text-xl bg-gray-400 text-white rounded-lg",
                  },
                  {
                    type: "button",
                    id: "btnGoDetail",
                    text: "view detail →",
                    className:
                      "px-6 py-3 text-xl bg-blue-600 text-white rounded-lg",
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
          const goBtn = fragment.inflate("btnGoDetail");

          plus.onClick(() => {
            const v = text.getValue();
            text.setValue(v + 1);
            state.set("count", v + 1);
            print("plus →", v + 1);
          });

          minus.onClick(() => {
            const v = text.getValue();
            text.setValue(v - 1);
            state.set("count", v - 1);
            print("minus →", v - 1);
          });

          goBtn.onClick(() => {
            const v = text.getValue();
            state.share("lastCount", v);
            router.push("/detail/42");
          });
        `,
      },
    },
    {
      header: {
        type: "screen",
        path: "/detail/:itemId",
        title: "Detail",
        className: "flex flex-col w-screen h-screen bg-white",
      },
      detail: {
        children: [
          {
            type: "column",
            className: "flex flex-col items-center justify-center flex-1 gap-6",
            children: [
              {
                type: "text",
                id: "titleText",
                text: "Loading...",
                className: "text-3xl font-bold text-black",
              },
              {
                type: "text",
                id: "sharedText",
                text: "-",
                className: "text-xl text-gray-500",
              },
              {
                type: "button",
                id: "btnBack",
                text: "← go back",
                className:
                  "px-6 py-3 text-xl bg-gray-800 text-white rounded-lg",
              },
            ],
          },
        ],
        script: `
          const title      = fragment.inflate("titleText");
          const sharedText = fragment.inflate("sharedText");
          const backBtn    = fragment.inflate("btnBack");

          const itemId = router.getParam("itemId");
          title.setValue("Item ID: " + itemId);

          const lastCount = state.getShared("lastCount");
          sharedText.setValue("Count ที่ส่งมา: " + lastCount);

          backBtn.onClick(() => {
            router.back();
          });
        `,
      },
    },
  ],
};
