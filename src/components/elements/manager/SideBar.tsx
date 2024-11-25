import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Profile from "../profile/profile";
import Cookies from "js-cookie";
import PhoneBookStore from "@/store/phoneBookStore";
import { useNavigate } from "react-router-dom";
import PageTypeManager from "@/store/managerStore";

const SideBar = () => {
  const { setPage } = PhoneBookStore();
  const navigate = useNavigate();
  const { setPageManager } = PageTypeManager();

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
  const user = getUserFromCookies();
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("refreshToken");
    setPage("home");
    navigate("/");
  };

  const handlePageChange = (pageType: "dashboard" | "user") => {
    setPageManager(pageType);
  };
  return (
    <div>
      <Sidebar>
        <SidebarHeader />
        <h2 className="ml-5 text-2xl text-black">Quản lý mạng xã hội</h2>
        <SidebarContent>
          <SidebarGroup />
          <SidebarMenuItem className="list-none w-full ">
            <SidebarMenuButton asChild>
              <div
                onClick={() => handlePageChange("dashboard")}
                className="py-8 text-black cursor-pointer"
              >
                <img src="" alt="" />
                <p>DashBoard</p>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="list-none w-full ">
            <SidebarMenuButton asChild>
              <div
                onClick={() => handlePageChange("user")}
                className="py-8 text-black cursor-pointer"
              >
                <img src="" alt="" />
                <p>Quản lý người dùng</p>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarGroup />
        </SidebarContent>
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-4">
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
        <SidebarFooter />
      </Sidebar>
    </div>
  );
};

export default SideBar;
