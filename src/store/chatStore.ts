import create from "zustand";

// Định nghĩa kiểu dữ liệu cho tin nhắn
interface Message {
  id: string;
  content: string;
  senderId: string;
  roomId: string;
}

// Định nghĩa kiểu dữ liệu cho store
interface ChatStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}



// Tạo store với Zustand
const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));

export default useChatStore;
