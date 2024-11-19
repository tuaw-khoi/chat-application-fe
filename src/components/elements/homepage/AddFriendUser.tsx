import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { TUser } from "@/types/user";
import useFriendReq from "@/hooks/useFriendReq";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import useFriends from "@/hooks/useFriends";

type AddFr = {
  user: TUser;
};
const AddFriendUser = ({ user }: AddFr) => {
  const { checkFriendRequestStatus, cancelFriendRequest } = useFriendReq();
  const { addFriend } = useFriends();
  const [friendRequestStatus, setFriendRequestStatus] = useState<
    "pending" | "isFriend" | "not_found" | null
  >(null);
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const userId = storedUser?.id;

  useEffect(() => {
    const fetchFriendStatus = async () => {
      if (userId && user.id) {
        try {
          const status = await checkFriendRequestStatus(userId, user.id);
          setFriendRequestStatus(status.status);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchFriendStatus();
  }, [userId, user.id, checkFriendRequestStatus]);
  const handleAddFriend = async () => {
    try {
      if (userId && user.id) await addFriend.mutateAsync(user.id);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };
  const handleCancelAddFriend = async () => {
    if (userId && user.id) {
      try {
        await cancelFriendRequest.mutateAsync({
          userId,
          friendId: user.id,
        });
      } catch (error) {
        console.error("Error fetching friend status:", error);
      }
    }
  };
  return (
    <div className="flex items-center justify-between mr-5 ">
      <div className="flex items-center py-2">
        <Avatar className="bg-gray-400 flex justify-center items-center mr-5">
          <AvatarImage
            className="w-8 h-8 rounded-full"
            src={user.img || "src/asset/avatarDefault.svg"}
            alt="Avatar"
          />
        </Avatar>
        <div className="w-full pt-2">
          <p className="font-medium">
            {user.fullname.length > 18
              ? `${user.fullname.slice(0, 12)}...`
              : user.fullname}
          </p>
        </div>
      </div>
      <div className="">
        {friendRequestStatus === "pending" ? (
          <button
            onClick={handleCancelAddFriend}
            className="px-3 py-1 text-sm text-nowrap bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Hủy lời mời
          </button>
        ) : (
          <button
            onClick={handleAddFriend}
            className="px-3 py-1 text-nowrap text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Kết bạn
          </button>
        )}
      </div>
    </div>
  );
};

export default AddFriendUser;
