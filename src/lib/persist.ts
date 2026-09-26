import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import { createJSONStorage } from "zustand/middleware";

/** On-device JSON storage for persisted Zustand stores (localStorage on web). */
export const deviceStorage = createJSONStorage(() => AsyncStorage);

type PersistedStore = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (listener: () => void) => () => void;
  };
};

/**
 * AsyncStorage is async, so persisted stores start empty and fill in a tick
 * later. Gate UI on this to avoid flashing the "empty" state on launch.
 */
export function useHydrated(store: PersistedStore) {
  return useSyncExternalStore(
    (onChange) => store.persist.onFinishHydration(onChange),
    () => store.persist.hasHydrated(),
    () => false,
  );
}
