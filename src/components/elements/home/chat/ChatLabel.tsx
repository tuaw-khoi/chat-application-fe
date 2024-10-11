import focusStore from "@/store/focusStore";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useChatStore, { chatFriend } from "@/store/chatStore";
import useRoom from "@/hooks/useRoom";
import Cookies from "js-cookie";
import roomStore, { Room } from "@/store/roomStore";
import { FC, useEffect } from "react";
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
            friendsResult.map((friend) => (
              <div
                onClick={() => handleNewChat(friend)}
                key={friend.id}
                className="p-2 rounded-2xl flex items-center cursor-pointer hover:bg-gray-300"
              >
                <Avatar className="bg-gray-400 flex justify-center items-center mr-5">
                  <AvatarImage
                    className="w-7 h-7"
                    src={friend.img || "src/asset/avatarDefault.svg"}
                    alt="Avatar"
                  />
                </Avatar>
                {friend.fullname}
              </div>
            ))
          ) : (
            <div></div>
          )
        ) : (
          ""
        )
      ) : (
        // Display room list when input is not focused
        <div>
          {rooms?.map((room: Room) => (
            <div
              key={room.roomId}
              onClick={() => handleSetRoom(room)}
              className={`p-2 rounded-2xl flex items-center cursor-pointer hover:bg-gray-300 ${
                roomIsChoiced && roomIsChoiced.roomId === room.roomId
                  ? "bg-gray-300"
                  : ""
              }`}
            >
              <Avatar className="bg-gray-400 flex justify-center items-center mr-5">
                <AvatarImage
                  className="w-7 h-7"
                  src={room.roomImg || "src/asset/avatarDefault.svg"}
                  alt="Room Avatar"
                />
              </Avatar>
              <div>
                <h1>{room.roomName}</h1>
                <h2>{room.latestMessage}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatLabel;
