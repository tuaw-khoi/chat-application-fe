import { create } from "zustand";

interface Message {
  id: number;
  content: string;
  senderId: string | { id: string };
  roomId: number;
  type?: string;
}

interface MessageStore {
  messages: Message[];
  lastedMessage: string | null; // lastedMessage là một chuỗi string hoặc null
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[] | null) => void;
  setLastedMessage: (message: string) => void;
}

const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  lastedMessage: null, // Khởi tạo lastedMessage với null
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      lastedMessage: message.content, // Cập nhật lastedMessage với nội dung tin nhắn mới
    })),
  setMessages: (messages) =>
    set({
      messages: messages || [],
      lastedMessage:
        messages && messages.length > 0
          ? messages[messages.length - 1].content
          : null,
    }),
  setLastedMessage: (message) => set({ lastedMessage: message }),
}));

export default useMessageStore;
