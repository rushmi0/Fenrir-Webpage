import * as React from "react";

export type JsValue = string | number | boolean | null | undefined;

export type BaseNode = {
  id?: string;
  style?: React.CSSProperties;
};

export type ColumnNode = BaseNode & {
  type: "column";
  children: UINode[];
};

export type RowNode = BaseNode & {
  type: "row";
  children: UINode[];
};

export type TextNode = BaseNode & {
  type: "text";
  text: string;
  value?: JsValue;
};

export type ButtonNode = BaseNode & {
  type: "button";
  text: string;
};

export type UINode = ColumnNode | RowNode | TextNode | ButtonNode;

export type UIConfig = ColumnNode & {
  logic: string;
};
