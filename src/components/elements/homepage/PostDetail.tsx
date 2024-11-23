import { useRef, useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { TPost } from "@/types/post";
import useLike from "@/hooks/useLike";
import useComment from "@/hooks/useComment";
import { TLike } from "@/types/like";
import { Textarea } from "@/components/ui/textarea";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useChatStore from "@/store/chatStore";
import roomStore from "@/store/roomStore";
import PhoneBookStore from "@/store/phoneBookStore";
import { TUser } from "@/types/user";
import getTimeDifference from "@/hooks/useData";
import { TComment } from "@/types/comment";
import ResponseComment from "./ResponseComment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PostDetailProps {
  post: TPost;
  user: TUser;
  isExpanded: boolean;
  toggleExpand: (postId: string) => void;
}
interface PostDetailProps {
  post: TPost;
  user: TUser;
}
type TOpenRepCmt = {
  isOpenCmt: boolean;
};

const PostDetail = ({
  post,
  user,
  isExpanded,
  toggleExpand,
}: PostDetailProps) => {
  const navigate = useNavigate();

  const handleNavigate = (userId: string) => {
    navigate(`/profile/${userId}`);
  };
  const { like, unlike } = useLike();
  const { create, update, deleteCmt } = useComment(); // Destructure create from useComment
  const [commentContent, setCommentContent] = useState<string>(""); // State for comment input
  const userId = user.id;
  const isLike = post?.likes?.some((like: TLike) => like.user?.id === userId);
  const { setChat } = useChatStore();
  const { setRoom } = roomStore();
  const { setPage } = PhoneBookStore();
  const latestCommentRef = useRef<HTMLDivElement | null>(null);
  const [repLiesCmt, setRepLiesCmt] = useState<{ [key: string]: TOpenRepCmt }>(
    {}
  );
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState<string>("");

  const handleEdit = (commentId: string, defaultValue: string) => {
    setEditingCommentId(commentId);
    setEditedComment(defaultValue);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null); // Thoát chế độ chỉnh sửa
    setEditedComment(""); // Reset giá trị chỉnh sửa
  };

  const handleUpdateComment = (commentId: string) => {
    if (!editedComment || editedComment.trim() === "") return;

    // Gửi API cập nhật comment
    update({ id: commentId, updatedComment: { content: editedComment } });

    handleCancelEdit();
  };

  const handleDelteComment = (commentId: string) => {
    if (!commentId) return;
    deleteCmt(commentId);
  };
  const displayedAuthors = new Set<string>();
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  const handleInputChange = (commentId: string, value: string) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [commentId]: value, // Cập nhật giá trị của phản hồi cho commentId
    }));
  };

  const toggleComment = (commentId: string) => {
    setRepLiesCmt((prevState) => ({
      ...prevState,
      [commentId]: {
        ...prevState[commentId],
        isOpenCmt: !prevState[commentId]?.isOpenCmt,
      },
    }));
  };

  const handleLikeToggle = () => {
    if (isLike) {
      unlike(post.id);
    } else {
      like(post.id);
    }
  };

  const handleNavigateMessage = (room: {
    id: string;
    name: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    img: string;
  }) => {
    setPage("chat");
    setChat(null);
    setRoom({
      roomName: room.name,
      roomImg: room.img,
      roomId: room.id,
    });
  };

  const handleNewChat = (id: string, fullname: string, img: string) => {
    setPage("chat");
    setRoom(null);
    setChat({ id, fullname, img });
  };

  const handleCommentSubmit = async (parentCommentId?: string) => {
    try {
      if (parentCommentId) {
        if (!responses[parentCommentId].trim()) return;
        await create({
          content: responses[parentCommentId],
          postId: post.id,
          parentCommentId,
        });
        setResponses((prevResponses) => {
          const newResponses = { ...prevResponses };
          delete newResponses[parentCommentId];
          return newResponses;
        });
      } else {
        // Nếu không có parentCommentId, tạo comment gốc
        if (!commentContent.trim()) return;
        await create({
          content: commentContent,
          postId: post.id,
        });
        setCommentContent("");

        if (latestCommentRef.current) {
          latestCommentRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  return (
    <div key={post.id} className="p-4 border-b pb-8">
      {/* Post header with author's info */}
      <div className="flex items-center mb-2">
        <img
          onClick={() => handleNavigate(post.author?.id)}
          src={
            post.author?.img === null
              ? "https://res.cloudinary.com/dfua5nwki/image/upload/v1732396647/chat-app/nawccyq44xjqwf6lrcyy.svg"
              : post.author?.img
          }
          alt={post.author?.fullname}
          className="w-8 h-8 rounded-full cursor-pointer"
        />
        <div className="ml-3">
          <div
            onClick={() => handleNavigate(post.author?.id)}
            className="font-semibold hover:underline cursor-pointer"
          >
            {post.author?.fullname}
          </div>
          <div className="text-xs text-gray-500">
            {format(new Date(post.createdAt), "dd MMM yyyy")}
          </div>
        </div>
      </div>

      {/* Post content */}
      <div className="text-gray-800 mb-2">
        {post?.content.length <= 500 || isExpanded
          ? post.content
          : `${post.content.substring(0, 500)}...`}
        {post?.content.length > 500 && (
          <button
            onClick={() => toggleExpand(post?.id)}
            className="text-blue-500 ml-2"
          >
            {isExpanded ? "Thu gọn" : "Xem thêm"}
          </button>
        )}
      </div>

      {/* Post photos */}
      {post.photos && post.photos.length > 0 && post.photos[0] !== "" && (
        <Dialog>
          <DialogTrigger asChild>
            <img
              src={post.photos[0]}
              alt="Post photo"
              className="w-full rounded-md mb-2 cursor-pointer"
            />
          </DialogTrigger>
          <DialogContent className="max-w-[70%] max-h-[90%] flex items-center justify-center">
            <img
              src={post.photos[0] || ""}
              alt="Full-sized photo"
              className="object-contain w-[80%] h-[70%]"
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Post actions */}
      <div className="flex items-center space-x-4 text-gray-600 justify-between mx-1 mt-3">
        <button className="flex items-center space-x-1 ml-1">
          <div className="w-4 mr-1">
            {isLike ? (
              <img
                onClick={handleLikeToggle}
                src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732396715/chat-app/xcyktrkmc3ebjpqyess4.svg"
                alt="Liked"
              />
            ) : (
              <img
                onClick={handleLikeToggle}
                src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732396711/chat-app/izvmdj98lgln1xnxiulx.svg"
                alt="Like"
              />
            )}
          </div>
          {post?.likes?.length !== 0 ? (
            <Dialog>
              <DialogTrigger>
                <HoverCard>
                  <HoverCardTrigger>
                    {isLike &&
                    post?.likes?.length &&
                    post?.likes?.length > 2 ? (
                      <span className="hover:underline">{`Bạn và ${
                        post?.likes?.length - 1
                      } người khác đã thích bài viết`}</span>
                    ) : (
                      <span className="hover:underline">
                        {post?.likes?.length}
                      </span>
                    )}
                  </HoverCardTrigger>
                  <HoverCardContent
                    className="text-sm text-left max-w-40 bg-gray-100 bg-opacity-90
            "
                  >
                    {post?.likes?.map((like: TLike) => (
                      <h1
                        onClick={() => handleNavigate(like?.user.id)}
                        key={like.id}
                        className="py-2 px-1 cursor-pointer hover:bg-white text-nowrap"
                      >
                        {like.user.fullname.length > 18
                          ? `${like.user.fullname.slice(0, 15)}...`
                          : like.user.fullname}
                      </h1>
                    ))}
                  </HoverCardContent>
                </HoverCard>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className=" border-b pb-2">
                    Tất cả cảm xúc
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                  {post?.likes?.map((like: TLike) => (
                    <div
                      key={like.id}
                      className="flex justify-between items-center py-1"
                    >
                      <div className="flex items-center space-x-2">
                        <Avatar
                          onClick={() => handleNavigate(like?.user.id)}
                          className={`flex mr-2 justify-center items-center cursor-pointer ${
                            like.user.img ? null : "bg-gray-400"
                          }`}
                        >
                          <AvatarImage
                            className={`rounded-full ${
                              like.user.img ? "w-9 h-9" : "w-7 h-7"
                            }`}
                            src={
                              like.user.img ||
                              "https://res.cloudinary.com/dfua5nwki/image/upload/v1732396647/chat-app/nawccyq44xjqwf6lrcyy.svg"
                            }
                            alt="Avatar"
                          />
                        </Avatar>
                        <h2
                          onClick={() => handleNavigate(like?.user.id)}
                          className="hover:underline cursor-pointer"
                        >
                          {like.user.fullname}
                        </h2>
                      </div>
                      {like.user.id === userId ? null : (
                        <div>
                          <Button
                            onClick={() => {
                              if (
                                like?.user?.roomUsers &&
                                like.user.roomUsers.length > 0
                              ) {
                                const room = like.user.roomUsers[0]?.room;
                                if (room) {
                                  handleNavigateMessage(room);
                                } else {
                                  console.log("Room ID not found");
                                }
                              } else {
                                handleNewChat(
                                  like.user.id,
                                  like.user.fullname,
                                  like.user.img
                                );
                              }
                            }}
                            className="bg-blue-500 hover:bg-blue-400"
                          >
                            Nhắn tin
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ) : null}
        </button>
        {post?.comments?.length === 0 ? null : (
          <Dialog>
            <DialogTrigger>
              <div className="flex items-center space-x-1">
                <HoverCard>
                  <HoverCardTrigger>
                    <span className="hover:underline">{post.totalComment}</span>
                  </HoverCardTrigger>
                  <HoverCardContent
                    className="text-sm text-left max-w-40 bg-gray-100 bg-opacity-90
            "
                  >
                    {post?.comments?.map((comment: TComment) => {
                      // Nếu author.id đã hiển thị thì không render bình luận này nữa
                      if (displayedAuthors.has(comment.author.id)) {
                        return null; // Không render comment này nếu author đã hiển thị
                      }
                      // Thêm author.id vào Set để đánh dấu đã hiển thị
                      displayedAuthors.add(comment.author.id);

                      return (
                        <h1
                          onClick={() => handleNavigate(comment?.author.id)}
                          key={comment.id}
                          className="py-2 px-1 cursor-pointer hover:bg-white text-nowrap"
                        >
                          {comment.author?.fullname.length > 18
                            ? `${comment.author.fullname.slice(0, 15)}...`
                            : comment.author.fullname}
                        </h1>
                      );
                    })}
                  </HoverCardContent>
                </HoverCard>
                <img
                  className="w-7"
                  src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732396733/chat-app/c5t0xoddpxc58i92wcxq.svg"
                  alt="Comment"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-[100dvh] max-h-[95dvh] -ml-5 px-0 pb-0 rounded-b-2xl">
              <DialogHeader>
                <DialogTitle className="text-center pb-6 border-b">{` Bài viết của ${post?.author?.fullname}`}</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto max-w-[100dvh] max-h-[60dvh] pl-3">
                <div className="flex items-center mb-2">
                  <img
                    onClick={() => handleNavigate(post?.author.id)}
                    src={
                      post.author.img ||
                      "https://res.cloudinary.com/dfua5nwki/image/upload/v1732396647/chat-app/nawccyq44xjqwf6lrcyy.svg"
                    }
                    alt={post.author?.fullname}
                    className="w-8 h-8 rounded-full cursor-pointer"
                  />
                  <div className="ml-3">
                    <div
                      onClick={() => handleNavigate(post?.author.id)}
                      className="font-semibold"
                    >
                      {post.author?.fullname}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(post.createdAt), "dd MMM yyyy")}
                    </div>
                  </div>
                </div>

                {/* Post content */}
                <div className="text-gray-800 mb-2">
                  {post.content.length <= 500 || isExpanded
                    ? post.content
                    : `${post.content.substring(0, 500)}...`}
                  {post.content.length > 500 && (
                    <button
                      onClick={() => toggleExpand(post.id)}
                      className="text-blue-500 ml-2"
                    >
                      {isExpanded ? "Thu gọn" : "Xem thêm"}
                    </button>
                  )}
                </div>

                {/* Post photos */}
                {post.photos &&
                  post.photos.length > 0 &&
                  post.photos[0] !== "" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <img
                          src={post.photos[0]}
                          alt="Post photo"
                          className="w-full rounded-md mb-2 cursor-pointer"
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-[70%] max-h-[90%] flex items-center justify-center">
                        <img
                          src={post.photos[0] || ""}
                          alt="Full-sized photo"
                          className="object-contain w-[80%] h-[70%]"
                        />
                      </DialogContent>
                    </Dialog>
                  )}

                {/* Post actions */}
                <div className="flex items-center space-x-4 text-gray-600 justify-between mx-1 mt-3">
                  <button className="flex items-center space-x-1 ml-1">
                    <div className="w-4 mr-1">
                      {isLike ? (
                        <img
                          onClick={handleLikeToggle}
                          src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732396715/chat-app/xcyktrkmc3ebjpqyess4.svg"
                          alt="Liked"
                        />
                      ) : (
                        <img
                          onClick={handleLikeToggle}
                          src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732396711/chat-app/izvmdj98lgln1xnxiulx.svg"
                          alt="Like"
                        />
                      )}
                    </div>
                    {post?.likes?.length !== 0 ? (
                      <Dialog>
                        <DialogTrigger>
                          <HoverCard>
                            <HoverCardTrigger>
                              {isLike &&
                              post?.likes?.length &&
                              post?.likes?.length > 2 ? (
                                <span className="hover:underline">{`Bạn và ${
                                  post?.likes?.length - 1
                                } người khác đã thích bài viết`}</span>
                              ) : (
                                <span className="hover:underline">
                                  {post?.likes?.length}
                                </span>
                              )}
                            </HoverCardTrigger>
                            <HoverCardContent
                              className="text-sm text-left max-w-40 bg-gray-100 bg-opacity-90
            "
                            >
                              {post?.likes?.map((like: TLike) => (
                                <h1
                                  onClick={() => handleNavigate(like?.user.id)}
                                  key={like.id}
                                  className="py-2 px-1 text-nowrap hover:bg-white"
                                >
                                  {like.user.fullname.length > 18
                                    ? `${like.user.fullname.slice(0, 15)}...`
                                    : like.user.fullname}
                                </h1>
                              ))}
                            </HoverCardContent>
                          </HoverCard>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className=" border-b pb-2">
                              Tất cả cảm xúc
                            </DialogTitle>
                            <DialogDescription></DialogDescription>
                            {post?.likes?.map((like: TLike) => (
                              <div
                                key={like.id}
                                className="flex justify-between items-center py-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <Avatar
                                    onClick={() =>
                                      handleNavigate(like?.user.id)
                                    }
                                    className={`flex mr-2 justify-center items-center cursor-pointer ${
                                      like.user.img ? null : "bg-gray-400"
                                    }`}
                                  >
                                    <AvatarImage
                                      className={`rounded-full ${
                                        like.user.img ? "w-9 h-9" : "w-7 h-7"
                                      }`}
                                      src={
                                        like.user.img ||
                                        "https://res.cloudinary.com/dfua5nwki/image/upload/v1732396647/chat-app/nawccyq44xjqwf6lrcyy.svg"
                                      }
                                      alt="Avatar"
                                    />
                                  </Avatar>
                                  <h2
                                    onClick={() =>
                                      handleNavigate(like?.user.id)
                                    }
                                    className="hover:underline cursor-pointer"
                                  >
                                    {like.user.fullname}
                                  </h2>
                                </div>
                                {like.user.id === userId ? null : (
                                  <div>
                                    <Button
                                      onClick={() => {
                                        if (
                                          like?.user?.roomUsers &&
                                          like.user.roomUsers.length > 0
                                        ) {
                                          const room =
                                            like.user.roomUsers[0]?.room;
                                          if (room) {
                                            handleNavigateMessage(room);
                                          } else {
                                            console.log("Room ID not found");
                                          }
                                        } else {
                                          handleNewChat(
                                            like.user.id,
                                            like.user.fullname,
                                            like.user.img
                                          );
                                        }
                                      }}
                                      className="bg-blue-500 hover:bg-blue-400"
                                    >
                                      Nhắn tin
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    ) : null}
                  </button>
                  {post?.comments?.length === 0 ? null : (
                    <div className="flex items-center space-x-1">
                      <HoverCard>
                        <HoverCardTrigger>
                          <span className="hover:underline  cursor-pointer">
                            {post?.totalComment}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="text-sm text-left max-w-40 bg-gray-100 bg-opacity-90
            "
                        >
                          {post?.comments?.map((comment: TComment) => (
                            <h1
                              onClick={() => handleNavigate(comment?.author.id)}
                              key={comment.id}
                              className="py-2 px-2 hover:bg-white text-nowrap cursor-pointer"
                            >
                              {comment.author?.fullname.length > 18
                                ? `${comment.author.fullname.slice(0, 15)}...`
                                : comment.author.fullname}
                            </h1>
                          ))}
                        </HoverCardContent>
                      </HoverCard>
                      <img
                        className="w-7"
                        src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732396733/chat-app/c5t0xoddpxc58i92wcxq.svg"
                        alt="Comment"
                      />
                    </div>
                  )}
                </div>
                <div className="h-[1px] my-4  w-[99%] bg-gray-300"></div>
                <div className="mt-5">
                  {/* display comment */}
                  <div className="space-y-3 ml-1 mt-4">
                    {post.comments
                      ?.filter((comment: TComment) => !comment.parentCommentId)
                      .map((comment: TComment, index: number) => (
                        <div
                          ref={index === 0 ? latestCommentRef : null}
                          key={comment.id}
                        >
                          <div className="flex items-start space-x-2">
                            <Avatar
                              onClick={() => handleNavigate(comment?.author.id)}
                              className="w-9 h-9 mt-2 cursor-pointer"
                            >
                              <AvatarImage
                                src={
                                  comment.author?.img ||
                                  "https://res.cloudinary.com/dfua5nwki/image/upload/v1732396647/chat-app/nawccyq44xjqwf6lrcyy.svg"
                                }
                                alt="User Avatar"
                              />
                            </Avatar>
                            {editingCommentId === comment.id ? (
                              // Hiển thị Textarea khi đang chỉnh sửa
                              <div className="relative my-2 w-[90%]">
                                <Textarea
                                  value={editedComment}
                                  onChange={(e) =>
                                    setEditedComment(e.target.value)
                                  }
                                  placeholder="Edit your comment..."
                                  className="w-full px-3 py-1  h-16 border rounded-md focus:outline-none resize-none min-h-10"
                                />
                                {editedComment === comment.content ? (
                                  <img
                                    src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732396722/chat-app/amg4wnurzmohynhkmgjl.svg"
                                    className="h-7 w-7 py-1 z-50 rounded-md right-1 bottom-6 absolute cursor-pointer opacity-50 pointer-events-none"
                                    alt="send message"
                                  />
                                ) : (
                                  <img
                                    onClick={() =>
                                      handleUpdateComment(comment.id)
                                    }
                                    src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732397023/chat-app/qxa7dfnhq3vwxn8hlono.svg"
                                    className="h-7 w-7 py-1 z-50 rounded-md right-1 bottom-6 absolute cursor-pointer"
                                    alt="send message"
                                  />
                                )}
                                <p className="text-[14px] text-gray-500 items-center ml-1 mt-1">
                                  Nhấn để
                                  <strong
                                    onClick={handleCancelEdit}
                                    className="ml-1 text-sm hover:underline text-blue-600 cursor-pointer"
                                  >
                                    hủy
                                  </strong>
                                  .
                                </p>
                              </div>
                            ) : (
                              // Hiển thị nội dung comment khi không chỉnh sửa
                              <div>
                                <div className="bg-gray-200 p-2 rounded-xl">
                                  <div
                                    onClick={() =>
                                      handleNavigate(comment?.author.id)
                                    }
                                    className="text-sm font-semibold cursor-pointer hover:underline"
                                  >
                                    {comment.author?.fullname}
                                  </div>
                                  <p className="text-gray-80 text-[14px] py-[1px]">
                                    {comment.content}
                                  </p>
                                </div>
                                <div className="flex space-x-3 text-[13px] text-gray-500 items-center ml-2 mt-1">
                                  <div className="">
                                    {getTimeDifference(comment.createdAt)}
                                  </div>
                                  <div
                                    onClick={() => toggleComment(comment.id)}
                                    className="cursor-pointer hover:underline"
                                  >
                                    Trả lời
                                  </div>
                                  <div>{comment.parentCommentId}</div>
                                </div>
                              </div>
                            )}

                            {editingCommentId === comment.id ||
                            comment.author.id !== userId ? null : (
                              <div className="">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="p-2 h-full mt-3 rounded-full"
                                    >
                                      <Ellipsis className="h-5 w-5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    {/* Mở dialog xóa*/}
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleEdit(
                                          comment.id,
                                          comment.content || ""
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      Chỉnh sửa
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDelteComment(comment.id)
                                      }
                                      className="cursor-pointer"
                                    >
                                      Xóa
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </div>
                          <ResponseComment comment={comment} postId={post.id} />
                          <div>
                            {repLiesCmt[comment.id]?.isOpenCmt == true ? (
                              <div className=" bg-gray-100 flex items-center rounded-2xl mt-3 ml-10">
                                <Avatar
                                  onClick={() => handleNavigate(user.id)}
                                  className={`flex mr-2 justify-center cursor-pointer  ${
                                    user ? null : "bg-gray-400"
                                  }`}
                                >
                                  <AvatarImage
                                    className={`rounded-full ${
                                      user.img ? "w-9 h-9" : "w-7 h-7"
                                    }`}
                                    src={
                                      user.img ||
                                      "https://res.cloudinary.com/dfua5nwki/image/upload/v1732396647/chat-app/nawccyq44xjqwf6lrcyy.svg"
                                    }
                                    alt="Avatar"
                                  />
                                </Avatar>
                                <div className="relative my-2 w-full mr-3">
                                  <Textarea
                                    value={responses[comment.id] || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        comment.id,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Add a comment..."
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault(); // Ngăn Enter tạo dòng mới
                                        handleCommentSubmit(comment?.id); // Gọi hàm gửi tin nhắn
                                      }
                                    }}
                                    className="w-full px-3 py-1 h-16  border rounded-md focus:outline-none resize-none min-h-10"
                                  />
                                  {responses[comment?.id] === "" ||
                                  responses[comment?.id] === undefined ? (
                                    <img
                                      src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732396722/chat-app/amg4wnurzmohynhkmgjl.svg"
                                      className="h-7 mt-2 w-7 py-1 z-50 rounded-md right-1 bottom-0 absolute cursor-pointer opacity-50 pointer-events-none"
                                      alt="send message"
                                    />
                                  ) : (
                                    <img
                                      onClick={() =>
                                        handleCommentSubmit(comment.id)
                                      }
                                      src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732397023/chat-app/qxa7dfnhq3vwxn8hlono.svg"
                                      className="h-7 mt-2 w-7 py-1 z-50 rounded-md right-1 bottom-0 absolute cursor-pointer"
                                      alt="send message"
                                    />
                                  )}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* input send cmt */}
              <div className=" bg-gray-100  flex items-center rounded-b-2xl">
                <Avatar
                  onClick={() => handleNavigate(user.id)}
                  className={`flex mr-2 justify-center cursor-pointer pl-1 items-center mb-5 ${
                    user ? null : "bg-gray-400"
                  }`}
                >
                  <AvatarImage
                    className={`rounded-full ${
                      user.img ? "w-9 h-9" : "w-7 h-7"
                    }`}
                    src={
                      user.img !== null
                        ? user.img
                        : "https://res.cloudinary.com/dfua5nwki/image/upload/v1732396647/chat-app/nawccyq44xjqwf6lrcyy.svg"
                    }
                    alt="Avatar"
                  />
                </Avatar>
                <div className=" mt-5 relative h-full w-full mr-3">
                  <Textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Add a comment..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // Ngăn Enter tạo dòng mới
                        handleCommentSubmit(); // Gọi hàm gửi tin nhắn
                      }
                    }}
                    className="w-full px-3 py-1 h-16  border rounded-md focus:outline-none resize-none min-h-10"
                  />
                  {commentContent === "" ? (
                    <img
                      onClick={() => handleCommentSubmit()}
                      src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732396722/chat-app/amg4wnurzmohynhkmgjl.svg"
                      className="h-7 mt-2 w-7 py-1 z-50 rounded-md right-1 bottom-5 absolute cursor-pointer opacity-50 pointer-events-none"
                      alt="send message"
                    />
                  ) : (
                    <img
                      onClick={() => handleCommentSubmit()}
                      src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732397023/chat-app/qxa7dfnhq3vwxn8hlono.svg"
                      className="h-7 mt-2 w-7 py-1 z-50 rounded-md right-1 bottom-5 absolute cursor-pointer"
                      alt="send message"
                    />
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Comment input field */}
      {post?.comments?.length === 0 ? (
        <div className="mt-5 relative">
          <Textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Add a comment..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCommentSubmit();
              }
            }}
            className="w-full px-3 py-1 h-8  border rounded-md focus:outline-none resize-none min-h-10"
          />
          {commentContent === "" ? (
            <img
              onClick={() => handleCommentSubmit()}
              src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732396722/chat-app/amg4wnurzmohynhkmgjl.svg"
              className="h-7 mt-2 w-7 py-1 z-50 rounded-md right-1 bottom-1 absolute cursor-pointer opacity-50 pointer-events-none"
              alt="send message"
            />
          ) : (
            <img
              onClick={() => handleCommentSubmit()}
              src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732397023/chat-app/qxa7dfnhq3vwxn8hlono.svg"
              className="h-7 mt-2 w-7 py-1 z-50 rounded-md right-1 bottom-1 absolute cursor-pointer"
              alt="send message"
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default PostDetail;
