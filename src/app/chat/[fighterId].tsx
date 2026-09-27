import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { css } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { openThread, sendMessage } from "@/features/chat/bot";
import { type Message, useChatStore } from "@/features/chat/store";
import { initials } from "@/features/deck/fighter-card";
import { ROSTER_BY_ID } from "@/features/deck/roster";
import { useProfileStore } from "@/features/profile/store";
import { haptics } from "@/lib/haptics";
import { springOut } from "@/theme/motion";
import { colors } from "@/theme/tokens";

const QUICK_JABS = [
  "You're going down.",
  "What's your GPA again?",
  "When and where?",
  "What are the rules?",
  "Ngl I'm a little scared",
  "Good luck. You'll need it.",
];

const popIn = css.keyframes({
  from: { opacity: 0, transform: [{ translateY: 12 }, { scale: 0.92 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
});

const bounce = css.keyframes({
  "0%": { transform: [{ translateY: 0 }], opacity: 0.4 },
  "30%": { transform: [{ translateY: -5 }], opacity: 1 },
  "60%": { transform: [{ translateY: 0 }], opacity: 0.4 },
  "100%": { transform: [{ translateY: 0 }], opacity: 0.4 },
});

const avatarTone = {
  flame: "text-flame",
  match: "text-match",
  blood: "text-blood",
  cream: "text-cream",
} as const;

function timeLabel(at: number) {
  return new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function Bubble({ message, animate }: { message: Message; animate: boolean }) {
  const mine = message.from === "me";
  return (
    <Animated.View
      style={{
        alignSelf: mine ? "flex-end" : "flex-start",
        maxWidth: "80%",
        ...(animate
          ? {
              animationName: popIn,
              animationDuration: "320ms",
              animationTimingFunction: springOut,
              animationFillMode: "both",
            }
          : null),
      }}
    >
      <View
        className={`rounded-2xl px-4 py-2.5 ${mine ? "rounded-br-md bg-flame" : "rounded-bl-md border border-white/10 bg-card"}`}
      >
        <Text className={`font-body text-[15px] leading-5 ${mine ? "text-ink" : "text-paper"}`}>
          {message.text}
        </Text>
      </View>
    </Animated.View>
  );
}

function TypingBubble() {
  return (
    <View className="flex-row gap-1.5 self-start rounded-2xl rounded-bl-md border border-white/10 bg-card px-4 py-3.5">
      {[0, 150, 300].map((delay) => (
        <Animated.View
          key={delay}
          className="size-2 rounded-full bg-cream"
          style={{
            animationName: bounce,
            animationDuration: "1100ms",
            animationDelay: `${delay}ms`,
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </View>
  );
}

export default function ChatScreen() {
  const { fighterId } = useLocalSearchParams<{ fighterId: string }>();
  const fighter = ROSTER_BY_ID[fighterId ?? ""];
  const insets = useSafeAreaInsets();
  const profile = useProfileStore((s) => s.profile);
  const messages = useChatStore((s) => s.threads[fighterId ?? ""]?.messages);
  const typing = useChatStore((s) => !!s.typing[fighterId ?? ""]);
  const markRead = useChatStore((s) => s.markRead);

  const [draft, setDraft] = useState("");
  const [openedAt] = useState(() => Date.now());
  const scroller = useRef<ScrollView>(null);

  // Older matches may not have an opener yet.
  useEffect(() => {
    if (fighter) openThread(fighter.id, profile);
  }, [fighter, profile]);

  // Anything that arrives while you're looking counts as read.
  const count = messages?.length ?? 0;
  useEffect(() => {
    if (fighter && count) markRead(fighter.id);
  }, [fighter, count, markRead]);

  // A new message from them gets a little buzz.
  const last = messages?.[messages.length - 1];
  useEffect(() => {
    if (last && last.from === "them" && last.at > openedAt) haptics.tick();
  }, [last, openedAt]);

  if (!fighter) {
    return (
      <View className="flex-1 items-center justify-center bg-ink">
        <Text className="font-anton text-2xl text-cream/60">FIGHTER NOT FOUND</Text>
      </View>
    );
  }

  const send = (text: string) => {
    if (!text.trim()) return;
    haptics.thud();
    sendMessage(fighter.id, text, profile);
    setDraft("");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-ink"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        className="flex-row items-center gap-3 border-b border-white/10 px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={12}
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/matches"))}
          className="pr-1"
        >
          <Text className="font-anton text-2xl leading-8 text-cream/70">←</Text>
        </Pressable>
        <View className="size-11 items-center justify-center rounded-xl bg-card-raised">
          <Text className={`font-anton text-lg leading-6 ${avatarTone[fighter.tone ?? "flame"]}`}>
            {initials(fighter.name)}
          </Text>
        </View>
        <View className="flex-1">
          <Text numberOfLines={1} className="font-anton text-xl leading-7 text-paper">
            {fighter.name}
          </Text>
          <Text numberOfLines={1} className="font-mono text-[9px] tracking-[1.4px] text-cream/50">
            {typing
              ? "TYPING…"
              : `${fighter.record} · FAILED ${fighter.failed} · GPA ${fighter.gpa}`}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scroller}
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 8, flexGrow: 1, justifyContent: "flex-end" }}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scroller.current?.scrollToEnd({ animated: true })}
      >
        <View className="mb-4 items-center">
          <Text className="rounded border-2 border-match px-2 font-anton text-sm leading-6 tracking-[1.5px] text-match">
            MATCHED
          </Text>
          <Text className="mt-2 text-center font-mono text-[9px] tracking-[1.4px] text-cream/40">
            YOU AND {fighter.name.split(" ")[0]} BOTH SWIPED RIGHT
          </Text>
        </View>
        {messages?.map((m, i) => {
          const prev = messages[i - 1];
          const showTime = !prev || m.at - prev.at > 5 * 60_000;
          return (
            <View key={m.id} className="gap-2">
              {showTime ? (
                <Text className="mt-2 text-center font-mono text-[9px] tracking-[1.2px] text-cream/35">
                  {timeLabel(m.at)}
                </Text>
              ) : null}
              <Bubble message={m} animate={m.at > openedAt} />
            </View>
          );
        })}
        {typing ? <TypingBubble /> : null}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        className="grow-0"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8 }}
      >
        {QUICK_JABS.map((jab) => (
          <Pressable
            key={jab}
            accessibilityRole="button"
            onPress={() => send(jab)}
            className="rounded-full border border-white/15 bg-card px-3 py-2"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text className="font-body text-[13px] text-cream/80">{jab}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View
        className="flex-row items-end gap-2 border-t border-white/10 px-4 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Talk your trash…"
          placeholderTextColor={`${colors.cream}66`}
          selectionColor={colors.flame}
          multiline
          maxLength={280}
          accessibilityLabel="Message"
          className="max-h-28 flex-1 rounded-2xl border border-white/15 bg-black/30 px-4 py-3 font-body text-[15px] text-paper"
          onSubmitEditing={() => send(draft)}
          submitBehavior="submit"
          returnKeyType="send"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send"
          disabled={!draft.trim()}
          onPress={() => send(draft)}
          className={`size-12 items-center justify-center rounded-full bg-flame ${draft.trim() ? "" : "opacity-30"}`}
          style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.9 : 1 }] })}
        >
          <Text className="font-anton text-xl leading-7 text-ink">GO</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
