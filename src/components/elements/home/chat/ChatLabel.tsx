import focusStore from "@/store/focusStore";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useChatStore, { chatFriend } from "@/store/chatStore";
import useRoom from "@/hooks/useRoom";
import Cookies from "js-cookie";
import roomStore, { Room } from "@/store/roomStore";
import { FC, useEffect } from "react";

interface ChatLabelProps {
  friendsResult:
    | { id: string; fullname: string; img: string; roomId?: number }[]
    | null
    | string;
}

const ChatLabel: FC<ChatLabelProps> = ({ friendsResult }) => {
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const userId = storedUser?.id;
  const { isFocused, setFocus } = focusStore();
  const { useRoomsForUser } = useRoom();
  const { data: rooms } = useRoomsForUser(userId);
  const { setChat } = useChatStore();
  const { roomIsChoiced, setRoom } = roomStore();

  // Handle when a friend is clicked for a new chat
  const handleNewChat = (chat: chatFriend) => {
    setChat(chat);
    setFocus(false); // Set focus to false once a chat is selected
  };

  // Handle when a room is selected
  const handleSetRoom = (room: Room) => {
    setRoom(room);
  };

  useEffect(() => {
    if (roomIsChoiced === null && rooms && rooms.length > 0) {
      setRoom(rooms[0]); 
    }
  }, [roomIsChoiced, rooms]);

  return (
    <div className="mt-3">
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
              className="p-2 rounded-2xl flex items-center cursor-pointer hover:bg-gray-300"
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
