// hooks/useFriend.ts
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import useFriendStore from "@/store/friendStore";

interface FriendResult {
  id: string;
  fullname: string;
  img: string;
  roomId?: string;
}

const useFriend = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const { setFriendsResult } = useFriendStore();
  useEffect(() => {
    const newSocket = io("http://localhost:3002");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleSearchFriendsResult = (data: FriendResult[] | string) => {
      if (data === "name") {
        setFriendsResult([]);
        return;
      }
      setFriendsResult(data);
      setLoading(false);
    };

    socket.on("searchFriendsResult", handleSearchFriendsResult);

    return () => {
      socket.off("searchFriendsResult", handleSearchFriendsResult);
    };
  }, [socket]);

  const searchFriends = (query: string) => {
    // console.log(query);
    if (socket) {
      setLoading(true);
      socket.emit("searchFriends", { query, userId: storedUser.id });
    }
  };

  useEffect(() => {
    if (query) {
      searchFriends(query);
    }
  }, [query]);

  return { loading, setQuery, searchFriends };
};

export default useFriend;
