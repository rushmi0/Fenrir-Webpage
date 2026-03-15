import { JSX } from "react";
import { ScreenLayout, SlotConfig, UINode } from "../ui-tree/types";

type RenderFn = (node: UINode, key: number) => JSX.Element;

/**
 * LayoutRenderer — pure executor
 * ไม่รู้จัก layout type ใดเลย
 * แค่ render wrapper div + slot divs ตาม className/style ที่ Blueprint กำหนด
 */
export function LayoutRenderer({
                                   layout,
                                   renderNode,
                               }: {
    layout: ScreenLayout;
    renderNode: RenderFn;
}) {
    return (
        <div className={layout.className} style={layout.style}>
            {layout.slots.map((slot) => (
                <SlotRenderer key={slot.slotId} slot={slot} renderNode={renderNode} />
            ))}
        </div>
    );
}

function SlotRenderer({
                          slot,
                          renderNode,
                      }: {
    slot: SlotConfig;
    renderNode: RenderFn;
}) {
    return (
        <div className={slot.className} style={slot.style}>
            {slot.children.map((child, i) => renderNode(child, i))}
        </div>
    );
}