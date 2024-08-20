import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const serverUrl = "http://localhost:3002";
  useEffect(() => {
    // Tạo kết nối WebSocket
    const newSocket = io(serverUrl, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    // Đăng ký sự kiện khi kết nối
    newSocket.on("connect", () => {
      setConnected(true);
      console.log("Connected to WebSocket server");
    });

    // Đăng ký sự kiện khi mất kết nối
    newSocket.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from WebSocket server");
    });

    // Dọn dẹp khi component bị unmount
    return () => {
      newSocket.disconnect();
    };
  }, [serverUrl]);

  // Function để gửi tin nhắn
  const sendMessage = (data: {
    content: string;
    roomId?: string;
    senderId: string;
    reciveId?: string;
  }) => {
    if (socket) {
      socket.emit("sendMessage", data);
    }
  };

  // Function để tham gia vào phòng
  const joinRoom = (roomId: number) => {
    if (socket) {
      socket.emit("joinRoom", roomId);
    }
  };

  // Function để rời khỏi phòng
  const leaveRoom = (roomId: number) => {
    if (socket) {
      socket.emit("leaveRoom", roomId);
    }
  };

  // Function để lắng nghe tin nhắn mới
  const listenToNewMessage = (callback: (data: any) => void) => {
    if (socket) {
      socket.on("newMessage", callback);
    }
  };

  return {
    socket,
    connected,
    sendMessage,
    joinRoom,
    leaveRoom,
    listenToNewMessage,
  };
};

export default useSocket;
