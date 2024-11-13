import React, { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { TPost } from "@/types/post";
import useLike from "@/hooks/useLike";
import useComment from "@/hooks/useComment"; // Import the useComment hook
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
import roomStore, { Room } from "@/store/roomStore";
import PhoneBookStore from "@/store/phoneBookStore";
import { TComment } from "@/types/comment";
import { TUser } from "@/types/user";

interface PostDetailProps {
  post: TPost;
  user: TUser;
  isExpanded: boolean;
  toggleExpand: (postId: string) => void;
}

const PostDetail = ({
  post,
  user,
  isExpanded,
  toggleExpand,
}: PostDetailProps) => {
  const { like, unlike } = useLike();
  const { create } = useComment(); // Destructure create from useComment
  const [commentContent, setCommentContent] = useState<string>(""); // State for comment input
  const userId = user.id;
  const isLike = post?.likes?.some((like: TLike) => like.user?.id === userId);
  const { setChat } = useChatStore();
  const { setRoom } = roomStore();
  const { setPage } = PhoneBookStore();

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

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;

    try {
      await create({
        content: commentContent,
        postId: post.id,
      });
      setCommentContent("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div key={post.id} className="p-4 border-b pb-8">
      {/* Post header with author's info */}
      <div className="flex items-center mb-2">
        <img
          src={post.author.img || "src/asset/avatarDefault.svg"}
          alt={post.author?.fullname}
          className="w-8 h-8 rounded-full"
        />
        <div className="ml-3">
          <div className="font-semibold">{post.author?.fullname}</div>
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
                src="src/asset/likeisticker.svg"
                alt="Liked"
              />
            ) : (
              <img
                onClick={handleLikeToggle}
                src="src/asset/like.svg"
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
                      <h1 key={like.id} className="py-1">
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
                          className={`flex mr-2 justify-center items-center ${
                            like.user.img ? null : "bg-gray-400"
                          }`}
                        >
                          <AvatarImage
                            className={`rounded-full ${
                              like.user.img ? "w-9 h-9" : "w-7 h-7"
                            }`}
                            src={like.user.img || "src/asset/avatarDefault.svg"}
                            alt="Avatar"
                          />
                        </Avatar>
                        <h2 className="hover:underline cursor-pointer">
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
                    <span className="hover:underline">
                      {post?.comments?.length}
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent
                    className="text-sm text-left max-w-40 bg-gray-100 bg-opacity-90
            "
                  >
                    {post?.comments?.map((comment: TComment) => (
                      <h1 key={comment.id} className="py-1">
                        {comment.author?.fullname.length > 18
                          ? `${comment.author.fullname.slice(0, 15)}...`
                          : comment.author.fullname}
                      </h1>
                    ))}
                  </HoverCardContent>
                </HoverCard>
                <img
                  className="w-7"
                  src="src/asset/comment.svg"
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
                    src={post.author.img || "src/asset/avatarDefault.svg"}
                    alt={post.author?.fullname}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="ml-3">
                    <div className="font-semibold">{post.author?.fullname}</div>
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
                          src="src/asset/likeisticker.svg"
                          alt="Liked"
                        />
                      ) : (
                        <img
                          onClick={handleLikeToggle}
                          src="src/asset/like.svg"
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
                                <h1 key={like.id} className="py-1">
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
                                    className={`flex mr-2 justify-center items-center ${
                                      like.user.img ? null : "bg-gray-400"
                                    }`}
                                  >
                                    <AvatarImage
                                      className={`rounded-full ${
                                        like.user.img ? "w-9 h-9" : "w-7 h-7"
                                      }`}
                                      src={
                                        like.user.img ||
                                        "src/asset/avatarDefault.svg"
                                      }
                                      alt="Avatar"
                                    />
                                  </Avatar>
                                  <h2 className="hover:underline cursor-pointer">
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
                            {post?.comments?.length}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="text-sm text-left max-w-40 bg-gray-100 bg-opacity-90
            "
                        >
                          {post?.comments?.map((comment: TComment) => (
                            <h1 key={comment.id} className="py-1">
                              {comment.author?.fullname.length > 18
                                ? `${comment.author.fullname.slice(0, 15)}...`
                                : comment.author.fullname}
                            </h1>
                          ))}
                        </HoverCardContent>
                      </HoverCard>
                      <img
                        className="w-7"
                        src="src/asset/comment.svg"
                        alt="Comment"
                      />
                    </div>
                  )}
                </div>

                <div>
                  {/* display comment */}
                  <div className="space-y-3">
                    {post.comments?.map((comment: TComment) => (
                      <div
                        key={comment.id}
                        className="flex items-start space-x-2"
                      >
                        <Avatar className="w-9 h-9 mt-2">
                          <AvatarImage
                            src={
                              comment.author?.img ||
                              "src/asset/avatarDefault.svg"
                            }
                            alt="User Avatar"
                          />
                        </Avatar>
                        <div>
                          <div className="bg-gray-200 p-2 rounded-xl">
                            <div className="text-sm font-semibold">
                              {comment.author?.fullname}
                            </div>
                            <p className="text-gray-80 text-[14px] py-[1px]">
                              {comment.content}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500 ml-2 mt-1">
                            {format(new Date(comment.createdAt), "dd MMM yyyy")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* input send cmt */}
              <div className=" bg-gray-100  flex items-center rounded-b-2xl">
                <Avatar
                  className={`flex mr-2 justify-center items-center mb-5 ${
                    user ? null : "bg-gray-400"
                  }`}
                >
                  <AvatarImage
                    className={`rounded-full ${
                      user.img ? "w-9 h-9" : "w-7 h-7"
                    }`}
                    src={user.img || "src/asset/avatarDefault.svg"}
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
                      onClick={handleCommentSubmit}
                      src="src/asset/sendcmt.svg"
                      className="h-7 mt-2 w-7 py-1 z-50 rounded-md right-1 bottom-5 absolute cursor-pointer opacity-50 pointer-events-none"
                      alt="send message"
                    />
                  ) : (
                    <img
                      onClick={handleCommentSubmit}
                      src="src/asset/ischecksendcmt.svg"
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
              onClick={handleCommentSubmit}
              src="src/asset/sendcmt.svg"
              className="h-7 mt-2 w-7 py-1 z-50 rounded-md right-1 bottom-1 absolute cursor-pointer opacity-50 pointer-events-none"
              alt="send message"
            />
          ) : (
            <img
              onClick={handleCommentSubmit}
              src="src/asset/ischecksendcmt.svg"
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
