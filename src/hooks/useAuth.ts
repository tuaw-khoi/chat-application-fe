import Cookies from "js-cookie";
import AxiosClient from "@/service/AxiosClient";
import { TUser, TUserLogin } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthenStore from "@/store/authenStore";
import { useNavigate } from "react-router-dom";
const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setIsAdmin, setAuthen } = useAuthenStore();

  const login = useMutation({
    mutationFn: async (user: TUserLogin) => {
      const response = await AxiosClient.post("/auth/login", user);
      return response.data;
    },

    onSuccess: async (data) => {
      const token = data.accessToken;
      const refreshToken = data.refreshToken;
      const user = data.userReturn;
      Cookies.set("token", token, {
        secure: true,
        sameSite: "strict",
        expires: 1,
      });
      Cookies.set("refreshToken", refreshToken, {
        secure: true,
        sameSite: "strict",
        expires: 7,
      });
      Cookies.set("user", JSON.stringify(user), {
        secure: true,
        sameSite: "strict",
        expires: 1,
      });
      if (user?.role == "ADMIN") {
        setIsAdmin(1);
        setAuthen(true);
        navigate("/admin");
      } else {
        setIsAdmin(0);
        setAuthen(true);
        navigate("/home");
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
    },
  });

  const register = useMutation({
    mutationFn: async (user: TUser) => {
      const { fullname, password, email, username } = user;
      const newUser = { fullname, password, email, username };
      const response = await AxiosClient.post("/auth/register", newUser);
      return response.data;
    },

    onSuccess: () => {},

    onError: (error: any) => {
      console.error("Registration error:", error);
    },
  });

  const loginWithGoogle = useMutation({
    mutationFn: async () => {
      const response = await AxiosClient.post("/auth/firebase-login");
      return response.data;
    },

    onSuccess: async (data) => {
      const token = data.accessToken;
      const refreshToken = data.refreshToken;
      const user = data.userReturn;
      Cookies.set("token", token, {
        secure: true,
        sameSite: "strict",
        expires: 1,
      });
      Cookies.set("refreshToken", refreshToken, {
        secure: true,
        sameSite: "strict",
        expires: 7,
      });
      Cookies.set("user", JSON.stringify(user), {
        secure: true,
        sameSite: "strict",
        expires: 1,
      });
      if (user?.role == "ADMIN") {
        setIsAdmin(1);
        setAuthen(true);
        navigate("/admin");
      } else {
        setIsAdmin(0);
        setAuthen(true);
        navigate("/home");
      }
    },

    onError: (error: any) => {
      console.error("Google Login error:", error);
    },
  });

  const refreshLogin = async () => {
    try {
      const response = await AxiosClient.post(`auth/refresh-login`);
      return response?.data?.userReturn;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  return {
    login,
    register,
    loginWithGoogle,
    refreshLogin,
  };
};

export default useAuth;
