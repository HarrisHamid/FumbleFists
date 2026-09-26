import { File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

/**
 * Let the user pick a card photo, cropped to the card's 4:5 frame. On device
 * the picker returns a cache file the OS may purge, so it's copied into the
 * app's document directory. Returns null if the user cancels.
 */
export async function pickCardPhoto(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 5],
    quality: 0.8,
  });
  if (result.canceled || !result.assets[0]) return null;

  const uri = result.assets[0].uri;
  if (Platform.OS === "web") return uri;

  const extension = uri.split(".").pop()?.split("?")[0] || "jpg";
  const kept = new File(Paths.document, `card-photo-${Date.now()}.${extension}`);
  new File(uri).copySync(kept);
  return kept.uri;
}

/** Delete a photo this app kept. Safe to call with undefined or an already-deleted URI. */
export function discardPhoto(uri: string | undefined) {
  if (!uri || Platform.OS === "web" || !uri.startsWith(Paths.document.uri)) return;
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // Already gone — nothing to clean up.
  }
}
