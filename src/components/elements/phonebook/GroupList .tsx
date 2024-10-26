import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useRoom from "@/hooks/useRoom";
import roomStore from "@/store/roomStore";
import { TGroupRoom } from "@/types/roomForUser";
import Cookies from "js-cookie";

const groupByFirstLetter = (rooms: any[]) => {
  return rooms.reduce((acc: { [key: string]: any[] }, room: any) => {
    const firstLetter = room.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(room);
    return acc;
  }, {});
};

const GroupList = () => {
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const userId = storedUser?.id;
  const { usePublicRooms } = useRoom();
  const { data: publicRooms, error, isLoading } = usePublicRooms(userId);
  const { setRoom } = roomStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading public rooms</div>;
  }

  const handleSetRoom = (room: TGroupRoom) => () => {
    const returnRoom = {
      roomName: room.name,
      roomId: room.id,
      roomImg: room.img,
    };
    setRoom(returnRoom);
  };

  // Sắp xếp và nhóm các phòng theo bảng chữ cái
  const sortedRooms = publicRooms.sort((a: TGroupRoom, b: TGroupRoom) =>
    a.name.localeCompare(b.name)
  );
  const groupedRooms = groupByFirstLetter(sortedRooms);

  return (
    <div className="flex flex-col h-full bg-gray-200">
      <h2 className="font-semibold bg-white w-full py-3 pl-3 flex-none">
        Danh sách nhóm
      </h2>

      <div className="mt-3 mx-6 bg-white h-full overflow-y-auto">
        <h3 className="font-medium pl-2 pt-2 bg-gray-200 pb-3">
          Nhóm ({sortedRooms?.length})
        </h3>

        <div className="mt-2 mb-4 mx-4 overflow-y-auto">
          {/* Hiển thị danh sách nhóm đã được phân loại theo bảng chữ cái */}
          {Object.keys(groupedRooms).length > 0 ? (
            Object.keys(groupedRooms)
              .sort()
              .map((letter) => (
                <div key={letter}>
                  <h4 className="text-lg font-bold mt-5 mb-2 ml-2 pt-2">
                    {letter}
                  </h4>
                  {groupedRooms[letter].map((room: TGroupRoom) => (
                    <div
                      onClick={handleSetRoom(room)}
                      key={room.id}
                      className="p-2 px-2 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Avatar className="bg-gray-400 flex justify-center items-center mr-5">
                          <AvatarImage
                            className="w-8 h-8 rounded-full"
                            src={room.img || "src/asset/avatarDefault.svg"}
                            alt="Room Avatar"
                          />
                        </Avatar>
                        <div className="w-full border-b pt-2 pb-3 border-gray-300">
                          <p className="font-medium">{room.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
          ) : (
            <p>No rooms available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupList;
