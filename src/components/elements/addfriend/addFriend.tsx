import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SearchNewFriend from "./searchNewFriend";
import searchFoundStore from "@/store/userFoundStore";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import NewUserInfor from "./newUserInfor";
import useClickOutside from "@/hooks/useClickOutside";
const AddFriend = () => {
  const { searchUser, setSearchUser } = searchFoundStore();
  const { toast } = useToast();
  const ref = useClickOutside("addnewfriend");

  // Tạo state để quản lý hiển thị dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Hàm để mở dialog
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // Hàm để đóng dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (searchUser === null) {
      return;
    }
    if (typeof searchUser === "string" && searchUser === "usernotfound") {
      toast({
        title: "Không tìm thấy người dùng",
        description: "Vui lòng kiểm tra lại thông tin.",
        duration: 2000,
        className: "bg-gray-900 bg-opacity-40 text-white ",
      });
      setSearchUser(null);
    }
  }, [searchUser, toast]);

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div>
            <img
              className="w-12 cursor-pointer"
              src="src/asset/addFriend.svg"
              alt=""
              onClick={openDialog} // Mở dialog khi nhấn vào hình
            />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] min-h-[200px]" ref={ref}>
          <DialogHeader>
            {searchUser ? (
              <div>
                <NewUserInfor closeDialog={closeDialog} />{" "}
                <DialogDescription></DialogDescription>
              </div>
            ) : (
              <div>
                <DialogTitle>Thêm bạn</DialogTitle>
                <Toaster />
                <SearchNewFriend />
                <DialogDescription></DialogDescription>
              </div>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddFriend;
