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

  return {
    useFriendRequests,
    acceptFriendRequest,
  };
};

export default useFriendReq;
