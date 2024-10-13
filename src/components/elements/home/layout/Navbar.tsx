import PhoneBookStore from "@/store/phoneBookStore";
import AddFriend from "../../addfriend/addFriend";
import PhoneBook from "../../phonebook/phonebook";
import roomStore from "@/store/roomStore";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { setPhoneBook } = PhoneBookStore();
  const { setRoom } = roomStore();
  const getUserFromCookies = () => {
    const user = Cookies.get("user");
    if (user) {
      try {
        return JSON.parse(user); // Chuyển đổi chuỗi JSON về đối tượng
      } catch (error) {
        console.error("Error parsing user data from cookie", error);
        return null;
      }
    }
    return null;
  };

  // Sử dụng hàm
  const user = getUserFromCookies();
  const handleSetPhoneBook = () => {
    setPhoneBook(false);
    setRoom(null);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
  };
  return (
    <div className="w-1/12 flex flex-col items-center">
      <Avatar className="bg-gray-400 flex justify-center items-center my-2">
        <AvatarImage
          className="w-8 h-8"
          src={user?.img || "src/asset/avatarDefault.svg"}
          alt="Room Avatar"
        />
      </Avatar>
      <div>
        <img
          onClick={handleSetPhoneBook}
          className="w-12 cursor-pointer"
          src="src/asset/chaticon.svg"
          alt="Chat icon"
        />
      </div>
      <div className="flex flex-col h-full justify-between">
        <div className="flex-grow">
          <AddFriend />
          <PhoneBook />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {" "}
            <img
              className="w-12 cursor-pointer mb-5"
              src="src/asset/setting.svg"
              alt=""
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent  className="ml-20">
            <DropdownMenuLabel>{user?.fullname}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Đăng Xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
