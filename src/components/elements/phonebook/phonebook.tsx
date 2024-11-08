import useChatStore from "@/store/chatStore";
import PhoneBookStore from "@/store/phoneBookStore";
import roomStore from "@/store/roomStore";

const PhoneBook = () => {
  const { setPage } = PhoneBookStore();
  const { setRoom } = roomStore();
  const { setChat } = useChatStore();
  const handleSetPhoneBook = () => {
    setRoom(null);
    setChat(null);
    setPage("phoneBook");
  };
  return (
    <div>
      <img
        onClick={handleSetPhoneBook}
        className="w-12 cursor-pointer"
        src="src/asset/phoneBook.svg"
        alt=""
      />
    </div>
  );
};

export default PhoneBook;
