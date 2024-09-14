import AxiosClient from "@/service/AxiosClient";
import useRoomStore from "@/store/roomStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const useRoom = () => {
  const queryClient = useQueryClient();
  // Hook để lấy danh sách các phòng của người dùng

  const useRoomsForUser = (userId: string) => {
    const { data, error, isLoading } = useQuery({
      queryKey: ["roomsForUser", userId],
      queryFn: async () => {
        const response = await AxiosClient.get(`/chat/${userId}/rooms`);
        return response.data;
      },
      staleTime: 0,
    });

    return { data, error, isLoading };
  };

  return {
    useRoomsForUser,
  };
};

export default useRoom;
