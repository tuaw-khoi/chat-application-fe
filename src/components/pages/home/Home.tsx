import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";
import useAuthenStore from "@/store/authenStore";
import Navbar from "@/components/elements/home/layout/Navbar";
import Directory from "@/components/elements/home/layout/Directory";
import Chat from "@/components/elements/home/chat/Chat";
import Notification from "@/components/elements/home/chat/Notification";
import PhoneBookStore from "@/store/phoneBookStore";
import ManagerPhoneBook from "@/components/elements/phonebook/managerPhoneBook";
import Homepage from "@/components/elements/homepage/homepage";
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const { setAuthen, setIsAdmin } = useAuthenStore();
  const navigate = useNavigate();
  const { refreshLogin } = useAuth();
  const { currentPage } = PhoneBookStore();

  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Lấy thời gian hiện tại (giây)
      return decoded.exp < currentTime; // Kiểm tra token đã hết hạn
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Token không hợp lệ, coi như hết hạn
    }
  };

  const scheduleTokenRefresh = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - currentTime;

      const refreshTime = Math.max(timeUntilExpiry - 30, 0) * 1000;

      setTimeout(async () => {
        try {
          await refreshLogin();
          scheduleTokenRefresh();
        } catch (error) {
          console.error("Làm mới token thất bại:", error);
        }
      }, refreshTime);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  useEffect(() => {
    scheduleTokenRefresh();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");

      // Nếu không có token hoặc token đã hết hạn
      if (!token || isTokenExpired(token)) {
        try {
          // Gọi hàm refreshLogin để làm mới token
          const user = await refreshLogin();

          if (!user) {
            navigate("/"); // Nếu không có user, điều hướng về trang chính
            return;
          }

          // Lưu thông tin user mới vào Cookies
          Cookies.set("user", JSON.stringify(user), {
            secure: true,
            sameSite: "strict",
            expires: 1,
          });

          // Kiểm tra vai trò người dùng và điều hướng
          if (user.role === "ADMIN") {
            setIsAdmin(1);
            setAuthen(true);
            navigate("/admin");
          } else if (user.role === "USER") {
            setAuthen(true);
            setIsAdmin(0);
          }
        } catch (error) {
          console.error("Error refreshing login:", error);
          navigate("/"); // Nếu làm mới token thất bại, điều hướng về trang chính
        }
      }
    };

    fetchUserData();
  }, []);

  const mainContentRef = useRef<HTMLDivElement>(null);

  const renderContent = () => {
    if (currentPage === "phoneBook") return <ManagerPhoneBook />;
    if (currentPage === "home") return <Homepage />;
    return (
      <>
        <Notification />
        <Chat />
        <Directory />
      </>
    );
  };

  return (
    <div className={` ${currentPage === "home" ? " bg-gray-200 " : "null"}`}>
      <div ref={mainContentRef} className="flex overflow-y-auto">
        <Navbar mainContentRef={mainContentRef} />
        {renderContent()}
      </div>
    </div>
  );
};

export default Home;
