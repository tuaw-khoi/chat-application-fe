import AxiosClient from "@/service/AxiosClient";
import searchFoundStore from "@/store/userFoundStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
const useUser = () => {
  const { setSearchUser } = searchFoundStore();
  const queryClient = useQueryClient();
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;

  const updateProfile = useMutation({
    mutationFn: async (updateUserDto: any) => {
      const response = await AxiosClient.put(
        `user/${storedUser.id}/profile`,
        updateUserDto
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", storedUser.id] });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  const changePassword = useMutation({
    mutationFn: async (changePasswordDto: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const response = await AxiosClient.put(
        `user/${storedUser.id}/change-password`,
        changePasswordDto
      );
      return response.data;
    },
    onSuccess: () => {},
    onError: (error) => {
      console.error("Error changing password:", error);
    },
  });

  const searchNewFriend = useMutation({
    mutationFn: async (emailorusername: string) => {
      const query = emailorusername.trim();
      const response = await AxiosClient.post(`user/searchNewFriend`, {
        query,
        userId: storedUser.id,
      });
      return response.data;
    },
    onSuccess: async (data) => {
      setSearchUser(data);
    },
  });
  const getUserInfo = (userId: string) =>
    useQuery({
      queryKey: ["userInfo", userId],
      queryFn: async () => {
        if (!userId) {
          throw new Error("User ID is required.");
        }
        const response = await AxiosClient.get(`user/${userId}/info`);
        return response.data;
      },
    });

  const getUser = (userId: string) =>
    useQuery({
      queryKey: ["user", userId],
      queryFn: async () => {
        if (!userId) {
          throw new Error("User ID is required.");
        }
        const response = await AxiosClient.get(`user/${userId}`);
        return response.data;
      },
      enabled: !!userId, // Chỉ gọi API nếu có userId
    });

  const getManagerInfo = () =>
    useQuery({
      queryKey: ["managerInfo"],
      queryFn: async () => {
        const response = await AxiosClient.get("user");
        return response.data;
      },
    });

  return {
    updateProfile,
    changePassword,
    searchNewFriend,
    getUserInfo,
    getUser,
    getManagerInfo,
  };
};

export default useUser;
