import React, { useState } from "react";
import useFriendStore from "@/store/friendStore";
import SearchChat from "./SearchChat";
import ChatLabel from "./ChatLabel";
import useClickOutside from "@/hooks/useClickOutside";
import focusStore from "@/store/focusStore";

const Notification = () => {
  const { friendsResult } = useFriendStore();
  const ref = useClickOutside("notification");
  const { isFocused, setFocus } = focusStore();
  const handleBlur = () => {
    setFocus(false);
  };

  return (
    <div className="w-1/5" ref={ref}>
      <div className=" h-[13dvh]">
        <h2 className="py-3">Đoạn chat</h2>
        <div className="flex items-center ">
          {isFocused ? (
            <div
              onClick={handleBlur}
              className=" rounded-full bg-none hover:bg-gray-400 cursor-pointer p-2 mr-2"
            >
              <img
                width={20}
                height={20}
                src="src/asset/backMessage.svg"
                alt=""
              />
            </div>
          ) : (
            ""
          )}
          <SearchChat />
        </div>
      </div>
      <div className=" h-[87dvh]  overflow-y-auto">
        <ChatLabel friendsResult={friendsResult} />
      </div>
    </div>
  );
};

export default Notification;
