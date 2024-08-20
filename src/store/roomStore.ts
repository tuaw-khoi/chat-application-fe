import create from "zustand";

// Định nghĩa kiểu dữ liệu cho phòng chat
export type Room = {
  roomName: string;
  roomId: number;
  latestMessage: string;
};

type RoomModalType = {
  rooms: Room[];
};

type RoomActionType = {
  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  updateRoom: (roomId: number, updatedRoom: Partial<Room>) => void;
  removeRoom: (roomId: number) => void;
};


type RoomState = RoomModalType & RoomActionType;

// Tạo store sử dụng zustand
const useRoomStore = create<RoomState>((set) => ({
  rooms: [],

  setRooms: (rooms: Room[]) => set({ rooms }),

  addRoom: (room: Room) =>
    set((state) => ({
      rooms: [...state.rooms, room],
    })),

  updateRoom: (roomId: number, updatedRoom: Partial<Room>) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.roomId === roomId ? { ...room, ...updatedRoom } : room
      ),
    })),

  removeRoom: (roomId: number) =>
    set((state) => ({
      rooms: state.rooms.filter((room) => room.roomId !== roomId),
    })),
}));

export default useRoomStore;
