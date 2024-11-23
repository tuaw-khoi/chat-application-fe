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
import Profile from "../../profile/profile";
import { RefObject } from "react";
import { useNavigate } from "react-router-dom";
import focusPostStore from "@/store/focusPostStore";

const Navbar = ({
  mainContentRef,
}: {
  mainContentRef: RefObject<HTMLDivElement>;
}) => {
  const { setPage, currentPage } = PhoneBookStore();
  const { setFocusPost, setPost } = focusPostStore();
  const navigate = useNavigate();
  const { setRoom } = roomStore();

  const handleNavigate = () => {
    navigate("/profile", { state: { id: user.id } });
  };

  const handleNavigateHome = () => {
    navigate("/home");
  };
  const getUserFromCookies = () => {
    const user = Cookies.get("user");
    if (user) {
      try {
        return JSON.parse(user);
      } catch (error) {
        console.error("Error parsing user data from cookie", error);
        return null;
      }
    }
    return null;
  };

  // Sử dụng hàm
  const user = getUserFromCookies();
  const handleSetChat = () => {
    setPage("chat");
    setRoom(null);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSetHomepage = () => {
    setPage("home");
    setRoom(null);
    setFocusPost(false);
    setPost(null);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("refreshToken");
    setPage("home");
    navigate("/");
  };
  return (
    <div
      className={`flex flex-col   ${
        currentPage === "home"
          ? "w-64 pl-10 pt-10 bg-white ml-[5rem] rounded-2xl my-2 fixed h-[97.5dvh]"
          : "w-24 items-center bg-gray-300"
      }`}
    >
      <Avatar
        onClick={handleSetHomepage}
        className={`flex justify-center items-center cursor-pointer ${
          user?.img === "src/asset/avatarDefault.svg" ? "bg-gray-400" : ""
        } w-10 h-10 ${currentPage !== "home" ? "mt-5" : null}`}
      >
        <AvatarImage
          className="w-full h-full rounded-full"
          src={user?.img || "/src/asset/avatarDefault.svg"}
          alt="User Avatar"
        />
      </Avatar>
      <div
        className={`${
          currentPage === "home"
            ? "flex flex-col space-y-5 mt-16"
            : "flex flex-col space-y-4 mt-5"
        }`}
      >
        <img
          onClick={handleSetHomepage}
          className="w-12 cursor-pointer"
          src="src/asset/home.svg"
          alt="homepage icon"
        />
        <img
          onClick={handleSetChat}
          className="w-12 cursor-pointer"
          src="src/asset/chaticon.svg"
          alt="chat icon"
        />
      </div>
      <div className="flex flex-col h-full justify-between">
        <div
          className={`flex-grow space-y-4 mt-4 ${
            currentPage === "home" ? " space-y-5 mt-5" : null
          }`}
        >
          <AddFriend />
          <PhoneBook />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {" "}
            <img
              className="w-12 cursor-pointer mb-7"
              src="src/asset/setting.svg"
              alt=""
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-20">
            <DropdownMenuLabel>{user?.fullname}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Profile />
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              Đăng Xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
