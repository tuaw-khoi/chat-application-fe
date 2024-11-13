import AxiosClient from "@/service/AxiosClient";
import { TLike } from "@/types/like";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useLike = () => {
  const queryClient = useQueryClient();

  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      const response = await AxiosClient.post(`/posts/${postId}/likes`);
      return response.data as TLike;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["postLikes"] });
      queryClient.invalidateQueries({ queryKey: ["postsForUserAndFriends"] });
    },
    onError: (error) => {
      console.error("Error liking post:", error);
    },
  });

  const unlikePost = useMutation({
    mutationFn: async (postId: string) => {
      await AxiosClient.delete(`/posts/${postId}/likes`);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["postLikes", variables] });
      queryClient.invalidateQueries({ queryKey: ["postsForUserAndFriends"] });
    },
    onError: (error) => {
      console.error("Error unliking post:", error);
    },
  });

  return {
    like: likePost.mutate,
    unlike: unlikePost.mutate,
    likeError: likePost.isError,
    unlikeError: unlikePost.isError,
  };
};

export default useLike;
