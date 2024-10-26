import focusStore from "@/store/focusStore";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useChatStore, { chatFriend } from "@/store/chatStore";
import useRoom from "@/hooks/useRoom";
import Cookies from "js-cookie";
import roomStore, { Room } from "@/store/roomStore";
import { useEffect } from "react";
import useMessageStore from "@/store/messageStore";

interface ChatLabelProps {
  friendsResult:
    | {
        id: string;
        fullname: string;
        img: string;
        roomId?: string;
        type?: string;
      }[]
    | null
    | string;
}

const ChatLabel = ({ friendsResult }: ChatLabelProps) => {
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const userId = storedUser?.id;
  const { isFocused, setFocus } = focusStore();
  const { useRoomsForUser } = useRoom();
  const { data: rooms } = useRoomsForUser(userId);
  const { chatIsChoiced, setChat } = useChatStore();
  const { roomIsChoiced, setRoom } = roomStore();
  const { setMessages } = useMessageStore();

  const handleNewChat = (chat: chatFriend) => {
    if (!chat.roomId) {
      setChat(chat);
      setMessages(null);
      setRoom(null);
    } else {
      setChat(null);
      setRoom({
        roomId: chat.roomId,
        roomImg: chat.img,
        roomName: chat.fullname,
      });
    }
    setFocus(false);
  };

  // Handle when a room is selected
  const handleSetRoom = (room: Room) => {
    setChat(null);
    setRoom(room);
  };

  useEffect(() => {
    if (
      roomIsChoiced === null &&
      rooms &&
      rooms.length > 0 &&
      chatIsChoiced === null
    ) {
      setRoom(rooms[0]);
    }
  }, [roomIsChoiced, rooms, chatIsChoiced]);

  return (
    <div>
      {isFocused ? (
        friendsResult && Array.isArray(friendsResult) ? (
          friendsResult.length > 0 ? (
            friendsResult.map((friend) => {
              const friendAvatarSrc =
                friend.img || "src/asset/avatarDefault.svg"; // Avatar cho bạn bè
              return (
                <div
                  onClick={() => handleNewChat(friend)}
                  key={friend.id}
                  className="p-2 rounded-2xl flex items-center cursor-pointer hover:bg-gray-300"
                >
                  <Avatar
                    className={`flex justify-center items-center ${
                      friendAvatarSrc === "src/asset/avatarDefault.svg"
                        ? "bg-gray-400"
                        : ""
                    }`}
                  >
                    <AvatarImage
                      className={`rounded-full ${
                        friendAvatarSrc === "src/asset/avatarDefault.svg"
                          ? "w-7 h-7" // Kích thước khi là ảnh mặc định
                          : "w-9 h-9" // Kích thước to hơn khi không phải ảnh mặc định
                      }`}
                      src={friendAvatarSrc}
                      alt="Avatar"
                    />
                  </Avatar>
                  {friend.fullname}
                </div>
              );
            })
          ) : (
            <div></div>
          )
        ) : (
          ""
        )
      ) : (
        // Display room list when input is not focused
        <div>
          {rooms?.map((room: Room) => {
            const roomAvatarSrc = room.roomImg || "src/asset/avatarDefault.svg";
            return (
              <div
                key={room.roomId}
                onClick={() => handleSetRoom(room)}
                className={`p-2 rounded-2xl flex items-center cursor-pointer hover:bg-gray-300 ${
                  roomIsChoiced && roomIsChoiced.roomId === room.roomId
                    ? "bg-gray-300"
                    : ""
                }`}
              >
                <Avatar
                  className={`flex justify-center items-center mr-5 ${
                    roomAvatarSrc === "src/asset/avatarDefault.svg"
                      ? "bg-gray-400"
                      : ""
                  }`}
                >
                  <AvatarImage
                    className={`rounded-full ${
                      roomAvatarSrc === "src/asset/avatarDefault.svg"
                        ? "w-7 h-7" // Kích thước khi là ảnh mặc định
                        : "w-9 h-9" // Kích thước to hơn khi không phải ảnh mặc định
                    }`}
                    src={roomAvatarSrc}
                    alt="Room Avatar"
                  />
                </Avatar>
                <div className="flex flex-col">
                  <h1 className="font-bold">{room.roomName}</h1>
                  <h2 className="text-sm text-gray-600">
                    {room.latestMessage}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatLabel;
