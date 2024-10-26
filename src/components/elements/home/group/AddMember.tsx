import  { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TFriend } from "@/types/friend";
import useRoom from "@/hooks/useRoom";

type AddMemberProps = {
  friends: TFriend[]; // Danh sách bạn bè
  members: string[]; // Danh sách ID thành viên hiện tại của phòng
  roomId:string
};

const AddMember = ({ friends, members ,roomId}: AddMemberProps) => {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { addUsersToRoom } = useRoom();

  // Lọc danh sách bạn bè chưa phải là thành viên của phòng
  const availableFriends = friends.filter(
    (friend) => !members.includes(friend.id)
  );

  const filteredFriends = availableFriends.filter((friend: TFriend) =>
    friend.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const onFriendSelect = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id)
        ? prev.filter((friendId) => friendId !== id)
        : [...prev, id]
    );
  };

  const handleAddMembers = () => {
    if (selectedFriends.length > 0) {
      addUsersToRoom(roomId, selectedFriends);
      setSelectedFriends([]);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Thêm thành viên vào phòng</h3>

      {/* Input tìm kiếm bạn bè */}
      <Input
        placeholder="Tìm kiếm theo tên"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {/* Danh sách bạn bè chưa có trong phòng */}
      <div className="overflow-y-auto max-h-96 mb-4">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend: TFriend) => (
            <div key={friend.id} className="flex items-center py-2 px-4">
              <Checkbox
                checked={selectedFriends.includes(friend.id)}
                onCheckedChange={() => onFriendSelect(friend.id)}
              />
              <Avatar className="bg-gray-400 flex justify-center items-center ml-2 mr-5">
                <AvatarImage
                  className="w-8 h-8"
                  src={friend.img || "src/asset/avatarDefault.svg"}
                  alt="Avatar"
                />
              </Avatar>
              <div className="border-b flex-grow pt-2 pb-3 border-gray-300">
                <p className="font-medium">{friend.fullname}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Không có bạn bè nào để thêm</p>
        )}
      </div>

      {/* Nút thêm thành viên */}
      <div className="text-right">
        <Button
          onClick={handleAddMembers}
          disabled={selectedFriends.length === 0}
        >
          Thêm{" "}
          {selectedFriends.length > 0
            ? `${selectedFriends.length} thành viên`
            : "thành viên"}
        </Button>
      </div>
    </div>
  );
};

export default AddMember;
