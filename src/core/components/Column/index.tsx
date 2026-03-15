import { CSSProperties, ReactNode } from "react";

type ColumnProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Column({ children, className, style }: ColumnProps) {
  const resolvedClass = ["column", className].filter(Boolean).join(" ");

  return (
    <div className={resolvedClass} style={style}>
      {children}
    </div>
  );
}