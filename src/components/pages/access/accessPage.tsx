import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";
import useAuthenStore from "@/store/authenStore";

const AccessPage = ({ element }: { element: JSX.Element }) => {
  const { setAuthen, setIsAdmin, authen, isAdmin } = useAuthenStore();
  const navigate = useNavigate();
  const { refreshLogin } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");
      if (!token) {
        return;
      }
      try {
        const user = await refreshLogin();
        Cookies.set("user", JSON.stringify(user), {
          secure: true,
          sameSite: "strict",
          expires: 1,
        });

        if (user.role === "ADMIN") {
          setIsAdmin(1);
          navigate("/admin");
        } else if (user.role === "USER") {
          setAuthen(true);
          navigate("/home");
        }
      } catch (error) {
        console.error("Error refreshing login:", error);
      }
    };

    fetchUserData();
  }, [navigate, refreshLogin, authen, isAdmin]);

  return element;
};

export default AccessPage;
