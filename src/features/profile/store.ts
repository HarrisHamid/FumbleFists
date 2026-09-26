import { create } from "zustand";
import { persist } from "zustand/middleware";

import { deviceStorage } from "@/lib/persist";

import { discardPhoto } from "./photo";
import type { MyProfile } from "./types";

type ProfileState = {
  profile: MyProfile | null;
  saveProfile: (profile: MyProfile) => void;
  clearProfile: () => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      saveProfile: (profile) => {
        const previousPhoto = get().profile?.photoUri;
        if (previousPhoto && previousPhoto !== profile.photoUri) discardPhoto(previousPhoto);
        set({ profile });
      },
      clearProfile: () => {
        discardPhoto(get().profile?.photoUri);
        set({ profile: null });
      },
    }),
    { name: "fumblefists-profile", storage: deviceStorage, version: 1 },
  ),
);
