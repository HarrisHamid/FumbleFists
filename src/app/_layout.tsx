import "@/global.css";

import { Anton_400Regular } from "@expo-google-fonts/anton";
import { Archivo_400Regular, Archivo_500Medium, Archivo_700Bold } from "@expo-google-fonts/archivo";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { JetBrainsMono_400Regular, JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono";
import { useFonts } from "expo-font";
import { DarkTheme, Stack, ThemeProvider, type Theme } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useProfileStore } from "@/features/profile/store";
import { useHydrated } from "@/lib/persist";
import { colors } from "@/theme/tokens";

SplashScreen.preventAutoHideAsync();

// The app is dark-only: the brand is ink/flame, not a light/dark pair.
const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.flame,
    background: colors.ink,
    card: colors.card,
    text: colors.paper,
    border: colors.border,
    notification: colors.blood,
  },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Anton_400Regular,
    BebasNeue_400Regular,
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  // First launch (no card yet) shows the landing page; the tabs unlock once a
  // card exists. Wait for storage so we don't flash the wrong one.
  const profileLoaded = useHydrated(useProfileStore);
  const hasCard = useProfileStore((s) => s.profile !== null);
  const ready = (fontsLoaded || !!fontError) && profileLoaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={navTheme}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ink } }}
        >
          <Stack.Protected guard={hasCard}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="chat/[fighterId]" />
            <Stack.Screen name="bout/book" options={{ presentation: "modal" }} />
            {/* No swipe-back mid-fight: leaving goes through TAP OUT. */}
            <Stack.Screen
              name="bout/[id]"
              options={{ gestureEnabled: false, animation: "fade_from_bottom" }}
            />
          </Stack.Protected>
          <Stack.Protected guard={!hasCard}>
            <Stack.Screen name="welcome" options={{ animation: "fade" }} />
          </Stack.Protected>
          <Stack.Screen name="card/edit" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
