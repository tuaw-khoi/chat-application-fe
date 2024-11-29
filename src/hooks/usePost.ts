import AxiosClient from "@/service/AxiosClient";
import { TPost } from "@/types/post";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

interface CreatePostDto {
  content: string;
  isPublic: boolean;
  photos?: string[]; // Assuming this is an array of photo URLs
}

export type GetPostsResponse = {
  data: TPost[];
  total: number;
  currentPage: number;
  totalPages: number;
};

const usePost = () => {
  const queryClient = useQueryClient();

  const usePostsForUser = (
    userId: string,
    page: number = 1,
    limit: number = 10
  ) => {
    const { data, error, isLoading } = useQuery({
      queryKey: ["postsForUser", userId, page, limit],
      queryFn: async () => {
        const response = await AxiosClient.get(
          `/posts?page=${page}&limit=${limit}`
        );
        return response.data;
      },
      refetchInterval: 2000,
      staleTime: 60000,
      refetchOnWindowFocus: false,
    });

    return { data, error, isLoading };
  };

  const useCreatePost = () => {
    const mutation = useMutation({
      mutationFn: async (createPostDto: CreatePostDto) => {
        const response = await AxiosClient.post("/posts", createPostDto);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["postsForUserAndFriends"] });
        queryClient.invalidateQueries({
          queryKey: ["postsForUser"],
        });
      },
      onError: (error) => {
        console.error("Error creating post:", error);
      },
    });

    return {
      mutate: mutation.mutate,
      isError: mutation.isError,
      isSuccess: mutation.isSuccess,
    };
  };

  const usePostDetails = (postId: string | null | undefined) => {
    const { data, error, isLoading } = useQuery({
      queryKey: ["postDetails", postId],
      queryFn: async () => {
        if (!postId) {
          throw new Error("Post ID is required");
        }
        const response = await AxiosClient.get(`/posts/${postId}`);
        return response.data;
      },
      refetchInterval: 2000,
      staleTime: 0,
      enabled: !!postId,
    });

    return { data, error, isLoading };
  };

  const useUpdatePost = () => {
    const mutation = useMutation({
      mutationFn: async ({
        postId,
        updatePostDto,
      }: {
        postId: string;
        updatePostDto: CreatePostDto;
      }) => {
        console.log(updatePostDto);
        const response = await AxiosClient.put(
          `/posts/${postId}`,
          updatePostDto
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["postsForUser"] });
      },
      onError: (error) => {
        console.error("Error updating post:", error);
      },
    });

    return { mutate: mutation.mutate };
  };

  const useDeletePost = () => {
    const mutation = useMutation({
      mutationFn: async (postId: string) => {
        const response = await AxiosClient.delete(`/posts/${postId}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["postsForUser"] });
      },
      onError: (error) => {
        console.error("Error deleting post:", error);
      },
    });

    return { mutate: mutation.mutate };
  };

  const useInfinitePostsForUserAndFriends = () => {
    return useInfiniteQuery<GetPostsResponse, Error>({
      queryKey: ["postsForUserAndFriends"],
      queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
        const response = await AxiosClient.get(
          `/posts/friends?page=${pageParam}&limit=10`
        );
        // console.log(response.data);
        return response.data;
      },
      refetchInterval: 1000,
      getNextPageParam: (lastPage: any) =>
        lastPage.currentPage < lastPage.totalPages
          ? Number(lastPage.currentPage) + 1
          : undefined,
    });
  };

  const useInfinitePostsForUser = (userId: string) => {
    return useInfiniteQuery<GetPostsResponse, Error>({
      queryKey: ["postsForUser", userId], // Thêm userId vào queryKey để cache theo userId
      queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
        const response = await AxiosClient.get(`/posts/allPost`, {
          params: {
            userId, // Thêm userId vào tham số truy vấn
            page: pageParam,
            limit: 10,
          },
        });
        return response.data;
      },
      refetchInterval: 1000,
      getNextPageParam: (lastPage: any) =>
        lastPage.currentPage < lastPage.totalPages
          ? Number(lastPage.currentPage) + 1
          : undefined,
    });
  };

  return {
    usePostsForUser,
    useCreatePost,
    usePostDetails,
    useUpdatePost,
    useDeletePost,
    useInfinitePostsForUserAndFriends,
    useInfinitePostsForUser,
  };
};

export default usePost;
