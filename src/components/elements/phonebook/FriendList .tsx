import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import useFriends from "@/hooks/useFriends";
import useChatStore, { chatFriend } from "@/store/chatStore";
import useMessageStore from "@/store/messageStore";
import roomStore from "@/store/roomStore";
import { TFriend } from "@/types/friend";
import Cookies from "js-cookie";
import { Ellipsis } from "lucide-react";

const groupByFirstLetter = (friends: TFriend[]) => {
  return friends.reduce(
    (acc: { [key: string]: TFriend[] }, friend: TFriend) => {
      const firstLetter = friend.fullname.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(friend);
      return acc;
    },
    {}
  );
};

const FriendList = () => {
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const userId = storedUser?.id;
  const { getAllFriends, removeFriend } = useFriends();
  const data = getAllFriends();
  const friends = data?.data || [];
  const { setRoom } = roomStore();
  const { setChat } = useChatStore();
  const { setMessages } = useMessageStore();
  const sortedFriends = friends.sort((a: TFriend, b: TFriend) =>
    a.fullname.localeCompare(b.fullname)
  );

  const groupedFriends = groupByFirstLetter(sortedFriends);
  const handleSetRoom = (friend: TFriend) => () => {
    if (friend.room) {
      setRoom(friend?.room);
      setChat(null);
    } else {
      handleNewChat(friend);
    }
  };

  const handleNewChat = (chat: chatFriend) => {
    if (!chat.roomId) {
      setChat(chat);
      setRoom(null);
      setMessages(null);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    await removeFriend.mutateAsync({ userId1: userId, userId2: friendId });
  };

  return (
    <div className=" flex flex-col h-full bg-gray-200 ">
      <h2 className="font-semibold bg-white w-full py-3 pl-3 flex-none">
        Danh sách bạn bè
      </h2>

      <div className="mt-3 mx-6 bg-white h-full overflow-y-auto">
        <h3 className="font-medium pl-2 pt-2 bg-gray-200 pb-3">
          Bạn bè ({friends?.length})
        </h3>

        <div className=" mt-2 mb-4 mx-4 overflow-y-auto ">
          {Object.keys(groupedFriends)
            .sort()
            .map((letter) => (
              <div className="">
                <div className="w-full" key={letter}>
                  <h4 className="text-lg font-bold mt-5 mb-2 ml-2 pt-2">
                    {letter}
                  </h4>
                  {groupedFriends[letter].map((friend: TFriend) => (
                    <div className="flex">
                      <div
                        onClick={handleSetRoom(friend)}
                        key={friend.id}
                        className="p-2 px-2 cursor-pointer w-full"
                      >
                        <div className="flex items-center ">
                          <Avatar className="bg-gray-400 flex justify-center items-center mr-5">
                            <AvatarImage
                              className="w-8 h-8 rounded-full"
                              src={friend.img || "src/asset/avatarDefault.svg"}
                              alt="Avatar"
                            />
                          </Avatar>
                          <div className="w-full border-b pt-2 pb-3 border-gray-300">
                            <p className="font-medium">{friend.fullname}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="ml-auto">
                              <Ellipsis className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {/* Mở dialog xóa thành viên */}
                            <DropdownMenuItem
                              onClick={() => handleRemoveFriend(friend.id)}
                              className="cursor-pointer"
                            >
                              Hủy kết bạn
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FriendList;
