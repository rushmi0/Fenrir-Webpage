import { UINode, JsValue } from "./types";

export function updateNodeValue(
  root: UINode,
  id: string,
  value: JsValue,
): UINode {
  if (root.id === id && root.type === "text") {
    return { ...root, value, text: String(value) };
  }
  if (root.id === id && root.type === "image") {
    return { ...root, value, src: String(value ?? "") };
  }
  if ("children" in root && root.children) {
    return {
      ...root,
      children: root.children.map((child) => updateNodeValue(child, id, value)),
    };
  }
  return root;
}

export function findNodeValue(root: UINode, id: string): JsValue {
  if (root.id === id && (root.type === "text" || root.type === "image")) {
    return root.value;
  }
  if ("children" in root && root.children) {
    for (const child of root.children) {
      const result = findNodeValue(child, id);
      if (result !== undefined) return result;
    }
  }
  return undefined;
}

// ✅ ใหม่ — append UINode เข้าไปใน node ที่มี id ตรงกัน
export function appendChildToNode(
  root: UINode,
  parentId: string,
  child: UINode,
): UINode {
  if (root.id === parentId && "children" in root) {
    return { ...root, children: [...root.children, child] };
  }
  if ("children" in root && root.children) {
    return {
      ...root,
      children: root.children.map((c) => appendChildToNode(c, parentId, child)),
    };
  }
  return root;
}

// ✅ ใหม่ — clear children ของ node ที่มี id ตรงกัน
export function clearChildren(root: UINode, parentId: string): UINode {
  if (root.id === parentId && "children" in root) {
    return { ...root, children: [] };
  }
  if ("children" in root && root.children) {
    return {
      ...root,
      children: root.children.map((c) => clearChildren(c, parentId)),
    };
  }
  return root;
}
