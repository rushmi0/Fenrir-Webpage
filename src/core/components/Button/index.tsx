import { CSSProperties } from "react";

type ButtonProps = {
  text: string;
  style?: CSSProperties;
  onClick?: () => void;
};

export function Button({ text, style, onClick }: ButtonProps) {
  return <button style={style} onClick={onClick}>{text}</button>;
}