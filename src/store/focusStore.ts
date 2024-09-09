import create from "zustand";

interface StoreState {
  isFocused: boolean;
  setFocus: (focused: boolean) => void;
}

const focusStore = create<StoreState>((set) => ({
  isFocused: false,
  setFocus: (focused) => set({ isFocused: focused }),
}));

export default focusStore;
