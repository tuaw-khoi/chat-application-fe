import ChatIO from "./ChatIO";
import NotifiHeader from "./ChatHeader";

const Chat = () => {
  return (
    <div className="w-2/5">
     <div>
     <NotifiHeader />
     <ChatIO/>
     </div>
    </div>
  );
};

export default Chat;
