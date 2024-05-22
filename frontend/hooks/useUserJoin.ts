import { create, useStore } from "zustand";

interface UserState {
  name: string;
  updateName: (newName: string) => void;
}

export const useUserJoinStore = create<UserState>((set) => ({
  name: "",
  updateName: (newName: string) => set({ name: newName }),
}));
