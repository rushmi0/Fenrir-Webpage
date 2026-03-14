import { CSSProperties } from "react";

type SpacerProps = { style?: CSSProperties };

export function Spacer({ style }: SpacerProps) {
  return <div style={{ flex: 1, ...style }} />;
}