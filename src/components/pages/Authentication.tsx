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
        console.log(user);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* <Google/> */}
      {/* <Login/> */}
      <div className="bg-black px-5 py-7">
        <TabAuthen />
      </div>
    </div>
  );
};
// import { useEffect, useState } from "react";
// import io from "socket.io-client";
// const Authentication = () => {
//   const [messages, setMessages] = useState([]);
//   const [content, setContent] = useState("");
//   const roomId = "2";
//   const socket = io("http://localhost:3002");

//   useEffect(() => {
//     // Kết nối và tham gia phòng
//     socket.emit("joinRoom", roomId);

//     // Lắng nghe sự kiện 'newMessage'
//     socket.on("newMessage", (message) => {
//       console.log("New message received:", message);
//       // setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     // Cleanup khi component unmount
//     return () => {
//       socket.off("newMessage");
//       socket.emit("leaveRoom", roomId);
//     };
//   }, [roomId]);
//   {
//     messages.map(
//       (message, index) => console.log(message)
//       // <div key={index}>{message.content}</div>
//     );
//   }
//   const sendMessage = () => {
//     const senderId = "your-user-id"; // ID của người gửi
//     const reciveId = "recipient-user-id"; // ID của người nhận (nếu cần)

//     socket.emit("sendMessage", { content, roomId, senderId, reciveId });
//     setContent(""); // Xóa nội dung sau khi gửi tin nhắn
//   };

//   return (
//     <div>
//       <h1>Chat</h1>
//       <div></div>
//       <input
//         type="text"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// };

export default Authentication;
