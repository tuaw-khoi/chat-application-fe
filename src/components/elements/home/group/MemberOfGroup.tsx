import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import useRoom from "@/hooks/useRoom";
import { useNavigate } from "react-router-dom";

export type Member = {
  id: number;
  isAdmin: boolean;
  user: {
    id: string;
    fullname: string;
    img: string | null;
    email: string;
  };
};

type MemberOfGroupProps = {
  members: Member[];
  roomId: string;
};

const MemberOfGroup = ({ members, roomId }: MemberOfGroupProps) => {
  const navigate = useNavigate();

  const handleNavigate = (userId: string) => {
    navigate(`/profile/${userId}`);
  };
  const [memberList, setMemberList] = useState(members);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { removeUserFromRoomByAdmin, changeAdminStatus } = useRoom();
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const currentUserId = storedUser?.id;

  // Handle removing a member
  const handleRemoveMember = async () => {
    if (selectedMember) {
      try {
        await removeUserFromRoomByAdmin(
          roomId,
          currentUserId,
          selectedMember.user.id
        );
        setSelectedMember(null);
        setOpenDialog(false);
      } catch (error) {
        console.error("Failed to remove member:", error);
      }
    }
  };

  // Handle toggling admin status
  const toggleAdminRole = (member: Member) => {
    changeAdminStatus(roomId, currentUserId, member.user.id, !member.isAdmin);
  };

  useEffect(() => {
    // Cập nhật lại danh sách khi thành viên thay đổi
    setMemberList(members);
  }, [members]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Quản lý thành viên</h3>
      <div className="overflow-y-auto max-h-96 mb-4">
        {memberList.length > 0 ? (
          memberList.map((member) => (
            <div key={member.user.id} className="flex items-center py-2 px-2">
              <Avatar
                onClick={() => handleNavigate(member.user.id)}
                className="bg-gray-400 flex justify-center items-center ml-2 mr-5 cursor-pointer"
              >
                <AvatarImage
                  className="w-8 h-8"
                  src={member.user.img || "src/asset/avatarDefault.svg"}
                  alt="Avatar"
                />
              </Avatar>
              <div className="border-b flex-grow pt-2 pb-3 border-gray-300">
                <p
                  onClick={() => handleNavigate(member.user.id)}
                  className="font-medium cursor-pointer hover:underline"
                >
                  {member.user.fullname}
                </p>
                {member.isAdmin ? (
                  <span className="text-xs text-blue-500">Admin</span>
                ) : (
                  <span className="text-xs text-gray-500">Thành viên</span>
                )}
              </div>

              {member.user.id !== currentUserId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-auto">
                      <Ellipsis className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {/* Toggle quyền admin */}
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => toggleAdminRole(member)}
                    >
                      {member.isAdmin
                        ? "Chuyển về User thường"
                        : "Chuyển thành Admin"}
                    </DropdownMenuItem>

                    {/* Mở dialog xóa thành viên */}
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedMember(member); // Set the selected member for deletion
                        setOpenDialog(true);
                      }}
                    >
                      Xóa khỏi group
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))
        ) : (
          <p>Không có thành viên nào trong group</p>
        )}
      </div>

      {/* Dialog xác nhận xóa */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogTitle className="text-lg font-semibold">
            Xóa thành viên
          </DialogTitle>
          <DialogDescription className="mb-4">
            Bạn có chắc chắn muốn xóa thành viên này khỏi group không?
          </DialogDescription>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleRemoveMember}>
              Xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberOfGroup;
