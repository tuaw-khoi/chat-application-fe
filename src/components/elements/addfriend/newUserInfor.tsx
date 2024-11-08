import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useFriends from "@/hooks/useFriends";
import searchFoundStore, { searchFriend } from "@/store/userFoundStore";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import roomStore from "@/store/roomStore";
import useFriendReq from "@/hooks/useFriendReq";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type NewUserInforProps = {
  closeDialog: () => void;
};

const NewUserInfor = ({ closeDialog }: NewUserInforProps) => {
  const { checkFriendRequestStatus, cancelFriendRequest, check } =
    useFriendReq();
  const { searchUser, setSearchUser } = searchFoundStore();
  const { setRoom } = roomStore();
  const { toast } = useToast();
  const { addFriend, removeFriend } = useFriends();
  const [friendRequestStatus, setFriendRequestStatus] = useState<
    "pending" | "isFriend" | "not_found" | null
  >(null);

  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const userId = storedUser?.id;

  const handleBack = () => {
    setSearchUser(null);
  };


  useEffect(() => {
    const fetchFriendStatus = async () => {
      if (searchUser && userId) {
        try {
          const status = await checkFriendRequestStatus(
            userId,
            searchUser.user.id
          );
          setFriendRequestStatus(status.status);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchFriendStatus();
  }, [searchUser, userId, checkFriendRequestStatus, toast]);


  const handleSendNewChat = async (chat: searchFriend) => {
    if (chat?.message === "Not friends yet") {
      toast({
        title: "Không thể nhắn tin",
        description: "Vui lòng đợi phản hồi kết bạn",
        duration: 2000,
        className: "bg-gray-900 text-white",
      });
      return;
    }
    if (chat?.room) {
      setRoom(chat.room);
      setSearchUser(null);
      closeDialog();
    }
  };

  const handleAddFriend = async (chat: searchFriend) => {
    try {
      if (chat) {
        await addFriend.mutateAsync(chat?.user.id);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi lời mời kết bạn.",
        className: "bg-red-500 text-white",
      });
    }
  };

  const handleCancelAddFriend = async (chat: searchFriend) => {
    try {
      if (chat) {
        await cancelFriendRequest.mutateAsync({
          userId,
          friendId: chat.user.id,
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể hủy lời mời kết bạn.",
        className: "bg-red-500 text-white",
      });
    }
  };

  const handleRemoveFriend = async (chat: searchFriend) => {
    try {
      if (chat) {
        await removeFriend.mutateAsync({
          userId1: userId,
          userId2: chat.user.id,
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể hủy kết bạn.",
        className: "bg-red-500 text-white",
      });
    }
  };

  return (
    <div className="p-4 rounded-lg max-w-md mx-auto">
      <button
        onClick={handleBack}
        className="mb-4 flex items-center text-gray-500 hover:text-gray-700"
      >
        <img
          width={20}
          height={20}
          src="src/asset/backMessage.svg"
          alt="Go back"
          className="mr-2"
        />
        <span>Trở lại</span>
      </button>

      <div className="flex items-center space-x-4">
        <Avatar className="bg-gray-400 w-16 h-16 rounded-full">
          <AvatarImage
            className="w-20 h-20"
            src={searchUser?.user?.img || "src/asset/avatarDefault.svg"}
            alt="User Avatar"
          />
        </Avatar>
        <Toaster />
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">
            {searchUser?.user?.fullname || "Tên người dùng"}
          </h2>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        {friendRequestStatus === "pending" && (
          <button
            onClick={() => handleCancelAddFriend(searchUser)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Hủy lời mời
          </button>
        )}
        {friendRequestStatus === "isFriend" && (
          <button
            onClick={() => handleRemoveFriend(searchUser)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Hủy kết bạn
          </button>
        )}
        {friendRequestStatus === "not_found" && (
          <button
            onClick={() => handleAddFriend(searchUser)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Kết bạn
          </button>
        )}
        <button
          onClick={() => handleSendNewChat(searchUser)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Nhắn Tin
        </button>
      </div>
    </div>
  );
};

export default NewUserInfor;
