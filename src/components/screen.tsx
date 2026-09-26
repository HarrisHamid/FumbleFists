import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Full-bleed ink background with safe-area padding and a centered phone-width column. */
export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const insets = useSafeAreaInsets();
  const padding = { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 };

  if (!scroll) {
    return (
      <View className="flex-1 bg-ink px-4" style={padding}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-ink"
      contentContainerStyle={[padding, { paddingHorizontal: 16 }]}
    >
      {children}
    </ScrollView>
  );
}
