import AxiosClient from "@/service/AxiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateCommentDto, TComment, UpdateCommentDto } from "@/types/comment";

const useComment = () => {
  const queryClient = useQueryClient();

  const createComment = useMutation({
    mutationFn: async (newComment: CreateCommentDto) => {
      const response = await AxiosClient.post(`/comments`, newComment);
      return response.data as TComment;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
    },
  });

  const updateComment = useMutation({
    mutationFn: async ({
      id,
      updatedComment,
    }: {
      id: string;
      updatedComment: UpdateCommentDto;
    }) => {
      const response = await AxiosClient.put(`/comments/${id}`, updatedComment);
      return response.data as TComment;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.id],
      });
    },
    onError: (error) => {
      console.error("Error updating comment:", error);
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (id: string) => {
      await AxiosClient.delete(`/comments/${id}`);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables],
      });
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });

  const getCommentChilds = (id: string) => {
    return useQuery({
      queryKey: ["comment-replies", id],
      queryFn: async () => {
        const response = await AxiosClient.get(`/comments/${id}/replies`);
        return response.data as TComment[];
      },
      refetchInterval: 1000,
    });
  };

  return {
    create: createComment.mutate,
    update: updateComment.mutate,
    deleteCmt: deleteComment.mutate,
    createError: createComment.isError,
    updateError: updateComment.isError,
    deleteError: deleteComment.isError,
    getCommentChilds,
  };
};

export default useComment;
