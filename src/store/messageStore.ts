// store/messageStore.ts
import create from "zustand";

interface Message {
  id: number;
  content: string;
  senderId: string;
  roomId: number;
}

interface MessageStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
}

const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
}));

export default useMessageStore;
