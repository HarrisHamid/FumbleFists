import type { ReactNode } from "react";
import { Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Phone-width column; keeps the card layout intact on tablets and web previews.
const MAX_CONTENT_WIDTH = 440;
// On web, NativeTabs renders a floating tab bar across the top of the page.
const WEB_TAB_BAR_OFFSET = Platform.OS === "web" ? 64 : 0;
// On device the native tab bar floats over the bottom of the content.
const NATIVE_TAB_BAR_OFFSET = Platform.select({ ios: 64, android: 80, default: 0 });

/** Full-bleed ink background with safe-area padding and a centered phone-width column. */
export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: insets.top + 12 + WEB_TAB_BAR_OFFSET,
    paddingBottom: insets.bottom + 24 + NATIVE_TAB_BAR_OFFSET,
  };
  const column = (
    <View style={{ width: "100%", maxWidth: MAX_CONTENT_WIDTH, alignSelf: "center" }}>
      {children}
    </View>
  );

  if (!scroll) {
    return (
      <View className="flex-1 bg-ink px-4" style={padding}>
        {column}
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-ink"
      contentContainerStyle={[padding, { paddingHorizontal: 16 }]}
    >
      {column}
    </ScrollView>
  );
}
