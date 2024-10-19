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
import useFriends from "@/hooks/useFriends";

// Định nghĩa kiểu dữ liệu cho tin nhắn
interface MessageForm {
  message: string;
}

const ChatIO = () => {
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const userId = storedUser?.id;
  const { roomIsChoiced } = roomStore();
  const { chatIsChoiced } = useChatStore();
  const { messages } = useMessageStore();
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const roomId = roomIsChoiced?.roomId ?? "-1";
  const newChatResult = useNewChat(userId, chatIsChoiced?.id ?? null);
  const roomChatResult = useChat(roomId, userId);
  const { checkFriendship } = useFriends();
  let sendMessage: ((message: string) => void) | undefined;
  let sendNewMessage: ((message: string) => void) | undefined;
  const { data: isFriends, isLoading } = checkFriendship(
    userId,
    roomIsChoiced?.receiveId ?? ""
  );
  if (chatIsChoiced !== null) {
    sendNewMessage =
      chatIsChoiced?.roomId === null || chatIsChoiced?.roomId === undefined
        ? newChatResult.sendNewMessage
        : undefined;
  } else {
    sendMessage = roomChatResult.sendMessage;
  }
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onSubmit = (data: MessageForm) => {
    if (!!roomIsChoiced?.receiveId && (!isFriends || isLoading)) {
      setErrorMessage(
        "Bạn không thể gửi tin nhắn vì hai người không phải là bạn bè."
      );
      return; // Không gửi tin nhắn nếu không phải bạn bè
    }

    if (sendNewMessage) {
      sendNewMessage(data.message);
    } else if (sendMessage) {
      sendMessage(data.message);
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
  }, [messages, roomIsChoiced]);

  return (
    <div className="p-4 bg-gray-100 flex flex-col h-[95vh]">
      <div className="flex-grow overflow-y-auto mb-4 pr-2 bg-white shadow-lg rounded">
        {messages && messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 p-2 max-w-xs rounded shadow ${
                  (typeof message.senderId === "string" &&
                    message.senderId === userId) ||
                  (typeof message.senderId === "object" &&
                    message.senderId.id === userId)
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
          <div className="text-center text-gray-500">Chưa có tin nhắn nào</div>
        )}
      </div>

      {/* Hiển thị thông báo lỗi nếu có */}
      {errorMessage && (
        <div className="mb-2 text-red-500 text-center">{errorMessage}</div>
      )}

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
        <Button
          disabled={!!roomIsChoiced?.receiveId && (!isFriends || isLoading)}
          type="submit"
        >
          Gửi
        </Button>
      </form>
    </div>
  );
};

export default ChatIO;
