// ChatIO.tsx
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRoomStore from "@/store/roomStore";
import useChat from "@/hooks/useChat";
import useMessageStore from "@/store/messageStore";
import Cookies from "js-cookie";

const ChatIO = () => {
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const userId = storedUser?.id;
  const { rooms } = useRoomStore();
  const currentRoomId = rooms.length > 0 ? rooms[0].roomId : 2;

  const { messages } = useMessageStore();
  const { isLoading, error, sendMessage } = useChat(currentRoomId, userId);
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (data: any) => {
    sendMessage(data.message);
    reset();
  };

  if (isLoading) return <div>Loading messages...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 bg-gray-100  flex flex-col h-screen">
      <div className="flex-grow  overflow-y-auto mb-4 pr-2 bg-white shadow-lg rounded">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 p-2 max-w-xs rounded shadow ${
                message.senderId === userId
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-300 text-black mr-auto"
              }`}
            >
              {message.content}
            </div>
          ))
        ) : (
          <div>No messages yet.</div>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center space-x-2"
      >
        <Input
          type="text"
          placeholder="Aa"
          {...register("message")}
          className="flex-grow"
        />
        <Button type="submit">Gửi</Button>
      </form>
    </div>
  );
};

export default ChatIO;
