import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";
import useAuthenStore from "@/store/authenStore";
import Navbar from "@/components/elements/home/layout/Navbar";
import Directory from "@/components/elements/home/layout/Directory";
import Chat from "@/components/elements/home/chat/Chat";
import Notification from "@/components/elements/home/chat/Notification";
import { useState } from "react";
import io from "socket.io-client";

const Home = () => {
  // const { setAuthen, setIsAdmin } = useAuthenStore();
  // const navigate = useNavigate();
  // const { refreshLogin } = useAuth();

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const token = Cookies.get("token");

  //     if (!token) {
  //       navigate("/");
  //       return;
  //     }

  //     try {
  //       const user = await refreshLogin();
  //       if (!user) {
  //         navigate("/");
  //         return;
  //       }

  //       Cookies.set("user", JSON.stringify(user), {
  //         secure: true,
  //         sameSite: "strict",
  //         expires: 1,
  //       });

  //       // Kiểm tra vai trò người dùng và điều hướng
  //       if (user.role === "ADMIN") {
  //         setIsAdmin(1);
  //         setAuthen(true);
  //         navigate("/admin");
  //       } else if (user.role === "USER") {
  //         setAuthen(true);
  //         setIsAdmin(0);
  //         return;
  //       }
  //     } catch (error) {
  //       console.error("Error refreshing login:", error);
  //       navigate("/");
  //     }
  //   };

  //   fetchUserData();
  // }, [navigate, refreshLogin, setAuthen, setIsAdmin]);

  // const roomId = "2"; // ID của phòng chat
  // const socket = io("http://localhost:3002"); // URL của server Socket.io

  // useEffect(() => {
  //   // Kết nối và tham gia phòng
  //   socket.emit("joinRoom", roomId);

  //   // Lắng nghe sự kiện 'newMessage'
  //   socket.on("newMessage", (message) => {
  //     console.log("New message received:", message);
  //   });

  //   // Cleanup khi component unmount
  //   return () => {
  //     socket.off("newMessage");
  //     socket.emit("leaveRoom", roomId);
  //   };
  // }, []);

  return (
    <div>
      <div className="flex h-screen ">
        <Navbar />
        <Notification />
        <Chat />
        <Directory />
      </div>
    </div>
  );
};

export default Home;
