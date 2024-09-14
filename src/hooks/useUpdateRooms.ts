import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateRooms = (rooms: any) => {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Establish a socket connection
    const newSocket = io("http://localhost:3002");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);
  if (!socket) return;

  rooms.forEach((room: any) => {
    socket.emit("joinRoom", room.id);
  });

  

};

export default useUpdateRooms;
