// hooks/useChat.ts
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import AxiosClient from "@/service/AxiosClient";
import useMessageStore from "@/store/messageStore";
import { useQueryClient } from "@tanstack/react-query";
const useChat = (roomId: string | null, userId: string) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { addMessage, setMessages } = useMessageStore();
  useEffect(() => {
    const newSocket = io("http://localhost:3002");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || roomId === "-1") return;

    socket.emit("joinRoom", roomId);

    const handleNewMessage = (message: any) => {
      const newMessage = {
        id: message.id,
        content: message.content,
        senderId: message.sender,
        roomId: message.room.id,
        sent_at: message.sent_at,
      };
      queryClient.invalidateQueries({ queryKey: ["roomsForUser"] });
      if (newMessage.roomId === roomId) {
        addMessage(newMessage);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("errorNewChat", (error) => {
      console.error("Error received from server:", error);
    });
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, roomId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!socket) return;

      try {
        if (!socket || !roomId || roomId !== "-1") {
          const response = await AxiosClient.get(`/messages/${roomId}`);
          if (Array.isArray(response.data) && response.data.length > 0) {
            setMessages(response.data);
          } else {
            setMessages(null);
          }
        }
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
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return { isLoading, error, sendMessage };
};

export default useChat;
