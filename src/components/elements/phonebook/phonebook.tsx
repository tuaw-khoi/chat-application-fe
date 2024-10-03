import PhoneBookStore from "@/store/phoneBookStore";
import roomStore from "@/store/roomStore";

const PhoneBook = () => {
  const { setPhoneBook } = PhoneBookStore();
  const { setRoom } = roomStore();
  const handleSetPhoneBook = () => {
    setRoom(null);
    setPhoneBook(true);
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
