import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { UIConfig, UINode } from "./types";
import { useQuickJSUI } from "../quickjs/useQuickJSUI";

export function RenderUI({ blueprint }: { blueprint: string }) {
  const parsed: UIConfig = useMemo(() => JSON.parse(blueprint), [blueprint]);

  const [tree, setTree] = useState<UINode>(parsed);
  const treeRef = useRef<UINode>(tree);

  useEffect(() => {
    treeRef.current = tree;
  }, [tree]);

  const { trigger } = useQuickJSUI(parsed, treeRef, setTree);

  const renderNode = (node: UINode, key: number): JSX.Element => {
    switch (node.type) {
      case "column":
        return (
          <div
            key={key}
            style={{ display: "flex", flexDirection: "column", ...node.style }}
          >
            {node.children.map((c, i) => renderNode(c, i))}
          </div>
        );
      case "row":
        return (
          <div
            key={key}
            style={{ display: "flex", flexDirection: "row", ...node.style }}
          >
            {node.children.map((c, i) => renderNode(c, i))}
          </div>
        );
      case "text":
        return (
          <div key={key} style={node.style}>
            {node.text}
          </div>
        );
      case "button":
        return (
          <button key={key} style={node.style} onClick={() => trigger(node.id)}>
            {node.text}
          </button>
        );
    }
  };

  return renderNode(tree, 0);
}
