import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";
import useAuthenStore from "@/store/authenStore";
import AdminManager from "@/components/elements/manager/Admin";

const Admin = () => {
  const { setAuthen, setIsAdmin } = useAuthenStore();
  const navigate = useNavigate();
  const { refreshLogin } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");

      if (!token) {
        navigate("/"); // Nếu không có token, điều hướng về trang chính (trang đăng nhập)
        return;
      }

      try {
        const user = await refreshLogin();
        if (!user) {
          navigate("/"); // Nếu không thể refresh login, điều hướng về trang chính
          return;
        }

        Cookies.set("user", JSON.stringify(user), {
          secure: true,
          sameSite: "strict",
          expires: 1,
        });

        if (user.role === "ADMIN") {
          setAuthen(true);
          setIsAdmin(1);
        } else if (user.role === "USER") {
          setAuthen(true);
          navigate("/home");
          return;
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error refreshing login:", error);
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate, refreshLogin, setAuthen, setIsAdmin]);

  return <AdminManager />;
};

export default Admin;
