import { CSSProperties, ReactNode } from "react";

type BoxProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Box({ children, className, style }: BoxProps) {
  const resolvedClass = ["box", className].filter(Boolean).join(" ");

  return (
    <div className={resolvedClass} style={style}>
      {children}
    </div>
  );
}