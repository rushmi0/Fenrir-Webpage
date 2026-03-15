import { useEffect, useRef } from "react";
import { CSSProperties } from "react";

export const StreamRegistry = new Map<string, MediaStream>();

const listeners = new Map<string, Set<() => void>>();

export function notifyStreamUpdate(streamId: string) {
  listeners.get(streamId)?.forEach((fn) => fn());
}

const origSet = StreamRegistry.set.bind(StreamRegistry);
StreamRegistry.set = (key: string, value: MediaStream) => {
  const result = origSet(key, value);
  notifyStreamUpdate(key);
  return result;
};

type VideoPreviewProps = {
  srcId: string;
  className?: string;
  style?: CSSProperties;
  muted?: boolean;
  autoPlay?: boolean;
};

export function VideoPreview({
  srcId,
  className,
  style,
  muted = true,
  autoPlay = true,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const attach = () => {
    const el = videoRef.current;
    const stream = StreamRegistry.get(srcId);
    if (!el || !stream) return;
    if (el.srcObject !== stream) {
      el.srcObject = stream;
      el.play().catch(() => {
      });
    }
  };

  useEffect(() => {
    attach();
    if (!listeners.has(srcId)) listeners.set(srcId, new Set());
    const set = listeners.get(srcId)!;
    set.add(attach);
    const timer = setInterval(attach, 300);

    return () => {
      clearInterval(timer);
      set.delete(attach);
    };
  }, [attach, srcId]);

  return (
    <video
      ref={videoRef}
      className={className}
      style={style}
      autoPlay={autoPlay}
      muted={muted}
      playsInline
    />
  );
}
