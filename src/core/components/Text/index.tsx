import { CSSProperties } from "react";

type TextProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
};

export function Text({ text, className, style }: TextProps) {
  return (
    <span className={className} style={style}>
      {text}
    </span>
  );
}