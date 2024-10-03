import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useFriends from "@/hooks/useFriends";
import searchFoundStore, { searchFriend } from "@/store/userFoundStore";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import roomStore from "@/store/roomStore";
type NewUserInforProps = {
  closeDialog: () => void;
};
const NewUserInfor = ({ closeDialog }: NewUserInforProps) => {
  const { searchUser, setSearchUser } = searchFoundStore();
  const { setRoom } = roomStore();
  const { toast } = useToast();
  const { addFriend } = useFriends();

  const handleback = () => {
    setSearchUser(null);
  };

  const handleSendNewChat = (chat: searchFriend) => {
    if (chat?.message === "Not friends yet") {
      toast({
        title: "Không thể nhắn tin",
        description: "Vui lòng đợi phản hồi kết bạn",
        duration: 2000,
        className: "bg-gray-900 bg-opacity-40 text-white ",
      });
      return;
    }
    if (chat?.room) {
      setRoom(chat.room);
      setSearchUser(null);
      closeDialog();
    }
  };

  const handleAddFriend = (chat: searchFriend) => {
    if (chat) {
      addFriend.mutate(chat?.user.id);
    }
  };

  return (
    <div className="p-4 rounded-lg max-w-md mx-auto">
      {/* Back button */}
      <button
        onClick={handleback}
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

      {/* User info */}
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

      {/* Buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => handleAddFriend(searchUser)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Kết bạn
        </button>
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
