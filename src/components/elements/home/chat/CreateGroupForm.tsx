import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import useFriends from "@/hooks/useFriends";
import { TFriend } from "@/types/friend";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useUploadImage from "@/hooks/useUploadImg";
import useRoom from "@/hooks/useRoom";
import Cookies from "js-cookie";

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

const CreateGroupForm = () => {
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const userId = storedUser?.id;
  const { getAllFriends } = useFriends();
  const data = getAllFriends();
  const friends = data?.data || [];
  const sortedFriends = friends.sort((a: TFriend, b: TFriend) =>
    a.fullname.localeCompare(b.fullname)
  );
  const groupedFriends = groupByFirstLetter(sortedFriends);

  const { register, handleSubmit, reset } = useForm();
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupAvatar, setGroupAvatar] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái tạo nhóm

  const { uploadImage, loading, error } = useUploadImage();
  const { useCreateRoom } = useRoom();
  const { mutate: createRoomMutation, isError, isSuccess } = useCreateRoom();

  const onFriendSelect = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id)
        ? prev.filter((friendId) => friendId !== id)
        : [...prev, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setGroupAvatar(e.target.files[0]);
    }
  };

  const filteredFriends = friends.filter((friend: TFriend) =>
    friend.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: any) => {
    setIsSubmitting(true); // Bắt đầu quá trình tạo nhóm
    const groupName =
      data.groupName ||
      selectedFriends
        .map((id) => {
          const friend = friends.find((f: any) => f.id === id);
          return friend?.fullname || "";
        })
        .join(", ");

    let groupAvatarUrl = "";
    if (groupAvatar) {
      const uploadResponse = await uploadImage(groupAvatar);
      if (uploadResponse) {
        groupAvatarUrl = uploadResponse.imageUrl || "";
      }
    }

    createRoomMutation(
      {
        name: groupName,
        img: groupAvatarUrl,
        members: selectedFriends,
        userId: userId,
      },
      {
        onSuccess: () => {
          reset();
          setSelectedFriends([]);
          setGroupAvatar(null);
          setSearchTerm("");
          setIsDialogOpen(false);
          setIsSubmitting(false); // Quá trình tạo nhóm hoàn tất
        },
        onError: () => {
          setIsSubmitting(false); // Xảy ra lỗi, cho phép thử lại
        },
      }
    );
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedFriends([]);
      setSearchTerm("");
      setGroupAvatar(null);
      reset();
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger>
          <img
            className="w-8 h-8 cursor-pointer"
            src="src/asset/addgr.svg"
            alt="Add Group"
          />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo nhóm mới</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="groupName">Tên nhóm</Label>
                <Input
                  id="groupName"
                  placeholder="Nhập tên nhóm"
                  {...register("groupName")}
                />
              </div>

              <div>
                <Label htmlFor="groupAvatar">Ảnh đại diện nhóm</Label>
                <Input
                  id="groupAvatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {loading && <p>Đang tải hình ảnh...</p>}
              {error && <p style={{ color: "red" }}>{error}</p>}

              <div>
                <Label htmlFor="search">Tìm kiếm bạn bè</Label>
                <Input
                  id="search"
                  placeholder="Tìm kiếm theo tên"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="mt-2 mb-4 mx-4 overflow-y-auto max-h-96">
                {Object.keys(groupedFriends)
                  .sort()
                  .map((letter) => (
                    <div key={letter}>
                      <h4 className="text-lg font-bold mt-5 mb-2 ml-2 pt-2">
                        {letter}
                      </h4>
                      {filteredFriends
                        .filter(
                          (friend: TFriend) =>
                            friend.fullname.charAt(0).toUpperCase() === letter
                        )
                        .map((friend: TFriend) => (
                          <div key={friend.id} className="p-2 px-2">
                            <div className="flex items-center ">
                              <Checkbox
                                checked={selectedFriends.includes(friend.id)}
                                onCheckedChange={() =>
                                  onFriendSelect(friend.id)
                                }
                              />
                              <Avatar className="bg-gray-400 flex justify-center items-center ml-2 mr-5">
                                <AvatarImage
                                  className="w-8 h-8"
                                  src={
                                    friend.img || "src/asset/avatarDefault.svg"
                                  }
                                  alt="Avatar"
                                />
                              </Avatar>
                              <div className="w-full border-b pt-2 pb-3 border-gray-300">
                                <p className="font-medium">{friend.fullname}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
              </div>

              <div className="text-right">
                <p>{selectedFriends.length} thành viên đã được chọn</p>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang tạo nhóm..." : "Tạo nhóm"}
                </Button>
                {isError && <p style={{ color: "red" }}>Lỗi khi tạo nhóm</p>}
                {isSuccess && (
                  <p style={{ color: "green" }}>Nhóm đã được tạo thành công!</p>
                )}
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateGroupForm;
