import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useChat from "@/hooks/useChat";
import useMessageStore from "@/store/messageStore";
import Cookies from "js-cookie";
import useChatStore from "@/store/chatStore";
import useNewChat from "@/hooks/useNewChat";
import roomStore from "@/store/roomStore";
import { useEffect, useRef, useState } from "react";

// Định nghĩa kiểu dữ liệu cho tin nhắn
interface MessageForm {
  message: string;
}

const ChatIO = () => {
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const userId = storedUser?.id;
  const { roomIsChoiced, setRoom } = roomStore();

  const { chatIsChoiced } = useChatStore();
  const { messages } = useMessageStore();
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const roomId = roomIsChoiced?.roomId ?? -1;

  if (!messages) {
    setRoom(null);
  }

  const chatResult = useChat(chatIsChoiced?.roomId ?? -1, userId);
  const newChatResult = useNewChat(userId, chatIsChoiced?.id ?? "");
  const roomChatResult = useChat(roomId, userId);

  let sendMessage: ((message: string) => void) | undefined;
  let sendNewMessage: ((message: string) => void) | undefined;

  if (roomIsChoiced === null) {
    sendMessage = chatIsChoiced?.roomId ? chatResult.sendMessage : undefined;
    sendNewMessage =
      chatIsChoiced?.roomId === null ? newChatResult.sendNewMessage : undefined;
  } else {
    sendMessage = roomChatResult.sendMessage;
  }


  const onSubmit = (data: MessageForm) => {
    if (sendMessage) {
      sendMessage(data.message);
    } else if (sendNewMessage) {
      sendNewMessage(data.message);
    }
    reset();
  };

  // Ref để cuộn xuống cuối danh sách tin nhắn
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <div className="p-4 bg-gray-100 flex flex-col h-[95vh]">
      <div className="flex-grow overflow-y-auto mb-4 pr-2 bg-white shadow-lg rounded">
        {messages?.length > 0 ? (
          <>
            {messages?.map((message) => (
              <div
                key={message.id}
                className={`mb-2 p-2 max-w-xs rounded shadow ${
                  message.senderId === userId
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-300 text-black mr-auto"
                }`}
              >
                {message.content}
              </div>
            ))}
            {/* Phần tử dùng để cuộn xuống cuối */}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div></div>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center space-x-2"
      >
        <Input
          type="text"
          placeholder="Aa"
          {...register("message", { required: true })}
          className="flex-grow"
        />
        <Button type="submit">Gửi</Button>
      </form>
    </div>
  );
};

export default ChatIO;
