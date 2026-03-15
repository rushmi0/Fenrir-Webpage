import { CSSProperties } from "react";

type ButtonProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

export function Button({ text, className, style, onClick }: ButtonProps) {
  const resolvedClass = ["btn", className].filter(Boolean).join(" ");

  return (
    <button className={resolvedClass} style={style} onClick={onClick}>
      {text}
    </button>
  );
}