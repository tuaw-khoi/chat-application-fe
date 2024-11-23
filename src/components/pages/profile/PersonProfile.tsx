import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";
import useAuthenStore from "@/store/authenStore";
import { jwtDecode } from "jwt-decode";
import PersonInfor from "./PersonInfor";
import PersonListPost from "./PersonListPost";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/ui/button";

const PersonProfile = () => {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : "";
  const { userId } = useParams();
  const { getUserInfo } = useUser();
  const userInfo = userId ? userId : user.id;
  const data = getUserInfo(userInfo);
  const personInfo = data.data;
  const { setAuthen, setIsAdmin } = useAuthenStore();
  const navigate = useNavigate();
  const { refreshLogin } = useAuth();

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
          navigate("/");
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="bg-gray-200 flex items-center justify-center">
      <div className=" left-0 p-6 top-0 fixed">
        <Button
          className="bg-white hover:bg-gray-400"
          onClick={() => navigate("/home")}
        >
          <img
            className="w-8 h-8"
            src="https://res.cloudinary.com/dfua5nwki/image/upload/v1732393861/chat-app/sk3yplzggrz2hu5girew.svg"
            alt="back"
          />
        </Button>
      </div>
      <div className="w-full max-w-[60%]">
        <div className="bg-white rounded-lg shadow-md mb-4 p-6">
          <PersonInfor personInfor={personInfo} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-3">
          <PersonListPost userId={userInfo} />
        </div>
      </div>
    </div>
  );
};

export default PersonProfile;
