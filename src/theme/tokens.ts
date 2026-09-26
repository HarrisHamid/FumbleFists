/**
 * Raw brand values for APIs that can't take a className (native tab bar,
 * navigation theme, status bar, Reanimated). Mirrors the @theme block in
 * src/global.css — change both together.
 */
export const colors = {
  ink: "#1b120b",
  paper: "#f2e7ca",
  cream: "#e3d2b0",
  flame: "#f65311",
  match: "#f7cd3a",
  blood: "#c93029",
  card: "#261a11",
  cardRaised: "#312317",
  muted: "#baad92",
  border: "rgba(255,255,255,0.10)",
} as const;

export const fonts = {
  display: "BebasNeue_400Regular",
  anton: "Anton_400Regular",
  body: "Archivo_400Regular",
  bodyMedium: "Archivo_500Medium",
  bodyBold: "Archivo_700Bold",
  mono: "JetBrainsMono_400Regular",
  monoBold: "JetBrainsMono_700Bold",
} as const;
