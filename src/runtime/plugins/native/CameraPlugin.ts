import { IPlugin } from "../IPlugin";
import { StreamRegistry } from "../../../core/components/VideoPreview";

export interface ImageCapture {
  readonly track: MediaStreamTrack;
  takePhoto(): Promise<Blob>;
}

export interface ImageCaptureConstructor {
  new (track: MediaStreamTrack): ImageCapture;
}

export function getImageCaptureConstructor():
  | ImageCaptureConstructor
  | undefined {
  return (window as Window & { ImageCapture?: ImageCaptureConstructor })
    .ImageCapture;
}

const facingModeRegistry = new Map<string, "user" | "environment">();

export const CameraPlugin: IPlugin = {
  name: "camera",

  install({ ctx }) {
    const obj = ctx.newObject();

    const startPreview = ctx.newFunction(
      "startPreview",
      (streamIdHandle, facingHandle) => {
        const streamId = ctx.dump(streamIdHandle) as string;
        const facingMode = facingHandle
          ? (ctx.dump(facingHandle) as "user" | "environment")
          : "environment";
        streamIdHandle.dispose();
        if (facingHandle) facingHandle.dispose();

        const old = StreamRegistry.get(streamId);
        if (old) {
          old.getTracks().forEach((t) => t.stop());
          StreamRegistry.delete(streamId);
        }

        facingModeRegistry.set(streamId, facingMode);

        navigator.mediaDevices
          .getUserMedia({
            video: { facingMode: { ideal: facingMode } },
            audio: false,
          })
          .then((stream) => {
            StreamRegistry.set(streamId, stream);
          })
            .catch(() => {
            return navigator.mediaDevices
              .getUserMedia({ video: { facingMode }, audio: false })
              .then((stream) => {
                StreamRegistry.set(streamId, stream);
              })
              .catch(() => {
                return navigator.mediaDevices
                  .getUserMedia({ video: true, audio: false })
                  .then((stream) => {
                    StreamRegistry.set(streamId, stream);
                  });
              });
          });
      },
    );

    const flipCamera = ctx.newFunction("flipCamera", (streamIdHandle) => {
      const streamId = ctx.dump(streamIdHandle) as string;
      streamIdHandle.dispose();

      const current = facingModeRegistry.get(streamId) ?? "environment";
      const next = current === "environment" ? "user" : "environment";

      const old = StreamRegistry.get(streamId);
      if (old) {
        old.getTracks().forEach((t) => t.stop());
        StreamRegistry.delete(streamId);
      }

      facingModeRegistry.set(streamId, next);

      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: { ideal: next } },
          audio: false,
        })
        .then((stream) => {
          StreamRegistry.set(streamId, stream);
        })
        .catch(() => {
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((stream) => {
              StreamRegistry.set(streamId, stream);
            });
        });
    });

    const stopPreview = ctx.newFunction("stopPreview", (streamIdHandle) => {
      const streamId = ctx.dump(streamIdHandle) as string;
      streamIdHandle.dispose();

      const stream = StreamRegistry.get(streamId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        StreamRegistry.delete(streamId);
      }
      facingModeRegistry.delete(streamId);
    });

    const capture = ctx.newFunction(
      "capture",
      (streamIdHandle, callbackHandle) => {
        const streamId = ctx.dump(streamIdHandle) as string;
        streamIdHandle.dispose();

        const fnName = `__cameraCapture_${streamId}__`;
        ctx.setProp(ctx.global, fnName, callbackHandle);
        callbackHandle.dispose();

        const ImageCaptureConstructor = getImageCaptureConstructor();

        const doCapture = (stream: MediaStream) => {
          if (ImageCaptureConstructor) {
            const track = stream.getVideoTracks()[0];
            const imageCapture = new ImageCaptureConstructor(track);
            imageCapture
              .takePhoto()
              .then((blob) => {
                const url = URL.createObjectURL(blob);
                const result = ctx.evalCode(`${fnName} && ${fnName}("${url}")`);
                result.dispose();
              })
              .catch(() => fallbackCapture(stream));
          } else {
            fallbackCapture(stream);
          }
        };

        const fallbackCapture = (stream: MediaStream) => {
          const video = document.createElement("video");
          video.srcObject = stream;
          video.muted = true;
          video.playsInline = true;
          video.play().then(() => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth || 1280;
            canvas.height = video.videoHeight || 720;
            const ctx2d = canvas.getContext("2d");
            if (!ctx2d) return;
            ctx2d.drawImage(video, 0, 0);
            canvas.toBlob(
              (blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const result = ctx.evalCode(`${fnName} && ${fnName}("${url}")`);
                result.dispose();
              },
              "image/jpeg",
              0.92,
            );
          });
        };

        const existingStream = StreamRegistry.get(streamId);
        if (existingStream) {
          doCapture(existingStream);
        } else {
          const facing = facingModeRegistry.get(streamId) ?? "environment";
          navigator.mediaDevices
            .getUserMedia({
              video: { facingMode: { ideal: facing } },
              audio: false,
            })
            .then((stream) => {
              doCapture(stream);
              setTimeout(
                () => stream.getTracks().forEach((t) => t.stop()),
                3000,
              );
            })
            .catch((err: unknown) => {
              const msg = err instanceof Error ? err.message : String(err);
              console.error("[CameraPlugin] capture failed:", msg);
            });
        }
      },
    );

    ctx.setProp(obj, "startPreview", startPreview);
    ctx.setProp(obj, "stopPreview", stopPreview);
    ctx.setProp(obj, "flipCamera", flipCamera);
    ctx.setProp(obj, "capture", capture);
    ctx.setProp(ctx.global, "camera", obj);

    startPreview.dispose();
    stopPreview.dispose();
    flipCamera.dispose();
    capture.dispose();
    obj.dispose();
  },
};
