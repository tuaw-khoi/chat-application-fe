import { useState } from "react";
import FriendList from "./FriendList ";
import ChatHeader from "../home/chat/ChatHeader";
import ChatIO from "../home/chat/ChatIO";
import roomStore from "@/store/roomStore";
import GroupList from "./GroupList ";
import FriendRequests from "./FriendRequests";
import useChatStore from "@/store/chatStore";

const ManagerPhoneBook = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const { roomIsChoiced, setRoom } = roomStore();
  const { chatIsChoiced, setChat } = useChatStore();

  const handleTabChange = (tab: string) => {
    setRoom(null);
    setChat(null);
    setActiveTab(tab);
  };

  // Kiểm tra một trong hai điều kiện roomIsChoiced hoặc chatIsChoiced
  const isChatActive = roomIsChoiced || chatIsChoiced;

  return (
    <>
      <div className="w-1/5">
        <h1 className="py-3 ml-2">Quản lí danh bạ</h1>
        <div>
          <button
            className={`block w-full text-left p-2 mb-2 ${
              activeTab === "friends" ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={() => handleTabChange("friends")}
          >
            Danh sách bạn
          </button>
          <button
            className={`block w-full text-left p-2 mb-2 ${
              activeTab === "groups" ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={() => handleTabChange("groups")}
          >
            Danh sách nhóm
          </button>
          <button
            className={`block w-full text-left p-2 mb-2 ${
              activeTab === "requests" ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={() => handleTabChange("requests")}
          >
            Lời mời kết bạn
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white h-dvh">
        {/* Kiểm tra nếu tab là 'friends' */}
        {activeTab === "friends" && (
          <>
            {isChatActive ? (
              <>
                <ChatHeader />
                <ChatIO />
              </>
            ) : (
              <FriendList />
            )}
          </>
        )}

        {/* Kiểm tra nếu tab là 'groups' */}
        {activeTab === "groups" && (
          <>
            {roomIsChoiced ? (
              <>
                <ChatHeader />
                <ChatIO />
              </>
            ) : (
              <GroupList />
            )}
          </>
        )}

        {/* Kiểm tra nếu tab là 'requests' */}
        {activeTab === "requests" && <FriendRequests />}
      </div>
    </>
  );
};

export default ManagerPhoneBook;
