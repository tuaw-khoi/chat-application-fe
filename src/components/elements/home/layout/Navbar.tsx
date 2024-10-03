import PhoneBookStore from "@/store/phoneBookStore";
import AddFriend from "../../addfriend/addFriend";
import PhoneBook from "../../phonebook/phonebook";
import roomStore from "@/store/roomStore";
const Navbar = () => {
  const { setPhoneBook } = PhoneBookStore();
  const { roomIsChoiced, setRoom } = roomStore();
  const handleSetPhoneBook = () => {
    setPhoneBook(false);
    setRoom(null);
  };
  return (
    <div className="w-1/12 flex flex-col items-center">
      <div className="mb-4">Q</div>
      <div>
        <img
          onClick={handleSetPhoneBook}
          className="w-12 cursor-pointer"
          src="src/asset/chaticon.svg"
          alt="Chat icon"
        />
      </div>
      <div className="flex flex-col">
        <AddFriend />
        <PhoneBook />
      </div>
    </div>
  );
};

export default Navbar;
