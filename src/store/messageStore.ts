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
  lastedMessage: string | null; // lastedMessage là một chuỗi string hoặc null
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
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
      messages,
      lastedMessage:
        messages.length > 0 ? messages[messages.length - 1].content : null, // Cập nhật lastedMessage với nội dung tin nhắn cuối cùng hoặc null nếu mảng rỗng
    }),
  setLastedMessage: (message) => set({ lastedMessage: message }),
}));

export default useMessageStore;
