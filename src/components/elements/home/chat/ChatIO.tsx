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
import useUploadImage from "@/hooks/useUploadImg";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

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
  let sendMessage: ((message: string, type: string) => void) | undefined;
  let sendNewMessage: ((message: string, type: string) => void) | undefined;
  const { uploadImage, loading: uploadLoading } = useUploadImage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
    const type = "TEXT";
    if (sendNewMessage) {
      sendNewMessage(data.message, type);
    } else if (sendMessage) {
      sendMessage(data.message, type);
    }
    reset();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && sendMessage) {
      const uploadResult = await uploadImage(file);
      if (uploadResult && uploadResult.imageUrl) {
        sendMessage(uploadResult.imageUrl, "IMG");
      }
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  const closeDialog = () => {
    setSelectedImage(null);
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
        <div className="mt-3">
          {messages && messages.length > 0 ? (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: "block",
                    marginBottom: "0.6rem",
                    textAlign:
                      (typeof message.senderId === "string" &&
                        message.senderId === userId) ||
                      (typeof message.senderId === "object" &&
                        message.senderId.id === userId)
                        ? "right"
                        : "left",
                  }}
                >
                  {/* Kiểm tra loại tin nhắn để hiển thị đúng */}
                  {message.type === "IMG" ? (
                    <img
                      src={message.content}
                      alt="Uploaded"
                      onClick={() => handleImageClick(message.content)}
                      className={`rounded-3xl shadow cursor-pointer ${
                        (typeof message.senderId === "string" &&
                          message.senderId === userId) ||
                        (typeof message.senderId === "object" &&
                          message.senderId.id === userId)
                          ? "ml-auto"
                          : "mr-auto ml-2"
                      }`}
                      style={{
                        width: "250px",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className={`py-1.5 px-2 break-words rounded-3xl shadow ${
                        (typeof message.senderId === "string" &&
                          message.senderId === userId) ||
                        (typeof message.senderId === "object" &&
                          message.senderId.id === userId)
                          ? "bg-blue-500 text-white ml-auto text-right"
                          : "bg-gray-300 text-black mr-auto text-left ml-2"
                      }`}
                      style={{
                        display: "inline-block",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                        maxWidth: "50%",
                      }}
                    >
                      {message.content}
                    </div>
                  )}
                </div>
              ))}
              {/* Phần tử dùng để cuộn xuống cuối */}
              {selectedImage && (
                <Dialog open onOpenChange={closeDialog}>
                  <DialogContent>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                    <img
                      className="w-full h-full cursor-pointer"
                      src={selectedImage}
                      alt="Phóng to"
                    />
                    <DialogClose>
                      <Button className="mt-4">Đóng</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              )}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="text-center text-gray-500">
              Chưa có tin nhắn nào
            </div>
          )}
        </div>
      </div>

      {/* Hiển thị thông báo lỗi nếu có */}
      {errorMessage && (
        <div className="mb-2 text-red-500 text-center">{errorMessage}</div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center space-x-2"
      >
        <div className="px-1">
          <label htmlFor="file-input">
            <img
              className="w-8 h-8 cursor-pointer hover:bg-gray-300 rounded"
              src="src/asset/sendFile.svg"
              alt="Upload"
            />
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

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
