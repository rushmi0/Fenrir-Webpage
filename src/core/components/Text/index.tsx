import { CSSProperties } from "react";

type TextProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
};

export function Text({ text, className, style }: TextProps) {
  const resolvedClass = ["", className].filter(Boolean).join(" ");
  return (
    <span className={resolvedClass} style={style}>
      {text}
    </span>
  );
}