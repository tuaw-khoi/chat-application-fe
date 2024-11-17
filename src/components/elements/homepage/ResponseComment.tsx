import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import useComment from "@/hooks/useComment";
import { useState } from "react";
import { TComment } from "@/types/comment";
import getTimeDifference from "@/hooks/useData";
import Cookies from "js-cookie";

type TRescmt = {
  comment: TComment;
  postId: string;
};
type TOpenRepCmt = {
  isOpenCmt: boolean;
};

const ResponseComment = ({ comment, postId }: TRescmt) => {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : "";
  const { getCommentChilds, create } = useComment();
  const [commentContent, setCommentContent] = useState<string>("");
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [visibleReplies, setVisibleReplies] = useState<number>(5);
  const [repLiesCmt, setRepLiesCmt] = useState<{ [key: string]: TOpenRepCmt }>(
    {}
  );
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  const { data: repliesComment, isLoading } = getCommentChilds(comment.id);
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
  const handleCommentSubmit = async (parentCommentId: string) => {
    try {
      if (!responses[parentCommentId].trim()) return;
      await create({
        content: responses[parentCommentId],
        postId,
        parentCommentId,
      });
      setResponses((prevResponses) => {
        const newResponses = { ...prevResponses };
        delete newResponses[parentCommentId];
        return newResponses;
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleShowReplies = () => {
    setShowReplies(true);
  };

  return (
    <div className="">
      {repliesComment && repliesComment.length > 0 && !showReplies ? (
        <h2
          className="cursor-pointer ml-12 text-sm mt-4 hover:underline"
          onClick={handleShowReplies}
        >
          {`Xem thêm bình luận`}
        </h2>
      ) : null}

      {showReplies && (
        <div className="pl-8 mt-4">
          {isLoading ? (
            <p>Đang tải bình luận...</p>
          ) : (
            repliesComment &&
            repliesComment.slice(0, visibleReplies).map((reply) => (
              <div>
                <div className="flex items-center mb-2 mt-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      className=""
                      src={reply.author.img || "src/asset/avatarDefault.svg"}
                      alt="Avatar"
                    />
                  </Avatar>
                  <div className="ml-3 bg-gray-200  p-2 rounded-xl pr-4">
                    <p className="font-medium text-sm">
                      {reply.author.fullname}
                    </p>
                    <p className="font-normal text-sm">{reply.content}</p>
                  </div>
                </div>
                <div className="flex space-x-3 text-[13px] text-gray-500 items-center ml-9 mt-1">
                  <div className="">{getTimeDifference(reply.createdAt)}</div>
                  <div
                    onClick={() => toggleComment(reply.id)}
                    className="cursor-pointer hover:underline"
                  >
                    Trả lời
                  </div>
                </div>
                <div key={reply.id} className="mt-2">
                  <ResponseComment comment={reply} postId={postId} />
                </div>
                <div>
                  {repLiesCmt[reply.id]?.isOpenCmt == true ? (
                    <div className=" bg-gray-100 flex items-center rounded-2xl mt-3 ml-10">
                      <Avatar
                        className={`flex mr-2 justify-center  ${
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
                      <div className="relative my-2 w-full mr-3">
                        <Textarea
                          value={responses[reply.id] || ""}
                          onChange={(e) =>
                            handleInputChange(reply.id, e.target.value)
                          }
                          placeholder="Add a comment..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault(); // Ngăn Enter tạo dòng mới
                              handleCommentSubmit(reply?.id); // Gọi hàm gửi tin nhắn
                            }
                          }}
                          className="w-full px-3 py-1 h-16  border rounded-md focus:outline-none resize-none min-h-10"
                        />
                        {responses[reply?.id] === "" ||
                        !responses[reply?.id] ? (
                          <img
                            src="src/asset/sendcmt.svg"
                            className="h-7 mt-2 w-7 py-1 z-50 rounded-md right-1 bottom-0 absolute cursor-pointer opacity-50 pointer-events-none"
                            alt="send message"
                          />
                        ) : (
                          <img
                            onClick={() => handleCommentSubmit(reply.id)}
                            src="src/asset/ischecksendcmt.svg"
                            className="h-7 mt-2 w-7 py-1 z-50 rounded-md right-1 bottom-0 absolute cursor-pointer"
                            alt="send message"
                          />
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          )}
          {/* Nút "Xem thêm" hoặc "Thu gọn" */}
          {repliesComment && repliesComment.length > visibleReplies && (
            <div
              className="cursor-pointer text-blue-600 hover:underline mt-2"
              onClick={() => setVisibleReplies((prev) => prev + 5)} // Tải thêm 5 bình luận con
            >
              Xem thêm trả lời
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResponseComment;
