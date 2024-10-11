import React from "react";
import useFriendReq from "@/hooks/useFriendReq";
import Cookies from "js-cookie";

const FriendRequests = () => {
  const { useFriendRequests, acceptFriendRequest } = useFriendReq();
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const userId = storedUser?.id;
  const { data, error, isLoading } = useFriendRequests(userId);

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
        <h3 className="font-medium pl-2 pt-2 bg-gray-200 pb-3">
          Lời mời kết bạn ({data?.length})
        </h3>

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
