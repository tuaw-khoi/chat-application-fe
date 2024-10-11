import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import AxiosClient from "@/service/AxiosClient";
import useMessageStore from "@/store/messageStore";
import useChatStore from "@/store/chatStore";
import roomStore, { Room } from "@/store/roomStore";

const useNewChat = (senderId: string, receiveId: string | null) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { chatIsChoiced, setChat } = useChatStore();
  const { setRoom } = roomStore();
  const { setMessages } = useMessageStore();
  useEffect(() => {
    const newSocket = io("http://localhost:3002");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchMessages = async (roomId: string) => {
    if (!roomId) return;

    try {
      const response = await AxiosClient.get(`/messages/${roomId}`);
      setMessages(response.data);
      setIsLoading(false);
    } catch (err) {
      setError("Error loading messages");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleSetNewRoom = (newRoom: Room) => {
      fetchMessages(newRoom.roomId);
      if (chatIsChoiced) {
        setChat(null);
        setRoom(newRoom);
      }
    };

    socket.on("newroomId", handleSetNewRoom);
    // Cleanup event listener on component unmount
    return () => {
      socket.off("newroomId", handleSetNewRoom);
    };
  }, [socket, chatIsChoiced]);

  // Send a new message to the server
  const sendNewMessage = async (content: string) => {
    if (content.trim() === "") return;
    try {
      socket?.emit("sendMessage", {
        content,
        senderId,
        receiveId,
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return { isLoading, error, sendNewMessage };
};

export default useNewChat;
