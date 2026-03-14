import { UINode, JsValue } from "./types";

export function updateNodeValue(root: UINode, id: string, value: JsValue): UINode {
  if (root.id === id && root.type === "text") {
    return { ...root, value, text: String(value) };
  }

  if ("children" in root) {
    return {
      ...root,
      children: root.children.map((child) => updateNodeValue(child, id, value)),
    };
  }

  return root;
}

export function findNodeValue(root: UINode, id: string): JsValue {
  if (root.id === id && root.type === "text") {
    return root.value;
  }

  if ("children" in root) {
    for (const child of root.children) {
      const result = findNodeValue(child, id);
      if (result !== undefined) return result;
    }
  }

  return undefined;
}