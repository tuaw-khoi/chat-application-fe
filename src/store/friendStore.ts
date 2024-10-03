import create from "zustand";

// Định nghĩa kiểu dữ liệu cho tin nhắn
export interface FriendResult {
  id: string;
  fullname: string;
  img: string;
  roomId?: number;
}

// Định nghĩa kiểu dữ liệu cho store
interface FriendStore {
  friendsResult: FriendResult[] | string;
  setFriendsResult: (friends: FriendResult[] | string) => void;
}

// Tạo store với Zustand
const useFriendStore = create<FriendStore>((set) => ({
  friendsResult: [],
  setFriendsResult: (friends) => set({ friendsResult: friends }),
}));

export default useFriendStore;
