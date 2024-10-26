import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useRoom from "@/hooks/useRoom";
import useChatStore from "@/store/chatStore";
import roomStore from "@/store/roomStore";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddMember from "../group/AddMember";
import useFriends from "@/hooks/useFriends";
import MemberOfGroup, { Member } from "../group/MemberOfGroup";
import Cookies from "js-cookie";
import { useState } from "react";

type Message = {
  id: number;
  content: string;
  sent_at: Date;
  type: string;
};

const Directory = () => {
  const { roomIsChoiced, setRoom } = roomStore();
  const { chatIsChoiced } = useChatStore();
  const { useRoomDetailsWithImages, leaveRoom } = useRoom();
  const { getAllFriends } = useFriends();
  const data = getAllFriends();
  const friends = data?.data || [];
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const currentUserId = storedUser?.id;
  const roomId = roomIsChoiced?.roomId;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const {
    data: roomDetail,
    isLoading,
    error,
  } = useRoomDetailsWithImages(roomId!);

  if (roomId === undefined) {
    return <div>Chưa chọn phòng nào.</div>;
  }

  const currentMemberIds =
    roomDetail?.room.roomUsers.map((member: any) => member?.user?.id) || [];
  const currentMembers =
    roomDetail?.room.roomUsers.map((member: any) => member) || [];
  const name = chatIsChoiced ? chatIsChoiced.fullname : roomIsChoiced?.roomName;
  const avatarSrc =
    chatIsChoiced?.img ||
    roomIsChoiced?.roomImg ||
    "src/asset/avatarDefault.svg"; // Ảnh mặc định

  let otherUser: Member | undefined;

  if (roomDetail && !roomDetail.room.isPublic) {
    otherUser = roomDetail?.room.roomUsers.find(
      (member: Member) => member?.user?.id !== currentUserId
    );
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  // Phương thức để đóng dialog
  const closeDialog = () => {
    setSelectedImage(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="flex justify-center items-center mx-auto text-center">
        Xin chào bạn, hãy kết nối với nhiều bạn bè để có thể trải nghiệm tốt
        hơn.
      </div>
    );

  const handleLeaveRoom = () => {
    if (roomDetail) {
      leaveRoom(roomDetail?.room?.id, currentUserId);
      setRoom(null);
    }
  };

  // Handle displaying the images
  const imageMessages = roomDetail?.imageMessages;
  const isImageMessagesArray = Array.isArray(imageMessages);
  const displayedImages = isImageMessagesArray ? imageMessages.slice(0, 3) : [];

  return (
    <div className="flex-1 px-4">
      <div className="flex flex-col items-center justify-center">
        <h1 className="py-2 text-xl font-bold">Thông tin đoạn chat</h1>

        {/* Avatar */}
        <Avatar
          className={`flex justify-center items-center mt-7 ${
            avatarSrc === "src/asset/avatarDefault.svg" ? "bg-gray-400" : ""
          } w-24 h-24`}
        >
          <AvatarImage
            className="w-full h-full rounded-full"
            src={avatarSrc}
            alt="Avatar"
          />
        </Avatar>

        {/* Name and Edit Button */}
        <div className="flex justify-center items-center mt-3">
          <span className="text-center font-semibold text-lg text-nowrap">
            {name || "Không có lựa chọn"}
          </span>
          {roomDetail && roomDetail.room.isPublic && (
            <img
              className="h-7 w-7 px-1 -mr-2 cursor-pointer hover:bg-gray-100 rounded-full"
              src="src/asset/edit.svg"
              alt="Edit"
            />
          )}
        </div>

        {/* Room Options */}
        {roomDetail && roomDetail.room.isPublic && (
          <div className="flex items-center justify-center mt-4 w-full space-x-2">
            <div className="flex flex-col items-center px-2 min-w-28">
              <Dialog>
                <DialogTrigger>
                  <img
                    className="bg-gray-300 text-white p-2 rounded-full w-12 h-12 cursor-pointer hover:bg-gray-400"
                    src="src/asset/leave.svg"
                    alt="Rời nhóm"
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle></DialogTitle>
                  <DialogDescription></DialogDescription>
                  <DialogHeader>
                    <DialogTitle>Bạn có muốn rời nhóm</DialogTitle>
                    <DialogDescription></DialogDescription>
                    <DialogClose className="flex justify-end space-x-3">
                      <Button className="bg-blue-400 hover:bg-blue-500">
                        Hủy
                      </Button>
                      <Button
                        onClick={handleLeaveRoom}
                        className="bg-red-400 hover:bg-red-500"
                      >
                        Xác nhận
                      </Button>
                    </DialogClose>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <h2 className="text-center text-sm mt-2 min-w-16">Rời nhóm</h2>
            </div>
            <div className="flex flex-col items-center min-w-28">
              <Dialog>
                <DialogTrigger>
                  <img
                    className="bg-gray-300 text-white p-2 rounded-full w-12 h-12 cursor-pointer hover:bg-gray-400"
                    src="src/asset/addgr.svg"
                    alt="Thêm thành viên"
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle></DialogTitle>
                  <DialogDescription></DialogDescription>
                  <DialogHeader>
                    <AddMember
                      roomId={roomDetail.room.id}
                      friends={friends}
                      members={currentMemberIds}
                    />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <h2 className="text-center text-sm mt-2 min-w-16">
                Thêm thành viên
              </h2>
            </div>
          </div>
        )}
        {/* Room Members */}
        {roomDetail && roomDetail.room.isPublic && (
          <div className="w-full mt-4">
            <h2 className="text-lg font-semibold">Thành viên</h2>
            <Dialog>
              <DialogTrigger className="w-full">
                <div className="flex items-center mt-2 hover:bg-gray-200 cursor-pointer rounded-md">
                  <img
                    className="w-10 h-10"
                    src="src/asset/group.svg"
                    alt="Group"
                  />
                  <p className="ml-2 text-lg ">
                    {roomDetail.room.roomUsers?.length} thành viên
                  </p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
                <DialogHeader>
                  <MemberOfGroup
                    roomId={roomDetail.room.id}
                    members={currentMembers}
                  />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {roomDetail && !roomDetail.room.isPublic && (
          <div className="w-full mt-4 mb-2 rounded-2xl">
            <div className="w-full ">
              <Dialog>
                <DialogTrigger className="w-full text-left">
                  <h2 className="text-lg font-medium mt-2 hover:bg-gray-300 w-full rounded-lg">
                    Thông tin tài khoản
                  </h2>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle></DialogTitle>
                  <DialogDescription></DialogDescription>
                  <DialogHeader>
                    <DialogTitle>Thông tin người dùng</DialogTitle>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={
                            otherUser?.user?.img ||
                            "src/asset/avatarDefault.svg"
                          }
                          alt="User Avatar"
                        />
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {otherUser?.user?.fullname}
                        </p>
                        <p className="font-semibold">
                          {otherUser?.user?.email}
                        </p>
                      </div>
                    </div>
                    <DialogClose className="flex justify-end space-x-3">
                      <Button className="min-w-20 bg-blue-400 hover:bg-blue-500">
                        Đóng
                      </Button>
                    </DialogClose>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {/* Display images */}
        <div className="flex flex-col mt-6 w-full">
          <h2 className="text-lg font-semibold text-left">Hình ảnh đã gửi</h2>
          <div className="grid grid-cols-3 gap-2 mt-8">
            {displayedImages.map((image: Message, index: number) => (
              <div
                key={index}
                className="relative"
                onClick={() => handleImageClick(image.content)}
              >
                <img
                  className="w-40 h-40 rounded-lg cursor-pointer"
                  src={image.content}
                  alt={`Image ${index + 1}`}
                />
                <span className="absolute bottom-1 left-1 bg-gray-700 text-white text-xs rounded px-1">
                  {new Date(image.sent_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* More button */}
          {isImageMessagesArray && imageMessages.length > 3 ? (
            <Dialog>
              <DialogTrigger>
                <Button className="mt-4">Xem thêm</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className="text-left">
                  Hình ảnh trong phòng
                </DialogTitle>
                <DialogHeader>
                  <div className="grid grid-cols-3 gap-2 mt-2 overflow-y-auto max-h-[60dvh]">
                    {imageMessages.map((image: Message, index: number) => (
                      <div key={index} className="relative mb-2">
                        <img
                          className="w-32 h-32 rounded-lg"
                          src={image.content}
                          alt={`Image ${index + 1}`}
                          onClick={() => handleImageClick(image.content)}
                        />
                        <span className="absolute bottom-1 left-1 bg-gray-700 text-white text-xs rounded px-1">
                          {new Date(image.sent_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </DialogHeader>
                <DialogClose>
                  <Button className="mt-4">Đóng</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          ) : (
            <div>Chưa có hình ảnh </div>
          )}
          {/* Dialog phóng to ảnh */}
          {selectedImage && (
            <Dialog open onOpenChange={closeDialog}>
              <DialogContent>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
                <img
                  className="w-full h-full cursor-pointer"
                  src={selectedImage}
                  alt="Phóng to"
                />
                <DialogClose>
                  <Button className="mt-4">Đóng</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default Directory;
