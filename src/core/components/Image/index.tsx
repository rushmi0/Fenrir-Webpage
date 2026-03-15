import { CSSProperties } from "react";

type ImageProps = {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

export function Image({
  src,
  alt = "",
  className,
  style,
  onClick,
}: ImageProps) {
  if (!src) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1f2937",
          color: "#6b7280",
          fontSize: 14,
          borderRadius: 8,
          cursor: onClick ? "pointer" : "default",
          ...style,
        }}
        onClick={onClick}
      >
        no image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        objectFit: "cover",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      onClick={onClick}
    />
  );
}
