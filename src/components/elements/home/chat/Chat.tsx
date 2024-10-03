import ChatIO from "./ChatIO";
import ChatHeader from "./ChatHeader";

const Chat = () => {
  return (
    <div className="w-2/5">
      <div>
        <ChatHeader />
        <ChatIO />
      </div>
    </div>
  );
};

export default Chat;
