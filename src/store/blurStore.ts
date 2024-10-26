import { create } from "zustand";

interface blurStore {
  isBlur: boolean;
  setBlur: (Blur: boolean) => void;
}

const blurStore = create<blurStore>((set) => ({
  isBlur: false,
  setBlur: (Blur) => set({ isBlur: Blur }),
}));

export default blurStore;
