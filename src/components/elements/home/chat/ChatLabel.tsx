import React from "react";
import messageStore from "@/store/messageStore";
import focusStore from "@/store/focusStore";

interface ChatLabelProps {
  friendsResult:
    | { id: string; fullname: string; img: string }[]
    | null
    | string;
}

const ChatLabel = ({ friendsResult }: ChatLabelProps) => {
  const { lastedMessage } = messageStore();
  const { isFocused } = focusStore();
  return (
    <div>
      {isFocused ? (
        friendsResult && Array.isArray(friendsResult) ? (
          friendsResult.length > 0 ? (
            friendsResult.map((friend) => (
              <div key={friend.id} className="p-2 border-b">
                {friend.fullname}
              </div>
            ))
          ) : (
            <div>No friends found</div>
          )
        ) : (
          ""
        )
      ) : (
        // Hiển thị đoạn chat khi input không được focus
        <div>Lasted message: {lastedMessage}</div>
      )}
    </div>
  );
};

export default ChatLabel;
