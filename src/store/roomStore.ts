import create from "zustand";

// Định nghĩa kiểu dữ liệu cho phòng chat
export type Room = {
  roomName: string;
  roomId: number;
  roomImg: string;
  latestMessage?: string;
};

type RoomModalType = {
  roomIsChoiced: Room | null;
};

type RoomActionType = {
  setRoom: (rooms: Room | null) => void;
};

type RoomState = RoomModalType & RoomActionType;

// Tạo store sử dụng zustand
const useRoomStore = create<RoomState>((set) => ({
  roomIsChoiced: null,
  setRoom: (room: Room | null | undefined) => set({ roomIsChoiced: room }),
}));

export default useRoomStore;
