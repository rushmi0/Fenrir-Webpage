import { CSSProperties } from "react";

type TextProps = { text: string; style?: CSSProperties };

export function Text({ text, style }: TextProps) {
  return <span style={style}>{text}</span>;
}