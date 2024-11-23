import AxiosClient from "@/service/AxiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useFriendReq = () => {
  const queryClient = useQueryClient();

  // Hook để lấy danh sách các lời mời kết bạn
  const useFriendRequests = (userId: string) => {
    const { data, error, isLoading } = useQuery({
      queryKey: ["friendRequests", userId],
      queryFn: async () => {
        const response = await AxiosClient.get(
          `/friend-requests/pending?userId=${userId}`
        );
        return response.data;
      },
      staleTime: 0,
      refetchInterval: 1000,
    });
    return { data, error, isLoading };
  };

  const useGetSentFriendRequests = (userId: string) => {
    const { data, error, isLoading } = useQuery({
      queryKey: ["sentFriendRequests", userId],
      queryFn: async () => {
        const response = await AxiosClient.get(
          `/friend-requests/sent?userId=${userId}`
        );
        return response.data;
      },
      staleTime: 0,
      refetchInterval: 1000,
    });
    return { data, error, isLoading };
  };

  // Hàm chấp nhận hoặc từ chối lời mời kết bạn
  const acceptFriendRequest = useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: {
      requestId: number;
      status: "accepted" | "rejected";
    }) => {
      const response = await AxiosClient.patch(
        `/friend-requests/${requestId}`,
        { status }
      );
      return response.data;
    },
    onSuccess: () => {
      // Sau khi thành công, làm mới danh sách lời mời kết bạn
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error: any) => {
      console.error("Error responding to friend request:", error);
    },
  });

  const checkFriendRequestStatus = async (userId1: string, userId2: string) => {
    const response = await AxiosClient.get(`/friend-requests/status`, {
      params: { userId1, userId2 },
    });
    return response.data;
  };

  const check = (userId1: string, userId2: string) => {
    const { data, isPending, error } = useQuery({
      queryKey: ["friend-request-status", userId1, userId2],
      queryFn: async () => {
        console.log(userId1, userId2);
        const response = await AxiosClient.get(`/friend-requests/status`, {
          params: { userId1, userId2 },
        });
        return response.data;
      },
    });

    return { data, isPending, error };
  };

  const cancelFriendRequest = useMutation({
    mutationFn: async ({
      userId,
      friendId,
    }: {
      userId: string;
      friendId: string;
    }) => {
      const response = await AxiosClient.delete(
        `/friend-requests/${userId}/cancel-request/${friendId}`
      );
      return response.data;
    },
    onSuccess: () => {
      // Cập nhật state hoặc làm mới danh sách nếu cần
      queryClient.invalidateQueries({
        queryKey: ["sentFriendRequests"],
      });
    },
    onError: (error: any) => {
      console.error("Error cancelling friend request:", error);
    },
  });

  const suggestFriends = (userId: string) => {
    const { data, error, isLoading } = useQuery({
      queryKey: ["suggestFriends", userId], // Gắn userId vào queryKey để cache
      queryFn: async () => {
        if (!userId) {
          throw new Error("UserId is required");
        }
        // Gửi userId qua query parameters
        const response = await AxiosClient.get(`/friend-requests/suggestions`, {
          params: { userId },
        });
        return response.data;
      },
      refetchOnWindowFocus: false,
      enabled: !!userId, // Chỉ thực hiện query nếu userId tồn tại
    });

    return { data, error, isLoading };
  };

  return {
    useFriendRequests,
    acceptFriendRequest,
    checkFriendRequestStatus,
    cancelFriendRequest,
    check,
    suggestFriends,
    useGetSentFriendRequests,
  };
};

export default useFriendReq;
