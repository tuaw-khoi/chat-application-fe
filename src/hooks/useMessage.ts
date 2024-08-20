import AxiosClient from "@/service/AxiosClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const useMessage = () => {
  const queryClient = useQueryClient();

  // Hook để lấy tin nhắn của một phòng cụ thể
  const getMessages = (roomId: string) => {
    return useQuery({
      queryKey: ["messages", roomId],
      queryFn: async () => {
        const response = await AxiosClient.get(`/messages/${roomId}`);
        return response.data;
      },
      staleTime: 0,
    });
  };

  return {
    getMessages,
  };
};

export default useMessage;
