import AxiosClient from "@/service/AxiosClient";
import searchFoundStore from "@/store/userFoundStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
const useUser = () => {
  const { setSearchUser } = searchFoundStore();
  const queryClient = useQueryClient();
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  // const { data } = useQuery({
  //   queryKey: ["users"],
  //   queryFn: async () => {
  //     const response = await AxiosClient.get("user");
  //     return response.data.data;
  //   },
  // });

  // const deleteUser = useMutation({
  //   mutationFn: async (id: string) => {
  //     return AxiosClient.delete(`user/deleteUser?UserIds=${id}`);
  //   },
  //   onSuccess: async () => {
  //     queryClient.invalidateQueries({ queryKey: ["users"] });
  //   },
  // });

  // const updateUser = async (user: TUser, id: string) => {
  //   await AxiosClient.post(`user/updateUser`, {
  //     UserId: id,
  //     ...user,
  //   });
  //   queryClient.invalidateQueries({ queryKey: ["users"] });
  // };

  // const changePassword = useMutation({
  //   mutationFn: async ({
  //     userId,
  //     oldPassword,
  //     newPassword,
  //   }: {
  //     userId: string;
  //     oldPassword: string;
  //     newPassword: string;
  //   }) => {
  //     const response = await AxiosClient.post("/user/updatePassword", {
  //       userId,
  //       oldPassword,
  //       newPassword,
  //     });
  //     return response.data;
  //   },

  //   onSuccess: (data) => {
  //     queryClient.invalidateQueries({ queryKey: ["user"] });
  //   },
  // });

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

  return {
    // data,
    // deleteUser,
    // updateUser,
    // changePassword,
    searchNewFriend,
  };
};

export default useUser;
