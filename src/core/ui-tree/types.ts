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
export type ButtonNode = BaseNode & { type: "button"; text: string };
export type ColumnNode = BaseNode & { type: "column"; children: UINode[] };
export type RowNode = BaseNode & { type: "row"; children: UINode[] };
export type BoxNode = BaseNode & { type: "box"; children: UINode[] };
export type SpacerNode = BaseNode & { type: "spacer" };

export type ImageNode = BaseNode & {
  type: "image";
  src: string;
  alt?: string;
  value?: JsValue;
};

export type VideoNode = BaseNode & {
  type: "video";
  srcId: string;
  autoPlay?: boolean;
  muted?: boolean;
  style?: React.CSSProperties;
};

export type AssetRefNode = BaseNode & {
  type: "asset";
  assetId: string;
  overrides?: Partial<BaseNode & { text?: string }>;
};

export type UINode =
  | TextNode
  | ButtonNode
  | ColumnNode
  | RowNode
  | BoxNode
  | SpacerNode
  | ImageNode
  | VideoNode
  | AssetRefNode;

export type AssetNodeType =
  | "button"
  | "text"
  | "column"
  | "row"
  | "box"
  | "spacer"
  | "image";

export type AssetNode = BaseNode & {
  assetId: string;
  type: AssetNodeType;
  text?: string;
  src?: string;
  alt?: string;
  children?: UINode[];
  value?: JsValue;
};

export type AssetList = Record<string, AssetNode>;

// Layout
export type SlotConfig = {
  slotId: string;
  className?: string;
  style?: React.CSSProperties;
  children: UINode[];
};

export type ScreenLayout = {
  className?: string;
  style?: React.CSSProperties;
  slots: SlotConfig[];
};

export type LayoutPreset = {
  layoutId: string;
  description?: string;
  layout: ScreenLayout;
};

export type LayoutList = Record<string, LayoutPreset>;

// Screen Properties

export type PropertyType = "string" | "number" | "boolean";

export type PropertyDef = {
  type: PropertyType;
  defaultValue: JsValue;
  description?: string;
};

export type ScreenProperties = Record<string, PropertyDef>;
export type ScreenState = Record<string, JsValue>;

// Screen

export type ScreenHeader = {
  type: "screen";
  path: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
};

export type SlotOverride = {
  slotId: string;
  children: UINode[];
  className?: string;
  style?: React.CSSProperties;
};

export type ScreenDetail = {
  layoutId?: string;
  slotOverrides?: SlotOverride[];
  layout?: ScreenLayout;
  script: string;
};

export type ScreenBlueprint = {
  header: ScreenHeader;
  properties?: ScreenProperties;
  detail: ScreenDetail;
};

export type AppMeta = {
  appId: string;
  appName: string;
  version: string;
  initialPath: string;
  paths: string[];
  author?: string;
  description?: string;
};

export type AppBlueprint = {
  meta: AppMeta;
  assets?: AssetList;
  layoutList?: LayoutList;
  screens: ScreenBlueprint[];
};

export type RuntimeBlueprint = { script: string };
