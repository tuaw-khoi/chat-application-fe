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

const Home = () => {
  const { setAuthen, setIsAdmin } = useAuthenStore();
  const navigate = useNavigate();
  const { refreshLogin } = useAuth();
  const { currentPage } = PhoneBookStore();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const user = await refreshLogin();
        if (!user) {
          navigate("/");
          return;
        }

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
          return;
        }
      } catch (error) {
        console.error("Error refreshing login:", error);
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate, refreshLogin, setAuthen, setIsAdmin]);

  const mainContentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={` ${currentPage === "home" ? " bg-gray-200 " : "null"}`}>
      <div ref={mainContentRef} className="flex overflow-y-auto ">
        <Navbar mainContentRef={mainContentRef} />
        {currentPage === "phoneBook" ? (
          <ManagerPhoneBook />
        ) : currentPage === "home" ? (
          <Homepage />
        ) : (
          <>
            <Notification />
            <Chat />
            <Directory />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
