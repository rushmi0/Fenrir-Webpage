import { AppBlueprint } from "../core/ui-tree/types";

export const appBlueprint: AppBlueprint = {
  meta: {
    appId: "com.fenrir.demo",
    appName: "Fenrir Demo",
    version: "1.0.0",
    initialPath: "/counter",
    paths: ["/counter", "/detail/:itemId", "/camera", "/gallery"],
    author: "milko",
    description: "Low-code platform demo",
  },

  assets: {
    btnPrimary: {
      assetId: "btnPrimary",
      type: "button",
      text: "",
      className: "px-6 py-3 text-xl bg-black text-white rounded-lg",
    },
    btnSecondary: {
      assetId: "btnSecondary",
      type: "button",
      text: "",
      className: "px-6 py-3 text-xl bg-gray-400 text-white rounded-lg",
    },
    btnBlue: {
      assetId: "btnBlue",
      type: "button",
      text: "",
      className: "px-6 py-3 text-xl bg-blue-600 text-white rounded-lg",
    },
    headingText: {
      assetId: "headingText",
      type: "text",
      text: "",
      className: "text-xl font-bold text-black",
    },
  },

  layoutList: {
    "scaffold-amber": {
      layoutId: "scaffold-amber",
      description: "scaffold with amber bars",
      layout: {
        className: "flex flex-col w-full h-full",
        slots: [
          {
            slotId: "topBar",
            className:
              "w-full px-6 py-4 bg-amber-100 flex items-center shrink-0",
            children: [],
          },
          {
            slotId: "body",
            className:
              "flex flex-col items-center justify-center flex-1 gap-6 overflow-auto",
            children: [],
          },
          {
            slotId: "bottomBar",
            className:
              "w-full px-6 py-4 bg-amber-100 flex justify-end gap-4 shrink-0",
            children: [],
          },
        ],
      },
    },

    "sidebar-detail": {
      layoutId: "sidebar-detail",
      description: "sidebar left + main content",
      layout: {
        className: "flex flex-row w-full h-full",
        slots: [
          {
            slotId: "sidebar",
            className:
              "w-48 h-full bg-gray-100 flex flex-col gap-3 p-4 shrink-0",
            children: [],
          },
          {
            slotId: "main",
            className:
              "flex-1 flex flex-col items-center justify-center gap-6 p-8 overflow-auto",
            children: [],
          },
        ],
      },
    },

    "camera-layout": {
      layoutId: "camera-layout",
      description: "fullscreen camera with overlay controls",
      layout: {
        className:
          "relative flex flex-col w-full h-full bg-black overflow-hidden",
        slots: [
          {
            slotId: "viewfinder",
            className: "absolute inset-0",
            children: [],
          },
          {
            slotId: "overlay",
            className: "relative flex flex-col w-full h-full",
            children: [],
          },
        ],
      },
    },

    "gallery-layout": {
      layoutId: "gallery-layout",
      description: "photo gallery",
      layout: {
        className: "flex flex-col w-full h-full bg-black",
        slots: [
          {
            slotId: "topBar",
            className:
              "w-full px-4 py-3 flex items-center gap-3 shrink-0 bg-black",
            children: [],
          },
          {
            slotId: "content",
            className: "flex-1 overflow-auto flex flex-col",
            children: [],
          },
        ],
      },
    },
  },

  screens: [
    // ── Counter ──────────────────────────────────────────
    {
      header: {
        type: "screen",
        path: "/counter",
        title: "Counter",
        className: "flex flex-col w-full h-full bg-amber-50",
      },
      properties: {
        count: {
          type: "number",
          defaultValue: 0,
          description: "counter value",
        },
      },
      detail: {
        layoutId: "scaffold-amber",
        slotOverrides: [
          {
            slotId: "topBar",
            children: [
              {
                type: "asset",
                assetId: "headingText",
                overrides: { text: "Counter App" },
              },
            ],
          },
          {
            slotId: "body",
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
                    type: "asset",
                    assetId: "btnPrimary",
                    id: "btnPlus",
                    overrides: { text: "+" },
                  },
                  {
                    type: "asset",
                    assetId: "btnSecondary",
                    id: "btnMinus",
                    overrides: { text: "-" },
                  },
                ],
              },
            ],
          },
          {
            slotId: "bottomBar",
            children: [
              {
                type: "asset",
                assetId: "btnBlue",
                id: "btnGoDetail",
                overrides: { text: "view detail →" },
              },
              {
                type: "asset",
                assetId: "btnBlue",
                id: "btnGoCamera",
                overrides: { text: "📷 camera" },
                className:
                  "px-6 py-3 text-xl bg-green-600 text-white rounded-lg",
              },
            ],
          },
        ],
        script: `
          const text   = fragment.inflate("textView");
          const plus   = fragment.inflate("btnPlus");
          const minus  = fragment.inflate("btnMinus");
          const goBtn  = fragment.inflate("btnGoDetail");
          const camBtn = fragment.inflate("btnGoCamera");

          plus.onClick(() => {
            let v = text.getValue();
            text.setValue(v + 1);
            state.set("count", v + 1);
            print("on plus click: " + v);
          });

          minus.onClick(() => {
            let v = text.getValue();
            text.setValue(v - 1);
            print("on minus click: " + v);
            state.set("count", v - 1);
          });

          goBtn.onClick(() => {
            state.share("lastCount", text.getValue());
            router.push("/detail/42");
          });

          camBtn.onClick(() => {
            router.push("/camera");
          });
        `,
      },
    },

    // ── Detail ───────────────────────────────────────────
    {
      header: {
        type: "screen",
        path: "/detail/:itemId",
        title: "Detail",
        className: "flex flex-col w-full h-full bg-white",
      },
      properties: {
        itemId: {
          type: "string",
          defaultValue: "",
          description: "item id from URL",
        },
        lastCount: {
          type: "number",
          defaultValue: 0,
          description: "count from counter screen",
        },
      },
      detail: {
        layoutId: "sidebar-detail",
        slotOverrides: [
          {
            slotId: "sidebar",
            children: [
              {
                type: "asset",
                assetId: "headingText",
                overrides: { text: "Navigation" },
                className: "text-sm font-bold text-gray-500 uppercase",
              },
              {
                type: "asset",
                assetId: "btnPrimary",
                id: "btnBack",
                overrides: { text: "← go back" },
                className:
                  "w-full px-4 py-2 bg-gray-800 text-white rounded-lg text-sm",
              },
            ],
          },
          {
            slotId: "main",
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

    // ── Camera ───────────────────────────────────────────
    {
      header: {
        type: "screen",
        path: "/camera",
        title: "Camera",
        className: "flex flex-col w-full h-full bg-black",
      },
      properties: {
        facing: {
          type: "string",
          defaultValue: "environment",
          description: "camera facing mode",
        },
        photoUrl: {
          type: "string",
          defaultValue: "",
          description: "last captured photo",
        },
      },
      detail: {
        layoutId: "camera-layout",
        slotOverrides: [
          {
            slotId: "viewfinder",
            children: [
              {
                type: "video",
                srcId: "mainCamera",
                className: "w-full h-full object-cover",
                muted: true,
                autoPlay: true,
              },
            ],
          },
          {
            slotId: "overlay",
            className: "relative flex flex-col w-full h-full",
            children: [
              {
                type: "row",
                className:
                  "flex items-center justify-between px-4 pt-10 pb-2 shrink-0",
                children: [
                  {
                    type: "button",
                    id: "btnBack",
                    text: "✕",
                    className:
                      "w-10 h-10 rounded-full bg-black bg-opacity-50 text-white text-lg",
                  },
                  {
                    type: "box",
                    className: "w-10 h-10",
                    children: [],
                  },
                ],
              },

              { type: "spacer" },

              {
                type: "row",
                className:
                  "flex items-center justify-between px-8 pb-10 shrink-0",
                children: [
                  {
                    type: "image",
                    id: "thumbView",
                    src: "",
                    alt: "last photo",
                    className:
                      "w-14 h-14 rounded-xl object-cover bg-gray-800 border-2 border-white border-opacity-40",
                  },
                  {
                    type: "button",
                    id: "btnCapture",
                    text: "",
                    className:
                      "w-20 h-20 rounded-full border-4 border-white bg-white bg-opacity-25",
                  },
                  {
                    type: "button",
                    id: "btnFlip",
                    text: "🔄",
                    className:
                      "w-14 h-14 rounded-full bg-black bg-opacity-50 text-white text-2xl",
                  },
                ],
              },
            ],
          },
        ],
        script: `
          const thumb      = fragment.inflate("thumbView");
          const captureBtn = fragment.inflate("btnCapture");
          const backBtn    = fragment.inflate("btnBack");
          const flipBtn    = fragment.inflate("btnFlip");

          camera.startPreview("mainCamera", "environment");

          captureBtn.onClick(() => {
            camera.capture("mainCamera", (url) => {
              thumb.setValue(url);
              state.set("photoUrl", url);
              state.share("lastPhoto", url);

              var listStr = state.getShared("photoList") || "[]";
              var list = JSON.parse(listStr);
              list.unshift(url);
              state.share("photoList", JSON.stringify(list));
            });
          });

          flipBtn.onClick(() => {
            camera.flipCamera("mainCamera");
          });

          thumb.onClick(() => {
            router.push("/gallery");
          });

          backBtn.onClick(() => {
            camera.stopPreview("mainCamera");
            router.back();
          });
        `,
      },
    },

    // ── Gallery ──────────────────────────────────────────
    {
      header: {
        type: "screen",
        path: "/gallery",
        title: "Gallery",
        className: "flex flex-col w-full h-full bg-white",
      },
      properties: {
        selectedUrl: {
          type: "string",
          defaultValue: "",
          description: "selected photo URL",
        },
      },
      detail: {
        layout: {
          className: "flex flex-col w-full h-full bg-white",
          slots: [
            // ── top bar ──
            {
              slotId: "topBar",
              className:
                "w-full px-4 py-3 flex items-center gap-3 shrink-0 bg-white border-b border-gray-200",
              children: [
                {
                  type: "button",
                  id: "btnBack",
                  text: "← Back",
                  className:
                    "px-4 py-2 text-gray-700 text-sm rounded-lg bg-gray-100 shrink-0",
                },
                {
                  type: "text",
                  text: "Gallery",
                  className: "text-gray-900 text-lg font-bold flex-1",
                },
                {
                  type: "text",
                  id: "photoCount",
                  text: "",
                  className: "text-gray-400 text-sm shrink-0",
                },
              ],
            },

            // ── lightbox overlay — ซ่อนเมื่อ src ว่าง ──
            {
              slotId: "lightbox",
              className: "w-full shrink-0 bg-black",
              style: { display: "none" },
              children: [
                {
                  type: "image",
                  id: "lightboxView",
                  src: "",
                  alt: "selected photo",
                  className: "w-full object-contain",
                  style: { maxHeight: "60vh" },
                },
                // action row ใต้รูปใน lightbox
                {
                  type: "row",
                  className: "flex items-center justify-between px-4 py-3",
                  children: [
                    {
                      type: "text",
                      id: "lightboxLabel",
                      text: "",
                      className: "text-white text-sm flex-1",
                    },
                    {
                      type: "button",
                      id: "btnDownload",
                      text: "⬇ Save",
                      className:
                        "px-4 py-2 bg-white text-black text-sm rounded-lg font-medium",
                    },
                    {
                      type: "button",
                      id: "btnCloseLightbox",
                      text: "✕",
                      className:
                        "ml-2 w-8 h-8 rounded-full bg-gray-700 text-white text-sm",
                    },
                  ],
                },
              ],
            },

            // ── photo grid ──
            {
              slotId: "grid",
              className: "flex-1 overflow-auto p-3",
              children: [
                {
                  type: "text",
                  id: "emptyText",
                  text: "No photos yet. Go take some! 📷",
                  className: "text-gray-400 text-sm text-center p-8 w-full",
                },
                {
                  type: "row",
                  id: "photoGrid",
                  className: "flex flex-wrap gap-3",
                  children: [],
                },
              ],
            },
          ],
        },

        script: `
          const photoGrid        = fragment.inflate("photoGrid");
          const emptyText        = fragment.inflate("emptyText");
          const photoCount       = fragment.inflate("photoCount");
          const lightboxView     = fragment.inflate("lightboxView");
          const lightboxLabel    = fragment.inflate("lightboxLabel");
          const btnDownload      = fragment.inflate("btnDownload");
          const btnCloseLightbox = fragment.inflate("btnCloseLightbox");
          const backBtn          = fragment.inflate("btnBack");


          let listStr    = state.getShared("photoList");
          let list       = JSON.parse(listStr);
          let currentUrl = "";

          function openLightbox(url, label) {
            currentUrl = url;
            lightboxView.setValue(url);
            lightboxLabel.setValue(label);
          }

          function closeLightbox() {
            currentUrl = "";
            lightboxView.setValue("");
            lightboxLabel.setValue("");
          }

          function bindCard(imgId, dlId, url, index) {
            const img   = fragment.inflate(imgId);
            const dlBtn = fragment.inflate(dlId);

            img.onClick(() => {
              openLightbox(url, "Photo " + index);
            });

            dlBtn.onClick(() => {
              download.saveImage(url, "fenrir_photo_" + index + "_" + Date.now() + ".jpg");
            });
          }

          btnCloseLightbox.onClick(() => { closeLightbox(); });

          btnDownload.onClick(() => {
            if (currentUrl) {
              download.saveImage(currentUrl, "fenrir_" + Date.now() + ".jpg");
            }
          });

          backBtn.onClick(() => { router.back(); });

          if (list.length === 0) {
            emptyText.setValue("No photos yet. Go take some! 📷");
          } else {
            emptyText.setValue("");
            photoCount.setValue(list.length + " photos");
            photoGrid.clearChildren();

            for (let i = 0; i < list.length; i++) {
              const url   = list[i];
              const imgId = "gridImg_" + i;
              const dlId  = "dlBtn_"   + i;
              const index = i + 1;

              const card = JSON.stringify({
                type:      "column",
                className: "flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200",
                style:     { width: "calc(33.33% - 8px)" },
                children: [
                  {
                    type:      "image",
                    id:        imgId,
                    src:       url,
                    alt:       "photo " + index,
                    className: "w-full object-cover bg-gray-100",
                    style:     { aspectRatio: "1/1" },
                  },
                  {
                    type:      "row",
                    className: "flex items-center justify-between px-2 py-1 gap-1",
                    children: [
                      {
                        type:      "text",
                        text:      "Photo " + index,
                        className: "text-gray-700 text-xs truncate flex-1",
                      },
                      {
                        type:      "button",
                        id:        dlId,
                        text:      "⬇",
                        className: "text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg shrink-0",
                      },
                    ],
                  },
                ],
              });

              photoGrid.appendChild(card);
              bindCard(imgId, dlId, url, index);
            }
          }
        `,
      },
    },
  ],
};
