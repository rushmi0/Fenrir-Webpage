import { ScreenLayout, LayoutList, SlotOverride, SlotConfig } from "./types";

export function resolveLayout(opts: {
  layoutId?: string;
  slotOverrides?: SlotOverride[];
  inlineLayout?: ScreenLayout;
  layoutList?: LayoutList;
}): ScreenLayout {
  const { layoutId, slotOverrides, inlineLayout, layoutList } = opts;

  if (layoutId && layoutList) {
    const preset = layoutList[layoutId];
    if (preset) {
      if (!slotOverrides || slotOverrides.length === 0) return preset.layout;

      const mergedSlots: SlotConfig[] = preset.layout.slots.map((slot) => {
        const override = slotOverrides.find((o) => o.slotId === slot.slotId);
        if (!override) return slot;
        return {
          ...slot,
          className: override.className ?? slot.className,
          style: override.style ?? slot.style,
          children: override.children,
        };
      });

      return { ...preset.layout, slots: mergedSlots };
    }
  }

  if (inlineLayout) return inlineLayout;

  return { slots: [{ slotId: "body", children: [] }] };
}
