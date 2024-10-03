import { useState } from "react";
import FriendList from "./FriendList ";
import ChatHeader from "../home/chat/ChatHeader";
import ChatIO from "../home/chat/ChatIO";
import roomStore from "@/store/roomStore";

const GroupList = () => (
  <div>
    <h2>Danh sách nhóm</h2>
    {/* Hiển thị danh sách nhóm */}
  </div>
);

const FriendRequests = () => (
  <div>
    <h2>Danh sách lời mời kết bạn</h2>
    {/* Hiển thị lời mời kết bạn */}
  </div>
);

const ManagerPhoneBook = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const { roomIsChoiced, setRoom } = roomStore();
  const handleTabChange = (tab: string) => {
    setRoom(null);
    setActiveTab(tab);
  };

  return (
    <>
      <div className="w-1/5 ">
        <h1 className="py-3">Quản lí danh bạ</h1>
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

      <div className="flex-1 bg-white  h-dvh">
        {activeTab === "friends" &&
          (roomIsChoiced ? (
            <>
              <ChatHeader />
              <ChatIO />
            </>
          ) : (
            <FriendList />
          ))}
        {activeTab === "groups" && <GroupList />}
        {activeTab === "requests" && <FriendRequests />}
      </div>
    </>
  );
};

export default ManagerPhoneBook;
