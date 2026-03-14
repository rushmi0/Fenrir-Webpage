import { CSSProperties, ReactNode } from "react";

type RowProps = { children?: ReactNode; style?: CSSProperties };

export function Row({ children, style }: RowProps) {
  return (
    <div style={{ display: "flex", flexDirection: "row", ...style }}>
      {children}
    </div>
  );
}