import AxiosClient from "@/service/AxiosClient";
import useRoomStore from "@/store/roomStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const useRoom = () => {
  const queryClient = useQueryClient();
  const { setRooms } = useRoomStore();
  // Hook để lấy danh sách các phòng của người dùng

  const useRoomsForUser = (userId: string) => {
    const { data, error, isLoading } = useQuery({
      queryKey: ["roomsForUser", userId],
      queryFn: async () => {
        const response = await AxiosClient.get(`/chat/${userId}/rooms`);
        setRooms(response.data);
        return response.data;
      },
      staleTime: 0,
    });

    return { data, error, isLoading };
  };

  // Hook để lấy thông tin chi tiết của một phòng cụ thể
  const getRoomDetails = (roomId: string) => {
    return useQuery({
      queryKey: ["room", roomId],
      queryFn: async () => {
        const response = await AxiosClient.get(`/rooms/${roomId}`);
        return response.data;
      },
    });
  };

  // Hook để tham gia vào một phòng
  const joinRoom = useMutation({
    mutationFn: async (roomId: string) => {
      const response = await AxiosClient.post(`/rooms/${roomId}/join`);
      return response.data;
    },
  });

  // Hook để rời khỏi một phòng
  const leaveRoom = useMutation({
    mutationFn: async (roomId: string) => {
      const response = await AxiosClient.post(`/rooms/${roomId}/leave`);
      return response.data;
    },
  });

  return {
    useRoomsForUser,
    getRoomDetails,
    joinRoom,
    leaveRoom,
  };
};

export default useRoom;
