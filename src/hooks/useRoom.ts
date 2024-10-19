import AxiosClient from "@/service/AxiosClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
interface CreateRoomDto {
  name: string;
  img?: string;
  members: string[];
  userId: string;
}

const useRoom = () => {
  const queryClient = useQueryClient();
  // Hook để lấy danh sách các phòng của người dùng

  const usePublicRooms = () => {
    const { data, error, isLoading } = useQuery({
      queryKey: ["publicRooms"],
      queryFn: async () => {
        const response = await AxiosClient.get("/rooms/public");
        return response.data;
      },
      staleTime: 0,
    });

    return { data, error, isLoading };
  };

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

  const useCreateRoom = () => {
    const mutation = useMutation({
      mutationFn: async (createRoomDto: CreateRoomDto) => {
        const response = await AxiosClient.post("/rooms/group", createRoomDto);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["publicRooms"] });
        queryClient.invalidateQueries({ queryKey: ["roomsForUser"] });
      },
      onError: (error) => {
        console.error("Error creating room:", error);
      },
    });

    return {
      mutate: mutation.mutate,
      isError: mutation.isError,
      isSuccess: mutation.isSuccess,
    };
  };

  return {
    useRoomsForUser,
    usePublicRooms,
    useCreateRoom,
  };
};

export default useRoom;
