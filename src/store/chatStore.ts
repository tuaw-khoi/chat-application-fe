import { create } from "zustand";

// Định nghĩa kiểu dữ liệu cho tin nhắn
interface Message {
  id: string;
  content: string;
  senderId: string;
  roomId: string;
}

export interface chatFriend {
  id: string;
  fullname: string;
  img: string;
  roomId?: string;
  type?: string;
}

interface ChatStore {
  messages: Message[];
  chatIsChoiced: chatFriend | null;
  setChat: (chat: chatFriend | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

// Tạo store với Zustand
const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  chatIsChoiced: null,
  setChat: (chat) => set({ chatIsChoiced: chat }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));

export default useChatStore;
