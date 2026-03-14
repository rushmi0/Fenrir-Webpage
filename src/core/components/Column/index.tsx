import { CSSProperties, ReactNode } from "react";

type ColumnProps = { children?: ReactNode; style?: CSSProperties };

export function Column({ children, style }: ColumnProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      {children}
    </div>
  );
}