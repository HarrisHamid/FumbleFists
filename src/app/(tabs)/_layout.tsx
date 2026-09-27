import { NativeTabs } from "expo-router/unstable-native-tabs";

import { unreadCount, useChatStore } from "@/features/chat/store";
import { colors } from "@/theme/tokens";

export default function TabLayout() {
  const unread = useChatStore((s) =>
    Object.values(s.threads).reduce((sum, thread) => sum + unreadCount(thread), 0),
  );

  return (
    <NativeTabs
      backgroundColor={colors.ink}
      tintColor={colors.flame}
      iconColor={{ default: colors.muted, selected: colors.flame }}
      indicatorColor={colors.cardRaised}
      labelStyle={{ default: { color: colors.muted }, selected: { color: colors.paper } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Spar</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "flame", selected: "flame.fill" }}
          md="sports_mma"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="matches">
        <NativeTabs.Trigger.Label>Matches</NativeTabs.Trigger.Label>
        {unread > 0 ? <NativeTabs.Trigger.Badge>{String(unread)}</NativeTabs.Trigger.Badge> : null}
        <NativeTabs.Trigger.Icon
          sf={{
            default: "bubble.left.and.bubble.right",
            selected: "bubble.left.and.bubble.right.fill",
          }}
          md="forum"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="bouts">
        <NativeTabs.Trigger.Label>Bouts</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "calendar", selected: "calendar" }} md="event" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="me">
        <NativeTabs.Trigger.Label>Me</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "person", selected: "person.fill" }} md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
