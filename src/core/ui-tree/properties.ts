import { ScreenProperties, ScreenState } from "./types";

export function resolveInitialState(properties: ScreenProperties): ScreenState {
    return Object.fromEntries(
        Object.entries(properties).map(([key, def]) => [key, def.defaultValue]),
    );
}