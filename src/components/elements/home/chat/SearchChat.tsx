import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useFriend from "@/hooks/useFriend";
import focusStore from "@/store/focusStore";
import blurStore from "@/store/blurStore";
import roomStore from "@/store/roomStore";

interface SearchFormInput {
  query: string;
}
type searchChat = {
  reset: () => void;
};

const SearchChat = () => {
  const { searchFriends } = useFriend();
  const { isFocused, setFocus } = focusStore();
  const { isBlur, setBlur } = blurStore();
  const { setRoom } = roomStore();
  const { register, handleSubmit, setValue, getValues } =
    useForm<SearchFormInput>();
  const query = getValues("query");
  // Hàm xử lý khi submit form
  useEffect(() => {
    searchFriends(query);
  }, [query]);
  useEffect(() => {
    if (isBlur) {
      setValue("query", "");
      setBlur(false);
    }
  }, [isBlur]);
  useEffect(() => {
    if (isFocused === false) {
      setValue("query", "");
    }
    if (isFocused === true) {
      setRoom(null);
    }
  }, [isFocused]);
  const onSubmit = (data: SearchFormInput) => {
    const { query } = data;
    searchFriends(query);
  };
  const handleFocus = () => {
    setFocus(true);
  };
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          {/* Input và icon tìm kiếm */}
          <div className="relative">
            <img
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
              src="src/asset/searchicon.svg"
              alt="search icon"
              width={16}
              height={16}
            />
            <Input
              {...register("query")} // Sử dụng react-hook-form để theo dõi input
              onFocus={handleFocus} // Gọi hàm khi input được focus
              type="text"
              placeholder="Tìm kiếm đoạn chat"
              className="pl-8"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchChat;
