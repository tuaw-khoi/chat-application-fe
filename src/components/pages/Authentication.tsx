import TabAuthen from "../elements/authen/tabAuthen";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";
import useAuthenStore from "@/store/authenStore";

const Authentication = () => {
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
          setAuthen(true);
          setIsAdmin(1);
          navigate("/admin");
        } else if (user.role === "USER") {
          setAuthen(true);
          setIsAdmin(0);
          navigate("/home");
        }
      } catch (error) {
        console.error("Error refreshing login:", error);
      }
    };

    fetchUserData();
  }, [authen, isAdmin]);
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
