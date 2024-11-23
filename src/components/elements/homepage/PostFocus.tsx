import usePost from "@/hooks/usePost";
import Cookies from "js-cookie";
import { useState } from "react";
import PostDetail from "./PostDetail";
import focusPostStore from "@/store/focusPostStore";

const PostFocus = () => {
  const { usePostDetails } = usePost();
  const { postIsChoiced } = focusPostStore();
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : "";
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const { data, error, isLoading } = usePostDetails(postIsChoiced);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;
  return (
    <div className="bg-white flex-grow mt-2 rounded-2xl">
      <PostDetail
        key={data.id}
        post={data}
        user={user}
        isExpanded={expandedPosts[data?.id] || false}
        toggleExpand={toggleExpand}
      />
    </div>
  );
};

export default PostFocus;
