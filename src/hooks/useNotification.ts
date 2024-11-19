import AxiosClient from "@/service/AxiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const useNotifications = () => {
  const queryClient = useQueryClient();
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;

  // Lấy danh sách thông báo
  const getNotifications = () => {
    return useQuery({
      queryKey: ["notifications", storedUser?.id],
      queryFn: async () => {
        const response = await AxiosClient.get("/notifications");
        return response.data;
      },
      enabled: !!storedUser?.id, 
      refetchInterval: 3000, 
    });
  };

  // Đánh dấu một thông báo là đã đọc
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await AxiosClient.patch(
        `/notifications/${notificationId}/read`
      );
      return response.data;
    },
    onSuccess: () => {
      // Làm mới danh sách thông báo sau khi cập nhật trạng thái
      queryClient.invalidateQueries({
        queryKey: ["notifications", storedUser?.id],
      });
    },
    onError: (error) => {
      console.error("Lỗi khi đánh dấu thông báo là đã đọc:", error);
    },
  });

  return {
    getNotifications,
    markAsRead,
  };
};

export default useNotifications;
