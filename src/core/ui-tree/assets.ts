import {
  UINode,
  AssetRefNode,
  AssetList,
  AssetNode,
  SlotConfig,
} from "./types";

export function expandAsset(
  ref: AssetRefNode,
  assets: AssetList,
): UINode | null {
  const asset: AssetNode | undefined = assets[ref.assetId];
  if (!asset) {
    console.warn(`[AssetUtils] assetId "${ref.assetId}" not found`);
    return null;
  }

  const merged = {
    ...asset,
    id: ref.id ?? asset.id,
    className: ref.className ?? asset.className,
    style: ref.style ?? asset.style,
    ...(ref.overrides ?? {}),
  };

  switch (merged.type) {
    case "button":
      return {
        type: "button",
        id: merged.id,
        className: merged.className,
        style: merged.style,
        text: merged.text ?? "",
      };
    case "text":
      return {
        type: "text",
        id: merged.id,
        className: merged.className,
        style: merged.style,
        text: merged.text ?? "",
        value: merged.value,
      };
    case "column":
      return {
        type: "column",
        id: merged.id,
        className: merged.className,
        style: merged.style,
        children: merged.children ?? [],
      };
    case "row":
      return {
        type: "row",
        id: merged.id,
        className: merged.className,
        style: merged.style,
        children: merged.children ?? [],
      };
    case "box":
      return {
        type: "box",
        id: merged.id,
        className: merged.className,
        style: merged.style,
        children: merged.children ?? [],
      };
    case "spacer":
      return {
        type: "spacer",
        id: merged.id,
        className: merged.className,
        style: merged.style,
      };
    case "image":
      return {
        type: "image",
        id: merged.id,
        className: merged.className,
        style: merged.style,
        src: merged.src ?? "",
        alt: merged.alt,
      };
    default:
      return null;
  }
}

export function expandAssets(node: UINode, assets: AssetList): UINode {
  if (node.type === "asset") {
    return expandAsset(node, assets) ?? { type: "spacer" };
  }
  if ("children" in node && node.children) {
    return {
      ...node,
      children: node.children.map((c) => expandAssets(c, assets)),
    };
  }
  return node;
}

export function expandLayoutAssets(
  slots: SlotConfig[],
  assets: AssetList,
): SlotConfig[] {
  return slots.map((slot) => ({
    ...slot,
    children: slot.children.map((child) => expandAssets(child, assets)),
  }));
}
