import { AppBlueprint } from "../core/ui-tree/types";

export const appBlueprint: AppBlueprint = {
    meta: {
        appId:       "com.fenrir.demo",
        appName:     "Fenrir Demo",
        version:     "1.0.0",
        initialPath: "/counter",
        paths:       ["/counter", "/detail/:itemId"],
        author:      "milko",
        description: "Low-code platform demo",
    },

    assets: {
        btnPrimary: {
            assetId:   "btnPrimary",
            type:      "button",
            text:      "",
            className: "px-6 py-3 text-xl bg-black text-white rounded-lg",
        },
        btnSecondary: {
            assetId:   "btnSecondary",
            type:      "button",
            text:      "",
            className: "px-6 py-3 text-xl bg-gray-400 text-white rounded-lg",
        },
        btnBlue: {
            assetId:   "btnBlue",
            type:      "button",
            text:      "",
            className: "px-6 py-3 text-xl bg-blue-600 text-white rounded-lg",
        },
        headingText: {
            assetId:   "headingText",
            type:      "text",
            text:      "",
            className: "text-xl font-bold text-black",
        },
    },

    layoutList: {
        // scaffold: topBar + body(flex-1) + bottomBar
        // className ทุกอย่างกำหนดใน Blueprint ไม่มี hardcode ที่ host
        "scaffold-amber": {
            layoutId:    "scaffold-amber",
            description: "scaffold with amber bars",
            layout: {
                className: "flex flex-col w-full h-full",
                slots: [
                    {
                        slotId:    "topBar",
                        className: "w-full px-6 py-4 bg-amber-100 flex items-center shrink-0",
                        children:  [],
                    },
                    {
                        slotId:    "body",
                        className: "flex flex-col items-center justify-center flex-1 gap-6 overflow-auto",
                        children:  [],
                    },
                    {
                        slotId:    "bottomBar",
                        className: "w-full px-6 py-4 bg-amber-100 flex justify-end gap-4 shrink-0",
                        children:  [],
                    },
                ],
            },
        },

        // sidebar-left: sidebar(fixed width) + main(flex-1)
        "sidebar-detail": {
            layoutId:    "sidebar-detail",
            description: "sidebar left + main content",
            layout: {
                className: "flex flex-row w-full h-full",
                slots: [
                    {
                        slotId:    "sidebar",
                        className: "w-48 h-full bg-gray-100 flex flex-col gap-3 p-4 shrink-0",
                        children:  [],
                    },
                    {
                        slotId:    "main",
                        className: "flex-1 flex flex-col items-center justify-center gap-6 p-8 overflow-auto",
                        children:  [],
                    },
                ],
            },
        },
    },

    screens: [
        {
            header: {
                type:      "screen",
                path:      "/counter",
                title:     "Counter",
                className: "flex flex-col w-screen h-screen bg-amber-50",
            },
            properties: {
                count: { type: "number", defaultValue: 0, description: "counter value" },
            },
            detail: {
                layoutId: "scaffold-amber",
                slotOverrides: [
                    {
                        slotId:   "topBar",
                        children: [
                            { type: "asset", assetId: "headingText", overrides: { text: "Counter App" } },
                        ],
                    },
                    {
                        slotId:   "body",
                        children: [
                            {
                                type:      "text",
                                id:        "textView",
                                text:      "0",
                                value:     0,
                                className: "text-5xl font-bold text-black",
                            },
                            {
                                type:      "row",
                                className: "flex gap-4",
                                children: [
                                    { type: "asset", assetId: "btnPrimary",   id: "btnPlus",  overrides: { text: "+" } },
                                    { type: "asset", assetId: "btnSecondary", id: "btnMinus", overrides: { text: "-" } },
                                ],
                            },
                        ],
                    },
                    {
                        slotId:   "bottomBar",
                        children: [
                            { type: "asset", assetId: "btnBlue", id: "btnGoDetail", overrides: { text: "view detail →" } },
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
                    state.share("lastCount", text.getValue());
                    router.push("/detail/42");
                  });
                `,
            },
        },

        {
            header: {
                type:      "screen",
                path:      "/detail/:itemId",
                title:     "Detail",
                className: "flex flex-col w-screen h-screen bg-white",
            },
            properties: {
                itemId:    { type: "string", defaultValue: "",  description: "item id from URL" },
                lastCount: { type: "number", defaultValue: 0,   description: "count from counter screen" },
            },
            detail: {
                layoutId: "sidebar-detail",
                slotOverrides: [
                    {
                        slotId:   "sidebar",
                        children: [
                            {
                                type:      "asset",
                                assetId:   "headingText",
                                overrides: { text: "Navigation" },
                                className: "text-sm font-bold text-gray-500 uppercase",
                            },
                            {
                                type:      "asset",
                                assetId:   "btnPrimary",
                                id:        "btnBack",
                                overrides: { text: "← go back" },
                                className: "w-full px-4 py-2 bg-gray-800 text-white rounded-lg text-sm",
                            },
                        ],
                    },
                    {
                        slotId:   "main",
                        children: [
                            { type: "text", id: "titleText",  text: "Loading...", className: "text-3xl font-bold text-black" },
                            { type: "text", id: "sharedText", text: "-",          className: "text-xl text-gray-500" },
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
                  sharedText.setValue("Count: " + lastCount);
        
                  backBtn.onClick(() => { router.back(); });
                `,
            },
        },
    ],
};