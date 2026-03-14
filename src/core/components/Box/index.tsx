import { CSSProperties, ReactNode } from "react";

type BoxProps = { children?: ReactNode; style?: CSSProperties };

export function Box({ children, style }: BoxProps) {
  return <div style={style}>{children}</div>;
}