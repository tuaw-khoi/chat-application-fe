import AxiosClient from "@/service/AxiosClient";
import { TUser } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useUser = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await AxiosClient.get("user");
      return response.data.data;
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      return AxiosClient.delete(`user/deleteUser?UserIds=${id}`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateUser = async (user: TUser, id: string) => {
    await AxiosClient.post(`user/updateUser`, {
      UserId: id,
      ...user,
    });
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const changePassword = useMutation({
    mutationFn: async ({
      userId,
      oldPassword,
      newPassword,
    }: {
      userId: string;
      oldPassword: string;
      newPassword: string;
    }) => {
      const response = await AxiosClient.post("/user/updatePassword", {
        userId,
        oldPassword,
        newPassword,
      });
      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return {
    data,
    deleteUser,
    updateUser,
    changePassword,
  };
};

export default useUser;
