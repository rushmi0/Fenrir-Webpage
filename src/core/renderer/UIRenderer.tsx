import { JSX, useEffect, useMemo, useRef, useState } from "react";

import { Blueprint, RuntimeBlueprint, UINode } from "../ui-tree/types";
import { Text, Button, Column, Row, Box, Spacer } from "../components";
import { useRuntime } from "../../runtime/useRuntime";
import { RuntimeEngineConfig } from "../../runtime/RuntimeEngineConfig";

type UIRendererProps = {
  blueprint: string;
  engineConfig?: RuntimeEngineConfig;
};

function normalizeBlueprint(raw: unknown): Blueprint {
  const obj = raw as Record<string, unknown>;

  if ("header" in obj && "detail" in obj) {
    return obj as Blueprint;
  }

  const { script, children } = obj as {
    script: string;
    children: UINode[];
  };

  return {
    header: {
      type: "screen",
      className: "",
    },
    detail: {
      children: children ?? [],
      script: script ?? "",
    },
  };
}

export function UIRenderer({ blueprint, engineConfig }: UIRendererProps) {
  const parsed = useMemo(
    () => normalizeBlueprint(JSON.parse(blueprint)),
    [blueprint],
  );

  const initialRoot: UINode = useMemo(
    () => ({
      type: "column",
      className: "flex flex-col h-full w-full",
      children: parsed.detail.children,
    }),
    [parsed.detail.children],
  );

  const [tree, setTree] = useState<UINode>(initialRoot);

  const treeRef = useRef<UINode>(initialRoot);

  useEffect(() => {
    treeRef.current = tree;
  }, [tree]);

  const runtimeBlueprint: RuntimeBlueprint = useMemo(
    () => ({
      script: parsed.detail.script,
    }),
    [parsed.detail.script],
  );

  const { triggerEvent } = useRuntime({
    blueprint: runtimeBlueprint,
    treeRef,
    setTree,
    config: engineConfig,
  });

  function renderNode(node: UINode, key: number): JSX.Element {
    switch (node.type) {
      case "column":
        return (
          <Column key={key} className={node.className} style={node.style}>
            {node.children?.map((c, i) => renderNode(c, i))}
          </Column>
        );

      case "row":
        return (
          <Row key={key} className={node.className} style={node.style}>
            {node.children?.map((c, i) => renderNode(c, i))}
          </Row>
        );

      case "box":
        return (
          <Box key={key} className={node.className} style={node.style}>
            {node.children?.map((c, i) => renderNode(c, i))}
          </Box>
        );

      case "text":
        return (
          <Text
            key={key}
            text={node.text}
            className={node.className}
            style={node.style}
          />
        );

      case "button":
        return (
          <Button
            key={key}
            text={node.text}
            className={node.className}
            style={node.style}
            onClick={() => triggerEvent(node.id)}
          />
        );

      case "spacer":
        return (
          <Spacer key={key} className={node.className} style={node.style} />
        );

      default:
        return <></>;
    }
  }

  return <div className={parsed.header.className}>{renderNode(tree, 0)}</div>;
}
