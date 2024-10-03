// store/useGlobalState.ts
import create from "zustand";
import { Room } from "./roomStore";

type user = {
  id: string;
  fullname: string;
  img: string;
};

export type searchFriend = {
  message: string;
  user: user;
  room?: Room;
} | null;

interface searchFound {
  searchUser: searchFriend;
  setSearchUser: (user: searchFriend) => void;
}

const searchFoundStore = create<searchFound>((set) => ({
  searchUser: null,
  setSearchUser: (user) => set({ searchUser: user }),
}));

export default searchFoundStore;
