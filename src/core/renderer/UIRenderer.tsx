import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { ScreenBlueprint, ScreenState, UINode } from "../ui-tree/types";
import { Text, Button, Column, Row, Box, Spacer } from "../components";

import { VM } from "../../runtime/VM.ts";

import {
  EngineConfig,
  DEFAULT_PLUGINS,
} from "../../runtime/EngineConfig.ts";

import { createRouterPlugin } from "../../runtime/plugins/native/RouterPlugin.ts";
import { createStatePlugin } from "../../runtime/plugins/native/StatePlugin.ts";

import { screenCache } from "../../runtime/SharedStateStore";
import { ViewModelStore } from "../../runtime/ViewModelStore";

type UIRendererProps = {
  blueprint: string;
  engineConfig?: EngineConfig;
};

function parseBlueprint(raw: string): ScreenBlueprint {
  const obj = JSON.parse(raw) as Record<string, unknown>;

  if ("header" in obj && "detail" in obj) {
    return obj as unknown as ScreenBlueprint;
  }

  const { script, children } = obj as {
    script: string;
    children: UINode[];
  };

  return {
    header: {
      type: "screen",
      path: "/",
      className: "",
    },
    detail: {
      children: children ?? [],
      script: script ?? "",
    },
  };
}

export function UIRenderer({ blueprint, engineConfig }: UIRendererProps) {
  const parsed = useMemo(() => parseBlueprint(blueprint), [blueprint]);
  const screenPath = parsed.header.path;
  const navigate = useNavigate();
  const params = useParams<Record<string, string>>();
  const [searchParams] = useSearchParams();

  const freshTree: UINode = useMemo(
    () => ({
      type: "column",
      className: "flex flex-col h-full w-full",
      children: parsed.detail.children,
    }),
    [parsed.detail.children],
  );

  const vm = ViewModelStore.getOrCreate(
    screenPath,
    freshTree,
    parsed.state ?? {},
  );

  const [tree, setTree] = useState<UINode>(vm.uiTree);
  const treeRef = useRef<UINode>(vm.uiTree);
  const localStateRef = useRef<ScreenState>(vm.screenState);

  useEffect(() => {
    treeRef.current = tree;
  }, [tree]);

  useEffect(() => {
    ViewModelStore.save(screenPath, tree, localStateRef.current);
  }, [tree, screenPath]);

  const [, forceUpdate] = useState(0);

  const plugins = useMemo(() => {
    const routerPlugin = createRouterPlugin({
      navigate,
      getParams: () => params as Record<string, string>,
      getSearchParams: () => Object.fromEntries(searchParams.entries()),
    });

    const statePlugin = createStatePlugin({
      screenPath,
      localState: localStateRef,
      setLocalState: (updater) => {
        const next = updater(localStateRef.current);
        localStateRef.current = next;
        ViewModelStore.save(screenPath, treeRef.current, next);
        forceUpdate((n) => n + 1);
      },

      sharedStore: screenCache,
    });

    return [
      ...(engineConfig?.plugins ?? DEFAULT_PLUGINS),
      routerPlugin,
      statePlugin,
    ];
  }, [navigate, params, searchParams, screenPath, engineConfig]);

  const { triggerEvent } = VM({
    blueprint: {
      script: parsed.detail.script,
    },
    treeRef,
    setTree,
    config: {
      ...engineConfig,
      plugins,
    },
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
