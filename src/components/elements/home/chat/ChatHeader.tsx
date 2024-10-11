import useChatStore from "@/store/chatStore";
import roomStore from "@/store/roomStore";

const ChatHeader = () => {
  const { roomIsChoiced } = roomStore();
  const { chatIsChoiced } = useChatStore();
  return (
    <div className="h-[5vh]">
      {chatIsChoiced !== null
        ? chatIsChoiced?.fullname
        : roomIsChoiced?.roomName}
    </div>
  );
};

export default ChatHeader;
