import { IPlugin } from "../IPlugin.ts";

export interface ImageCaptureResult {
  readonly width: number;
  readonly height: number;
}

export interface ImageCapture {
  readonly track: MediaStreamTrack;
  takePhoto(): Promise<Blob>;
  grabFrame(): Promise<ImageBitmap>;
  getPhotoCapabilities(): Promise<PhotoCapabilities>;
  getPhotoSettings(): Promise<PhotoSettings>;
}

export interface PhotoCapabilities {
  redEyeReduction: string;
  imageHeight: MediaSettingsRange;
  imageWidth: MediaSettingsRange;
  fillLightMode: string[];
}

export interface PhotoSettings {
  fillLightMode?: string;
  imageHeight?: number;
  imageWidth?: number;
  redEyeReduction?: boolean;
}

export interface MediaSettingsRange {
  max: number;
  min: number;
  step: number;
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

export const CameraPlugin: IPlugin = {
  name: "camera",

  install({ ctx }) {
    const obj = ctx.newObject();

    const capture = ctx.newFunction("capture", (callbackHandle) => {
      const fnName = "__cameraCallback__";
      ctx.setProp(ctx.global, fnName, callbackHandle);
      callbackHandle.dispose();

      const ImageCaptureConstructor = getImageCaptureConstructor();

      if (!ImageCaptureConstructor) {
        console.error(
          "[CameraPlugin] ImageCapture API is not supported in this browser",
        );
        return;
      }

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const track = stream.getVideoTracks()[0];
          const imageCapture = new ImageCaptureConstructor(track);
          return imageCapture.takePhoto();
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const result = ctx.evalCode(`${fnName} && ${fnName}("${url}")`);
          result.dispose();
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          console.error("[CameraPlugin]", message);
        });
    });

    ctx.setProp(obj, "capture", capture);
    ctx.setProp(ctx.global, "camera", obj);

    capture.dispose();
    obj.dispose();
  },
};
