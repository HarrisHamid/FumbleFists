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

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ink } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
