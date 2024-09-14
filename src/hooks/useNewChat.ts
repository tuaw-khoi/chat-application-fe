// hooks/useChat.ts
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import AxiosClient from "@/service/AxiosClient";
import useMessageStore from "@/store/messageStore";
import messageStore from "@/store/messageStore";
import useChatStore from "@/store/chatStore";

type newRoomChat = {
  content: string;
  senderId: string;
  reciveId?: string;
};

const useNewChat = (senderId: string, reciveId: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [newRoomId, setNewRoomId] = useState<number>();
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { chatIsChoiced, setChat } = useChatStore();
  const { addMessage, setMessages } = useMessageStore();
  useEffect(() => {
    const newSocket = io("http://localhost:3002");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleSetNewMessage = (newRoomId: number) => {
      if (chatIsChoiced) {
        setChat({
          ...chatIsChoiced, // Giữ lại các thuộc tính khác của `chatIsChoiced`
          roomId: newRoomId, // Cập nhật `roomId` với `newRoomId` mới
        });
      }
    };

    socket.on("newroomId", handleSetNewMessage);
  }, [socket]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!socket) return;

      try {
        if (chatIsChoiced?.roomId === undefined) return;
        const response = await AxiosClient.get(
          `/messages/${chatIsChoiced?.roomId}`
        );
        setMessages(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Error loading messages");
        setIsLoading(false);
      }
    };

    if (chatIsChoiced?.roomId !== null) {
      fetchMessages();
    }
  }, [chatIsChoiced?.roomId, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", chatIsChoiced);

    const handleNewMessage = (message: any) => {
      const newMessage = {
        id: message.id,
        content: message.content,
        senderId: message.sender,
        roomId: message.room.id,
      };
      if (newMessage.roomId === chatIsChoiced?.id) {
        addMessage(newMessage);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("errorNewChat", (error) => {
      console.error("Error received from server:", error);
      alert(`Error: ${error.message}`);
    });
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [chatIsChoiced?.roomId, socket]);

  const sendNewMessage = async (content: string) => {
    if (content.trim() === "") return;

    try {
      socket?.emit("sendMessage", {
        content,
        senderId: senderId,
        reciveId: reciveId,
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return { isLoading, error, sendNewMessage };
};

export default useNewChat;
