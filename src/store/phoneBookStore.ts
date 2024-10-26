import { create } from "zustand";

interface phoneBookStore {
  isPhoneBook: boolean;
  setPhoneBook: (PhoneBook: boolean) => void;
}

const PhoneBookStore = create<phoneBookStore>((set) => ({
  isPhoneBook: false,
  setPhoneBook: (PhoneBook) => set({ isPhoneBook: PhoneBook }),
}));

export default PhoneBookStore;
