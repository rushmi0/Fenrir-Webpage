import * as React from "react";

export type JsValue = string | number | boolean | null | undefined;

export type BaseNode = {
  id?: string;
  className?: string;
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


/* ---------- Blueprint ---------- */

export type ScreenHeader = {
  type: "screen";
  title?: string;
  className?: string;
  safeArea?: boolean;
};

export type BlueprintHeader = ScreenHeader;

export type BlueprintDetail = {
  children: UINode[];
  script: string;
};

export type Blueprint = {
  header: BlueprintHeader;
  detail: BlueprintDetail;
};


/* ---------- Runtime ---------- */

export type RuntimeBlueprint = {
  script: string;
};