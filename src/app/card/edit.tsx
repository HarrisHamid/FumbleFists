import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button";
import { Stamp } from "@/components/stamp";
import { ChipSelect, Field, FieldLabel } from "@/features/profile/form-fields";
import { discardPhoto, pickCardPhoto } from "@/features/profile/photo";
import { useProfileStore } from "@/features/profile/store";
import { CLASS_YEARS, type ProfileDraft, type ProfileErrors } from "@/features/profile/types";
import { BIO_MAX_LENGTH, emptyDraft, toDraft, validateDraft } from "@/features/profile/validate";
import { entrance } from "@/theme/motion";

/** Dismiss the editor; on a cold deep link there's nothing to go back to. */
function close() {
  if (router.canGoBack()) router.back();
  else router.replace("/me");
}

export default function EditCardScreen() {
  const insets = useSafeAreaInsets();
  const saved = useProfileStore((s) => s.profile);
  const saveProfile = useProfileStore((s) => s.saveProfile);

  const [draft, setDraft] = useState<ProfileDraft>(() => (saved ? toDraft(saved) : emptyDraft()));
  const [errors, setErrors] = useState<ProfileErrors>({});

  const set =
    <K extends keyof ProfileDraft>(key: K) =>
    (value: ProfileDraft[K]) => {
      setDraft((d) => ({ ...d, [key]: value }));
      if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    };

  // A photo picked during this edit but not saved is ours to clean up.
  const dropUnsavedPhoto = (uri: string | undefined) => {
    if (uri && uri !== saved?.photoUri) discardPhoto(uri);
  };

  const choosePhoto = async () => {
    const uri = await pickCardPhoto();
    if (!uri) return;
    dropUnsavedPhoto(draft.photoUri);
    set("photoUri")(uri);
  };

  const removePhoto = () => {
    dropUnsavedPhoto(draft.photoUri);
    set("photoUri")(undefined);
  };

  const cancel = () => {
    dropUnsavedPhoto(draft.photoUri);
    close();
  };

  const submit = () => {
    const result = validateDraft(draft);
    if (!result.ok) {
      setErrors(result.errors);
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    saveProfile(result.profile);
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    close();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-ink"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: Platform.OS === "ios" ? 20 : insets.top + 12,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ width: "100%", maxWidth: 440, alignSelf: "center" }}>
          <View className="mb-5 flex-row items-center justify-between">
            <Pressable onPress={cancel} accessibilityRole="button" hitSlop={12}>
              <Text className="font-mono text-[10px] tracking-[2px] text-cream/60">← CANCEL</Text>
            </Pressable>
            <Stamp label={saved ? "EDIT CARD" : "NEW FIGHTER INTAKE"} color="flame" delayMs={200} />
          </View>

          <Animated.View style={entrance.rise}>
            <Text className="font-anton text-4xl leading-[44px] text-paper">
              WHO ARE WE{"\n"}
              <Text className="text-flame">THROWING IN?</Text>
            </Text>
            <Text className="mt-3 font-body text-[13px] leading-5 text-cream/75">
              Your card is what goes up against the deck. Make the rage honest.
            </Text>
          </Animated.View>

          <Animated.View style={[entrance.rise, { animationDelay: "150ms" }]}>
            <View className="mt-7 gap-4 rounded-2xl border border-white/10 bg-card p-5">
              <View>
                <FieldLabel label="FIGHT PHOTO (OPTIONAL)" />
                <View className="flex-row items-center gap-4">
                  <Pressable
                    onPress={choosePhoto}
                    accessibilityRole="button"
                    accessibilityLabel={draft.photoUri ? "Change photo" : "Add photo"}
                    className="overflow-hidden rounded-lg border border-dashed border-white/25 bg-black/30"
                    style={{ width: 84, aspectRatio: 4 / 5 }}
                  >
                    {draft.photoUri ? (
                      <Image
                        source={{ uri: draft.photoUri }}
                        contentFit="cover"
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <View className="flex-1 items-center justify-center">
                        <Text className="font-anton text-3xl text-flame">+</Text>
                      </View>
                    )}
                  </Pressable>
                  <View className="flex-1 gap-2">
                    <Pressable onPress={choosePhoto} accessibilityRole="button">
                      <Text className="font-mono text-[10px] tracking-[2px] text-paper">
                        {draft.photoUri ? "CHANGE PHOTO" : "ADD PHOTO"}
                      </Text>
                    </Pressable>
                    {draft.photoUri ? (
                      <Pressable onPress={removePhoto} accessibilityRole="button">
                        <Text className="font-mono text-[10px] tracking-[2px] text-blood">
                          REMOVE
                        </Text>
                      </Pressable>
                    ) : (
                      <Text className="font-body text-[12px] leading-4 text-cream/50">
                        Skip it and your card shows your initials.
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              <Field
                label="FIGHTER NAME"
                value={draft.name}
                onChangeText={set("name")}
                error={errors.name}
                placeholder="e.g. Alex Rivera"
                autoCapitalize="words"
                maxLength={28}
              />

              <Field
                label="MAJOR"
                value={draft.major}
                onChangeText={set("major")}
                error={errors.major}
                placeholder="Comp Sci"
                autoCapitalize="words"
                maxLength={20}
              />

              <ChipSelect
                label="CLASS"
                options={CLASS_YEARS}
                value={draft.year}
                onChange={set("year")}
              />

              <View className="flex-row gap-3">
                <Field
                  label="GPA (FALLING)"
                  value={draft.gpa}
                  onChangeText={set("gpa")}
                  error={errors.gpa}
                  placeholder="2.4"
                  keyboardType="decimal-pad"
                  maxLength={4}
                />
                <Field
                  label="EXAM YOU FAILED"
                  value={draft.failed}
                  onChangeText={set("failed")}
                  error={errors.failed}
                  placeholder="CALC II"
                  autoCapitalize="characters"
                  maxLength={12}
                />
              </View>

              <View>
                <Field
                  label="RAGE BIO"
                  value={draft.bio}
                  onChangeText={set("bio")}
                  error={errors.bio}
                  placeholder="Channel the F. What happened, and what are you going to punch about it?"
                  multiline
                  maxLength={BIO_MAX_LENGTH}
                />
                <Text className="mt-1 text-right font-mono text-[9px] text-cream/35">
                  {draft.bio.length}/{BIO_MAX_LENGTH}
                </Text>
              </View>

              <Button label={saved ? "REPRINT MY CARD" : "PRINT MY CARD"} onPress={submit} />

              <Text className="text-center font-mono text-[9px] tracking-[1.2px] text-cream/35">
                STORED ON THIS PHONE ONLY
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
