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
  return {
    addFriend,
    getAllFriends,
  };
};

export default useFriends;
