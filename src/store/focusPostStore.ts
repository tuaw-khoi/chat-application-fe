import { create } from "zustand";

interface StorePostState {
  isFocusedPost: boolean;
  setFocusPost: (focused: boolean) => void;
  postIsChoiced: string | null;
  setPost: (postId: string | null) => void;
}

const focusPostStore = create<StorePostState>((set) => ({
  isFocusedPost: false,
  setFocusPost: (focused) => set({ isFocusedPost: focused }),
  postIsChoiced: null,
  setPost: (postId) => set({ postIsChoiced: postId }),
}));

export default focusPostStore;
