import AxiosClient from "@/service/AxiosClient";
import { TRoomDetail } from "@/types/roomDetail";
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

  const usePublicRooms = (userId: string) => {
    const { data, error, isLoading } = useQuery({
      queryKey: ["publicRooms", userId],
      queryFn: async () => {
        const response = await AxiosClient.get(`/rooms/public/${userId}`);
        return response.data;
      },
      staleTime: 60000,
      refetchOnWindowFocus: false,
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

  const useRoomDetailsWithImages = (roomId: string | null | undefined) => {
    const { data, error, isLoading } = useQuery<TRoomDetail>({
      queryKey: ["roomDetailsWithImages", roomId],
      queryFn: async () => {
        if (!roomId) {
          throw new Error("Room ID is required");
        }
        const response = await AxiosClient.get(`/rooms/${roomId}/details`);
        return response.data;
      },
      staleTime: 0,
      enabled: !!roomId,
    });

    return { data, error, isLoading };
  };

  const addUsersToRoom = async (roomId: string, userIds: string[]) => {
    try {
      const response = await AxiosClient.post(`/rooms/${roomId}/add-users`, {
        userIds,
      });
      queryClient.invalidateQueries({
        queryKey: ["roomDetailsWithImages"],
      });
    } catch (error) {
      console.error("Error adding users:", error);
    }
  };

  const leaveRoom = async (roomId: string, userId: string) => {
    try {
      const response = await AxiosClient.post(`/rooms/${roomId}/leave`, {
        userId,
      });
      queryClient.invalidateQueries({
        queryKey: ["roomDetailsWithImages"],
      });
    } catch (error) {
      console.error("Error leaving room:", error);
      throw error;
    }
  };

  const removeUserFromRoomByAdmin = async (
    roomId: string,
    senderId: string,
    targetUserId: string
  ) => {
    try {
      const response = await AxiosClient.delete(
        `/rooms/${roomId}/remove-user`,
        {
          data: { senderId, targetUserId },
        }
      );
      queryClient.invalidateQueries({
        queryKey: ["roomDetailsWithImages"],
      });
    } catch (error) {
      console.error("Error removing user from room by admin:", error);
      throw error;
    }
  };

  const changeAdminStatus = async (
    roomId: string,
    senderId: string,
    targetUserId: string,
    isAdmin: boolean
  ) => {
    try {
      const response = await AxiosClient.patch(
        `/rooms/${roomId}/change-admin-status`,
        {
          senderId,
          targetUserId,
          isAdmin,
        }
      );
      queryClient.invalidateQueries({
        queryKey: ["roomDetailsWithImages", roomId],
      });
    } catch (error) {
      console.error("Error changing admin status:", error);
      throw error;
    }
  };

  const useUpdateRoomName = () => {
    const mutation = useMutation({
      mutationFn: async ({
        roomId,
        newName,
      }: {
        roomId: string;
        newName: string;
      }) => {
        const response = await AxiosClient.patch(`/rooms/${roomId}/name`, {
          newName,
        });
        return response.data; // Trả về dữ liệu từ phản hồi
      },
      onSuccess: (data, variables) => {
        const { roomId } = variables; // Lấy roomId từ biến truyền vào
        queryClient.invalidateQueries({ queryKey: ["roomDetailsWithImages"] });
        queryClient.invalidateQueries({ queryKey: ["publicRooms"] });
        queryClient.invalidateQueries({ queryKey: ["roomsForUser"] });
      },
      onError: (error) => {
        console.error("Error updating room name:", error); // Cập nhật thông báo lỗi
      },
    });
    return { mutate: mutation.mutate };
  };
  const useRoomBetweenUsers = (userId1: string, userId2: string) => {
    const { data, error, isLoading } = useQuery({
      queryKey: ["roomBetweenUsers", userId1, userId2],
      queryFn: async () => {
        const response = await AxiosClient.get(
          `/rooms/between/${userId1}/${userId2}`
        );
        return response.data;
      },
      staleTime: 60000,
      refetchOnWindowFocus: false,
    });

    return { data, error, isLoading };
  };

  return {
    useRoomsForUser,
    usePublicRooms,
    useCreateRoom,
    useRoomDetailsWithImages,
    addUsersToRoom,
    leaveRoom,
    removeUserFromRoomByAdmin,
    changeAdminStatus,
    useUpdateRoomName,
    useRoomBetweenUsers,
  };
};

export default useRoom;
