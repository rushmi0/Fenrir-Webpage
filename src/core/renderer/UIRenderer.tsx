import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
  AppBlueprint,
  ScreenBlueprint,
  ScreenLayout,
  ScreenState,
  UINode,
} from "../ui-tree/types";
import { resolveInitialState } from "../ui-tree/properties.ts";
import { resolveLayout } from "../ui-tree/layout.ts";
import { expandLayoutAssets } from "../ui-tree/assets.ts";
import {
  Text,
  Button,
  Column,
  Row,
  Box,
  Spacer,
  Image,
  VideoPreview,
} from "../components";
import { LayoutRenderer } from "./LayoutRenderer";
import { VM } from "../../runtime/VM";
import { EngineConfig, DEFAULT_PLUGINS } from "../../runtime/EngineConfig";
import { createRouterPlugin } from "../../runtime/plugins/native/RouterPlugin";
import { createStatePlugin } from "../../runtime/plugins/native/StatePlugin";
import { screenCache } from "../../runtime/SharedStateStore";
import { ViewModelStore } from "../../runtime/ViewModelStore";

type UIRendererProps = {
  blueprint: string;
  appBlueprint?: AppBlueprint;
  engineConfig?: EngineConfig;
};

function parseBlueprint(raw: string): ScreenBlueprint {
  const obj = JSON.parse(raw) as Record<string, unknown>;
  if ("header" in obj && "detail" in obj)
    return obj as unknown as ScreenBlueprint;

  const { script, children } = obj as { script: string; children: UINode[] };
  return {
    header: { type: "screen", path: "/", className: "" },
    detail: {
      layout: { slots: [{ slotId: "body", children: children ?? [] }] },
      script: script ?? "",
    },
  };
}

function buildLiveLayout(
  expandedLayout: ScreenLayout,
  tree: UINode,
  slotChildCounts: number[],
): ScreenLayout {
  if (!("children" in tree)) return expandedLayout;

  const flat = tree.children;
  let offset = 0;

  const liveSlots = expandedLayout.slots.map((slot, i) => {
    const count = slotChildCounts[i] ?? 0;
    const slotChildren = flat.slice(offset, offset + count);
    offset += count;
    return { ...slot, children: slotChildren };
  });

  return { ...expandedLayout, slots: liveSlots };
}

export function UIRenderer({
  blueprint,
  appBlueprint,
  engineConfig,
}: UIRendererProps) {
  const parsed = useMemo(() => parseBlueprint(blueprint), [blueprint]);
  const screenPath = parsed.header.path;

  const navigate = useNavigate();
  const params = useParams<Record<string, string>>();
  const [searchParams] = useSearchParams();

  const expandedLayout = useMemo(() => {
    const resolved = resolveLayout({
      layoutId: parsed.detail.layoutId,
      slotOverrides: parsed.detail.slotOverrides,
      inlineLayout: parsed.detail.layout,
      layoutList: appBlueprint?.layoutList,
    });
    if (!appBlueprint?.assets) return resolved;
    return {
      ...resolved,
      slots: expandLayoutAssets(resolved.slots, appBlueprint.assets),
    };
  }, []);

  const slotChildCounts = useMemo(
    () => expandedLayout.slots.map((s) => s.children.length),
    [],
  );

  const freshTree: UINode = useMemo(
    () => ({
      type: "column",
      className: "flex flex-col h-full w-full",
      children: expandedLayout.slots.flatMap((s) => s.children),
    }),
    [],
  );

  const initialState = useMemo(
    () => (parsed.properties ? resolveInitialState(parsed.properties) : {}),
    [],
  );

  const vm = useMemo(
    () => ViewModelStore.getOrCreate(screenPath, freshTree, initialState),
    [],
  );

  const [tree, setTree] = useState<UINode>(vm.uiTree);
  const treeRef = useRef<UINode>(vm.uiTree);
  const localStateRef = useRef<ScreenState>(vm.screenState);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    treeRef.current = tree;
  }, [tree]);

  useEffect(() => {
    ViewModelStore.save(screenPath, tree, localStateRef.current);
  }, [tree, screenPath]);

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
  }, []);

  const { triggerEvent } = VM({
    blueprint: { script: parsed.detail.script },
    treeRef,
    setTree,
    config: { ...engineConfig, plugins },
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
      case "video":
        return (
          <VideoPreview
            key={key}
            srcId={node.srcId}
            className={node.className}
            style={node.style}
            muted={node.muted}
            autoPlay={node.autoPlay}
          />
        );
      case "image":
        return (
          <Image
            key={key}
            src={node.src}
            alt={node.alt}
            className={node.className}
            style={node.style}
            onClick={node.id ? () => triggerEvent(node.id) : undefined}
          />
        );
      case "spacer":
        return (
          <Spacer key={key} className={node.className} style={node.style} />
        );
      case "asset":
        console.warn("[UIRenderer] unexpanded asset:", node.assetId);
        return <></>;
      default:
        return <></>;
    }
  }

  const liveLayout = buildLiveLayout(expandedLayout, tree, slotChildCounts);

  return (
    <div className={parsed.header.className} style={parsed.header.style}>
      <LayoutRenderer layout={liveLayout} renderNode={renderNode} />
    </div>
  );
}
