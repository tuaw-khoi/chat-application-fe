import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";
import useAuthenStore from "@/store/authenStore";
import AdminManager from "@/components/elements/manager/Admin";
import { jwtDecode } from "jwt-decode";

const Admin = () => {
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
    scheduleTokenRefresh(); // Bắt đầu làm mới token khi trang Admin được tải
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
            setAuthen(true);
            setIsAdmin(1);
            navigate("/admin"); // Điều hướng đến trang admin nếu user là admin
          } else if (user.role === "USER") {
            setAuthen(true);
            setIsAdmin(0);
            navigate("/home"); // Điều hướng đến trang home nếu user là người dùng
          }
        } catch (error) {
          console.error("Error refreshing login:", error);
          navigate("/"); // Nếu làm mới token thất bại, điều hướng về trang chính
        }
      }
    };

    fetchUserData();
  }, [navigate, refreshLogin, setAuthen, setIsAdmin]);

  return <AdminManager />;
};

export default Admin;
