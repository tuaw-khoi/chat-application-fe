import React from "react";
import useFriendReq from "@/hooks/useFriendReq";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const FriendRequests = () => {
  const {
    useFriendRequests,
    acceptFriendRequest,
    useGetSentFriendRequests,
    cancelFriendRequest,
  } = useFriendReq();
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const userId = storedUser?.id;
  const { data, error, isLoading } = useFriendRequests(userId);
  const { data: sentFrReq } = useGetSentFriendRequests(userId);

  const handleCannelFriendReq = (friendId: string) => {
    cancelFriendRequest.mutate({ userId, friendId });
  };

  // Hàm xử lý chấp nhận lời mời kết bạn
  const handleAccept = (requestId: number) => {
    acceptFriendRequest.mutate({ requestId, status: "accepted" });
  };

  // Hàm xử lý từ chối lời mời kết bạn
  const handleReject = (requestId: number) => {
    acceptFriendRequest.mutate({ requestId, status: "rejected" });
  };

  return (
    <div className="flex flex-col h-full bg-gray-200">
      <h2 className="font-semibold bg-white w-full py-3 pl-3 flex-none">
        Danh sách lời mời
      </h2>

      <div className="mt-3 mx-6 bg-white h-full overflow-y-auto">
        <div className="flex justify-between bg-gray-200">
          <h3 className="font-medium pl-2 pt-2  pb-3">
            Lời mời kết bạn ({data?.length})
          </h3>
          <Dialog>
            <DialogTrigger className="font-normal mr-5 pt-2 pb-3 text-blue-600 hover:underline">
              Lời mời kết bạn đã gửi
            </DialogTrigger>

            <DialogContent>
              <DialogTitle> Lời mời kết bạn đã gửi</DialogTitle>
              <DialogDescription></DialogDescription>
              <div className="h-[100%] overflow-y-auto">
                {sentFrReq?.map((friendReq: any) => (
                  <div className="flex justify-between items-center hover:bg-gray-200 p-2">
                    <div className="flex items-center">
                      <Avatar
                        className={`flex justify-center items-center cursor-pointer ${
                          friendReq.receiver?.img ===
                          "src/asset/avatarDefault.svg"
                            ? "bg-gray-400"
                            : ""
                        } w-7 h-7`}
                      >
                        <AvatarImage
                          className="w-full h-full rounded-full"
                          src={
                            friendReq.receiver?.img ||
                            "/src/asset/avatarDefault.svg"
                          }
                          alt="User Avatar"
                        />
                      </Avatar>
                      <h2>{friendReq.receiver?.fullname}</h2>
                    </div>
                    <Button
                      onClick={() =>
                        handleCannelFriendReq(friendReq.receiver.id)
                      }
                      className="bg-red-500 hover:bg-red-400 hover:underline"
                    >
                      Hủy lời mời
                    </Button>
                  </div>
                ))}
                {sentFrReq?.length > 0 ? null : (
                  <div>Chưa gửi lời mời kết bạn</div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-2 mb-4 mx-4 overflow-y-auto">
          {isLoading && <p>Loading...</p>}
          {error && <p>Error fetching friend requests</p>}
          {data && data.length > 0 ? (
            data.map((request: any) => (
              <div
                key={request.id}
                className="p-2 px-2 border-b border-gray-300"
              >
                <div className="flex items-center">
                  <div className="flex w-full justify-between">
                    <p className="font-medium">
                      {request.sender.fullname
                        ? request.sender.fullname + " "
                        : request.sender.user + " "}
                      đã gửi cho bạn một lời mời kết bạn.
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Chấp nhận
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Không có lời mời kết bạn nào</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequests;
