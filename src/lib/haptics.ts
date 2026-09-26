import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

// expo-haptics has no web implementation; keep call sites platform-agnostic.
const enabled = Platform.OS !== "web";

export const haptics = {
  tick: () => enabled && Haptics.selectionAsync(),
  thud: (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) =>
    enabled && Haptics.impactAsync(style),
  success: () => enabled && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  error: () => enabled && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};
