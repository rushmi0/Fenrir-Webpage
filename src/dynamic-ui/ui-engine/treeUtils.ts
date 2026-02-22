import { UINode, JsValue } from "./types";

export function updateValue(node: UINode, id: string, value: JsValue): UINode {
  if (node.id === id && node.type === "text") {
    return { ...node, value, text: String(value) };
  }

  if (node.type === "column" || node.type === "row") {
    return {
      ...node,
      children: node.children.map((c) => updateValue(c, id, value)),
    };
  }

  return node;
}

export function findValue(node: UINode, id: string): JsValue {
  if (node.id === id && node.type === "text") {
    return node.value;
  }

  if (node.type === "column" || node.type === "row") {
    for (const c of node.children) {
      const result = findValue(c, id);
      if (result !== undefined) return result;
    }
  }

  return undefined;
}
