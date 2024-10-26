import AxiosClient from "@/service/AxiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
const useFriends = () => {
  const queryClient = useQueryClient();
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;

  const addFriend = useMutation({
    mutationFn: async (receiverId: string) => {
      // Gửi POST request để gửi lời mời kết bạn
      const response = await AxiosClient.post("friend-requests", {
        senderId: storedUser.id,
        receiverId: receiverId,
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Lỗi khi gửi lời mời kết bạn:", error);
    },
  });

  const removeFriend = useMutation({
    mutationFn: async ({
      userId1,
      userId2,
    }: {
      userId1: string;
      userId2: string;
    }) => {
      const response = await AxiosClient.delete(
        `/friends/${userId1}/remove-friend/${userId2}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error: any) => {
      console.error("Error removing friend:", error);
    },
  });

  const getAllFriends = () => {
    return useQuery({
      queryKey: ["friends", storedUser.id],
      queryFn: async () => {
        const response = await AxiosClient.get(`friends/${storedUser.id}`);
        return response.data;
      },
      staleTime: 0,
    });
  };

  const checkFriendship = (userId1: string, userId2: string) => {
    return useQuery({
      queryKey: ["are-friends", userId1, userId2],
      queryFn: async () => {
        const response = await AxiosClient.get(
          `/friends/${userId1}/are-friends/${userId2}`
        );
        return response.data;
      },
      enabled: !!userId1 && !!userId2,
    });
  };

  return {
    addFriend,
    getAllFriends,
    removeFriend,
    checkFriendship,
  };
};

export default useFriends;
