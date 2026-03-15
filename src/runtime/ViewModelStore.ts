import { UINode, ScreenState } from "../core/ui-tree/types";

export type ScreenViewModel = {
  path: string;
  isActive: 0 | 1;
  uiTree: UINode;
  screenState: ScreenState;
};

const store = new Map<string, ScreenViewModel>();

export const ViewModelStore = {
  getOrCreate(
    path: string,
    initialTree: UINode,
    initialState: ScreenState = {},
  ): ScreenViewModel {
    const existing = store.get(path);
    if (existing && existing.isActive === 1) {
      return existing;
    }

    const vm: ScreenViewModel = {
      path,
      isActive: 1,
      uiTree: initialTree,
      screenState: { ...initialState },
    };

    store.set(path, vm);
    return vm;
  },

  save(path: string, uiTree: UINode, screenState: ScreenState): void {
    const existing = store.get(path);
    if (!existing) return;

    store.set(path, { ...existing, uiTree, screenState });
  },

  setActive(path: string, isActive: 0 | 1): void {
    const existing = store.get(path);
    if (!existing) return;

    if (isActive === 0) {
      store.delete(path);
    } else {
      store.set(path, { ...existing, isActive });
    }
  },

  get(path: string): ScreenViewModel | undefined {
    return store.get(path);
  },

  has(path: string): boolean {
    return store.has(path);
  },
};
