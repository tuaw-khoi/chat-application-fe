import TabAuthen from "../elements/authen/tabAuthen";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";
import useAuthenStore from "@/store/authenStore";
import { jwtDecode } from "jwt-decode";

const Authentication = () => {
  const { setAuthen, setIsAdmin } = useAuthenStore();
  const navigate = useNavigate();
  const { refreshLogin } = useAuth();
  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token); // Giải mã token
      const currentTime = Date.now() / 1000; // Thời gian hiện tại (giây)
      return decoded.exp < currentTime; // So sánh thời gian hết hạn
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Nếu token không hợp lệ, coi như đã hết hạn
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");

      if (!token || isTokenExpired(token)) {
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
  return (
    <div
      style={{
        backgroundImage: "url('/src/asset/bgweb.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="flex items-center justify-center min-h-screen"
    >
      <div className="bg-orange-300 rounded-lg px-5 py-7">
        <TabAuthen />
      </div>
    </div>
  );
};

export default Authentication;
