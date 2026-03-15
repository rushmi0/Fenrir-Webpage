import { CSSProperties } from "react";

type SpacerProps = {
  className?: string;
  style?: CSSProperties;
};

export function Spacer({ className, style }: SpacerProps) {
  const resolvedClass = ["flex-1", className].filter(Boolean).join(" ");

  return <div className={resolvedClass} style={style} />;
}