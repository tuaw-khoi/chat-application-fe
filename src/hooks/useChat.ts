// hooks/useChat.ts
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import AxiosClient from "@/service/AxiosClient";
import useMessageStore from "@/store/messageStore";
import messageStore from "@/store/messageStore";

type Message = {
  id: number;
  content: string;
  senderId: string;
  roomId: number;
};

const useChat = (roomId: number, userId: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { setLastedMessage } = messageStore();
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

    socket.emit("joinRoom", roomId);

    const handleNewMessage = (message: any) => {
      const newMessage = {
        id: message.id,
        content: message.content,
        senderId: message.sender,
        roomId: message.room.id,
      };
      if (newMessage.roomId === roomId) {
        addMessage(newMessage);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, roomId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!socket) return;

      try {
        const response = await AxiosClient.get(`/messages/${roomId}`);
        setMessages(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Error loading messages");
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [roomId, socket]);

  const sendMessage = async (content: string) => {
    if (content.trim() === "") return;

    try {
      socket?.emit("sendMessage", {
        content,
        senderId: userId,
        roomId,
      });
      setLastedMessage(content);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return { isLoading, error, sendMessage };
};

export default useChat;
