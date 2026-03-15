import { CSSProperties, ReactNode } from "react";

type RowProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Row({ children, className, style }: RowProps) {
  const resolvedClass = ["row", className].filter(Boolean).join(" ");

  return (
    <div className={resolvedClass} style={style}>
      {children}
    </div>
  );
}