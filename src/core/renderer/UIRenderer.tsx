import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { Blueprint, UINode } from "../ui-tree/types";
import { Text, Button, Column, Row, Box, Spacer } from "../components";
import { useRuntime } from "../../runtime/useRuntime";

type UIRendererProps = {
  blueprint: string;
};

export function UIRenderer({ blueprint }: UIRendererProps) {
  const parsed: Blueprint = useMemo(() => JSON.parse(blueprint), [blueprint]);

  const [tree, setTree] = useState<UINode>(parsed);
  const treeRef = useRef<UINode>(tree);

  useEffect(() => {
    treeRef.current = tree;
  }, [tree]);

  const { triggerEvent } = useRuntime({ blueprint: parsed, treeRef, setTree });

  function renderNode(node: UINode, key: number): JSX.Element {
    switch (node.type) {
      case "column":
        return (
          <Column key={key} style={node.style}>
            {node.children.map((child, i) => renderNode(child, i))}
          </Column>
        );
      case "row":
        return (
          <Row key={key} style={node.style}>
            {node.children.map((child, i) => renderNode(child, i))}
          </Row>
        );
      case "box":
        return (
          <Box key={key} style={node.style}>
            {node.children.map((child, i) => renderNode(child, i))}
          </Box>
        );
      case "text":
        return <Text key={key} text={node.text} style={node.style} />;
      case "button":
        return (
          <Button
            key={key}
            text={node.text}
            style={node.style}
            onClick={() => triggerEvent(node.id)}
          />
        );
      case "spacer":
        return <Spacer key={key} style={node.style} />;
    }
  }

  return renderNode(tree, 0);
}