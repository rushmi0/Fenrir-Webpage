import * as React from "react";

export type JsValue = string | number | boolean | null | undefined;

export type BaseNode = {
  id?: string;
  style?: React.CSSProperties;
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

export type ColumnNode = BaseNode & {
  type: "column";
  children: UINode[];
};

export type RowNode = BaseNode & {
  type: "row";
  children: UINode[];
};

export type BoxNode = BaseNode & {
  type: "box";
  children: UINode[];
};

export type SpacerNode = BaseNode & {
  type: "spacer";
};

export type UINode =
  | TextNode
  | ButtonNode
  | ColumnNode
  | RowNode
  | BoxNode
  | SpacerNode;

export type Blueprint = ColumnNode & {
  script: string;
};