import { IPlugin } from "../IPlugin";

export const DownloadPlugin: IPlugin = {
  name: "download",

  install({ ctx }) {
    const obj = ctx.newObject();
    const saveImage = ctx.newFunction(
      "saveImage",
      (urlHandle, filenameHandle) => {
        const url = ctx.dump(urlHandle) as string;
        const filename = filenameHandle
          ? (ctx.dump(filenameHandle) as string)
          : `photo_${Date.now()}.jpg`;

        urlHandle.dispose();
        if (filenameHandle) filenameHandle.dispose();

        if (!url) return;

        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.target = "_blank";
          a.rel = "noopener";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      },
    );

    const shareImage = ctx.newFunction(
      "shareImage",
      (urlHandle, titleHandle) => {
        const url = ctx.dump(urlHandle) as string;
        const title = titleHandle ? (ctx.dump(titleHandle) as string) : "Photo";

        urlHandle.dispose();
        if (titleHandle) titleHandle.dispose();

        if (!url) return;

        const doShare = async () => {
          if (navigator.share) {
            try {
              const response = await fetch(url);
              const blob = await response.blob();
              const file = new File([blob], `photo_${Date.now()}.jpg`, {
                type: blob.type || "image/jpeg",
              });

              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title });
                return;
              }

              await navigator.share({ url, title });
            } catch (err: unknown) {
              if (err instanceof Error && err.name !== "AbortError") {
                console.error("[DownloadPlugin] share failed:", err.message);
              }
            }
          } else {
            const a = document.createElement("a");
            a.href = url;
            a.download = `photo_${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        };

        doShare().catch((err: unknown) => {
          console.error("[DownloadPlugin] shareImage error:", err);
        });
      },
    );

    ctx.setProp(obj, "saveImage", saveImage);
    ctx.setProp(obj, "shareImage", shareImage);
    ctx.setProp(ctx.global, "download", obj);

    saveImage.dispose();
    shareImage.dispose();
    obj.dispose();
  },
};
