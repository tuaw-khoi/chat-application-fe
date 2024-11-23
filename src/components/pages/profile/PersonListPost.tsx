import usePost from "@/hooks/usePost";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { TPost } from "@/types/post";
import PostDetail from "@/components/elements/homepage/PostDetail";

type TUserId = {
  userId: string;
};

const PersonListPost = ({ userId }: TUserId) => {
  const { useInfinitePostsForUser } = usePost();
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: string]: boolean;
  }>({});
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : "";
  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfinitePostsForUser(userId);

  // Cấu hình useInView để phát hiện khi phần tử cuối cùng hiện ra
  const [ref, inView] = useInView();

  // Gọi fetchNextPage khi inView trở thành true (tức là phần tử cuối hiện ra)
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div className="bg-white flex-grow mt-2 rounded-2xl">
      {data?.pages.map((page: any) =>
        page.data.map((post: TPost) => (
          <PostDetail
            key={post.id}
            post={post}
            user={user}
            isExpanded={expandedPosts[post.id] || false}
            toggleExpand={toggleExpand}
          />
        ))
      )}

      {/* Phần tử dùng để theo dõi khi scroll tới cuối */}
      <div ref={ref} className="loading-indicator z-50 h-5 opacity-0">
        {isFetchingNextPage && <p>Loading more...</p>}
      </div>
    </div>
  );
};

export default PersonListPost;
