import useChatStore from "@/store/chatStore";
import roomStore from "@/store/roomStore";

const ChatHeader = () => {
  const { roomIsChoiced } = roomStore();
  const { chatIsChoiced } = useChatStore();
  return (
    <div className="h-[6vh] text-xl font-bold pl-5 bg-gray-200 py-1 border-b border-gray-200 shadow-2xl">
      {chatIsChoiced !== null
        ? chatIsChoiced?.fullname
        : roomIsChoiced?.roomName}
    </div>
  );
};

export default ChatHeader;
